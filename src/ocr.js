import { BANKS, parseScreenshot, recognizeBank } from "./domain.js";

export const OCR_PARAMETERS = {
  tessedit_pageseg_mode: "3",
  preserve_interword_spaces: "1",
  user_defined_dpi: "300",
};
const ratePattern = /^(\d{1,3}(?:[.,]\d{1,2})?)\s*[%％]$/u;
const noise =
  /^(?:не забудьте|супер\s*к[еэ]шб[еэ]к|к[еэ]шб[еэ]к|cashback|категории|повышенн|выбрать|выберите|подключить|подробнее|готово|назад|лимит|баланс|сумма|доступно|доход|мои карты|главн|история|платежи|избранное|все операции|условия|выбрано|действует|докупить|подтвердить|на покупки|больше категорий|частые вопросы|с\s+\d|до\s+\d|ноябр|октябр|декабр|январ|феврал|март|апрел|май|июн|июл|август|сентябр|\+?\d+\s+категори)/iu;
const normalized = (value) =>
  value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/ё/gu, "е")
    .replace(/\s+/gu, " ")
    .trim();
const centerY = (box) => (box.y0 + box.y1) / 2;
const height = (box) => Math.max(1, box.y1 - box.y0);

function cleanName(text) {
  const name = text
    .replace(/^[\s•·|:;—–\-+?()[\]{}]+|[\s•·|:;—–\-+?()[\]{}]+$/gu, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (/^\d[\d\s.,]*\s*[рp₽]$/iu.test(name)) return null;
  if (
    name.length < 2 ||
    name.length > 100 ||
    !/\p{L}/u.test(name) ||
    noise.test(name) ||
    /[%％₽]|\d\s*(?:руб|балл)|\d{1,2}[:/]\d{2}/iu.test(name)
  )
    return null;
  return name;
}

export function getImageScale(width, imageHeight) {
  return Math.min(
    2,
    Math.max(1, 1200 / width),
    1600 / width,
    Math.sqrt(6_000_000 / (width * imageHeight)),
  );
}

export function preparePixels(image) {
  const { width, height: imageHeight, data } = image;
  const sample = [];
  for (
    let y = 0;
    y < imageHeight;
    y += Math.max(1, Math.floor(imageHeight / 60))
  ) {
    for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 40))) {
      const i = (y * width + x) * 4;
      sample.push(
        0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2],
      );
    }
  }
  sample.sort((a, b) => a - b);
  const inverted = sample[Math.floor(sample.length / 2)] < 128;
  const output = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2],
    );
    output[i] = output[i + 1] = output[i + 2] = inverted ? 255 - gray : gray;
    output[i + 3] = 255;
  }
  return { data: output, width, height: imageHeight, inverted };
}

export function findBankLabelRegion(image) {
  const { width, height: imageHeight, data } = image;
  let x0 = width,
    x1 = 0,
    y0 = imageHeight,
    y1 = 0,
    count = 0;
  const left = Math.floor(width * 0.2),
    right = Math.ceil(width * 0.8),
    bottom = Math.ceil(imageHeight * 0.065);
  for (let y = 0; y < bottom; y += 2)
    for (let x = left; x < right; x += 2) {
      const i = (y * width + x) * 4;
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      if (max > 150 && max - min > 80) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
        y0 = Math.min(y0, y);
        y1 = Math.max(y1, y);
        count++;
      }
    }
  if (
    count < 30 ||
    x1 - x0 < width * 0.08 ||
    (x1 - x0) / Math.max(1, y1 - y0) < 1.8
  )
    return null;
  const paddingX = Math.ceil((x1 - x0) * 0.25),
    paddingY = Math.ceil((y1 - y0) * 0.3);
  const x = Math.max(0, x0 - paddingX),
    y = Math.max(0, y0 - paddingY);
  return {
    left: x,
    top: y,
    width: Math.min(width, x1 + paddingX) - x,
    height: Math.min(imageHeight, y1 + paddingY) - y,
  };
}

function recognizedBank(text) {
  // The stylized Т-БАНК status pill can be read as Latin TBAHK.
  const corrected = text.replace(
    /(?<!\p{L})[tт][\s-]?[bбв][aа][hнn][kк](?!\p{L})/giu,
    "Т-Банк",
  );
  return recognizeBank(corrected);
}

function allLines(data) {
  return (data.blocks || [])
    .flatMap((block) =>
      (block.paragraphs || []).flatMap((paragraph) => paragraph.lines || []),
    )
    .filter((line) => line.bbox && Array.isArray(line.words))
    .sort((a, b) => a.bbox.y0 - b.bbox.y0 || a.bbox.x0 - b.bbox.x0);
}

export function parseOcrResult(
  data,
  { width = 1200, height: imageHeight = 2600, bankText = "" } = {},
) {
  const text = `${bankText ? `${bankText.trim()}\n` : ""}${data.text || ""}`;
  const lines = allLines(data);
  let bank = recognizedBank(bankText) || recognizedBank(data.text || "");
  let bankSource = bank ? "text" : null;
  const compact = normalized(data.text || "");
  if (!bank && /ваша выгода/u.test(compact) && /барабан/u.test(compact)) {
    bank = BANKS.find((item) => item.id === "alfa");
    bankSource = "layout";
  }
  const notes =
    bankSource === "layout"
      ? ["bank-suggestion"]
      : bank
        ? []
        : ["bank-not-visible"];
  if (!lines.length)
    return { ...parseScreenshot(text), text, bank, bankSource, notes };
  const sectionStart =
    lines.find((line) => /ваша выгода/iu.test(line.text))?.bbox.y1 ?? 0;
  const sectionEnd =
    lines.find((line) => /докупить\s+за\s+к[еэ]шб[еэ]к/iu.test(line.text))?.bbox
      .y0 ?? imageHeight;
  const anchors = [];
  for (const line of lines)
    for (let index = 0; index < line.words.length; index++) {
      const word = line.words[index];
      let match = ratePattern.exec(word.text.trim());
      let box = word.bbox;
      if (
        !match &&
        /^\d{1,3}(?:[.,]\d{1,2})?$/u.test(word.text.trim()) &&
        /^[%％]$/u.test(line.words[index + 1]?.text.trim() || "")
      ) {
        match = ratePattern.exec(word.text.trim() + "%");
        box = { ...word.bbox, x1: line.words[index + 1].bbox.x1 };
      }
      if (!match || !box || box.y0 < sectionStart || box.y0 >= sectionEnd)
        continue;
      const rate = Number(match[1].replace(",", "."));
      if (rate > 0 && rate <= 100) anchors.push({ rate, box, line });
    }
  const categories = [],
    seen = new Set();
  for (const anchor of anchors) {
    const tolerance = height(anchor.box) * 0.8;
    const other = anchors
      .filter(
        (item) =>
          item !== anchor &&
          Math.abs(centerY(item.box) - centerY(anchor.box)) <
            height(anchor.box) * 1.2 &&
          item.box.x0 > anchor.box.x0,
      )
      .sort((a, b) => a.box.x0 - b.box.x0)[0];
    const right = other ? (anchor.box.x0 + other.box.x0) / 2 : width;
    const words = anchor.line.words.filter(
      (word) =>
        word.bbox.x0 >= anchor.box.x1 - 2 &&
        word.bbox.x0 < right &&
        /\p{L}/u.test(word.text) &&
        !ratePattern.test(word.text.trim()),
    );
    let name = cleanName(words.map((word) => word.text).join(" "));
    if (!name) {
      const candidates = lines.filter(
        (line) =>
          line.bbox.y0 >= anchor.box.y1 - 2 &&
          line.bbox.y0 - anchor.box.y1 <
            Math.max(height(anchor.box) * 4, imageHeight * 0.065),
      );
      for (const line of candidates) {
        const columnWords = line.words.filter(
          (word) =>
            word.bbox.x0 >= anchor.box.x0 - tolerance &&
            word.bbox.x0 < right &&
            /\p{L}/u.test(word.text),
        );
        const candidate = cleanName(
          columnWords.map((word) => word.text).join(" "),
        );
        if (candidate) {
          name = candidate;
          break;
        }
      }
    }
    if (!name || seen.has(normalized(name))) continue;
    seen.add(normalized(name));
    categories.push({
      id: `ocr-${categories.length + 1}`,
      name,
      rate: anchor.rate,
    });
    if (categories.length >= 100) break;
  }
  return { bank, categories, text, bankSource, notes };
}

function abortError() {
  return new DOMException("Recognition cancelled", "AbortError");
}

async function loadImage(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      /* Safari can use the image-element path. */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function recognizeScreenshot(
  file,
  { onProgress = () => {}, signal } = {},
) {
  let worker,
    aborted = false,
    rejectAbort;
  const cancellation = new Promise((_, reject) => {
    rejectAbort = reject;
  });
  const interruptible = (promise) => Promise.race([promise, cancellation]);
  const onAbort = () => {
    aborted = true;
    worker?.terminate().catch(() => {});
    rejectAbort(abortError());
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  const check = () => {
    if (aborted || signal?.aborted) throw abortError();
  };
  try {
    check();
    onProgress({ status: "preparing image", progress: 0 });
    const image = await interruptible(
      loadImage(file).then((loaded) => {
        if (aborted) {
          loaded.close?.();
          throw abortError();
        }
        return loaded;
      }),
    );
    check();
    const scale = getImageScale(image.width, image.height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.close?.();
    const original = context.getImageData(0, 0, canvas.width, canvas.height);
    const region = findBankLabelRegion(original);
    let labelCanvas;
    if (region) {
      labelCanvas = document.createElement("canvas");
      const labelScale = Math.min(4, Math.max(1, 1000 / region.width));
      labelCanvas.width = Math.round(region.width * labelScale);
      labelCanvas.height = Math.round(region.height * labelScale);
      labelCanvas
        .getContext("2d")
        .drawImage(
          canvas,
          region.left,
          region.top,
          region.width,
          region.height,
          0,
          0,
          labelCanvas.width,
          labelCanvas.height,
        );
    }
    const prepared = preparePixels(original);
    context.putImageData(
      new ImageData(prepared.data, prepared.width, prepared.height),
      0,
      0,
    );
    const { createWorker } = await interruptible(import("tesseract.js"));
    check();
    const base = new URL(import.meta.env.BASE_URL, location.href);
    worker = await interruptible(
      createWorker(["rus", "eng"], 1, {
        workerPath: new URL("ocr/worker.min.js", base).href,
        corePath: new URL("ocr/", base).href,
        langPath: new URL("ocr/", base).href,
        workerBlobURL: false,
        logger: (message) => {
          if (!aborted) onProgress(message);
        },
      }).then((created) => {
        if (aborted) {
          created.terminate().catch(() => {});
          throw abortError();
        }
        return created;
      }),
    );
    check();
    await interruptible(worker.setParameters(OCR_PARAMETERS));
    const { data } = await interruptible(
      worker.recognize(canvas, {}, { text: true, blocks: true }),
    );
    check();
    let bankText = "";
    if (labelCanvas && !recognizedBank(data.text || "")) {
      onProgress({ status: "reading bank label", progress: 0.95 });
      await interruptible(worker.setParameters({ tessedit_pageseg_mode: "7" }));
      bankText = (await interruptible(worker.recognize(labelCanvas))).data.text;
      check();
    }
    return parseOcrResult(data, {
      width: canvas.width,
      height: canvas.height,
      bankText,
    });
  } catch (error) {
    if (aborted || signal?.aborted) throw abortError();
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
    if (worker) await worker.terminate().catch(() => {});
  }
}

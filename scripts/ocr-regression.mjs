import { createWorker } from "tesseract.js";
import sharp from "sharp";
import { resolve } from "node:path";
import { parseScreenshot } from "../src/domain.js";
import {
  OCR_PARAMETERS,
  getImageScale,
  preparePixels,
  findBankLabelRegion,
  parseOcrResult,
} from "../src/ocr.js";
const root = resolve(import.meta.dirname, "..");
const directory = resolve(
  process.argv.slice(2).find((arg) => !arg.startsWith("--")) ||
    resolve(root, "../cashbacks_screens"),
);
const baseline = process.argv.includes("--baseline");
const expectations = {
  "alfa.jpeg": {
    bank: "alfa",
    bankSource: "layout",
    categories: [
      ["Пятёрочка", 4],
      ["М.Косметик", 10],
      ["Медицинские услуги", 5],
    ],
  },
  // This screen contains no bank brand. A required bank picker is safer than inventing one.
  "sber.jpeg": {
    bank: null,
    bankSource: null,
    categories: [
      ["Все остальные покупки", 1],
      ["Кафе и рестораны", 7],
      ["Детские товары", 4],
      ["Дом и ремонт", 4],
      ["Здоровье", 4],
    ],
  },
  "t-bank.jpeg": {
    bank: "tbank",
    bankSource: "text",
    categories: [
      ["Все покупки", 1],
      ["Аптеки", 5],
      ["Супермаркеты", 3],
      ["Цветы", 5],
    ],
  },
};
const worker = await createWorker(["rus", "eng"], 1, {
  langPath: resolve(root, "public/ocr"),
  cacheMethod: "none",
});
let failures = 0;
try {
  for (const [file, expected] of Object.entries(expectations)) {
    const path = resolve(directory, file);
    let result;
    if (baseline) {
      const { data } = await worker.recognize(path);
      result = { ...parseScreenshot(data.text), bankSource: null };
    } else {
      const metadata = await sharp(path).metadata();
      const scale = getImageScale(metadata.width, metadata.height);
      const { data, info } = await sharp(path)
        .rotate()
        .resize(
          Math.round(metadata.width * scale),
          Math.round(metadata.height * scale),
        )
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const original = { data, width: info.width, height: info.height };
      const prepared = preparePixels(original);
      const input = await sharp(Buffer.from(prepared.data), {
        raw: { width: info.width, height: info.height, channels: 4 },
      })
        .png()
        .toBuffer();
      await worker.setParameters(OCR_PARAMETERS);
      const { data: ocr } = await worker.recognize(
        input,
        {},
        { text: true, blocks: true },
      );
      let bankText = "";
      const region = findBankLabelRegion(original);
      if (region) {
        const labelScale = Math.min(4, Math.max(1, 1000 / region.width));
        const label = await sharp(data, {
          raw: { width: info.width, height: info.height, channels: 4 },
        })
          .extract(region)
          .resize(
            Math.round(region.width * labelScale),
            Math.round(region.height * labelScale),
          )
          .png()
          .toBuffer();
        await worker.setParameters({ tessedit_pageseg_mode: "7" });
        bankText = (await worker.recognize(label)).data.text;
      }
      result = parseOcrResult(ocr, {
        width: info.width,
        height: info.height,
        bankText,
      });
      if (process.argv.includes("--text")) console.log(result.text);
    }
    const actual = {
      bank: result.bank?.id || null,
      bankSource: result.bankSource,
      categories: result.categories.map(({ name, rate }) => [name, rate]),
    };
    const pass = JSON.stringify(actual) === JSON.stringify(expected);
    if (!pass) failures++;
    console.log(
      JSON.stringify({ file, pass, actual, ...(!pass ? { expected } : {}) }),
    );
  }
} finally {
  await worker.terminate();
}
console.log(
  `${Object.keys(expectations).length - failures}/${Object.keys(expectations).length} real screenshot regressions passed${baseline ? " (baseline)" : ""}.`,
);
process.exitCode = failures ? 1 : 0;

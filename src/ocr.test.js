import test from "node:test";
import assert from "node:assert/strict";
import {
  parseOcrResult,
  preparePixels,
  findBankLabelRegion,
  getImageScale,
  recognizeScreenshot,
} from "./ocr.js";

const word = (text, x, y, width = 70, wordHeight = 30) => ({
  text,
  confidence: 95,
  bbox: { x0: x, y0: y, x1: x + width, y1: y + wordHeight },
});
const line = (...words) => ({
  text: words.map((w) => w.text).join(" "),
  words,
  bbox: {
    x0: Math.min(...words.map((w) => w.bbox.x0)),
    y0: Math.min(...words.map((w) => w.bbox.y0)),
    x1: Math.max(...words.map((w) => w.bbox.x1)),
    y1: Math.max(...words.map((w) => w.bbox.y1)),
  },
});
const data = (lines) => ({
  text: lines.map((l) => l.text).join("\n"),
  blocks: [{ paragraphs: [{ lines }] }],
});
const pairs = (result) =>
  result.categories.map(({ name, rate }) => [name, rate]);

test("spatial card parsing separates columns and excludes promo/unselected sections", () => {
  const input = data([
    line(word("суперкэшбэк", 60, 200, 200), word("60%", 800, 200)),
    line(word("категория в барабане", 60, 300, 400)),
    line(word("Ваша выгода в ноябре", 60, 500, 500)),
    line(word("4%", 80, 650), word("10%", 650, 650)),
    line(word("Пятёрочка", 80, 720, 210), word("М.Косметик", 650, 720, 220)),
    line(
      word("На покупки от", 80, 850, 200),
      word("На покупки от", 650, 850, 200),
    ),
    line(word("5%", 80, 1050)),
    line(word("Медицинские", 80, 1120, 250), word("услуги", 350, 1120, 120)),
    line(word("Докупить за кэшбэк", 60, 1500, 500)),
    line(word("5%", 80, 1650), word("5%", 650, 1650)),
    line(word("Маркетплейсы", 80, 1720, 250), word("Фастфуд", 650, 1720, 200)),
  ]);
  const result = parseOcrResult(input, { width: 1200, height: 2200 });
  assert.deepEqual(pairs(result), [
    ["Пятёрочка", 4],
    ["М.Косметик", 10],
    ["Медицинские услуги", 5],
  ]);
  assert.equal(result.bank.id, "alfa");
  assert.equal(result.bankSource, "layout");
  assert.deepEqual(result.notes, ["bank-suggestion"]);
});

test("list parsing excludes icon glyphs before rates and question buttons after names", () => {
  const result = parseOcrResult(
    data([
      line(
        word("а", 50, 300),
        word("1%", 200, 300),
        word("Все", 300, 300),
        word("покупки", 390, 300, 200),
        word("?", 1100, 300),
      ),
      line(
        word("№", 50, 450),
        word("5%", 200, 450),
        word("Аптеки", 300, 450, 200),
        word("?", 1100, 450),
      ),
      line(word("Подробнее", 200, 500, 200)),
      line(
        word("Ss)", 50, 600),
        word("4%", 200, 600),
        word("Детские", 300, 600, 160),
        word("товары", 480, 600, 160),
      ),
    ]),
  );
  assert.deepEqual(pairs(result), [
    ["Все покупки", 1],
    ["Аптеки", 5],
    ["Детские товары", 4],
  ]);
  assert.equal(result.bank, null);
  assert.equal(result.bankSource, null);
  assert.deepEqual(result.notes, ["bank-not-visible"]);
});

test("cropped stylized bank text is recognized without treating a generic layout as a bank", () => {
  const input = data([
    line(word("1%", 200, 300), word("Все покупки", 300, 300, 300)),
  ]);
  assert.equal(parseOcrResult(input, { bankText: "TBAHK" }).bank.id, "tbank");
  assert.equal(parseOcrResult(input, { bankText: "TBAHK" }).bankSource, "text");
  assert.equal(parseOcrResult(input, { bankText: "Кешбэк" }).bank, null);
  assert.equal(parseOcrResult(input, { bankText: "SUPERBANK" }).bank, null);
});

test("invalid percentages and offer limits are never categories", () => {
  const result = parseOcrResult(
    data([
      line(word("150%", 200, 300), word("Рестораны", 320, 300, 230)),
      line(word("-5%", 200, 400), word("Аптеки", 320, 400, 200)),
      line(word("5%", 200, 500), word("На покупки от", 320, 500, 300)),
      line(word("1000 Р", 320, 650, 200)),
    ]),
  );
  assert.deepEqual(result.categories, []);
});

test("preprocessing inverts dark screenshots and preserves light screenshots", () => {
  const dark = {
    width: 2,
    height: 1,
    data: new Uint8ClampedArray([25, 25, 25, 255, 240, 240, 240, 255]),
  };
  // A mostly dark canvas is needed for median classification.
  const canvas = {
    width: 3,
    height: 1,
    data: new Uint8ClampedArray([
      ...dark.data.slice(0, 4),
      ...dark.data.slice(0, 4),
      ...dark.data.slice(4),
    ]),
  };
  const result = preparePixels(canvas);
  assert.equal(result.inverted, true);
  assert.equal(result.data[0], 230);
  assert.equal(result.data[8], 15);
  const light = preparePixels({
    width: 3,
    height: 1,
    data: new Uint8ClampedArray([
      240, 240, 240, 255, 240, 240, 240, 255, 20, 20, 20, 255,
    ]),
  });
  assert.equal(light.inverted, false);
  assert.equal(light.data[0], 240);
  assert.ok(getImageScale(800, 1600) > 1);
  assert.ok(getImageScale(4000, 8000) < 1);
});

test("header crop detection requires a colored horizontal mark in the status area", () => {
  const width = 200,
    height = 400,
    pixels = new Uint8ClampedArray(width * height * 4);
  const paint = (y0, y1) => {
    for (let y = y0; y < y1; y++)
      for (let x = 75; x < 125; x++) {
        const i = (y * width + x) * 4;
        pixels[i] = 255;
        pixels[i + 1] = 220;
        pixels[i + 2] = 20;
        pixels[i + 3] = 255;
      }
  };
  paint(100, 115);
  assert.equal(findBankLabelRegion({ width, height, data: pixels }), null);
  paint(6, 16);
  const region = findBankLabelRegion({ width, height, data: pixels });
  assert.ok(region.left < 75 && region.left + region.width > 125);
  assert.ok(region.top < 6 && region.top + region.height > 16);
});

test("already aborted recognition never loads or processes an image", async () => {
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    recognizeScreenshot(null, { signal: controller.signal }),
    (error) => error.name === "AbortError",
  );
});

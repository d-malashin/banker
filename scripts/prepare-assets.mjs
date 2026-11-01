import {
  mkdir,
  copyFile,
  readdir,
  stat,
  writeFile,
  rename,
} from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "public/ocr");
await mkdir(output, { recursive: true });
await mkdir(resolve(root, "public/icons"), { recursive: true });
await copyFile(
  resolve(root, "node_modules/tesseract.js/dist/worker.min.js"),
  resolve(output, "worker.min.js"),
);
const core = resolve(root, "node_modules/tesseract.js-core");
for (const file of await readdir(core)) {
  if (/\.wasm(?:\.js)?$/.test(file))
    await copyFile(resolve(core, file), resolve(output, file));
}
await copyFile(
  resolve(root, "node_modules/tesseract.js/LICENSE.md"),
  resolve(output, "TESSERACT-JS-LICENSE.md"),
);
await copyFile(
  resolve(core, "LICENSE"),
  resolve(output, "TESSERACT-CORE-LICENSE"),
);

for (const language of ["eng", "rus"]) {
  const target = resolve(output, `${language}.traineddata.gz`);
  try {
    if ((await stat(target)).size > 100_000) continue;
  } catch {
    /* Download missing models. */
  }
  const url = `https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/87416418657359cb625c412a48b6e1d6d41c29bd/${language}.traineddata`;
  console.log(`Downloading ${language} OCR model…`);
  const model = execFileSync(
    "curl",
    [
      "--fail",
      "--location",
      "--silent",
      "--show-error",
      "--retry",
      "3",
      "--max-time",
      "120",
      url,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );
  const bytes = gzipSync(model);
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b || bytes.length < 100_000)
    throw new Error(`Invalid OCR model: ${language}`);
  await writeFile(`${target}.partial`, bytes);
  await rename(`${target}.partial`, target);
}

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#e1e3eb"/></linearGradient></defs><rect width="512" height="512" rx="112" fill="url(#g)"/><path d="M166 135h96c63 0 94 29 94 71 0 27-15 49-38 59 32 9 49 32 49 62 0 48-36 78-103 78h-98V135zm57 49v61h33c28 0 42-10 42-31 0-20-14-30-42-30h-33zm0 105v67h37c32 0 48-11 48-34 0-22-16-33-48-33h-37z" fill="#27272d"/><path d="m383 94 10 27 27 10-27 10-10 27-10-27-27-10 27-10z" fill="#007aff"/></svg>`;
await writeFile(resolve(root, "public/icons/banker.svg"), icon);
for (const size of [180, 192, 512]) {
  await sharp(Buffer.from(icon))
    .resize(size, size)
    .png()
    .toFile(resolve(root, `public/icons/icon-${size}.png`));
}
console.log("Local OCR runtime, models and app icons ready.");

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '../dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(resolve(dir, entry.name)) : resolve(dir, entry.name)))).flat();
}
const files = (await walk(root)).filter(file => !file.endsWith('/sw.js')).sort();
const hash = createHash('sha256');
for (const file of files) hash.update(await readFile(file));
const version = hash.digest('hex').slice(0, 16);
let source = await readFile(resolve(import.meta.dirname, '../public/sw.js'), 'utf8');
source = source.replace('__BANKER_CACHE_VERSION__', version).replace('/* __BANKER_ASSETS__ */ []', JSON.stringify(['./', ...files.map(file => `./${relative(root, file).replaceAll('\\', '/')}`)]));
await writeFile(resolve(root, 'sw.js'), source);
await writeFile(resolve(root, '.nojekyll'), '');
console.log(`Offline cache ${version}: ${files.length} application and OCR files.`);

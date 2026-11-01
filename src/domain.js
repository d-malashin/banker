export const BANKS = [
  { id: 'tbank', name: 'Т-Банк', color: '#ffdc32', mark: 'Т', aliases: ['т-банк', 'т банк', 'тбанк', 'тинькофф', 'tinkoff', 't-bank', 'tbank'] },
  { id: 'sber', name: 'Сбер', color: '#35ba69', mark: 'С', aliases: ['сбер', 'сбербанк', 'sber', 'sberbank'] },
  { id: 'alfa', name: 'Альфа-Банк', color: '#ef4051', mark: 'А', aliases: ['альфа', 'альфа-банк', 'альфабанк', 'alfa', 'alfa-bank'] },
  { id: 'vtb', name: 'ВТБ', color: '#3883ee', mark: 'В', aliases: ['втб', 'vtb'] },
  { id: 'ozon', name: 'Ozon Банк', color: '#2367ff', mark: 'O', aliases: ['озон банк', 'ozon банк', 'ozon bank', 'озон', 'ozon'] },
  { id: 'yandex', name: 'Яндекс Банк', color: '#ffbe35', mark: 'Я', aliases: ['яндекс банк', 'яндекс пэй', 'яндекс', 'yandex', 'yandex pay'] },
  { id: 'raiffeisen', name: 'Райффайзен', color: '#f6d63c', mark: 'R', aliases: ['райффайзен', 'райффайзенбанк', 'raiffeisen'] },
  { id: 'gazprom', name: 'Газпромбанк', color: '#3294ca', mark: 'Г', aliases: ['газпромбанк', 'газпром банк', 'gazprombank'] },
  { id: 'psb', name: 'ПСБ', color: '#ee7f45', mark: 'П', aliases: ['псб', 'промсвязьбанк', 'psb'] },
  { id: 'mts', name: 'МТС Банк', color: '#e84a5f', mark: 'М', aliases: ['мтс банк', 'мтс-банк', 'мтсбанк', 'mts bank'] },
  { id: 'sovcom', name: 'Совкомбанк', color: '#e84e63', mark: 'Х', aliases: ['совкомбанк', 'совком банк', 'халва', 'sovcombank'] },
  { id: 'rshb', name: 'Россельхозбанк', color: '#16913d', mark: 'Р', aliases: ['россельхозбанк', 'россельхоз', 'рсхб', 'rshb'] },
  { id: 'domrf', name: 'Банк ДОМ.РФ', color: '#8dcc24', mark: 'Д', aliases: ['банк дом.рф', 'дом.рф', 'дом рф', 'domrf', 'dom rf'] },
  { id: 'mkb', name: 'Московский кредитный банк', color: '#bd1639', mark: 'М', aliases: ['московский кредитный банк', 'мкб', 'mkb'] },
];

const MAX_BANKS = 40;
const MAX_CATEGORIES = 100;
const MAX_TOTAL = 500;
const MAX_SHARE = 16000;
const normalize = (value) => value.normalize('NFKC').toLowerCase().replace(/ё/g, 'е').replace(/[–—−]/g, '-').replace(/\s+/g, ' ').trim();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function recognizeBank(text) {
  if (typeof text !== 'string') return null;
  const value = normalize(text);
  let match = null;
  let first = Infinity;
  for (const bank of BANKS) {
    for (const alias of bank.aliases) {
      const regex = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegex(normalize(alias))}(?![\\p{L}\\p{N}])`, 'u');
      const found = regex.exec(value);
      if (found && found.index < first) { match = bank; first = found.index; }
    }
  }
  return match;
}

export function makeBankId(name) {
  if (typeof name !== 'string' || !name.trim() || name.length > 80) throw new Error('Invalid bank name');
  const known = recognizeBank(name);
  if (known) return known.id;
  const id = normalize(name).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
  if (!id) throw new Error('Invalid bank name');
  return `custom-${id}`;
}

const ratePattern = /(?<![\d.,-])(\d{1,3}(?:[.,]\d{1,2})?)\s*[%％]/g;
const noise = /^(?:к[еэ]шб[еэ]к|cashback|категории|повышенный|выбрать|выберите|подключить|подробнее|готово|назад|лимит|баланс|сумма|доступно|доход|мои карты|главная|история|платежи|избранное|все операции|условия|выбрано|действует|с\s+\d|до\s+\d|ноябрь|октябрь|декабрь|январь|февраль|март|апрель|май|июнь|июль|август|сентябрь)/i;
function categoryName(value) {
  const name = value.replace(ratePattern, '').replace(/^(?:до|от)\s+/i, '').replace(/^[\s•·|:;—–\-+]+|[\s•·|:;—–\-+]+$/g, '').replace(/\s+/g, ' ').trim();
  if (name.length < 2 || name.length > 100 || !/\p{L}/u.test(name) || noise.test(name) || /[₽₽]|\d\s*(?:руб|балл)|\d{1,2}[:./]\d{2}/i.test(name)) return null;
  const bank = recognizeBank(name);
  if (bank && normalize(name).replace(/[ -]/g, '').length <= normalize(bank.name).replace(/[ -]/g, '').length + 2) return null;
  return name;
}

export function parseScreenshot(text) {
  if (typeof text !== 'string' || text.length > 100000) throw new Error('Invalid OCR text');
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const categories = [];
  const used = new Set();
  const seen = new Set();
  const add = (name, rate) => {
    if (!name || !(rate > 0 && rate <= 100)) return;
    const key = normalize(name);
    if (seen.has(key)) return;
    seen.add(key);
    categories.push({ id: `ocr-${categories.length + 1}`, name, rate });
  };
  for (let i = 0; i < lines.length && categories.length < MAX_CATEGORIES; i++) {
    const matches = [...lines[i].matchAll(ratePattern)];
    if (!matches.length) continue;
    if (matches.length > 1) {
      const prefix = !/\p{L}/u.test(lines[i].slice(0, matches[0].index).replace(/до|от/gi, ''));
      for (let j = 0; j < matches.length; j++) {
        const start = prefix ? matches[j].index + matches[j][0].length : j === 0 ? 0 : matches[j - 1].index + matches[j - 1][0].length;
        const end = prefix ? matches[j + 1]?.index ?? lines[i].length : matches[j].index;
        const name = categoryName(lines[i].slice(start, end));
        add(name, Number(matches[j][1].replace(',', '.')));
      }
      used.add(i);
      continue;
    }
    const rate = Number(matches[0][1].replace(',', '.'));
    let name = categoryName(lines[i]);
    if (!name) {
      for (const near of [i - 1, i + 1]) {
        if (near < 0 || near >= lines.length || used.has(near) || /[%％]/.test(lines[near])) continue;
        const candidate = categoryName(lines[near]);
        if (candidate) { name = candidate; used.add(near); break; }
      }
    }
    used.add(i);
    add(name, rate);
  }
  return { bank: recognizeBank(text), categories };
}

export function validateData(input) {
  if (!input || typeof input !== 'object' || input.version !== 1 || !Array.isArray(input.banks) || input.banks.length > MAX_BANKS) throw new Error('Invalid Banker data');
  let total = 0;
  const bankIds = new Set();
  const banks = input.banks.map((bank) => {
    if (!bank || typeof bank !== 'object' || typeof bank.id !== 'string' || bank.id.length > 100 || typeof bank.name !== 'string' || !bank.name.trim() || bank.name.length > 80 || !Array.isArray(bank.categories) || bank.categories.length > MAX_CATEGORIES || typeof bank.updatedAt !== 'string' || bank.updatedAt.length > 40 || !Number.isFinite(Date.parse(bank.updatedAt))) throw new Error('Invalid bank');
    const id = makeBankId(bank.name);
    if (bankIds.has(id)) throw new Error('Duplicate bank');
    bankIds.add(id);
    const categoryIds = new Set();
    const categories = bank.categories.map((category) => {
      total++;
      if (total > MAX_TOTAL || !category || typeof category.id !== 'string' || !category.id || category.id.length > 100 || categoryIds.has(category.id) || typeof category.name !== 'string' || !category.name.trim() || category.name.length > 100 || typeof category.rate !== 'number' || !Number.isFinite(category.rate) || category.rate <= 0 || category.rate > 100) throw new Error('Invalid category');
      categoryIds.add(category.id);
      return { id: category.id, name: category.name.trim(), rate: category.rate };
    });
    return { id, name: bank.name.trim(), categories, updatedAt: new Date(bank.updatedAt).toISOString() };
  });
  return { version: 1, banks };
}

export function restoreStoredData(input) {
  if (!input || typeof input !== 'object' || input.version !== 1 || !Array.isArray(input.banks) || input.banks.length > MAX_BANKS) throw new Error('Invalid Banker data');
  const selected = new Map();
  for (const value of input.banks) {
    const bank = validateData({ version: input.version, banks: [value] }).banks[0];
    const previous = selected.get(bank.id);
    if (!previous || Date.parse(bank.updatedAt) >= Date.parse(previous.updatedAt)) selected.set(bank.id, bank);
  }
  return validateData({ version: 1, banks: [...selected.values()] });
}

export function mergeBanks(current, incoming) {
  const result = new Map();
  for (const bank of [...current, ...incoming]) result.set(makeBankId(bank.name), { ...bank, id: makeBankId(bank.name) });
  return validateData({ version: 1, banks: [...result.values()] }).banks;
}

export function encodeShare(banks) {
  const data = validateData({ version: 1, banks });
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  if (encoded.length > MAX_SHARE) throw new Error('Share link too large; export JSON instead');
  return encoded;
}

export function decodeShare(fragment) {
  if (typeof fragment !== 'string') throw new Error('Invalid share link');
  const encoded = fragment.replace(/^#(?:share=)?/, '').replace(/^share=/, '');
  if (!encoded || encoded.length > MAX_SHARE || !/^[A-Za-z0-9_-]+$/.test(encoded) || encoded.length % 4 === 1) throw new Error('Invalid share link');
  const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
  const json = new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
  return validateData(JSON.parse(json)).banks;
}

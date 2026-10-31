import test from 'node:test';
import assert from 'node:assert/strict';
import { BANKS, recognizeBank, makeBankId, parseScreenshot, validateData, mergeBanks, encodeShare, decodeShare } from './domain.js';

const category = (name = 'Супермаркеты', rate = 5) => ({ id: 'one', name, rate });
const bank = (name = 'Т-Банк', categories = [category()]) => ({ id: makeBankId(name), name, categories, updatedAt: '2026-10-31T10:00:00.000Z' });

test('recognizes Russian bank aliases and canonical identity', () => {
  assert.equal(recognizeBank('Кешбэк\nТинькофф\n5%')?.id, 'tbank');
  assert.equal(makeBankId('Т Банк'), makeBankId('Тинькофф'));
  assert.equal(recognizeBank('СберБанк\nКатегории')?.id, 'sber');
  assert.equal(recognizeBank('ВТБанк неизвестный'), null);
  assert.equal(recognizeBank(''), null);
  for (const entry of BANKS) assert.equal(makeBankId(entry.name), entry.id);
});

test('custom banks normalize whitespace, case and punctuation', () => {
  assert.equal(makeBankId(' Мой  Банк '), makeBankId('мой-банк'));
  assert.throws(() => makeBankId('!!!'));
});

test('OCR parses inline Russian categories and decimal rates', () => {
  const result = parseScreenshot('Сбер\nКатегории кешбэка\nСупермаркеты 5%\n10 % Рестораны\nАптеки 3,5％\nБаланс 15000 ₽\n15:20');
  assert.equal(result.bank.id, 'sber');
  assert.deepEqual(result.categories.map(({ name, rate }) => ({ name, rate })), [{ name: 'Супермаркеты', rate: 5 }, { name: 'Рестораны', rate: 10 }, { name: 'Аптеки', rate: 3.5 }]);
});

test('OCR pairs isolated rates with adjacent names in either direction', () => {
  assert.deepEqual(parseScreenshot('ВТБ\nСупермаркеты\n5%\nАптеки\n3%').categories.map((c) => c.name), ['Супермаркеты', 'Аптеки']);
  assert.deepEqual(parseScreenshot('Т-Банк\n5%\nСупермаркеты\n3%\nАптеки').categories.map((c) => c.name), ['Супермаркеты', 'Аптеки']);
});

test('OCR handles multiple inline categories with leading or trailing rates', () => {
  assert.deepEqual(parseScreenshot('Т-Банк\n5% Супермаркеты 10% Такси').categories.map(({ name, rate }) => ({ name, rate })), [{ name: 'Супермаркеты', rate: 5 }, { name: 'Такси', rate: 10 }]);
  assert.deepEqual(parseScreenshot('Т-Банк\nСупермаркеты 5% Такси 10%').categories.map(({ name, rate }) => ({ name, rate })), [{ name: 'Супермаркеты', rate: 5 }, { name: 'Такси', rate: 10 }]);
  assert.deepEqual(parseScreenshot('Аптеки -5%\nТакси 1000%').categories, []);
});

test('OCR rejects invalid rates, navigation, balances and deduplicates categories', () => {
  const result = parseScreenshot('Т-Банк\nПовышенный кешбэк 20%\nВыберите категории 10%\nСупермаркеты 5%\nСупермаркеты 5%\nАптеки 0%\nТакси 101%\nБаланс 5000 ₽\n12:30');
  assert.deepEqual(result.categories.map((c) => c.name), ['Супермаркеты']);
  assert.deepEqual(parseScreenshot('No readable content').categories, []);
});

test('validation canonicalizes bank IDs and strips untrusted properties', () => {
  const result = validateData({ version: 1, banks: [{ ...bank('Сбер'), id: 'fake', injected: '<script>' }] });
  assert.equal(result.banks[0].id, 'sber');
  assert.equal('injected' in result.banks[0], false);
});

test('validation rejects malformed files and duplicate canonical banks', () => {
  for (const data of [null, {}, { version: 2, banks: [] }, { version: 1, banks: 'oops' }, { version: 1, banks: [bank('Т-Банк'), bank('Тинькофф')] }, { version: 1, banks: [{ ...bank(), updatedAt: 'oops' }] }]) assert.throws(() => validateData(data));
  for (const rate of [NaN, Infinity, 0, -3, 101, '5']) assert.throws(() => validateData({ version: 1, banks: [bank('Сбер', [category('Аптеки', rate)])] }));
  assert.throws(() => validateData({ version: 1, banks: [bank('Сбер', [category(), category()])] }));
});

test('a new screenshot replaces the entire bank and preserves other banks', () => {
  const previous = [bank('Т-Банк', [category('Такси')]), bank('Сбер')];
  const result = mergeBanks(previous, [bank('Тинькофф', [category('Аптеки', 10)])]);
  assert.equal(result.length, 2);
  assert.equal(result[0].categories.length, 1);
  assert.equal(result[0].categories[0].name, 'Аптеки');
  assert.deepEqual(result[1], previous[1]);
  assert.equal(previous[0].categories[0].name, 'Такси');
});

test('share links roundtrip Cyrillic and use URL-safe encoding', () => {
  const data = [bank('Сбер', [category('Кафе / рестораны ☕', 7.5)])];
  const encoded = encodeShare(data);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeShare(`#share=${encoded}`), data);
  assert.deepEqual(decodeShare(encoded), data);
});

test('share payload validation rejects malformed, unsupported and oversized data', () => {
  for (const input of ['', '#share=!!!', 'a', 'a'.repeat(16001), btoa('{"version":2,"banks":[]}')]) assert.throws(() => decodeShare(input));
  const banks = Array.from({ length: 10 }, (_, i) => bank(`Банк ${i}`, Array.from({ length: 50 }, (_, j) => ({ id: String(j), name: 'Длинная категория '.repeat(5), rate: 5 }))));
  assert.throws(() => encodeShare(banks), /too large/);
});

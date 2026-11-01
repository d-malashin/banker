import test from 'node:test';
import assert from 'node:assert/strict';
import { BANKS, recognizeBank, makeBankId, parseScreenshot, validateData, restoreStoredData, mergeBanks, encodeShare, decodeShare } from './domain.js';

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

test('recognizes added banks through each Cyrillic and Latin alias', () => {
  for (const id of ['rshb', 'domrf', 'mkb']) {
    const entry = BANKS.find((item) => item.id === id);
    for (const alias of entry.aliases) {
      assert.equal(recognizeBank(`Кешбэк\n${alias.toUpperCase()}\nАптеки 5%`)?.id, id, alias);
      assert.equal(makeBankId(alias), id, alias);
    }
  }
  assert.equal(recognizeBank('Дом не банк'), null);
  assert.equal(recognizeBank('мкбонус'), null);
});

test('old custom bank identities migrate without losing stored categories', () => {
  const oldBanks = [
    { ...bank('Россельхозбанк', [category('Аптеки', 7)]), id: 'custom-россельхозбанк' },
    { ...bank('Банк ДОМ.РФ', [category('Рестораны', 10)]), id: 'custom-банк-дом-рф' },
    { ...bank('Московский кредитный банк', [category('Такси', 5)]), id: 'custom-московский-кредитный-банк' },
  ];
  const migrated = validateData({ version: 1, banks: oldBanks }).banks;
  assert.deepEqual(migrated.map((entry) => entry.id), ['rshb', 'domrf', 'mkb']);
  for (let i = 0; i < oldBanks.length; i++) {
    assert.deepEqual(migrated[i].categories, oldBanks[i].categories);
    assert.equal(migrated[i].updatedAt, oldBanks[i].updatedAt);
  }
  for (const [i, alias] of ['РСХБ', 'ДОМ РФ', 'МКБ'].entries()) {
    const updated = mergeBanks(oldBanks, [bank(alias, [category('Новые категории', 12)])]);
    assert.equal(updated.length, oldBanks.length);
    assert.deepEqual(updated[i].categories, [category('Новые категории', 12)]);
    for (let j = 0; j < oldBanks.length; j++) {
      if (j !== i) assert.deepEqual(updated[j].categories, oldBanks[j].categories);
    }
  }
  assert.deepEqual(oldBanks.map((entry) => entry.id), ['custom-россельхозбанк', 'custom-банк-дом-рф', 'custom-московский-кредитный-банк']);
});

test('local restore resolves legacy bank aliases by newest complete list', () => {
  const older = '2026-10-01T10:00:00.000Z';
  const newer = '2026-10-31T10:00:00.000Z';
  const domOld = { ...bank('Банк ДОМ.РФ', [category('Старые аптеки', 3)]), id: 'custom-банк-дом-рф', updatedAt: older };
  const domNew = { ...bank('ДОМ РФ', [category('Новые аптеки', 7)]), id: 'custom-дом-рф', updatedAt: newer };
  const rshbOld = { ...bank('Россельхозбанк', [category('Старое такси', 5)]), id: 'custom-россельхозбанк', updatedAt: older };
  const rshbNew = { ...bank('РСХБ', [category('Новые рестораны', 10)]), id: 'custom-рсхб', updatedAt: newer };
  const unrelated = bank('Сбер');
  const input = { version: 1, banks: [domOld, domNew, unrelated, rshbNew, rshbOld] };
  const restored = restoreStoredData(input);
  assert.deepEqual(restored.banks.map((entry) => entry.id), ['domrf', 'sber', 'rshb']);
  assert.deepEqual(restored.banks[0].categories, domNew.categories);
  assert.deepEqual(restored.banks[1], unrelated);
  assert.deepEqual(restored.banks[2].categories, rshbNew.categories);
  assert.equal(restored.banks[0].updatedAt, newer);
  assert.equal(input.banks[0].id, 'custom-банк-дом-рф');
  assert.throws(() => validateData(input), /Duplicate bank/);
  const tie = restoreStoredData({ version: 1, banks: [domNew, { ...domOld, updatedAt: newer }] });
  assert.deepEqual(tie.banks[0].categories, domOld.categories);
});

test('local restore validates older duplicates and full collection limits', () => {
  const valid = bank('ДОМ РФ');
  const invalidOld = { ...bank('Банк ДОМ.РФ', [category('Аптеки', -1)]), updatedAt: '2026-10-01T10:00:00.000Z' };
  assert.throws(() => restoreStoredData({ version: 1, banks: [invalidOld, valid] }), /Invalid category/);
  assert.throws(() => restoreStoredData({ version: 1, banks: [valid, invalidOld] }), /Invalid category/);
  for (const input of [null, {}, { version: 2, banks: [] }, { version: 1, banks: 'oops' }, { version: 1, banks: Array.from({ length: 41 }, () => valid) }]) assert.throws(() => restoreStoredData(input));
  const manyCategories = Array.from({ length: 100 }, (_, i) => ({ id: String(i), name: `Категория ${i}`, rate: 5 }));
  const tooLarge = Array.from({ length: 6 }, (_, i) => bank(`Свой банк ${i}`, manyCategories));
  assert.throws(() => restoreStoredData({ version: 1, banks: tooLarge }), /Invalid category/);
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

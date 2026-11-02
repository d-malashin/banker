import test from "node:test";
import assert from "node:assert/strict";
import { makeBankId, encodeShare } from "./domain.js";
import {
  currentMonth,
  defaultUploadMonth,
  validateLedger,
  restoreLedger,
  mergeLedger,
  ledgerMonths,
  selectInitialMonth,
  encodeLedgerShare,
  decodeLedgerShare,
} from "./ledger.js";

const category = (name = "Аптеки", rate = 5, id = "one") => ({
  id,
  name,
  rate,
});
const bank = (
  name = "Т-Банк",
  month = "2026-11",
  categories = [category()],
  updatedAt = "2026-11-02T10:00:00.000Z",
) => ({ id: makeBankId(name), name, month, categories, updatedAt });
const payload = (banks) => ({ version: 2, banks });

test("upload month changes on the local 25th with leap and December rollovers", () => {
  assert.equal(defaultUploadMonth(new Date(2026, 10, 24, 23, 59)), "2026-11");
  assert.equal(defaultUploadMonth(new Date(2026, 10, 25)), "2026-12");
  assert.equal(defaultUploadMonth(new Date(2026, 11, 25)), "2027-01");
  assert.equal(defaultUploadMonth(new Date(2028, 1, 24)), "2028-02");
  assert.equal(defaultUploadMonth(new Date(2028, 1, 29)), "2028-03");
  const date = new Date(2026, 11, 31);
  defaultUploadMonth(date);
  assert.equal(date.getMonth(), 11);
  assert.equal(currentMonth(new Date(2026, 0, 1)), "2026-01");
  assert.throws(() => currentMonth(new Date("invalid")));
});

test("legacy import assigns the local calendar month of each upload", () => {
  const legacy = bank(
    "Тинькофф",
    "ignored",
    [category()],
    new Date(2026, 9, 31, 23, 30).toISOString(),
  );
  delete legacy.month;
  const migrated = validateLedger({ version: 1, banks: [legacy] });
  assert.equal(migrated.version, 2);
  assert.equal(migrated.banks[0].month, "2026-10");
  assert.equal(migrated.banks[0].id, "tbank");
  assert.deepEqual(migrated.banks[0].categories, legacy.categories);
  assert.deepEqual(
    validateLedger(JSON.parse(JSON.stringify(migrated))),
    migrated,
  );
});

test("legacy local restore tolerates alias duplicates but import and share stay strict", () => {
  const older = {
    ...bank("Банк ДОМ.РФ", "2026-10"),
    id: "custom-банк-дом-рф",
    updatedAt: "2026-10-02T10:00:00.000Z",
  };
  const newer = {
    ...bank("ДОМ РФ", "2026-11", [category("Такси", 8)]),
    id: "custom-дом-рф",
  };
  delete older.month;
  delete newer.month;
  const legacy = { version: 1, banks: [older, newer] };
  assert.throws(() => validateLedger(legacy), /Duplicate bank/);
  const restored = restoreLedger(legacy);
  assert.equal(restored.banks.length, 1);
  assert.equal(restored.banks[0].month, "2026-11");
  assert.deepEqual(restored.banks[0].categories, newer.categories);
});

test("replacement is confined to the canonical bank and selected month", () => {
  const previous = [
    bank("Т-Банк", "2026-10", [category("Рестораны")]),
    bank("Т-Банк", "2026-11", [category("Такси")]),
    bank("Сбер", "2026-11"),
  ];
  const next = mergeLedger(previous, [
    bank("Тинькофф", "2026-11", [category("Одежда", 10)]),
  ]);
  assert.equal(next.length, 3);
  assert.deepEqual(next[0], previous[0]);
  assert.deepEqual(next[1].categories, [category("Одежда", 10)]);
  assert.deepEqual(next[2], previous[2]);
  assert.deepEqual(previous[1].categories, [category("Такси")]);
});

test("merge retains only the six newest populated months across years", () => {
  const previous = [
    "2026-09",
    "2026-10",
    "2026-11",
    "2026-12",
    "2027-01",
    "2027-02",
  ].map((month) => bank("Сбер", month));
  const next = mergeLedger(previous, [
    bank("Сбер", "2027-03"),
    bank("ВТБ", "2027-03"),
    bank("Т-Банк", "2027-04", []),
  ]);
  assert.deepEqual(ledgerMonths(next), [
    "2027-03",
    "2027-02",
    "2027-01",
    "2026-12",
    "2026-11",
    "2026-10",
  ]);
  assert.equal(next.filter((record) => record.month === "2027-03").length, 2);
  assert.ok(
    next.every(
      (record) => record.month !== "2026-09" && record.month !== "2027-04",
    ),
  );
});

test("initial month prefers current data, otherwise latest upload rather than highest calendar month", () => {
  const entries = [
    bank("Сбер", "2026-12", [category()], "2026-10-01T00:00:00Z"),
    bank("ВТБ", "2026-10", [category()], "2026-11-02T00:00:00Z"),
  ];
  assert.equal(selectInitialMonth(entries, new Date(2026, 10, 2)), "2026-10");
  assert.equal(
    selectInitialMonth(
      [...entries, bank("Т-Банк", "2026-11")],
      new Date(2026, 10, 2),
    ),
    "2026-11",
  );
  assert.equal(selectInitialMonth([], new Date(2026, 10, 2)), "2026-11");
});

test("validation allows same bank in separate months and rejects aliases within one month", () => {
  assert.equal(
    validateLedger(
      payload([bank("Т-Банк", "2026-10"), bank("Тинькофф", "2026-11")]),
    ).banks.length,
    2,
  );
  assert.throws(
    () => validateLedger(payload([bank("Т-Банк"), bank("Тинькофф")])),
    /Duplicate bank/,
  );
  for (const month of [
    "",
    "2026-00",
    "2026-13",
    "2026-1",
    "0000-01",
    "2026-11<script>",
    null,
  ])
    assert.throws(() => validateLedger(payload([{ ...bank(), month }])));
  for (const data of [
    null,
    {},
    { version: 3, banks: [] },
    { version: 2, banks: "wrong" },
  ])
    assert.throws(() => validateLedger(data));
  assert.throws(() =>
    validateLedger(
      payload([bank("Сбер", "2026-11", [category("Аптеки", NaN)])]),
    ),
  );
});

test("validation enforces bank and category caps per month and overall", () => {
  const names = Array.from({ length: 41 }, (_, i) => `Свой банк ${i}`);
  assert.throws(
    () => validateLedger(payload(names.map((name) => bank(name)))),
    /Invalid Banker data/,
  );
  const hundred = Array.from({ length: 100 }, (_, i) =>
    category("Аптеки", 5, String(i)),
  );
  assert.throws(
    () =>
      validateLedger(
        payload(
          names.slice(0, 6).map((name) => bank(name, "2026-11", hundred)),
        ),
      ),
    /Invalid category/,
  );
  const valid = [
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
    "2026-11",
  ].flatMap((month) =>
    names.slice(0, 5).map((name) => bank(name, month, hundred)),
  );
  assert.equal(validateLedger(payload(valid)).banks.length, 30);
  assert.throws(
    () => validateLedger(payload([...valid, bank("Ещё банк", "2026-12")])),
    /Too many categories/,
  );
});

test("custom names and all months survive JSON export/import and UTF-8 sharing", () => {
  const records = [
    bank("Мой Банк ☕", "2026-10", [category("Кафе / рестораны ☕", 7.5)]),
    bank("Мой Банк ☕", "2026-11"),
  ];
  const normalized = validateLedger(payload(records));
  assert.equal(normalized.banks[0].id, "custom-мой-банк");
  assert.deepEqual(
    validateLedger(JSON.parse(JSON.stringify(normalized))),
    normalized,
  );
  const encoded = encodeLedgerShare(records);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeLedgerShare(`#share=${encoded}`), normalized.banks);
  assert.deepEqual(decodeLedgerShare(encoded), normalized.banks);
  const legacy = bank("Сбер");
  delete legacy.month;
  const oldLink = encodeShare([legacy]);
  assert.deepEqual(
    decodeLedgerShare(`#share=${oldLink}`),
    validateLedger({ version: 1, banks: [legacy] }).banks,
  );
});

test("sharing rejects corrupt data and oversized links", () => {
  for (const value of [
    "",
    "a",
    "#share=!",
    "a".repeat(16001),
    null,
    btoa('{"version":3,"banks":[]}'),
  ])
    assert.throws(() => decodeLedgerShare(value));
  const hundred = Array.from({ length: 100 }, (_, i) =>
    category("Длинная категория ".repeat(5), 5, String(i)),
  );
  assert.throws(
    () => encodeLedgerShare([bank("Сбер", "2026-11", hundred)]),
    /too large/,
  );
});

import test from "node:test";
import assert from "node:assert/strict";
import { encodeShare } from "./domain.js";
import { encodeLedgerShare } from "./ledger.js";
import {
  createTransfer,
  readTransfer,
  encodeTransfer,
  decodeTransfer,
} from "./transfer.js";

const banks = [
  {
    id: "tbank",
    name: "Т-Банк",
    month: "2026-11",
    categories: [{ id: "one", name: "Кафе ☕", rate: 7.5 }],
    updatedAt: "2026-11-04T10:00:00.000Z",
  },
];

test("sender name and selected months survive JSON and UTF-8 sharing", () => {
  const transfer = createTransfer(banks, "  Денис  Петров ☕  ");
  assert.equal(transfer.ownerName, "Денис Петров ☕");
  assert.equal(transfer.banks[0].month, "2026-11");
  assert.deepEqual(
    readTransfer(JSON.parse(JSON.stringify(transfer))),
    transfer,
  );
  const encoded = encodeTransfer(banks, transfer.ownerName);
  assert.match(encoded, /^[A-Za-z0-9_-]+$/);
  assert.deepEqual(decodeTransfer(`#share=${encoded}`), transfer);
  assert.deepEqual(decodeTransfer(encoded), transfer);
  assert.deepEqual(decodeTransfer(`share=${encoded}`), transfer);
});

test("unnamed v1 and v2 imports and links migrate without invented sender names", () => {
  assert.equal(readTransfer({ version: 2, banks }).ownerName, "");
  assert.equal(decodeTransfer(encodeLedgerShare(banks)).ownerName, "");
  const legacyBanks = banks.map(({ month, ...record }) => record);
  const legacy = { version: 1, banks: legacyBanks };
  const restored = readTransfer(legacy);
  assert.equal(restored.ownerName, "");
  assert.equal(restored.banks[0].month, "2026-11");
  assert.deepEqual(decodeTransfer(encodeShare(legacyBanks)), restored);
});

test("transfer validation strips unknown properties and rejects malformed names", () => {
  const result = readTransfer({
    version: 2,
    banks,
    ownerName: "Денис",
    secrets: "discard",
    settings: { malicious: true },
  });
  assert.deepEqual(Object.keys(result).sort(), [
    "banks",
    "ownerName",
    "version",
  ]);
  for (const ownerName of [null, undefined, 5, {}, "a".repeat(61)]) {
    assert.throws(() => readTransfer({ version: 2, banks, ownerName }));
  }
  assert.throws(() => createTransfer(banks, "a".repeat(61)));
  assert.throws(() =>
    readTransfer({ version: 2, banks: [{ ...banks[0], month: "2026-13" }] }),
  );
});

test("corrupt and oversized share links fail safely", () => {
  for (const input of [
    "",
    "a",
    "#share=!",
    null,
    "a".repeat(16001),
    btoa('{"version":3,"banks":[]}'),
  ])
    assert.throws(() => decodeTransfer(input));
  const many = Array.from({ length: 100 }, (_, index) => ({
    id: String(index),
    name: "Длинная категория ".repeat(5),
    rate: 5,
  }));
  assert.throws(
    () => encodeTransfer([{ ...banks[0], categories: many }], "Денис"),
    /too large/,
  );
});

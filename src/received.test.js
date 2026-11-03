import test from "node:test";
import assert from "node:assert/strict";
import { validateReceived, mergeReceived } from "./received.js";

const category = (name = "Аптеки", id = "one") => ({ id, name, rate: 5 });
const bank = (month = "2026-11", categories = [category()]) => ({
  id: "sber",
  name: "Сбер",
  month,
  categories,
  updatedAt: "2026-11-04T10:00:00.000Z",
});
const collection = (id, name = "Денис", banks = [bank()]) => ({
  id,
  name,
  banks,
  importedAt: "2026-11-04T11:00:00.000Z",
});
const payload = (collections) => ({ version: 1, collections });

test("new received people get local identities and retain sender/month metadata", () => {
  const first = mergeReceived([], {
    name: "  Денис   Петров ",
    banks: [bank()],
  });
  assert.match(first[0].id, /^[a-f0-9-]{36}$/);
  assert.equal(first[0].name, "Денис Петров");
  assert.equal(first[0].banks[0].month, "2026-11");
  const second = mergeReceived(first, {
    name: "Денис Петров",
    banks: [bank()],
  });
  assert.equal(second.length, 2);
  assert.notEqual(second[0].id, second[1].id);
  assert.deepEqual(
    validateReceived(JSON.parse(JSON.stringify(payload(second)))).collections,
    second,
  );
});

test("repeated import updates only the selected person and bank/month", () => {
  const current = [
    collection("denis", "Денис", [bank("2026-10"), bank("2026-11")]),
    collection("anna", "Анна"),
  ];
  const next = mergeReceived(current, {
    id: "denis",
    name: "Денис",
    banks: [bank("2026-11", [category("Рестораны")])],
  });
  assert.equal(next.length, 2);
  assert.deepEqual(next[0].banks[0], current[0].banks[0]);
  assert.deepEqual(next[0].banks[1].categories, [category("Рестораны")]);
  assert.deepEqual(next[1], current[1]);
  assert.deepEqual(current[0].banks[1].categories, [category()]);
  const repeated = mergeReceived(next, {
    id: "denis",
    banks: [bank("2026-11", [category("Рестораны")])],
  });
  assert.equal(repeated[0].banks.length, 2);
  assert.equal(repeated[0].name, "Денис");
});

test("each recipient collection retains six newest months independently", () => {
  const months = [
    "2026-05",
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
  ];
  const current = [
    collection(
      "denis",
      "Денис",
      months.map((month) => bank(month)),
    ),
    collection("anna", "Анна", [bank("2026-05")]),
  ];
  const next = mergeReceived(current, {
    id: "denis",
    name: "Денис",
    banks: [bank("2026-11")],
  });
  assert.deepEqual(
    next[0].banks.map((entry) => entry.month),
    ["2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"],
  );
  assert.deepEqual(next[1], current[1]);
});

test("unnamed collections can be named during import and unknown properties are stripped", () => {
  const unnamed = collection("unnamed");
  delete unnamed.name;
  const restored = validateReceived(
    payload([{ ...unnamed, unknown: "discard" }]),
  );
  assert.equal(restored.collections[0].name, "");
  assert.equal("unknown" in restored.collections[0], false);
  const named = mergeReceived(restored.collections, {
    id: "unnamed",
    name: "Мама",
    banks: [bank()],
  });
  assert.equal(named[0].name, "Мама");
});

test("invalid inputs are rejected before an update can mask malformed data", () => {
  for (const name of [null, undefined, 1, {}, "a".repeat(61)])
    assert.throws(() =>
      validateReceived(payload([{ ...collection("one"), name }])),
    );
  for (const id of ["", " ", "a".repeat(101), null])
    assert.throws(() => validateReceived(payload([collection(id)])));
  for (const importedAt of ["invalid", "2026-11-04", null])
    assert.throws(() =>
      validateReceived(payload([{ ...collection("one"), importedAt }])),
    );
  assert.throws(
    () => validateReceived(payload([collection("one"), collection("one")])),
    /Duplicate/,
  );
  const malformed = collection("one", "Денис", [
    { ...bank(), categories: [{ ...category(), rate: -1 }] },
  ]);
  assert.throws(() =>
    mergeReceived([malformed], { id: "one", name: "Денис", banks: [bank()] }),
  );
  assert.throws(() =>
    mergeReceived([collection("one")], {
      id: "one",
      name: "Денис",
      banks: [{ ...bank(), month: "invalid" }],
    }),
  );
});

test("received limits cover collection count and categories across all people", () => {
  const twenty = Array.from({ length: 20 }, (_, index) =>
    collection(String(index)),
  );
  assert.equal(validateReceived(payload(twenty)).collections.length, 20);
  assert.throws(() =>
    mergeReceived(twenty, { name: "Ещё человек", banks: [bank()] }),
  );
  const hundred = Array.from({ length: 100 }, (_, index) =>
    category("Аптеки", String(index)),
  );
  const large = [
    "2026-06",
    "2026-07",
    "2026-08",
    "2026-09",
    "2026-10",
    "2026-11",
  ].flatMap((month) =>
    Array.from({ length: 5 }, (_, index) => ({
      ...bank(month, hundred),
      id: `custom-${index}`,
      name: `Свой банк ${index}`,
    })),
  );
  assert.equal(
    validateReceived(
      payload([
        collection("one", "Денис", large),
        collection("two", "Анна", large),
      ]),
    ).collections.length,
    2,
  );
  assert.throws(
    () =>
      validateReceived(
        payload([
          collection("one", "Денис", large),
          collection("two", "Анна", large),
          collection("three"),
        ]),
      ),
    /Too many received/,
  );
});

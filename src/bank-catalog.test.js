import test from "node:test";
import assert from "node:assert/strict";
import { getSuggestedBanks, INTERNATIONAL_BANKS } from "./bank-catalog.js";

test("Russian locale suggests Russian banks, other locales suggest the international collection", () => {
  const internationalIds = new Set(INTERNATIONAL_BANKS.map((bank) => bank.id));
  assert.equal(internationalIds.size, 10);
  for (const locale of ["ru", "ru-RU", "RU-ru", "ru_RU"]) {
    const banks = getSuggestedBanks(locale);
    assert.ok(banks.some((bank) => bank.id === "sber"));
    assert.ok(banks.some((bank) => bank.id === "tbank"));
    assert.ok(banks.every((bank) => !internationalIds.has(bank.id)));
  }
  for (const locale of ["en", "en-US", "de-DE", "fr", "tr", "", undefined]) {
    assert.deepEqual(
      getSuggestedBanks(locale).map((bank) => bank.id),
      [...internationalIds],
    );
  }
});

test("suggested bank metadata can be edited without mutating the catalog", () => {
  const first = getSuggestedBanks("en");
  first[0].name = "Changed";
  first[0].aliases.push("changed alias");
  const next = getSuggestedBanks("en");
  assert.equal(next[0].name, "Chase");
  assert.ok(!next[0].aliases.includes("changed alias"));
});

test("international suggestions provide monogram metadata without original-logo assets", () => {
  for (const bank of INTERNATIONAL_BANKS) {
    assert.match(bank.id, /^[a-z]+$/);
    assert.match(bank.color, /^#[\da-f]{6}$/i);
    assert.ok(bank.mark.length > 0);
    assert.ok(bank.aliases.length > 0);
    assert.ok(!("logo" in bank));
  }
});

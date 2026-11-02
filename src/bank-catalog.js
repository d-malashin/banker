import { BANKS } from "./domain.js";
import { INTERNATIONAL_BANKS } from "./international-banks.js";

export { INTERNATIONAL_BANKS } from "./international-banks.js";

const internationalIds = new Set(INTERNATIONAL_BANKS.map((bank) => bank.id));

export function getSuggestedBanks(locale = "en") {
  const russian = /^ru(?:[-_]|$)/i.test(String(locale));
  const banks = russian
    ? BANKS.filter((bank) => !internationalIds.has(bank.id))
    : INTERNATIONAL_BANKS;
  return banks.map((bank) => ({ ...bank, aliases: [...bank.aliases] }));
}

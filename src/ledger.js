import { validateData, restoreStoredData } from "./domain.js";

const MAX_RECORDS = 240;
const MAX_TOTAL_CATEGORIES = 3000;
const MAX_SHARE = 16000;
const MONTH_PATTERN = /^(?!0000)\d{4}-(?:0[1-9]|1[0-2])$/;

export function currentMonth(date = new Date()) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()))
    throw new Error("Invalid date");
  return `${String(date.getFullYear()).padStart(4, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function defaultUploadMonth(date = new Date()) {
  const month = currentMonth(date);
  if (date.getDate() < 25) return month;
  return currentMonth(new Date(date.getFullYear(), date.getMonth() + 1, 1));
}

function migrateLegacy(data) {
  return {
    version: 2,
    banks: data.banks.map((bank) => ({
      ...bank,
      month: currentMonth(new Date(bank.updatedAt)),
    })),
  };
}

export function validateLedger(input) {
  if (input?.version === 1)
    return validateLedger(migrateLegacy(validateData(input)));
  if (
    !input ||
    typeof input !== "object" ||
    input.version !== 2 ||
    !Array.isArray(input.banks) ||
    input.banks.length > MAX_RECORDS
  )
    throw new Error("Invalid Banker ledger");
  const byMonth = new Map();
  let total = 0;
  const banks = input.banks.map((record) => {
    if (
      !record ||
      typeof record.month !== "string" ||
      !MONTH_PATTERN.test(record.month)
    )
      throw new Error("Invalid cashback month");
    const bank = validateData({ version: 1, banks: [record] }).banks[0];
    total += bank.categories.length;
    if (total > MAX_TOTAL_CATEGORIES) throw new Error("Too many categories");
    if (!byMonth.has(record.month)) byMonth.set(record.month, []);
    byMonth.get(record.month).push(bank);
    return { ...bank, month: record.month };
  });
  for (const monthlyBanks of byMonth.values())
    validateData({ version: 1, banks: monthlyBanks });
  return { version: 2, banks };
}

export function restoreLedger(input) {
  return input?.version === 1
    ? validateLedger(migrateLegacy(restoreStoredData(input)))
    : validateLedger(input);
}

export function ledgerMonths(banks) {
  return [
    ...new Set(
      banks.filter((bank) => bank.categories.length).map((bank) => bank.month),
    ),
  ]
    .sort()
    .reverse();
}

export function mergeLedger(current, incoming) {
  const previous = validateLedger({ version: 2, banks: current }).banks;
  const additions = validateLedger({ version: 2, banks: incoming }).banks;
  const result = new Map();
  for (const bank of [...previous, ...additions])
    result.set(`${bank.id}:${bank.month}`, bank);
  const combined = [...result.values()];
  const retained = new Set(ledgerMonths(combined).slice(0, 6));
  return validateLedger({
    version: 2,
    banks: combined.filter(
      (bank) => retained.has(bank.month) && bank.categories.length,
    ),
  }).banks;
}

export function selectInitialMonth(banks, date = new Date()) {
  const current = currentMonth(date);
  const populated = banks.filter((bank) => bank.categories.length);
  if (populated.some((bank) => bank.month === current)) return current;
  let latest;
  for (const bank of populated) {
    if (!latest || Date.parse(bank.updatedAt) >= Date.parse(latest.updatedAt))
      latest = bank;
  }
  return latest?.month || current;
}

export function encodeLedgerShare(banks) {
  const bytes = new TextEncoder().encode(
    JSON.stringify(validateLedger({ version: 2, banks })),
  );
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const encoded = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  if (encoded.length > MAX_SHARE)
    throw new Error("Share link too large; export JSON instead");
  return encoded;
}

export function decodeLedgerShare(fragment) {
  if (typeof fragment !== "string") throw new Error("Invalid share link");
  const encoded = fragment.replace(/^#(?:share=)?/, "").replace(/^share=/, "");
  if (
    !encoded ||
    encoded.length > MAX_SHARE ||
    !/^[A-Za-z0-9_-]+$/.test(encoded) ||
    encoded.length % 4 === 1
  )
    throw new Error("Invalid share link");
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  const json = new TextDecoder("utf-8", { fatal: true }).decode(
    Uint8Array.from(binary, (character) => character.charCodeAt(0)),
  );
  return validateLedger(JSON.parse(json)).banks;
}

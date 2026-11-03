import { validateLedger, mergeLedger } from "./ledger.js";

const MAX_COLLECTIONS = 20;
const MAX_CATEGORIES = 6000;

function normalizeName(value) {
  if (typeof value !== "string" || value.length > 60)
    throw new Error("Invalid collection name");
  return value.trim().replace(/\s+/g, " ");
}

export function validateReceived(input) {
  if (
    !input ||
    typeof input !== "object" ||
    input.version !== 1 ||
    !Array.isArray(input.collections) ||
    input.collections.length > MAX_COLLECTIONS
  )
    throw new Error("Invalid received collections");
  const ids = new Set();
  let total = 0;
  const collections = input.collections.map((collection) => {
    if (
      !collection ||
      typeof collection.id !== "string" ||
      !collection.id.trim() ||
      collection.id.length > 100 ||
      typeof collection.importedAt !== "string" ||
      collection.importedAt.length > 40 ||
      !/^\d{4}-\d{2}-\d{2}T/.test(collection.importedAt) ||
      !Number.isFinite(Date.parse(collection.importedAt))
    )
      throw new Error("Invalid received collection");
    const id = collection.id.trim();
    if (ids.has(id)) throw new Error("Duplicate collection");
    ids.add(id);
    const name = Object.hasOwn(collection, "name")
      ? normalizeName(collection.name)
      : "";
    const banks = validateLedger({ version: 2, banks: collection.banks }).banks;
    for (const bank of banks) total += bank.categories.length;
    if (total > MAX_CATEGORIES) throw new Error("Too many received categories");
    return {
      id,
      name,
      banks,
      importedAt: new Date(collection.importedAt).toISOString(),
    };
  });
  return { version: 1, collections };
}

export function mergeReceived(collections, incoming) {
  const current = validateReceived({ version: 1, collections }).collections;
  if (!incoming || typeof incoming !== "object")
    throw new Error("Invalid received collection");
  const id = Object.hasOwn(incoming, "id") ? incoming.id : crypto.randomUUID();
  const existing = current.find((collection) => collection.id === id);
  const candidate = validateReceived({
    version: 1,
    collections: [
      {
        id,
        name: Object.hasOwn(incoming, "name")
          ? incoming.name
          : existing?.name || "",
        banks: incoming.banks,
        importedAt: Object.hasOwn(incoming, "importedAt")
          ? incoming.importedAt
          : new Date().toISOString(),
      },
    ],
  }).collections[0];
  const merged = {
    ...candidate,
    banks: mergeLedger(existing?.banks || [], candidate.banks),
  };
  const next = existing
    ? current.map((collection) =>
        collection.id === candidate.id ? merged : collection,
      )
    : [...current, merged];
  return validateReceived({ version: 1, collections: next }).collections;
}

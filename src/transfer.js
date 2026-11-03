import { validateLedger } from "./ledger.js";

const MAX_SHARE = 16000;

function normalizeOwnerName(value) {
  if (typeof value !== "string" || value.length > 60)
    throw new Error("Invalid owner name");
  return value.trim().replace(/\s+/g, " ");
}

export function createTransfer(banks, ownerName = "") {
  return {
    ...validateLedger({ version: 2, banks }),
    ownerName: normalizeOwnerName(ownerName),
  };
}

export function readTransfer(input) {
  const ledger = validateLedger(input);
  const ownerName = Object.hasOwn(input, "ownerName")
    ? normalizeOwnerName(input.ownerName)
    : "";
  return { ...ledger, ownerName };
}

export function encodeTransfer(banks, ownerName = "") {
  const bytes = new TextEncoder().encode(
    JSON.stringify(createTransfer(banks, ownerName)),
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

export function decodeTransfer(fragment) {
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
  return readTransfer(JSON.parse(json));
}

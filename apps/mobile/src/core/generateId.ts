import * as Crypto from "expo-crypto";

/** UUID v4 for local SQLite rows — `globalThis.crypto` is undefined on React Native. */
export function generateId(): string {
  return Crypto.randomUUID();
}

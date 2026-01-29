import { describe, expect, it } from "vitest";
import { decryptString, encryptString } from "@/lib/encryption";

describe("encryption", () => {
  it("encrypts and decrypts strings", () => {
    process.env.ENCRYPTION_KEY = "a".repeat(64);
    const plainText = "hello-world";
    const cipher = encryptString(plainText);
    const decrypted = decryptString(cipher);
    expect(decrypted).toBe(plainText);
  });
});

import "server-only"
import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto"
import { env } from "./env"

const key = Buffer.from(env.NATIONAL_ID_KEY, "base64")

/** AES-256-GCM. Output: base64(iv | tag | ciphertext). */
export function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64")
}

export function decrypt(payload: string): string {
  const buf = Buffer.from(payload, "base64")
  const decipher = createDecipheriv("aes-256-gcm", key, buf.subarray(0, 12))
  decipher.setAuthTag(buf.subarray(12, 28))
  return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString("utf8")
}

/** Deterministic keyed hash used for uniqueness checks (one account per national ID). */
export function blindIndex(value: string): string {
  return createHmac("sha256", key).update(`nid:${value}`).digest("hex")
}

export function sixDigitCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0")
}

export function hashCode(code: string): string {
  return createHash("sha256").update(`${env.SESSION_SECRET}:${code}`).digest("hex")
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  return ab.length === bb.length && timingSafeEqual(ab, bb)
}

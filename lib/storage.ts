import "server-only"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"
import { env } from "./env"

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

const SIGNATURES: { mime: string; ext: string; test: (b: Buffer) => boolean }[] = [
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/png", ext: "png", test: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { mime: "image/webp", ext: "webp", test: (b) => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
]

export type UploadCheck =
  | { ok: true; buffer: Buffer; mime: string; ext: string; size: number }
  | { ok: false; error: string }

/** Validates by file content (magic bytes), not by the name or the browser-reported type. */
export async function checkImage(file: FormDataEntryValue | null): Promise<UploadCheck> {
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "ارفع الصورة" }
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "حجم الصورة لازم يكون 5 ميجابايت أو أقل" }
  const buffer = Buffer.from(await file.arrayBuffer())
  const sig = SIGNATURES.find((s) => s.test(buffer))
  if (!sig) return { ok: false, error: "الصيغ المسموحة: JPG أو PNG أو WEBP" }
  return { ok: true, buffer, mime: sig.mime, ext: sig.ext, size: file.size }
}

function root() {
  return path.resolve(process.cwd(), env.STORAGE_DIR)
}

/** Stores a private file and returns its storage key (relative path). */
export async function savePrivateFile(folder: string, name: string, buffer: Buffer, ext: string) {
  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "")
  const key = `kyc/${safeFolder}/${name}-${randomUUID()}.${ext}`
  const full = path.join(root(), key)
  await mkdir(path.dirname(full), { recursive: true })
  await writeFile(full, buffer, { flag: "wx" })
  return key
}

export async function readPrivateFile(key: string) {
  const full = path.resolve(root(), key)
  // Block path traversal: the resolved path must stay inside the storage root.
  if (!full.startsWith(root() + path.sep)) throw new Error("Invalid storage key")
  return readFile(full)
}

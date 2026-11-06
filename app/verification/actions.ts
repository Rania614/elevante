"use server"

import { redirect } from "next/navigation"
import type { KycKind, Prisma } from "@prisma/client"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { blindIndex, encrypt } from "@/lib/crypto"
import { parseNationalId } from "@/lib/national-id"
import { profileUpdate } from "@/lib/profile"
import { flatten, fullNameField, profileSchemas, type FieldErrors } from "@/lib/schemas"
import { requireUser } from "@/lib/session"
import { checkImage, savePrivateFile } from "@/lib/storage"
import type { ReviewField } from "@/lib/verification"

export type ResubmitState = { errors: FieldErrors } | null

const FILE_FIELDS: KycKind[] = ["ID_FRONT", "ID_BACK", "SELFIE"]

export async function resubmitAction(_prev: ResubmitState, form: FormData): Promise<ResubmitState> {
  const user = await requireUser()
  if (user.role === "ADMIN" || user.status !== "NEEDS_CHANGES") redirect("/verification")

  // The flagged list is read from the database, never from the form: users can only change what the admin flagged.
  const review = await db.verificationReview.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
  const flagged = new Set((review?.flaggedFields ?? []) as ReviewField[])
  if (!flagged.size) redirect("/verification")

  const raw: Record<string, string> = {}
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v

  const errors: FieldErrors = {}
  const data: Prisma.UserUpdateInput = {}

  if (flagged.has("fullName")) {
    const r = fullNameField.safeParse(raw.fullName ?? "")
    if (r.success) data.fullName = r.data
    else errors.fullName = r.error.issues[0].message
  }

  if (flagged.has("nationalId")) {
    const r = parseNationalId(raw.nationalId ?? "")
    if (!r.ok) errors.nationalId = r.error
    else {
      const hash = blindIndex(r.value)
      const other = await db.user.findFirst({ where: { nationalIdHash: hash, NOT: { id: user.id } }, select: { id: true } })
      if (other) errors.nationalId = "الرقم القومي ده مرتبط بحساب تاني"
      else Object.assign(data, { nationalIdEnc: encrypt(r.value), nationalIdHash: hash, nationalIdLast4: r.value.slice(-4), birthDate: r.info.birthDate })
    }
  }

  if (flagged.has("profile")) {
    const r = profileSchemas[user.role].safeParse(raw)
    if (r.success) Object.assign(data, profileUpdate(user.role, raw))
    else Object.assign(errors, flatten(r.error))
  }

  const uploads: { kind: KycKind; buffer: Buffer; ext: string; mime: string; size: number }[] = []
  for (const kind of FILE_FIELDS) {
    if (!flagged.has(kind)) continue
    const check = await checkImage(form.get(kind))
    if (check.ok) uploads.push({ kind, ...check })
    else errors[kind] = check.error
  }

  if (Object.keys(errors).length) return { errors }

  const saved: { kind: KycKind; storageKey: string; mimeType: string; size: number }[] = []
  for (const u of uploads) {
    saved.push({ kind: u.kind, storageKey: await savePrivateFile(user.id, u.kind.toLowerCase(), u.buffer, u.ext), mimeType: u.mime, size: u.size })
  }

  await db.$transaction(async (tx) => {
    const moved = await tx.user.updateMany({ where: { id: user.id, status: "NEEDS_CHANGES" }, data: { status: "PENDING_REVIEW" } })
    if (!moved.count) return
    if (Object.keys(data).length) await tx.user.update({ where: { id: user.id }, data })
    for (const doc of saved) {
      await tx.kycDocument.updateMany({ where: { userId: user.id, kind: doc.kind, current: true }, data: { current: false } })
      await tx.kycDocument.create({ data: { userId: user.id, ...doc } })
    }
    await audit(tx, { actorId: user.id, action: "verification.resubmitted", targetType: "User", targetId: user.id, meta: { fields: [...flagged] } })
  })
  redirect("/verification")
}

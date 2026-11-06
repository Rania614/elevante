"use server"

import { randomUUID } from "node:crypto"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { Prisma, type KycKind, type Role } from "@prisma/client"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { blindIndex, encrypt } from "@/lib/crypto"
import { parseNationalId } from "@/lib/national-id"
import { issueOtp } from "@/lib/otp"
import { deliverOtp } from "@/lib/otp-delivery"
import { accountSchema, flatten, profileSchemas, type FieldErrors } from "@/lib/schemas"
import { profileCreate } from "@/lib/profile"
import { startSession } from "@/lib/session"
import { checkImage, savePrivateFile } from "@/lib/storage"
import { KYC_KINDS } from "@/lib/verification"

export type RegisterState = { errors: FieldErrors; values: Record<string, string> } | null

const PUBLIC: Role[] = ["ENTREPRENEUR", "SUPPLIER", "INVESTOR"]
// Never echoed back to the browser.
const SECRET_FIELDS = new Set(["password", "confirmPassword", "nationalId"])

export async function registerAction(_prev: RegisterState, form: FormData): Promise<RegisterState> {
  const role = String(form.get("role")) as Role
  if (!PUBLIC.includes(role)) return { errors: { form: "نوع الحساب غير صحيح" }, values: {} }

  const raw: Record<string, string> = {}
  for (const [k, v] of form.entries()) if (typeof v === "string") raw[k] = v
  const values = Object.fromEntries(Object.entries(raw).filter(([k]) => !SECRET_FIELDS.has(k)))

  const account = accountSchema.safeParse(raw)
  const profile = profileSchemas[role as keyof typeof profileSchemas].safeParse(raw)
  const files = await Promise.all(KYC_KINDS.map(async (k) => [k.kind, await checkImage(form.get(k.kind))] as const))

  const errors: FieldErrors = {
    ...(account.success ? {} : flatten(account.error)),
    ...(profile.success ? {} : flatten(profile.error)),
  }
  for (const [kind, check] of files) if (!check.ok) errors[kind] = check.error
  if (!account.success || !profile.success || Object.keys(errors).length) return { errors, values }

  const a = account.data
  const nid = parseNationalId(a.nationalId)
  if (!nid.ok) return { errors: { nationalId: nid.error }, values }
  const nidHash = blindIndex(nid.value)

  const taken = await db.user.findFirst({
    where: { OR: [{ email: a.email }, { phone: a.phone }, { nationalIdHash: nidHash }] },
    select: { email: true, phone: true, nationalIdHash: true },
  })
  if (taken) {
    const e: FieldErrors = {}
    if (taken.email === a.email) e.email = "البريد ده مسجّل بالفعل"
    if (taken.phone === a.phone) e.phone = "رقم الهاتف ده مسجّل بالفعل"
    if (taken.nationalIdHash === nidHash) e.nationalId = "الرقم القومي ده مرتبط بحساب تاني. لو ده حسابك، سجّل الدخول."
    return { errors: e, values }
  }

  // Files are written first under the new user's id; the database rows reference them.
  const userId = randomUUID()
  const docs: { kind: KycKind; storageKey: string; mimeType: string; size: number }[] = []
  for (const [kind, check] of files) {
    if (!check.ok) continue
    const storageKey = await savePrivateFile(userId, kind.toLowerCase(), check.buffer, check.ext)
    docs.push({ kind, storageKey, mimeType: check.mime, size: check.size })
  }

  const passwordHash = await bcrypt.hash(a.password, 12)

  try {
    await db.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          role,
          fullName: a.fullName,
          email: a.email,
          phone: a.phone,
          governorate: a.governorate,
          passwordHash,
          nationalIdEnc: encrypt(nid.value),
          nationalIdHash: nidHash,
          nationalIdLast4: nid.value.slice(-4),
          birthDate: nid.info.birthDate,
          kycDocuments: { create: docs },
          ...profileCreate(role, raw),
        },
      })
      await audit(tx, { actorId: userId, action: "user.registered", targetType: "User", targetId: userId, meta: { role } })
    })
  } catch (err) {
    // A parallel registration took the same email/phone/ID between the check and the insert.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { errors: { form: "البيانات دي اتسجلت بالفعل في حساب تاني. جرّب تسجّل الدخول." }, values }
    }
    throw err
  }

  const code = await issueOtp(userId)
  await deliverOtp(a.phone, code)
  await startSession(userId, role)
  redirect("/verify-phone")
}

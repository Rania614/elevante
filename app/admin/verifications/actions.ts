"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { db } from "@/lib/db"
import { audit } from "@/lib/audit"
import { requireAdmin } from "@/lib/session"
import { REVIEW_FIELD_KEYS, type ReviewField } from "@/lib/verification"

export type ReviewState = { error?: string } | null

const schema = z
  .object({
    userId: z.string().min(1),
    decision: z.enum(["APPROVED", "NEEDS_CHANGES"], { errorMap: () => ({ message: "اختر القرار" }) }),
    flagged: z.array(z.enum(REVIEW_FIELD_KEYS as [ReviewField, ...ReviewField[]])),
    note: z.string().trim().max(1000).optional(),
  })
  .superRefine((d, ctx) => {
    if (d.decision === "NEEDS_CHANGES" && d.flagged.length === 0)
      ctx.addIssue({ code: "custom", message: "حدّد الحقول اللي محتاجة تعديل", path: ["flagged"] })
    if (d.decision === "NEEDS_CHANGES" && !d.note)
      ctx.addIssue({ code: "custom", message: "اكتب ملاحظة توضّح المطلوب للمستخدم", path: ["note"] })
  })

export async function reviewAction(_prev: ReviewState, form: FormData): Promise<ReviewState> {
  const admin = await requireAdmin()
  const parsed = schema.safeParse({
    userId: form.get("userId"),
    decision: form.get("decision"),
    flagged: form.getAll("flagged"),
    note: form.get("note") || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }
  const { userId, decision, flagged, note } = parsed.data
  if (userId === admin.id) return { error: "مينفعش تراجع حسابك" }

  const done = await db.$transaction(async (tx) => {
    // Only a PENDING_REVIEW account can be decided; a second admin acting at the same time gets count 0.
    const moved = await tx.user.updateMany({
      where: { id: userId, status: "PENDING_REVIEW", role: { not: "ADMIN" } },
      data: { status: decision },
    })
    if (!moved.count) return false
    await tx.verificationReview.create({
      data: { userId, reviewerId: admin.id, decision, flaggedFields: decision === "APPROVED" ? [] : flagged, note },
    })
    await audit(tx, {
      actorId: admin.id,
      action: decision === "APPROVED" ? "verification.approved" : "verification.changes_requested",
      targetType: "User",
      targetId: userId,
      meta: { flagged },
    })
    return true
  })
  if (!done) return { error: "الطلب ده اتراجع بالفعل أو حالته اتغيرت. حدّث الصفحة." }
  redirect("/admin/verifications")
}

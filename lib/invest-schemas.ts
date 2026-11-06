import { z } from "zod"
import { addDays, cairoEndOfDay, cairoToday } from "./dates"
import { FULL_BPS, MAX_MILESTONES, MIN_MILESTONES, parsePercent } from "./invest"
import { parseEgp } from "./money"

export type MilestoneInput = { title: string; due: string; share: string; proof: string }

const money = (msg: string) =>
  z.string().transform((v, ctx) => {
    const p = parseEgp(v)
    if (p == null || p <= 0) {
      ctx.addIssue({ code: "custom", message: msg })
      return z.NEVER
    }
    return p
  })

const date = (max: number, msg: string) =>
  z.string().transform((v, ctx) => {
    const today = cairoToday()
    const d = cairoEndOfDay(v)
    if (!d || v < today || v > addDays(today, max)) {
      ctx.addIssue({ code: "custom", message: msg })
      return z.NEVER
    }
    return { day: v, at: d }
  })

const milestoneSchema = z.object({
  title: z.string().trim().min(3, "اكتب عنوان المرحلة").max(120),
  due: date(730, "تاريخ غير صحيح"),
  share: z.string().transform((v, ctx) => {
    const bps = parsePercent(v)
    if (bps == null) {
      ctx.addIssue({ code: "custom", message: "نسبة غير صحيحة" })
      return z.NEVER
    }
    return bps
  }),
  proof: z.string().trim().min(3, "اكتب الإثبات المطلوب").max(200),
})

export const roundSchema = z
  .object({
    title: z.string().trim().min(3, "اكتب عنوان الجولة").max(120),
    pitch: z.string().trim().min(100, "اكتب وصف للمشروع لا يقل عن 100 حرف").max(3000),
    useOfFunds: z.string().trim().min(30, "وضّح هيتصرف التمويل في إيه (30 حرف على الأقل)").max(2000),
    target: money("اكتب المبلغ المطلوب بالجنيه"),
    equity: z.string().transform((v, ctx) => {
      const bps = parsePercent(v)
      if (bps == null || bps > 9000) {
        ctx.addIssue({ code: "custom", message: "اكتب نسبة بين 0.01% و 90%" })
        return z.NEVER
      }
      return bps
    }),
    minTicket: money("اكتب أقل مساهمة بالجنيه"),
    closesAt: date(90, "اختر تاريخ من النهارده لحد 90 يوم"),
    milestones: z.array(milestoneSchema).min(MIN_MILESTONES, `أضف ${MIN_MILESTONES} مراحل على الأقل`).max(MAX_MILESTONES, `الحد الأقصى ${MAX_MILESTONES} مراحل`),
  })
  .superRefine((d, ctx) => {
    if (d.minTicket > d.target) ctx.addIssue({ code: "custom", path: ["minTicket"], message: "أقل مساهمة لازم تكون أقل من المبلغ المطلوب" })
    const total = d.milestones.reduce((a, m) => a + m.share, 0)
    if (total !== FULL_BPS) ctx.addIssue({ code: "custom", path: ["milestones"], message: `مجموع نسب المراحل لازم يكون 100% (دلوقتي ${total / 100}%)` })
    for (let i = 1; i < d.milestones.length; i++) {
      if (d.milestones[i].due.day <= d.milestones[i - 1].due.day)
        ctx.addIssue({ code: "custom", path: ["milestones"], message: "مواعيد المراحل لازم تكون بالترتيب، كل مرحلة بعد اللي قبلها" })
    }
  })

/** Reads the parallel milestone arrays submitted by the round form. */
export function readMilestones(form: FormData): MilestoneInput[] {
  const titles = form.getAll("mTitle").map(String)
  const dues = form.getAll("mDue").map(String)
  const shares = form.getAll("mShare").map(String)
  const proofs = form.getAll("mProof").map(String)
  return titles.map((title, i) => ({ title, due: dues[i] ?? "", share: shares[i] ?? "", proof: proofs[i] ?? "" }))
}

export const investmentOfferSchema = z.object({
  roundId: z.string().min(1),
  amount: money("اكتب مبلغ الاستثمار بالجنيه"),
  note: z.string().trim().max(1000).optional().transform((v) => v || null),
})

export const proofSchema = z.object({
  milestoneId: z.string().min(1),
  summary: z.string().trim().min(30, "اكتب ملخص لما تم إنجازه (30 حرف على الأقل)").max(3000),
  proofUrl: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .refine((v) => v == null || /^https:\/\/[^\s]+$/i.test(v), "الرابط لازم يبدأ بـ https://"),
})

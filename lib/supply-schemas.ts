import { z } from "zod"
import { addDays, cairoEndOfDay, cairoToday } from "./dates"
import { parseEgp } from "./money"
import { normalizeDigits } from "./national-id"
import { PRODUCT_CATEGORIES, SERVICE_CATEGORIES, UNITS } from "./supply"

const MAX_DEADLINE_DAYS = 90

const optionalMoney = z
  .string()
  .optional()
  .transform((v, ctx) => {
    if (!v || !v.trim()) return null
    const p = parseEgp(v)
    if (p == null || p <= 0) {
      ctx.addIssue({ code: "custom", message: "مبلغ غير صحيح" })
      return z.NEVER
    }
    return p
  })

export const requestSchema = z
  .object({
    kind: z.enum(["PRODUCT", "SERVICE"], { errorMap: () => ({ message: "اختر نوع الطلب" }) }),
    title: z.string().trim().min(3, "اكتب عنوان واضح للطلب").max(120),
    category: z.string().min(1, "اختر التصنيف"),
    quantity: z
      .string()
      .transform((v) => Number(normalizeDigits(v)))
      .pipe(z.number({ invalid_type_error: "كمية غير صحيحة" }).int("الكمية لازم تكون رقم صحيح").min(1, "الكمية لازم تكون 1 أو أكتر").max(10_000_000)),
    unit: z.enum(UNITS as [string, ...string[]], { errorMap: () => ({ message: "اختر الوحدة" }) }),
    budgetMin: optionalMoney,
    budgetMax: optionalMoney,
    offersDeadline: z.string().transform((v, ctx) => {
      const today = cairoToday()
      if (v < today || v > addDays(today, MAX_DEADLINE_DAYS)) {
        ctx.addIssue({ code: "custom", message: `اختر تاريخ من النهارده لحد ${MAX_DEADLINE_DAYS} يوم` })
        return z.NEVER
      }
      const d = cairoEndOfDay(v)
      if (!d) {
        ctx.addIssue({ code: "custom", message: "تاريخ غير صحيح" })
        return z.NEVER
      }
      return d
    }),
    description: z.string().trim().min(30, "اكتب المواصفات بتفصيل أكتر (30 حرف على الأقل)").max(3000),
  })
  .superRefine((d, ctx) => {
    const cats = d.kind === "PRODUCT" ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES
    if (!cats.includes(d.category)) ctx.addIssue({ code: "custom", path: ["category"], message: "التصنيف مش مناسب لنوع الطلب" })
    if (d.budgetMin != null && d.budgetMax != null && d.budgetMax < d.budgetMin)
      ctx.addIssue({ code: "custom", path: ["budgetMax"], message: "الحد الأقصى لازم يكون أكبر من الحد الأدنى" })
  })

export const offerSchema = z.object({
  requestId: z.string().min(1),
  price: z.string().transform((v, ctx) => {
    const p = parseEgp(v)
    if (p == null || p <= 0) {
      ctx.addIssue({ code: "custom", message: "اكتب السعر الإجمالي بالجنيه" })
      return z.NEVER
    }
    return p
  }),
  deliveryDays: z
    .string()
    .transform((v) => Number(normalizeDigits(v)))
    .pipe(z.number({ invalid_type_error: "عدد أيام غير صحيح" }).int().min(1, "يوم واحد على الأقل").max(365, "الحد الأقصى 365 يوم")),
  note: z.string().trim().max(1000).optional().transform((v) => v || null),
})

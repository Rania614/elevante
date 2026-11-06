import { z } from "zod"
import { normalizeDigits, parseNationalId } from "./national-id"
import { GOVERNORATES, SECTORS, TICKET_RANGES } from "./verification"

const text = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, `الحد الأقصى ${max} حرف`)

export const egyptPhone = z
  .string()
  .transform((v) => normalizeDigits(v).replace(/^\+?20/, "").replace(/^0/, ""))
  .refine((v) => /^1[0125]\d{8}$/.test(v), "رقم موبايل مصري غير صحيح (مثال: 10 1234 5678)")
  .transform((v) => `+20${v}`)

export const nationalIdField = z.string().superRefine((v, ctx) => {
  const r = parseNationalId(v)
  if (!r.ok) ctx.addIssue({ code: z.ZodIssueCode.custom, message: r.error })
})

export const fullNameField = text(6, 120, "اكتب الاسم بالكامل كما في البطاقة").refine(
  (v) => v.split(/\s+/).length >= 3,
  "اكتب الاسم ثلاثي على الأقل كما في البطاقة",
)

export const accountSchema = z
  .object({
    fullName: fullNameField,
    email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صحيح").max(160),
    phone: egyptPhone,
    governorate: z.enum(GOVERNORATES as [string, ...string[]], { errorMap: () => ({ message: "اختر المحافظة" }) }),
    password: z
      .string()
      .min(8, "8 أحرف على الأقل")
      .max(72, "الحد الأقصى 72 حرف")
      .refine((v) => /[A-Za-z؀-ۿ]/.test(v) && /\d/.test(v), "لازم تحتوي على حروف وأرقام"),
    confirmPassword: z.string(),
    nationalId: nationalIdField,
    terms: z.literal("on", { errorMap: () => ({ message: "لازم توافق على الإقرار والشروط" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "كلمتا المرور غير متطابقتين" })

export const supplierProfileSchema = z.object({
  supplyType: z.enum(["PRODUCTS", "SERVICES", "BOTH"], { errorMap: () => ({ message: "اختر نوع ما تقدّمه" }) }),
  businessName: text(2, 120, "اكتب الاسم التجاري أو المهني"),
  commercialRegNo: z.string().trim().max(40).optional().transform((v) => v || undefined),
})

export const entrepreneurProfileSchema = z.object({
  projectName: text(2, 120, "اكتب اسم المشروع"),
  sector: z.enum(SECTORS as [string, ...string[]], { errorMap: () => ({ message: "اختر القطاع" }) }),
  stage: z.enum(["IDEA", "PROTOTYPE", "OPERATING", "REVENUE"], { errorMap: () => ({ message: "اختر مرحلة المشروع" }) }),
  description: text(150, 1500, "اكتب وصفًا للفكرة لا يقل عن 150 حرف"),
})

export const investorProfileSchema = z.object({
  investorType: z.enum(["INDIVIDUAL", "COMPANY", "FUND"], { errorMap: () => ({ message: "اختر نوع المستثمر" }) }),
  ticketRange: z.enum(TICKET_RANGES as [string, ...string[]], { errorMap: () => ({ message: "اختر حجم الاستثمار" }) }),
  organization: z.string().trim().max(120).optional().transform((v) => v || undefined),
})

export const profileSchemas = {
  SUPPLIER: supplierProfileSchema,
  ENTREPRENEUR: entrepreneurProfileSchema,
  INVESTOR: investorProfileSchema,
} as const

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صحيح"),
  password: z.string().min(1, "اكتب كلمة المرور"),
})

export type FieldErrors = Record<string, string>

export function flatten(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form")
    if (!out[key]) out[key] = issue.message
  }
  return out
}

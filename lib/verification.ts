import type { AccountStatus, InvestorType, KycKind, ProjectStage, Role, SupplyType } from "@prisma/client"

/** Fields an admin can flag for correction. The user can only edit flagged fields on resubmission. */
export const REVIEW_FIELDS = {
  fullName: "الاسم بالكامل",
  nationalId: "الرقم القومي",
  ID_FRONT: "صورة وجه البطاقة",
  ID_BACK: "صورة ظهر البطاقة",
  SELFIE: "صورة السيلفي مع البطاقة",
  profile: "بيانات النشاط",
} as const
export type ReviewField = keyof typeof REVIEW_FIELDS
export const REVIEW_FIELD_KEYS = Object.keys(REVIEW_FIELDS) as ReviewField[]

export const KYC_KINDS: { kind: KycKind; label: string; hint: string }[] = [
  { kind: "ID_FRONT", label: "صورة وجه البطاقة", hint: "صورة واضحة كل البيانات فيها مقروءة" },
  { kind: "ID_BACK", label: "صورة ظهر البطاقة", hint: "صورة واضحة لظهر نفس البطاقة" },
  { kind: "SELFIE", label: "صورة سيلفي مع البطاقة", hint: "وشك والبطاقة باينين في نفس الصورة" },
]

export const ROLE_LABELS: Record<Role, string> = {
  ENTREPRENEUR: "رائد أعمال",
  SUPPLIER: "مورد / مقدم خدمة",
  INVESTOR: "مستثمر",
  ADMIN: "أدمن",
}

export const STATUS_LABELS: Record<AccountStatus, { label: string; tone: "warn" | "danger" | "success" | "neutral" }> = {
  PENDING_PHONE: { label: "بانتظار تأكيد الهاتف", tone: "warn" },
  PENDING_REVIEW: { label: "قيد المراجعة", tone: "warn" },
  NEEDS_CHANGES: { label: "مطلوب تعديل", tone: "danger" },
  APPROVED: { label: "موثّق", tone: "success" },
  SUSPENDED: { label: "موقوف", tone: "neutral" },
}

export const SUPPLY_TYPES: Record<SupplyType, string> = { PRODUCTS: "منتجات ومواد خام", SERVICES: "خدمات", BOTH: "الاتنين" }
export const STAGES: Record<ProjectStage, string> = { IDEA: "فكرة", PROTOTYPE: "نموذج أولي", OPERATING: "بدأ التشغيل", REVENUE: "يحقق مبيعات" }
export const INVESTOR_TYPES: Record<InvestorType, string> = { INDIVIDUAL: "فرد", COMPANY: "شركة", FUND: "صندوق استثمار" }
export const SECTORS = ["أغذية ومشروبات", "تجارة إلكترونية", "تكنولوجيا", "حرف ومنتجات يدوية", "أزياء ومنسوجات", "زراعة", "تعليم", "صحة", "أخرى"]
export const TICKET_RANGES = ["أقل من 100 ألف ج.م", "100 ألف – 500 ألف ج.م", "500 ألف – 2 مليون ج.م", "أكثر من 2 مليون ج.م"]
export const GOVERNORATES = ["القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية", "الشرقية", "الغربية", "المنوفية", "البحيرة", "أسيوط", "سوهاج", "المنيا", "أخرى"]

export const PUBLIC_ROLES = ["entrepreneur", "supplier", "investor"] as const
export type PublicRoleSlug = (typeof PUBLIC_ROLES)[number]
export const SLUG_TO_ROLE: Record<PublicRoleSlug, Exclude<Role, "ADMIN">> = {
  entrepreneur: "ENTREPRENEUR",
  supplier: "SUPPLIER",
  investor: "INVESTOR",
}

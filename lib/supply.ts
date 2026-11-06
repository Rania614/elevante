// Pure rules for the supply flow. Server actions enforce them with conditional
// database updates; keeping them here makes them easy to test and reuse in the UI.
import type { OfferStatus, OrderStatus, RequestKind, RequestStatus, SupplyType } from "@prisma/client"

export const KIND_LABELS: Record<RequestKind, string> = { PRODUCT: "منتج / مادة خام", SERVICE: "خدمة" }

export const PRODUCT_CATEGORIES = ["مواد غذائية خام", "تعبئة وتغليف", "أقمشة وغزول", "مواد بناء", "كيماويات ومنظفات", "بلاستيك ومعادن", "مستلزمات زراعية", "أخرى"]
export const SERVICE_CATEGORIES = ["استشارات قانونية", "محاسبة وضرائب", "دراسات جدوى", "تسويق ومحتوى", "تصميم وهوية بصرية", "تطوير برمجيات", "شحن ولوجستيات", "تصوير وإنتاج", "أخرى"]
export const UNITS = ["وحدة", "كجم", "طن", "لتر", "متر", "كرتونة", "ساعة عمل", "مشروع"]

export const REQUEST_STATUS: Record<RequestStatus, { label: string; tone: "success" | "aqua" | "neutral" }> = {
  OPEN: { label: "مفتوح", tone: "success" },
  AWARDED: { label: "تم قبول عرض", tone: "aqua" },
  CLOSED: { label: "مغلق", tone: "neutral" },
}

export const OFFER_STATUS: Record<OfferStatus, { label: string; tone: "warn" | "aqua" | "danger" | "neutral" }> = {
  PENDING: { label: "قيد الانتظار", tone: "warn" },
  ACCEPTED: { label: "مقبول", tone: "aqua" },
  REJECTED: { label: "مرفوض", tone: "danger" },
  WITHDRAWN: { label: "مسحوب", tone: "neutral" },
}

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: "aqua" | "warn" | "success" }> = {
  ACCEPTED: { label: "مقبول — لم يبدأ", tone: "aqua" },
  IN_PROGRESS: { label: "قيد التنفيذ", tone: "warn" },
  DELIVERED: { label: "تم التسليم — بانتظار التأكيد", tone: "warn" },
  COMPLETED: { label: "مكتمل", tone: "success" },
}

export const ORDER_FLOW: OrderStatus[] = ["ACCEPTED", "IN_PROGRESS", "DELIVERED", "COMPLETED"]

/** Can a supplier submit or edit an offer on this request right now? */
export function isAcceptingOffers(req: { status: RequestStatus; offersDeadline: Date }, now = new Date()) {
  return req.status === "OPEN" && req.offersDeadline.getTime() >= now.getTime()
}

/** Can the supplier still change this offer (edit / withdraw / resubmit)? */
export function isOfferEditable(status: OfferStatus) {
  return status === "PENDING" || status === "WITHDRAWN"
}

type Party = "buyer" | "supplier"

/**
 * Who moves an order forward:
 *   supplier: ACCEPTED → IN_PROGRESS → DELIVERED
 *   buyer:    DELIVERED → COMPLETED (confirms receipt)
 */
export function nextOrderStep(status: OrderStatus, party: Party): { to: OrderStatus; label: string } | null {
  if (party === "supplier" && status === "ACCEPTED") return { to: "IN_PROGRESS", label: "بدء التنفيذ" }
  if (party === "supplier" && status === "IN_PROGRESS") return { to: "DELIVERED", label: "تم التسليم" }
  if (party === "buyer" && status === "DELIVERED") return { to: "COMPLETED", label: "تأكيد الاستلام" }
  return null
}

export function stampFor(to: OrderStatus): "startedAt" | "deliveredAt" | "completedAt" | null {
  return to === "IN_PROGRESS" ? "startedAt" : to === "DELIVERED" ? "deliveredAt" : to === "COMPLETED" ? "completedAt" : null
}

/** Which request kinds a supplier can bid on, from their registration choice. */
export function kindsFor(supplyType: SupplyType | undefined): RequestKind[] {
  if (supplyType === "PRODUCTS") return ["PRODUCT"]
  if (supplyType === "SERVICES") return ["SERVICE"]
  return ["PRODUCT", "SERVICE"]
}

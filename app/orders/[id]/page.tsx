import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ConfirmAction } from "@/components/confirm-action"
import { Badge, Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { nextOrderStep, ORDER_FLOW, ORDER_STATUS } from "@/lib/supply"
import { cn, formatDateTime } from "@/lib/utils"
import { advanceOrderAction } from "../actions"

export const metadata: Metadata = { title: "تفاصيل الطلب" }

const STEP_TEXT = {
  ACCEPTED: "تم قبول العرض",
  IN_PROGRESS: "بدأ التنفيذ",
  DELIVERED: "المورد سلّم",
  COMPLETED: "رائد الأعمال أكّد الاستلام",
} as const

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireApproved()
  const { id } = await params
  const order = await db.order.findFirst({
    where: { id, OR: [{ buyerId: user.id }, { supplierId: user.id }] },
    include: {
      request: { select: { id: true, title: true, quantity: true, unit: true } },
      offer: { select: { deliveryDays: true, note: true } },
      buyer: { select: { fullName: true, phone: true, entrepreneurProfile: { select: { projectName: true } } } },
      supplier: { select: { fullName: true, phone: true, supplierProfile: { select: { businessName: true } } } },
    },
  })
  if (!order) notFound()

  const party = order.supplierId === user.id ? "supplier" : "buyer"
  const step = nextOrderStep(order.status, party)
  const reached = ORDER_FLOW.indexOf(order.status)
  const stamps = { ACCEPTED: order.createdAt, IN_PROGRESS: order.startedAt, DELIVERED: order.deliveredAt, COMPLETED: order.completedAt }
  const st = ORDER_STATUS[order.status]

  return (
    <AppShell user={user} active="/orders">
      <Link href="/orders" className="text-sm font-bold text-steel">→ رجوع للطلبات الجارية</Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted" dir="ltr">#{order.id.slice(-8).toUpperCase()}</p>
            <h1 className="text-2xl font-extrabold">{order.request.title}</h1>
            <p className="mt-1 text-sm text-muted">{order.request.quantity.toLocaleString("en-US")} {order.request.unit} · خلال {order.offer.deliveryDays} يوم</p>
          </div>
          <Badge tone={st.tone} dot>{st.label}</Badge>
        </div>

        <ol className="grid gap-4 rounded-2xl bg-brand-tile p-4 sm:grid-cols-4" aria-label="مراحل الطلب">
          {ORDER_FLOW.map((s, i) => {
            const done = i <= reached
            return (
              <li key={s} className="flex items-start gap-2.5" aria-current={i === reached ? "step" : undefined}>
                <span className={cn("flex h-8 w-8 flex-none items-center justify-center rounded-full text-xs font-bold", done ? "bg-brand-panel text-white" : "border border-aqua bg-white text-muted")}>
                  {done ? <Check size={15} strokeWidth={2.6} aria-hidden /> : i + 1}
                </span>
                <span>
                  <span className="block text-sm font-bold">{STEP_TEXT[s]}</span>
                  <span className="block text-xs text-muted">{stamps[s] ? formatDateTime(stamps[s]!) : "—"}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <h2 className="font-bold">الأطراف</h2>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-line p-3">
              <dt className="text-muted">رائد الأعمال</dt>
              <dd className="mt-1 font-bold">{order.buyer.fullName}</dd>
              <dd className="text-muted">{order.buyer.entrepreneurProfile?.projectName}</dd>
              <dd className="mt-1" dir="ltr">{order.buyer.phone}</dd>
            </div>
            <div className="rounded-xl border border-line p-3">
              <dt className="text-muted">المورد</dt>
              <dd className="mt-1 font-bold">{order.supplier.supplierProfile?.businessName ?? order.supplier.fullName}</dd>
              <dd className="text-muted">{order.supplier.fullName}</dd>
              <dd className="mt-1" dir="ltr">{order.supplier.phone}</dd>
            </div>
          </dl>
          {order.offer.note ? <p className="rounded-xl bg-brand-tile p-3 text-sm leading-7">ملاحظة المورد: {order.offer.note}</p> : null}
        </Card>

        <Card>
          <h2 className="font-bold">القيمة</h2>
          <div className="text-3xl font-extrabold">{formatEgp(order.amountPiasters)}</div>
          <Note>الدفع والضمان جايين في المرحلة الجاية. دلوقتي الطرفين بيتابعوا التنفيذ هنا.</Note>
          {step ? (
            <ConfirmAction
              action={advanceOrderAction}
              fields={{ orderId: order.id, from: order.status }}
              label={step.label}
              confirmLabel="تأكيد"
              question={party === "buyer" ? "تأكيد إنك استلمتي الطلب كامل ومطابق؟ الخطوة دي نهائية." : `تأكيد: ${step.label}؟`}
              size="md"
            />
          ) : order.status !== "COMPLETED" ? (
            <p className="text-sm text-muted">{party === "buyer" ? "مستنيين خطوة من المورد." : "مستنيين تأكيد الاستلام من رائد الأعمال."}</p>
          ) : (
            <Note tone="success">الطلب مكتمل.</Note>
          )}
        </Card>
      </div>
    </AppShell>
  )
}

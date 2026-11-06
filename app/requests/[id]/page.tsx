import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AppShell, EmptyState } from "@/components/app-shell"
import { ConfirmAction } from "@/components/confirm-action"
import { RequestSummary } from "@/components/request-summary"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { OFFER_STATUS } from "@/lib/supply"
import { cn, formatDateTime } from "@/lib/utils"
import { acceptOfferAction, closeRequestAction } from "../actions"

export const metadata: Metadata = { title: "تفاصيل الطلب" }

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireApproved("ENTREPRENEUR")
  const { id } = await params
  const request = await db.supplyRequest.findFirst({
    where: { id, entrepreneurId: user.id },
    include: {
      order: { select: { id: true } },
      offers: {
        where: { status: { not: "WITHDRAWN" } },
        orderBy: [{ status: "asc" }, { pricePiasters: "asc" }],
        include: { supplier: { select: { fullName: true, supplierProfile: { select: { businessName: true } } } } },
      },
    },
  })
  if (!request) notFound()

  const pending = request.offers.filter((o) => o.status === "PENDING")
  const lowest = pending.length ? Math.min(...pending.map((o) => o.pricePiasters)) : null
  const fastest = pending.length ? Math.min(...pending.map((o) => o.deliveryDays)) : null

  return (
    <AppShell user={user} active="/requests">
      <Link href="/requests" className="text-sm font-bold text-steel">→ رجوع لطلباتي</Link>
      <RequestSummary request={request} />

      {request.order ? (
        <Card className="flex-row flex-wrap items-center justify-between gap-3">
          <span className="font-bold">قبلتي عرض على الطلب ده، واتعمل طلب تنفيذ.</span>
          <ButtonLink href={`/orders/${request.order.id}`}>متابعة الطلب</ButtonLink>
        </Card>
      ) : null}

      <section className="flex flex-col gap-4" aria-labelledby="offers-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="offers-h" className="text-xl font-extrabold">العروض ({request.offers.length})</h2>
          {request.status === "OPEN" ? (
            <ConfirmAction action={closeRequestAction} fields={{ requestId: request.id }} label="إغلاق الطلب بدون قبول" confirmLabel="إغلاق الطلب" question="الطلب هيتقفل والعروض المعلّقة هتترفض. متأكدة؟" variant="outline" />
          ) : null}
        </div>

        {request.offers.length === 0 ? (
          <EmptyState title="لسه مفيش عروض" text="الطلب ظاهر لكل الموردين الموثّقين. هتلاقي العروض هنا أول ما توصل." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {request.offers.map((o) => {
              const st = OFFER_STATUS[o.status]
              return (
                <article key={o.id} className={cn("flex flex-col gap-3 rounded-2xl border bg-white p-5 shadow-card", o.status === "ACCEPTED" ? "border-2 border-steel" : "border-ice")}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold">{o.supplier.supplierProfile?.businessName ?? o.supplier.fullName}</div>
                      <div className="text-xs text-muted">آخر تحديث {formatDateTime(o.updatedAt)}</div>
                    </div>
                    <Badge tone={st.tone} dot>{st.label}</Badge>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 rounded-xl bg-brand-tile p-3 text-sm">
                    <div><dt className="text-muted">السعر الإجمالي</dt><dd className="font-bold">{formatEgp(o.pricePiasters)}</dd></div>
                    <div><dt className="text-muted">مدة التنفيذ</dt><dd className="font-bold">{o.deliveryDays} يوم</dd></div>
                  </dl>
                  <div className="flex flex-wrap gap-1.5">
                    {o.status === "PENDING" && o.pricePiasters === lowest && pending.length > 1 ? <Badge tone="success">الأقل سعرًا</Badge> : null}
                    {o.status === "PENDING" && o.deliveryDays === fastest && pending.length > 1 ? <Badge tone="aqua">الأسرع</Badge> : null}
                  </div>
                  {o.note ? <p className="text-sm leading-7 text-muted">{o.note}</p> : null}
                  {o.status === "PENDING" && request.status === "OPEN" ? (
                    <ConfirmAction
                      action={acceptOfferAction}
                      fields={{ offerId: o.id }}
                      label="قبول العرض"
                      confirmLabel="تأكيد القبول"
                      question={`قبول عرض ${formatEgp(o.pricePiasters)}؟ باقي العروض هتترفض تلقائيًا.`}
                    />
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </section>
    </AppShell>
  )
}

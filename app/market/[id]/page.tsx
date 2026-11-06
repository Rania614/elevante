import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { ConfirmAction } from "@/components/confirm-action"
import { RequestSummary } from "@/components/request-summary"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp, piastersToInput } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { isAcceptingOffers, isOfferEditable, OFFER_STATUS } from "@/lib/supply"
import { kindsFor } from "@/lib/supply"
import { withdrawOfferAction } from "../actions"
import { OfferForm } from "./offer-form"

export const metadata: Metadata = { title: "تفاصيل طلب التوريد" }

export default async function MarketRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireApproved("SUPPLIER")
  const { id } = await params
  const [request, profile] = await Promise.all([
    db.supplyRequest.findUnique({
      where: { id },
      include: {
        entrepreneur: { select: { entrepreneurProfile: { select: { projectName: true, sector: true } } } },
        offers: { where: { supplierId: user.id } },
        order: { select: { id: true, supplierId: true } },
      },
    }),
    db.supplierProfile.findUnique({ where: { userId: user.id }, select: { supplyType: true } }),
  ])
  // Suppliers only see open requests they could bid on, or requests they already bid on.
  if (!request) notFound()
  const mine = request.offers[0]
  if (!mine && (!isAcceptingOffers(request) || !kindsFor(profile?.supplyType).includes(request.kind))) notFound()

  const canEdit = isAcceptingOffers(request) && (!mine || isOfferEditable(mine.status))
  const p = request.entrepreneur.entrepreneurProfile

  return (
    <AppShell user={user} active="/market">
      <Link href="/market" className="text-sm font-bold text-steel">→ رجوع لطلبات التوريد</Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <RequestSummary request={request} owner={p ? `${p.projectName} · ${p.sector}` : undefined} />

        <div className="flex flex-col gap-4">
          {mine ? (
            <Card>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold">عرضك</h2>
                <Badge tone={OFFER_STATUS[mine.status].tone} dot>{OFFER_STATUS[mine.status].label}</Badge>
              </div>
              <p className="text-sm">{formatEgp(mine.pricePiasters)} · {mine.deliveryDays} يوم</p>
              {mine.status === "ACCEPTED" && request.order?.supplierId === user.id ? <ButtonLink href={`/orders/${request.order.id}`} full>متابعة الطلب</ButtonLink> : null}
              {mine.status === "REJECTED" ? <Note>رائد الأعمال اختار عرض تاني أو قفل الطلب.</Note> : null}
              {mine.status === "PENDING" && canEdit ? (
                <ConfirmAction action={withdrawOfferAction} fields={{ offerId: mine.id }} label="سحب العرض" confirmLabel="سحب" question="العرض هيختفي من عند رائد الأعمال. تقدر تقدّمه تاني قبل الموعد." variant="outline" />
              ) : null}
            </Card>
          ) : null}

          {canEdit ? (
            <OfferForm
              requestId={request.id}
              defaults={mine ? { price: piastersToInput(mine.pricePiasters), deliveryDays: String(mine.deliveryDays), note: mine.note ?? "" } : undefined}
              isUpdate={Boolean(mine && mine.status === "PENDING")}
            />
          ) : !mine ? null : mine.status === "PENDING" ? (
            <Note>موعد العروض انتهى. عرضك محفوظ وبانتظار قرار رائد الأعمال.</Note>
          ) : null}
        </div>
      </div>
    </AppShell>
  )
}

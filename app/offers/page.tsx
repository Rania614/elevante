import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { OFFER_STATUS } from "@/lib/supply"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "عروضي" }

export default async function MyOffersPage() {
  const user = await requireApproved("SUPPLIER")
  const offers = await db.offer.findMany({
    where: { supplierId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { request: { select: { id: true, title: true, offersDeadline: true } }, order: { select: { id: true } } },
  })

  return (
    <AppShell user={user} active="/offers">
      <PageTitle title="عروضي" subtitle="كل العروض اللي قدّمتها وحالة كل واحد." action={<ButtonLink href="/market" variant="outline">طلبات التوريد</ButtonLink>} />
      {offers.length === 0 ? (
        <EmptyState title="لسه ما قدّمتش عروض" text="تصفّح طلبات التوريد المفتوحة وقدّم أول عرض." action={<ButtonLink href="/market">تصفّح الطلبات</ButtonLink>} />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-steel text-white">
                <tr>{["الطلب", "قيمة العرض", "المدة", "آخر موعد", "الحالة", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3.5 font-bold">{o.request.title}</td>
                    <td className="px-4 py-3.5">{formatEgp(o.pricePiasters)}</td>
                    <td className="px-4 py-3.5">{o.deliveryDays} يوم</td>
                    <td className="px-4 py-3.5">{formatDate(o.request.offersDeadline)}</td>
                    <td className="px-4 py-3.5"><Badge tone={OFFER_STATUS[o.status].tone} dot>{OFFER_STATUS[o.status].label}</Badge></td>
                    <td className="px-4 py-3.5 text-left">
                      <Link href={o.order ? `/orders/${o.order.id}` : `/market/${o.request.id}`} className="font-bold text-steel">{o.order ? "متابعة الطلب" : "عرض"}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppShell>
  )
}

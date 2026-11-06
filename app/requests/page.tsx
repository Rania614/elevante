import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { KIND_LABELS, REQUEST_STATUS } from "@/lib/supply"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "طلباتي" }

export default async function MyRequestsPage() {
  const user = await requireApproved("ENTREPRENEUR")
  const requests = await db.supplyRequest.findMany({
    where: { entrepreneurId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { offers: { where: { status: { in: ["PENDING", "ACCEPTED"] } } } } }, order: { select: { id: true } } },
  })

  return (
    <AppShell user={user} active="/requests">
      <PageTitle title="طلباتي" subtitle="طلبات التوريد اللي نشرتيها، والعروض اللي وصلت عليها." action={<ButtonLink href="/requests/new">طلب توريد جديد</ButtonLink>} />
      {requests.length === 0 ? (
        <EmptyState title="لسه مفيش طلبات" text="انشري أول طلب توريد، والموردين الموثّقين هيبدأوا يقدّموا عروضهم." action={<ButtonLink href="/requests/new">طلب توريد جديد</ButtonLink>} />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-steel text-white">
                <tr>{["الطلب", "النوع", "الكمية / الميزانية", "آخر موعد للعروض", "الحالة", "العروض"].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3.5"><Link href={`/requests/${r.id}`} className="font-bold text-navy hover:text-steel">{r.title}</Link></td>
                    <td className="px-4 py-3.5"><Badge tone={r.kind === "PRODUCT" ? "aqua" : "neutral"}>{KIND_LABELS[r.kind]}</Badge></td>
                    <td className="px-4 py-3.5">
                      {r.quantity.toLocaleString("en-US")} {r.unit}
                      {r.budgetMaxPiasters ? <span className="text-muted"> · حتى {formatEgp(r.budgetMaxPiasters)}</span> : null}
                    </td>
                    <td className="px-4 py-3.5">{formatDate(r.offersDeadline)}</td>
                    <td className="px-4 py-3.5"><Badge tone={REQUEST_STATUS[r.status].tone} dot>{REQUEST_STATUS[r.status].label}</Badge></td>
                    <td className="px-4 py-3.5">
                      {r.order ? (
                        <Link href={`/orders/${r.order.id}`} className="font-bold text-steel">عرض الطلب الجاري</Link>
                      ) : (
                        <Link href={`/requests/${r.id}`} className="font-bold text-steel">{r._count.offers} عرض</Link>
                      )}
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

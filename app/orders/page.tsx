import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { nextOrderStep, ORDER_STATUS } from "@/lib/supply"
import { formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "الطلبات الجارية" }

export default async function OrdersPage() {
  const user = await requireApproved()
  const isSupplier = user.role === "SUPPLIER"
  const orders = await db.order.findMany({
    where: isSupplier ? { supplierId: user.id } : { buyerId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      request: { select: { title: true } },
      buyer: { select: { entrepreneurProfile: { select: { projectName: true } } } },
      supplier: { select: { fullName: true, supplierProfile: { select: { businessName: true } } } },
    },
  })

  return (
    <AppShell user={user} active="/orders">
      <PageTitle title="الطلبات الجارية" subtitle={isSupplier ? "العروض اللي اتقبلت، ومتابعة التنفيذ لحد التسليم." : "العروض اللي قبلتيها، ومتابعة التنفيذ لحد الاستلام."} />
      {orders.length === 0 ? (
        <EmptyState title="مفيش طلبات جارية" text={isSupplier ? "لما رائد أعمال يقبل عرضك هيظهر هنا." : "لما تقبلي عرض على طلب، هيظهر هنا."} />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-steel text-white">
                <tr>{["الطلب", isSupplier ? "المشروع" : "المورد", "القيمة", "الحالة", "آخر تحديث", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const needsMe = nextOrderStep(o.status, isSupplier ? "supplier" : "buyer")
                  return (
                    <tr key={o.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3.5 font-bold">{o.request.title}</td>
                      <td className="px-4 py-3.5">{isSupplier ? o.buyer.entrepreneurProfile?.projectName : o.supplier.supplierProfile?.businessName ?? o.supplier.fullName}</td>
                      <td className="px-4 py-3.5">{formatEgp(o.amountPiasters)}</td>
                      <td className="px-4 py-3.5"><Badge tone={ORDER_STATUS[o.status].tone} dot>{ORDER_STATUS[o.status].label}</Badge></td>
                      <td className="px-4 py-3.5">{formatDate(o.updatedAt)}</td>
                      <td className="px-4 py-3.5 text-left">
                        <Link href={`/orders/${o.id}`} className={needsMe ? "rounded-xl bg-brand-btn px-3 py-2 text-[13px] font-bold text-white" : "font-bold text-steel"}>
                          {needsMe ? needsMe.label : "عرض"}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </AppShell>
  )
}

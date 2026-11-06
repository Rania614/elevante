import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { accounts } from "@/lib/invest"
import { balance } from "@/lib/ledger"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { formatDateTime } from "@/lib/utils"

export const metadata: Metadata = { title: "المحفظة" }

export default async function WalletPage() {
  const user = await requireApproved("ENTREPRENEUR")
  const account = accounts.wallet(user.id)
  const [available, entries, escrowDeals] = await Promise.all([
    balance(account),
    db.ledgerEntry.findMany({ where: { account }, orderBy: { createdAt: "desc" }, take: 50, include: { deal: { select: { id: true, round: { select: { title: true } } } } } }),
    db.deal.findMany({ where: { round: { entrepreneurId: user.id }, status: "ACTIVE" }, select: { id: true } }),
  ])
  const held = (await Promise.all(escrowDeals.map((d) => balance(accounts.escrow(d.id))))).reduce((a, b) => a + b, 0)

  return (
    <AppShell user={user} active="/wallet">
      <PageTitle title="المحفظة" subtitle="الرصيد محسوب من سجل الحركات، مش متخزّن كرقم ثابت." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">الرصيد المتاح</span><span className="text-3xl font-extrabold">{formatEgp(available)}</span><span className="text-xs text-muted">شرائح اتفرج عنها من الضمان</span></Card>
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">محجوز في الضمان</span><span className="text-3xl font-extrabold">{formatEgp(held)}</span><span className="text-xs text-muted">بيتفرج مع اعتماد كل مرحلة</span></Card>
      </div>
      <Note>السحب للحساب البنكي جاي مع لوحة الأدمن (موافقة على طلبات السحب).</Note>
      {entries.length === 0 ? (
        <EmptyState title="لسه مفيش حركات" text="أول ما مستثمر يعتمد مرحلة، الشريحة هتظهر هنا." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-steel text-white"><tr>{["التاريخ", "الحركة", "الجولة", "المبلغ"].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3.5">{formatDateTime(e.createdAt)}</td>
                    <td className="px-4 py-3.5">{e.memo ?? "حركة"}</td>
                    <td className="px-4 py-3.5">{e.deal ? <Link href={`/deals/${e.deal.id}`} className="text-steel">{e.deal.round.title}</Link> : "—"}</td>
                    <td className="px-4 py-3.5 font-bold" dir="ltr">{e.amountPiasters > 0 ? "+" : ""}{formatEgp(e.amountPiasters)}</td>
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

import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import type { WithdrawalStatus } from "@prisma/client"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { accounts } from "@/lib/invest"
import { balance } from "@/lib/ledger"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { formatDateTime } from "@/lib/utils"
import { WithdrawForm } from "./withdraw-form"

export const metadata: Metadata = { title: "المحفظة" }

const W_STATUS: Record<WithdrawalStatus, { label: string; tone: "warn" | "success" | "danger" }> = {
  PENDING: { label: "قيد المراجعة", tone: "warn" },
  PAID: { label: "تم التحويل", tone: "success" },
  REJECTED: { label: "مرفوض — رجع للمحفظة", tone: "danger" },
}

export default async function WalletPage() {
  const user = await requireApproved()
  if (user.role !== "ENTREPRENEUR" && user.role !== "SUPPLIER") redirect("/dashboard")
  const account = accounts.wallet(user.id)

  // Money still in escrow that will reach this wallet later.
  const escrowAccounts =
    user.role === "ENTREPRENEUR"
      ? (await db.deal.findMany({ where: { round: { entrepreneurId: user.id }, status: "ACTIVE" }, select: { id: true } })).map((d) => accounts.escrow(d.id))
      : (await db.order.findMany({ where: { supplierId: user.id, status: { in: ["ACCEPTED", "IN_PROGRESS", "DELIVERED"] } }, select: { id: true } })).map((o) => accounts.orderEscrow(o.id))

  const [available, entries, withdrawals, held] = await Promise.all([
    balance(account),
    db.ledgerEntry.findMany({
      where: { account },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { deal: { select: { id: true, round: { select: { title: true } } } }, order: { select: { id: true, request: { select: { title: true } } } } },
    }),
    db.withdrawal.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 }),
    Promise.all(escrowAccounts.map((a) => balance(a))).then((v) => v.reduce((x, y) => x + y, 0)),
  ])
  const pendingOut = withdrawals.filter((w) => w.status === "PENDING").reduce((a, w) => a + w.amountPiasters, 0)

  return (
    <AppShell user={user} active="/wallet">
      <PageTitle title="المحفظة" subtitle="الرصيد محسوب من سجل الحركات، مش متخزّن كرقم ثابت." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">الرصيد المتاح</span><span className="text-3xl font-extrabold">{formatEgp(available)}</span></Card>
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">محجوز في الضمان لك</span><span className="text-3xl font-extrabold">{formatEgp(held)}</span><span className="text-xs text-muted">{user.role === "ENTREPRENEUR" ? "بيتفرج مع اعتماد كل مرحلة" : "بيتحوّل بعد تأكيد الاستلام"}</span></Card>
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">سحب قيد المراجعة</span><span className="text-3xl font-extrabold">{formatEgp(pendingOut)}</span></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          {entries.length === 0 ? (
            <EmptyState title="لسه مفيش حركات" text={user.role === "ENTREPRENEUR" ? "أول ما مستثمر يعتمد مرحلة، الشريحة هتظهر هنا." : "أول ما رائد أعمال يأكّد استلام طلب، قيمته هتظهر هنا."} />
          ) : (
            <Card className="p-0">
              <h2 className="px-6 pt-5 font-bold">سجل الحركات</h2>
              <div className="overflow-x-auto rounded-b-2xl">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-steel text-white"><tr>{["التاريخ", "الحركة", "مرتبطة بـ", "المبلغ"].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr></thead>
                  <tbody>
                    {entries.map((e) => (
                      <tr key={e.id} className="border-b border-line last:border-0">
                        <td className="px-4 py-3.5">{formatDateTime(e.createdAt)}</td>
                        <td className="px-4 py-3.5">{e.memo ?? "حركة"}</td>
                        <td className="px-4 py-3.5">
                          {e.deal ? <Link href={`/deals/${e.deal.id}`} className="text-steel">{e.deal.round.title}</Link> : e.order ? <Link href={`/orders/${e.order.id}`} className="text-steel">{e.order.request.title}</Link> : "—"}
                        </td>
                        <td className="px-4 py-3.5 font-bold" dir="ltr">{e.amountPiasters > 0 ? "+" : ""}{formatEgp(e.amountPiasters)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {withdrawals.length ? (
            <Card>
              <h2 className="font-bold">طلبات السحب</h2>
              <ul className="flex flex-col">
                {withdrawals.map((w) => (
                  <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-3 text-sm last:border-0">
                    <span><strong>{formatEgp(w.amountPiasters)}</strong> <span className="text-muted">· {w.bankName} ••••{w.accountLast4} · {formatDateTime(w.createdAt)}</span></span>
                    <span className="flex items-center gap-2">
                      {w.transferRef ? <span className="text-xs text-muted" dir="ltr">Ref {w.transferRef}</span> : null}
                      <Badge tone={W_STATUS[w.status].tone} dot>{W_STATUS[w.status].label}</Badge>
                    </span>
                    {w.status === "REJECTED" && w.adminNote ? <p className="w-full text-xs text-danger-text">{w.adminNote}</p> : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>

        <WithdrawForm availableLabel={formatEgp(available)} />
      </div>
    </AppShell>
  )
}

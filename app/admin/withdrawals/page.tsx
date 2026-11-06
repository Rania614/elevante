import type { Metadata } from "next"
import Link from "next/link"
import type { WithdrawalStatus } from "@prisma/client"
import { Card } from "@/components/ui/surface"
import { decrypt } from "@/lib/crypto"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireAdmin } from "@/lib/session"
import { cn, formatDateTime } from "@/lib/utils"
import { ROLE_LABELS } from "@/lib/verification"
import { WithdrawalDecision } from "./decision-form"

export const metadata: Metadata = { title: "طلبات السحب" }

const TABS: { status: WithdrawalStatus; label: string }[] = [
  { status: "PENDING", label: "بانتظار التحويل" },
  { status: "PAID", label: "تم التحويل" },
  { status: "REJECTED", label: "مرفوضة" },
]

export default async function WithdrawalsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin()
  const { status: raw } = await searchParams
  const status = TABS.find((t) => t.status === raw)?.status ?? "PENDING"

  const [rows, counts] = await Promise.all([
    db.withdrawal.findMany({
      where: { status },
      orderBy: { createdAt: status === "PENDING" ? "asc" : "desc" },
      take: 50,
      include: { user: { select: { fullName: true, role: true, email: true } }, reviewer: { select: { fullName: true } } },
    }),
    db.withdrawal.groupBy({ by: ["status"], _count: true }),
  ])
  const count = (s: WithdrawalStatus) => counts.find((c) => c.status === s)?._count ?? 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold">طلبات السحب</h1>
        <p className="mt-1 text-muted">حوّل المبلغ من البنك الأول، وبعدين سجّل رقم المرجع هنا. المبلغ محجوز من محفظة المستخدم لحد القرار.</p>
      </div>

      <nav aria-label="حالة الطلبات" className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.status}
            href={`/admin/withdrawals?status=${t.status}`}
            aria-current={t.status === status ? "page" : undefined}
            className={cn("rounded-xl border px-4 py-2 text-sm font-bold", t.status === status ? "border-navy bg-navy text-white" : "border-steel bg-white text-steel")}
          >
            {t.label} ({count(t.status)})
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <Card><p className="text-muted">مفيش طلبات في القسم ده.</p></Card>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((w) => (
            <Card key={w.id} className="gap-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-2xl font-extrabold">{formatEgp(w.amountPiasters)}</p>
                  <p className="text-sm text-muted">{w.user.fullName} · {ROLE_LABELS[w.user.role]} · {w.user.email}</p>
                  <p className="text-xs text-muted">{formatDateTime(w.createdAt)}</p>
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-muted">البنك</dt><dd>{w.bankName}</dd>
                  <dt className="text-muted">صاحب الحساب</dt><dd>{w.accountHolder}</dd>
                  <dt className="text-muted">الحساب</dt>
                  <dd dir="ltr" className="font-mono">{w.status === "PENDING" ? decrypt(w.accountEnc) : `••••${w.accountLast4}`}</dd>
                </dl>
              </div>
              {w.status === "PENDING" ? <WithdrawalDecision withdrawalId={w.id} /> : (
                <p className="text-sm text-muted">
                  {w.status === "PAID" ? <>مرجع التحويل <span dir="ltr">{w.transferRef}</span></> : <>السبب: {w.adminNote}</>}
                  {w.reviewer ? <> · بواسطة {w.reviewer.fullName}</> : null}
                  {w.decidedAt ? <> · {formatDateTime(w.decidedAt)}</> : null}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

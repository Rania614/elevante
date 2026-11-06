import type { Metadata } from "next"
import Link from "next/link"
import type { RequestKind } from "@prisma/client"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { Badge } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { KIND_LABELS, OFFER_STATUS } from "@/lib/supply"
import { kindsFor } from "@/lib/supply"
import { cn, formatDate } from "@/lib/utils"

export const metadata: Metadata = { title: "طلبات التوريد" }

export default async function MarketPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  const user = await requireApproved("SUPPLIER")
  const profile = await db.supplierProfile.findUnique({ where: { userId: user.id }, select: { supplyType: true } })
  const allowed = kindsFor(profile?.supplyType)
  const { kind: k } = await searchParams
  const kinds = allowed.includes(k as RequestKind) ? [k as RequestKind] : allowed

  const requests = await db.supplyRequest.findMany({
    where: { status: "OPEN", offersDeadline: { gte: new Date() }, kind: { in: kinds }, NOT: { entrepreneurId: user.id } },
    orderBy: { offersDeadline: "asc" },
    take: 60,
    include: {
      entrepreneur: { select: { entrepreneurProfile: { select: { projectName: true } } } },
      offers: { where: { supplierId: user.id }, select: { status: true } },
      _count: { select: { offers: { where: { status: "PENDING" } } } },
    },
  })

  return (
    <AppShell user={user} active="/market">
      <PageTitle title="طلبات التوريد" subtitle="طلبات مفتوحة من رواد أعمال موثّقين، مرتّبة بأقرب موعد للإغلاق." />
      {allowed.length > 1 ? (
        <nav aria-label="نوع الطلب" className="flex gap-2">
          {[{ v: "", l: "الكل" }, { v: "PRODUCT", l: "منتجات" }, { v: "SERVICE", l: "خدمات" }].map((t) => {
            const on = (t.v || undefined) === (k && allowed.includes(k as RequestKind) ? k : undefined)
            return (
              <Link key={t.l} href={t.v ? `/market?kind=${t.v}` : "/market"} aria-current={on ? "page" : undefined}
                className={cn("rounded-xl border px-4 py-2 text-sm font-bold", on ? "border-navy bg-navy text-white" : "border-steel bg-white text-steel")}>
                {t.l}
              </Link>
            )
          })}
        </nav>
      ) : null}

      {requests.length === 0 ? (
        <EmptyState title="مفيش طلبات مفتوحة دلوقتي" text="أول ما رائد أعمال ينشر طلب يناسب نشاطك هيظهر هنا." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {requests.map((r) => {
            const mine = r.offers[0]
            return (
              <li key={r.id}>
                <Link href={`/market/${r.id}`} className="flex h-full flex-col gap-3 rounded-2xl border border-ice bg-white p-5 shadow-card transition hover:scale-[1.01] hover:shadow-float">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-lg">{r.title}</strong>
                      <Badge tone={r.kind === "PRODUCT" ? "aqua" : "neutral"}>{KIND_LABELS[r.kind]}</Badge>
                    </div>
                    {mine ? <Badge tone={OFFER_STATUS[mine.status].tone} dot>عرضك: {OFFER_STATUS[mine.status].label}</Badge> : null}
                  </div>
                  <span className="text-sm text-muted">{r.entrepreneur.entrepreneurProfile?.projectName ?? "مشروع"} · {r.category}</span>
                  <span className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <span><span className="text-muted">الكمية:</span> <strong>{r.quantity.toLocaleString("en-US")} {r.unit}</strong></span>
                    {r.budgetMaxPiasters ? <span><span className="text-muted">حتى:</span> <strong>{formatEgp(r.budgetMaxPiasters)}</strong></span> : null}
                    <span><span className="text-muted">آخر موعد:</span> <strong>{formatDate(r.offersDeadline)}</strong></span>
                  </span>
                  <span className="mt-auto border-t border-line pt-3 text-xs text-muted">{r._count.offers} عرض مقدَّم</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </AppShell>
  )
}

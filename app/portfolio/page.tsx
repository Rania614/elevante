import type { Metadata } from "next"
import Link from "next/link"
import { AppShell, EmptyState, PageTitle } from "@/components/app-shell"
import { ButtonLink } from "@/components/ui/button"
import { Badge, Card } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { accounts, DEAL_LABELS, formatBps } from "@/lib/invest"
import { balance } from "@/lib/ledger"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"

export const metadata: Metadata = { title: "محفظتي الاستثمارية" }

export default async function PortfolioPage() {
  const user = await requireApproved("INVESTOR")
  const deals = await db.deal.findMany({
    where: { investorId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      round: { select: { title: true, entrepreneur: { select: { entrepreneurProfile: { select: { projectName: true } } } } } },
      milestones: { select: { status: true } },
    },
  })
  const escrow = await Promise.all(deals.map((d) => balance(accounts.escrow(d.id))))
  const invested = deals.filter((d) => d.status !== "AWAITING_FUNDING").reduce((a, d) => a + d.amountPiasters, 0)
  const held = escrow.reduce((a, b) => a + b, 0)
  const toReview = deals.reduce((a, d) => a + d.milestones.filter((m) => m.status === "AWAITING_APPROVAL").length, 0)

  return (
    <AppShell user={user} active="/portfolio">
      <PageTitle title="محفظتي الاستثمارية" action={<ButtonLink href="/invest" variant="outline">فرص الاستثمار</ButtonLink>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">إجمالي الممول</span><span className="text-3xl font-extrabold">{formatEgp(invested)}</span></Card>
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">محجوز في الضمان</span><span className="text-3xl font-extrabold">{formatEgp(held)}</span></Card>
        <Card className="gap-1"><span className="text-sm font-semibold text-muted">مراحل بانتظار مراجعتك</span><span className="text-3xl font-extrabold">{toReview}</span></Card>
      </div>
      {deals.length === 0 ? (
        <EmptyState title="لسه مفيش صفقات" text="قدّم عرض على جولة، ولما رائد الأعمال يقبل هتظهر الصفقة هنا." action={<ButtonLink href="/invest">تصفّح الفرص</ButtonLink>} />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-steel text-white"><tr>{["المشروع", "استثمارك", "الحصة", "المراحل", "الحالة", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {deals.map((d) => {
                  const released = d.milestones.filter((m) => m.status === "RELEASED").length
                  const review = d.milestones.some((m) => m.status === "AWAITING_APPROVAL")
                  return (
                    <tr key={d.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3.5 font-bold">{d.round.entrepreneur.entrepreneurProfile?.projectName ?? d.round.title}</td>
                      <td className="px-4 py-3.5">{formatEgp(d.amountPiasters)}</td>
                      <td className="px-4 py-3.5">{formatBps(d.equityBps)}</td>
                      <td className="px-4 py-3.5">{d.milestones.length ? `${released} من ${d.milestones.length}` : "—"}</td>
                      <td className="px-4 py-3.5"><Badge tone={review ? "warn" : DEAL_LABELS[d.status].tone} dot>{review ? "بانتظار مراجعتك" : DEAL_LABELS[d.status].label}</Badge></td>
                      <td className="px-4 py-3.5 text-left">
                        <Link href={`/deals/${d.id}`} className={d.status === "AWAITING_FUNDING" || review ? "rounded-xl bg-brand-btn px-3 py-2 text-[13px] font-bold text-white" : "font-bold text-steel"}>
                          {d.status === "AWAITING_FUNDING" ? "موّل الآن" : review ? "راجع المرحلة" : "التفاصيل"}
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

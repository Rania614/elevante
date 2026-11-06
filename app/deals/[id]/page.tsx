import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, Lock } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { ConfirmAction } from "@/components/confirm-action"
import { Badge, Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { accounts, DEAL_LABELS, formatBps, MILESTONE_LABELS } from "@/lib/invest"
import { balance } from "@/lib/ledger"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { cn, formatDate, formatDateTime } from "@/lib/utils"
import { fundDealAction } from "../actions"
import { MilestoneDecision } from "./milestone-decision"

export const metadata: Metadata = { title: "تفاصيل الصفقة" }

export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireApproved()
  const { id } = await params
  const deal = await db.deal.findFirst({
    where: { id, OR: [{ investorId: user.id }, { round: { entrepreneurId: user.id } }] },
    include: {
      investor: { select: { fullName: true } },
      round: { include: { entrepreneur: { select: { id: true, fullName: true, entrepreneurProfile: { select: { projectName: true } } } }, milestones: { orderBy: { position: "asc" }, include: { submissions: { orderBy: { createdAt: "desc" }, take: 1 } } } } },
      milestones: { orderBy: { position: "asc" } },
      ledger: { orderBy: { createdAt: "asc" } },
    },
  })
  if (!deal) notFound()

  const isInvestor = deal.investorId === user.id
  const escrow = await balance(accounts.escrow(deal.id))
  const released = deal.milestones.filter((m) => m.status === "RELEASED").reduce((a, m) => a + m.tranchePiasters, 0)
  const st = DEAL_LABELS[deal.status]
  const project = deal.round.entrepreneur.entrepreneurProfile?.projectName ?? deal.round.title
  const ledgerRows = deal.ledger.filter((e) => e.account.startsWith("escrow:"))

  return (
    <AppShell user={user} active={isInvestor ? "/portfolio" : "/rounds"}>
      <Link href={isInvestor ? "/portfolio" : `/rounds/${deal.roundId}`} className="text-sm font-bold text-steel">→ رجوع</Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted" dir="ltr">#{deal.id.slice(-8).toUpperCase()}</p>
            <h1 className="text-2xl font-extrabold">{project}</h1>
            <p className="mt-1 text-sm text-muted">المستثمر: {deal.investor.fullName} · رائد الأعمال: {deal.round.entrepreneur.fullName}</p>
          </div>
          <Badge tone={st.tone} dot>{st.label}</Badge>
        </div>
        <dl className="grid gap-3 rounded-2xl bg-brand-tile p-4 text-sm sm:grid-cols-4">
          <div><dt className="text-muted">مبلغ الاستثمار</dt><dd className="text-lg font-extrabold">{formatEgp(deal.amountPiasters)}</dd></div>
          <div><dt className="text-muted">الحصة</dt><dd className="text-lg font-extrabold">{formatBps(deal.equityBps)}</dd></div>
          <div><dt className="text-muted">في الضمان الآن</dt><dd className="text-lg font-extrabold">{formatEgp(escrow)}</dd></div>
          <div><dt className="text-muted">تم الإفراج عنه</dt><dd className="text-lg font-extrabold">{formatEgp(released)}</dd></div>
        </dl>
      </Card>

      {deal.status === "AWAITING_FUNDING" ? (
        <Card>
          <h2 className="font-bold">تمويل الصفقة في الضمان</h2>
          <dl className="flex flex-col gap-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">مبلغ الاستثمار</dt><dd>{formatEgp(deal.amountPiasters)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">عمولة المنصة (2%)</dt><dd>{formatEgp(deal.feePiasters)}</dd></div>
            <div className="flex justify-between border-t border-line pt-1.5 font-bold"><dt>الإجمالي</dt><dd>{formatEgp(deal.amountPiasters + deal.feePiasters)}</dd></div>
          </dl>
          <Note><span className="inline-flex items-center gap-2"><Lock size={16} aria-hidden />الدفع هنا محاكاة: مفيش بوابة دفع متوصّلة. المبلغ بيتسجّل في سجل الضمان ومش بيوصل لرائد الأعمال غير مع اعتمادك لكل مرحلة.</span></Note>
          {isInvestor ? (
            <div className="self-start">
              <ConfirmAction action={fundDealAction} fields={{ dealId: deal.id }} label={`تمويل ${formatEgp(deal.amountPiasters + deal.feePiasters)}`} confirmLabel="تأكيد الدفع" question="تأكيد تحويل المبلغ للضمان؟" size="md" />
            </div>
          ) : (
            <p className="text-sm text-muted">مستنيين المستثمر يموّل الصفقة.</p>
          )}
        </Card>
      ) : null}

      <section aria-labelledby="ms-h" className="flex flex-col gap-3">
        <h2 id="ms-h" className="text-xl font-extrabold">المراحل والشرائح</h2>
        <ol className="flex flex-col gap-3">
          {deal.round.milestones.map((rm) => {
            const dm = deal.milestones.find((x) => x.milestoneId === rm.id)
            const label = dm ? MILESTONE_LABELS[dm.status] : null
            const proof = rm.submissions[0]
            const prevReleased = rm.position === 1 || deal.milestones.find((x) => x.position === rm.position - 1)?.status === "RELEASED"
            return (
              <li key={rm.id}>
                <Card className={cn("gap-3", dm?.status === "AWAITING_APPROVAL" && isInvestor && "border-2 border-steel")}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong className="flex items-center gap-2">
                      {dm?.status === "RELEASED" ? <Check size={18} className="text-steel" strokeWidth={2.6} aria-hidden /> : null}
                      المرحلة {rm.position}: {rm.title}
                    </strong>
                    {label ? <Badge tone={label.tone} dot>{label.label}</Badge> : null}
                  </div>
                  <p className="text-sm text-muted">
                    الشريحة: <strong className="text-navy">{dm ? formatEgp(dm.tranchePiasters) : formatBps(rm.shareBps)}</strong> · الموعد {formatDate(rm.dueDate)} · الإثبات المطلوب: {rm.proofNeeded}
                  </p>
                  {proof && dm && dm.status !== "LOCKED" ? (
                    <div className="rounded-xl bg-brand-tile p-3 text-sm leading-7">
                      <div className="text-xs text-muted">إثبات رائد الأعمال · {formatDateTime(proof.createdAt)}</div>
                      <p>{proof.summary}</p>
                      {proof.proofUrl ? <a href={proof.proofUrl} target="_blank" rel="noopener noreferrer nofollow" className="font-bold text-steel" dir="ltr">{proof.proofUrl}</a> : null}
                    </div>
                  ) : null}
                  {dm?.status === "CHANGES_REQUESTED" && dm.investorNote ? <Note tone="danger">ملاحظة المستثمر: {dm.investorNote}</Note> : null}
                  {isInvestor && dm?.status === "AWAITING_APPROVAL" ? (
                    prevReleased ? <MilestoneDecision dealMilestoneId={dm.id} trancheLabel={formatEgp(dm.tranchePiasters)} /> : <p className="text-sm text-muted">اعتمد المرحلة اللي قبلها الأول.</p>
                  ) : null}
                </Card>
              </li>
            )
          })}
        </ol>
      </section>

      {ledgerRows.length ? (
        <Card className="p-0">
          <h2 className="px-6 pt-5 font-bold">سجل الضمان</h2>
          <div className="overflow-x-auto rounded-b-2xl">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-steel text-white"><tr>{["التاريخ", "الحركة", "المبلغ"].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr></thead>
              <tbody>
                {ledgerRows.map((e) => (
                  <tr key={e.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">{formatDateTime(e.createdAt)}</td>
                    <td className="px-4 py-3">{e.memo}</td>
                    <td className="px-4 py-3 font-bold" dir="ltr">{e.amountPiasters > 0 ? "+" : ""}{formatEgp(e.amountPiasters)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </AppShell>
  )
}

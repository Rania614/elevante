import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AppShell } from "@/components/app-shell"
import { ConfirmAction } from "@/components/confirm-action"
import { ProgressBar } from "@/components/progress-bar"
import { Badge, Card, Note } from "@/components/ui/surface"
import { db } from "@/lib/db"
import { canSubmitProof, DEAL_LABELS, formatBps, OFFER_LABELS } from "@/lib/invest"
import { formatEgp } from "@/lib/money"
import { requireApproved } from "@/lib/session"
import { formatDate, formatDateTime } from "@/lib/utils"
import { acceptInvestmentAction, closeRoundAction, rejectInvestmentAction } from "../actions"
import { ProofForm } from "./proof-form"

export const metadata: Metadata = { title: "جولة التمويل" }

export default async function RoundPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireApproved("ENTREPRENEUR")
  const { id } = await params
  const round = await db.investmentRound.findFirst({
    where: { id, entrepreneurId: user.id },
    include: {
      milestones: {
        orderBy: { position: "asc" },
        include: { submissions: { orderBy: { createdAt: "desc" }, take: 1 }, dealMilestones: { select: { status: true, investorNote: true, deal: { select: { status: true } } } } },
      },
      offers: { where: { status: "PENDING" }, orderBy: { createdAt: "asc" }, include: { investor: { select: { fullName: true, investorProfile: { select: { organization: true } } } } } },
      deals: { orderBy: { createdAt: "asc" }, include: { investor: { select: { fullName: true } } } },
    },
  })
  if (!round) notFound()

  const remaining = round.targetPiasters - round.committedPiasters
  const funded = round.deals.some((d) => d.status !== "AWAITING_FUNDING")
  const pct = Math.round((round.committedPiasters / round.targetPiasters) * 100)

  return (
    <AppShell user={user} active="/rounds">
      <Link href="/rounds" className="text-sm font-bold text-steel">→ رجوع للجولات</Link>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold">{round.title}</h1>
            <p className="mt-1 text-sm text-muted">{formatEgp(round.targetPiasters)} مقابل {formatBps(round.equityBps)} · أقل مساهمة {formatEgp(round.minTicketPiasters)} · تُغلق {formatDate(round.closesAt)}</p>
          </div>
          <Badge tone={round.status === "OPEN" ? "success" : "neutral"} dot>{round.status === "OPEN" ? "مفتوحة" : "مغلقة"}</Badge>
        </div>
        <ProgressBar value={pct} label={`تم الالتزام بـ ${formatEgp(round.committedPiasters)} — المتبقي ${formatEgp(remaining)}`} />
        {round.status === "OPEN" ? (
          <div className="self-start">
            <ConfirmAction action={closeRoundAction} fields={{ roundId: round.id }} label="إغلاق الجولة" confirmLabel="إغلاق" question="الجولة هتتقفل والعروض المعلّقة هتترفض. الصفقات المقبولة بتفضل زي ما هي." variant="outline" />
          </div>
        ) : null}
      </Card>

      {round.offers.length ? (
        <section aria-labelledby="offers-h" className="flex flex-col gap-3">
          <h2 id="offers-h" className="text-xl font-extrabold">عروض بانتظار قرارك ({round.offers.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {round.offers.map((o) => {
              const fits = o.amountPiasters <= remaining
              return (
                <Card key={o.id} className="gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <strong>{o.investor.investorProfile?.organization ?? o.investor.fullName}</strong>
                    <Badge tone={OFFER_LABELS[o.status].tone} dot>{OFFER_LABELS[o.status].label}</Badge>
                  </div>
                  <div className="text-2xl font-extrabold">{formatEgp(o.amountPiasters)}</div>
                  <div className="text-sm text-muted">حصة {formatBps(Math.floor((o.amountPiasters * round.equityBps) / round.targetPiasters))} · {formatDateTime(o.createdAt)}</div>
                  {o.note ? <p className="text-sm leading-7">{o.note}</p> : null}
                  {!fits ? <Note tone="warn">المبلغ أكبر من المتبقي في الجولة ({formatEgp(remaining)}).</Note> : null}
                  <div className="flex flex-wrap gap-2">
                    {fits ? <ConfirmAction action={acceptInvestmentAction} fields={{ offerId: o.id }} label="قبول" confirmLabel="تأكيد القبول" question={`قبول ${formatEgp(o.amountPiasters)}؟ هتتعمل صفقة والمستثمر هيُطلب منه التمويل في الضمان.`} /> : null}
                    <ConfirmAction action={rejectInvestmentAction} fields={{ offerId: o.id }} label="رفض" confirmLabel="رفض" question="رفض العرض ده؟" variant="outline" />
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="deals-h" className="flex flex-col gap-3">
        <h2 id="deals-h" className="text-xl font-extrabold">الصفقات</h2>
        {round.deals.length === 0 ? (
          <p className="text-sm text-muted">لسه مفيش عروض مقبولة.</p>
        ) : (
          <Card className="p-0">
            <div className="overflow-x-auto rounded-2xl">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="bg-steel text-white"><tr>{["المستثمر", "المبلغ", "الحصة", "الحالة", ""].map((h) => <th key={h} scope="col" className="px-4 py-3 text-right font-bold">{h}</th>)}</tr></thead>
                <tbody>
                  {round.deals.map((d) => (
                    <tr key={d.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3.5 font-bold">{d.investor.fullName}</td>
                      <td className="px-4 py-3.5">{formatEgp(d.amountPiasters)}</td>
                      <td className="px-4 py-3.5">{formatBps(d.equityBps)}</td>
                      <td className="px-4 py-3.5"><Badge tone={DEAL_LABELS[d.status].tone} dot>{DEAL_LABELS[d.status].label}</Badge></td>
                      <td className="px-4 py-3.5 text-left"><Link href={`/deals/${d.id}`} className="font-bold text-steel">التفاصيل</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      <section aria-labelledby="ms-h" className="flex flex-col gap-3">
        <h2 id="ms-h" className="text-xl font-extrabold">المراحل</h2>
        {!funded ? <Note>رفع الإثبات بيتفتح أول ما أول مستثمر يحوّل التمويل للضمان.</Note> : null}
        <ol className="flex flex-col gap-4">
          {round.milestones.map((m, i) => {
            const active = m.dealMilestones.filter((x) => x.deal.status !== "AWAITING_FUNDING")
            const count = (s: string) => active.filter((x) => x.status === s).length
            const needsProof = count("LOCKED") + count("CHANGES_REQUESTED") > 0
            const prevHasProof = i === 0 || round.milestones[i - 1].submissions.length > 0
            const last = m.submissions[0]
            const notes = active.filter((x) => x.status === "CHANGES_REQUESTED" && x.investorNote).map((x) => x.investorNote!)
            return (
              <li key={m.id}>
                <Card className="gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>المرحلة {m.position}: {m.title}</strong>
                    <span className="text-sm text-muted">{formatBps(m.shareBps)} من التمويل · الموعد {formatDate(m.dueDate)}</span>
                  </div>
                  {active.length ? (
                    <div className="flex flex-wrap gap-2">
                      {count("RELEASED") ? <Badge tone="success">تم الإفراج: {count("RELEASED")}</Badge> : null}
                      {count("AWAITING_APPROVAL") ? <Badge tone="warn">بانتظار الاعتماد: {count("AWAITING_APPROVAL")}</Badge> : null}
                      {count("CHANGES_REQUESTED") ? <Badge tone="danger">مطلوب تعديل: {count("CHANGES_REQUESTED")}</Badge> : null}
                    </div>
                  ) : null}
                  {last ? <p className="rounded-xl bg-brand-tile p-3 text-sm leading-7">آخر إثبات ({formatDateTime(last.createdAt)}): {last.summary}</p> : null}
                  {notes.map((n, k) => <Note key={k} tone="danger">ملاحظة مستثمر: {n}</Note>)}
                  {needsProof && canSubmitProof(m.position, prevHasProof, funded) ? (
                    <ProofForm milestoneId={m.id} proofNeeded={m.proofNeeded} resubmit={Boolean(last)} />
                  ) : needsProof && funded ? (
                    <p className="text-sm text-muted">ارفعي إثبات المرحلة اللي قبلها الأول.</p>
                  ) : null}
                </Card>
              </li>
            )
          })}
        </ol>
      </section>
    </AppShell>
  )
}

// Pure money and state rules for investment rounds. Unit tested in tests/invest.test.ts.
import type { DealMilestoneStatus, DealStatus, InvestmentOfferStatus, LedgerKind } from "@prisma/client"

export const PLATFORM_FEE_BPS = 200 // 2%, paid by the investor on top of the investment
export const FULL_BPS = 10_000

export const MIN_MILESTONES = 2
export const MAX_MILESTONES = 6

/**
 * Splits an amount into tranches by basis-point shares. Every tranche is an integer number of
 * piasters and the tranches always add up to exactly `amount` (the last one absorbs rounding).
 */
export function splitTranches(amount: number, sharesBps: number[]): number[] {
  if (sharesBps.reduce((a, b) => a + b, 0) !== FULL_BPS) throw new Error("Shares must sum to 10000 bps")
  const parts = sharesBps.map((s) => Math.floor((amount * s) / FULL_BPS))
  parts[parts.length - 1] += amount - parts.reduce((a, b) => a + b, 0)
  return parts
}

/** Equity an investor receives for `amount`, proportional to the round's offer. Rounded down. */
export function equityFor(amount: number, target: number, roundEquityBps: number): number {
  return Math.floor((amount * roundEquityBps) / target)
}

export function feeFor(amount: number): number {
  return Math.round((amount * PLATFORM_FEE_BPS) / FULL_BPS)
}

export function formatBps(bps: number): string {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(bps / 100)}%`
}

/** "12.5" → 1250 bps; null if not a valid percentage. */
export function parsePercent(input: string | null | undefined): number | null {
  if (!input) return null
  const v = input.trim().replace("٫", ".")
  if (!/^\d{1,3}(\.\d{1,2})?$/.test(v)) return null
  const bps = Math.round(Number(v) * 100)
  return bps > 0 && bps <= FULL_BPS ? bps : null
}

// ── ledger lines ─────────────────────────────────────────────

export type LedgerLine = { account: string; amountPiasters: number }

export const accounts = {
  external: (userId: string) => `external:${userId}`,
  escrow: (dealId: string) => `escrow:${dealId}`,
  wallet: (userId: string) => `wallet:${userId}`,
  fees: "platform:fees",
}

export function assertBalanced(lines: LedgerLine[]) {
  if (lines.length < 2) throw new Error("A ledger transaction needs at least two lines")
  for (const l of lines) if (!Number.isInteger(l.amountPiasters) || l.amountPiasters === 0) throw new Error("Ledger amounts must be non-zero integers")
  if (lines.reduce((a, l) => a + l.amountPiasters, 0) !== 0) throw new Error("Ledger transaction is not balanced")
}

/** Investor pays amount + fee; the amount goes to the deal's escrow, the fee to the platform. */
export function fundingLines(p: { dealId: string; investorId: string; amount: number; fee: number }): { kind: LedgerKind; lines: LedgerLine[] }[] {
  const txs: { kind: LedgerKind; lines: LedgerLine[] }[] = [
    { kind: "FUNDING", lines: [{ account: accounts.external(p.investorId), amountPiasters: -p.amount }, { account: accounts.escrow(p.dealId), amountPiasters: p.amount }] },
    { kind: "PLATFORM_FEE", lines: [{ account: accounts.external(p.investorId), amountPiasters: -p.fee }, { account: accounts.fees, amountPiasters: p.fee }] },
  ]
  return txs.filter((t) => t.lines.every((l) => l.amountPiasters !== 0))
}

export function releaseLines(p: { dealId: string; entrepreneurId: string; tranche: number }): LedgerLine[] {
  return [
    { account: accounts.escrow(p.dealId), amountPiasters: -p.tranche },
    { account: accounts.wallet(p.entrepreneurId), amountPiasters: p.tranche },
  ]
}

// ── state rules ─────────────────────────────────────────────

/** Milestones are worked on in order: proof for #n can be submitted once #n-1 has proof. */
export function canSubmitProof(position: number, previousHasProof: boolean, hasFundedDeal: boolean) {
  return hasFundedDeal && (position === 1 || previousHasProof)
}

/** An investor releases tranches in order: #n only after #n-1 was released. */
export function canRelease(status: DealMilestoneStatus, previousReleased: boolean) {
  return status === "AWAITING_APPROVAL" && previousReleased
}

export const OFFER_LABELS: Record<InvestmentOfferStatus, { label: string; tone: "warn" | "aqua" | "danger" | "neutral" }> = {
  PENDING: { label: "قيد الانتظار", tone: "warn" },
  ACCEPTED: { label: "مقبول", tone: "aqua" },
  REJECTED: { label: "مرفوض", tone: "danger" },
  WITHDRAWN: { label: "مسحوب", tone: "neutral" },
}

export const DEAL_LABELS: Record<DealStatus, { label: string; tone: "warn" | "aqua" | "success" }> = {
  AWAITING_FUNDING: { label: "بانتظار التمويل", tone: "warn" },
  ACTIVE: { label: "نشطة — في الضمان", tone: "aqua" },
  COMPLETED: { label: "مكتملة", tone: "success" },
}

export const MILESTONE_LABELS: Record<DealMilestoneStatus, { label: string; tone: "neutral" | "warn" | "danger" | "success" }> = {
  LOCKED: { label: "لم تبدأ", tone: "neutral" },
  AWAITING_APPROVAL: { label: "بانتظار الاعتماد", tone: "warn" },
  CHANGES_REQUESTED: { label: "مطلوب تعديل", tone: "danger" },
  RELEASED: { label: "تم الإفراج", tone: "success" },
}

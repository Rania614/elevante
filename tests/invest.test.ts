import { test } from "node:test"
import assert from "node:assert/strict"
import { assertBalanced, MIN_WITHDRAWAL_PIASTERS, orderPaymentLines, orderReleaseLines, withdrawalError, withdrawalLines, canRelease, canSubmitProof, equityFor, feeFor, fundingLines, parsePercent, releaseLines, splitTranches } from "../lib/invest"

test("tranches are integers and always add up to the amount", () => {
  assert.deepEqual(splitTranches(30_000_000, [3000, 2500, 2500, 2000]), [9_000_000, 7_500_000, 7_500_000, 6_000_000])
  const odd = splitTranches(100_001, [3333, 3333, 3334])
  assert.equal(odd.reduce((a, b) => a + b, 0), 100_001)
  assert.ok(odd.every(Number.isInteger))
  assert.throws(() => splitTranches(100, [5000, 4000]))
})

test("equity is proportional to the round and rounded down", () => {
  // round: 900,000 EGP for 30% → 150,000 EGP buys 5%
  assert.equal(equityFor(15_000_000, 90_000_000, 3000), 500)
  assert.equal(equityFor(20_000_000, 90_000_000, 3000), 666) // 6.66%
})

test("platform fee is 2%", () => {
  assert.equal(feeFor(15_000_000), 300_000)
  assert.equal(feeFor(1), 0)
})

test("parses percentages into basis points", () => {
  assert.equal(parsePercent("30"), 3000)
  assert.equal(parsePercent("12.5"), 1250)
  assert.equal(parsePercent("0"), null)
  assert.equal(parsePercent("101"), null)
  assert.equal(parsePercent("abc"), null)
})

test("funding and release ledger transactions are balanced", () => {
  const funding = fundingLines({ dealId: "d1", investorId: "i1", amount: 15_000_000, fee: 300_000 })
  assert.equal(funding.length, 2)
  for (const t of funding) assert.doesNotThrow(() => assertBalanced(t.lines))
  assert.equal(funding.find((t) => t.kind === "FUNDING")?.lines.find((l) => l.account === "escrow:d1")?.amountPiasters, 15_000_000)
  assert.doesNotThrow(() => assertBalanced(releaseLines({ dealId: "d1", entrepreneurId: "e1", tranche: 4_500_000 })))
})

test("a zero fee produces no fee transaction", () => {
  assert.equal(fundingLines({ dealId: "d", investorId: "i", amount: 1, fee: 0 }).length, 1)
})

test("unbalanced or fractional lines are rejected", () => {
  assert.throws(() => assertBalanced([{ account: "a", amountPiasters: 10 }, { account: "b", amountPiasters: -9 }]))
  assert.throws(() => assertBalanced([{ account: "a", amountPiasters: 1.5 }, { account: "b", amountPiasters: -1.5 }]))
  assert.throws(() => assertBalanced([{ account: "a", amountPiasters: 0 }, { account: "b", amountPiasters: 0 }]))
})

test("milestones move in order", () => {
  assert.equal(canSubmitProof(1, false, true), true)
  assert.equal(canSubmitProof(2, false, true), false)
  assert.equal(canSubmitProof(2, true, true), true)
  assert.equal(canSubmitProof(1, false, false), false) // nothing funded yet
  assert.equal(canRelease("AWAITING_APPROVAL", true), true)
  assert.equal(canRelease("AWAITING_APPROVAL", false), false)
  assert.equal(canRelease("LOCKED", true), false)
  assert.equal(canRelease("RELEASED", true), false)
})

test("supply order payment and release are balanced", () => {
  for (const t of orderPaymentLines({ orderId: "o1", buyerId: "b1", amount: 1_600_000, fee: 32_000 })) assert.doesNotThrow(() => assertBalanced(t.lines))
  assert.doesNotThrow(() => assertBalanced(orderReleaseLines({ orderId: "o1", supplierId: "s1", amount: 1_600_000 })))
})

test("withdrawal hold, payout and return are balanced and land in the right accounts", () => {
  const p = { withdrawalId: "w1", userId: "u1", amount: 5_000_000 }
  for (const stage of ["hold", "paid", "returned"] as const) assert.doesNotThrow(() => assertBalanced(withdrawalLines(stage, p)))
  assert.equal(withdrawalLines("hold", p).find((l) => l.account === "wallet:u1")?.amountPiasters, -5_000_000)
  assert.equal(withdrawalLines("returned", p).find((l) => l.account === "wallet:u1")?.amountPiasters, 5_000_000)
  assert.equal(withdrawalLines("paid", p).find((l) => l.account === "bank:u1")?.amountPiasters, 5_000_000)
})

test("withdrawal limits", () => {
  assert.equal(withdrawalError(MIN_WITHDRAWAL_PIASTERS - 1, 10_000_000), "أقل مبلغ للسحب 100 ج.م")
  assert.equal(withdrawalError(5_000_000, 4_999_999), "المبلغ أكبر من الرصيد المتاح")
  assert.equal(withdrawalError(5_000_000, 5_000_000), null)
})

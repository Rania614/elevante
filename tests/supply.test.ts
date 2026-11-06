import { test } from "node:test"
import assert from "node:assert/strict"
import { addDays, cairoEndOfDay, cairoToday } from "../lib/dates"
import { formatEgp, parseEgp } from "../lib/money"
import { isAcceptingOffers, isOfferEditable, nextOrderStep } from "../lib/supply"

test("parses EGP amounts into integer piasters", () => {
  assert.equal(parseEgp("16000"), 1_600_000)
  assert.equal(parseEgp("16,000"), 1_600_000)
  assert.equal(parseEgp("4.5"), 450)
  assert.equal(parseEgp("0.05"), 5)
  assert.equal(parseEgp("١٦٠٠٠"), 1_600_000)
  assert.equal(parseEgp("4.555"), null)
  assert.equal(parseEgp("-5"), null)
  assert.equal(parseEgp("abc"), null)
  assert.equal(parseEgp(""), null)
})

test("formats piasters as EGP", () => {
  assert.equal(formatEgp(1_600_000), "16,000 ج.م")
  assert.equal(formatEgp(450), "4.5 ج.م")
})

test("deadline is the end of the day in Cairo, with daylight saving", () => {
  // November: Cairo is UTC+2 → 23:59:59 local = 21:59:59Z
  assert.equal(cairoEndOfDay("2026-11-20")?.toISOString(), "2026-11-20T21:59:59.000Z")
  // July: Cairo is UTC+3 → 20:59:59Z
  assert.equal(cairoEndOfDay("2026-07-15")?.toISOString(), "2026-07-15T20:59:59.000Z")
  assert.equal(cairoEndOfDay("2026-02-30"), null)
  assert.equal(cairoEndOfDay("20-11-2026"), null)
})

test("Cairo calendar helpers", () => {
  assert.equal(cairoToday(new Date("2026-11-06T22:30:00Z")), "2026-11-07") // already the 7th in Cairo
  assert.equal(addDays("2026-12-30", 3), "2027-01-02")
})

test("offers are accepted only while the request is open and before the deadline", () => {
  const deadline = new Date("2026-11-20T21:59:59Z")
  assert.equal(isAcceptingOffers({ status: "OPEN", offersDeadline: deadline }, new Date("2026-11-20T21:00:00Z")), true)
  assert.equal(isAcceptingOffers({ status: "OPEN", offersDeadline: deadline }, new Date("2026-11-20T22:00:00Z")), false)
  assert.equal(isAcceptingOffers({ status: "AWARDED", offersDeadline: deadline }, new Date("2026-11-01")), false)
  assert.equal(isAcceptingOffers({ status: "CLOSED", offersDeadline: deadline }, new Date("2026-11-01")), false)
})

test("only pending or withdrawn offers can be changed", () => {
  assert.equal(isOfferEditable("PENDING"), true)
  assert.equal(isOfferEditable("WITHDRAWN"), true)
  assert.equal(isOfferEditable("ACCEPTED"), false)
  assert.equal(isOfferEditable("REJECTED"), false)
})

test("order steps belong to the right party, in order", () => {
  assert.deepEqual(nextOrderStep("ACCEPTED", "supplier")?.to, "IN_PROGRESS")
  assert.deepEqual(nextOrderStep("IN_PROGRESS", "supplier")?.to, "DELIVERED")
  assert.deepEqual(nextOrderStep("DELIVERED", "buyer")?.to, "COMPLETED")
  assert.equal(nextOrderStep("ACCEPTED", "buyer"), null)
  assert.equal(nextOrderStep("DELIVERED", "supplier"), null)
  assert.equal(nextOrderStep("COMPLETED", "buyer"), null)
})

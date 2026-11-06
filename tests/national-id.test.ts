import { test } from "node:test"
import assert from "node:assert/strict"
import { normalizeDigits, parseNationalId } from "../lib/national-id"

const NOW = new Date(Date.UTC(2026, 10, 6))

test("accepts a valid ID and derives birth date, governorate and age", () => {
  const r = parseNationalId("29005120101234", NOW)
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.equal(r.info.birthDate.toISOString().slice(0, 10), "1990-05-12")
  assert.equal(r.info.governorate, "القاهرة")
  assert.equal(r.info.age, 36)
})

test("accepts Arabic-Indic digits and spaces", () => {
  assert.equal(normalizeDigits("٢٩٠ ٠٥١٢ ٠١٠١٢٣٤"), "29005120101234")
  assert.equal(parseNationalId("٢٩٠٠٥١٢٠١٠١٢٣٤", NOW).ok, true)
})

test("rejects wrong length or non-digits", () => {
  assert.equal(parseNationalId("2900512010123", NOW).ok, false)
  assert.equal(parseNationalId("2900512010123x", NOW).ok, false)
})

test("rejects an unknown century digit", () => {
  assert.equal(parseNationalId("49005120101234", NOW).ok, false)
})

test("rejects impossible dates", () => {
  assert.equal(parseNationalId("29002300101234", NOW).ok, false) // 30 Feb
  assert.equal(parseNationalId("29013010101234", NOW).ok, false) // month 13
})

test("rejects unknown governorate codes", () => {
  assert.equal(parseNationalId("29005129901234", NOW).ok, false)
})

test("rejects applicants under 18", () => {
  const r = parseNationalId("31001010101234", NOW) // born 2010
  assert.equal(r.ok, false)
})

test("age changes exactly on the birthday", () => {
  const before = parseNationalId("30811070101234", NOW) // 7 Nov 2008 → 17 on 6 Nov 2026
  const after = parseNationalId("30811060101234", NOW) // 6 Nov 2008 → 18 today
  assert.equal(before.ok, false)
  assert.equal(after.ok, true)
})

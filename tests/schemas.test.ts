import { test } from "node:test"
import assert from "node:assert/strict"
import { accountSchema, egyptPhone, entrepreneurProfileSchema } from "../lib/schemas"

test("normalizes Egyptian mobile numbers to +20 format", () => {
  for (const input of ["01012345678", "1012345678", "+201012345678", "٠١٠١٢٣٤٥٦٧٨"]) {
    assert.equal(egyptPhone.parse(input), "+201012345678")
  }
  assert.equal(egyptPhone.safeParse("0131234567").success, false)
})

const base = {
  fullName: "سارة عبد الحميد محمد",
  email: "Sara@Example.com",
  phone: "01012345678",
  governorate: "القاهرة",
  password: "secret123",
  confirmPassword: "secret123",
  nationalId: "29005120101234",
  terms: "on",
}

test("valid account passes and email is lower-cased", () => {
  const r = accountSchema.safeParse(base)
  assert.equal(r.success, true)
  if (r.success) assert.equal(r.data.email, "sara@example.com")
})

test("password must contain letters and digits and match confirmation", () => {
  assert.equal(accountSchema.safeParse({ ...base, password: "12345678", confirmPassword: "12345678" }).success, false)
  const mismatch = accountSchema.safeParse({ ...base, confirmPassword: "secret124" })
  assert.equal(mismatch.success, false)
  if (!mismatch.success) assert.equal(mismatch.error.issues[0].path[0], "confirmPassword")
})

test("full name needs at least three parts", () => {
  assert.equal(accountSchema.safeParse({ ...base, fullName: "سارة محمد" }).success, false)
})

test("terms must be accepted", () => {
  const { terms: _omit, ...noTerms } = base
  assert.equal(accountSchema.safeParse(noTerms).success, false)
})

test("entrepreneur description needs 150+ characters", () => {
  const p = { projectName: "حَبّة", sector: "أغذية ومشروبات", stage: "OPERATING" }
  assert.equal(entrepreneurProfileSchema.safeParse({ ...p, description: "قصير" }).success, false)
  assert.equal(entrepreneurProfileSchema.safeParse({ ...p, description: "و".repeat(150) }).success, true)
})

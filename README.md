# Elevante v2

Elevante connects entrepreneurs, suppliers / service providers and investors. Version 2 rebuilds my ITI graduation project as a real full-stack application, starting from the part every other feature depends on: **verified accounts**.

> Branch `v2` is work in progress. The original v0 web demo stays on `main`.

## What works in this phase

1. **Registration per role.** Entrepreneur, supplier / service provider, or investor. Each role has its own profile fields.
2. **Identity verification (KYC).** Egyptian national ID plus three photos: ID front, ID back, and a selfie holding the ID.
3. **Phone confirmation.** 6-digit one-time code.
4. **Admin review.** Approve the account, or request changes on specific fields with a note.
5. **Resubmission.** The user can edit only the fields the admin flagged, then the account goes back to review.
6. **Access by status.** Only approved accounts reach the dashboard. Admin pages are admin-only.

The next phases are already designed:

- Supply requests, then offers, then accepting an offer.
- Investment deals funded into escrow, with milestone-by-milestone release.

## Tech stack

- **App:** Next.js 15 (App Router, Server Actions), React 19, TypeScript in strict mode.
- **Data:** Prisma 6 with PostgreSQL.
- **Styling:** Tailwind CSS with the Elevante design tokens. The interface is Arabic and right-to-left.
- **Validation and auth:** Zod, signed session cookies with `jose`, and `bcryptjs` for password hashing.

## Getting started

```bash
npm install
cp .env.example .env          # then fill in the values (see comments in the file)
npx prisma migrate dev --name init
npm run db:seed               # creates the first admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

Before running this you need:

- A PostgreSQL database.
- Two secrets, each generated with `openssl rand -base64 32`: `SESSION_SECRET` and `NATIONAL_ID_KEY`.

No SMS provider is connected yet. In development, set `DEV_SHOW_OTP="true"` and the code is shown on the verify page. This option is disabled in production even if it is left on.

```bash
npm test          # unit tests for national ID parsing and form validation
npm run typecheck
```

## Project structure

```
app/
  register/            role selection, role forms, registration action
  verify-phone/        OTP form and actions
  login/               login form
  verification/        status page and resubmission of flagged fields
  dashboard/           approved users only
  admin/verifications/ review queue, review page, decision action
  api/admin/kyc/       streams identity images to admins only
lib/
  national-id.ts       parse and validate the Egyptian national ID
  crypto.ts            AES-256-GCM encryption, keyed hash, OTP hashing
  session*.ts          session cookie, access guards (Edge-safe token code split out)
  storage.ts           private file storage with content-based type checks
  otp.ts, otp-delivery.ts
  schemas.ts           Zod schemas shared by forms and actions
prisma/schema.prisma
middleware.ts          first-line route protection
```

## Technical Challenges & Solutions

### Storing national IDs without exposing them

**Problem:** One account per national ID requires searching by the number, but the number must not sit in the database as plain text.

**Approach:** Keep two values: one that can be decrypted for review, and one that can only be compared.

**Solution:**

- The ID is encrypted with AES-256-GCM (`nationalIdEnc`).
- A keyed HMAC of the ID (`nationalIdHash`) has a unique index and is used for duplicate checks.
- Only the last four digits are kept readable.
- When an admin opens a review page, the ID is decrypted, and that view is written to the audit log.

**Result:** Duplicate national IDs are rejected at the database level, and nothing is stored in plain text.

### Identity images that must never be public

**Problem:** ID photos cannot live under `/public`, and the file type the browser reports cannot be trusted.

**Approach:** Use private storage plus an authorised streaming route.

**Solution:**

- Each upload's type is checked from its content (magic bytes), and its size is capped at 5 MB.
- Files are written under `STORAGE_DIR` with random names.
- They are served only by `/api/admin/kyc/[docId]`. The route checks for an admin session, sends `no-store` and `nosniff` headers, and guards against path traversal.

**Result:** Only admins can open identity images, and browsers do not cache them.

### A review flow that cannot be raced or bypassed

**Problem:**

- Two admins could decide on the same account at the same time.
- A user could change fields the admin did not flag.

**Approach:** Every status change is a conditional update, and the flagged fields are read only from the database.

**Solution:**

- Decisions use `updateMany where status = PENDING_REVIEW` inside a transaction, with an audit entry. If the update changes 0 rows, someone already decided.
- Resubmission reads the flagged fields from the latest review on the server and ignores anything else in the form.

**Result:** Each submission gets exactly one decision, and users can only correct what was asked.

### Validating the Egyptian national ID

**Problem:** A plain 14-digit check accepts many IDs that cannot exist.

**Approach:** Decode the ID's structure: century digit, birth date (`YYMMDD`), and governorate code.

**Solution:**

- `parseNationalId` rejects impossible dates, unknown governorate codes, and applicants under 18.
- It accepts Arabic-Indic digits.
- It runs in the browser before upload and again on the server.
- The admin page shows the birth date and governorate decoded from the ID next to the submitted data.

**Result:** Bad IDs are caught before any image is uploaded. The rules are covered by unit tests in `tests/`.

## Known limitations

- **OTP delivery:** there is no SMS provider yet. `lib/otp-delivery.ts` is the place to connect one.
- **ID check digit:** the last digit is not verified, because its algorithm is not officially published.
- **Rate limiting:** there is no rate limiting on login yet. OTP codes are limited to 5 attempts and one resend per minute.
- **File cleanup:** if saving the account fails after the images are written, the images stay in storage. A cleanup job is planned.

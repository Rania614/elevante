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

### Phase 2: supply requests, offers and orders

1. **Requests.** An approved entrepreneur publishes a supply request: a product or a service, with quantity, an optional budget, and a deadline for offers.
2. **Offers.** Approved suppliers see the open requests that match what they registered for (products, services, or both). Each supplier sends one offer per request, and can edit or withdraw it until the deadline.
3. **Comparing offers.** The entrepreneur compares offers, with the lowest price and the fastest delivery marked.
4. **Accepting.** Accepting one offer rejects the others and creates an order.
5. **Orders.**
   - The supplier moves the order from *accepted* to *in progress*, then to *delivered*.
   - The entrepreneur confirms receipt.

### Phase 3: funding rounds, escrow and milestone releases

1. **Funding round.** An entrepreneur opens one round at a time. It has a target amount, the equity offered for the whole target, a minimum ticket, a closing date, and 2 to 6 milestones. Each milestone's share of the funding is a percentage, and the shares must add up to exactly 100%.
2. **Offers.** Investors browse open rounds and offer an amount. They see live:
   - the equity they would get,
   - the 2% platform fee,
   - the total they would pay.
3. **Accepting.** The entrepreneur accepts or rejects offers. Accepting creates a deal, and the round can never be committed beyond its target. When the round is full it closes automatically.
4. **Funding.** The investor funds the deal (a simulated payment). The amount goes into the deal's escrow account and the fee to the platform. The tranche schedule is created from the milestone shares.
5. **Releasing.** The entrepreneur submits proof for each milestone, in order. Each investor then either:
   - approves, which releases their tranche from escrow to the entrepreneur's wallet, or
   - requests changes with a note, after which the entrepreneur resubmits.

   When all tranches are released, the deal is completed.
6. **Balances.** Wallet and escrow balances are computed from the ledger, never stored.

Supply orders will move onto the same ledger next.

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
  dashboard/           approved users only, with live counts
  requests/            entrepreneur: my requests, new request, offers and accept
  market/              supplier: open requests, submit / edit / withdraw an offer
  offers/              supplier: my offers
  orders/              both parties: order timeline and status steps
  rounds/              entrepreneur: funding rounds, investor offers, milestone proof
  wallet/              entrepreneur: balance and ledger history
  invest/              investor: open rounds and investment offers
  portfolio/           investor: deals, escrow held, milestones to review
  deals/               both parties: funding into escrow, milestone approvals
  admin/verifications/ review queue, review page, decision action
  api/admin/kyc/       streams identity images to admins only
lib/
  national-id.ts       parse and validate the Egyptian national ID
  crypto.ts            AES-256-GCM encryption, keyed hash, OTP hashing
  session*.ts          session cookie, access guards (Edge-safe token code split out)
  storage.ts           private file storage with content-based type checks
  otp.ts, otp-delivery.ts
  schemas.ts           Zod schemas shared by forms and actions
  supply.ts            supply rules: who can do what, in which state (unit tested)
  money.ts, dates.ts   integer piasters; deadlines at end of day in Cairo time
  invest.ts            tranche split, equity, fee, ledger lines, milestone order (unit tested)
  ledger.ts            posts balanced ledger transactions; computes balances
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

### Accepting an offer exactly once

**Problem:** Several things can arrive at the same moment:

- A double click.
- Two open tabs.
- A supplier editing an offer.
- The entrepreneur closing the request.

Without care, a request could end up with two accepted offers.

**Approach:** Treat acceptance as a set of state changes that are all-or-nothing. Each change only applies if the row is still in the state the user saw.

**Solution:** A single transaction does four things:

1. Moves the request from `OPEN` to `AWARDED` with `updateMany where status = OPEN`. If no row changes, the action stops.
2. Moves the chosen offer from `PENDING` to `ACCEPTED`. If that fails, the transaction throws and rolls back the award.
3. Rejects the remaining pending offers.
4. Creates the order.

On top of that:

- A unique index on `Order.requestId` is a database-level backstop.
- When a supplier saves an offer, the server checks again that the request is still open and before its deadline, inside the same transaction as the write.
- Order steps carry the status the user saw, so a step taken in another tab cannot be applied twice.

**Result:** Each request gets at most one order, and every status change happens once.

### An escrow you can audit: a double-entry ledger

**Problem:**

- Keeping balances as numbers that get updated (`balance = balance - x`) loses history.
- It can drift after a partial failure.
- It cannot answer "where did this money come from?"

**Approach:** Never store a balance. Record every money movement as a group of lines that sum to zero, and compute every balance from those lines.

**Solution:** `LedgerEntry` rows share a `txId`, and `assertBalanced` rejects any group that does not sum to zero or that contains non-integer amounts. The accounts are:

- `external:<investor>`: money coming in from outside
- `escrow:<deal>`: money held for one deal
- `wallet:<entrepreneur>`: money released to the entrepreneur
- `platform:fees`: the platform's 2%

The money operations work like this:

- **Funding** posts two balanced transactions: the amount into escrow, and the fee to the platform.
- **Releasing** a tranche moves it from escrow to the wallet. This happens in the same database transaction as the milestone status change, and that transaction first checks that escrow cannot go negative.
- **Tranches** are split in integer piasters. The last tranche absorbs rounding, so they always add up to the exact amount.

**Result:** Every pound in escrow, in a wallet or in fees can be traced to the action that moved it, and the totals always reconcile. The rules are covered by unit tests.

### A round that can never be over-committed

**Problem:** Two investors' offers can be accepted at the same moment for the last part of a round.

**Solution:** Accepting an offer reserves capacity with one atomic update:

```
UPDATE round
SET committed = committed + amount
WHERE committed <= target - amount AND status = 'OPEN'
```

If no row is updated, the round is full. The offer's own status change, the deal creation and the automatic close happen in the same transaction.

### Money and deadlines

**Problem:**

- Floating-point prices round badly. For example, 4.5 EGP × quantity.
- A date-only deadline is ambiguous across time zones and daylight saving.

**Solution:**

- **Amounts:** stored as integer piasters. Input accepts commas and Arabic digits.
- **Deadlines:** stored as the last second of the chosen day in Cairo. The UTC offset is computed for that date, so daylight saving is handled.
- **Tests:** both are unit tested.

## Known limitations

- **OTP delivery:** there is no SMS provider yet. `lib/otp-delivery.ts` is the place to connect one.
- **ID check digit:** the last digit is not verified, because its algorithm is not officially published.
- **Rate limiting:** there is no rate limiting on login yet. OTP codes are limited to 5 attempts and one resend per minute.
- **File cleanup:** if saving the account fails after the images are written, the images stay in storage. A cleanup job is planned.
- **Payments:** they are simulated, and no payment gateway is connected. Funding writes to the ledger as if the money had arrived.
- **Withdrawals:** withdrawing from the wallet to a bank account will be approved by admins in a later phase.
- **Milestone proof:** it is text plus an optional https link. File uploads for proof are planned.

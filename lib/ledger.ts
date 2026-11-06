import "server-only"
import { randomUUID } from "node:crypto"
import type { LedgerKind, Prisma } from "@prisma/client"
import { db } from "./db"
import { assertBalanced, type LedgerLine } from "./invest"

type Tx = Prisma.TransactionClient

/** Writes one balanced ledger transaction. Must be called inside the same DB transaction as the state change it pays for. */
export async function post(tx: Tx, kind: LedgerKind, lines: LedgerLine[], meta: { dealId?: string; orderId?: string; withdrawalId?: string; memo?: string } = {}) {
  assertBalanced(lines)
  const txId = randomUUID()
  await tx.ledgerEntry.createMany({
    data: lines.map((l) => ({ txId, kind, account: l.account, amountPiasters: l.amountPiasters, dealId: meta.dealId, orderId: meta.orderId, withdrawalId: meta.withdrawalId, memo: meta.memo })),
  })
  return txId
}

export async function balance(account: string, client: Tx | typeof db = db): Promise<number> {
  const r = await client.ledgerEntry.aggregate({ where: { account }, _sum: { amountPiasters: true } })
  return r._sum.amountPiasters ?? 0
}

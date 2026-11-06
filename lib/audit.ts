import "server-only"
import type { Prisma } from "@prisma/client"
import { db } from "./db"

type Tx = Prisma.TransactionClient | typeof db

export function audit(
  tx: Tx,
  entry: { actorId: string | null; action: string; targetType: string; targetId: string; meta?: Prisma.InputJsonValue },
) {
  return tx.auditLog.create({ data: entry })
}

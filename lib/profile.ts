import type { Prisma, Role } from "@prisma/client"
import { entrepreneurProfileSchema, investorProfileSchema, supplierProfileSchema } from "./schemas"

/** Typed nested create for the role's profile. Input must already be validated. */
export function profileCreate(role: Role, raw: Record<string, string>): Partial<Prisma.UserCreateInput> {
  if (role === "SUPPLIER") return { supplierProfile: { create: supplierProfileSchema.parse(raw) } }
  if (role === "ENTREPRENEUR") return { entrepreneurProfile: { create: entrepreneurProfileSchema.parse(raw) } }
  if (role === "INVESTOR") return { investorProfile: { create: investorProfileSchema.parse(raw) } }
  return {}
}

/** Typed update for the role's profile (resubmission). */
export function profileUpdate(role: Role, raw: Record<string, string>): Prisma.UserUpdateInput {
  if (role === "SUPPLIER") return { supplierProfile: { update: supplierProfileSchema.parse(raw) } }
  if (role === "ENTREPRENEUR") return { entrepreneurProfile: { update: entrepreneurProfileSchema.parse(raw) } }
  if (role === "INVESTOR") return { investorProfile: { update: investorProfileSchema.parse(raw) } }
  return {}
}

import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const db = new PrismaClient()

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password || password.length < 12) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (12+ characters) in .env before seeding")
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`Admin ${email} already exists — nothing changed.`)
    return
  }

  await db.user.create({
    data: {
      role: "ADMIN",
      status: "APPROVED",
      fullName: "فريق المنصة",
      email,
      phone: "+200000000000",
      passwordHash: await bcrypt.hash(password, 12),
      phoneVerifiedAt: new Date(),
    },
  })
  console.log(`Admin ${email} created.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())

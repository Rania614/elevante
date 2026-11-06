import "server-only"
import { z } from "zod"

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  NATIONAL_ID_KEY: z
    .string()
    .refine((v) => Buffer.from(v, "base64").length === 32, "NATIONAL_ID_KEY must be 32 bytes, base64-encoded"),
  STORAGE_DIR: z.string().default("./storage"),
  DEV_SHOW_OTP: z.enum(["true", "false"]).default("false"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n")
  throw new Error(`Invalid environment variables:\n${issues}\nSee .env.example`)
}

export const env = {
  ...parsed.data,
  // Never reveal OTPs in production, even if the flag was left on by mistake.
  showOtp: parsed.data.DEV_SHOW_OTP === "true" && parsed.data.NODE_ENV !== "production",
}

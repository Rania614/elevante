import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { readPrivateFile } from "@/lib/storage"

// Identity images are never public: admins only, never cached.
export async function GET(_req: Request, { params }: { params: Promise<{ docId: string }> }) {
  const user = await getCurrentUser()
  if (!user || user.role !== "ADMIN") return new Response("Forbidden", { status: 403 })

  const { docId } = await params
  const doc = await db.kycDocument.findUnique({ where: { id: docId } })
  if (!doc) return new Response("Not found", { status: 404 })

  const file = await readPrivateFile(doc.storageKey)
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": doc.mimeType,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
    },
  })
}

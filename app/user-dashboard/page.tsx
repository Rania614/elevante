"use client"

import { Button } from "@/components/ui/button"

interface UserProfile {
  name?: string | null
  email?: string | null
  image?: string | null
}

interface UserDashboardProps {
  userProfile: UserProfile
  onLogout: () => void
}

/**
 * لوحة تحكم المستخدم العادية (غير الأدمن).
 * تُعرض عند تسجيل الدخول بحساب لا يملك صلاحيات الأدمن.
 */
export default function UserDashboard({ userProfile, onLogout }: UserDashboardProps) {
  return (
    <section className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">User Dashboard</h1>

      <p>أهلاً {userProfile.name ? userProfile.name : "User"}، نتمنى لك يوماً سعيداً!</p>

      <Button variant="outline" className="bg-black text-white" onClick={onLogout}>
        Logout
      </Button>
    </section>
  )
}

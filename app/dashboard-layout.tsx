"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

import InvestorPages from "./dashboards/investor/investor-pages"
import SupplierPages from "./dashboards/supplier/supplier-pages"
import EntrepreneurPages from "./dashboards/entrepreneur/entrepreneur-pages"
import SettingsPage from "./settings/page"

interface DashboardLayoutProps {
  userRole: string
  userProfile: any
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function DashboardLayout({
  userRole,
  userProfile,
  currentPage,
  onNavigate,
  onLogout,
}: DashboardLayoutProps) {
  const renderContent = () => {
    if (currentPage === "settings") {
      return <SettingsPage userProfile={userProfile} />
    }

    switch (userRole) {
      case "investor":
        return <InvestorPages currentPage={currentPage} userProfile={userProfile} />
      case "supplier":
        return <SupplierPages currentPage={currentPage} userProfile={userProfile} />
      case "entrepreneur":
        return <EntrepreneurPages currentPage={currentPage} userProfile={userProfile} />
      case "admin":
        // يمكنك استدعاء صفحات الأدمن هنا إن وُجدت
        return <div>Admin dashboard coming soon...</div>
      default:
        return <div>Invalid role</div>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        userRole={userRole}
        userProfile={userProfile}
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />
      <SidebarInset>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

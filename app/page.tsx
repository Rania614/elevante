"use client"

import { useState } from "react"
import LoginPage from "./login/page"
import RegisterPage from "./register/page"
import RoleSelectionPage from "./role-selection/page"
import ProfileCompletionPage from "./profile-completion/page"
import DashboardLayout from "./dashboard-layout"
import DashboardControl from "./dashboard/page"

type PageType =
  | "login"
  | "register"
  | "role-selection"
  | "profile-completion"
  | "dashboard-control"
  | "admin-dashboard"
  | "investor-overview"
  | "investor-opportunities"
  | "investor-portfolio"
  | "investor-analytics"
  | "investor-messages"
  | "investor-notifications"
  | "supplier-overview"
  | "supplier-products"
  | "supplier-orders"
  | "supplier-customers"
  | "supplier-analytics"
  | "supplier-add-product"
  | "supplier-messages"
  | "entrepreneur-overview"
  | "entrepreneur-pitches"
  | "entrepreneur-investors"
  | "entrepreneur-milestones"
  | "entrepreneur-create-pitch"
  | "entrepreneur-find-investors"
  | "entrepreneur-messages"
  | "settings"

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("login")
  const [userEmail, setUserEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [userProfile, setUserProfile] = useState<any>(null)

  const handleRegistrationSuccess = (email: string) => {
    setUserEmail(email)
    setCurrentPage("role-selection")
  }

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role)
    setCurrentPage("profile-completion")
  }

  const handleProfileCompletion = (profileData: any) => {
    setUserProfile({ ...profileData, email: userEmail })
    // Route to different dashboard overviews based on role
    switch (selectedRole) {
      case "investor":
        setCurrentPage("investor-overview")
        break
      case "supplier":
        setCurrentPage("supplier-overview")
        break
      case "entrepreneur":
        setCurrentPage("entrepreneur-overview")
        break
      default:
        setCurrentPage("login")
    }
  }

  const handleLogout = () => {
    setCurrentPage("login")
    setUserEmail("")
    setSelectedRole("")
    setUserProfile(null)
  }

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page)
  }

  const isDashboard =
    currentPage.includes("investor") ||
    currentPage.includes("supplier") ||
    currentPage.includes("entrepreneur") ||
    currentPage === "admin-dashboard" ||
    currentPage === "dashboard-control" ||
    currentPage === "settings"

  const handleLoginSuccess = (userData: any) => {
    setUserEmail(userData.email)
    setSelectedRole(userData.role)
    setUserProfile(userData)

    // Navigate to appropriate dashboard based on role
    switch (userData.role) {
      case "admin":
        setCurrentPage("dashboard-control")
        break
      case "investor":
        setCurrentPage("investor-overview")
        break
      case "supplier":
        setCurrentPage("supplier-overview")
        break
      case "entrepreneur":
        setCurrentPage("entrepreneur-overview")
        break
      default:
        setCurrentPage("login")
    }
  }

  return (
    <div className="min-h-screen bg-elevante-background">
      {!isDashboard && (
        <nav className="bg-white shadow-lg border-b border-elevante-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 elevante-gradient rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <h1 className="text-2xl font-bold text-elevante-primary">Elevante</h1>
                </div>
              </div>
              {currentPage !== "role-selection" && currentPage !== "profile-completion" && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage("login")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === "login"
                        ? "bg-elevante-button text-elevante-primary shadow-md"
                        : "text-elevante-text hover:text-elevante-primary hover:bg-elevante-background"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setCurrentPage("register")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === "register"
                        ? "bg-elevante-button text-elevante-primary shadow-md"
                        : "text-elevante-text hover:text-elevante-primary hover:bg-elevante-background"
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      <main className="flex-1">
        {currentPage === "login" && (
          <LoginPage onSwitchToRegister={() => setCurrentPage("register")} onLoginSuccess={handleLoginSuccess} />
        )}
        {currentPage === "register" && (
          <RegisterPage
            onSwitchToLogin={() => setCurrentPage("login")}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}
        {currentPage === "role-selection" && (
          <RoleSelectionPage userEmail={userEmail} onRoleSelect={handleRoleSelection} />
        )}
        {currentPage === "profile-completion" && (
          <ProfileCompletionPage
            userEmail={userEmail}
            selectedRole={selectedRole}
            onProfileComplete={handleProfileCompletion}
          />
        )}
        {currentPage === "dashboard-control" && (
          <DashboardControl userProfile={userProfile} onLogout={handleLogout} onNavigate={handleNavigation} />
        )}
        {isDashboard && currentPage !== "dashboard-control" && (
          <DashboardLayout
            userRole={selectedRole}
            userProfile={userProfile}
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  )
}

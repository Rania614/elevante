"use client"

import type * as React from "react"
import {
  TrendingUp,
  Package,
  Lightbulb,
  Users,
  BarChart3,
  ShoppingCart,
  Target,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Bell,
  Home,
  Search,
  Plus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userRole: string
  userProfile: any
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

export function AppSidebar({ userRole, userProfile, currentPage, onNavigate, onLogout, ...props }: AppSidebarProps) {
  const getRoleIcon = () => {
    switch (userRole) {
      case "investor":
        return <TrendingUp className="w-4 h-4" />
      case "supplier":
        return <Package className="w-4 h-4" />
      case "entrepreneur":
        return <Lightbulb className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getRoleColor = () => {
    switch (userRole) {
      case "investor":
        return "bg-elevante-secondary text-white"
      case "supplier":
        return "bg-elevante-primary text-white"
      case "entrepreneur":
        return "bg-elevante-button text-elevante-primary"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getNavigationItems = () => {
    switch (userRole) {
      case "investor":
        return [
          {
            title: "Dashboard",
            items: [
              { title: "Overview", icon: Home, page: "investor-overview" },
              { title: "Opportunities", icon: Search, page: "investor-opportunities" },
              { title: "My Portfolio", icon: BarChart3, page: "investor-portfolio" },
              { title: "Analytics", icon: TrendingUp, page: "investor-analytics" },
            ],
          },
          {
            title: "Tools",
            items: [
              { title: "Messages", icon: MessageSquare, page: "investor-messages" },
              { title: "Notifications", icon: Bell, page: "investor-notifications" },
            ],
          },
        ]
      case "supplier":
        return [
          {
            title: "Dashboard",
            items: [
              { title: "Overview", icon: Home, page: "supplier-overview" },
              { title: "Products", icon: Package, page: "supplier-products" },
              { title: "Orders", icon: ShoppingCart, page: "supplier-orders" },
              { title: "Customers", icon: Users, page: "supplier-customers" },
              { title: "Analytics", icon: BarChart3, page: "supplier-analytics" },
            ],
          },
          {
            title: "Tools",
            items: [
              { title: "Add Product", icon: Plus, page: "supplier-add-product" },
              { title: "Messages", icon: MessageSquare, page: "supplier-messages" },
            ],
          },
        ]
      case "entrepreneur":
        return [
          {
            title: "Dashboard",
            items: [
              { title: "Overview", icon: Home, page: "entrepreneur-overview" },
              { title: "My Pitches", icon: FileText, page: "entrepreneur-pitches" },
              { title: "Investors", icon: Users, page: "entrepreneur-investors" },
              { title: "Milestones", icon: Target, page: "entrepreneur-milestones" },
            ],
          },
          {
            title: "Tools",
            items: [
              { title: "Create Pitch", icon: Plus, page: "entrepreneur-create-pitch" },
              { title: "Find Investors", icon: Search, page: "entrepreneur-find-investors" },
              { title: "Messages", icon: MessageSquare, page: "entrepreneur-messages" },
            ],
          },
        ]
      default:
        return []
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-2 py-4">
          <div className="w-8 h-8 elevante-gradient rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-xl font-bold text-elevante-primary">Elevante</h1>
        </div>
        <div className="px-2 pb-2">
          <Badge className={`${getRoleColor()} shadow-md font-semibold`}>
            {getRoleIcon()}
            <span className="ml-2 capitalize">{userRole}</span>
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {getNavigationItems().map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.page)}
                      isActive={currentPage === item.page}
                      className="w-full"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-2 px-2 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor()} shadow-md`}>
                <span className="text-sm font-medium">{userProfile?.fullName?.charAt(0) || "U"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-elevante-text truncate">{userProfile?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{userProfile?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => onNavigate("settings")}>
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

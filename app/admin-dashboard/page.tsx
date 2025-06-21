"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  TrendingUp,
  Package,
  Lightbulb,
  BarChart3,
  Settings,
  Shield,
  Activity,
  DollarSign,
  UserCheck,
} from "lucide-react"

interface AdminDashboardProps {
  userProfile: any
  onLogout: () => void
}

export default function AdminDashboard({ userProfile, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for admin dashboard
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
    investors: 324,
    suppliers: 456,
    entrepreneurs: 467,
  }

  const recentActivity = [
    { id: 1, action: "New user registration", user: "john@example.com", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Investment completed", user: "sarah@investor.com", time: "15 minutes ago", type: "investment" },
    { id: 3, action: "Product listed", user: "mike@supplier.com", time: "1 hour ago", type: "product" },
    { id: 4, action: "Pitch submitted", user: "emily@startup.com", time: "2 hours ago", type: "pitch" },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <UserCheck className="w-4 h-4 text-blue-500" />
      case "investment":
        return <DollarSign className="w-4 h-4 text-green-500" />
      case "product":
        return <Package className="w-4 h-4 text-purple-500" />
      case "pitch":
        return <Lightbulb className="w-4 h-4 text-orange-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-elevante-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-elevante-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 elevante-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <h1 className="text-2xl font-bold text-elevante-primary">Elevante Admin</h1>
              </div>
              <Badge className="bg-red-500 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-elevante-text">{userProfile?.fullName}</p>
                <p className="text-xs text-gray-500">{userProfile?.email}</p>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "users", label: "Users", icon: Users },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-elevante-primary text-elevante-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investors</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.investors}</div>
                  <p className="text-xs text-muted-foreground">Active investors</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.suppliers}</div>
                  <p className="text-xs text-muted-foreground">Registered suppliers</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-900">Investors</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.investors}</p>
                    <p className="text-sm text-blue-700">Active investors</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <Package className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-purple-900">Suppliers</h3>
                    <p className="text-2xl font-bold text-purple-600">{stats.suppliers}</p>
                    <p className="text-sm text-purple-700">Registered suppliers</p>
                  </div>
                  <div className="text-center p-6 bg-orange-50 rounded-lg">
                    <Lightbulb className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-orange-900">Entrepreneurs</h3>
                    <p className="text-2xl font-bold text-orange-600">{stats.entrepreneurs}</p>
                    <p className="text-sm text-orange-700">Active entrepreneurs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">User Registration</h4>
                      <p className="text-sm text-gray-500">Allow new users to register</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Manage email notification settings</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Platform Maintenance</h4>
                      <p className="text-sm text-gray-500">Schedule maintenance windows</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

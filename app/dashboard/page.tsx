"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Package,
  Lightbulb,
  Shield,
  Activity,
  DollarSign,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface DashboardControlProps {
  userProfile: any
  onLogout: () => void
  onNavigate: (page: string) => void
}

export default function DashboardControl({ userProfile, onLogout, onNavigate }: DashboardControlProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock data for comprehensive dashboard
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
    investors: 324,
    suppliers: 456,
    entrepreneurs: 467,
    pendingApprovals: 23,
    activeProjects: 89,
    completedDeals: 156,
    systemHealth: 98.5,
  }

  const userManagement = [
    {
      id: 1,
      name: "John Smith",
      email: "john@investor.com",
      role: "investor",
      status: "active",
      joinDate: "2024-01-15",
      lastLogin: "2024-01-20",
      verified: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@supplier.com",
      role: "supplier",
      status: "pending",
      joinDate: "2024-01-18",
      lastLogin: "2024-01-19",
      verified: false,
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@startup.com",
      role: "entrepreneur",
      status: "active",
      joinDate: "2024-01-10",
      lastLogin: "2024-01-20",
      verified: true,
    },
  ]

  const projectFlow = [
    {
      id: 1,
      title: "Tech Startup Investment",
      investor: "John Smith",
      entrepreneur: "Mike Chen",
      amount: "$50,000",
      status: "in-progress",
      stage: "due-diligence",
      progress: 65,
    },
    {
      id: 2,
      title: "Supply Chain Partnership",
      supplier: "Sarah Johnson",
      entrepreneur: "Lisa Wang",
      amount: "$25,000",
      status: "completed",
      stage: "delivered",
      progress: 100,
    },
    {
      id: 3,
      title: "Green Energy Project",
      investor: "David Brown",
      entrepreneur: "Alex Kim",
      amount: "$100,000",
      status: "pending",
      stage: "proposal",
      progress: 20,
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High server load detected",
      time: "5 minutes ago",
      severity: "medium",
    },
    {
      id: 2,
      type: "info",
      message: "Scheduled maintenance in 2 hours",
      time: "1 hour ago",
      severity: "low",
    },
    {
      id: 3,
      type: "error",
      message: "Payment gateway timeout",
      time: "15 minutes ago",
      severity: "high",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-500" />
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
                <h1 className="text-2xl font-bold text-elevante-primary">Elevante Control Center</h1>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Shield className="w-3 h-3 mr-1" />
                Master Control
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-elevante-text">{userProfile?.fullName || "Admin"}</p>
                <p className="text-xs text-gray-500">{userProfile?.email || "admin@elevante.com"}</p>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => onNavigate("admin-dashboard")} className="elevante-gradient text-white">
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
            <Button onClick={() => onNavigate("investor-overview")} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Investor View
            </Button>
            <Button onClick={() => onNavigate("supplier-overview")} variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Supplier View
            </Button>
            <Button onClick={() => onNavigate("entrepreneur-overview")} variant="outline">
              <Lightbulb className="w-4 h-4 mr-2" />
              Entrepreneur View
            </Button>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Health Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.activeUsers} active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${systemStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+{systemStats.monthlyGrowth}% growth</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.activeProjects}</div>
                  <p className="text-xs text-muted-foreground">{systemStats.completedDeals} completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.systemHealth}%</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Recent system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>{alert.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Users</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="filter">Filter by Role</Label>
                <select
                  id="filter"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Roles</option>
                  <option value="investor">Investors</option>
                  <option value="supplier">Suppliers</option>
                  <option value="entrepreneur">Entrepreneurs</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users and their permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Join Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userManagement.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="capitalize">
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </td>
                          <td className="p-2 text-sm text-gray-500">{user.joinDate}</td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Flow Management</CardTitle>
                <CardDescription>Monitor and control all project workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectFlow.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-sm text-gray-500">Amount: {project.amount}</p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-elevante-primary h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Stage: <span className="font-medium">{project.stage}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Investors</span>
                      <span className="font-semibold">{systemStats.investors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suppliers</span>
                      <span className="font-semibold">{systemStats.suppliers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entrepreneurs</span>
                      <span className="font-semibold">{systemStats.entrepreneurs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">+{systemStats.monthlyGrowth}%</div>
                  <p className="text-sm text-gray-500">Compared to last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">{systemStats.pendingApprovals}</div>
                  <p className="text-sm text-gray-500">Require attention</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>User Registration</span>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Email Settings</span>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span>Payment Gateway</span>
                    <Button size="sm" variant="outline">
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Backup System
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

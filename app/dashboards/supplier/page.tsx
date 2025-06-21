"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Package,
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Edit,
  LogOut,
  Bell,
  Settings,
  DollarSign,
  Star,
  Truck,
} from "lucide-react"

interface SupplierDashboardProps {
  userEmail: string
  userProfile: any
  onLogout: () => void
}

export default function SupplierDashboard({ userEmail, userProfile, onLogout }: SupplierDashboardProps) {
  const [activeTab, setActiveTab] = useState("products")

  const products = [
    {
      id: 1,
      name: "Premium Office Chairs",
      category: "Furniture",
      price: "$299",
      stock: 45,
      orders: 23,
      rating: 4.8,
      status: "Active",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "$149",
      stock: 120,
      orders: 67,
      rating: 4.6,
      status: "Active",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Standing Desk",
      category: "Furniture",
      price: "$599",
      stock: 8,
      orders: 15,
      rating: 4.9,
      status: "Low Stock",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const orders = [
    {
      id: "ORD-001",
      customer: "TechCorp Inc",
      product: "Premium Office Chairs",
      quantity: 10,
      total: "$2,990",
      status: "Processing",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "StartupHub",
      product: "Standing Desk",
      quantity: 3,
      total: "$1,797",
      status: "Shipped",
      date: "2024-01-14",
    },
    {
      id: "ORD-003",
      customer: "Creative Agency",
      product: "Wireless Headphones",
      quantity: 25,
      total: "$3,725",
      status: "Delivered",
      date: "2024-01-12",
    },
  ]

  const customers = [
    {
      name: "TechCorp Inc",
      orders: 15,
      totalSpent: "$45,000",
      lastOrder: "2024-01-15",
      status: "Active",
    },
    {
      name: "StartupHub",
      orders: 8,
      totalSpent: "$12,500",
      lastOrder: "2024-01-14",
      status: "Active",
    },
    {
      name: "Creative Agency",
      orders: 22,
      totalSpent: "$67,800",
      lastOrder: "2024-01-12",
      status: "VIP",
    },
  ]

  return (
    <div className="min-h-screen bg-elevante-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-elevante-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 elevante-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <h1 className="text-2xl font-bold text-elevante-primary">Elevante</h1>
              </div>
              <Badge className="bg-elevante-primary text-white">Supplier</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-elevante-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{userProfile?.fullName?.charAt(0) || "S"}</span>
                </div>
                <span className="text-sm font-medium text-elevante-text">{userProfile?.fullName}</span>
              </div>
              <Button onClick={onLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userProfile?.fullName}!</h2>
          <p className="text-gray-600">Manage your products, orders, and grow your business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$125K</p>
                </div>
                <DollarSign className="w-8 h-8 text-elevante-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <Package className="w-8 h-8 text-elevante-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">156</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-elevante-button" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Customer Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "products"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "orders" ? "bg-white text-elevante-primary shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "customers"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Search and Add Product */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>
              <Button className="elevante-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="elevante-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          <Badge
                            variant={product.status === "Active" ? "default" : "destructive"}
                            className={
                              product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-lg">{product.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                          <span>Stock: {product.stock}</span>
                          <span>Orders: {product.orders}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <Card className="elevante-card">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage and track your customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-sm">{order.product}</p>
                            <p className="text-sm text-gray-600">Qty: {order.quantity}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.total}</p>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="ml-4">
                        <Button size="sm" variant="outline">
                          <Truck className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <div className="space-y-6">
            <Card className="elevante-card">
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Track your customer relationships and sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-elevante-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{customer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-600">{customer.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{customer.totalSpent}</p>
                        <p className="text-sm text-gray-600">Total spent</p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={customer.status === "VIP" ? "default" : "secondary"}
                          className={
                            customer.status === "VIP" ? "bg-elevante-secondary text-white" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {customer.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">Last: {customer.lastOrder}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="text-sm font-medium">$28,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Month</span>
                      <span className="text-sm font-medium">$24,200</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Growth</span>
                      <span className="text-sm font-medium text-green-600">+17.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Best Product</span>
                      <span className="text-sm font-medium">Wireless Headphones</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle>Business Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="text-sm font-medium">12.5%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Order Value</span>
                      <span className="text-sm font-medium">$801</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Retention</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Since</span>
                      <span className="text-sm font-medium">Mar 2023</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

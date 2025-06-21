"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Package, ShoppingCart, Search, Plus, Eye, Edit, DollarSign, Star, Truck } from "lucide-react"

interface SupplierPagesProps {
  currentPage: string
  userProfile: any
}

export default function SupplierPages({ currentPage, userProfile }: SupplierPagesProps) {
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

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userProfile?.fullName}!</h2>
        <p className="text-gray-600">Here's your business overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="elevante-card">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{order.id}</p>
                    <p className="text-xs text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.total}</p>
                    <Badge
                      variant={
                        order.status === "Delivered" ? "default" : order.status === "Shipped" ? "secondary" : "outline"
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="elevante-card">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{product.price}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{product.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Products</h2>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button className="elevante-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Search products..." className="pl-10" />
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
  )

  const renderOrders = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Orders</h2>
        <p className="text-gray-600">Manage and track your customer orders</p>
      </div>

      <Card className="elevante-card">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
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
                      order.status === "Delivered" ? "default" : order.status === "Shipped" ? "secondary" : "outline"
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
  )

  const renderCustomers = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customers</h2>
        <p className="text-gray-600">Track your customer relationships and sales</p>
      </div>

      <Card className="elevante-card">
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
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
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h2>
        <p className="text-gray-600">Detailed insights into your business performance</p>
      </div>

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
  )

  const renderAddProduct = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h2>
        <p className="text-gray-600">Add a new product to your catalog</p>
      </div>

      <Card className="elevante-card max-w-2xl">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>Fill in the details for your new product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input placeholder="e.g., Premium Office Chair" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="e.g., Furniture" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Price</label>
              <Input placeholder="299.00" type="number" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Stock Quantity</label>
              <Input placeholder="50" type="number" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe your product..." className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Product Images</label>
            <Input type="file" multiple accept="image/*" className="mt-1" />
          </div>
          <Button className="elevante-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Messages</h2>
        <p className="text-gray-600">Communicate with your customers</p>
      </div>

      <Card className="elevante-card">
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-elevante-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">TC</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">TechCorp Inc</p>
                <p className="text-xs text-gray-600">When can we expect the office chairs delivery?</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">1h ago</p>
                <Badge className="bg-elevante-button text-elevante-primary">New</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-elevante-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SH</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">StartupHub</p>
                <p className="text-xs text-gray-600">Thank you for the quick delivery!</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">2d ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  switch (currentPage) {
    case "supplier-overview":
      return renderOverview()
    case "supplier-products":
      return renderProducts()
    case "supplier-orders":
      return renderOrders()
    case "supplier-customers":
      return renderCustomers()
    case "supplier-analytics":
      return renderAnalytics()
    case "supplier-add-product":
      return renderAddProduct()
    case "supplier-messages":
      return renderMessages()
    default:
      return renderOverview()
  }
}

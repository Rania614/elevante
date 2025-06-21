"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  TrendingUp,
  DollarSign,
  Users,
  Search,
  Filter,
  Eye,
  Star,
  BarChart3,
  PieChart,
  LogOut,
  Bell,
  Settings,
  Briefcase,
} from "lucide-react"

interface InvestorDashboardProps {
  userEmail: string
  userProfile: any
  onLogout: () => void
}

export default function InvestorDashboard({ userEmail, userProfile, onLogout }: InvestorDashboardProps) {
  const [activeTab, setActiveTab] = useState("opportunities")

  const opportunities = [
    {
      id: 1,
      company: "TechFlow AI",
      industry: "Technology",
      stage: "Series A",
      fundingGoal: "$2M",
      raised: "$1.2M",
      progress: 60,
      description: "AI-powered workflow automation for enterprises",
      founder: "Sarah Chen",
      location: "San Francisco, CA",
      rating: 4.8,
      investors: 23,
    },
    {
      id: 2,
      company: "GreenEnergy Solutions",
      industry: "Energy",
      stage: "Seed",
      fundingGoal: "$500K",
      raised: "$320K",
      progress: 64,
      description: "Renewable energy solutions for residential properties",
      founder: "Michael Rodriguez",
      location: "Austin, TX",
      rating: 4.6,
      investors: 15,
    },
    {
      id: 3,
      company: "HealthTrack Pro",
      industry: "Healthcare",
      stage: "Pre-Series A",
      fundingGoal: "$1.5M",
      raised: "$800K",
      progress: 53,
      description: "Digital health monitoring platform for chronic diseases",
      founder: "Dr. Emily Watson",
      location: "Boston, MA",
      rating: 4.9,
      investors: 31,
    },
  ]

  const portfolio = [
    {
      company: "DataViz Inc",
      invested: "$50K",
      currentValue: "$75K",
      growth: "+50%",
      status: "Growing",
    },
    {
      company: "EcoTech Solutions",
      invested: "$25K",
      currentValue: "$30K",
      growth: "+20%",
      status: "Stable",
    },
    {
      company: "MedConnect",
      invested: "$100K",
      currentValue: "$180K",
      growth: "+80%",
      status: "Excellent",
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
              <Badge className="bg-elevante-secondary text-white">Investor</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-elevante-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{userProfile?.fullName?.charAt(0) || "I"}</span>
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
          <p className="text-gray-600">Discover new investment opportunities and manage your portfolio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">$175K</p>
                </div>
                <DollarSign className="w-8 h-8 text-elevante-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                  <p className="text-2xl font-bold text-gray-900">$285K</p>
                </div>
                <TrendingUp className="w-8 h-8 text-elevante-button" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Investments</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Briefcase className="w-8 h-8 text-elevante-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-green-600">+62.8%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "opportunities"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Investment Opportunities
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "portfolio"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Portfolio
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

        {/* Investment Opportunities Tab */}
        {activeTab === "opportunities" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search opportunities..." className="pl-10" />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => (
                <Card key={opportunity.id} className="elevante-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{opportunity.company}</CardTitle>
                        <CardDescription>{opportunity.industry}</CardDescription>
                      </div>
                      <Badge variant="outline">{opportunity.stage}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{opportunity.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Funding Progress</span>
                        <span className="font-medium">
                          {opportunity.raised} / {opportunity.fundingGoal}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-elevante-button h-2 rounded-full"
                          style={{ width: `${opportunity.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{opportunity.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{opportunity.investors} investors</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Founder:</span> {opportunity.founder}
                      </p>
                      <p className="text-sm text-gray-600">{opportunity.location}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 elevante-button">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Invest
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Overview */}
              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle>Portfolio Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolio.map((investment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{investment.company}</p>
                          <p className="text-sm text-gray-600">Invested: {investment.invested}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{investment.currentValue}</p>
                          <p className="text-sm text-green-600">{investment.growth}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-elevante-button rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">New investment opportunity: TechFlow AI</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-elevante-secondary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">MedConnect reached funding milestone</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-elevante-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">Portfolio valuation updated</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Investment Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Technology</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Healthcare</span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Energy</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Other</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average ROI</span>
                      <span className="text-sm font-medium text-green-600">+62.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Best Performing</span>
                      <span className="text-sm font-medium">MedConnect (+80%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Investments</span>
                      <span className="text-sm font-medium">12 companies</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Since</span>
                      <span className="text-sm font-medium">Jan 2024</span>
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

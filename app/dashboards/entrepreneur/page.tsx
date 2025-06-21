"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Lightbulb,
  DollarSign,
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  LogOut,
  Bell,
  Settings,
  Target,
  MessageSquare,
  FileText,
  Rocket,
} from "lucide-react"

interface EntrepreneurDashboardProps {
  userEmail: string
  userProfile: any
  onLogout: () => void
}

export default function EntrepreneurDashboard({ userEmail, userProfile, onLogout }: EntrepreneurDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const pitches = [
    {
      id: 1,
      title: "AI-Powered Customer Service",
      status: "Active",
      views: 245,
      interested: 12,
      funding: "$500K",
      stage: "Seed",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      title: "Sustainable Food Delivery",
      status: "Draft",
      views: 0,
      interested: 0,
      funding: "$250K",
      stage: "Pre-Seed",
      lastUpdated: "2024-01-10",
    },
  ]

  const investors = [
    {
      name: "Sarah Johnson",
      company: "TechVentures",
      interest: "High",
      amount: "$100K",
      status: "Negotiating",
      lastContact: "2024-01-14",
    },
    {
      name: "Michael Chen",
      company: "Innovation Capital",
      interest: "Medium",
      amount: "$75K",
      status: "Interested",
      lastContact: "2024-01-12",
    },
    {
      name: "Emily Rodriguez",
      company: "Future Fund",
      interest: "High",
      amount: "$150K",
      status: "Meeting Scheduled",
      lastContact: "2024-01-16",
    },
  ]

  const milestones = [
    {
      title: "MVP Development",
      status: "Completed",
      date: "2024-01-01",
      description: "Built and tested minimum viable product",
    },
    {
      title: "First Customer Acquisition",
      status: "In Progress",
      date: "2024-02-01",
      description: "Onboard first 10 paying customers",
    },
    {
      title: "Series A Funding",
      status: "Planned",
      date: "2024-06-01",
      description: "Raise $2M Series A round",
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
              <Badge className="bg-elevante-button text-elevante-primary">Entrepreneur</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-elevante-button rounded-full flex items-center justify-center">
                  <span className="text-elevante-primary text-sm font-medium">
                    {userProfile?.fullName?.charAt(0) || "E"}
                  </span>
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
          <p className="text-gray-600">Build, pitch, and grow your startup with Elevante</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Funding Raised</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Pitches</p>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                </div>
                <Lightbulb className="w-8 h-8 text-elevante-button" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interested Investors</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <Users className="w-8 h-8 text-elevante-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Business Stage</p>
                  <p className="text-lg font-bold text-gray-900">{userProfile?.businessStage || "MVP"}</p>
                </div>
                <Rocket className="w-8 h-8 text-elevante-hover" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("pitches")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "pitches" ? "bg-white text-elevante-primary shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Pitches
          </button>
          <button
            onClick={() => setActiveTab("investors")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "investors"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Investors
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "milestones"
                ? "bg-white text-elevante-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Milestones
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="elevante-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Get started with your entrepreneurial journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full elevante-button justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Pitch
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    Find Investors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Connect with Mentors
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Business Plan Builder
                  </Button>
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
                        <p className="text-sm">New investor viewed your pitch</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-elevante-secondary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">Meeting scheduled with TechVentures</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-elevante-primary rounded-full" />
                      <div className="flex-1">
                        <p className="text-sm">Pitch deck updated</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Business Overview */}
            <Card className="elevante-card">
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Business Idea</h4>
                    <p className="text-sm text-gray-600">
                      {userProfile?.businessIdea ||
                        "AI-powered customer service platform that helps businesses automate support while maintaining personal touch."}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Target Market</h4>
                    <p className="text-sm text-gray-600">
                      Small to medium businesses looking to scale customer support operations efficiently.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Competitive Advantage</h4>
                    <p className="text-sm text-gray-600">
                      Advanced AI with human-like responses and seamless integration with existing systems.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pitches Tab */}
        {activeTab === "pitches" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">My Pitches</h3>
              <Button className="elevante-button">
                <Plus className="w-4 h-4 mr-2" />
                Create New Pitch
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pitches.map((pitch) => (
                <Card key={pitch.id} className="elevante-card hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pitch.title}</CardTitle>
                        <CardDescription>
                          {pitch.stage} • {pitch.funding}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={pitch.status === "Active" ? "default" : "secondary"}
                        className={
                          pitch.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {pitch.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Views</p>
                        <p className="font-medium">{pitch.views}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Interested</p>
                        <p className="font-medium">{pitch.interested}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Last updated: {pitch.lastUpdated}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 elevante-button">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Investors Tab */}
        {activeTab === "investors" && (
          <div className="space-y-6">
            <Card className="elevante-card">
              <CardHeader>
                <CardTitle>Investor Connections</CardTitle>
                <CardDescription>Track your investor relationships and funding progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investors.map((investor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-elevante-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{investor.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{investor.name}</p>
                          <p className="text-sm text-gray-600">{investor.company}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{investor.amount}</p>
                        <Badge
                          variant={investor.interest === "High" ? "default" : "secondary"}
                          className={
                            investor.interest === "High"
                              ? "bg-elevante-secondary text-white"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {investor.interest} Interest
                        </Badge>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            investor.status === "Negotiating"
                              ? "bg-yellow-100 text-yellow-800"
                              : investor.status === "Meeting Scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                          }
                        >
                          {investor.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">Last: {investor.lastContact}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === "milestones" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Business Milestones</h3>
              <Button className="elevante-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </div>

            <Card className="elevante-card">
              <CardHeader>
                <CardTitle>Roadmap Progress</CardTitle>
                <CardDescription>Track your startup journey and key achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            milestone.status === "Completed"
                              ? "bg-green-500"
                              : milestone.status === "In Progress"
                                ? "bg-elevante-button"
                                : "bg-gray-300"
                          }`}
                        />
                        {index < milestones.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{milestone.title}</h4>
                          <Badge
                            variant={
                              milestone.status === "Completed"
                                ? "default"
                                : milestone.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              milestone.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : milestone.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {milestone.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{milestone.description}</p>
                        <p className="text-xs text-gray-500">Target: {milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Milestone Creation Form */}
            <Card className="elevante-card">
              <CardHeader>
                <CardTitle>Add New Milestone</CardTitle>
                <CardDescription>Set goals and track your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Milestone Title</label>
                    <Input placeholder="e.g., Launch Beta Version" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Date</label>
                    <Input type="date" className="mt-1" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe what needs to be accomplished..." className="mt-1" />
                </div>
                <Button className="elevante-button">
                  <Target className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

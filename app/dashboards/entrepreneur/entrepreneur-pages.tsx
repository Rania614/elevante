"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Target,
  MessageSquare,
  FileText,
  Rocket,
  TrendingUp,
} from "lucide-react"

interface EntrepreneurPagesProps {
  currentPage: string
  userProfile: any
}

export default function EntrepreneurPages({ currentPage, userProfile }: EntrepreneurPagesProps) {
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

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {userProfile?.fullName}!</h2>
        <p className="text-gray-600">Here's your startup overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  )

  const renderPitches = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Pitches</h2>
          <p className="text-gray-600">Manage your funding pitches and presentations</p>
        </div>
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
                  className={pitch.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
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
  )

  const renderInvestors = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Investor Connections</h2>
        <p className="text-gray-600">Track your investor relationships and funding progress</p>
      </div>

      <Card className="elevante-card">
        <CardHeader>
          <CardTitle>Active Investor Conversations</CardTitle>
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
                      investor.interest === "High" ? "bg-elevante-secondary text-white" : "bg-gray-100 text-gray-800"
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
  )

  const renderMilestones = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Milestones</h2>
          <p className="text-gray-600">Track your startup journey and key achievements</p>
        </div>
        <Button className="elevante-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <Card className="elevante-card">
        <CardHeader>
          <CardTitle>Roadmap Progress</CardTitle>
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

      {/* Add Milestone Form */}
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
  )

  const renderCreatePitch = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Pitch</h2>
        <p className="text-gray-600">Build a compelling pitch to attract investors</p>
      </div>

      <Card className="elevante-card max-w-4xl">
        <CardHeader>
          <CardTitle>Pitch Builder</CardTitle>
          <CardDescription>Create a professional pitch deck for your startup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Pitch Title</label>
              <Input placeholder="e.g., AI-Powered Customer Service Platform" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Funding Goal</label>
              <Input placeholder="e.g., $500,000" className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Business Stage</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select stage</option>
                <option value="idea">Idea Stage</option>
                <option value="prototype">Prototype</option>
                <option value="mvp">MVP</option>
                <option value="early-revenue">Early Revenue</option>
                <option value="growth">Growth Stage</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Industry</label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="ecommerce">E-commerce</option>
                <option value="education">Education</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Executive Summary</label>
            <Textarea placeholder="Provide a compelling overview of your business..." className="mt-1 min-h-[100px]" />
          </div>

          <div>
            <label className="text-sm font-medium">Problem Statement</label>
            <Textarea placeholder="What problem are you solving?" className="mt-1 min-h-[80px]" />
          </div>

          <div>
            <label className="text-sm font-medium">Solution</label>
            <Textarea placeholder="How does your product/service solve this problem?" className="mt-1 min-h-[80px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Market Size</label>
              <Input placeholder="e.g., $10B TAM" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Business Model</label>
              <Input placeholder="e.g., SaaS, Subscription" className="mt-1" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Pitch Deck</label>
            <Input type="file" accept=".pdf,.ppt,.pptx" className="mt-1" />
            <p className="text-xs text-gray-500 mt-1">Upload your pitch deck (PDF or PowerPoint)</p>
          </div>

          <div className="flex gap-4">
            <Button className="elevante-button">
              <FileText className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-elevante-secondary text-white">
              <Rocket className="w-4 h-4 mr-2" />
              Publish Pitch
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderFindInvestors = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Investors</h2>
        <p className="text-gray-600">Discover investors that match your startup profile</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Search investors by name, company, or industry..." className="pl-10" />
        </div>
        <Button variant="outline">Filter by Stage</Button>
        <Button variant="outline">Filter by Amount</Button>
      </div>

      {/* Investor Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          {
            name: "Alex Thompson",
            company: "Venture Capital Partners",
            focus: "Early-stage tech startups",
            range: "$50K - $500K",
            portfolio: 45,
            rating: 4.8,
          },
          {
            name: "Maria Garcia",
            company: "Innovation Fund",
            focus: "Healthcare & AI",
            range: "$100K - $1M",
            portfolio: 32,
            rating: 4.9,
          },
          {
            name: "David Kim",
            company: "Tech Angels",
            focus: "SaaS & Enterprise",
            range: "$25K - $250K",
            portfolio: 67,
            rating: 4.7,
          },
        ].map((investor, index) => (
          <Card key={index} className="elevante-card hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-elevante-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{investor.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{investor.name}</CardTitle>
                  <CardDescription>{investor.company}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Investment Focus</p>
                <p className="text-sm text-gray-600">{investor.focus}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Investment Range</p>
                <p className="text-sm text-gray-600">{investor.range}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-600">Portfolio</p>
                  <p className="font-medium">{investor.portfolio} companies</p>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-medium">{investor.rating}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 elevante-button">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Connect
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
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Messages</h2>
        <p className="text-gray-600">Communicate with investors and mentors</p>
      </div>

      <Card className="elevante-card">
        <CardHeader>
          <CardTitle>Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-elevante-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">SJ</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Sarah Johnson - TechVentures</p>
                <p className="text-xs text-gray-600">I'm interested in learning more about your AI platform...</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">1h ago</p>
                <Badge className="bg-elevante-button text-elevante-primary">New</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-elevante-secondary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">MC</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Michael Chen - Innovation Capital</p>
                <p className="text-xs text-gray-600">Great pitch! Let's schedule a follow-up call...</p>
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
    case "entrepreneur-overview":
      return renderOverview()
    case "entrepreneur-pitches":
      return renderPitches()
    case "entrepreneur-investors":
      return renderInvestors()
    case "entrepreneur-milestones":
      return renderMilestones()
    case "entrepreneur-create-pitch":
      return renderCreatePitch()
    case "entrepreneur-find-investors":
      return renderFindInvestors()
    case "entrepreneur-messages":
      return renderMessages()
    default:
      return renderOverview()
  }
}

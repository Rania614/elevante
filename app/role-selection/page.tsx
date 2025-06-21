"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Package, Lightbulb } from "lucide-react"

interface RoleSelectionPageProps {
  userEmail: string
  onRoleSelect: (role: string) => void
}

export default function RoleSelectionPage({ userEmail, onRoleSelect }: RoleSelectionPageProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const roles = [
    {
      id: "investor",
      title: "Investor",
      description: "Fund promising startups and businesses",
      longDescription:
        "Connect with entrepreneurs and growing businesses. Diversify your portfolio with carefully vetted investment opportunities.",
      icon: TrendingUp,
      color: "bg-elevante-secondary",
      features: [
        "Access to vetted startups",
        "Portfolio management tools",
        "Due diligence reports",
        "Direct founder communication",
      ],
      benefits: ["High ROI potential", "Network with entrepreneurs", "Diversified opportunities"],
    },
    {
      id: "supplier",
      title: "Supplier",
      description: "Provide products and services to businesses",
      longDescription:
        "Showcase your products and services to a network of businesses and entrepreneurs looking for reliable suppliers.",
      icon: Package,
      color: "bg-elevante-primary",
      features: [
        "Business marketplace access",
        "Order management system",
        "Payment processing",
        "Customer relationship tools",
      ],
      benefits: ["B2B marketplace", "Expand your reach", "Build partnerships"],
    },
    {
      id: "entrepreneur",
      title: "Entrepreneur",
      description: "Launch and grow your business ideas",
      longDescription:
        "Turn your innovative ideas into successful businesses. Access funding, suppliers, and mentorship all in one platform.",
      icon: Lightbulb,
      color: "bg-elevante-button",
      features: ["Pitch to investors", "Find reliable suppliers", "Business planning tools", "Mentorship programs"],
      benefits: ["Launch faster", "Access funding", "Expert mentorship"],
    },
  ]

  const handleRoleSelect = async (roleId: string) => {
    setSelectedRole(roleId)
    setIsLoading(true)

    // Simulate API call to save role
    setTimeout(() => {
      setIsLoading(false)
      onRoleSelect(roleId)
    }, 1500)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 py-8 bg-gradient-to-br from-elevante-background via-elevante-background to-elevante-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Path on Elevante</h1>
          <p className="text-lg text-gray-600 mb-1">Welcome, {userEmail}!</p>
          <p className="text-gray-500">Select how you'd like to grow with our platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const IconComponent = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`elevante-card cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isSelected ? "ring-2 ring-elevante-secondary shadow-xl" : ""
                }`}
                onClick={() => !isLoading && handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold">{role.title}</CardTitle>
                  <CardDescription className="text-base">{role.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{role.longDescription}</p>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className={
                      isSelected
                        ? "w-full mt-4 bg-elevante-secondary text-white font-semibold py-3 rounded-lg"
                        : "w-full mt-4 elevante-button font-semibold py-3 rounded-lg"
                    }
                    disabled={isLoading}
                    variant={isSelected ? "default" : "outline"}
                  >
                    {isLoading && isSelected
                      ? "Setting up your account..."
                      : isSelected
                        ? "Selected ✓"
                        : `Choose ${role.title}`}
                  </Button>
                </CardContent>

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-elevante-secondary rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Don't worry, you can change your role later in your account settings</p>
        </div>
      </div>
    </div>
  )
}

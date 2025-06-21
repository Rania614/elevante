"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  User,
  MapPin,
  Phone,
  Building,
  Globe,
  Camera,
  DollarSign,
  TrendingUp,
  Package,
  Lightbulb,
  Users,
  Calendar,
  Target,
  Briefcase,
} from "lucide-react"

interface ProfileCompletionPageProps {
  userEmail: string
  selectedRole: string
  onProfileComplete: (profileData: any) => void
}

export default function ProfileCompletionPage({
  userEmail,
  selectedRole,
  onProfileComplete,
}: ProfileCompletionPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Common profile data
  const [commonData, setCommonData] = useState({
    fullName: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    linkedin: "",
    company: "",
  })

  // Role-specific data
  const [roleSpecificData, setRoleSpecificData] = useState<any>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 3

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!commonData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!commonData.bio.trim()) newErrors.bio = "Bio is required"
      if (!commonData.location.trim()) newErrors.location = "Location is required"
    }

    if (step === 2) {
      if (selectedRole === "investor") {
        if (!roleSpecificData.investmentRange) newErrors.investmentRange = "Investment range is required"
        if (!roleSpecificData.industries?.length) newErrors.industries = "Select at least one industry"
      } else if (selectedRole === "supplier") {
        if (!roleSpecificData.businessType) newErrors.businessType = "Business type is required"
        if (!roleSpecificData.productCategories?.length) newErrors.productCategories = "Select at least one category"
      } else if (selectedRole === "entrepreneur") {
        if (!roleSpecificData.businessStage) newErrors.businessStage = "Business stage is required"
        if (!roleSpecificData.industry) newErrors.industry = "Industry is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      onProfileComplete({
        ...commonData,
        ...roleSpecificData,
        profileImage,
        role: selectedRole,
      })
    }, 2000)
  }

  const handleCommonDataChange = (field: string, value: string) => {
    setCommonData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleRoleDataChange = (field: string, value: any) => {
    setRoleSpecificData((prev: any) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = roleSpecificData[field] || []
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i: string) => i !== item)
      : [...currentArray, item]
    handleRoleDataChange(field, newArray)
  }

  const getRoleIcon = () => {
    switch (selectedRole) {
      case "investor":
        return <TrendingUp className="w-6 h-6" />
      case "supplier":
        return <Package className="w-6 h-6" />
      case "entrepreneur":
        return <Lightbulb className="w-6 h-6" />
      default:
        return <User className="w-6 h-6" />
    }
  }

  const getRoleColor = () => {
    switch (selectedRole) {
      case "investor":
        return "bg-elevante-secondary"
      case "supplier":
        return "bg-elevante-primary"
      case "entrepreneur":
        return "bg-elevante-button"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 py-8 bg-gradient-to-br from-elevante-background via-elevante-background to-elevante-primary/5">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 ${getRoleColor()} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}
          >
            {getRoleIcon()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Elevante Profile</h1>
          <p className="text-gray-600 mb-1">Welcome, {userEmail} to Elevante!</p>
          <p className="text-gray-500 capitalize">Setting up your {selectedRole} profile</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep ? "bg-elevante-secondary text-white" : "bg-gray-200 text-elevante-text"
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${i + 1 < currentStep ? "bg-elevante-secondary" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        <Card className="elevante-card shadow-xl">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Details`}
              {currentStep === 3 && "Review & Complete"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && `Provide ${selectedRole}-specific information`}
              {currentStep === 3 && "Review your information and complete your profile"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <>
                {/* Profile Image */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer hover:bg-indigo-700">
                      <Camera className="w-4 h-4" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">Upload your profile picture</p>
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      placeholder="Enter your full name"
                      value={commonData.fullName}
                      onChange={(e) => handleCommonDataChange("fullName", e.target.value)}
                      className={`pl-10 ${errors.fullName ? "border-red-500" : ""} focus:ring-elevante-button focus:border-elevante-button`}
                    />
                  </div>
                  {errors.fullName && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.fullName}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your background..."
                    value={commonData.bio}
                    onChange={(e) => handleCommonDataChange("bio", e.target.value)}
                    className={`min-h-[100px] ${errors.bio ? "border-red-500" : ""} focus:ring-elevante-button focus:border-elevante-button`}
                  />
                  {errors.bio && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.bio}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={commonData.location}
                      onChange={(e) => handleCommonDataChange("location", e.target.value)}
                      className={`pl-10 ${errors.location ? "border-red-500" : ""} focus:ring-elevante-button focus:border-elevante-button`}
                    />
                  </div>
                  {errors.location && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.location}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={commonData.phone}
                      onChange={(e) => handleCommonDataChange("phone", e.target.value)}
                      className="pl-10 focus:ring-elevante-button focus:border-elevante-button"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={commonData.company}
                      onChange={(e) => handleCommonDataChange("company", e.target.value)}
                      className="pl-10 focus:ring-elevante-button focus:border-elevante-button"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={commonData.website}
                      onChange={(e) => handleCommonDataChange("website", e.target.value)}
                      className="pl-10 focus:ring-elevante-button focus:border-elevante-button"
                    />
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={commonData.linkedin}
                      onChange={(e) => handleCommonDataChange("linkedin", e.target.value)}
                      className="pl-10 focus:ring-elevante-button focus:border-elevante-button"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Role-specific Information */}
            {currentStep === 2 && (
              <>
                {selectedRole === "investor" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="investmentRange">Investment Range *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="investmentRange"
                          value={roleSpecificData.investmentRange || ""}
                          onChange={(e) => handleRoleDataChange("investmentRange", e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md ${errors.investmentRange ? "border-red-500" : "border-gray-300"} focus:ring-elevante-button focus:border-elevante-button`}
                        >
                          <option value="">Select investment range</option>
                          <option value="1k-10k">$1K - $10K</option>
                          <option value="10k-50k">$10K - $50K</option>
                          <option value="50k-100k">$50K - $100K</option>
                          <option value="100k-500k">$100K - $500K</option>
                          <option value="500k-1m">$500K - $1M</option>
                          <option value="1m+">$1M+</option>
                        </select>
                      </div>
                      {errors.investmentRange && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.investmentRange}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Preferred Industries *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Technology",
                          "Healthcare",
                          "Finance",
                          "E-commerce",
                          "Real Estate",
                          "Manufacturing",
                          "Education",
                          "Energy",
                        ].map((industry) => (
                          <Badge
                            key={industry}
                            variant={roleSpecificData.industries?.includes(industry) ? "default" : "outline"}
                            className={`cursor-pointer justify-center py-2 ${
                              roleSpecificData.industries?.includes(industry)
                                ? "bg-elevante-secondary text-white"
                                : "border border-elevante-primary text-elevante-primary hover:bg-elevante-button hover:text-elevante-primary"
                            }`}
                            onClick={() => toggleArrayItem("industries", industry)}
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                      {errors.industries && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.industries}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investmentExperience">Investment Experience</Label>
                      <Textarea
                        id="investmentExperience"
                        placeholder="Describe your investment experience and portfolio..."
                        value={roleSpecificData.investmentExperience || ""}
                        onChange={(e) => handleRoleDataChange("investmentExperience", e.target.value)}
                        className="min-h-[80px] focus:ring-elevante-button focus:border-elevante-button"
                      />
                    </div>
                  </>
                )}

                {selectedRole === "supplier" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type *</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="businessType"
                          value={roleSpecificData.businessType || ""}
                          onChange={(e) => handleRoleDataChange("businessType", e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md ${errors.businessType ? "border-red-500" : "border-gray-300"} focus:ring-elevante-button focus:border-elevante-button`}
                        >
                          <option value="">Select business type</option>
                          <option value="manufacturer">Manufacturer</option>
                          <option value="distributor">Distributor</option>
                          <option value="wholesaler">Wholesaler</option>
                          <option value="service-provider">Service Provider</option>
                          <option value="retailer">Retailer</option>
                        </select>
                      </div>
                      {errors.businessType && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.businessType}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Product/Service Categories *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          "Electronics",
                          "Clothing",
                          "Food & Beverage",
                          "Industrial",
                          "Software",
                          "Consulting",
                          "Marketing",
                          "Logistics",
                        ].map((category) => (
                          <Badge
                            key={category}
                            variant={roleSpecificData.productCategories?.includes(category) ? "default" : "outline"}
                            className={`cursor-pointer justify-center py-2 ${
                              roleSpecificData.productCategories?.includes(category)
                                ? "bg-elevante-secondary text-white"
                                : "border border-elevante-primary text-elevante-primary hover:bg-elevante-button hover:text-elevante-primary"
                            }`}
                            onClick={() => toggleArrayItem("productCategories", category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                      {errors.productCategories && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.productCategories}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder="Describe your products/services and target market..."
                        value={roleSpecificData.businessDescription || ""}
                        onChange={(e) => handleRoleDataChange("businessDescription", e.target.value)}
                        className="min-h-[80px] focus:ring-elevante-button focus:border-elevante-button"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="yearsInBusiness"
                          type="number"
                          placeholder="5"
                          value={roleSpecificData.yearsInBusiness || ""}
                          onChange={(e) => handleRoleDataChange("yearsInBusiness", e.target.value)}
                          className="pl-10 focus:ring-elevante-button focus:border-elevante-button"
                        />
                      </div>
                    </div>
                  </>
                )}

                {selectedRole === "entrepreneur" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessStage">Business Stage *</Label>
                      <div className="relative">
                        <Target className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="businessStage"
                          value={roleSpecificData.businessStage || ""}
                          onChange={(e) => handleRoleDataChange("businessStage", e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md ${errors.businessStage ? "border-red-500" : "border-gray-300"} focus:ring-elevante-button focus:border-elevante-button`}
                        >
                          <option value="">Select business stage</option>
                          <option value="idea">Idea Stage</option>
                          <option value="prototype">Prototype</option>
                          <option value="mvp">MVP</option>
                          <option value="early-revenue">Early Revenue</option>
                          <option value="growth">Growth Stage</option>
                          <option value="established">Established</option>
                        </select>
                      </div>
                      {errors.businessStage && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.businessStage}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="industry"
                          value={roleSpecificData.industry || ""}
                          onChange={(e) => handleRoleDataChange("industry", e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-md ${errors.industry ? "border-red-500" : "border-gray-300"} focus:ring-elevante-button focus:border-elevante-button`}
                        >
                          <option value="">Select industry</option>
                          <option value="technology">Technology</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="finance">Finance</option>
                          <option value="ecommerce">E-commerce</option>
                          <option value="education">Education</option>
                          <option value="energy">Energy</option>
                          <option value="manufacturing">Manufacturing</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      {errors.industry && (
                        <Alert variant="destructive">
                          <AlertDescription>{errors.industry}</AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessIdea">Business Idea/Description</Label>
                      <Textarea
                        id="businessIdea"
                        placeholder="Describe your business idea, problem you're solving, and target market..."
                        value={roleSpecificData.businessIdea || ""}
                        onChange={(e) => handleRoleDataChange("businessIdea", e.target.value)}
                        className="min-h-[100px] focus:ring-elevante-button focus:border-elevante-button"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fundingNeeded">Funding Needed</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <select
                          id="fundingNeeded"
                          value={roleSpecificData.fundingNeeded || ""}
                          onChange={(e) => handleRoleDataChange("fundingNeeded", e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:ring-elevante-button focus:border-elevante-button"
                        >
                          <option value="">Select funding range</option>
                          <option value="0-10k">$0 - $10K</option>
                          <option value="10k-50k">$10K - $50K</option>
                          <option value="50k-100k">$50K - $100K</option>
                          <option value="100k-500k">$100K - $500K</option>
                          <option value="500k-1m">$500K - $1M</option>
                          <option value="1m+">$1M+</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="teamSize"
                          type="number"
                          placeholder="3"
                          value={roleSpecificData.teamSize || ""}
                          onChange={(e) => handleRoleDataChange("teamSize", e.target.value)}
                          className="pl-10 focus:ring-elevante-button focus:border-elevante-button"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Review Your Profile</h3>
                  <p className="text-gray-600">Please review your information before completing your profile</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {profileImage ? (
                      <img
                        src={profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{commonData.fullName}</h4>
                      <p className="text-sm text-gray-600 capitalize">{selectedRole}</p>
                      <p className="text-sm text-gray-500">{commonData.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h5 className="font-medium">Contact Information</h5>
                      <p className="text-sm text-gray-600">Email: {userEmail}</p>
                      {commonData.phone && <p className="text-sm text-gray-600">Phone: {commonData.phone}</p>}
                      {commonData.website && <p className="text-sm text-gray-600">Website: {commonData.website}</p>}
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium">Professional</h5>
                      {commonData.company && <p className="text-sm text-gray-600">Company: {commonData.company}</p>}
                      {commonData.linkedin && <p className="text-sm text-gray-600">LinkedIn: Connected</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">Bio</h5>
                    <p className="text-sm text-gray-600">{commonData.bio}</p>
                  </div>

                  {/* Role-specific review */}
                  <div className="space-y-2">
                    <h5 className="font-medium capitalize">{selectedRole} Information</h5>
                    <div className="text-sm text-gray-600 space-y-1">
                      {selectedRole === "investor" && (
                        <>
                          <p>Investment Range: {roleSpecificData.investmentRange}</p>
                          <p>Industries: {roleSpecificData.industries?.join(", ")}</p>
                        </>
                      )}
                      {selectedRole === "supplier" && (
                        <>
                          <p>Business Type: {roleSpecificData.businessType}</p>
                          <p>Categories: {roleSpecificData.productCategories?.join(", ")}</p>
                          {roleSpecificData.yearsInBusiness && (
                            <p>Years in Business: {roleSpecificData.yearsInBusiness}</p>
                          )}
                        </>
                      )}
                      {selectedRole === "entrepreneur" && (
                        <>
                          <p>Business Stage: {roleSpecificData.businessStage}</p>
                          <p>Industry: {roleSpecificData.industry}</p>
                          {roleSpecificData.fundingNeeded && <p>Funding Needed: {roleSpecificData.fundingNeeded}</p>}
                          {roleSpecificData.teamSize && <p>Team Size: {roleSpecificData.teamSize}</p>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="border border-elevante-primary text-elevante-primary hover:bg-elevante-primary hover:text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300"
              >
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="elevante-button font-semibold px-6 py-3 rounded-lg">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="elevante-button font-semibold px-6 py-3 rounded-lg"
                >
                  {isLoading ? "Completing Profile..." : "Complete Profile"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

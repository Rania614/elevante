"use client"

import { CardFooter } from "@/components/ui/card"
import MoneyAnimation from "@/components/money-animation"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

interface LoginPageProps {
  onSwitchToRegister: () => void
  onLoginSuccess: (userData: any) => void
}

export default function LoginPage({ onSwitchToRegister, onLoginSuccess }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Demo admin credentials
  const adminCredentials = {
    email: "admin@elevante.com",
    password: "admin123",
    role: "admin",
    fullName: "System Administrator",
  }

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Check for admin credentials first
      if (formData.email === adminCredentials.email && formData.password === adminCredentials.password) {
        setIsLoading(false)
        onLoginSuccess(adminCredentials)
        return
      }

      // Check if user exists in demo users
      const user = {
        email: formData.email,
        role: "investor",
        fullName: "Test User",
      }
      if (formData.email === "test@example.com" && formData.password === "password") {
        // Login successful
        setIsLoading(false)
        onLoginSuccess(user)
      } else {
        // Login failed
        setIsLoading(false)
        setErrors({ email: "Invalid email or password" })
      }
    }, 1500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 elevante-hero-gradient money-bg flex items-center justify-center relative">
      <MoneyAnimation />
      <Card className="w-full max-w-md elevante-card shadow-2xl border-2 border-elevante-button relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Elevante</CardTitle>
          <CardDescription className="text-center">Sign in to your Elevante account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Demo Credentials</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Admin:</strong> admin@elevante.com / admin123
              </p>
              <p>
                <strong>Test User:</strong> test@example.com / password
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.email ? "border-red-500" : ""} focus:ring-elevante-button focus:border-elevante-button`}
                />
              </div>
              {errors.email && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.email}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.password ? "border-red-500" : ""} focus:ring-elevante-button focus:border-elevante-button`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.password}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input id="remember" type="checkbox" className="rounded border-gray-300" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm text-elevante-secondary hover:text-elevante-hover">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full elevante-button font-semibold py-3 rounded-lg shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            {"Don't have an account? "}
            <button
              onClick={onSwitchToRegister}
              className="text-elevante-secondary hover:text-elevante-hover font-medium"
            >
              Sign up
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, MapPin, Building, Globe, Bell, Shield, Palette } from "lucide-react"

interface SettingsPageProps {
  userProfile: any
}

export default function SettingsPage({ userProfile }: SettingsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="elevante-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information and profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input defaultValue={userProfile?.fullName} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue={userProfile?.email} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Bio</label>
                <Textarea defaultValue={userProfile?.bio} className="mt-1 min-h-[80px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input defaultValue={userProfile?.location} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input defaultValue={userProfile?.phone} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input defaultValue={userProfile?.company} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Website</label>
                  <Input defaultValue={userProfile?.website} className="mt-1" />
                </div>
              </div>
              <Button className="elevante-button">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Investment Updates</p>
                  <p className="text-sm text-gray-600">Get notified about investment opportunities</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-gray-600">Notifications for new messages</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-gray-600">Receive marketing emails and updates</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and privacy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input type="password" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input type="password" className="mt-1" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <Switch />
              </div>
              <Button className="elevante-button">Update Password</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="elevante-card">
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-elevante-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{userProfile?.fullName?.charAt(0) || "U"}</span>
                </div>
                <div>
                  <p className="font-medium">{userProfile?.fullName}</p>
                  <p className="text-sm text-gray-600">{userProfile?.email}</p>
                </div>
              </div>
              <Badge className="bg-elevante-button text-elevante-primary capitalize">
                {userProfile?.role || "User"}
              </Badge>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{userProfile?.location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>{userProfile?.company || "Not specified"}</span>
                </div>
                {userProfile?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span>{userProfile.website}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Theme</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Language</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="elevante-card">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Export Data
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

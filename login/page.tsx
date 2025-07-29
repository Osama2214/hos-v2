"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/lib/auth-store"
import { ROLE_PERMISSIONS, type Role } from "@/lib/auth"
import { Activity, Stethoscope, UserCheck, TestTube, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock users for demonstration
const mockUsers = {
  admin: {
    id: "1",
    name: "Admin User",
    email: "admin@hospital.com",
    role: "admin" as Role,
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true,
    department: "Administration",
  },
  doctor: {
    id: "2",
    name: "Dr. Sarah Wilson",
    email: "doctor@hospital.com",
    role: "doctor" as Role,
    permissions: ROLE_PERMISSIONS.doctor,
    isActive: true,
    department: "Internal Medicine",
  },
  receptionist: {
    id: "3",
    name: "Emily Johnson",
    email: "reception@hospital.com",
    role: "receptionist" as Role,
    permissions: ROLE_PERMISSIONS.receptionist,
    isActive: true,
    department: "Front Desk",
  },
  lab: {
    id: "4",
    name: "Lab Technician",
    email: "lab@hospital.com",
    role: "lab" as Role,
    permissions: ROLE_PERMISSIONS.lab,
    isActive: true,
    department: "Laboratory",
  },
}

const roleIcons = {
  admin: Shield,
  doctor: Stethoscope,
  receptionist: UserCheck,
  lab: TestTube,
}

const roleDescriptions = {
  admin: "Full system access and user management",
  doctor: "Patient care, medical records, and lab results",
  receptionist: "Patient check-in, scheduling, and front desk operations",
  lab: "Laboratory tests, results, and sample management",
}

const roleRedirects = {
  admin: "/admin",
  doctor: "/doctor",
  receptionist: "/reception",
  lab: "/lab",
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("doctor")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const user = mockUsers[selectedRole]
      login(user)

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      })

      // Redirect to role-specific dashboard
      const redirectTo = roleRedirects[selectedRole]
      router.push(redirectTo)
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const IconComponent = roleIcons[selectedRole]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">HealthCare RBAC</CardTitle>
          <CardDescription>Role-Based Access Control System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={mockUsers[selectedRole].email} readOnly className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value="password" readOnly className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={selectedRole} onValueChange={(value: Role) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mockUsers).map(([key, user]) => {
                    const Icon = roleIcons[user.role]
                    return (
                      <SelectItem key={key} value={user.role}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Role Preview */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-3 mb-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{mockUsers[selectedRole].name}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedRole} • {mockUsers[selectedRole].department}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{roleDescriptions[selectedRole]}</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : `Sign in as ${selectedRole}`}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Demo System - Select any role to explore the interface</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

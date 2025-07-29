"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Activity, Clock, LogOut, Shield } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminPage() {
  const { user, isAuthenticated, logout, isInitialized, isHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for proper initialization before making auth decisions
    if (isInitialized && isHydrated) {
      console.log("Admin page auth check:", { isAuthenticated, user: user?.role })

      if (!isAuthenticated || !user) {
        console.log("Admin page: user not authenticated, redirecting to login")
        router.replace("/login")
        return
      }

      if (user.role !== "admin") {
        console.log("Admin page: user not admin, redirecting to appropriate dashboard")
        const roleRedirects = {
          doctor: "/doctor",
          receptionist: "/reception",
          lab: "/lab",
        }
        router.replace(roleRedirects[user.role as keyof typeof roleRedirects] || "/")
        return
      }

      setIsLoading(false)
    }
  }, [isAuthenticated, user, router, isInitialized, isHydrated])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  // Show loading state while checking authentication
  if (isLoading || !isInitialized || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated or not admin
  if (!isAuthenticated || !user || user.role !== "admin") {
    return null
  }

  const stats = [
    {
      title: "Total Users",
      value: "24",
      change: "+3",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "System Health",
      value: "98%",
      change: "+2%",
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Active Sessions",
      value: "12",
      change: "+5",
      icon: Shield,
      color: "text-orange-600",
    },
    {
      title: "Daily Reports",
      value: "156",
      change: "+23",
      icon: FileText,
      color: "text-purple-600",
    },
  ]

  const recentActivities = [
    { action: "User created", user: "System Admin", time: "5 minutes ago" },
    { action: "Backup completed", user: "System", time: "1 hour ago" },
    { action: "Security scan", user: "System", time: "2 hours ago" },
    { action: "Database optimized", user: "System Admin", time: "4 hours ago" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}! System overview and controls.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="capitalize">
            {user?.role}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>Recent system events and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">by {activity.user}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Quick access to administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <Users className="h-4 w-4" />
                <span className="text-sm">Manage Users</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <Shield className="h-4 w-4" />
                <span className="text-sm">System Settings</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <Activity className="h-4 w-4" />
                <span className="text-sm">View Audit Logs</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Generate Reports</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

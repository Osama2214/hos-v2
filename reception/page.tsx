"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Calendar, UserPlus, Clock, LogOut, Phone, CheckCircle } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function ReceptionPage() {
  const { user, isAuthenticated, logout, hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Wait for proper initialization before making auth decisions
    if (hasHydrated) {
      console.log("Reception page auth check:", { isAuthenticated, user: user?.role })

      if (!isAuthenticated || !user) {
        console.log("Reception page: user not authenticated, redirecting to login")
        router.replace("/login")
        return
      }

      if (user.role !== "receptionist") {
        console.log("Reception page: user not receptionist, redirecting to appropriate dashboard")
        const roleRedirects = {
          admin: "/admin",
          doctor: "/doctor",
          lab: "/lab",
        }
        router.replace(roleRedirects[user.role as keyof typeof roleRedirects] || "/")
        return
      }

      setIsLoading(false)
    }
  }, [isAuthenticated, user, router, hasHydrated])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  // Show loading state while checking authentication
  if (isLoading || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading reception dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated or not receptionist
  if (!isAuthenticated || !user || user.role !== "receptionist") {
    return null
  }

  const stats = [
    {
      title: "Today's Check-ins",
      value: "32",
      change: "+8",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Scheduled Appointments",
      value: "45",
      change: "+12",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Waiting Patients",
      value: "7",
      change: "-3",
      icon: Clock,
      color: "text-orange-600",
    },
    {
      title: "New Registrations",
      value: "5",
      change: "+2",
      icon: UserPlus,
      color: "text-purple-600",
    },
  ]

  const recentActivities = [
    { action: "Patient checked in", patient: "John Doe", time: "2 minutes ago" },
    { action: "Appointment scheduled", patient: "Jane Smith", time: "15 minutes ago" },
    { action: "New patient registered", patient: "Bob Johnson", time: "30 minutes ago" },
    { action: "Insurance verified", patient: "Alice Wilson", time: "1 hour ago" },
  ]

  const upcomingAppointments = [
    { time: "09:00 AM", patient: "Mary Johnson", doctor: "Dr. Smith", type: "Consultation" },
    { time: "09:30 AM", patient: "David Brown", doctor: "Dr. Johnson", type: "Follow-up" },
    { time: "10:00 AM", patient: "Sarah Davis", doctor: "Dr. Smith", type: "Check-up" },
    { time: "10:30 AM", patient: "Mike Wilson", doctor: "Dr. Brown", type: "Consultation" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Reception Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}! Manage patient services and appointments.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
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
                <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>{" "}
                from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest patient services and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.patient}</p>
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
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Next appointments to prepare for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-8 bg-primary/10 rounded text-xs font-medium">
                    {appointment.time}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{appointment.patient}</p>
                    <p className="text-xs text-muted-foreground">
                      {appointment.doctor} • {appointment.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common reception tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Check-in Patient</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Schedule Appointment</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <UserPlus className="h-4 w-4" />
                <span className="text-sm">Register New Patient</span>
              </button>
              <button className="flex items-center gap-2 rounded-lg border p-3 text-left hover:bg-accent transition-colors">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Contact Patient</span>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>Overview of today's reception activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Patients Checked In</span>
                <span className="font-medium">32 / 45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Appointments Scheduled</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">New Registrations</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Insurance Verifications</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Phone Calls Made</span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

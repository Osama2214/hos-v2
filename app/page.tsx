"use client"

import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Activity, Users, Calendar, TestTube, AlertCircle, TrendingUp } from "lucide-react"

export default function HomePage() {
  const { user } = useAuthStore()

  const getDashboardStats = () => {
    switch (user?.role) {
      case "admin":
        return [
          { title: "Total Users", value: "24", icon: Users, color: "text-blue-600" },
          { title: "Active Patients", value: "156", icon: Activity, color: "text-green-600" },
          { title: "Pending Labs", value: "8", icon: TestTube, color: "text-orange-600" },
          { title: "System Alerts", value: "3", icon: AlertCircle, color: "text-red-600" },
        ]
      case "doctor":
        return [
          { title: "My Patients", value: "42", icon: Users, color: "text-blue-600" },
          { title: "Today's Appointments", value: "8", icon: Calendar, color: "text-green-600" },
          { title: "Pending Results", value: "5", icon: TestTube, color: "text-orange-600" },
          { title: "Urgent Cases", value: "2", icon: AlertCircle, color: "text-red-600" },
        ]
      case "receptionist":
        return [
          { title: "Check-ins Today", value: "18", icon: Users, color: "text-blue-600" },
          { title: "Appointments", value: "24", icon: Calendar, color: "text-green-600" },
          { title: "Waiting Patients", value: "6", icon: Activity, color: "text-orange-600" },
          { title: "Cancellations", value: "3", icon: AlertCircle, color: "text-red-600" },
        ]
      case "lab":
        return [
          { title: "Pending Tests", value: "12", icon: TestTube, color: "text-blue-600" },
          { title: "Completed Today", value: "28", icon: Activity, color: "text-green-600" },
          { title: "In Progress", value: "7", icon: TrendingUp, color: "text-orange-600" },
          { title: "Urgent Tests", value: "4", icon: AlertCircle, color: "text-red-600" },
        ]
      default:
        return []
    }
  }

  const stats = getDashboardStats()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">
            {user?.role === "admin" && "Manage your healthcare system"}
            {user?.role === "doctor" && "Review your patients and appointments"}
            {user?.role === "receptionist" && "Manage patient check-ins and appointments"}
            {user?.role === "lab" && "Process laboratory tests and results"}
          </p>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.role === "admin" && (
                <>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Manage Users</span>
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>System Settings</span>
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>View Reports</span>
                    <Badge variant="secondary">Admin</Badge>
                  </div>
                </>
              )}
              {user?.role === "doctor" && (
                <>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>View Patients</span>
                    <Badge variant="secondary">Doctor</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Check Lab Results</span>
                    <Badge variant="secondary">Doctor</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Write Prescriptions</span>
                    <Badge variant="secondary">Doctor</Badge>
                  </div>
                </>
              )}
              {user?.role === "receptionist" && (
                <>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Patient Check-in</span>
                    <Badge variant="secondary">Reception</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Schedule Appointment</span>
                    <Badge variant="secondary">Reception</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Add New Patient</span>
                    <Badge variant="secondary">Reception</Badge>
                  </div>
                </>
              )}
              {user?.role === "lab" && (
                <>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Process Tests</span>
                    <Badge variant="secondary">Lab</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Upload Results</span>
                    <Badge variant="secondary">Lab</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Set Pricing</span>
                    <Badge variant="secondary">Lab</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">New patient registered</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Lab result uploaded</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">Appointment scheduled</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm">System backup completed</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

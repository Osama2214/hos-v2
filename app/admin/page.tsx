"use client"

import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, Database, Activity, Settings, AlertTriangle, CheckCircle } from "lucide-react"

export default function AdminPage() {
  const { user } = useAuthStore()

  const systemStats = [
    { title: "Total Users", value: "47", icon: Users, change: "+3 this week", color: "text-blue-600" },
    { title: "Active Sessions", value: "23", icon: Activity, change: "Currently online", color: "text-green-600" },
    {
      title: "System Health",
      value: "98.5%",
      icon: CheckCircle,
      change: "All systems operational",
      color: "text-green-600",
    },
    { title: "Storage Used", value: "67%", icon: Database, change: "2.3GB available", color: "text-yellow-600" },
  ]

  const recentActivities = [
    { action: "User created", user: "Dr. Johnson", time: "2 minutes ago", type: "success" },
    { action: "Backup completed", user: "System", time: "1 hour ago", type: "info" },
    { action: "Failed login attempt", user: "Unknown", time: "3 hours ago", type: "warning" },
    { action: "Database updated", user: "Admin", time: "5 hours ago", type: "info" },
    { action: "User permissions modified", user: "Jane Doe", time: "1 day ago", type: "success" },
  ]

  const systemAlerts = [
    { message: "Scheduled maintenance in 2 days", type: "info", time: "Today" },
    { message: "Low disk space warning", type: "warning", time: "Yesterday" },
    { message: "Security update available", type: "info", time: "2 days ago" },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">System administration and management overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Shield className="w-3 h-3 mr-1" />
            Administrator
          </Badge>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest administrative actions and system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-green-500"
                      : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions & Alerts */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Database className="mr-2 h-4 w-4" />
              Backup & Restore
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Activity className="mr-2 h-4 w-4" />
              View Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
            System Alerts & Notifications
          </CardTitle>
          <CardDescription>Important system messages and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.type === "warning" ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Role Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Current user roles in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Administrators</span>
              <Badge variant="secondary">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Doctors</span>
              <Badge variant="secondary">15</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Receptionists</span>
              <Badge variant="secondary">8</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Lab Technicians</span>
              <Badge variant="secondary">6</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Response Time</span>
              <span className="text-sm font-medium text-green-600">145ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <span className="text-sm font-medium text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Connections</span>
              <span className="text-sm font-medium">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Memory Usage</span>
              <span className="text-sm font-medium text-yellow-600">67%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

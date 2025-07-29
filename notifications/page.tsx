"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, CheckCircle, AlertCircle, Info, Clock, Trash2, BookMarkedIcon as MarkAsUnread } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  isRead: boolean
  priority: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Lab Result Available",
    message: "Lab results for John Doe (P-2024-001) are ready for review",
    type: "info",
    timestamp: "2024-01-15T10:30:00Z",
    isRead: false,
    priority: "medium",
  },
  {
    id: "2",
    title: "Appointment Reminder",
    message: "Jane Smith has an appointment in 30 minutes",
    type: "warning",
    timestamp: "2024-01-15T09:00:00Z",
    isRead: false,
    priority: "high",
  },
  {
    id: "3",
    title: "System Backup Completed",
    message: "Daily system backup completed successfully",
    type: "success",
    timestamp: "2024-01-15T02:00:00Z",
    isRead: true,
    priority: "low",
  },
  {
    id: "4",
    title: "Failed Login Attempt",
    message: "Multiple failed login attempts detected for user: unknown@test.com",
    type: "error",
    timestamp: "2024-01-14T23:45:00Z",
    isRead: false,
    priority: "high",
  },
  {
    id: "5",
    title: "Patient Registration",
    message: "New patient Alice Wilson has been registered",
    type: "info",
    timestamp: "2024-01-14T16:20:00Z",
    isRead: true,
    priority: "low",
  },
]

export default function NotificationsPage() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length
  const highPriorityCount = mockNotifications.filter((n) => n.priority === "high" && !n.isRead).length

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with system alerts and messages</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Info className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockNotifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>Recent system notifications and alerts</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                  !notification.isRead ? "bg-muted/50" : "bg-background"
                }`}
              >
                <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className={`font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                        {notification.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(notification.priority) as any} className="text-xs">
                        {notification.priority}
                      </Badge>
                      {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(notification.timestamp)}
                    </div>

                    <div className="flex items-center gap-2">
                      {!notification.isRead ? (
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Read
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm">
                          <MarkAsUnread className="h-4 w-4 mr-1" />
                          Mark Unread
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

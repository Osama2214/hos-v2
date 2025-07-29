"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, BellRing, Check, X, AlertTriangle, Info, CheckCircle, Settings, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  priority: "low" | "medium" | "high" | "urgent"
  category: "system" | "appointment" | "patient" | "security" | "maintenance"
  timestamp: string
  read: boolean
  actionRequired: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "System Maintenance Scheduled",
    message:
      "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM. Some services may be temporarily unavailable.",
    type: "warning",
    priority: "high",
    category: "maintenance",
    timestamp: "2024-01-15 09:30:00",
    read: false,
    actionRequired: false,
  },
  {
    id: "2",
    title: "New Patient Registration",
    message: "John Smith has completed online registration and requires verification.",
    type: "info",
    priority: "medium",
    category: "patient",
    timestamp: "2024-01-15 09:15:00",
    read: false,
    actionRequired: true,
  },
  {
    id: "3",
    title: "Appointment Reminder",
    message: "Dr. Johnson has 3 appointments scheduled for today starting at 10:00 AM.",
    type: "info",
    priority: "low",
    category: "appointment",
    timestamp: "2024-01-15 08:45:00",
    read: true,
    actionRequired: false,
  },
  {
    id: "4",
    title: "Security Alert",
    message: "Multiple failed login attempts detected from IP 203.0.113.45. Account has been temporarily locked.",
    type: "error",
    priority: "urgent",
    category: "security",
    timestamp: "2024-01-15 08:30:00",
    read: false,
    actionRequired: true,
  },
  {
    id: "5",
    title: "Backup Completed",
    message: "Daily system backup completed successfully. 2.4 GB of data backed up.",
    type: "success",
    priority: "low",
    category: "system",
    timestamp: "2024-01-15 02:15:00",
    read: true,
    actionRequired: false,
  },
  {
    id: "6",
    title: "Lab Results Available",
    message: "Lab results for patient Sarah Wilson are now available for review.",
    type: "info",
    priority: "medium",
    category: "patient",
    timestamp: "2024-01-14 16:20:00",
    read: true,
    actionRequired: true,
  },
]

const typeColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: X,
  success: CheckCircle,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<string>("all")
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    appointmentReminders: true,
    securityAlerts: true,
  })

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    if (filter === "action") return notification.actionRequired
    return notification.category === filter
  })

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    toast.success("All notifications marked as read")
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    toast.success("Notification deleted")
  }

  const handleClearAll = () => {
    setNotifications([])
    toast.success("All notifications cleared")
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with system alerts and important information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} disabled={notifications.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <BellRing className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Required</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{actionRequiredCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {notifications.filter((n) => n.priority === "urgent").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="unread">Unread Only</SelectItem>
                  <SelectItem value="action">Action Required</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="appointment">Appointments</SelectItem>
                  <SelectItem value="patient">Patients</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold">No notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {filter === "all" ? "You're all caught up!" : `No ${filter} notifications found.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
                const TypeIcon = typeIcons[notification.type]
                return (
                  <Card key={notification.id} className={`${!notification.read ? "border-l-4 border-l-blue-500" : ""}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${typeColors[notification.type]}`}>
                            <TypeIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={priorityColors[notification.priority]}>{notification.priority}</Badge>
                              <Badge variant="outline">{notification.category}</Badge>
                              {notification.actionRequired && <Badge variant="destructive">Action Required</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Push Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">SMS Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">System Alerts</label>
                      <p className="text-sm text-muted-foreground">Important system notifications and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.systemAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, systemAlerts: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Appointment Reminders</label>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming appointments</p>
                    </div>
                    <Switch
                      checked={notificationSettings.appointmentReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, appointmentReminders: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Security Alerts</label>
                      <p className="text-sm text-muted-foreground">Security-related notifications and warnings</p>
                    </div>
                    <Switch
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({ ...prev, securityAlerts: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => toast.success("Notification settings saved")}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

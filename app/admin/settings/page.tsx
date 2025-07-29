"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Badge } from "@/components/ui/badge"
import { Settings, Shield, Bell, Database, Globe, Lock, Save, RefreshCw, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface SystemSettings {
  general: {
    hospitalName: string
    timezone: string
    language: string
    dateFormat: string
    currency: string
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    requireTwoFactor: boolean
    allowRememberMe: boolean
    maxLoginAttempts: number
    lockoutDuration: number
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    appointmentReminders: boolean
    systemAlerts: boolean
  }
  maintenance: {
    maintenanceMode: boolean
    maintenanceMessage: string
    allowedIPs: string[]
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    retentionDays: number
    backupLocation: string
  }
  integration: {
    labSystemEnabled: boolean
    pharmacySystemEnabled: boolean
    insuranceSystemEnabled: boolean
    billingSystemEnabled: boolean
  }
}

const defaultSettings: SystemSettings = {
  general: {
    hospitalName: "MedCare Hospital",
    timezone: "UTC-5",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  },
  security: {
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireTwoFactor: false,
    allowRememberMe: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    systemAlerts: true,
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "System is currently under maintenance. Please try again later.",
    allowedIPs: ["192.168.1.1", "10.0.0.1"],
  },
  backup: {
    autoBackup: true,
    backupFrequency: "daily",
    retentionDays: 30,
    backupLocation: "/backups",
  },
  integration: {
    labSystemEnabled: true,
    pharmacySystemEnabled: false,
    insuranceSystemEnabled: true,
    billingSystemEnabled: true,
  },
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
    toast.success("Settings saved successfully")
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setHasChanges(false)
    toast.info("Settings reset to defaults")
  }

  return (
    <PermissionGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        {hasChanges && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">You have unsaved changes</span>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Configure basic system information and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">Hospital Name</Label>
                    <Input
                      id="hospitalName"
                      value={settings.general.hospitalName}
                      onChange={(e) => updateSetting("general", "hospitalName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => updateSetting("general", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                        <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) => updateSetting("general", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={settings.general.dateFormat}
                      onValueChange={(value) => updateSetting("general", "dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure authentication and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting("security", "passwordMinLength", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting("security", "maxLoginAttempts", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      value={settings.security.lockoutDuration}
                      onChange={(e) => updateSetting("security", "lockoutDuration", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Force all users to enable 2FA</p>
                    </div>
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onCheckedChange={(checked) => updateSetting("security", "requireTwoFactor", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Remember Me</Label>
                      <p className="text-sm text-muted-foreground">Allow users to stay logged in</p>
                    </div>
                    <Switch
                      checked={settings.security.allowRememberMe}
                      onCheckedChange={(checked) => updateSetting("security", "allowRememberMe", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "smsNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Appointment Reminders</Label>
                      <p className="text-sm text-muted-foreground">Automatic appointment reminders</p>
                    </div>
                    <Switch
                      checked={settings.notifications.appointmentReminders}
                      onCheckedChange={(checked) => updateSetting("notifications", "appointmentReminders", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Critical system notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(checked) => updateSetting("notifications", "systemAlerts", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Maintenance Mode
                </CardTitle>
                <CardDescription>Control system maintenance and access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable to restrict system access</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.maintenance.maintenanceMode && <Badge variant="destructive">Active</Badge>}
                    <Switch
                      checked={settings.maintenance.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting("maintenance", "maintenanceMode", checked)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenance.maintenanceMessage}
                    onChange={(e) => updateSetting("maintenance", "maintenanceMessage", e.target.value)}
                    placeholder="Message to display during maintenance"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedIPs">Allowed IP Addresses</Label>
                  <Input
                    id="allowedIPs"
                    value={settings.maintenance.allowedIPs.join(", ")}
                    onChange={(e) => updateSetting("maintenance", "allowedIPs", e.target.value.split(", "))}
                    placeholder="192.168.1.1, 10.0.0.1"
                  />
                  <p className="text-sm text-muted-foreground">
                    Comma-separated list of IP addresses that can access the system during maintenance
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Settings
                </CardTitle>
                <CardDescription>Configure automatic backups and retention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">Enable scheduled backups</p>
                  </div>
                  <Switch
                    checked={settings.backup.autoBackup}
                    onCheckedChange={(checked) => updateSetting("backup", "autoBackup", checked)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.backup.backupFrequency}
                      onValueChange={(value) => updateSetting("backup", "backupFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retentionDays">Retention Period (days)</Label>
                    <Input
                      id="retentionDays"
                      type="number"
                      value={settings.backup.retentionDays}
                      onChange={(e) => updateSetting("backup", "retentionDays", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Input
                    id="backupLocation"
                    value={settings.backup.backupLocation}
                    onChange={(e) => updateSetting("backup", "backupLocation", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  System Integrations
                </CardTitle>
                <CardDescription>Enable or disable external system integrations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lab System Integration</Label>
                      <p className="text-sm text-muted-foreground">Connect with external lab systems</p>
                    </div>
                    <Switch
                      checked={settings.integration.labSystemEnabled}
                      onCheckedChange={(checked) => updateSetting("integration", "labSystemEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Pharmacy System Integration</Label>
                      <p className="text-sm text-muted-foreground">Connect with pharmacy systems</p>
                    </div>
                    <Switch
                      checked={settings.integration.pharmacySystemEnabled}
                      onCheckedChange={(checked) => updateSetting("integration", "pharmacySystemEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Insurance System Integration</Label>
                      <p className="text-sm text-muted-foreground">Connect with insurance providers</p>
                    </div>
                    <Switch
                      checked={settings.integration.insuranceSystemEnabled}
                      onCheckedChange={(checked) => updateSetting("integration", "insuranceSystemEnabled", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Billing System Integration</Label>
                      <p className="text-sm text-muted-foreground">Connect with billing systems</p>
                    </div>
                    <Switch
                      checked={settings.integration.billingSystemEnabled}
                      onCheckedChange={(checked) => updateSetting("integration", "billingSystemEnabled", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}

"use client"

import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/auth-store"
import { AlertTriangle, Settings, Shield, RotateCcw, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function SystemSettingsPage() {
  const { isMaintenanceMode, setMaintenanceMode, resetStore } = useAuthStore()
  const { toast } = useToast()

  const handleMaintenanceModeToggle = (enabled: boolean) => {
    console.log("Toggling maintenance mode to:", enabled)
    setMaintenanceMode(enabled)
    toast({
      title: enabled ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
      description: enabled
        ? "⚠️ Users will no longer be able to log in to the system."
        : "✅ Users can now log in to the system normally.",
      variant: enabled ? "destructive" : "default",
    })
  }

  const handleResetMaintenanceMode = () => {
    setMaintenanceMode(false)
    toast({
      title: "Maintenance Mode Reset",
      description: "Maintenance mode has been disabled and reset to default state.",
    })
  }

  const handleResetStore = () => {
    resetStore()
    toast({
      title: "Store Reset",
      description: "All authentication state has been reset to defaults.",
    })
  }

  return (
    <PermissionGuard permission="canAccessAdminPanel">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
          </div>
        </div>

        <div className="grid gap-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Maintenance Mode Control
              </CardTitle>
              <CardDescription>
                Enable maintenance mode to prevent users from logging in during system updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMaintenanceMode && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    ⚠️ <strong>MAINTENANCE MODE IS ACTIVE</strong> - Users cannot log in to the system.
                  </AlertDescription>
                </Alert>
              )}

              {!isMaintenanceMode && (
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>✅ System is online - Users can log in normally.</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Enable Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">Block all user logins except administrators</div>
                </div>
                <Switch
                  id="maintenance-mode"
                  checked={isMaintenanceMode}
                  onCheckedChange={handleMaintenanceModeToggle}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetMaintenanceMode}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4" />
                  Force Disable
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetStore}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset All Settings
                </Button>
              </div>

              {/* Debug information */}
              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <h4 className="font-medium mb-2">Debug Information:</h4>
                <div className="space-y-1 text-xs">
                  <p>
                    Current Maintenance Mode: <strong>{isMaintenanceMode ? "ACTIVE" : "INACTIVE"}</strong>
                  </p>
                  <p>
                    Environment Variable: <strong>{process.env.NEXT_PUBLIC_MAINTENANCE_MODE || "not set"}</strong>
                  </p>
                  <p>
                    Store State: <strong>{JSON.stringify({ isMaintenanceMode })}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rate Limiting</Label>
                    <div className="text-sm text-muted-foreground">Maximum 5 failed attempts per 15 minutes</div>
                  </div>
                  <Switch checked disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <div className="text-sm text-muted-foreground">Log all authentication attempts</div>
                  </div>
                  <Switch checked disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <div className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</div>
                  </div>
                  <Switch checked disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>Current system status and configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">System Version:</span>
                  <span>v1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database Status:</span>
                  <span className="text-green-600">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Backup:</span>
                  <span>2024-01-15 10:30 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Users:</span>
                  <span>4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Maintenance Mode:</span>
                  <span className={isMaintenanceMode ? "text-red-600 font-bold" : "text-green-600"}>
                    {isMaintenanceMode ? "🔴 ACTIVE" : "🟢 Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}

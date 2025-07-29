"use client"

import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuthStore } from "@/lib/auth-store"
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react"

export default function AuditLogsPage() {
  const { loginAttempts } = useAuthStore()

  const getStatusIcon = (result: string) => {
    switch (result) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failure":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (result: string) => {
    switch (result) {
      case "success":
        return "default"
      case "failure":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <PermissionGuard permission="canViewAuditLogs">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">System security and login attempt logs</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loginAttempts.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful Logins</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loginAttempts.filter((attempt) => attempt.result === "success").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loginAttempts.filter((attempt) => attempt.result === "failure").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login Attempts</CardTitle>
            <CardDescription>Detailed log of all authentication attempts</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginAttempts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No login attempts recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  loginAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className="font-mono text-sm">
                        {new Date(attempt.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>{attempt.username}</TableCell>
                      <TableCell className="font-mono">{attempt.ipAddress}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(attempt.result) as any}
                          className="flex items-center gap-1 w-fit"
                        >
                          {getStatusIcon(attempt.result)}
                          {attempt.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{attempt.reason || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}

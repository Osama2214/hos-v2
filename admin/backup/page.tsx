"use client"

import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  Calendar,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface BackupRecord {
  id: string
  name: string
  type: "Full" | "Incremental" | "Database"
  size: string
  date: string
  status: "Completed" | "Failed" | "In Progress"
  duration: string
}

const mockBackups: BackupRecord[] = [
  {
    id: "1",
    name: "Daily Full Backup",
    type: "Full",
    size: "2.4 GB",
    date: "2024-01-15 02:00:00",
    status: "Completed",
    duration: "45 minutes",
  },
  {
    id: "2",
    name: "Database Backup",
    type: "Database",
    size: "850 MB",
    date: "2024-01-14 23:30:00",
    status: "Completed",
    duration: "12 minutes",
  },
  {
    id: "3",
    name: "Incremental Backup",
    type: "Incremental",
    size: "320 MB",
    date: "2024-01-14 12:00:00",
    status: "Failed",
    duration: "8 minutes",
  },
  {
    id: "4",
    name: "Weekly Full Backup",
    type: "Full",
    size: "2.8 GB",
    date: "2024-01-13 01:00:00",
    status: "Completed",
    duration: "52 minutes",
  },
]

export default function BackupPage() {
  const [isBackupRunning, setIsBackupRunning] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      // Cleanup any running intervals when component unmounts
      if (isBackupRunning) {
        setIsBackupRunning(false)
        setBackupProgress(0)
      }
    }
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Failed":
        return "destructive"
      case "In Progress":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full":
        return "default"
      case "Incremental":
        return "secondary"
      case "Database":
        return "outline"
      default:
        return "secondary"
    }
  }

  const handleStartBackup = async (type: string) => {
    if (isBackupRunning) return

    setIsBackupRunning(true)
    setBackupProgress(0)

    // Use setTimeout to ensure toast is called after render
    setTimeout(() => {
      toast({
        title: "Backup Started",
        description: `${type} backup has been initiated.`,
      })
    }, 0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackupRunning(false)

          // Toast for completion
          setTimeout(() => {
            toast({
              title: "Backup Completed",
              description: `${type} backup completed successfully.`,
            })
          }, 0)

          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleRestoreBackup = (backupId: string) => {
    // Use setTimeout to ensure toast is called after render
    setTimeout(() => {
      toast({
        title: "Restore Initiated",
        description: "System restore process has been started. This may take several minutes.",
        variant: "destructive",
      })
    }, 0)
  }

  return (
    <PermissionGuard permission="canManageBackups">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Backup & Restore</h1>
              <p className="text-muted-foreground">Manage system backups and data recovery</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartBackup("Database")}
              disabled={isBackupRunning}
            >
              <Database className="h-4 w-4 mr-2" />
              Database Backup
            </Button>
            <Button onClick={() => handleStartBackup("Full System")} disabled={isBackupRunning}>
              <Play className="h-4 w-4 mr-2" />
              Start Full Backup
            </Button>
          </div>
        </div>

        {isBackupRunning && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Backup in Progress
              </CardTitle>
              <CardDescription>Please do not close this window during backup</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{backupProgress}%</span>
                </div>
                <Progress value={backupProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">Backing up system files and database...</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
              <Database className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockBackups.length}</div>
              <p className="text-xs text-muted-foreground">
                {mockBackups.filter((b) => b.status === "Completed").length} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.4 GB</div>
              <p className="text-xs text-muted-foreground">of 50 GB available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
              <p className="text-xs text-muted-foreground">Daily automated backup</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>Recent backup operations and their status</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBackups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(backup.type) as any}>{backup.type}</Badge>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.date}</TableCell>
                    <TableCell>{backup.duration}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(backup.status) as any} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(backup.status)}
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {backup.status === "Completed" && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRestoreBackup(backup.id)}>
                              <Upload className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Backup Schedule</CardTitle>
              <CardDescription>Automated backup configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Daily Database Backup</p>
                    <p className="text-sm text-muted-foreground">Every day at 2:00 AM</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Weekly Full Backup</p>
                    <p className="text-sm text-muted-foreground">Every Sunday at 1:00 AM</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Monthly Archive</p>
                    <p className="text-sm text-muted-foreground">First day of month at 12:00 AM</p>
                  </div>
                  <Badge variant="secondary">Inactive</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common backup and restore operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  className="justify-start bg-transparent"
                  onClick={() => handleStartBackup("Incremental")}
                  disabled={isBackupRunning}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Create Incremental Backup
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export Backup Configuration
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Backup File
                </Button>
                <Button variant="outline" className="justify-start bg-transparent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Custom Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}

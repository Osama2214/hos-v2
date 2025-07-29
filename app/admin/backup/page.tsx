"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PermissionGuard } from "@/components/auth/permission-guard"
import {
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Calendar,
  HardDrive,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

interface Backup {
  id: string
  name: string
  type: "full" | "incremental" | "differential"
  status: "completed" | "failed" | "in_progress" | "scheduled"
  size: string
  createdAt: string
  duration: string
  location: string
}

const mockBackups: Backup[] = [
  {
    id: "1",
    name: "Full System Backup",
    type: "full",
    status: "completed",
    size: "2.4 GB",
    createdAt: "2024-01-15 02:00:00",
    duration: "45 minutes",
    location: "/backups/full_20240115_020000.sql",
  },
  {
    id: "2",
    name: "Daily Incremental Backup",
    type: "incremental",
    status: "completed",
    size: "156 MB",
    createdAt: "2024-01-15 01:00:00",
    duration: "8 minutes",
    location: "/backups/inc_20240115_010000.sql",
  },
  {
    id: "3",
    name: "Weekly Full Backup",
    type: "full",
    status: "in_progress",
    size: "1.8 GB",
    createdAt: "2024-01-14 23:00:00",
    duration: "32 minutes",
    location: "/backups/full_20240114_230000.sql",
  },
  {
    id: "4",
    name: "Emergency Backup",
    type: "full",
    status: "failed",
    size: "0 MB",
    createdAt: "2024-01-14 15:30:00",
    duration: "2 minutes",
    location: "/backups/emergency_20240114_153000.sql",
  },
  {
    id: "5",
    name: "Scheduled Full Backup",
    type: "full",
    status: "scheduled",
    size: "~2.5 GB",
    createdAt: "2024-01-16 02:00:00",
    duration: "~45 minutes",
    location: "/backups/full_20240116_020000.sql",
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  scheduled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
}

const typeColors = {
  full: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  incremental: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  differential: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
}

export default function BackupPage() {
  const [backups, setBackups] = useState<Backup[]>(mockBackups)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  const handleCreateBackup = async (type: "full" | "incremental" | "differential") => {
    setIsCreatingBackup(true)
    setBackupProgress(0)

    const newBackup: Backup = {
      id: Date.now().toString(),
      name: `Manual ${type.charAt(0).toUpperCase() + type.slice(1)} Backup`,
      type,
      status: "in_progress",
      size: "0 MB",
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      duration: "0 minutes",
      location: `/backups/manual_${Date.now()}.sql`,
    }

    setBackups((prev) => [newBackup, ...prev])

    // Simulate backup progress
    const progressInterval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsCreatingBackup(false)

          // Update backup status to completed
          setBackups((current) =>
            current.map((backup) =>
              backup.id === newBackup.id
                ? {
                    ...backup,
                    status: "completed" as const,
                    size: type === "full" ? "2.3 GB" : "145 MB",
                    duration: type === "full" ? "42 minutes" : "6 minutes",
                  }
                : backup,
            ),
          )

          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} backup completed successfully`)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 500)
  }

  const handleDeleteBackup = (backupId: string) => {
    setBackups((prev) => prev.filter((backup) => backup.id !== backupId))
    toast.success("Backup deleted successfully")
  }

  const handleDownloadBackup = (backup: Backup) => {
    toast.success(`Downloading ${backup.name}...`)
  }

  const handleRestoreBackup = (backup: Backup) => {
    toast.info(`Restore initiated for ${backup.name}`)
  }

  const stats = {
    total: backups.length,
    completed: backups.filter((b) => b.status === "completed").length,
    failed: backups.filter((b) => b.status === "failed").length,
    totalSize: backups
      .filter((b) => b.status === "completed")
      .reduce((acc, b) => acc + Number.parseFloat(b.size.replace(/[^\d.]/g, "")), 0)
      .toFixed(1),
  }

  return (
    <PermissionGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Backup Management</h1>
            <p className="text-muted-foreground">Manage system backups and data recovery</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleCreateBackup("incremental")} disabled={isCreatingBackup}>
              <Database className="mr-2 h-4 w-4" />
              Incremental Backup
            </Button>
            <Button onClick={() => handleCreateBackup("full")} disabled={isCreatingBackup}>
              <Database className="mr-2 h-4 w-4" />
              Full Backup
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Size</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSize} GB</div>
            </CardContent>
          </Card>
        </div>

        {/* Backup Progress */}
        {isCreatingBackup && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Backup in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Creating backup...</span>
                  <span>{Math.round(backupProgress)}%</span>
                </div>
                <Progress value={backupProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Backup Schedule Alert */}
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertTitle>Backup Schedule</AlertTitle>
          <AlertDescription>
            Automatic backups are scheduled daily at 2:00 AM. Full backups run weekly on Sundays. Next scheduled backup:
            Today at 2:00 AM (Incremental)
          </AlertDescription>
        </Alert>

        {/* Backups Table */}
        <Card>
          <CardHeader>
            <CardTitle>Backup History</CardTitle>
            <CardDescription>View and manage all system backups</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.name}</TableCell>
                    <TableCell>
                      <Badge className={typeColors[backup.type]}>{backup.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[backup.status]}>
                        {backup.status === "in_progress" && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
                        {backup.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {backup.status === "failed" && <XCircle className="mr-1 h-3 w-3" />}
                        {backup.status === "scheduled" && <Clock className="mr-1 h-3 w-3" />}
                        {backup.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{backup.size}</TableCell>
                    <TableCell>{backup.createdAt}</TableCell>
                    <TableCell>{backup.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {backup.status === "completed" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadBackup(backup)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRestoreBackup(backup)}>
                              <Upload className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {backup.status !== "in_progress" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBackup(backup.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Backup Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Configuration</CardTitle>
            <CardDescription>Current backup settings and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Automatic Backups</h4>
                <p className="text-sm text-muted-foreground">
                  ✅ Daily incremental backups at 2:00 AM
                  <br />✅ Weekly full backups on Sundays
                  <br />✅ 30-day retention policy
                  <br />✅ Backup verification enabled
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Storage Location</h4>
                <p className="text-sm text-muted-foreground">
                  📁 Local: /backups/
                  <br />
                  ☁️ Cloud: AWS S3 (configured)
                  <br />🔒 Encryption: AES-256 enabled
                  <br />📊 Compression: Enabled (avg 60% reduction)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}

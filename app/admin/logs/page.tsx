"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PermissionGuard } from "@/components/auth/permission-guard"
import {
  FileText,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Database,
  Settings,
} from "lucide-react"
import { toast } from "sonner"

interface LogEntry {
  id: string
  timestamp: string
  level: "info" | "warning" | "error" | "success"
  category: "auth" | "system" | "database" | "api" | "security"
  message: string
  user?: string
  ip?: string
  details?: string
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: "2024-01-15 10:30:15",
    level: "info",
    category: "auth",
    message: "User login successful",
    user: "admin@hospital.com",
    ip: "192.168.1.100",
    details: "Login from Chrome browser",
  },
  {
    id: "2",
    timestamp: "2024-01-15 10:25:42",
    level: "warning",
    category: "system",
    message: "High memory usage detected",
    details: "Memory usage: 85% (6.8GB/8GB)",
  },
  {
    id: "3",
    timestamp: "2024-01-15 10:20:33",
    level: "error",
    category: "database",
    message: "Database connection timeout",
    details: "Connection to primary database failed after 30 seconds",
  },
  {
    id: "4",
    timestamp: "2024-01-15 10:15:28",
    level: "success",
    category: "api",
    message: "Patient data backup completed",
    details: "Backed up 1,247 patient records",
  },
  {
    id: "5",
    timestamp: "2024-01-15 10:10:19",
    level: "error",
    category: "security",
    message: "Failed login attempt",
    user: "unknown@test.com",
    ip: "203.0.113.45",
    details: "Multiple failed attempts from suspicious IP",
  },
  {
    id: "6",
    timestamp: "2024-01-15 10:05:12",
    level: "info",
    category: "system",
    message: "System maintenance completed",
    details: "Routine maintenance window completed successfully",
  },
  {
    id: "7",
    timestamp: "2024-01-15 10:00:05",
    level: "warning",
    category: "database",
    message: "Slow query detected",
    details: "Query execution time: 5.2 seconds",
  },
  {
    id: "8",
    timestamp: "2024-01-15 09:55:33",
    level: "info",
    category: "auth",
    message: "User logout",
    user: "doctor@hospital.com",
    ip: "192.168.1.105",
  },
]

const levelColors = {
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
}

const categoryColors = {
  auth: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  system: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  database: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  api: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
  security: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const levelIcons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    const matchesCategory = selectedCategory === "all" || log.category === selectedCategory
    return matchesSearch && matchesLevel && matchesCategory
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast.success("Logs refreshed")
  }

  const handleExport = () => {
    toast.success("Exporting logs...")
  }

  const stats = {
    total: logs.length,
    errors: logs.filter((l) => l.level === "error").length,
    warnings: logs.filter((l) => l.level === "warning").length,
    info: logs.filter((l) => l.level === "info").length,
  }

  return (
    <PermissionGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
            <p className="text-muted-foreground">Monitor system activity and troubleshoot issues</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Info</CardTitle>
              <Info className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.info}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="auth">Authentication</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="auth">Authentication</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Log Entries ({filteredLogs.length})</CardTitle>
                <CardDescription>Recent system activity and events</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const LevelIcon = levelIcons[log.level]
                      return (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                          <TableCell>
                            <Badge className={levelColors[log.level]}>
                              <LevelIcon className="mr-1 h-3 w-3" />
                              {log.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={categoryColors[log.category]}>{log.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate" title={log.message}>
                              {log.message}
                            </div>
                            {log.details && (
                              <div className="text-xs text-muted-foreground mt-1 truncate" title={log.details}>
                                {log.details}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {log.user ? (
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="text-sm">{log.user}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ip || "-"}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category-specific tabs */}
          {["auth", "system", "security", "database"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category === "auth" && <User className="h-5 w-5" />}
                    {category === "system" && <Settings className="h-5 w-5" />}
                    {category === "security" && <Shield className="h-5 w-5" />}
                    {category === "database" && <Database className="h-5 w-5" />}
                    {category.charAt(0).toUpperCase() + category.slice(1)} Logs
                  </CardTitle>
                  <CardDescription>
                    {category === "auth" && "User authentication and authorization events"}
                    {category === "system" && "System-level events and maintenance activities"}
                    {category === "security" && "Security-related events and alerts"}
                    {category === "database" && "Database operations and performance events"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs
                        .filter((log) => log.category === category)
                        .map((log) => {
                          const LevelIcon = levelIcons[log.level]
                          return (
                            <TableRow key={log.id}>
                              <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                              <TableCell>
                                <Badge className={levelColors[log.level]}>
                                  <LevelIcon className="mr-1 h-3 w-3" />
                                  {log.level}
                                </Badge>
                              </TableCell>
                              <TableCell>{log.message}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="text-sm text-muted-foreground">{log.details || "-"}</div>
                                {log.user && <div className="text-xs text-muted-foreground mt-1">User: {log.user}</div>}
                                {log.ip && <div className="text-xs text-muted-foreground">IP: {log.ip}</div>}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PermissionGuard>
  )
}

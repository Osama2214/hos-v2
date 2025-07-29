"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Download,
  CalendarIcon,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Clock,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Report {
  id: string
  name: string
  type: "patient" | "financial" | "operational" | "clinical"
  status: "completed" | "generating" | "scheduled" | "failed"
  generatedAt: string
  size: string
  format: "PDF" | "Excel" | "CSV"
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Monthly Patient Summary",
    type: "patient",
    status: "completed",
    generatedAt: "2024-01-15 09:00:00",
    size: "2.4 MB",
    format: "PDF",
  },
  {
    id: "2",
    name: "Financial Revenue Report",
    type: "financial",
    status: "completed",
    generatedAt: "2024-01-15 08:30:00",
    size: "1.8 MB",
    format: "Excel",
  },
  {
    id: "3",
    name: "Operational Efficiency Report",
    type: "operational",
    status: "generating",
    generatedAt: "2024-01-15 10:00:00",
    size: "0 MB",
    format: "PDF",
  },
  {
    id: "4",
    name: "Clinical Outcomes Analysis",
    type: "clinical",
    status: "scheduled",
    generatedAt: "2024-01-16 02:00:00",
    size: "0 MB",
    format: "Excel",
  },
]

const statusColors = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  generating: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  scheduled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const typeColors = {
  patient: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  financial: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  operational: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  clinical: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [reportType, setReportType] = useState<string>("patient")
  const [reportFormat, setReportFormat] = useState<string>("PDF")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    const newReport: Report = {
      id: Date.now().toString(),
      name: `Custom ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      type: reportType as any,
      status: "generating",
      generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      size: "0 MB",
      format: reportFormat as any,
    }

    setReports((prev) => [newReport, ...prev])

    // Simulate report generation
    setTimeout(() => {
      setReports((current) =>
        current.map((report) =>
          report.id === newReport.id
            ? {
                ...report,
                status: "completed" as const,
                size: reportFormat === "PDF" ? "1.2 MB" : "890 KB",
              }
            : report,
        ),
      )
      setIsGenerating(false)
      toast.success("Report generated successfully")
    }, 3000)
  }

  const handleDownloadReport = (report: Report) => {
    toast.success(`Downloading ${report.name}...`)
  }

  const stats = {
    totalReports: reports.length,
    completedToday: reports.filter((r) => r.status === "completed" && r.generatedAt.startsWith("2024-01-15")).length,
    scheduledReports: reports.filter((r) => r.status === "scheduled").length,
    totalSize: reports
      .filter((r) => r.status === "completed")
      .reduce((acc, r) => acc + Number.parseFloat(r.size.replace(/[^\d.]/g, "")), 0)
      .toFixed(1),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage system reports</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedToday}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduledReports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSize} MB</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Create custom reports based on your requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="operational">Operational Report</SelectItem>
                      <SelectItem value="clinical">Clinical Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportFormat">Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="CSV">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date Range (From)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Date Range (To)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Pick a date
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {reportType === "patient" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Patient Report Options</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Age Group</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Ages" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="pediatric">Pediatric (0-17)</SelectItem>
                          <SelectItem value="adult">Adult (18-64)</SelectItem>
                          <SelectItem value="senior">Senior (65+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {reportType === "financial" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Financial Report Options</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Revenue Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Revenue" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Revenue</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="self-pay">Self Pay</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Include</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Summary Only" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summary">Summary Only</SelectItem>
                          <SelectItem value="detailed">Detailed Breakdown</SelectItem>
                          <SelectItem value="trends">Trend Analysis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>View and download previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge className={typeColors[report.type]}>{report.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[report.status]}>
                          {report.status === "generating" && <RefreshCw className="mr-1 h-3 w-3 animate-spin" />}
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.generatedAt}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.format}</Badge>
                      </TableCell>
                      <TableCell>
                        {report.status === "completed" && (
                          <Button variant="ghost" size="sm" onClick={() => handleDownloadReport(report)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Demographics
                </CardTitle>
                <CardDescription>Comprehensive patient population analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Analysis
                </CardTitle>
                <CardDescription>Financial performance and revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Clinical Outcomes
                </CardTitle>
                <CardDescription>Treatment effectiveness and patient outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Operational Metrics
                </CardTitle>
                <CardDescription>Efficiency and performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Department Summary
                </CardTitle>
                <CardDescription>Department-wise performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trend Analysis
                </CardTitle>
                <CardDescription>Historical trends and forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

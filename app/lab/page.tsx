"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TestTube, Search, Plus, Eye, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { toast } from "sonner"

interface LabRequest {
  id: string
  patientName: string
  patientId: string
  testType: string
  priority: "routine" | "urgent" | "stat"
  status: "pending" | "in_progress" | "completed" | "cancelled"
  requestedBy: string
  requestedAt: string
  completedAt?: string
  results?: string
  notes?: string
  cost: number
}

const mockLabRequests: LabRequest[] = [
  {
    id: "LAB001",
    patientName: "John Smith",
    patientId: "P001",
    testType: "Complete Blood Count (CBC)",
    priority: "routine",
    status: "completed",
    requestedBy: "Dr. Johnson",
    requestedAt: "2024-01-15 08:30:00",
    completedAt: "2024-01-15 10:15:00",
    results: "Normal values within reference range",
    cost: 45.0,
  },
  {
    id: "LAB002",
    patientName: "Sarah Wilson",
    patientId: "P002",
    testType: "Lipid Panel",
    priority: "routine",
    status: "in_progress",
    requestedBy: "Dr. Smith",
    requestedAt: "2024-01-15 09:00:00",
    cost: 65.0,
  },
  {
    id: "LAB003",
    patientName: "Mike Johnson",
    patientId: "P003",
    testType: "Cardiac Enzymes",
    priority: "stat",
    status: "pending",
    requestedBy: "Dr. Brown",
    requestedAt: "2024-01-15 09:30:00",
    cost: 120.0,
  },
  {
    id: "LAB004",
    patientName: "Emily Davis",
    patientId: "P004",
    testType: "Thyroid Function Tests",
    priority: "urgent",
    status: "completed",
    requestedBy: "Dr. Wilson",
    requestedAt: "2024-01-14 16:20:00",
    completedAt: "2024-01-15 08:45:00",
    results: "TSH elevated, T3/T4 within normal limits",
    cost: 85.0,
  },
  {
    id: "LAB005",
    patientName: "Robert Brown",
    patientId: "P005",
    testType: "Glucose Tolerance Test",
    priority: "routine",
    status: "cancelled",
    requestedBy: "Dr. Johnson",
    requestedAt: "2024-01-14 14:00:00",
    notes: "Patient did not show up for test",
    cost: 75.0,
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const priorityColors = {
  routine: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  urgent: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  stat: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const statusIcons = {
  pending: Clock,
  in_progress: TestTube,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function LabPage() {
  const [labRequests, setLabRequests] = useState<LabRequest[]>(mockLabRequests)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedRequest, setSelectedRequest] = useState<LabRequest | null>(null)
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false)

  const filteredRequests = labRequests.filter((request) => {
    const matchesSearch =
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusUpdate = (requestId: string, newStatus: LabRequest["status"]) => {
    setLabRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
              completedAt:
                newStatus === "completed" ? new Date().toISOString().replace("T", " ").slice(0, 19) : undefined,
            }
          : request,
      ),
    )
    toast.success(`Lab request ${newStatus}`)
  }

  const handleAddResults = (requestId: string, results: string) => {
    setLabRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, results, status: "completed" as const } : request,
      ),
    )
    toast.success("Results added successfully")
  }

  const handleNewRequest = (requestData: Partial<LabRequest>) => {
    const newRequest: LabRequest = {
      id: `LAB${String(labRequests.length + 1).padStart(3, "0")}`,
      patientName: requestData.patientName || "",
      patientId: requestData.patientId || "",
      testType: requestData.testType || "",
      priority: requestData.priority || "routine",
      status: "pending",
      requestedBy: "Current User",
      requestedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      cost: requestData.cost || 0,
    }
    setLabRequests((prev) => [newRequest, ...prev])
    setIsNewRequestOpen(false)
    toast.success("Lab request created successfully")
  }

  const stats = {
    total: labRequests.length,
    pending: labRequests.filter((r) => r.status === "pending").length,
    inProgress: labRequests.filter((r) => r.status === "in_progress").length,
    completed: labRequests.filter((r) => r.status === "completed").length,
    totalRevenue: labRequests.filter((r) => r.status === "completed").reduce((sum, r) => sum + r.cost, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laboratory</h1>
          <p className="text-muted-foreground">Manage lab requests and results</p>
        </div>
        <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <NewRequestDialog onSubmit={handleNewRequest} />
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <TestTube className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
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
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Lab Requests</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
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
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lab Requests ({filteredRequests.length})</CardTitle>
              <CardDescription>Manage laboratory test requests and track progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => {
                    const StatusIcon = statusIcons[request.status]
                    return (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.patientName}</div>
                            <div className="text-sm text-muted-foreground">{request.patientId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{request.testType}</TableCell>
                        <TableCell>
                          <Badge className={priorityColors[request.priority]}>{request.priority.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[request.status]}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {request.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>{request.requestedBy}</TableCell>
                        <TableCell>${request.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(request.id, "in_progress")}
                              >
                                Start
                              </Button>
                            )}
                            {request.status === "in_progress" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(request.id, "completed")}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
              <CardDescription>View and manage completed lab test results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labRequests
                    .filter((request) => request.status === "completed")
                    .map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.patientName}</div>
                            <div className="text-sm text-muted-foreground">{request.patientId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{request.testType}</TableCell>
                        <TableCell>{request.completedAt}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={request.results}>
                            {request.results || "No results available"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Volume by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Blood Tests</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cardiac Tests</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metabolic Panel</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Turnaround Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Average TAT</span>
                    <span className="font-medium">2.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STAT Tests</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Routine Tests</span>
                    <span className="font-medium">3.2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-time Rate</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Lab Request Details - {selectedRequest.id}</DialogTitle>
              <DialogDescription>View and manage lab request information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Patient</Label>
                  <p className="text-sm">
                    {selectedRequest.patientName} ({selectedRequest.patientId})
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Test Type</Label>
                  <p className="text-sm">{selectedRequest.testType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge className={priorityColors[selectedRequest.priority]}>
                    {selectedRequest.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={statusColors[selectedRequest.status]}>
                    {selectedRequest.status.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Requested By</Label>
                  <p className="text-sm">{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cost</Label>
                  <p className="text-sm">${selectedRequest.cost.toFixed(2)}</p>
                </div>
              </div>
              {selectedRequest.results && (
                <div>
                  <Label className="text-sm font-medium">Results</Label>
                  <p className="text-sm mt-1 p-2 bg-muted rounded">{selectedRequest.results}</p>
                </div>
              )}
              {selectedRequest.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm mt-1 p-2 bg-muted rounded">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function NewRequestDialog({ onSubmit }: { onSubmit: (data: Partial<LabRequest>) => void }) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    testType: "",
    priority: "routine" as LabRequest["priority"],
    cost: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>New Lab Request</DialogTitle>
        <DialogDescription>Create a new laboratory test request</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patientName" className="text-right">
              Patient Name
            </Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patientId" className="text-right">
              Patient ID
            </Label>
            <Input
              id="patientId"
              value={formData.patientId}
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="testType" className="text-right">
              Test Type
            </Label>
            <Select value={formData.testType} onValueChange={(value) => setFormData({ ...formData, testType: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</SelectItem>
                <SelectItem value="Lipid Panel">Lipid Panel</SelectItem>
                <SelectItem value="Cardiac Enzymes">Cardiac Enzymes</SelectItem>
                <SelectItem value="Thyroid Function Tests">Thyroid Function Tests</SelectItem>
                <SelectItem value="Glucose Tolerance Test">Glucose Tolerance Test</SelectItem>
                <SelectItem value="Liver Function Tests">Liver Function Tests</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={formData.priority}
              onValueChange={(value: LabRequest["priority"]) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Cost ($)
            </Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: Number.parseFloat(e.target.value) || 0 })}
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create Request</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

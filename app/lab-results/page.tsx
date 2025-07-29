"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, AlertTriangle, CheckCircle, Clock, Eye, LogOut, Filter } from "lucide-react"

// Mock lab results data
const mockLabResults = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientId: "P001",
    testName: "Complete Blood Count",
    orderDate: "2024-01-15",
    completedDate: "2024-01-16",
    status: "completed",
    priority: "normal",
    reviewed: false,
    results: [
      { parameter: "White Blood Cells", value: "7.2", unit: "K/uL", referenceRange: "4.0-11.0", status: "normal" },
      { parameter: "Red Blood Cells", value: "4.8", unit: "M/uL", referenceRange: "4.2-5.4", status: "normal" },
      { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "12.0-16.0", status: "normal" },
      { parameter: "Hematocrit", value: "42.1", unit: "%", referenceRange: "36.0-46.0", status: "normal" },
      { parameter: "Platelets", value: "285", unit: "K/uL", referenceRange: "150-450", status: "normal" },
    ],
    doctor: "Dr. Smith",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientId: "P002",
    testName: "Lipid Panel",
    orderDate: "2024-01-14",
    completedDate: "2024-01-15",
    status: "completed",
    priority: "high",
    reviewed: true,
    results: [
      { parameter: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "<200", status: "high" },
      { parameter: "LDL Cholesterol", value: "165", unit: "mg/dL", referenceRange: "<100", status: "high" },
      { parameter: "HDL Cholesterol", value: "38", unit: "mg/dL", referenceRange: ">40", status: "low" },
      { parameter: "Triglycerides", value: "210", unit: "mg/dL", referenceRange: "<150", status: "high" },
    ],
    doctor: "Dr. Smith",
  },
  {
    id: "3",
    patientName: "Emma Davis",
    patientId: "P003",
    testName: "Thyroid Function",
    orderDate: "2024-01-13",
    completedDate: "2024-01-14",
    status: "completed",
    priority: "normal",
    reviewed: false,
    results: [
      { parameter: "TSH", value: "2.1", unit: "mIU/L", referenceRange: "0.4-4.0", status: "normal" },
      { parameter: "Free T4", value: "1.3", unit: "ng/dL", referenceRange: "0.8-1.8", status: "normal" },
      { parameter: "Free T3", value: "3.2", unit: "pg/mL", referenceRange: "2.3-4.2", status: "normal" },
    ],
    doctor: "Dr. Smith",
  },
  {
    id: "4",
    patientName: "Robert Wilson",
    patientId: "P004",
    testName: "Basic Metabolic Panel",
    orderDate: "2024-01-12",
    completedDate: null,
    status: "pending",
    priority: "normal",
    reviewed: false,
    results: [],
    doctor: "Dr. Smith",
  },
]

export default function LabResultsPage() {
  const { user, isAuthenticated, logout, isInitialized, isHydrated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [filteredResults, setFilteredResults] = useState(mockLabResults)

  useEffect(() => {
    if (isInitialized && isHydrated) {
      if (!isAuthenticated || !user) {
        router.replace("/login")
        return
      }

      if (user.role !== "doctor") {
        const roleRedirects = {
          admin: "/admin",
          receptionist: "/reception",
          lab: "/lab",
        }
        router.replace(roleRedirects[user.role as keyof typeof roleRedirects] || "/")
        return
      }
    }
  }, [isAuthenticated, user, router, isInitialized, isHydrated])

  useEffect(() => {
    const filtered = mockLabResults.filter((result) => {
      const matchesSearch =
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.patientId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || result.status === statusFilter
      const matchesPriority = priorityFilter === "all" || result.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })

    setFilteredResults(filtered)
  }, [searchTerm, statusFilter, priorityFilter])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  const markAsReviewed = (resultId: string) => {
    // In a real app, this would update the database
    console.log(`Marking result ${resultId} as reviewed`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600"
      case "high":
        return "text-red-600"
      case "low":
        return "text-orange-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "in-progress":
        return <Badge variant="outline">In Progress</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "normal":
        return <Badge variant="outline">Normal</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  // Show loading only if not hydrated
  if (!isHydrated || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading lab results...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "doctor") {
    return null
  }

  const completedResults = filteredResults.filter((r) => r.status === "completed")
  const pendingResults = filteredResults.filter((r) => r.status === "pending")
  const needsReview = filteredResults.filter((r) => r.status === "completed" && !r.reviewed)
  const abnormalResults = filteredResults.filter((r) => r.results.some((result) => result.status !== "normal"))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Lab Results</h1>
            <p className="text-muted-foreground">Review and manage laboratory test results</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {user?.role}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingResults.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedResults.length}</div>
            <p className="text-xs text-muted-foreground">Ready for review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsReview.length}</div>
            <p className="text-xs text-muted-foreground">Unreviewed results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abnormal</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{abnormalResults.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, test, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Results ({filteredResults.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingResults.length})</TabsTrigger>
          <TabsTrigger value="review">Needs Review ({needsReview.length})</TabsTrigger>
          <TabsTrigger value="abnormal">Abnormal ({abnormalResults.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{result.testName}</CardTitle>
                      <CardDescription>
                        Patient: {result.patientName} ({result.patientId})
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(result.status)}
                      {getPriorityBadge(result.priority)}
                      {!result.reviewed && result.status === "completed" && (
                        <Badge variant="outline" className="text-orange-600">
                          Unreviewed
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Ordered: {new Date(result.orderDate).toLocaleDateString()}</p>
                      {result.completedDate && <p>Completed: {new Date(result.completedDate).toLocaleDateString()}</p>}
                    </div>
                    {result.status === "completed" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              {result.testName} - {result.patientName}
                            </DialogTitle>
                            <DialogDescription>
                              Completed on {new Date(result.completedDate!).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse border border-gray-200">
                                <thead>
                                  <tr className="bg-muted">
                                    <th className="border border-gray-200 p-2 text-left">Parameter</th>
                                    <th className="border border-gray-200 p-2 text-left">Value</th>
                                    <th className="border border-gray-200 p-2 text-left">Unit</th>
                                    <th className="border border-gray-200 p-2 text-left">Reference Range</th>
                                    <th className="border border-gray-200 p-2 text-left">Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result.results.map((res, index) => (
                                    <tr key={index}>
                                      <td className="border border-gray-200 p-2">{res.parameter}</td>
                                      <td
                                        className={`border border-gray-200 p-2 font-medium ${getStatusColor(res.status)}`}
                                      >
                                        {res.value}
                                      </td>
                                      <td className="border border-gray-200 p-2">{res.unit}</td>
                                      <td className="border border-gray-200 p-2">{res.referenceRange}</td>
                                      <td className="border border-gray-200 p-2">
                                        <Badge
                                          variant={res.status === "normal" ? "default" : "destructive"}
                                          className="text-xs"
                                        >
                                          {res.status}
                                        </Badge>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="flex justify-end gap-2">
                              {!result.reviewed && (
                                <Button onClick={() => markAsReviewed(result.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Reviewed
                                </Button>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardHeader>
              {result.status === "completed" && result.results.length > 0 && (
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.results.slice(0, 4).map((res, index) => (
                      <div key={index} className="text-center p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">{res.parameter}</p>
                        <p className={`font-medium ${getStatusColor(res.status)}`}>
                          {res.value} {res.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                  {result.results.length > 4 && (
                    <p className="text-sm text-muted-foreground mt-2">+{result.results.length - 4} more parameters</p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingResults.map((result) => (
            <Card key={result.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{result.testName}</CardTitle>
                    <CardDescription>
                      Patient: {result.patientName} ({result.patientId})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(result.status)}
                    {getPriorityBadge(result.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ordered on {new Date(result.orderDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {needsReview.map((result) => (
            <Card key={result.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{result.testName}</CardTitle>
                    <CardDescription>
                      Patient: {result.patientName} ({result.patientId})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-orange-600">
                      Needs Review
                    </Badge>
                    {getPriorityBadge(result.priority)}
                    <Button size="sm" onClick={() => markAsReviewed(result.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Reviewed
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="abnormal" className="space-y-4">
          {abnormalResults.map((result) => (
            <Card key={result.id} className="border-red-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{result.testName}</CardTitle>
                    <CardDescription>
                      Patient: {result.patientName} ({result.patientId})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="destructive">Abnormal</Badge>
                    {getPriorityBadge(result.priority)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-600">Abnormal Values:</p>
                  {result.results
                    .filter((res) => res.status !== "normal")
                    .map((res, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm">{res.parameter}</span>
                        <span className="text-sm font-medium text-red-600">
                          {res.value} {res.unit} ({res.status})
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

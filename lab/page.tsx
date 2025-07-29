import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Upload, Download, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

interface LabRequest {
  id: string
  patientName: string
  fileNumber: string
  labType: string
  requestedBy: string
  status: "Pending" | "In Progress" | "Completed"
  requestDate: string
  price?: number
  notes?: string
}

const mockLabRequests: LabRequest[] = [
  {
    id: "1",
    patientName: "John Doe",
    fileNumber: "P-2024-001",
    labType: "Blood Test",
    requestedBy: "Dr. Smith",
    status: "Pending",
    requestDate: "2024-01-15",
    notes: "Fasting required",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    fileNumber: "P-2024-002",
    labType: "X-Ray",
    requestedBy: "Dr. Johnson",
    status: "In Progress",
    requestDate: "2024-01-14",
    price: 150,
  },
  {
    id: "3",
    patientName: "Bob Johnson",
    fileNumber: "P-2024-003",
    labType: "MRI Scan",
    requestedBy: "Dr. Brown",
    status: "Completed",
    requestDate: "2024-01-10",
    price: 800,
  },
]

export default async function LabPage() {
  const user = await getCurrentUser()
  const isLabRole = user?.role === "lab"

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "In Progress":
        return <AlertCircle className="h-4 w-4" />
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "secondary"
      case "In Progress":
        return "default"
      case "Completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <PermissionGuard permission="canAccessLabSection">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Lab Requests</h1>
              <p className="text-muted-foreground">Manage laboratory tests and results</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLabRequests.filter((r) => r.status === "Pending").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockLabRequests.filter((r) => r.status === "In Progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockLabRequests.filter((r) => r.status === "Completed").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lab Requests</CardTitle>
            <CardDescription>All laboratory test requests and their current status</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>File Number</TableHead>
                  <TableHead>Lab Type</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLabRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.patientName}</TableCell>
                    <TableCell>{request.fileNumber}</TableCell>
                    <TableCell>{request.labType}</TableCell>
                    <TableCell>{request.requestedBy}</TableCell>
                    <TableCell>{request.requestDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(request.status) as any} className="flex items-center gap-1 w-fit">
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.price ? (
                        `$${request.price}`
                      ) : (
                        <PermissionGuard
                          permission="canSetLabPrices"
                          fallback={<span className="text-muted-foreground">-</span>}
                        >
                          <Button variant="ghost" size="sm">
                            Set Price
                          </Button>
                        </PermissionGuard>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {request.status === "Completed" && (
                          <PermissionGuard permission="canUploadLabResults">
                            <Button variant="ghost" size="sm">
                              <Upload className="h-4 w-4 mr-1" />
                              Results
                            </Button>
                          </PermissionGuard>
                        )}
                        {isLabRole && request.status !== "Completed" && (
                          <Button variant="ghost" size="sm">
                            Edit
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
      </div>
    </PermissionGuard>
  )
}

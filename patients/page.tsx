import { getCurrentUser } from "@/lib/auth"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Plus, Filter, Download } from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  fileNumber: string
  name: string
  age: number
  phone: string
  lastVisit: string
  status: "Active" | "Inactive"
  upcomingAppointments: number
}

const mockPatients: Patient[] = [
  {
    id: "1",
    fileNumber: "P-2024-001",
    name: "John Doe",
    age: 45,
    phone: "+1234567890",
    lastVisit: "2024-01-15",
    status: "Active",
    upcomingAppointments: 2,
  },
  {
    id: "2",
    fileNumber: "P-2024-002",
    name: "Jane Smith",
    age: 32,
    phone: "+1234567891",
    lastVisit: "2024-01-10",
    status: "Active",
    upcomingAppointments: 1,
  },
  {
    id: "3",
    fileNumber: "P-2024-003",
    name: "Bob Johnson",
    age: 67,
    phone: "+1234567892",
    lastVisit: "2023-12-20",
    status: "Inactive",
    upcomingAppointments: 0,
  },
]

export default async function PatientsPage() {
  const user = await getCurrentUser()

  return (
    <PermissionGuard permission="canViewAllPatients">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Patients</h1>
              <p className="text-muted-foreground">Manage patient records and information</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PermissionGuard permission="canExportReports">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </PermissionGuard>

            <PermissionGuard permission="canAddPatient">
              <Button asChild>
                <Link href="/patients/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Patient
                </Link>
              </Button>
            </PermissionGuard>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Patient Directory</CardTitle>
                <CardDescription>{mockPatients.length} patients registered</CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-8 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Appointments</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.fileNumber}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.lastVisit}</TableCell>
                    <TableCell>
                      <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {patient.upcomingAppointments > 0 ? (
                        <Badge variant="outline">{patient.upcomingAppointments}</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/patients/${patient.id}`}>View</Link>
                        </Button>
                        <PermissionGuard permission="canEditPatient">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </PermissionGuard>
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

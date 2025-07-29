"use client"

import { useState } from "react"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Search,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  AlertCircle,
  Timer,
} from "lucide-react"

interface Patient {
  id: string
  name: string
  fileNumber: string
  phone: string
  appointmentTime: string
  doctor: string
  appointmentType: string
  room?: string
  status: "Scheduled" | "Checked In" | "In Progress" | "Completed" | "No Show"
  checkinTime?: string
  waitTime?: number
  insurance?: string
  notes?: string
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Doe",
    fileNumber: "P-2024-001",
    phone: "+1234567890",
    appointmentTime: "09:00 AM",
    doctor: "Dr. Smith",
    appointmentType: "Consultation",
    room: "Room 101",
    status: "Scheduled",
    insurance: "Blue Cross",
    notes: "Regular checkup",
  },
  {
    id: "2",
    name: "Jane Smith",
    fileNumber: "P-2024-002",
    phone: "+1234567891",
    appointmentTime: "09:30 AM",
    doctor: "Dr. Johnson",
    appointmentType: "Follow-up",
    room: "Room 102",
    status: "Checked In",
    checkinTime: "09:25 AM",
    waitTime: 15,
    insurance: "Aetna",
  },
  {
    id: "3",
    name: "Bob Johnson",
    fileNumber: "P-2024-003",
    phone: "+1234567892",
    appointmentTime: "10:00 AM",
    doctor: "Dr. Smith",
    appointmentType: "Check-up",
    room: "Room 101",
    status: "In Progress",
    checkinTime: "09:55 AM",
    waitTime: 25,
    insurance: "Medicare",
  },
  {
    id: "4",
    name: "Alice Wilson",
    fileNumber: "P-2024-004",
    phone: "+1234567893",
    appointmentTime: "10:30 AM",
    doctor: "Dr. Brown",
    appointmentType: "Consultation",
    status: "Scheduled",
    insurance: "United Healthcare",
    notes: "New patient",
  },
  {
    id: "5",
    name: "Mike Davis",
    fileNumber: "P-2024-005",
    phone: "+1234567894",
    appointmentTime: "08:30 AM",
    doctor: "Dr. Johnson",
    appointmentType: "Lab Review",
    room: "Room 102",
    status: "Completed",
    checkinTime: "08:25 AM",
    waitTime: 10,
    insurance: "Cigna",
  },
  {
    id: "6",
    name: "Sarah Brown",
    fileNumber: "P-2024-006",
    phone: "+1234567895",
    appointmentTime: "08:00 AM",
    doctor: "Dr. Smith",
    appointmentType: "Treatment",
    status: "No Show",
    insurance: "Blue Cross",
  },
]

export default function CheckinPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Clock className="h-4 w-4 text-orange-600" />
      case "Checked In":
        return <UserCheck className="h-4 w-4 text-blue-600" />
      case "In Progress":
        return <Timer className="h-4 w-4 text-green-600" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "No Show":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "secondary"
      case "Checked In":
        return "default"
      case "In Progress":
        return "outline"
      case "Completed":
        return "outline"
      case "No Show":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const filteredPatients = mockPatients.filter(
    (patient) =>
      searchTerm === "" ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const handleCheckin = (patient: Patient) => {
    // In a real app, this would update the backend
    console.log("Checking in patient:", patient.name)
  }

  const handleCheckout = (patient: Patient) => {
    // In a real app, this would update the backend
    console.log("Checking out patient:", patient.name)
  }

  const statusCounts = {
    scheduled: mockPatients.filter((p) => p.status === "Scheduled").length,
    checkedIn: mockPatients.filter((p) => p.status === "Checked In").length,
    inProgress: mockPatients.filter((p) => p.status === "In Progress").length,
    completed: mockPatients.filter((p) => p.status === "Completed").length,
    noShow: mockPatients.filter((p) => p.status === "No Show").length,
  }

  return (
    <PermissionGuard permission="canAddPatient">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Patient Check-in</h1>
              <p className="text-muted-foreground">Manage patient arrivals and check-in process</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, file number, or phone..."
                className="pl-8 w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.scheduled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Checked In</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.checkedIn}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Timer className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">No Shows</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.noShow}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="waiting">Waiting to Check-in</TabsTrigger>
            <TabsTrigger value="checkedin">Checked In</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>{filteredPatients.length} patients scheduled</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>File Number</TableHead>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{patient.name}</span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {patient.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{patient.fileNumber}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {patient.appointmentTime}
                            </div>
                            <span className="text-sm text-muted-foreground">{patient.appointmentType}</span>
                          </div>
                        </TableCell>
                        <TableCell>{patient.doctor}</TableCell>
                        <TableCell>
                          {patient.room ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {patient.room}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">TBD</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusColor(patient.status) as any}
                            className="flex items-center gap-1 w-fit"
                          >
                            {getStatusIcon(patient.status)}
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {patient.waitTime ? (
                            <div className="flex items-center gap-1">
                              <Timer className="h-3 w-3" />
                              {patient.waitTime} min
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {patient.status === "Scheduled" && (
                              <Button size="sm" onClick={() => handleCheckin(patient)}>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Check In
                              </Button>
                            )}
                            {patient.status === "Checked In" && (
                              <Button variant="outline" size="sm">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Notify Doctor
                              </Button>
                            )}
                            {patient.status === "In Progress" && (
                              <Button variant="outline" size="sm" onClick={() => handleCheckout(patient)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
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
          </TabsContent>

          <TabsContent value="waiting">
            <Card>
              <CardHeader>
                <CardTitle>Waiting to Check-in</CardTitle>
                <CardDescription>
                  {filteredPatients.filter((p) => p.status === "Scheduled").length} patients waiting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPatients
                    .filter((p) => p.status === "Scheduled")
                    .map((patient) => (
                      <Card key={patient.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{patient.name}</CardTitle>
                            <Badge variant="secondary">{patient.appointmentTime}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">{patient.fileNumber}</div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {patient.doctor}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {patient.appointmentType}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {patient.phone}
                            </div>
                            {patient.insurance && (
                              <div className="text-xs text-muted-foreground">Insurance: {patient.insurance}</div>
                            )}
                          </div>
                          <Button className="w-full" onClick={() => handleCheckin(patient)}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Check In Patient
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkedin">
            <Card>
              <CardHeader>
                <CardTitle>Checked In Patients</CardTitle>
                <CardDescription>
                  {filteredPatients.filter((p) => p.status === "Checked In").length} patients waiting to be seen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients
                    .filter((p) => p.status === "Checked In")
                    .map((patient) => (
                      <Card
                        key={patient.id}
                        className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <UserCheck className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{patient.name}</h3>
                                <p className="text-sm text-muted-foreground">{patient.fileNumber}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span>{patient.doctor}</span>
                                  <span>•</span>
                                  <span>{patient.appointmentType}</span>
                                  {patient.room && (
                                    <>
                                      <span>•</span>
                                      <span>{patient.room}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Checked in at</div>
                              <div className="font-medium">{patient.checkinTime}</div>
                              {patient.waitTime && (
                                <div className="text-sm text-orange-600 mt-1">Waiting {patient.waitTime} minutes</div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inprogress">
            <Card>
              <CardHeader>
                <CardTitle>In Progress</CardTitle>
                <CardDescription>
                  {filteredPatients.filter((p) => p.status === "In Progress").length} patients currently being seen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients
                    .filter((p) => p.status === "In Progress")
                    .map((patient) => (
                      <Card
                        key={patient.id}
                        className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full">
                                <Timer className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{patient.name}</h3>
                                <p className="text-sm text-muted-foreground">{patient.fileNumber}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span>{patient.doctor}</span>
                                  <span>•</span>
                                  <span>{patient.appointmentType}</span>
                                  {patient.room && (
                                    <>
                                      <span>•</span>
                                      <span>{patient.room}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleCheckout(patient)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete Visit
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PermissionGuard>
  )
}

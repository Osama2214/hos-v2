"use client"

import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Search, Filter, Calendar, Clock, User, Phone } from "lucide-react"

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  doctorName: string
  date: string
  time: string
  type: string
  status: "Scheduled" | "Confirmed" | "Completed" | "Cancelled"
  notes?: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    patientPhone: "+1234567890",
    doctorName: "Dr. Smith",
    date: "2024-01-20",
    time: "09:00 AM",
    type: "Consultation",
    status: "Scheduled",
    notes: "Regular checkup",
  },
  {
    id: "2",
    patientName: "Jane Smith",
    patientPhone: "+1234567891",
    doctorName: "Dr. Johnson",
    date: "2024-01-20",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Confirmed",
    notes: "Post-surgery follow-up",
  },
  {
    id: "3",
    patientName: "Bob Johnson",
    patientPhone: "+1234567892",
    doctorName: "Dr. Brown",
    date: "2024-01-19",
    time: "02:00 PM",
    type: "Emergency",
    status: "Completed",
    notes: "Chest pain evaluation",
  },
  {
    id: "4",
    patientName: "Alice Wilson",
    patientPhone: "+1234567893",
    doctorName: "Dr. Davis",
    date: "2024-01-21",
    time: "11:00 AM",
    type: "Consultation",
    status: "Cancelled",
    notes: "Patient requested cancellation",
  },
]

export default function AppointmentsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "secondary"
      case "Confirmed":
        return "default"
      case "Completed":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const todayAppointments = mockAppointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0]).length

  return (
    <PermissionGuard permissions={["canAddAppointment", "canViewAllPatients", "canEditSchedule"]}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Appointments</h1>
              <p className="text-muted-foreground">Manage patient appointments and scheduling</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAppointments.filter((a) => a.status === "Scheduled").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAppointments.filter((a) => a.status === "Confirmed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockAppointments.filter((a) => a.status === "Completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>{mockAppointments.length} appointments scheduled</CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search appointments..." className="pl-8 w-64" />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">{appointment.patientName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {appointment.patientPhone}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctorName}</TableCell>
                    <TableCell>{appointment.date}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(appointment.status) as any}>{appointment.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        {appointment.status === "Scheduled" && (
                          <Button variant="ghost" size="sm">
                            Confirm
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

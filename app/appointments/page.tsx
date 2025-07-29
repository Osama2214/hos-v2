"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Search, Filter, Calendar, Clock, User, Phone, LogOut, Edit, Trash2 } from "lucide-react"

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
  const { user, isAuthenticated, logout, isInitialized, isHydrated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isInitialized && isHydrated) {
      if (!isAuthenticated || !user) {
        router.replace("/login")
        return
      }

      if (!["doctor", "admin", "receptionist"].includes(user.role)) {
        router.replace("/")
        return
      }
    }
  }, [isAuthenticated, user, router, isInitialized, isHydrated])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  // Show loading only if not hydrated
  if (!isHydrated || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    )
  }

  // Return null if not authenticated (let redirect happen)
  if (!isAuthenticated || !user) {
    return null
  }

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

  const filteredAppointments = mockAppointments.filter(
    (appointment) =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const todayAppointments = mockAppointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0]).length

  return (
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
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
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
            <div className="text-2xl font-bold">{mockAppointments.filter((a) => a.status === "Scheduled").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <User className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAppointments.filter((a) => a.status === "Confirmed").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAppointments.filter((a) => a.status === "Completed").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>{filteredAppointments.length} appointments scheduled</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search appointments..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
              {filteredAppointments.map((appointment) => (
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
                        <Edit className="h-4 w-4" />
                      </Button>
                      {appointment.status === "Scheduled" && (
                        <Button variant="ghost" size="sm">
                          Confirm
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

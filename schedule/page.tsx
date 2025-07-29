"use client"

import { useState } from "react"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Calendar, Clock, Plus, Search, Filter, ChevronLeft, ChevronRight, User, MapPin, Phone } from "lucide-react"

interface ScheduleEvent {
  id: string
  time: string
  duration: number
  patient: string
  doctor: string
  type: string
  room: string
  status: "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "Cancelled"
  phone?: string
  notes?: string
}

const mockSchedule: ScheduleEvent[] = [
  {
    id: "1",
    time: "09:00",
    duration: 30,
    patient: "John Doe",
    doctor: "Dr. Smith",
    type: "Consultation",
    room: "Room 101",
    status: "Confirmed",
    phone: "+1234567890",
    notes: "Regular checkup",
  },
  {
    id: "2",
    time: "09:30",
    duration: 45,
    patient: "Jane Smith",
    doctor: "Dr. Johnson",
    type: "Follow-up",
    room: "Room 102",
    status: "Scheduled",
    phone: "+1234567891",
    notes: "Post-surgery follow-up",
  },
  {
    id: "3",
    time: "10:15",
    duration: 30,
    patient: "Bob Johnson",
    doctor: "Dr. Smith",
    type: "Check-up",
    room: "Room 101",
    status: "In Progress",
    phone: "+1234567892",
  },
  {
    id: "4",
    time: "11:00",
    duration: 60,
    patient: "Alice Wilson",
    doctor: "Dr. Brown",
    type: "Consultation",
    room: "Room 103",
    status: "Scheduled",
    phone: "+1234567893",
    notes: "New patient consultation",
  },
  {
    id: "5",
    time: "14:00",
    duration: 30,
    patient: "Mike Davis",
    doctor: "Dr. Johnson",
    type: "Lab Review",
    room: "Room 102",
    status: "Confirmed",
    phone: "+1234567894",
  },
  {
    id: "6",
    time: "14:30",
    duration: 45,
    patient: "Sarah Brown",
    doctor: "Dr. Smith",
    type: "Treatment",
    room: "Room 101",
    status: "Scheduled",
    phone: "+1234567895",
  },
]

const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "secondary"
      case "Confirmed":
        return "default"
      case "In Progress":
        return "outline"
      case "Completed":
        return "outline"
      case "Cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const filteredSchedule = mockSchedule.filter((event) => {
    const matchesDoctor = selectedDoctor === "all" || event.doctor.includes(selectedDoctor)
    const matchesSearch =
      searchTerm === "" ||
      event.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDoctor && matchesSearch
  })

  const getEventForTimeSlot = (time: string) => {
    return filteredSchedule.find((event) => event.time === time)
  }

  return (
    <PermissionGuard permission="canAddAppointment">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Schedule Management</h1>
              <p className="text-muted-foreground">Manage daily appointments and scheduling</p>
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

        {/* Date Navigation and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-center">
                  <h3 className="font-semibold">{formatDate(selectedDate)}</h3>
                  <p className="text-sm text-muted-foreground">{filteredSchedule.length} appointments scheduled</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients or doctors..."
                    className="pl-8 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Doctors</SelectItem>
                    <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                    <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                    <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Schedule Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
            <CardDescription>Click on any appointment to view details or make changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {timeSlots.map((time) => {
                const event = getEventForTimeSlot(time)
                return (
                  <div key={time} className="flex items-center gap-4 p-2 border-b border-border/50">
                    <div className="w-16 text-sm font-mono text-muted-foreground">{time}</div>

                    {event ? (
                      <div className="flex-1 flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{event.patient}</span>
                              <Badge variant={getStatusColor(event.status) as any} className="text-xs">
                                {event.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>{event.doctor}</span>
                              <span>•</span>
                              <span>{event.type}</span>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.room}
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {event.duration} min
                              </div>
                              {event.phone && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {event.phone}
                                  </div>
                                </>
                              )}
                            </div>
                            {event.notes && <p className="text-xs text-muted-foreground mt-1 italic">{event.notes}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          {event.status === "Scheduled" && (
                            <Button variant="ghost" size="sm">
                              Confirm
                            </Button>
                          )}
                          {event.status === "Confirmed" && (
                            <Button variant="ghost" size="sm">
                              Check-in
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 p-3 border-2 border-dashed border-border/30 rounded-lg text-center text-muted-foreground hover:border-border/50 transition-colors cursor-pointer">
                        <span className="text-sm">Available - Click to schedule</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredSchedule.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredSchedule.filter((e) => e.status === "Confirmed").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <User className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredSchedule.filter((e) => e.status === "In Progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
              <Plus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeSlots.length - filteredSchedule.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PermissionGuard>
  )
}

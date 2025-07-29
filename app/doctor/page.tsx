"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Calendar,
  Users,
  Clock,
  Stethoscope,
  FileText,
  TestTube,
  CheckCircle,
  ClipboardList,
  LogOut,
} from "lucide-react"
import Link from "next/link"

// Mock data for the doctor dashboard
const todayStats = {
  totalPatients: 12,
  completedAppointments: 8,
  pendingAppointments: 4,
  labResults: 3,
}

const upcomingAppointments = [
  {
    id: "1",
    patient: "Sarah Johnson",
    time: "10:30 AM",
    type: "Follow-up",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    patient: "Michael Chen",
    time: "11:15 AM",
    type: "Consultation",
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    patient: "Emma Davis",
    time: "2:00 PM",
    type: "Check-up",
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const recentPatients = [
  {
    id: "1",
    name: "Robert Wilson",
    lastVisit: "2 days ago",
    condition: "Hypertension",
    status: "stable",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Lisa Anderson",
    lastVisit: "1 week ago",
    condition: "Diabetes",
    status: "monitoring",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "James Brown",
    lastVisit: "3 days ago",
    condition: "Post-surgery",
    status: "recovering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const pendingLabResults = [
  {
    id: "1",
    patient: "Maria Garcia",
    test: "Blood Panel",
    ordered: "Yesterday",
    priority: "high",
  },
  {
    id: "2",
    patient: "David Kim",
    test: "X-Ray Chest",
    ordered: "2 days ago",
    priority: "normal",
  },
  {
    id: "3",
    patient: "Anna Smith",
    test: "Urine Analysis",
    ordered: "3 days ago",
    priority: "normal",
  },
]

export default function DoctorPage() {
  const { user, isAuthenticated, logout, isInitialized, isHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isInitialized && isHydrated) {
      console.log("Doctor page auth check:", { isAuthenticated, user: user?.role })

      if (!isAuthenticated || !user) {
        console.log("Doctor page: user not authenticated, redirecting to login")
        router.replace("/login")
        return
      }

      if (user.role !== "doctor") {
        console.log("Doctor page: user not doctor, redirecting to appropriate dashboard")
        const roleRedirects = {
          admin: "/admin",
          receptionist: "/reception",
          lab: "/lab",
        }
        router.replace(roleRedirects[user.role as keyof typeof roleRedirects] || "/")
        return
      }

      setIsLoading(false)
    }
  }, [isAuthenticated, user, router, isInitialized, isHydrated])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  if (isLoading || !isInitialized || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading doctor dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "doctor") {
    return null
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Dr. {user.name}!</p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Appointments today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.pendingAppointments}</div>
            <p className="text-xs text-muted-foreground">Appointments remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.labResults}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={appointment.avatar || "/placeholder.svg"} alt={appointment.patient} />
                  <AvatarFallback>
                    {appointment.patient
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{appointment.patient}</p>
                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appointment.time}</p>
                  <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"} className="text-xs">
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/appointments">View All Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5" />
              Recent Patients
            </CardTitle>
            <CardDescription>Recently treated patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                  <AvatarFallback>
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">{patient.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
                  <Badge
                    variant={
                      patient.status === "stable"
                        ? "default"
                        : patient.status === "monitoring"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {patient.status}
                  </Badge>
                </div>
              </div>
            ))}
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/patients">View All Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Pending Lab Results
            </CardTitle>
            <CardDescription>Results awaiting your review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingLabResults.map((result) => (
              <div key={result.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.patient}</p>
                  <p className="text-sm text-muted-foreground">{result.test}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{result.ordered}</p>
                  <Badge variant={result.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                    {result.priority}
                  </Badge>
                </div>
              </div>
            ))}
            <Button asChild className="w-full bg-transparent" variant="outline">
              <Link href="/lab-results">View Lab Results</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-20 flex-col gap-2">
              <Link href="/medical-records">
                <ClipboardList className="h-6 w-6" />
                Medical Records
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/prescriptions">
                <FileText className="h-6 w-6" />
                Prescriptions
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/lab-results">
                <TestTube className="h-6 w-6" />
                Lab Results
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <Link href="/appointments">
                <Calendar className="h-6 w-6" />
                Schedule Appointment
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

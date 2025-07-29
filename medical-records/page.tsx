"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Plus, Calendar, User, FileText, LogOut, Stethoscope } from "lucide-react"

// Mock data
const mockPatients = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 34,
    gender: "Female",
    phone: "(555) 123-4567",
    email: "sarah.johnson@email.com",
    lastVisit: "2024-01-15",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 45,
    gender: "Male",
    phone: "(555) 234-5678",
    email: "michael.chen@email.com",
    lastVisit: "2024-01-10",
    avatar: "/placeholder-user.jpg",
  },
  {
    id: "3",
    name: "Emma Davis",
    age: 28,
    gender: "Female",
    phone: "(555) 345-6789",
    email: "emma.davis@email.com",
    lastVisit: "2024-01-12",
    avatar: "/placeholder-user.jpg",
  },
]

const mockMedicalRecords = [
  {
    id: "1",
    patientId: "1",
    date: "2024-01-15",
    type: "Consultation",
    chiefComplaint: "Persistent headaches for 2 weeks",
    diagnosis: "Tension headache",
    treatment: "Prescribed pain medication, stress management techniques",
    vitals: {
      bloodPressure: "120/80",
      heartRate: "72",
      temperature: "98.6°F",
      weight: "140 lbs",
    },
    medications: ["Ibuprofen 400mg", "Acetaminophen 500mg"],
    notes: "Patient reports improvement with stress reduction. Follow-up in 2 weeks.",
    doctor: "Dr. Smith",
  },
  {
    id: "2",
    patientId: "1",
    date: "2024-01-01",
    type: "Annual Checkup",
    chiefComplaint: "Routine annual examination",
    diagnosis: "Healthy adult",
    treatment: "Continue current lifestyle, annual screening recommended",
    vitals: {
      bloodPressure: "118/75",
      heartRate: "68",
      temperature: "98.4°F",
      weight: "138 lbs",
    },
    medications: [],
    notes: "All vital signs normal. Patient in good health.",
    doctor: "Dr. Smith",
  },
]

export default function MedicalRecordsPage() {
  const { user, isAuthenticated, logout, hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPatients, setFilteredPatients] = useState(mockPatients)
  const [patientRecords, setPatientRecords] = useState<any[]>([])
  const [isAddingRecord, setIsAddingRecord] = useState(false)

  useEffect(() => {
    if (hasHydrated) {
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

      setIsLoading(false)
    }
  }, [isAuthenticated, user, router, hasHydrated])

  useEffect(() => {
    const filtered = mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredPatients(filtered)
  }, [searchTerm])

  useEffect(() => {
    if (selectedPatient) {
      const records = mockMedicalRecords.filter((record) => record.patientId === selectedPatient.id)
      setPatientRecords(records)
    }
  }, [selectedPatient])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  if (isLoading || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading medical records...</p>
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
            <h1 className="text-2xl font-bold">Medical Records</h1>
            <p className="text-muted-foreground">View and manage patient medical records</p>
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

      <Tabs defaultValue="patients" className="w-full">
        <TabsList>
          <TabsTrigger value="patients">Patient Directory</TabsTrigger>
          {selectedPatient && <TabsTrigger value="records">{selectedPatient.name}'s Records</TabsTrigger>}
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Directory
              </CardTitle>
              <CardDescription>Select a patient to view their medical records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPatients.map((patient) => (
                  <Card
                    key={patient.id}
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedPatient?.id === patient.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
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
                          <p className="text-sm text-muted-foreground">
                            {patient.age} years • {patient.gender}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {selectedPatient && (
          <TabsContent value="records" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedPatient.name}'s Medical Records</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedPatient.age} years • {selectedPatient.gender} • {selectedPatient.phone}
                </p>
              </div>
              <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add Medical Record</DialogTitle>
                    <DialogDescription>Create a new medical record for {selectedPatient.name}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visit-type">Visit Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select visit type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="checkup">Check-up</SelectItem>
                            <SelectItem value="followup">Follow-up</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chief-complaint">Chief Complaint</Label>
                      <Textarea placeholder="Patient's main concern or reason for visit" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Textarea placeholder="Medical diagnosis" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="treatment">Treatment Plan</Label>
                      <Textarea placeholder="Treatment and recommendations" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bp">Blood Pressure</Label>
                        <Input placeholder="120/80" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hr">Heart Rate</Label>
                        <Input placeholder="72 bpm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea placeholder="Any additional observations or notes" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddingRecord(false)}>Save Record</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {patientRecords.map((record) => (
                <Card key={record.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <CardTitle className="text-lg">{new Date(record.date).toLocaleDateString()}</CardTitle>
                        <Badge variant="outline">{record.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Stethoscope className="h-4 w-4" />
                        {record.doctor}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Chief Complaint</h4>
                      <p className="text-sm text-muted-foreground">{record.chiefComplaint}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Diagnosis</h4>
                      <p className="text-sm text-muted-foreground">{record.diagnosis}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Vital Signs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Blood Pressure</p>
                          <p className="font-medium">{record.vitals.bloodPressure}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Heart Rate</p>
                          <p className="font-medium">{record.vitals.heartRate} bpm</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="font-medium">{record.vitals.temperature}</p>
                        </div>
                        <div className="text-center p-2 bg-muted rounded">
                          <p className="text-xs text-muted-foreground">Weight</p>
                          <p className="font-medium">{record.vitals.weight}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Treatment</h4>
                      <p className="text-sm text-muted-foreground">{record.treatment}</p>
                    </div>

                    {record.medications.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Medications</h4>
                        <div className="flex flex-wrap gap-2">
                          {record.medications.map((med, index) => (
                            <Badge key={index} variant="secondary">
                              {med}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground">{record.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {patientRecords.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Medical Records</h3>
                    <p className="text-muted-foreground mb-4">No medical records found for this patient.</p>
                    <Button onClick={() => setIsAddingRecord(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Record
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

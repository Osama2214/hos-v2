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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Plus, User, AlertTriangle, Clock, Printer, Send, LogOut, Pill, Trash2 } from "lucide-react"

// Mock data
const mockPrescriptions = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    patientId: "P001",
    medications: [
      {
        name: "Lisinopril",
        strength: "10mg",
        form: "Tablet",
        quantity: "30",
        directions: "Take 1 tablet daily",
        refills: 5,
        refillsUsed: 2,
      },
      {
        name: "Metformin",
        strength: "500mg",
        form: "Tablet",
        quantity: "60",
        directions: "Take 1 tablet twice daily with meals",
        refills: 3,
        refillsUsed: 1,
      },
    ],
    prescribedDate: "2024-01-15",
    expiryDate: "2025-01-15",
    status: "active",
    doctor: "Dr. Smith",
  },
  {
    id: "2",
    patientName: "Michael Chen",
    patientId: "P002",
    medications: [
      {
        name: "Atorvastatin",
        strength: "20mg",
        form: "Tablet",
        quantity: "30",
        directions: "Take 1 tablet daily at bedtime",
        refills: 5,
        refillsUsed: 5,
      },
    ],
    prescribedDate: "2024-01-10",
    expiryDate: "2025-01-10",
    status: "expired",
    doctor: "Dr. Smith",
  },
  {
    id: "3",
    patientName: "Emma Davis",
    patientId: "P003",
    medications: [
      {
        name: "Levothyroxine",
        strength: "50mcg",
        form: "Tablet",
        quantity: "30",
        directions: "Take 1 tablet daily on empty stomach",
        refills: 5,
        refillsUsed: 0,
      },
    ],
    prescribedDate: "2024-01-12",
    expiryDate: "2025-01-12",
    status: "active",
    doctor: "Dr. Smith",
  },
]

const commonMedications = [
  { name: "Lisinopril", strengths: ["5mg", "10mg", "20mg"], forms: ["Tablet"] },
  { name: "Metformin", strengths: ["500mg", "850mg", "1000mg"], forms: ["Tablet", "Extended Release"] },
  { name: "Atorvastatin", strengths: ["10mg", "20mg", "40mg", "80mg"], forms: ["Tablet"] },
  { name: "Levothyroxine", strengths: ["25mcg", "50mcg", "75mcg", "100mcg"], forms: ["Tablet"] },
  { name: "Amlodipine", strengths: ["2.5mg", "5mg", "10mg"], forms: ["Tablet"] },
  { name: "Omeprazole", strengths: ["20mg", "40mg"], forms: ["Capsule"] },
  { name: "Sertraline", strengths: ["25mg", "50mg", "100mg"], forms: ["Tablet"] },
  { name: "Ibuprofen", strengths: ["200mg", "400mg", "600mg"], forms: ["Tablet", "Capsule"] },
]

const mockPatients = [
  { id: "P001", name: "Sarah Johnson" },
  { id: "P002", name: "Michael Chen" },
  { id: "P003", name: "Emma Davis" },
  { id: "P004", name: "Robert Wilson" },
]

export default function PrescriptionsPage() {
  const { user, isAuthenticated, logout, hasHydrated } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredPrescriptions, setFilteredPrescriptions] = useState(mockPrescriptions)
  const [isCreatingPrescription, setIsCreatingPrescription] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("")
  const [medications, setMedications] = useState([
    {
      name: "",
      strength: "",
      form: "",
      quantity: "",
      directions: "",
      refills: "0",
    },
  ])

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
    const filtered = mockPrescriptions.filter(
      (prescription) =>
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prescription.medications.some((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredPrescriptions(filtered)
  }, [searchTerm])

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        name: "",
        strength: "",
        form: "",
        quantity: "",
        directions: "",
        refills: "0",
      },
    ])
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = medications.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    setMedications(updated)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getExpiryWarning = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
      return (
        <Badge variant="outline" className="text-orange-600">
          Expires in {daysUntilExpiry} days
        </Badge>
      )
    }
    return null
  }

  if (isLoading || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading prescriptions...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user || user.role !== "doctor") {
    return null
  }

  const activePrescriptions = filteredPrescriptions.filter((p) => p.status === "active")
  const expiredPrescriptions = filteredPrescriptions.filter((p) => p.status === "expired")
  const expiringPrescriptions = filteredPrescriptions.filter((p) => {
    const expiry = new Date(p.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold">Prescriptions</h1>
            <p className="text-muted-foreground">Create and manage patient prescriptions</p>
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
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrescriptions.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringPrescriptions.length}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiredPrescriptions.length}</div>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPatients.length}</div>
            <p className="text-xs text-muted-foreground">With prescriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Create */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prescriptions by patient name, ID, or medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isCreatingPrescription} onOpenChange={setIsCreatingPrescription}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                  <DialogDescription>Create a new prescription for a patient</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockPatients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.name} ({patient.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">Medications</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                      </Button>
                    </div>

                    {medications.map((medication, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Medication {index + 1}</h4>
                          {medications.length > 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={() => removeMedication(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Medication Name</Label>
                            <Select
                              value={medication.name}
                              onValueChange={(value) => updateMedication(index, "name", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select medication" />
                              </SelectTrigger>
                              <SelectContent>
                                {commonMedications.map((med) => (
                                  <SelectItem key={med.name} value={med.name}>
                                    {med.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Strength</Label>
                            <Select
                              value={medication.strength}
                              onValueChange={(value) => updateMedication(index, "strength", value)}
                              disabled={!medication.name}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select strength" />
                              </SelectTrigger>
                              <SelectContent>
                                {medication.name &&
                                  commonMedications
                                    .find((med) => med.name === medication.name)
                                    ?.strengths.map((strength) => (
                                      <SelectItem key={strength} value={strength}>
                                        {strength}
                                      </SelectItem>
                                    ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Form</Label>
                            <Select
                              value={medication.form}
                              onValueChange={(value) => updateMedication(index, "form", value)}
                              disabled={!medication.name}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select form" />
                              </SelectTrigger>
                              <SelectContent>
                                {medication.name &&
                                  commonMedications
                                    .find((med) => med.name === medication.name)
                                    ?.forms.map((form) => (
                                      <SelectItem key={form} value={form}>
                                        {form}
                                      </SelectItem>
                                    ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              value={medication.quantity}
                              onChange={(e) => updateMedication(index, "quantity", e.target.value)}
                              placeholder="30"
                            />
                          </div>

                          <div className="space-y-2 col-span-2">
                            <Label>Directions for Use</Label>
                            <Textarea
                              value={medication.directions}
                              onChange={(e) => updateMedication(index, "directions", e.target.value)}
                              placeholder="Take 1 tablet daily with food"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Refills</Label>
                            <Select
                              value={medication.refills}
                              onValueChange={(value) => updateMedication(index, "refills", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[0, 1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} refills
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreatingPrescription(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreatingPrescription(false)}>Create Prescription</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Prescriptions ({filteredPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activePrescriptions.length})</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon ({expiringPrescriptions.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredPrescriptions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {prescription.patientName} ({prescription.patientId})
                    </CardTitle>
                    <CardDescription>
                      Prescribed on {new Date(prescription.prescribedDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(prescription.status)}
                    {getExpiryWarning(prescription.expiryDate)}
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm">
                        <Send className="h-4 w-4 mr-2" />
                        Send to Pharmacy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Medications ({prescription.medications.length})</h4>
                    <div className="space-y-3">
                      {prescription.medications.map((medication, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">
                              {medication.name} {medication.strength} {medication.form}
                            </h5>
                            <Badge variant="outline">Qty: {medication.quantity}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{medication.directions}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              Refills: {medication.refillsUsed}/{medication.refills}
                            </span>
                            {medication.refillsUsed >= medication.refills && (
                              <Badge variant="destructive" className="text-xs">
                                No refills remaining
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Prescribed by: {prescription.doctor}</span>
                    <span>Expires: {new Date(prescription.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activePrescriptions.map((prescription) => (
            <Card key={prescription.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {prescription.patientName} ({prescription.patientId})
                    </CardTitle>
                    <CardDescription>{prescription.medications.length} medication(s)</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Active</Badge>
                    {getExpiryWarning(prescription.expiryDate)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="font-medium">
                        {medication.name} {medication.strength}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {medication.refillsUsed}/{medication.refills} refills used
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          {expiringPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {prescription.patientName} ({prescription.patientId})
                    </CardTitle>
                    <CardDescription>
                      Expires on {new Date(prescription.expiryDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-orange-600">
                      Expiring Soon
                    </Badge>
                    <Button size="sm">Renew</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          {expiredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="border-red-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {prescription.patientName} ({prescription.patientId})
                    </CardTitle>
                    <CardDescription>
                      Expired on {new Date(prescription.expiryDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Expired</Badge>
                    <Button size="sm">Renew</Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, Plus, Phone, Mail, MapPin, User, Users, Stethoscope, Building, Star, Edit, Trash2 } from "lucide-react"
import { PermissionGuard } from "@/components/auth/permission-guard"

interface Contact {
  id: string
  name: string
  type: "Patient" | "Doctor" | "Staff" | "Emergency" | "Vendor"
  phone: string
  email?: string
  address?: string
  department?: string
  specialty?: string
  notes?: string
  isFavorite?: boolean
  lastContact?: string
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "John Doe",
    type: "Patient",
    phone: "+1 (555) 123-4567",
    email: "john.doe@email.com",
    address: "123 Main St, City, State 12345",
    lastContact: "2024-01-15",
    isFavorite: true,
    notes: "Regular patient, prefers morning appointments",
  },
  {
    id: "2",
    name: "Dr. Sarah Smith",
    type: "Doctor",
    phone: "+1 (555) 234-5678",
    email: "dr.smith@hospital.com",
    department: "Cardiology",
    specialty: "Interventional Cardiology",
    isFavorite: true,
  },
  {
    id: "3",
    name: "Jane Wilson",
    type: "Staff",
    phone: "+1 (555) 345-6789",
    email: "jane.wilson@hospital.com",
    department: "Nursing",
    lastContact: "2024-01-14",
  },
  {
    id: "4",
    name: "Emergency Services",
    type: "Emergency",
    phone: "911",
    notes: "Primary emergency contact",
  },
  {
    id: "5",
    name: "Medical Supplies Inc",
    type: "Vendor",
    phone: "+1 (555) 456-7890",
    email: "orders@medsupplies.com",
    address: "456 Business Ave, City, State 12345",
    notes: "Primary medical supply vendor",
  },
  {
    id: "6",
    name: "Alice Johnson",
    type: "Patient",
    phone: "+1 (555) 567-8901",
    email: "alice.j@email.com",
    lastContact: "2024-01-13",
    notes: "Diabetic patient, requires special attention",
  },
  {
    id: "7",
    name: "Dr. Michael Brown",
    type: "Doctor",
    phone: "+1 (555) 678-9012",
    email: "dr.brown@hospital.com",
    department: "Orthopedics",
    specialty: "Sports Medicine",
  },
  {
    id: "8",
    name: "Lab Services",
    type: "Staff",
    phone: "+1 (555) 789-0123",
    email: "lab@hospital.com",
    department: "Laboratory",
    notes: "Internal lab extension",
  },
]

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Patient":
        return <User className="h-4 w-4 text-blue-600" />
      case "Doctor":
        return <Stethoscope className="h-4 w-4 text-green-600" />
      case "Staff":
        return <Users className="h-4 w-4 text-purple-600" />
      case "Emergency":
        return <Phone className="h-4 w-4 text-red-600" />
      case "Vendor":
        return <Building className="h-4 w-4 text-orange-600" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Patient":
        return "default"
      case "Doctor":
        return "outline"
      case "Staff":
        return "secondary"
      case "Emergency":
        return "destructive"
      case "Vendor":
        return "outline"
      default:
        return "secondary"
    }
  }

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      searchTerm === "" ||
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.department?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || contact.type === selectedType

    return matchesSearch && matchesType
  })

  const favoriteContacts = filteredContacts.filter((contact) => contact.isFavorite)
  const contactsByType = {
    Patient: filteredContacts.filter((c) => c.type === "Patient").length,
    Doctor: filteredContacts.filter((c) => c.type === "Doctor").length,
    Staff: filteredContacts.filter((c) => c.type === "Staff").length,
    Emergency: filteredContacts.filter((c) => c.type === "Emergency").length,
    Vendor: filteredContacts.filter((c) => c.type === "Vendor").length,
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PermissionGuard permission="canViewAllPatients">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">Phone Directory</h1>
              <p className="text-muted-foreground">Manage contacts for patients, staff, and vendors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          {Object.entries(contactsByType).map(([type, count]) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{type}s</CardTitle>
                {getTypeIcon(type)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="staff">Staff & Doctors</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Contacts</CardTitle>
                <CardDescription>{filteredContacts.length} contacts in directory</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {contact.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            <span className="font-medium">{contact.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(contact.type) as any} className="flex items-center gap-1 w-fit">
                            {getTypeIcon(contact.type)}
                            {contact.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {contact.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          {contact.email ? (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>{contact.department || contact.specialty || "-"}</TableCell>
                        <TableCell>{contact.lastContact || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
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
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Contacts</CardTitle>
                <CardDescription>{favoriteContacts.length} favorite contacts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {favoriteContacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(contact.type)}
                            <CardTitle className="text-lg">{contact.name}</CardTitle>
                          </div>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                        <Badge variant={getTypeColor(contact.type) as any} className="w-fit">
                          {contact.type}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {contact.phone}
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {contact.email}
                          </div>
                        )}
                        {contact.department && (
                          <div className="flex items-center gap-2 text-sm">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            {contact.department}
                          </div>
                        )}
                        {contact.address && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {contact.address}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Contacts</CardTitle>
                <CardDescription>
                  {filteredContacts.filter((c) => c.type === "Patient").length} patient contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts
                      .filter((c) => c.type === "Patient")
                      .map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>{contact.email || "-"}</TableCell>
                          <TableCell>{contact.address || "-"}</TableCell>
                          <TableCell>{contact.lastContact || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">{contact.notes || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
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

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff & Doctor Contacts</CardTitle>
                <CardDescription>
                  {filteredContacts.filter((c) => c.type === "Doctor" || c.type === "Staff").length} staff contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredContacts
                    .filter((c) => c.type === "Doctor" || c.type === "Staff")
                    .map((contact) => (
                      <Card key={contact.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(contact.type)}
                            <CardTitle className="text-lg">{contact.name}</CardTitle>
                            <Badge variant={getTypeColor(contact.type) as any}>{contact.type}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {contact.phone}
                          </div>
                          {contact.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {contact.email}
                            </div>
                          )}
                          {contact.department && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              {contact.department}
                            </div>
                          )}
                          {contact.specialty && (
                            <div className="text-sm text-muted-foreground">Specialty: {contact.specialty}</div>
                          )}
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" className="flex-1">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>Critical contact information for emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {filteredContacts
                    .filter((c) => c.type === "Emergency")
                    .map((contact) => (
                      <Card key={contact.id} className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Phone className="h-6 w-6 text-red-600" />
                              <div>
                                <h3 className="font-semibold text-lg">{contact.name}</h3>
                                <p className="text-2xl font-bold text-red-600">{contact.phone}</p>
                                {contact.notes && <p className="text-sm text-muted-foreground">{contact.notes}</p>}
                              </div>
                            </div>
                            <Button size="lg" className="bg-red-600 hover:bg-red-700">
                              <Phone className="h-5 w-5 mr-2" />
                              Call Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PermissionGuard>
    </div>
  )
}

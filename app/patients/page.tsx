"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  lastVisit: string
  status: "Active" | "Inactive" | "Critical"
  medicalRecord: string
}

const mockPatients: Patient[] = [
  {
    id: "P001",
    name: "John Smith",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    email: "john.smith@email.com",
    lastVisit: "2024-01-15",
    status: "Active",
    medicalRecord: "MR001",
  },
  {
    id: "P002",
    name: "Sarah Johnson",
    age: 32,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    email: "sarah.johnson@email.com",
    lastVisit: "2024-01-10",
    status: "Active",
    medicalRecord: "MR002",
  },
  {
    id: "P003",
    name: "Michael Brown",
    age: 67,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    email: "michael.brown@email.com",
    lastVisit: "2024-01-08",
    status: "Critical",
    medicalRecord: "MR003",
  },
  {
    id: "P004",
    name: "Emily Davis",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    email: "emily.davis@email.com",
    lastVisit: "2023-12-20",
    status: "Inactive",
    medicalRecord: "MR004",
  },
  {
    id: "P005",
    name: "Robert Wilson",
    age: 55,
    gender: "Male",
    phone: "+1 (555) 567-8901",
    email: "robert.wilson@email.com",
    lastVisit: "2024-01-12",
    status: "Active",
    medicalRecord: "MR005",
  },
]

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients] = useState<Patient[]>(mockPatients)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">Manage patient records and information</p>
        </div>
        <Link href="/patients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Directory</CardTitle>
          <CardDescription>Search and manage all patient records</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {patient.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {patient.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
    </div>
  )
}

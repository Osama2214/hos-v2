import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewPatientPage() {
  return (
    <PermissionGuard permission="canAddPatient">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patients
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold">Add New Patient</h1>
          <p className="text-muted-foreground">Create a new patient record</p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter the patient's basic information and contact details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="Enter age" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" placeholder="Enter phone number" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter full address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" placeholder="Emergency contact name and phone" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                placeholder="Enter relevant medical history, allergies, current medications..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" asChild>
                <Link href="/patients">Cancel</Link>
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Patient
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  )
}

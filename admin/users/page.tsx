import { PermissionGuard } from "@/components/auth/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Shield, Edit, Trash2 } from "lucide-react"
import { type User, ROLE_PERMISSIONS } from "@/lib/auth"

const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Admin",
    email: "admin@hospital.com",
    role: "admin",
    permissions: ROLE_PERMISSIONS.admin,
    isActive: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@hospital.com",
    role: "receptionist",
    permissions: ROLE_PERMISSIONS.receptionist,
    isActive: true,
  },
  {
    id: "3",
    name: "Dr. Smith",
    email: "smith@hospital.com",
    role: "doctor",
    permissions: ROLE_PERMISSIONS.doctor,
    isActive: true,
    department: "Cardiology",
  },
  {
    id: "4",
    name: "Lab Tech Mike",
    email: "mike@hospital.com",
    role: "lab",
    permissions: ROLE_PERMISSIONS.lab,
    isActive: false,
  },
]

export default function UsersPage() {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "doctor":
        return "default"
      case "receptionist":
        return "secondary"
      case "lab":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <PermissionGuard permission="canManageUsers">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground">Manage system users, roles, and permissions</p>
            </div>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
            <Card key={role}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">{role}s</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockUsers.filter((u) => u.role === role).length}</div>
                <p className="text-xs text-muted-foreground">{permissions.length} permissions</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>All registered users and their access levels</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleColor(user.role) as any} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{user.permissions.length} permissions</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
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
    </PermissionGuard>
  )
}

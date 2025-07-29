"use client"

import {
  Calendar,
  Users,
  FileText,
  Settings,
  Activity,
  UserCheck,
  Phone,
  TestTube,
  Pill,
  Shield,
  Bell,
  BarChart3,
  Database,
  LogOut,
  Stethoscope,
  UserPlus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/ui/sidebar"
import { useAuthStore } from "@/auth-store"
import { Button } from "@/ui/button"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Activity,
    roles: ["admin", "doctor", "nurse", "receptionist", "lab_tech"],
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
    roles: ["admin", "doctor", "nurse", "receptionist"],
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
    roles: ["admin", "doctor", "nurse", "receptionist"],
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
    roles: ["admin", "doctor", "nurse"],
  },
  {
    title: "Medical Records",
    url: "/medical-records",
    icon: FileText,
    roles: ["admin", "doctor", "nurse"],
  },
  {
    title: "Lab Results",
    url: "/lab-results",
    icon: TestTube,
    roles: ["admin", "doctor", "nurse", "lab_tech"],
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: Pill,
    roles: ["admin", "doctor", "nurse"],
  },
  {
    title: "Check-in",
    url: "/checkin",
    icon: UserCheck,
    roles: ["admin", "receptionist"],
  },
  {
    title: "Reception",
    url: "/reception",
    icon: Phone,
    roles: ["admin", "receptionist"],
  },
  {
    title: "Lab",
    url: "/lab",
    icon: TestTube,
    roles: ["admin", "lab_tech"],
  },
  {
    title: "Doctor Portal",
    url: "/doctor",
    icon: Stethoscope,
    roles: ["admin", "doctor"],
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Phone,
    roles: ["admin", "doctor", "nurse", "receptionist"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ["admin", "doctor"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    roles: ["admin", "doctor", "nurse", "receptionist", "lab_tech"],
  },
]

const adminItems = [
  {
    title: "Admin Dashboard",
    url: "/admin",
    icon: Shield,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: UserPlus,
  },
  {
    title: "System Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Audit Logs",
    url: "/admin/logs",
    icon: FileText,
  },
  {
    title: "Backup & Restore",
    url: "/admin/backup",
    icon: Database,
  },
]

export function AppSidebar() {
  const { user, logout } = useAuthStore()

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(user?.role || ""))

  const showAdminSection = user?.role === "admin"

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h2 className="text-lg font-semibold">Healthcare RBAC</h2>
          <p className="text-sm text-muted-foreground">
            {user?.name} ({user?.role})
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdminSection && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

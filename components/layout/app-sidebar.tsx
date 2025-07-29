"use client"

import type React from "react"

import {
  Calendar,
  Home,
  Settings,
  Users,
  UserPlus,
  TestTube,
  BarChart3,
  Shield,
  Database,
  Bell,
  Activity,
  ClipboardList,
  FileText,
  Upload,
  UserCheck,
  Phone,
  Clock,
  Beaker,
  FlaskConical,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { User, Permission } from "@/lib/auth"

interface NavigationItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  permissions: Permission[]
  badge?: string
}

// Admin navigation with proper grouping
const adminDashboard: NavigationItem[] = [
  {
    title: "Admin Dashboard",
    url: "/admin",
    icon: Home,
    permissions: ["canAccessAdminPanel"],
  },
]

const adminAdministration: NavigationItem[] = [
  {
    title: "User Management",
    url: "/admin/users",
    icon: Shield,
    permissions: ["canManageUsers"],
  },
  {
    title: "System Settings",
    url: "/admin/settings",
    icon: Settings,
    permissions: ["canAccessAdminPanel"],
  },
  {
    title: "Backup & Restore",
    url: "/admin/backup",
    icon: Database,
    permissions: ["canManageBackups"],
  },
  {
    title: "Audit Logs",
    url: "/admin/logs",
    icon: Activity,
    permissions: ["canViewAuditLogs"],
  },
]

const adminPatientManagement: NavigationItem[] = [
  {
    title: "All Patients",
    url: "/patients",
    icon: Users,
    permissions: ["canViewAllPatients"],
  },
  {
    title: "Lab Requests",
    url: "/lab",
    icon: TestTube,
    permissions: ["canAccessLabSection"],
  },
]

const adminInsights: NavigationItem[] = [
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    permissions: ["canExportReports"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    permissions: [],
    badge: "3",
  },
]

// Other role navigation items
const doctorNavigation: NavigationItem[] = [
  {
    title: "Doctor Dashboard",
    url: "/doctor",
    icon: Home,
    permissions: [],
  },
  {
    title: "My Patients",
    url: "/patients",
    icon: Users,
    permissions: ["canViewAllPatients"],
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
    permissions: ["canAddAppointment"],
  },
  {
    title: "Medical Records",
    url: "/medical-records",
    icon: ClipboardList,
    permissions: ["canEditPatient"],
  },
  {
    title: "Lab Results",
    url: "/lab-results",
    icon: TestTube,
    permissions: ["canAccessLabSection"],
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: FileText,
    permissions: ["canEditPatient"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    permissions: ["canExportReports"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    permissions: [],
    badge: "2",
  },
]

const receptionistNavigation: NavigationItem[] = [
  {
    title: "Reception Dashboard",
    url: "/reception",
    icon: Home,
    permissions: [],
  },
  {
    title: "Patient Check-in",
    url: "/checkin",
    icon: UserCheck,
    permissions: ["canAddPatient"],
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
    permissions: ["canAddAppointment"],
  },
  {
    title: "Add Patient",
    url: "/patients/new",
    icon: UserPlus,
    permissions: ["canAddPatient"],
  },
  {
    title: "Patient Directory",
    url: "/patients",
    icon: Users,
    permissions: ["canViewAllPatients"],
  },
  {
    title: "Phone Directory",
    url: "/contacts",
    icon: Phone,
    permissions: [],
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Clock,
    permissions: ["canAddAppointment"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    permissions: ["canExportReports"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    permissions: [],
    badge: "5",
  },
]

const labNavigation: NavigationItem[] = [
  {
    title: "Lab Dashboard",
    url: "/lab",
    icon: Home,
    permissions: ["canAccessLabSection"],
  },
  {
    title: "Pending Tests",
    url: "/lab/pending",
    icon: Clock,
    permissions: ["canAccessLabSection"],
  },
  {
    title: "Test Results",
    url: "/lab/results",
    icon: Beaker,
    permissions: ["canUploadLabResults"],
  },
  {
    title: "Sample Tracking",
    url: "/lab/samples",
    icon: FlaskConical,
    permissions: ["canAccessLabSection"],
  },
  {
    title: "Upload Results",
    url: "/lab/upload",
    icon: Upload,
    permissions: ["canUploadLabResults"],
  },
  {
    title: "Pricing",
    url: "/lab/pricing",
    icon: DollarSign,
    permissions: ["canSetLabPrices"],
  },
  {
    title: "Lab Reports",
    url: "/reports",
    icon: BarChart3,
    permissions: ["canExportReports"],
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
    permissions: [],
    badge: "1",
  },
]

interface AppSidebarProps {
  user: User | null
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()

  const hasPermission = (permissions: Permission[]) => {
    if (!user || permissions.length === 0) return true
    return permissions.some((permission) => user.permissions.includes(permission))
  }

  const renderNavigationGroup = (title: string, items: NavigationItem[]) => {
    const filteredItems = items.filter((item) => hasPermission(item.permissions))

    if (filteredItems.length === 0) return null

    return (
      <SidebarGroup key={title}>
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  // Get role-specific branding
  const getRoleBranding = () => {
    if (!user) return { title: "HealthCare RBAC", subtitle: "Management System" }

    switch (user.role) {
      case "admin":
        return { title: "Admin Portal", subtitle: "System Management" }
      case "doctor":
        return { title: "Doctor Portal", subtitle: "Patient Care" }
      case "receptionist":
        return { title: "Reception Portal", subtitle: "Patient Services" }
      case "lab":
        return { title: "Lab Portal", subtitle: "Test Management" }
      default:
        return { title: "HealthCare RBAC", subtitle: "Management System" }
    }
  }

  const branding = getRoleBranding()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{branding.title}</span>
            <span className="truncate text-xs text-muted-foreground">{branding.subtitle}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {user?.role === "admin" ? (
          <>
            {renderNavigationGroup("Dashboard", adminDashboard)}
            {renderNavigationGroup("Administration", adminAdministration)}
            {renderNavigationGroup("Patient Management", adminPatientManagement)}
            {renderNavigationGroup("Insights & Monitoring", adminInsights)}
          </>
        ) : user?.role === "doctor" ? (
          renderNavigationGroup("Medical Tools", doctorNavigation)
        ) : user?.role === "receptionist" ? (
          renderNavigationGroup("Patient Services", receptionistNavigation)
        ) : user?.role === "lab" ? (
          renderNavigationGroup("Laboratory", labNavigation)
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs capitalize">
                    {user.role} {user.department && `• ${user.department}`}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

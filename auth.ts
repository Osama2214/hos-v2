import { cache } from "react"

export type Permission =
  | "canAddPatient"
  | "canEditPatient"
  | "canDeletePatient"
  | "canViewAllPatients"
  | "canAddAppointment"
  | "canEditSchedule"
  | "canExportReports"
  | "canAccessLabSection"
  | "canSetLabPrices"
  | "canUploadLabResults"
  | "canManageUsers"
  | "canAccessAdminPanel"
  | "canToggleTestMode"
  | "canManageBackups"
  | "canViewAuditLogs"

export type Role = "admin" | "receptionist" | "doctor" | "lab"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  permissions: Permission[]
  isActive: boolean
  department?: string
}

// Role-based permission templates
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "canAddPatient",
    "canEditPatient",
    "canDeletePatient",
    "canViewAllPatients",
    "canAddAppointment",
    "canEditSchedule",
    "canExportReports",
    "canAccessLabSection",
    "canSetLabPrices",
    "canUploadLabResults",
    "canManageUsers",
    "canAccessAdminPanel",
    "canToggleTestMode",
    "canManageBackups",
    "canViewAuditLogs",
  ],
  receptionist: [
    "canAddPatient",
    "canEditPatient",
    "canViewAllPatients",
    "canAddAppointment",
    "canEditSchedule",
    "canExportReports",
  ],
  doctor: [
    "canViewAllPatients",
    "canEditPatient",
    "canAccessLabSection",
    "canExportReports",
    "canAddAppointment",
    "canEditSchedule",
  ],
  lab: ["canAccessLabSection", "canSetLabPrices", "canUploadLabResults", "canExportReports", "canViewAllPatients"],
}

// Get current user from client-side store
export const getCurrentUser = cache(async (): Promise<User | null> => {
  // This will be handled by the client-side auth store
  return null
})

export const getAuthenticatedUser = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("healthcare-auth-storage")
    if (!stored) return null

    const parsed = JSON.parse(stored)
    return parsed.state?.isAuthenticated ? parsed.state.user : null
  } catch {
    return null
  }
}

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user || !user.isActive) return false
  return user.permissions.includes(permission)
}

export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user || !user.isActive) return false
  return permissions.some((permission) => user.permissions.includes(permission))
}

export const hasRole = (user: User | null, role: Role): boolean => {
  if (!user || !user.isActive) return false
  return user.role === role
}

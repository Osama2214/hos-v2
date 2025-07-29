export type Role = "admin" | "doctor" | "receptionist" | "lab"

export type Permission =
  | "canAccessAdminPanel"
  | "canManageUsers"
  | "canManageBackups"
  | "canViewAuditLogs"
  | "canViewAllPatients"
  | "canEditPatient"
  | "canAddPatient"
  | "canDeletePatient"
  | "canAddAppointment"
  | "canEditAppointment"
  | "canDeleteAppointment"
  | "canAccessLabSection"
  | "canUploadLabResults"
  | "canSetLabPrices"
  | "canExportReports"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department?: string
  permissions: Permission[]
}

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "canAccessAdminPanel",
    "canManageUsers",
    "canManageBackups",
    "canViewAuditLogs",
    "canViewAllPatients",
    "canEditPatient",
    "canAddPatient",
    "canDeletePatient",
    "canAddAppointment",
    "canEditAppointment",
    "canDeleteAppointment",
    "canAccessLabSection",
    "canUploadLabResults",
    "canSetLabPrices",
    "canExportReports",
  ],
  doctor: [
    "canViewAllPatients",
    "canEditPatient",
    "canAddPatient",
    "canAddAppointment",
    "canEditAppointment",
    "canAccessLabSection",
    "canExportReports",
  ],
  receptionist: [
    "canViewAllPatients",
    "canAddPatient",
    "canEditPatient",
    "canAddAppointment",
    "canEditAppointment",
    "canExportReports",
  ],
  lab: ["canAccessLabSection", "canUploadLabResults", "canSetLabPrices", "canViewAllPatients", "canExportReports"],
}

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  return user.permissions.includes(permission)
}

export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  return permissions.some((permission) => user.permissions.includes(permission))
}

export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  return permissions.every((permission) => user.permissions.includes(permission))
}

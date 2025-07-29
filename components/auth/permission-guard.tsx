"use client"

import type React from "react"
import { useAuthStore } from "@/lib/auth-store"
import type { Permission } from "@/lib/auth"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  fallback?: React.ReactNode
  requireAll?: boolean // If true, user must have ALL permissions. If false, user needs ANY permission
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  fallback = null,
  requireAll = false,
}: PermissionGuardProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <>{fallback}</>
  }

  // Handle single permission
  if (permission) {
    if (!user.permissions.includes(permission)) {
      return <>{fallback}</>
    }
    return <>{children}</>
  }

  // Handle multiple permissions
  if (permissions.length > 0) {
    const hasPermission = requireAll
      ? permissions.every((perm) => user.permissions.includes(perm))
      : permissions.some((perm) => user.permissions.includes(perm))

    if (!hasPermission) {
      return <>{fallback}</>
    }
  }

  return <>{children}</>
}

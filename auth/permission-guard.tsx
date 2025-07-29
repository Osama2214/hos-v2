"use client"

import type React from "react"
import { useAuthStore } from "@/lib/auth-store"
import { hasPermission, hasAnyPermission, type Permission } from "@/lib/auth"

interface PermissionGuardProps {
  children: React.ReactNode
  permission?: Permission
  permissions?: Permission[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  fallback = <div className="p-4 text-center text-muted-foreground">Access denied</div>,
}: PermissionGuardProps) {
  const { user, isAuthenticated, isInitialized, isHydrated } = useAuthStore()

  // Show loading while initializing
  if (!isInitialized || !isHydrated) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-2">Loading...</p>
      </div>
    )
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return <>{fallback}</>
  }

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(user, permission)
  } else if (permissions.length > 0) {
    hasAccess = hasAnyPermission(user, permissions)
  } else {
    // If no specific permissions required, just check if user is authenticated
    hasAccess = true
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

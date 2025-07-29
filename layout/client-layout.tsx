"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useAuthStore } from "@/lib/auth-store"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, hasHydrated, setHasHydrated, initialize } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)

  // Handle hydration
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("Starting auth initialization")

      // Wait for hydration
      if (!hasHydrated) {
        setHasHydrated(true)
      }

      // Initialize store
      initialize()

      // Small delay to ensure everything is ready
      await new Promise((resolve) => setTimeout(resolve, 100))

      console.log("Auth initialization complete", { hasHydrated, isAuthenticated, user: user?.role })
      setIsLoading(false)
    }

    initializeAuth()
  }, [hasHydrated, setHasHydrated, initialize])

  // Handle route protection - only after hydration is complete
  useEffect(() => {
    if (isLoading || !hasHydrated) {
      console.log("Waiting for hydration before route protection")
      return
    }

    console.log("Route protection check:", {
      pathname,
      isAuthenticated,
      userRole: user?.role,
      hasHydrated,
    })

    // Handle unauthenticated users
    if (!isAuthenticated && pathname !== "/login") {
      console.log("Redirecting to login - user not authenticated")
      router.replace("/login")
      return
    }

    // Handle authenticated users on login page
    if (isAuthenticated && user && pathname === "/login") {
      const roleRedirects = {
        admin: "/admin",
        doctor: "/doctor",
        receptionist: "/reception",
        lab: "/lab",
      }
      const redirectTo = roleRedirects[user.role] || "/"
      console.log("Redirecting authenticated user from login to:", redirectTo)
      router.replace(redirectTo)
      return
    }

    // For authenticated users, check access permissions
    if (isAuthenticated && user) {
      // Define role-specific restricted pages (pages that ONLY specific roles can access)
      const roleRestrictedPages = {
        admin: ["/admin"], // Only admin pages are restricted to admin
        doctor: ["/doctor"], // Only doctor-specific pages are restricted to doctor
        receptionist: ["/reception"], // Only reception-specific pages are restricted to receptionist
        lab: ["/lab"], // Only lab-specific pages are restricted to lab
      }

      // Shared pages that all authenticated users can access
      const sharedPages = [
        "/",
        "/patients",
        "/appointments",
        "/reports",
        "/notifications",
        "/checkin",
        "/contacts",
        "/schedule",
      ]

      // Check if user is trying to access a role-restricted page they don't have access to
      const isAccessingRestrictedPage = Object.entries(roleRestrictedPages).some(([role, pages]) => {
        if (role === user.role) return false // User can access their own role pages
        return pages.some((page) => pathname.startsWith(page))
      })

      // Check if user is on a shared page or their own role page
      const isOnSharedPage = sharedPages.some((page) => pathname === page || pathname.startsWith(page))
      const isOnOwnRolePage = roleRestrictedPages[user.role]?.some((page) => pathname.startsWith(page))

      console.log("Access check:", {
        pathname,
        userRole: user.role,
        isAccessingRestrictedPage,
        isOnSharedPage,
        isOnOwnRolePage,
      })

      // If user is accessing a restricted page they don't have access to, redirect to their default page
      if (isAccessingRestrictedPage) {
        const defaultRolePage = roleRestrictedPages[user.role]?.[0] || "/"
        console.log("Redirecting from restricted page to:", defaultRolePage)
        router.replace(defaultRolePage)
        return
      }

      // If user is not on a shared page or their own role page, redirect to their default page
      if (!isOnSharedPage && !isOnOwnRolePage) {
        const defaultRolePage = roleRestrictedPages[user.role]?.[0] || "/"
        console.log("Redirecting to default role page:", defaultRolePage)
        router.replace(defaultRolePage)
        return
      }
    }
  }, [isLoading, hasHydrated, isAuthenticated, user, pathname, router])

  // Show loading state during initialization
  if (isLoading || !hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page without sidebar
  if (pathname === "/login") {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // Show main app with sidebar for authenticated users
  if (isAuthenticated && user) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar user={user} />
          <main className="flex-1 overflow-auto">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 flex h-14 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-200"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {children}
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    )
  }

  // Fallback - show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useAuthStore } from "@/lib/auth-store"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, initializeAuth, isInitialized, isHydrated } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Initialize auth on mount
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    // Only redirect after hydration is complete
    if (isInitialized && isHydrated) {
      if (!isAuthenticated && pathname !== "/login") {
        router.push("/login")
      }
    }
  }, [isAuthenticated, pathname, router, isInitialized, isHydrated])

  // Show login page immediately if on login route
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Show loading only if not hydrated yet
  if (!isHydrated || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If not authenticated after hydration, let the redirect happen
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
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
      </SidebarInset>
    </SidebarProvider>
  )
}

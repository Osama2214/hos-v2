"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/auth"
import { rolePermissions } from "@/lib/auth"

interface LoginAttempt {
  id: string
  username: string
  ipAddress: string
  timestamp: string
  result: "success" | "failure"
  reason?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isMaintenanceMode: boolean
  loginAttempts: LoginAttempt[]
  isInitialized: boolean
  isHydrated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  setMaintenanceMode: (enabled: boolean) => void
  addLoginAttempt: (attempt: Omit<LoginAttempt, "id">) => void
  initializeAuth: () => void
  resetStore: () => void
}

// Mock users for demo
const mockUsers: Array<User & { password: string }> = [
  {
    id: "1",
    name: "Dr. Admin",
    email: "admin@hospital.com",
    password: "admin123",
    role: "admin",
    department: "Administration",
    permissions: rolePermissions.admin,
  },
  {
    id: "2",
    name: "Dr. Smith",
    email: "doctor@hospital.com",
    password: "doctor123",
    role: "doctor",
    department: "Cardiology",
    permissions: rolePermissions.doctor,
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "receptionist@hospital.com",
    password: "reception123",
    role: "receptionist",
    department: "Front Desk",
    permissions: rolePermissions.receptionist,
  },
  {
    id: "4",
    name: "Lab Tech Mike",
    email: "lab@hospital.com",
    password: "lab123",
    role: "lab",
    department: "Laboratory",
    permissions: rolePermissions.lab,
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isMaintenanceMode: false,
      loginAttempts: [],
      isInitialized: false,
      isHydrated: false,

      initializeAuth: () => {
        // Mark as initialized immediately
        set({ isInitialized: true, isHydrated: true })
      },

      login: async (email: string, password: string) => {
        const state = get()

        // Check maintenance mode
        if (state.isMaintenanceMode) {
          const attempt = {
            username: email,
            ipAddress: "127.0.0.1",
            timestamp: new Date().toISOString(),
            result: "failure" as const,
            reason: "System in maintenance mode",
          }
          state.addLoginAttempt(attempt)
          return { success: false, error: "System is currently in maintenance mode" }
        }

        // Find user
        const user = mockUsers.find((u) => u.email === email && u.password === password)

        const attempt = {
          username: email,
          ipAddress: "127.0.0.1",
          timestamp: new Date().toISOString(),
          result: user ? ("success" as const) : ("failure" as const),
          reason: user ? undefined : "Invalid credentials",
        }

        state.addLoginAttempt(attempt)

        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isInitialized: true,
            isHydrated: true,
          })
          return { success: true }
        }

        return { success: false, error: "Invalid email or password" }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: true,
          isHydrated: true,
        })
      },

      setMaintenanceMode: (enabled: boolean) => {
        set({ isMaintenanceMode: enabled })
      },

      addLoginAttempt: (attempt) => {
        set((state) => ({
          loginAttempts: [
            { ...attempt, id: Date.now().toString() },
            ...state.loginAttempts.slice(0, 49), // Keep last 50 attempts
          ],
        }))
      },

      resetStore: () => {
        set({
          user: null,
          isAuthenticated: false,
          isMaintenanceMode: false,
          loginAttempts: [],
          isInitialized: true,
          isHydrated: true,
        })
      },
    }),
    {
      name: "healthcare-auth-storage",
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated when rehydration is complete
        if (state) {
          state.isHydrated = true
          state.isInitialized = true
        }
      },
    },
  ),
)

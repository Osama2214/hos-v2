import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "doctor" | "nurse" | "receptionist" | "lab_tech"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: string[]
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  initialize: () => void
}

// Mock users for demonstration
const mockUsers: Record<string, { password: string; user: User }> = {
  "admin@hospital.com": {
    password: "admin123",
    user: {
      id: "1",
      name: "Dr. Admin",
      email: "admin@hospital.com",
      role: "admin",
      permissions: ["*"],
    },
  },
  "doctor@hospital.com": {
    password: "doctor123",
    user: {
      id: "2",
      name: "Dr. Smith",
      email: "doctor@hospital.com",
      role: "doctor",
      permissions: [
        "patients:read",
        "patients:write",
        "appointments:read",
        "appointments:write",
        "medical_records:read",
        "medical_records:write",
        "prescriptions:read",
        "prescriptions:write",
        "lab_results:read",
      ],
    },
  },
  "nurse@hospital.com": {
    password: "nurse123",
    user: {
      id: "3",
      name: "Nurse Johnson",
      email: "nurse@hospital.com",
      role: "nurse",
      permissions: [
        "patients:read",
        "patients:write",
        "appointments:read",
        "medical_records:read",
        "medical_records:write",
        "lab_results:read",
        "prescriptions:read",
      ],
    },
  },
  "receptionist@hospital.com": {
    password: "reception123",
    user: {
      id: "4",
      name: "Mary Reception",
      email: "receptionist@hospital.com",
      role: "receptionist",
      permissions: [
        "patients:read",
        "patients:write",
        "appointments:read",
        "appointments:write",
        "checkin:read",
        "checkin:write",
      ],
    },
  },
  "lab@hospital.com": {
    password: "lab123",
    user: {
      id: "5",
      name: "Lab Technician",
      email: "lab@hospital.com",
      role: "lab_tech",
      permissions: ["lab_results:read", "lab_results:write", "patients:read"],
    },
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const mockUser = mockUsers[email]
        if (mockUser && mockUser.password === password) {
          set({
            user: mockUser.user,
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },
      initialize: () => {
        const state = get()
        if (state.user) {
          set({ isAuthenticated: true })
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)

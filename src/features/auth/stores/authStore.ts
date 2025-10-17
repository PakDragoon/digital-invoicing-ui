import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { logout } from "@/features/auth/services/authApi"
import { QueryClient } from "@tanstack/react-query"
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore"

export type AuthUser = {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName?: string
  role: string
  roleId: string
  status: string
  isAdmin: boolean
  companyId: string
  cometchatUid?: string
  cometchat?: {
    appId: string
    authKey: string
    region: string
  }
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  hasHydrated: boolean // ✅ Add this here
  setUser: (user: Partial<AuthUser>) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false, // ✅ Add default
     
  setUser: (updatedFields) =>
  set((state) =>
    ({
      user: {
        ...(state.user ?? {}),
        ...updatedFields,
      },
    } as Partial<AuthState>) 
  ),

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: async (queryClient: QueryClient) => {
        useViewingEmployeeStore.getState().clearViewingEmployee()
        const { user } = get()
        if (user) {
          const companyId: string = user!.companyId!.toString()
          await logout(user.role, companyId)
        }

        queryClient.clear()
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        set({ user: null, accessToken: null, refreshToken: null })
      },
      setHasHydrated: (value) => set({ hasHydrated: value }), // ✅ Valid now
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)

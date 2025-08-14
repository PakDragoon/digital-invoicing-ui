import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface IEmployeeDashboardStore {
  viewingEmployee: { id: string; role: string; name: string } | null
  isViewingOtherDashboard: boolean
  setViewingEmployee: (employee: { id: string; role: string; name: string } | null) => void
  clearViewingEmployee: () => void
}

export const useViewingEmployeeStore = create<IEmployeeDashboardStore>()(
  persist(
    (set) => ({
      viewingEmployee: null,
      isViewingOtherDashboard: false,

      setViewingEmployee: (employee) =>
        set({ viewingEmployee: employee, isViewingOtherDashboard: !!employee }),

      clearViewingEmployee: () => set({ viewingEmployee: null, isViewingOtherDashboard: false }),
    }),
    {
      name: "viewing-employee-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)

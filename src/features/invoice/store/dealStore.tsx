import { create } from "zustand"

interface DealStore {
  createdDealId: string | null| undefined
  setCreatedDealId: (id: string | null) => void
  showRotation: boolean
  isReassign: boolean
  DisplayRotation: () => void
  HideRotation: () => void
  toggleReassign: (value: boolean) => void
}

export const useDealStore = create<DealStore>((set) => ({
  createdDealId: null,
  setCreatedDealId: (id) => set({ createdDealId: id }),
  showRotation: false,
  isReassign: false,
  DisplayRotation: () => set({ showRotation: true }),
  HideRotation: () => set({ showRotation: false }),
  toggleReassign: (value: boolean) => set({ isReassign: value }),
}))

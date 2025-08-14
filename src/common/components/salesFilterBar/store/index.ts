import { create } from "zustand"
import { SalesTypeOption, SalesTypes } from "@/common/components/salesFilterBar/types"

interface ISalesTypeStore {
  selectedSalesType: SalesTypeOption
  setSelectedSalesType: (value: SalesTypeOption) => void
}

export const useSalesTypeStore = create<ISalesTypeStore>((set) => ({
  selectedSalesType: SalesTypes[0],
  setSelectedSalesType: (value: SalesTypeOption) => set({ selectedSalesType: value }),
}))

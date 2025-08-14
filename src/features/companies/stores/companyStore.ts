import { create } from "zustand"
import { Company } from "../../../core/entities/company"

interface CompanyState {
  companies: Company[]
  setCompanies: (companies: Company[]) => void
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  setCompanies: (companies) => set({ companies }),
}))

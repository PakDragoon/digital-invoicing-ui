import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../../../core/config/api"
import { Company } from "../../../core/entities/company"

const fetchCompanies = async (): Promise<Company[]> => {
  const { data } = await api.get("/companies")
  return data
}

export const useCompanies = () => useQuery({ queryKey: ["companies"], queryFn: fetchCompanies })

export const useAddCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (company: Company) => {
      const { data } = await api.post("/companies", company)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] })
    },
  })
}

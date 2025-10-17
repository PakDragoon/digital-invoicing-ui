import api from "@/core/config/api"
import { useQuery } from "@tanstack/react-query"

export interface Customer {

    id: number
    firstName: string
    lastName: string
    phone: string
    personaVerificationId: string
  
}

const fetchCustomers = async (companyId: string | number): Promise<Customer[]> => {
  const response = await api.get(`/customer?companyId=${companyId}`)
  return response.data.data as Customer[]
}

export const useCustomers = (companyId: string | number, enabled = true) => {
  return useQuery<Customer[]>({
    queryKey: ["customers", companyId],
    queryFn: () => fetchCustomers(companyId),
    enabled: !!companyId && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

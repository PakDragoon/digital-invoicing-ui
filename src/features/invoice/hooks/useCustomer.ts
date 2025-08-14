import api from "@/core/config/api"
import { useQuery } from "@tanstack/react-query"

export interface Customer {

    id: number
    firstName: string
    lastName: string
    phone: string
    personaVerificationId: string
  
}

const fetchCustomers = async (dealershipId: string | number): Promise<Customer[]> => {
  const response = await api.get(`/customer?dealershipId=${dealershipId}`)
  return response.data.data as Customer[]
}

export const useCustomers = (dealershipId: string | number, enabled = true) => {
  return useQuery<Customer[]>({
    queryKey: ["customers", dealershipId],
    queryFn: () => fetchCustomers(dealershipId),
    enabled: !!dealershipId && enabled,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

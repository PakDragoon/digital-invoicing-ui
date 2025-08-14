import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getEmployee } from "@/features/auth/services/authApi"
import { IEmployee } from "@/core/entities/user"
import api from "@/core/config/api"


export const getAdmin = async (id: string) => {
  try {
    const response = await api.get(`/admin`, { params: { id } })
    return response.data.data
  } catch (error) {
    console.error("Error fetching employee data:", error)
    throw error
  }
}


export const useEmployee = (
  id: string,
  dealershipId: string,
  role: string
): UseQueryResult<IEmployee | null, unknown> => {
  const shouldFetch = !!id  || !!dealershipId

  return useQuery<IEmployee | null>({
    queryKey: ["getUser", id, dealershipId, role],
    queryFn: () =>
      role === "Admin"
        ? getAdmin(id)
        : getEmployee(id, dealershipId),
    enabled: shouldFetch,
    retry: false,
  })
}



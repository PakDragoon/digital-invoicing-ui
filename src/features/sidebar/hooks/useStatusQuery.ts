import { useQuery } from "@tanstack/react-query"
import api from "@/core/config/api"
import { useAuthStore } from "@/features/auth/stores/authStore"

export interface Status {
  id: string
  companyId: string | null
  dealershipId: string | null
  statusName: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface StatusResponse {
  success: boolean
  message: string
  data: Status[]
}

export const useStatusQuery = () => {
  const { user } = useAuthStore.getState()
  const roleId = user?.roleId
  const companyId = user?.companyId
  const dealershipId = user?.dealershipId

  return useQuery<StatusResponse>({
    queryKey: ["statuses"],
    queryFn: async () => {
      const response = await api.get<StatusResponse>(
        `/status/status?dealershipId=${dealershipId}&companyId=${companyId}&roleId=${roleId}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000, // optional: 5 minutes
  })
}

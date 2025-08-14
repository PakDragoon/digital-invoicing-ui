import { useMutation } from "@tanstack/react-query"
import api from "@/core/config/api"

interface UpdateStatusPayload {
  statusId: number
  dealershipId: string
}

export const useUpdateStatus = () => {
  return useMutation({
    mutationFn: async ({
      employeeId,
      payload,
    }: {
      employeeId: number | string
      payload: UpdateStatusPayload
    }) => {
      const response = await api.patch(`/employee/update-status/${employeeId}`, payload)
      return response.data
    },
  })
}

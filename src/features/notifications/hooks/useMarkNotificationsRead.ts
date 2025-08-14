import { useMutation, UseMutationResult } from "@tanstack/react-query"
import api from "@/core/config/api"

interface MarkReadPayload {
  notificationIds: number[]
  dealershipId: string
}

interface MarkReadResponse {
  message: string
  success: boolean
}

const markNotificationsRead = async (payload: MarkReadPayload): Promise<MarkReadResponse> => {
  const response = await api.patch<MarkReadResponse>("/notifications/mark-read", payload)
  return response.data
}

export const useMarkNotificationsRead = (): UseMutationResult<
  MarkReadResponse,
  Error,
  MarkReadPayload
> => {
  return useMutation({
    mutationFn: markNotificationsRead,
    onError: (error) => {
      console.error("Error marking notifications as read:", error)
    },
  })
}

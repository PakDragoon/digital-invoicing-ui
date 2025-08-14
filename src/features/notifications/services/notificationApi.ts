import api from "@/core/config/api"
import { BackendNotification, useNotificationStore } from "../store/notificationStore"

export const notificationApi = {
  getAllNotifications: async (
    dealershipId: number = 1,
    search: string | null = null
  ): Promise<{ data: BackendNotification[] }> => {
    const { pagination } = useNotificationStore.getState()

    const params: any = {
      limit: pagination.limit,
      skip: pagination.skip,
      dealershipId,
    }

    if (search) {
      params.search = search
    }

    const response = await api.get("/notifications/employee", { params })
    return response.data
  },
}

export const unreadNotificationApi = {
  getAllUnReadNotifications: async (): Promise<{ data: BackendNotification[] }> => {
    const response = await api.get("/notifications/get-unread")
    return response.data
  },
}

export const makeReadyApi = {
  getMakeReadyById: async (id: string, dealershipId: string): Promise<{ data: any }> => {
    const response = await api.get(`/make-ready/${id}?dealershipId=${dealershipId}`)
    return response.data
  },
}

export const customerVisitApi = {
  getVisitById: async (id: string, dealershipId: string): Promise<{ data: any }> => {
    const response = await api.get(
      `/customer-visit/getVisitById/${id}?dealershipId=${dealershipId}`
    )
    return response.data
  },
}

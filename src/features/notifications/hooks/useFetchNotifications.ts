import { useQuery } from "@tanstack/react-query"
import { notificationApi, unreadNotificationApi } from "../services/notificationApi"
import { transformBackendNotification, useNotificationStore } from "../store/notificationStore"
import { useAuthStore } from "@/features/auth/stores/authStore"

export const useFetchNotifications = () => {
  const { user } = useAuthStore.getState()
  const { tab } = useNotificationStore()

  return useQuery({
    queryKey: ["notifications", tab],
    queryFn: async () => {
      const { data } = await notificationApi.getAllNotifications(Number(user?.dealershipId), tab)
      const { data: unread } = await unreadNotificationApi.getAllUnReadNotifications()

      const notifications = data?.data
      const pagination = data?.pagination

      const transformed = notifications.map(transformBackendNotification)

      useNotificationStore.getState().setNotifications(transformed)
      useNotificationStore.getState().setPagination(pagination)
      useNotificationStore
        .getState()
        .setUnreadNotifications(unread.map(transformBackendNotification))

      return transformed
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  })
}

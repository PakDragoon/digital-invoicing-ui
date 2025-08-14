import { useNavigate } from "@tanstack/react-router"
import { ROUTES } from "@/common/routes"
import { useMarkNotificationsRead } from "../hooks/useMarkNotificationsRead"
import { useNotificationStore } from "@/features/notifications/store/notificationStore"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/features/auth/stores/authStore"
import {
  customerActionTypes,
  dealActionTypes,
  makeReadyActionTypes,
} from "@/features/notifications/constants/notificationTypes"

export const useNotificationActions = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { user } = useAuthStore.getState()
  const dealershipId = user?.dealershipId

  const { unreadNotifications, setUnreadNotifications } = useNotificationStore()
  const { mutate: markRead } = useMarkNotificationsRead()

  const getPageType = (actionType: string): "deal" | "make-ready" | "customer" | "unknown" => {
    if (dealActionTypes.includes(actionType)) return "deal"
    if (makeReadyActionTypes.includes(actionType)) return "make-ready"
    if (customerActionTypes.includes(actionType)) return "customer"
    return "unknown"
  }

  const handleMarkRead = (id: number, onSuccessCallback?: () => void) => {
    markRead(
      {
        notificationIds: [id],
        dealershipId: String(dealershipId),
      },
      {
        onSuccess: () => {
          const updated = unreadNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          setUnreadNotifications(updated)
          queryClient.invalidateQueries({ queryKey: ["notifications"] })

          if (onSuccessCallback) onSuccessCallback()
        },
      }
    )
  }

  const handleNotificationClick = (
    notificationId: number,
    targetId: number,
    actionType: string,
    onModalOpen: (data: { id: number; type: "make-ready" | "customer" }) => void
  ) => {
    handleMarkRead(notificationId, () => {
      const pageType = getPageType(actionType)

      switch (pageType) {
        case "deal":
          navigate({ to: ROUTES.NOTIFICATION_DEAL_DETAIL, params: { id: targetId } })
          break
        case "make-ready":
        case "customer":
          onModalOpen({ id: targetId, type: pageType })
          break
        default:
          break
      }
    })
  }

  return { handleNotificationClick }
}

import React from "react"
import { useNotificationActions } from "../services/useNotificationActions"
import { CustomButton } from "@/common/components"

interface NotificationTableActionProps {
  notification: {
    id: number
    entityId: number
    notificationType: string
  }
  onModalOpen: (data: { id: number; type: "make-ready" | "customer" }) => void
}

const NotificationTableAction: React.FC<NotificationTableActionProps> = ({
  notification,
  onModalOpen,
}) => {
  const { handleNotificationClick } = useNotificationActions()

  return (
    <CustomButton
      text="View"
      variant="outlined"
      onClick={() =>
        handleNotificationClick(
          notification.id,
          notification.entityId,
          notification.notificationType,
          onModalOpen
        )
      }
      width="min-w-[5rem]"
    />
  )
}

export default NotificationTableAction

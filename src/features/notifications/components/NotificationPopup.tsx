import colors from "@/common/constants/tailwind-colors"
import { NotificationType } from "@/features/notifications/constants/notificationTypes"
import { useFetchNotifications } from "@/features/notifications/hooks/useFetchNotifications"
import { useNotificationStore } from "@/features/notifications/store/notificationStore"
import { getNotificationContent } from "@/features/notifications/utils/notificationMessageMapper"
import { format } from "date-fns"
import React, { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ROUTES } from "@/common/routes"
import { useQueryClient } from "@tanstack/react-query"
import NotificationDetailsModal from "./NotificationDetailsModal"
import { useNotificationActions } from "../services/useNotificationActions"

interface NotificationPopupProps {
  onClose: () => void
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ onClose }) => {
  const { handleNotificationClick } = useNotificationActions()
  const { unreadNotifications } = useNotificationStore()
  const navigate = useNavigate()

  const [modalData, setModalData] = React.useState<{
    id: number
    type: "make-ready" | "customer"
  } | null>(null)

  return (
    <div
      style={{ zIndex: 1302 }}
      className="absolute right-[11rem] top-[57px] flex w-[399px] flex-col gap-6 rounded-md bg-white p-6 shadow-lg"
    >
      <span className="medium-text-sm text-shark-950">Notifications</span>

      <div className="flex flex-col gap-4 pr-2">
        {unreadNotifications.length > 0 ? (
          unreadNotifications.slice(0, 3).map((notif, index) => {
            const { title, description } = getNotificationContent(
              notif.notificationType as NotificationType,
              notif.message,
            )

            return (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-md bg-[#f9f9f9] p-6 hover:cursor-pointer"
                onClick={() =>
                  handleNotificationClick(
                    notif.id,
                    notif.entityId,
                    notif.notificationType,
                    setModalData
                  )
                }
                style={{
                  backgroundColor: index % 2 === 0 ? colors.shark["100"] : colors.cerulean["50"],
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {!notif.isRead && (
                      <span className="rounded-lg bg-oldlace-300 px-[12px] py-[1px] text-[9px] text-white">
                        NEW
                      </span>
                    )}
                    {/*<span className="semibold-text-xs text-cerulean-600">*/}
                    {/*  Visit #{notif.visitId}*/}
                    {/*</span>*/}
                  </div>
                  <span className="semibold-text-xs text-shark-400">
                    {format(notif.createdAt ? new Date(notif.createdAt): new Date(), "p")}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="medium-text-sm text-shark-400">{title}</div>
                  <div className="medium-text-xs text-shark-300">{description}</div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="medium-text-sm py-4 text-center text-shark-400">
            No new notifications.
          </div>
        )}
      </div>

      <button
        className="medium-text-sm w-fit self-center rounded border border-cerulean-600 px-6 py-2 text-cerulean-600 transition hover:bg-cerulean-600/5"
        onClick={() => {
          onClose()
          navigate({ to: ROUTES.NOTIFICATIONS })
        }}
      >
        See All
      </button>

      {modalData && (
        <NotificationDetailsModal id={modalData.id} type={modalData.type} onClose={onClose} />
      )}
    </div>
  )
}

export default NotificationPopup

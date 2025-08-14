// import { useAuthStore } from "@/features/auth/stores/authStore"
// import { useQueryClient } from "@tanstack/react-query"
// import Pusher from "pusher-js"
// import { useEffect } from "react"
// import { useNotificationStore } from "../store/notificationStore"
// import { invalidateQueries, ROLE_CHANNELS } from '@/features/notifications/constants/notificationTypes'
// import { Role } from '@/common/utils/roleUtils'
// import { Notification } from "../store/notificationStore"
//
// const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
//   cluster: import.meta.env.VITE_PUSHER_CLUSTER,
//   forceTLS: true,
// })
//
// export const usePusherNotifications = () => {
//   const { user } = useAuthStore()
//   const { addNotification } = useNotificationStore()
//   const queryClient = useQueryClient()
//
//   useEffect(() => {
//     if (!user?.id || !user?.role) return
//
//     const activeChannels: string[] = [
//       `recepient-${user.id}`,
//       `dashboard-update`,
//       'comment-change'
//     ]
//
//     const roleChannels = ROLE_CHANNELS[user.role as Role] || []
//     activeChannels.push(...roleChannels)
//
//     // 🎯 Based on ROLE, subscribe only relevant channels
//     switch (user.role) {
//       case "Receptionist":
//         activeChannels.push(`receptionist-${user.id}`)
//         break
//       case "SalesPerson":
//         activeChannels.push(`salesperson-${user.id}`)
//         break
//       case "SalesManager":
//         activeChannels.push(`salesmanager-${user.id}`)
//         break
//       case "FinanceManager":
//         activeChannels.push(`fimanager-${user.id}`)
//         activeChannels.push(`fimanager-all`)
//         break
//       case "GeneralManager":
//         activeChannels.push(`gm-${user.id}`)
//         break
//       default:
//         console.warn(`No Pusher channels configured for role: ${user.role}`)
//     }
//
//     const subscriptions = activeChannels.map((channelName: string) => {
//       const channel = pusher.subscribe(channelName)
//
//       const handleNotification = (data: Notification) => {
//         console.log(`Notification from channel ${channelName}:`, data)
//
//         if (channelName == `fimanager-${user.id}` || channelName == `fimanager-all`) {
//           queryClient.invalidateQueries({ queryKey: ["assignedDeals", Number(user.dealershipId)] })
//         }
//
//         if (channelName == `finance-queue-updated`) {
//           queryClient.invalidateQueries({ queryKey: ["fi-position", Number(user.dealershipId)] })
//           queryClient.invalidateQueries({ queryKey: ["assignedDeals", Number(user.dealershipId)] })
//         }
//
//         if (channelName == `salesperson-${user.id}`) {
//           queryClient.invalidateQueries({ queryKey: ["waitingQueue", Number(user.dealershipId)] })
//         }
//
//         if (channelName === `dashboard-update`) invalidateQueries.dashboardUpdate(queryClient)
//         if (channelName === `deal-change`) invalidateQueries.dealChange(queryClient)
//         if (channelName === `make-ready-change`) invalidateQueries.makeReadyChange(queryClient)
//         if (channelName === `employee-status-change`) invalidateQueries.employeeStatusChange(queryClient)
//         if (channelName === `plate-change`) invalidateQueries.plateChange(queryClient)
//         if (channelName === `objective-change`) invalidateQueries.objectiveChange(queryClient)
//         if (channelName === `customer-change`) invalidateQueries.customerChange(queryClient)
//         if (channelName === `comment-change`) invalidateQueries.commentChange(queryClient)
//         if (channelName === `document-change`) invalidateQueries.documentChange(queryClient)
//
//         addNotification(data)
//         queryClient.invalidateQueries({ queryKey: ["notifications"] })
//       }
//
//       channel.bind("new-notification", handleNotification)
//
//       return { channel, handleNotification }
//     })
//
//     return () => {
//       // Unsubscribe cleanly
//       subscriptions.forEach(({ channel, handleNotification }) => {
//         channel.unbind("new-notification", handleNotification)
//         pusher.unsubscribe(channel.name)
//       })
//     }
//   }, [user?.id, user?.role, addNotification, queryClient])
// }

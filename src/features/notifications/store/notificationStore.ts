import { create } from "zustand"

export interface Pagination {
  currentPage: number
  limit: number
  skip: number
  total: number
  totalPages: number
}

export interface Notification {
  id: number
  companyId: number
  dealershipId: number
  employeeId?: number
  triggeredBy: number
  visitId: number
  entityId: number
  sourceCommentId?: number
  notificationType: string
  message: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  date: string
  time: string
  from: string
}

export interface BackendNotification {
  id: number
  message: string
  notificationType: string
  visitId: number
  entityId: number
  createdAt: string
  date: string
  time: string
  from: string
  isRead: boolean
  employeeId: number
  triggeredBy: {
    firstName: string
    lastName: string
    role: {
      name: string
    }
  }
}

export function transformBackendNotification(notification: BackendNotification): Notification {
  return {
    id: notification.id,
    companyId: 0,
    dealershipId: 0,
    triggeredBy: 0,
    visitId: notification.visitId,
    entityId: notification.entityId,
    sourceCommentId: undefined,
    notificationType: notification.notificationType,
    message: notification.message,
    createdAt: notification.createdAt,
    updatedAt: notification.createdAt,
    date: notification.date,
    time: notification.time,
    from: notification.from,
    isRead: notification.isRead,
    employeeId: notification.employeeId,
  }
}

interface NotificationStore {
  notifications: Notification[]
  unreadNotifications: Notification[]
  pagination: Pagination
  isLoading: boolean
  tab: string | null
  setNotifications: (notifications: Notification[]) => void
  setUnreadNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  clearNotifications: () => void
  setPagination: (pagination: Pagination) => void
  setIsLoading: (isLoading: boolean) => void
  setTab: (tab: string | null) => void
}

const defaultPagination: Pagination = {
  currentPage: 1,
  limit: 10,
  skip: 0,
  total: 0,
  totalPages: 0,
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadNotifications: [],
  pagination: defaultPagination,
  isLoading: false,
  tab: null,
  setNotifications: (notifications: Notification[]) => {
    set({ notifications })
  },
  setUnreadNotifications: (unreadNotifications: Notification[]) => {
    set({ unreadNotifications })
  },
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadNotifications: [notification, ...state.unreadNotifications],
    })),
  clearNotifications: () => set({ notifications: [] }),
  setPagination: (pagination: Pagination) => set({ pagination }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setTab: (tab: string | null) => set({ tab }),
}))

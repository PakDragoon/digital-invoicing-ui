import React, { useState, useMemo, useEffect } from "react"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { tableConfig } from "@/core/config/tableConfig"
import { BreadCrumb } from "@/common/components/breadcrumb/BreadCrumb"
import { humanize } from "@/common/utils/humanize"
import { ROUTES } from "@/common/routes"

import { useLocation } from "@tanstack/react-router"
import { DataTable } from "@/common/components"
import { TableCard } from "@/common/components/cards/TableCard"
import {
  useNotificationStore,
  transformBackendNotification,
} from "@/features/notifications/store/notificationStore"
import Pagination from "@/features/table/components/Pagination"
import { notificationApi } from "@/features/notifications/services/notificationApi"

const tablePageName = "Notifications"

function NotificationsTable() {
  const role = useAuthStore((state) => state.user?.role || "")
  const dealershipId = useAuthStore((state) => state.user?.dealershipId || "")
  const { tabs } = tableConfig[role][tablePageName]
  const humanizedRole = humanize(role)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tabFromQuery: string | null = searchParams.get("tab")

  const defaultTab: string | null = useMemo(() => {
    if (!tabs.length) return null
    const found = tabs.find((tab) => tab.key === tabFromQuery)
    return found?.label || tabs[0]?.label
  }, [tabFromQuery])

  const [selectedTab, setSelectedTab] = useState<string>(defaultTab || "")

  const { headers, color, rowColor } = tabs.find((tab) => tab.label === selectedTab) || {}
  const { notifications, pagination, isLoading } = useNotificationStore()
  console.log("🚀 ~ NotificationsTable ~ notifications:", notifications)

  // PAGINATION

  const [page, setPage] = useState(pagination.currentPage ?? 1)
  const [limit, setLimit] = useState(pagination.limit ?? 10)

  const handlePagination = (direction: "next" | "prev" | number) => {
    const { pagination, setPagination } = useNotificationStore.getState()
    const { currentPage, totalPages, ...rest } = pagination

    let newPage = currentPage

    if (typeof direction === "number") {
      newPage = direction
    } else if (direction === "next" && currentPage < totalPages) {
      newPage = currentPage + 1
    } else if (direction === "prev" && currentPage > 1) {
      newPage = currentPage - 1
    }

    if (newPage !== currentPage) {
      setPagination({
        ...rest,
        currentPage: newPage,
        skip: (newPage - 1) * pagination.limit,
        totalPages,
        total: pagination.total,
        limit: pagination.limit,
      })
    }
  }

  const handleLimitChange = (newLimit: number) => {
    const { pagination, setPagination } = useNotificationStore.getState()

    setPagination({
      ...pagination,
      limit: newLimit,
      currentPage: 1,
      skip: 0,
    })
  }

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab)

    const store = useNotificationStore.getState()

    // Reset pagination when tab changes
    store.setPagination({
      ...pagination,
      currentPage: 1,
      skip: 0,
    })
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const store = useNotificationStore.getState()
        store.setIsLoading(true)
        store.setTab(selectedTab.toLowerCase()) // Save tab in store

        const response = await notificationApi.getAllNotifications(
          Number(dealershipId),
          selectedTab.toLowerCase()
        )

        const transformed = response.data.data.map((notification) =>
          transformBackendNotification(notification)
        )

        store.setNotifications(transformed)

        if (response.data.pagination) {
          store.setPagination(response.data.pagination)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      } finally {
        useNotificationStore.getState().setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [pagination.currentPage, pagination.limit, selectedTab])

  return (
    <div className="flex h-[calc(76vh-4rem)] flex-col">
      <BreadCrumb rootLabel={humanizedRole} rootPath={ROUTES.DASHBOARD} />

      <TableCard
        component={DataTable}
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        componentProps={{
          color,
          rowColor,
          headers,
          data: notifications || [],
          isLoading,
          isError: false,
          searchQuery: "",
          onSearchChange: () => {},
          filters: {},
          onFilterChange: () => {},
          showSearchBox: false,
        }}
      />

      {notifications?.length > 0 && (
        <Pagination
          color={color || "defaultColor"}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalResults={pagination.total}
          perPage={pagination.limit}
          limit={pagination.limit}
          onPageChange={(direction) => handlePagination(direction)}
          onLimitChange={handleLimitChange}
        />
      )}
    </div>
  )
}

export default NotificationsTable

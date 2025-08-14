import React, { useState, useMemo, useEffect } from "react"
import { useLocation } from "@tanstack/react-router"
import DataTable from "@/common/components/datatable/DataTable"
import { TableCard } from "@/common/components/cards/TableCard"
import { DataTableProps, ITab } from "@/core/config/tableConfig"
import { DealershipApiResponse } from "../hook/useDealershipData"
import Pagination from "@/features/table/components/Pagination"

type TableComponentProps = {
  tabs: ITab[]
  dealerships: DealershipApiResponse | undefined
  tableState: {
    search: string
    page: number
    limit: number
  }
  updateTableState: (updates: Partial<TableComponentProps["tableState"]>) => void
}

const AdminTable: React.FC<TableComponentProps> = ({
  tabs,
  dealerships,
  tableState,
  updateTableState,
}) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const tabFromQuery: string | null = searchParams.get("tab")
  const { search, page, limit } = tableState
  const defaultTab: string | null = useMemo(() => {
    if (!tabs.length) return null
    const found = tabs.find((tab) => tab.key === tabFromQuery)
    return found?.label || tabs[0]?.label
  }, [tabFromQuery, tabs])

  if (!defaultTab) return <div>No tabs found</div>

  const [selectedTab, setSelectedTab] = useState<string>(defaultTab)
  const [filters, setFilters] = useState<Record<string, string>>({})
  const selectedTabConfig = useMemo(
    () => tabs.find((tab) => tab.label === selectedTab),
    [tabs, selectedTab]
  )

  const handleSearchChange = (query: string) => {
    updateTableState({ search: query, page: 1 })
  }
  useEffect(() => {
    const label = tabs.find((tab) => tab.key === tabFromQuery)?.label
    if (label && label !== selectedTab) {
      setSelectedTab(label)
      setFilters({})
      updateTableState({ page: 1 })
    }
  }, [tabFromQuery, tabs])

  const {
    headers = [],
    color = "",
    rowColor = "",
    dealStatus = [],
    mrStatus = [],
    visitStatus = [],
    empStatus = [],
    hidden = [],
    searchPlaceholder = "Search by Deal#, Salesperson, Customer Name",
  } = selectedTabConfig || {}
  const pagination = dealerships?.pagination || {
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  }
  const handlePagination = (direction: "next" | "prev" | number) => {
    if (typeof direction === "number") {
      updateTableState({ page: direction })
    } else {
      updateTableState({
        page:
          direction === "next" && page < pagination.totalPages
            ? page + 1
            : direction === "prev" && page > 1
              ? page - 1
              : page,
      })
    }
  }
  const handleLimitChange = (newLimit: number) => {
    updateTableState({ limit: newLimit, page: 1 })
  }

  return (
    <>
      {dealerships?.data && (
        <TableCard
          component={DataTable}
          tabs={tabs}
          selectedTab={selectedTab}
          componentProps={{
            color,
            rowColor,
            headers,
            hidden,
            onSearchChange: handleSearchChange,
            searchQuery: search,
            data: dealerships?.data,
            filters,
            searchBoxPlaceholder: searchPlaceholder,
            selectedTab,
          }}
        />
      )}
      {(dealerships?.data?.length ?? 0) > 0 && (
        <Pagination
          color={color}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalResults={pagination.total}
          perPage={pagination.limit}
          limit={limit}
          onPageChange={handlePagination}
          onLimitChange={handleLimitChange}
        />
      )}
    </>
  )
}

export default AdminTable

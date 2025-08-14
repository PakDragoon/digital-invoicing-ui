import React, { useEffect, useMemo, useState } from "react"
import { MetricGridProps } from "../../types/dashboard-types"
import colors from "@/common/constants/tailwind-colors"
import MetricComponent from "@/common/components/cards/MetricCard"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { tableConfig } from "@/core/config/tableConfig"
import AdminTable from "./components/AdminTable"
import { DealershipApiResponse, useDealerships } from "./hook/useDealershipData"

const MetricGrid: React.FC<MetricGridProps> = ({ metrics }) => (
  <div className="flex w-full justify-between gap-6">
    {metrics.map((metric, index) => (
      <MetricComponent key={index} {...metric} />
    ))}
  </div>
)

const tablePageName: string = "Dealerships"

const SuperAdminDashboard = () => {
  const [tableState, setTableState] = useState({
    search: "",
    page: 1,
    limit: 10,
  })
  const updateTableState = (updates: Partial<typeof tableState>) => {
    setTableState((prev) => ({ ...prev, ...updates }))
  }
  const [adminData, setAdminData] = useState({
    companies: 0,
    dealerships: 0,
    csvs: 0,
  })

  const { data: dealerships } = useDealerships(
    tableState.search,
    tableState.page,
    tableState.limit
  ) as { data: DealershipApiResponse | undefined }

  useEffect(() => {
    if (Array.isArray(dealerships?.data)) {
      const totalDealerships = dealerships.data.length
      const distinctCompanyIds = new Set(dealerships.data.map((d) => d.companyId)).size
      const csvUploadedCount = dealerships.data.filter(
        (d) => d.csvS3Key && d.csvS3Key.length > 0
      ).length

      setAdminData({
        companies: distinctCompanyIds,
        dealerships: totalDealerships,
        csvs: csvUploadedCount,
      })
    }
  }, [dealerships?.data])

  const metrics = useMemo(
    () => [
      {
        id: "vehicles-in-process",
        objectiveName: "Total Companies",
        achievedObjective: adminData.companies,
        iconColor: colors.oldlace[500],
        iconBgColor: colors.oldlace[100],
        path: ``,
      },
      {
        id: "vehicles-held",
        objectiveName: "Total Dealerships",
        achievedObjective: adminData.dealerships,
        iconColor: colors.primary,
        iconBgColor: colors.cerulean[100],
        path: ``,
      },
      {
        id: "completed-today",
        objectiveName: "Uploaded CSV Files",
        achievedObjective: adminData.csvs,
        iconColor: colors.screamin[600],
        iconBgColor: colors.screamin[100],
        path: ``,
      },
    ],
    [adminData]
  )

  const user = useAuthStore((state) => state.user)
  const role = user?.role
  const tabs = role && tablePageName ? (tableConfig[role]?.[tablePageName]?.tabs ?? []) : []
  return (
    <>
      <div className="mb-5">
        <MetricGrid metrics={metrics} />
      </div>
      <div className="flex h-[calc(76vh-4rem)] flex-col">
        <AdminTable
          tabs={tabs}
          dealerships={dealerships}
          tableState={tableState}
          updateTableState={updateTableState}
        />
      </div>
    </>
  )
}

export default SuperAdminDashboard

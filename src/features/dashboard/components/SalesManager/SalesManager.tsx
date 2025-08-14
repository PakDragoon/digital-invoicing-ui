import MetricComponent from "@/common/components/cards/MetricCard"
import { FullPageLoader } from "@/common/components/FullPageLoader"
import { useSalesTypeStore } from "@/common/components/salesFilterBar/store"
import colors from "@/common/constants/tailwind-colors"
import { ROUTES } from "@/common/routes"
import { useAuthStore } from "@/features/auth/stores/authStore"
import React, { useEffect } from "react"
import { ObjectiveInfoData, useObjectives } from "../../hooks/useObjectives"
import { MetricGridProps } from "../../types/dashboard-types"
import { useViewingEmployeeStore } from "../../store/userStore"
import {
  useSalesManagerSummary,
  ISalesManagerSummary,
} from "@/features/dashboard/components/SalesManager/hooks"

// MetricGrid Component
const MetricGrid: React.FC<MetricGridProps> = ({ metrics }) => (
  <div className="flex w-full justify-between gap-6">
    {metrics.map((metric) => (
      <MetricComponent key={metric.id} {...metric} />
    ))}
  </div>
)

export interface SalesDashboardProps {
  statusInfo: ISalesManagerSummary | undefined
  objectivesData: ObjectiveInfoData | undefined
}

const SalesManagerDashboardContent = ({ statusInfo, objectivesData }: SalesDashboardProps) => {
  const metrics = [
    {
      id: "daily-sales",
      objectiveName: "Daily Sales",
      achievedObjective: statusInfo?.dailySales ?? 0,
      iconColor: colors.oldlace[500],
      iconBgColor: colors.oldlace[100],
      path: `/${ROUTES.INVOICES}?tab=daily`,
    },
    {
      id: "finance-sales",
      objectiveName: "Total Deals in Finance",
      achievedObjective: statusInfo?.dealsInFinance ?? 0,
      iconColor: colors.primary,
      iconBgColor: colors.cerulean[100],
      path: `/${ROUTES.INVOICES}?tab=finance`,
    },
    {
      id: "sold-await-delivery-sales",
      objectiveName: "Deals Sold / Waiting Delivery",
      achievedObjective: statusInfo?.dealsSold ?? 0,
      iconColor: colors.cinnabar[600],
      iconBgColor: colors.cinnabar[100],
      path: `/${ROUTES.INVOICES}?tab=sold-await-delivery`,
    },
    {
      id: "finalized-sales",
      objectiveName: "Deals Finalized",
      achievedObjective: statusInfo?.dealsFinalized ?? 0,
      iconColor: colors.shark[600],
      iconBgColor: colors.shark[100],
      path: `/${ROUTES.INVOICES}?tab=finalized`,
    },
    {
      id: "make-ready",
      objectiveName: "Make Ready",
      achievedObjective: statusInfo?.makeReady ?? 0,
      iconColor: colors.screamin[600],
      iconBgColor: colors.screamin[100],
      path: `/${ROUTES.MAKE_READY}`,
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-[82rem] flex-col gap-y-6">
      <div className="flex w-full justify-between gap-6">
        <MetricGrid metrics={metrics} />
      </div>
    </div>
  )
}

const SalesManagerDashboard = () => {
  const dealershipId = useAuthStore((state) => state.user?.dealershipId ?? "")
  const userId = useAuthStore((state) => state.user?.id ?? "")
  const role = useAuthStore((state) => state.user?.role ?? "")
  const { viewingEmployee } = useViewingEmployeeStore()
  const id = viewingEmployee?.id ? viewingEmployee.id : userId
  const { selectedSalesType } = useSalesTypeStore()
  const { clearViewingEmployee } = useViewingEmployeeStore()

  useEffect(() => {
    if (role === "SalesManager") {
      clearViewingEmployee()
    }
  }, [role, clearViewingEmployee])

  const {
    data: statusInfo,
    isLoading: isStatusInfoLoading,
    error: statusInfoError,
  } = useSalesManagerSummary({ userId: id, dealershipId, salesType: selectedSalesType.value })
  const {
    data: objectivesData,
    isLoading: isObjectivesLoading,
    error: objectivesError,
  } = useObjectives(id ?? "", dealershipId ? String(dealershipId) : "", selectedSalesType.value)

  if (isStatusInfoLoading || isObjectivesLoading) return <FullPageLoader />

  if (objectivesError || statusInfoError) {
    const error = objectivesError || statusInfoError
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    )
  }

  return <SalesManagerDashboardContent statusInfo={statusInfo} objectivesData={objectivesData} />
}

export default SalesManagerDashboard

import { MetricComponentProps } from "@/common/components/cards/MetricCard"

interface SalesManagerInfoDataMTD {
  newCarsSold: number
  usedCarsSold: number
  totalCarsSold: number
  newCarsSoldGross: number
  usedCarsSoldGross: number
  totalRevenue: number
}

interface SalesWaitingDeliveryInfoData {
  newSalesWaitingDeliveryDeals: number
  oldSalesWaitingDeliveryDeals: number
  newSalesWaitingDeliveryDealsEstimatedGross: number
  oldSalesWaitingDeliveryDealsEstimatedGross: number
  totalEstimatedGross: number
}

interface SalesManagerProductionInfoData {
  newDeliveredCount: number
  usedDeliveredCount: number
  newFinalizedCount: number
  usedFinalizedCount: number
  newDeliveredGross: number
  usedDeliveredGross: number
  newFinalizedGross: number
  usedFinalizedGross: number
  totalDeliveredGross: number
  totalFinalizedGross: number
}

interface SalesManagerInfoData {
  dailySales: number
  dealsInFinance: number
  dealsSold: number
  dealsFinalized: number
  makeReady: number
  totalSalesPerson: number
  availableSalesPerson: number
  assignedSalesPerson: number
  MTD: SalesManagerInfoDataMTD
  salesWaitingDelivery: SalesWaitingDeliveryInfoData
  production: SalesManagerProductionInfoData
}

export interface ObjectivesData {
  DeptObjectiveNew: number
  DeptObjectiveUsed: number
  AssignedObjectiveNew: number
  AssignedObjectiveUsed: number
  PrevMonthDeptObjectiveNew: number
  PrevMonthDeptObjectiveUsed: number
  PrevMonthNewSales: number
  PrevMonthUsedSales: number
}
export interface MetricGridProps {
  metrics: MetricComponentProps[]
}

export interface SalesDashboardProps {
  statusInfo: SalesManagerInfoData | undefined
  objectivesData: ObjectivesData | undefined
}

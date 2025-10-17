import { useQuery } from "@tanstack/react-query"
import api from "@/core/config/api"

export interface ISalesManagerSummary {
  dailySales: number
  dealsInFinance: number
  dealsSold: number
  dealsFinalized: number
  makeReady: number
  totalSalesPerson: number
  carsSold: number
  newCarsSold: number
  usedCarsSold: number
  availableSalesPerson: number
  assignedSalesPerson: number
  customersWaiting: number
  MTD: {
    newCarsSold: number
    usedCarsSold: number
    totalCarsSold: number
    newCarsSoldGross: number
    usedCarsSoldGross: number
    totalRevenue: number
  }
  salesWaitingDelivery: {
    newSalesWaitingDeliveryDeals: number
    oldSalesWaitingDeliveryDeals: number
    newSalesWaitingDeliveryDealsEstimatedGross: number
    oldSalesWaitingDeliveryDealsEstimatedGross: number
    totalEstimatedGross: number
    monthlyComparison: number
  }
  production: {
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
    deliveredGrossMonthlyComparison: number
  }
}

interface ApiResponse {
  success: boolean
  message: string
  data: ISalesManagerSummary
}

interface UseSalesManagerSummaryParams {
  userId: string
  companyId: string
  salesType: string
}

const fetchSalesManagerSummary = async ({
  userId,
  companyId,
  salesType,
}: UseSalesManagerSummaryParams): Promise<ISalesManagerSummary> => {
  const response = await api.get<ApiResponse>(`/summary/salesmanager`, {
    params: { userId, companyId, salesType },
  })
  return response.data.data
}

export const useSalesManagerSummary = ({
  userId,
  companyId,
  salesType,
}: UseSalesManagerSummaryParams) => {
  return useQuery<ISalesManagerSummary, Error>({
    queryKey: ["salesManagerSummary", userId, salesType, companyId],
    queryFn: () => fetchSalesManagerSummary({ userId, companyId, salesType }),
    enabled: !!userId && !!companyId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}

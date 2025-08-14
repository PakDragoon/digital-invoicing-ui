import { useQuery } from "@tanstack/react-query"
import api from "../../../core/config/api"

interface MTDData {
  newCarsSold: number
  usedCarsSold: number
  totalCarsSold: number
  newCarsSoldGross: number
  usedCarsSoldGross: number
  totalRevenue: number
}

interface SalesWaitingDelivery {
  newSalesWaitingDeliveryDeals: number
  oldSalesWaitingDeliveryDeals: number
  newSalesWaitingDeliveryDealsEstimatedGross: number
  oldSalesWaitingDeliveryDealsEstimatedGross: number
  totalEstimatedGross: number
}

interface ProductionData {
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

interface DealStatusData {
  dailySales: number
  dealsInFinance: number
  dealsSold: number
  dealsFinalized: number
  makeReady: number
  totalSalesPerson: number
  availableSalesPerson: number
  assignedSalesPerson: number
  carsSold: number
  newCarsSold: number
  usedCarsSold: number
  MTD: MTDData
  salesWaitingDelivery: SalesWaitingDelivery
  production: ProductionData
}

interface ApiResponse {
  success: boolean
  message: string
  data: DealStatusData
}

const fetchDealStatus = async (
  id: string,
  dealershipId: string,
  token: string
): Promise<DealStatusData> => {
  const response = await api.get<ApiResponse>(`/summary/salesmanager`, {
    params: {
      dealershipId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data.data
}

export const useSMViewInfo = (id: string, dealershipId: string, token: string) => {
  return useQuery({
    queryKey: ["dealStatus", dealershipId],
    queryFn: () => fetchDealStatus(id, dealershipId, token),
    enabled: !!id && !!dealershipId && !!token,
  })
}

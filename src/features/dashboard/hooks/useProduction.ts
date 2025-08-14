import { useQuery } from "@tanstack/react-query"
import api from "../../../core/config/api"

export interface ProductionData {
  totalSalesGross: number
  totalDeliveredGross: number
  deliveredDeals: number
  notDeliveredDeals: number
  newSoldDeals: number
  newDeliveredDeals: number
  usedSoldDeals: number
  usedDeliveredDeals: number
}

interface ProductionResponse {
  success: boolean
  message: string
  data: ProductionData
}

export const getProductionData = async (
  id: string,
  dealershipId: string,
  token: string
): Promise<ProductionData> => {
  const response = await api.get<ProductionResponse>(
    `/production/getProductionData?id=${id}&dealershipId=${dealershipId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data.data
}

export const useProductionData = (id: string, dealershipId: string, token: string) => {
  return useQuery({
    queryKey: ["productionData", id, dealershipId],
    queryFn: () => getProductionData(id, dealershipId, token),
    enabled: !!id && !!dealershipId && !!token,
  })
}

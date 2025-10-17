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
  companyId: string,
  token: string
): Promise<ProductionData> => {
  const response = await api.get<ProductionResponse>(
    `/production/getProductionData?id=${id}&companyId=${companyId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return response.data.data
}

export const useProductionData = (id: string, companyId: string, token: string) => {
  return useQuery({
    queryKey: ["productionData", id, companyId],
    queryFn: () => getProductionData(id, companyId, token),
    enabled: !!id && !!companyId && !!token,
  })
}

import { useQuery } from "@tanstack/react-query"
import api from "@/core/config/api"
import { SalesType } from "@/common/components/salesFilterBar/types"

export interface ObjectiveInfoData {
  DeptObjectiveNew: number
  DeptObjectiveUsed: number
  AssignedObjectiveNew: number
  AssignedObjectiveUsed: number
  PrevMonthDeptObjectiveNew: number
  PrevMonthDeptObjectiveUsed: number
  PrevMonthNewSales: number
  PrevMonthUsedSales: number
}

export interface ObjectiveInfoResponse {
  success: boolean
  message: string
  data: ObjectiveInfoData
}

const fetchObjectiveInfo = async (
  id: string,
  dealershipId: string,
  salesType: SalesType
): Promise<ObjectiveInfoData> => {
  const response = await api.get<ObjectiveInfoResponse>(
    `/objective/getObjectiveInfo/${salesType}`,
    { params: { id, dealershipId } }
  )

  return response.data.data
}

export const useObjectives = (id: string, dealershipId: string, salesType: SalesType) => {
  return useQuery({
    queryKey: ["objectiveInfo", id, dealershipId, salesType],
    queryFn: () => fetchObjectiveInfo(id, dealershipId, salesType),
    enabled: !!id && !!dealershipId && !!salesType,
  })
}

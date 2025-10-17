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
  companyId: string,
  salesType: SalesType
): Promise<ObjectiveInfoData> => {
  const response = await api.get<ObjectiveInfoResponse>(
    `/objective/getObjectiveInfo/${salesType}`,
    { params: { id, companyId } }
  )

  return response.data.data
}

export const useObjectives = (id: string, companyId: string, salesType: SalesType) => {
  return useQuery({
    queryKey: ["objectiveInfo", id, companyId, salesType],
    queryFn: () => fetchObjectiveInfo(id, companyId, salesType),
    enabled: !!id && !!companyId && !!salesType,
  })
}

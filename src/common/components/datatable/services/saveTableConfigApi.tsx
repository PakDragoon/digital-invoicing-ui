import api from "@/core/config/api"

interface ColumnConfig {
  label: string
  key: string
  isShow: boolean
  order: number
  width: number
}

interface TableConfigPayload {
  tableHeaderKey: string
  columns: ColumnConfig[]
}

interface UpsertTableConfigResponse {
  success: boolean
  message: string
}

const upsertTableConfig = async (
  userTokenId: bigint,
  dealershipId: string | undefined,
  payload: TableConfigPayload,
  role: string | undefined
): Promise<UpsertTableConfigResponse> => {
  const params = new URLSearchParams({ userTokenId: userTokenId.toString() })
  if (role !== "Admin" && dealershipId) params.append("dealershipId", dealershipId)
  const { data } = await api.post(`/table-config/upsert?${params}`, payload)
  return data
}

export { upsertTableConfig }

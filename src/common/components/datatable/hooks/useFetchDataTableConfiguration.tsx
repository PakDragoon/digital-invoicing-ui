import { useQuery } from "@tanstack/react-query"
import api from "@/core/config/api"

interface Column {
  key: string
  label: string
  isShow: boolean
  order: number
  width: number
}

interface TableConfigData {
  success: boolean
  message: string
  data: {
    id: number
    userTokenId: string
    tableHeaderKey: string
    columns: Column[]
    createdAt: string
    updatedAt: string
  }[]
}

interface FetchTableConfigParams {
  userId: string
  headerKey: string
  dealershipId: string
  role: string | undefined
}

const fetchTableConfig = async ({
  userId,
  headerKey,
  dealershipId,
  role,
}: FetchTableConfigParams): Promise<Column[]> => {
  const params: any = {
    userTokenId: userId,
    tableHeaderKey: headerKey,
    role,
  }

  if (role !== "Admin") {
    params.dealershipId = dealershipId
  }

  try {
    const response = await api.get<TableConfigData>("/table-config/fetch", { params })

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data) &&
      response.data.data.length > 0 &&
      response.data.data[0].columns
    ) {
      return response.data.data[0].columns
    } else {
      return []
    }
  } catch (error) {
    console.error("Error fetching table config:", error)
    return []
  }
}

export const useTableConfig = ({
  userId,
  headerKey,
  dealershipId,
  role,
}: FetchTableConfigParams) => {
  return useQuery<Column[], Error>({
    queryKey: ["tableConfig", userId, headerKey, dealershipId],
    queryFn: () => fetchTableConfig({ userId, headerKey, dealershipId, role }),
    exact: false,
  })
}

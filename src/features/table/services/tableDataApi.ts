import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import api from "@/core/config/api"
import { Deal, User } from "@/core/entities"
import { SalesType } from "@/common/components/salesFilterBar/types"

interface FetchDealsParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  filters?: Record<string, string>
  companyId: string
  salesType?: SalesType
  userId: string
  viewAsRole: string
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    limit: number
    skip: number
    currentPage: number
    totalPages: number
  }
}

export const fetchDeals = async (
  endpoint: string,
  params: FetchDealsParams,
  additionalParams: Record<string, any> = {}
): Promise<PaginatedResponse<Deal>> => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy,
    sortOrder,
    filters = {},
    companyId,
    salesType,
    userId,
    viewAsRole,
  } = params
  const skip = (page - 1) * limit

  const { data } = await api.get(endpoint, {
    params: {
      companyId,
      salesType,
      skip,
      limit,
      search,
      sortBy,
      sortOrder,
      userId,
      viewAsRole,
      ...filters,
      ...additionalParams,
    },
  })

  return data
}

const fetchSalesPersons = async (companyId: string): Promise<User[]> => {
  const { data } = await api.get("/employee/salespersons", { params: { companyId } })
  return data
}

export const fetchEmployeeStatusByRole = async (
  roleId: string,
  companyId?: string,
) => {
  const { data } = await api.get("/status/status", { params: { companyId, roleId } })
  return data
}

export const useTableData = (
  endpoint: string,
  params: FetchDealsParams,
  options?: UseQueryOptions<PaginatedResponse<Deal>>,
  additionalParams: Record<string, any> = {}
) => {
  return useQuery({
    queryKey: [endpoint, params, params.salesType, params.userId],
    queryFn: () => fetchDeals(endpoint, params, additionalParams),
    keepPreviousData: true,
    exact: false,
    ...options,
  })
}

export const useGetSalesPersons = (companyId?: string | number) => {
  return useQuery({
    queryKey: ["GetSalesPersons", companyId],
    queryFn: () => fetchSalesPersons(companyId),
    enabled: !!companyId,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 300,
  })
}

export const useEmployeeStatus = (roleId: string, companyId?: string) => {
  return useQuery({
    queryKey: ["employeeStatus", roleId, companyId, companyId],
    queryFn: () => fetchEmployeeStatusByRole(roleId, companyId),
    enabled: !!roleId,
  })
}

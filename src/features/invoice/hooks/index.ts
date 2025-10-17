import { keepPreviousData, useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query"
import { Deal, DocumentType, DealDocument } from "@/core/entities"
import api from "@/core/config/api"
import { dealService } from "../services/dealApi"
import { IDealStatusHistoryResponse } from "@/core/entities/deal-status-history"
import { routeOneService } from "@/features/invoice/services/routeOneApi"

const fetchDeal = async (dealNo: string, companyId: string | undefined): Promise<Deal> => {
  const { data } = await api.get(`/deal/dealNo/${dealNo}`, { params: { companyId } })
  return data.data.data
}

export interface IDealInAssignQueue {
  dealId: string
}

const fetchDealInAssignQueue = async (
  companyId: string | undefined,
  dealId: string
): Promise<IDealInAssignQueue> => {
  const response = await api.get("/deal/exists-in-assign-queue/", {
    params: { companyId, dealId },
  })

  return response.data?.data
}

type CommonQueryOptions<TData, TQueryKey extends QueryKey> = Omit<
  UseQueryOptions<TData, unknown, TData, TQueryKey>,
  "queryKey" | "queryFn"
>

export const useDealDetail = (
  dealNo: string,
  companyId: string | undefined,
  options?: CommonQueryOptions<Deal, ["getDealByDealNo", string]>
) =>
  useQuery({
    queryKey: ["getDealByDealNo", dealNo],
    queryFn: () => fetchDeal(dealNo, companyId),
    placeholderData: keepPreviousData,
    ...options,
  })

export const useDocumentTypes = (
  companyId: string,
  options?: CommonQueryOptions<DocumentType[], ["getDocumentTypes", string]>
) => {
  return useQuery({
    queryKey: ["getDocumentTypes", companyId],
    queryFn: () => dealService.fetchDocumentTypes(companyId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 3,
    ...options,
  })
}

export const useDealDocuments = (
  dealId: string,
  companyId: string,
  options?: CommonQueryOptions<DealDocument[], ["getDealDocuments", string, string]>
) => {
  return useQuery({
    queryKey: ["getDealDocuments", dealId, companyId],
    queryFn: () => dealService.fetchDealDocuments(dealId, companyId),
    placeholderData: keepPreviousData,
  })
}

export const useDealInAssignQueue = (
  companyId: string | undefined,
  dealId: string | null,
  options?: UseQueryOptions<
    IDealInAssignQueue,
    unknown,
    IDealInAssignQueue,
    ["getDealInAssignQueue", string]
  >
) =>
  useQuery({
    queryKey: ["getDealInAssignQueue", dealId],
    queryFn: () => fetchDealInAssignQueue(companyId, dealId),
    enabled: options?.enabled,
    ...options,
  })

export const useDealStatusHistory = (
  dealId: string,
  companyId: string,
  options?: CommonQueryOptions<
    IDealStatusHistoryResponse[],
    ["getDealStatusHistory", string, string]
  >
) => {
  return useQuery({
    queryKey: ["getDealStatusHistory", dealId, companyId],
    queryFn: () => dealService.getDealStatusHistory(dealId, companyId),
    placeholderData: keepPreviousData,
    ...options,
  })
}

export const useRouteOneByVin = (companyId: string| undefined, vin?: string) =>
  useQuery({
    queryKey: ["getRouteOneByVin", vin],
    queryFn: () => routeOneService.getRouteOneByVin(companyId, vin),
    enabled: !!vin && !!companyId,
  })

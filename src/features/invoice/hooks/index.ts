import { keepPreviousData, useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query"
import { Deal, DocumentType, DealDocument } from "@/core/entities"
import api from "@/core/config/api"
import { dealService } from "../services/dealApi"
import { IDealStatusHistoryResponse } from "@/core/entities/deal-status-history"
import { routeOneService } from "@/features/invoice/services/routeOneApi"

const fetchDeal = async (dealNo: string, dealershipId: string | undefined): Promise<Deal> => {
  const { data } = await api.get(`/deal/dealNo/${dealNo}`, { params: { dealershipId } })
  return data.data.data
}

export interface IDealInAssignQueue {
  dealId: string
}

const fetchDealInAssignQueue = async (
  dealershipId: string | undefined,
  dealId: string
): Promise<IDealInAssignQueue> => {
  const response = await api.get("/deal/exists-in-assign-queue/", {
    params: { dealershipId, dealId },
  })

  return response.data?.data
}

type CommonQueryOptions<TData, TQueryKey extends QueryKey> = Omit<
  UseQueryOptions<TData, unknown, TData, TQueryKey>,
  "queryKey" | "queryFn"
>

export const useDealDetail = (
  dealNo: string,
  dealershipId: string | undefined,
  options?: CommonQueryOptions<Deal, ["getDealByDealNo", string]>
) =>
  useQuery({
    queryKey: ["getDealByDealNo", dealNo],
    queryFn: () => fetchDeal(dealNo, dealershipId),
    placeholderData: keepPreviousData,
    ...options,
  })

export const useDocumentTypes = (
  dealershipId: string,
  options?: CommonQueryOptions<DocumentType[], ["getDocumentTypes", string]>
) => {
  return useQuery({
    queryKey: ["getDocumentTypes", dealershipId],
    queryFn: () => dealService.fetchDocumentTypes(dealershipId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 3,
    ...options,
  })
}

export const useDealDocuments = (
  dealId: string,
  dealershipId: string,
  options?: CommonQueryOptions<DealDocument[], ["getDealDocuments", string, string]>
) => {
  return useQuery({
    queryKey: ["getDealDocuments", dealId, dealershipId],
    queryFn: () => dealService.fetchDealDocuments(dealId, dealershipId),
    placeholderData: keepPreviousData,
  })
}

export const useDealInAssignQueue = (
  dealershipId: string | undefined,
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
    queryFn: () => fetchDealInAssignQueue(dealershipId, dealId),
    enabled: options?.enabled,
    ...options,
  })

export const useDealStatusHistory = (
  dealId: string,
  dealershipId: string,
  options?: CommonQueryOptions<
    IDealStatusHistoryResponse[],
    ["getDealStatusHistory", string, string]
  >
) => {
  return useQuery({
    queryKey: ["getDealStatusHistory", dealId, dealershipId],
    queryFn: () => dealService.getDealStatusHistory(dealId, dealershipId),
    placeholderData: keepPreviousData,
    ...options,
  })
}

export const useRouteOneByVin = (dealershipId: string| undefined, vin?: string) =>
  useQuery({
    queryKey: ["getRouteOneByVin", vin],
    queryFn: () => routeOneService.getRouteOneByVin(dealershipId, vin),
    enabled: !!vin && !!dealershipId,
  })

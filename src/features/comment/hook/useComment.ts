import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { dealService } from "@/features/invoice/services/dealApi"

export const useGetComments = (
  entityType: string,
  entityId: string | number,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ["getComments", entityType, entityId],
    queryFn: () => dealService.fetchComments(entityType, entityId),
    keepPreviousData: true,
    exact: false,
    ...options,
  })
}

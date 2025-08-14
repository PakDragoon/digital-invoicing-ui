import api from "@/core/config/api"
import { useQuery } from "@tanstack/react-query"
export type Dealership = {
  id: number
  companyId: number
  companyName: string
  dealershipName: string
  phone: string
  addressStreet1: string
  addressStreet2: string | null
  city: string
  state: string
  zipCode: string
  countryCode: string
  createdAt: string
  updatedAt: string
  csvS3Key?: string
  csvOriginalFileName?: string
  csvUploadedAt?: string
  contactPerson?: string
}

export type DealershipApiResponse = {
  success: boolean
  message: string
  data: Dealership[]
  pagination: {
    currentPage: number,
    totalPages: number,
    total: number,
    limit: number,
  }
}
export const fetchDealerships = async (searchQuery: string = "", page: number = 1, limit:number=1) => {
   const skip = (page - 1) * limit
  const response = await api.get("/dealership", {
    params: { search: searchQuery,page,skip ,limit},
  });
  return response.data.data;
};

export const useDealerships = (searchQuery?: string,page?:number,limit?:number) => {
  return useQuery({
    queryKey: ["dealerships", searchQuery || "",page,limit],
    queryFn: () => fetchDealerships(searchQuery || "",page,limit),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


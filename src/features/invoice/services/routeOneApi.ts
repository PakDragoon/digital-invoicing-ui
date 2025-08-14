import api from "@/core/config/api"

export const routeOneService = {
  getRouteOneByVin: async (dealershipId: string | undefined, vin?: string) => {
    try {
      const response = await api.get(`/CreditApplicationDecision/${vin}`, {
        params: { dealershipId },
      })
      return response.data.data
    } catch (error) {
      console.error("Error fetching route one contract by VIN: ", error)
      throw error
    }
  },
}

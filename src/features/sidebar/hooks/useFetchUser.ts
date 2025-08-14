import api from "@/core/config/api"

export const fetchUserFromDB = async (id: string, dealershipId: string) => {
  const response = await api.get(`/employee/${id}`, {
    params: {
      dealershipId,
    },
  })

  return response.data
}

import { useMutation } from "@tanstack/react-query"
import api from "@/core/config/api"
import { toast } from "react-toastify"

interface UpdateEmployeePayload {
  dealershipId: string
  password: string
}

interface MutationParams {
  payload: UpdateEmployeePayload
  accessToken: string
  employeeId: string
}

const updatePassword = async ({ payload, accessToken, employeeId }: MutationParams) => {
  const response = await api.patch(`/employee/${employeeId}`, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  return response.data
}

export const useUpdatePassword = () =>
  useMutation({
    mutationFn: (params: MutationParams) => updatePassword(params),
    onSuccess: (data) => {
      toast.success("Password Reset Successfully!")
    },
    onError: (data) => {
        toast.success("Error Occured.!")
      },
  })

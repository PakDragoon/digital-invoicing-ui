import api from "@/core/config/api"
import { IUpdateEmployee } from "@/features/auth/components/ProfileForm"
import { ISignUpFormData } from "@/features/auth/schemas/signupSchema"

export const login = async (email: string, password: string) => {
  const isAdminEmail = email === "geraldchomer@relayauto.com"
  const endpoint = isAdminEmail ? "/admin/auth/login" : "/employee/auth/login"

  const response = await api.post(endpoint, {
    email,
    password,
  })

  return response.data
}

export const setFinanceInRotation = async (empId: string, dealershipId: string) => {
  try {
    const response = await api.post(`/finance/setFinanceInRotation`, {
      empId,
      dealershipId,
    })

    return response.data
  } catch (err) {
    console.error("Error setting finance manager in rotation", err)
    throw err
  }
}

export const logout = async (role: string, dealershipId?: string) => {
  const isAdmin = role === "Admin"
  const endpoint = isAdmin ? "/admin/auth/logout" : "/employee/auth/logout"

  try {
    await api.post(endpoint, { dealershipId })
  } catch (error) {
    console.error("Error while logging out:", error)
    return error
  }
}

export const getEmployee = async (id: string, dealershipId: string) => {
  try {
    const response = await api.get(`/employee/${id}`, { params: { dealershipId } })
    return response.data.data
  } catch (error) {
    console.error("Error fetching employee data:", error)
    throw error
  }
}

export const updateEmployee = async (payload: IUpdateEmployee, id: string, token?: string, role?: string) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    const isAdmin = role === "Admin"
    const endpoint = isAdmin ? `/admin/${id}` : `/employee/${id}`

    const finalPayload = isAdmin
      ? {
          fullName: `${payload.firstName ?? ""} ${payload.lastName ?? ""}`.trim(),
          ...(payload.password && { password: payload.password }),
        }
      : payload

    const response = await api.patch(endpoint, finalPayload, { headers })
    return response.data.data
  } catch (error) {
    console.error("Error updating employee data:", error)
    throw error
  }
}



export const getOnboardingRoles = async () => {
  try {
    const response = await api.get(`/role/onboarding`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching onboarding roles:", error)
    throw error
  }
}

export const getCompaniesName = async () => {
  try {
    const response = await api.get(`/company/name`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching companies' name:", error)
    throw error
  }
}

export const createDealership = async (payload: ISignUpFormData) => {
  try {
    const response = await api.post(`/dealership`, payload)
    return response.data.data
  } catch (error) {
    console.error("Error creating dealership:", error)
    throw error
  }
}

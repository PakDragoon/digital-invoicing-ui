export const addCustomerOptions = ["Waiting", "WithSalesperson", "Prospect", "Inactive", "Sold"]

export const sourceOptions = [
  "Fresh Up",
  "Appointment",
  "Mailer",
  "Credit Union",
  "Service",
  "Referral",
  "Phone",
  "Internet",
]

export const locationOptions = [
  "Showroom",
  "Service",
  "Lounge",
  "Front Lot",
  "Finance Waiting Room",
]

export const saleTypeOptions = ["New", "Used"]

export interface Salesperson {
  id: string
  companyId: string
  dealershipId: string
  roleId: string
  email: string
  hashpass: string
  firstName: string
  lastName: string
  phone: string
  isActive: boolean
  roleName: string
  dmsEmployeeId: string
  currentStatusId: string
  createdAt: string
  updatedAt: string
}

export interface SalespersonResponse {
  success: boolean
  message: string
  data: Salesperson[]
}

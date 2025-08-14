export interface Plate {
  id: string
  companyId: string
  dealershipId: string
  dealId: string
  dealVehicleId: string
  plateNumber: string
  plateStatus: string
  createdAt: string
  updatedAt: string
  salesperson01: string
  salesperson02: string | null
  customerName: string
  phone: string | null
  email: string | null
  make: string | null
  model: string | null
  color: string | null
  year: string | null
  age: string | null
}

export interface Pagination {
  total: number
  limit: number
  skip: number
  currentPage: number
  totalPages: number
}

export interface PlatesResponseData {
  data: Plate[]
  pagination: Pagination
}

export interface PlatesResponse {
  success: boolean
  message: string
  data: PlatesResponseData
}

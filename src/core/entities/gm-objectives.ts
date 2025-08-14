// Interface for a single GM Objective item
export interface GMObjective {
  id: string
  carline: string
  objectiveMonth: string
  objectiveYear: string
  factoryObjective: number
  internalObjective: number
  avgGross: number
  factoryGross: number
  totalGross: number | null
  salesType: string
  isEditable: boolean
  createdAt: string
  updatedAt: string
  prevMonthObjectives: number | null
  totalIncome?: number | null
  units?: number | null
  Department: string
}

// Interface for pagination metadata
export interface Pagination {
  total: number
  limit: number
  skip: number
  currentPage: number
  totalPages: number
}

// Interface for the data object containing the array and pagination
export interface GMObjectivesData {
  carlineData: GMObjective[]
  summary: SummaryData
  pagination: Pagination
}

// Main response interface
export interface GMObjectivesResponse {
  success: boolean
  message: string
  data: GMObjectivesData
}

export interface CreateObjectivePayload {
  carline: string
  model?: string | null
  factoryObjective: number
  internalObjective?: number | null
  avgGross?: number | null
  salesType: string
}

export interface CreateObjectiveResponse {
  success: boolean
  message: string
  data: {
    id: string
    carline: string
    model: string
    factoryObjective: number
    internalObjective: number
    avgGross: number
    salesType: string
    createdAt: string
    updatedAt: string
  }
}

export interface SummaryData {
  New: NewGMObjective
  Used: UsedGMObjective
  Finance: FinanceGMObjective
}

interface NewGMObjective {
  factory_objective: number
  internal_objective: number
  total_gross: number
  total_factory_gross: number
  dept_average: number
}

interface UsedGMObjective {
  total_objective: number
  certified_objective: number
  total_gross: number
  total_gross_certified: number
  dept_average: number
}

interface FinanceGMObjective {
  new_car: number
  used_car: number
  new_gross: number
  used_gross: number
  per_unit_average: number
}

interface Salesperson {
  employeeNumber: string
  salespersonName: string
  AssignedObjective: number
  SalesTableId: string
  DeptObjective: {
    NewDeptObjective: number
  }
  PrevMonthSales: number
  PrevMonthSalesObjective: number
  PrevMonthPercentageOfObjectives: string
  SalesPercentage: string
  SuggestedObjective: string
  SuggestedSalesObjective: {
    suggestedNewSalesObjective: string
    suggestedPOSalesObjective: string
  }
}

interface MainData {
  NewId: string
  NewDeptObjective: number
  TotalDeptObjective: number
  TotalPrevMonthObjective: number
  totalPrevMonthNewSales: number
  totalPrevMonthPOSales: number
  totalPrevMonthSales: number
  assignedNewObjective: number
  assignedUsedObjective: number
  prevMonthAssignedNewObjective: number
  prevMonthAssignedUsedObjective: number
  totalDepObjectiveNew: number
  totalDepObjectiveUsed: number
  DeptObjectiveNewId: string
  DeptObjectiveUsedId: string
  TotalPrevMonthDepObjectiveNew: number
  TotalPrevMonthDepObjectiveUsed: number
}

interface Pagination {
  total: number
  limit: number
  skip: number
  currentPage: number
  totalPages: number
}

export interface ObjectiveData {
  finalData: Salesperson[]
  main: MainData
  pagination: Pagination
}

export interface ObjectivesApiResponse {
  success: boolean
  message: string
  data: ObjectiveData
}

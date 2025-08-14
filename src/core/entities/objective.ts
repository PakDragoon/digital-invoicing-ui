interface SalesData {
  employeeNumber: string
  salespersonName: string
  SalesTableId: Record<string, unknown>
  DeptObjective: Record<string, unknown>
  PrevMonthSales: {
    salespersonPrevMonthNewSales: number | string
  }
  PrevMonthSalesObjective: {
    prevMonthNewSalesObjective: number
  }
  SalesPercentage: {
    newSalesPercentage: number
    poSalesPercentage: number
  }
  SuggestedSalesObjective: {
    suggestedNewSalesObjective: string
    suggestedPOSalesObjective: string
  }
}

interface MainData {
  TotalDeptObjective: number
  TotalPrevMonthObjective: number
  totalPrevMonthNewSales: number
  totalPrevMonthPOSales: number
  totalPrevMonthSales: number
}

export interface ObjectiveResponse {
  finalData: SalesData[]
  main: MainData
}

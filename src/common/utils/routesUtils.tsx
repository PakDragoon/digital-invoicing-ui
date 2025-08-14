import { ROUTES } from "../routes"

export const roleToDashboardRouteMap: Record<string, string> = {
  FinanceManager: ROUTES.FINANCE_MANAGER_DASHBOARD,
  SalesPerson: ROUTES.SALES_PERSON_DASHBOARD,
  SalesManager: ROUTES.USER_DASHBOARD,
}

export function getDashboardRouteByRole(role: string | null | undefined): string {
  if (!role) return ROUTES.DASHBOARD
  return roleToDashboardRouteMap[role] ?? ROUTES.DASHBOARD
}

export const tabToRoleMap: Record<string, { role: string; route: string }> = {
  "Finance Managers": {
    role: "FinanceManager",
    route: ROUTES.FINANCE_MANAGER_DASHBOARD,
  },
  "Sales Persons": {
    role: "SalesPerson",
    route: ROUTES.SALES_PERSON_DASHBOARD,
  },
  "Sales Managers": {
    role: "SalesManager",
    route: ROUTES.USER_DASHBOARD,
  },
}

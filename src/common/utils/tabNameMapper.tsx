  const tabNameMapper: { roles: string[]; page: string; tab: string }[] = [
  {
    roles: ["SalesManager", "SalesPerson", "Accountant", "GeneralManager"],
    page: "Sales",
    tab: "All Deals",
  },
  {
    roles: [
      "SalesManager",
      "Receptionist",
      "FinanceDirector",
      "FinanceAssistant",
      "SalesPerson",
      "GeneralManager",
      "FinanceManager"
    ],
    page: "Customer Log",
    tab: "All",
  },
  {
    roles: ["Receptionist"],
    page: "SalesPerson",
    tab: "All",
  },
  {
    roles: ["MakeReady"],
    page: "Make Ready",
    tab: "All",
  },
]
export const getTabName = (role: string, page: string): string | null => {
  for (const entry of tabNameMapper) {
    if (entry.roles.includes(role) && entry.page === page) {
      return entry.tab
    }
  }
  return null 
}
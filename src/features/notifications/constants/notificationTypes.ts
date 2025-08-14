import { QueryClient, Query } from "@tanstack/react-query";
import { Role } from '@/common/utils/roleUtils'

export enum NotificationType {
  CUSTOMER_VISIT = "CUSTOMER_VISIT",
  SALESPERSON_AVAILABLE = "SALESPERSON_AVAILABLE",
  DEAL_ASSIGN = "DEAL_ASSIGN",
  ACCEPT_DEAL = "ACCEPT_DEAL",
  DECLINE_DEAL = "DECLINE_DEAL",
  PRIORITY_DEAL_ASSIGN = "PRIORITY_DEAL_ASSIGN",
  PRIORITY_DEAL_DECLINE = "PRIORITY_DEAL_DECLINE",
  PRIORITY_DEAL_ACCEPT = "PRIORITY_DEAL_ACCEPT",
  MAKE_READY_UPDATE = "MAKE_READY_UPDATE",
  MAKE_READY_HOLD = "MAKE_READY_HOLD",
  MAKE_READY_COMMENT = "MAKE_READY_COMMENT",
  MAKE_READY_COMPLETE = "MAKE_READY_COMPLETE",
  DEAL_DOCUMENT_ADDED = "DEAL_DOCUMENT_ADDED",
  DEAL_DOCUMENT_RECEIVED = "DEAL_DOCUMENT_RECEIVED",
  DEAL_DOCUMENT_DELETED = "DEAL_DOCUMENT_DELETED",
  SALESPERSON_UPDATE = "SALESPERSON_UPDATE",
  NEW_MAKE_READY = "NEW_MAKE_READY",
  CUSTOMER_SIGNED_DEAL = "CUSTOMER_SIGNED_DEAL",
  DEAL_COMMENT = "DEAL_COMMENT",
  RETURNED_TO_FINANCE = "RETURNED_TO_FINANCE",
  DEAL_COMPLETED = "DEAL_COMPLETED",
  ACCOUNTING_COMPLETED = "ACCOUNTING_COMPLETED",
}

export const dealActionTypes = [
  "Accept Deal",
  "Decline Deal",
  "Deal Assign",
  "Deal Comment",
  "Customer Signed Deal",
  "Deal Document Added",
  "Deal Document Received",
  "Returned To Finance",
  "Accounting Completed",
  "Priority Deal Accept",
  "Priority Deal Decline",

]

export const makeReadyActionTypes = [
  "New Make Ready",
  "Make Ready Update",
  "Make Ready Hold",
  "Make Ready Comment",
  "Make Ready Complete",
]

export const customerActionTypes = ["Customer Visit", "Salesperson Update", "Salesperson Available"]

export const ROLE_CHANNELS: Record<Role, string[]> = {
  Receptionist: [
    'employee-status-change',
    'plate-change',
    'customer-change'
  ],
  SalesPerson: [
    'deal-change',
    'make-ready-change',
    'employee-status-change',
    'plate-change',
    'objective-change',
    'customer-change',
    'document-change'
  ],
  SalesManager: [
    'deal-change',
    'make-ready-change',
    'employee-status-change',
    'objective-change',
    'customer-change',
    'document-change'
  ],
  MakeReady: [
    'make-ready-change',
    'employee-status-change'
  ],
  FinanceManager: [
    'finance-queue-updated',
    'deal-change',
    'employee-status-change',
    'customer-change',
    'document-change'
  ],
  FinanceAssistant: [
    'deal-change',
    'employee-status-change',
    'customer-change',
    'document-change'
  ],
  FinanceDirector: [
    'deal-change',
    'employee-status-change',
    'customer-change',
    'document-change'
  ],
  Accountant: [
    'deal-change',
    'plate-change',
    'document-change'
  ],
  GeneralManager: [
    'deal-change',
    'employee-status-change',
    'objective-change',
    'customer-change',
    'document-change'
  ],
  Executive: [],
  Admin: [],
  DealLog: [],
  StatusLog: [],
}

export const invalidateQueries = {
  dashboardUpdate: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["financeDepartmentSummary"] })
    queryClient.invalidateQueries({ queryKey: ["financeManagerDashboardStats"] })
    queryClient.invalidateQueries({ queryKey: ["receptionistDashboard"] })
    queryClient.invalidateQueries({ queryKey: ["salesManagerSummary"] })
    queryClient.invalidateQueries({ queryKey: ["salesPersonDashboardStats"] })
    queryClient.invalidateQueries({ queryKey: ["summary", "gm"] })
    queryClient.invalidateQueries({ queryKey: ["summary", "make-ready"] })
    queryClient.invalidateQueries({ queryKey: ["accountantDashboardStats"] })
  },

  dealChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["getDealByDealNo"] })
    queryClient.invalidateQueries({ queryKey: ["getDealStatusHistory"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/daily"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/finance"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/not-delivered"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/finalized"] })
    queryClient.invalidateQueries({ queryKey: ["/deal"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/quote"] })
    queryClient.invalidateQueries({ queryKey: ["/FIManager/assigned-working"] })
    queryClient.invalidateQueries({ queryKey: ["/FIManager/accounting-returned"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/cit-logs"] })
    queryClient.invalidateQueries({ queryKey: ["finance-production"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/tab/signed"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/tab/finance-complete"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/tab/returned-in-accounting"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/tab/payoff"] })
    queryClient.invalidateQueries({ queryKey: ["/deal/sales-board"] })
    queryClient.invalidateQueries({ queryKey: ["/finance/getFinanceQueue"] })
    queryClient.invalidateQueries({ queryKey: ["production"] })
    queryClient.invalidateQueries({ queryKey: ["/production/managers?role=SalesManager"] })
    queryClient.invalidateQueries({ queryKey: ["/production/managers?role=FinanceManager"] })
    queryClient.invalidateQueries({ queryKey: ["/objective/salespeople-with-objective"] })
    queryClient.invalidateQueries({
      predicate: (query: Query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/objective/main')
    })
  },

  makeReadyChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["assignedMakeReady"] })
    queryClient.invalidateQueries({
      predicate: (query: Query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/make-ready')
    })
  },

  employeeStatusChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({
      predicate: (query: Query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/employee/get-salespersons-by-type')
    })
    queryClient.invalidateQueries({ queryKey: ["/employee/managers-overview/SalesManager"] })
    queryClient.invalidateQueries({ queryKey: ["/employee/managers-overview/FinanceManager"] })
    queryClient.invalidateQueries({ queryKey: ["/objective/salespeople-with-objective"] })
    queryClient.invalidateQueries({ queryKey: ["/production/managers?role=SalesManager"] })
    queryClient.invalidateQueries({ queryKey: ["/production/managers?role=FinanceManager"] })
  },

  plateChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["/plates"] })
    queryClient.invalidateQueries({ queryKey: ["/plates?plateStatus=Processing"] })
    queryClient.invalidateQueries({ queryKey: ["/plates?plateStatus=Received"] })
  },

  objectiveChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({
      predicate: (query: Query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/objective')
    })
  },

  customerChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({
      predicate: (query: Query) => typeof query.queryKey[0] === 'string' && query.queryKey[0].startsWith('/customer-visit')
    })
  },

  commentChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["getComments"] })
  },

  documentChange: (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: ["getDealDocuments"] })
  }
}

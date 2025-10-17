export interface Deal {
  id: string
  companyId: string
  createdBy: string
  visitId: string
  dealershipDealNo: string
  stock: string
  vehicleStatus: string
  relayDealType: string | null
  paymentMethod: string | null
  source: string | null
  dealStatus: DealStatus
  contractStatus: string
  contractFundedDate: Date | null
  contractType: boolean
  salesperson01: string
  salesperson02: string
  salesmanagerId: string
  financeManagerId: string | null
  estimatedDelivery: Date | null
  estimatedSalesGross: number //Float
  estimatedFinanceGross: number
  dealDate: Date
  businessMonth: string
  vehicleCondition: string
  financeCompleteDate: Date | null
  contractAmount: number //Float
  payoff: number //Float
  vehicleAge: number
  accountingStatus: AccountingStatus
  originalReturnDate: Date | null
  returnedBy: string | null
  createdAt: Date
  updatedAt: Date

  // DEAL VEHICLE DATA
  year: number | null
  make: string | null
  model: string | null
  modelNumber: string | null
  vin: string
  color: string | null
  interiorColor: string | null
  miles: number | null
  equipment: string | null
  certified: boolean | null
  coBuyerName?: string | null

  platesStatus: string
 
}

export enum DealStatus {
  Sold = "Sold",
  InProcess = "In Process",
  CustomerSigned = "Customer Signed",
  FinanceComplete = "Finance Complete",
  AdminBillReviewed = "Admin / Bill Reviewed",
  Finalized = "Finalized",
  Dead = "Dead",
  Pending = "Pending",
  Approved = "Approved",
  DealReturned = "Deal Returned",
  AccountingReturned = "Accounting Returned",
  Conditioned = "Conditioned",
  Scanned = "Scanned",
  Declined = "Declined",
  FinanceReturned = "Finance Returned",
  Quote = "Quote",
}

export enum PrismaDealStatus {
  Sold = "Sold",
  InProcess = "InProcess",
  CustomerSigned = "CustomerSigned",
  FinanceComplete = "FinanceComplete",
  AdminBillReviewed = "AdminBillReviewed",
  Finalized = "Finalized",
  Dead = "Dead",
  Pending = "Pending",
  Approved = "Approved",
  DealReturned = "DealReturned",
  AccountingReturned = "AccountingReturned",
  Conditioned = "Conditioned",
  Scanned = "Scanned",
  Declined = "Declined",
  FinanceReturned = "FinanceReturned",
  Quote = "Quote",
}

export enum AccountingStatus {
  ReturnedToFinance = "Returned to Finance",
  Completed = "Completed",
  Processing = "Processing",
  Pending = "Pending",
}

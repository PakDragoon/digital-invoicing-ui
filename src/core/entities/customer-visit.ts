export interface CustomerVisitEntity {
  id: bigint
  companyId: bigint
  dealershipId: bigint
  customerId: bigint
  source: string
  location: string
  vehicleInterest?: string | null
  visitStatus: VisitStatus
  acceptedAt?: Date | null
  requestedSalespersonId?: bigint | null
  assignedSalespersonId?: bigint | null
  createdBy: bigint
  salesType: SalesType
  createdAt?: Date
  updatedAt?: Date
}

export enum VisitStatus {
  Waiting = "Waiting",
  WithSalesperson = "With Salesperson",
  Prospect = "Prospect",
  NotAssigned = "NotAssigned",
  Sold = "Sold",
}

export enum SalesType {
  New = "New",
  Used = "Used",
}

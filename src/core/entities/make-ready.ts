export interface MakeReadyEntity {
  id: bigint
  companyId: bigint
  dealId: bigint
  dateNeeded: Date | null
  assignedTo: bigint | null
  status: MakeReadyStatus
  mrDeliveryDate?: Date | null
  createdAt?: Date
  updatedAt?: Date
}

export enum MakeReadyStatus {
  MakeReadyAssigned = "MakeReadyAssigned",
  InProcess = "InProcess",
  Hold = "Hold",
  Completed = "Completed",
}

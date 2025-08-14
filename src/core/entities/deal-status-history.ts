export interface IDealStatusHistoryResponse {
  id: string
  dealId: string
  previousStatus: string
  newStatus: string
  updatedBy: string
  updatedByRole: string
  updatedAt: Date
}

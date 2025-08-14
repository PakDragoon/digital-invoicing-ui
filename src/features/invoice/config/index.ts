import React from "react"
import { PrismaDealStatus } from "@/core/entities/deal"

export type StatusHistoryEntry = {
  id: string
  dealId: string
  newStatus: string
  previousStatus: string | null
  updatedByRole: string
  updatedBy: string
  updatedAt: string
}

export const dealStatusRadiosLeft: { label: React.ReactNode; value: PrismaDealStatus }[] = [
  { label: "Pending", value: PrismaDealStatus.Pending },
  { label: "Deal in Process", value: PrismaDealStatus.InProcess },
  { label: "APP W/COND", value: PrismaDealStatus.Conditioned },
  { label: "Approved", value: PrismaDealStatus.Approved },
  { label: "Decline", value: PrismaDealStatus.Declined },
  { label: "Customer Signed", value: PrismaDealStatus.CustomerSigned },
]

export const financeCompleteStatusRadio: { label: React.ReactNode; value: PrismaDealStatus }[] = [
  { label: "Finance Complete", value: PrismaDealStatus.FinanceComplete },
]

export const dealStatusRadiosRight: { label: React.ReactNode; value: PrismaDealStatus }[] = [
  { label: "Accounting Returned", value: PrismaDealStatus.AccountingReturned },
  { label: "Deal Finalized", value: PrismaDealStatus.Finalized },
  { label: "Deal Scanned", value: PrismaDealStatus.Scanned },
  { label: "Dead Deal", value: PrismaDealStatus.Dead },
]

export const contractTypeRadios: { label: string; value: boolean }[] = [
  { label: "Paper", value: false },
  { label: "E-Contract", value: true },
]

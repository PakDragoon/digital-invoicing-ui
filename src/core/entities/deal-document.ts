export interface DealDocument {
  id: string
  companyId: string
  dealId: string
  docTypeId: string
  uploadDatetime: Date
  uploadedBy: string
  receivedDateTime: Date | null
  receivedBy: bigint | null
  isReceived: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IDealDocumentResponse {
  id: string
  companyId: string
  dealId: string
  docTypeId: string
  docTypeName: string
  uploadedBy: string
  uploaderName: string
  uploadDatetime: string
  isReceived: boolean
  receivedBy: string | null
  receiverName: string | null
  receivedDateTime: string | null
}

export interface EquipmentEntity {
  id: bigint
  companyId: bigint
  dealershipId: bigint
  makereadyId: bigint
  equipmentDescription: string | null
  equipmentStatus: boolean | null
  createdAt: Date
  updatedAt: Date
}

export interface EquipmentEntity {
  id: bigint
  companyId: bigint
  makereadyId: bigint
  equipmentDescription: string | null
  equipmentStatus: boolean | null
  createdAt: Date
  updatedAt: Date
}

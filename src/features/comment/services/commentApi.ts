import { EntityType } from "@/common/constants/comment"
import api from "@/core/config/api"
import { useAuthStore } from "@/features/auth/stores/authStore"

export const commentService = {
  createComment: async (entityType: EntityType, entityId: string | number, commentBody: string) => {
    const { user } = useAuthStore.getState()
    const dealershipId = (user?.dealershipId ?? "").toString()
    const companyId = (user?.companyId ?? "").toString()
    const commentToSave = {
      entityType,
      entityId: String(entityId),
      commentBody,
      dealershipId,
      companyId,
    }

    try {
      const { data } = await api.post("/comment", commentToSave)
      return data
    } catch (error) {
      console.error(`Error saving ${entityType} comment for ID ${entityId}: `, error)
    }
  },
}

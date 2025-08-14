import React from "react"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { BreadCrumb } from "@/common/components/breadcrumb/BreadCrumb"
import { humanize } from "@/common/utils/humanize"
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore"
import { getDashboardRouteByRole } from "@/common/utils/routesUtils"
import ProfileForm from "@/features/auth/components/ProfileForm"

function ProfilePage() {
  const { user } = useAuthStore.getState()
  const dealershipId: string = user!.dealershipId!.toString()
  const role = useAuthStore((state) => state.user?.role ?? null)
  const { viewingEmployee } = useViewingEmployeeStore()
  const ViewinguserRole = viewingEmployee?.role ? viewingEmployee.role : role
  const humanizedRole = humanize(ViewinguserRole)
  const rootPath = viewingEmployee
    ? getDashboardRouteByRole(viewingEmployee.role)
    : getDashboardRouteByRole(role)
  if (!dealershipId) return null

  return (
    <div className="flex h-auto flex-col">
      <BreadCrumb rootLabel={humanizedRole} rootPath={rootPath} />
      <ProfileForm />
    </div>
  )
}

export default ProfilePage

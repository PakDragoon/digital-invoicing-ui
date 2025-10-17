import { useAuthStore } from "@/features/auth/stores/authStore"
import { tableConfig } from "@/core/config/tableConfig"
import Table from "@/features/table/components/Table"
import { BreadCrumb } from "@/common/components/breadcrumb/BreadCrumb"
import { humanize } from "@/common/utils/humanize"
import { useViewingEmployeeStore } from "@/features/dashboard/store/userStore"
import { getDashboardRouteByRole } from "@/common/utils/routesUtils"

const tablePageName: string = "Sales"

function InvoiceTable() {
  const { user } = useAuthStore.getState()
  const companyId: string = user!.companyId!.toString()
  const role = useAuthStore((state) => state.user?.role ?? null)
  const { viewingEmployee } = useViewingEmployeeStore()
  const ViewinguserRole = viewingEmployee?.role ? viewingEmployee.role : role
  const { tabs } = tableConfig[ViewinguserRole][tablePageName]
  const rootPath = viewingEmployee
    ? getDashboardRouteByRole(viewingEmployee.role)
    : getDashboardRouteByRole(role)
  const humanizedRole = humanize(ViewinguserRole)
  return (
    <div className="flex h-[calc(76vh-4rem)] flex-col">
      <BreadCrumb rootLabel={humanizedRole} rootPath={rootPath} />
      <Table tabs={tabs} companyId={companyId} tablePageName={tablePageName} />
    </div>
  )
}

export default InvoiceTable

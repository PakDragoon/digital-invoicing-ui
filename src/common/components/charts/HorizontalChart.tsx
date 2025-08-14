import React from "react"
import Trend, { TrendStatusEnum } from "../widgets/Trend"
import { useAuthStore } from "@/features/auth/stores/authStore"

interface HorizontalChartProps {
  total?: number
  available?: number
  assigned?: number
  customersWaiting?: number
}

const HorizontalChart: React.FC<HorizontalChartProps> = ({
  total = 0,
  available = 0,
  assigned = 0,
  customersWaiting = 0,
}) => {
  const availablePercentage = total ? (available / total) * 100 : 0
  const assignedPercentage = total ? (assigned / total) * 100 : 0
  const userRole: string | undefined = useAuthStore((state) => state.user?.role)

  return (
    <div className="px-3 py-6 xl:px-6">
      <div className="flex h-[25.4375rem] w-full flex-col justify-center gap-8 rounded-md bg-lightBg">
        <div className="">
          <p className="text-[2.25rem] font-semibold leading-10 text-screamin-700">{total}</p>
          <p className="text-sm font-medium text-shark-500">Total Salesperson</p>
        </div>
        <div>
          <div className="mb-5">
            <p className="mb-1 text-xs font-medium text-shark-500">
              Available Salespersons{" "}
              <span className="text-right text-[1rem] text-base font-medium leading-6 tracking-normal text-cerulean-600">
                {available}
              </span>
            </p>
            <div className="h-[1.9375rem] w-full overflow-hidden rounded-md bg-shark-100">
              <div
                className="h-full rounded-md bg-cerulean-600"
                style={{ width: `${availablePercentage}%` }}
              />
            </div>
          </div>

          <div className="">
            <p className="mb-1 text-xs font-medium text-shark-500">
              Assigned to Customers{" "}
              <span className="text-right text-[1rem] text-base font-medium leading-6 tracking-normal text-oldlace-400">
                {assigned}
              </span>
            </p>
            <div className="h-[1.9375rem] w-full overflow-hidden rounded-md bg-shark-100">
              <div
                className="h-full rounded-md bg-oldlace-400"
                style={{ width: `${assignedPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {userRole === "SalesManager" && (
          <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
            <p className="text-xs font-medium text-shark-500">Customers Waiting</p>
            <div className="flex h-[1.75rem] w-fit items-center rounded bg-screamin-100 px-2 py-1 text-xs font-semibold text-screamin-600">
              {customersWaiting}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HorizontalChart

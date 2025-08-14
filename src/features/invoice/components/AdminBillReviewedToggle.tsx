import React from "react"
import { PrismaDealStatus } from "@/core/entities/deal"
import { StatusHistoryEntry } from "@/features/invoice/config"
import { formatStatusHistoryDateTime } from "@/features/invoice/utils/dealUtils"
import { IFinanceData } from "@/common/components/cards/FinanceStatusCard"

interface Props {
  isDisabled: boolean
  financeData: IFinanceData
  statusHistory: Partial<Record<string, StatusHistoryEntry>>
  handleChange: (key: string, value: PrismaDealStatus) => void
}

export const AdminBillReviewedToggle: React.FC<Props> = ({
  isDisabled,
  financeData,
  statusHistory,
  handleChange,
}) => {
  const isAdminBillingStatus = (
    [PrismaDealStatus.DealReturned, PrismaDealStatus.AdminBillReviewed] as PrismaDealStatus[]
  ).includes(financeData.dealStatus as PrismaDealStatus)

  let selectedEntry: StatusHistoryEntry | undefined
  const adminBillEntry = statusHistory[PrismaDealStatus.AdminBillReviewed]
  const dealReturnEntry = statusHistory[PrismaDealStatus.DealReturned]

  if (adminBillEntry && dealReturnEntry)
    selectedEntry =
      new Date(adminBillEntry.updatedAt) > new Date(dealReturnEntry.updatedAt)
        ? adminBillEntry
        : dealReturnEntry
  else selectedEntry = adminBillEntry ?? dealReturnEntry

  const hasHistory = !!selectedEntry
  const threeWayRadioBtnBaseStyle =
    "w-5 h-5 rounded-full flex justify-center items-center text-xs font-medium cursor-pointer"

  return (
    <div>
      <p className={`${isDisabled ? "text-shark-300" : "text-shark-500"} mb-[0.35rem] font-medium`}>
        Admin Billing Reviewed
      </p>
      <div className="flex items-center gap-2">
        <span className={`${isDisabled ? "text-shark-300" : ""}`}>RET</span>
        <div className="w-17 relative flex h-6 cursor-pointer select-none items-center justify-between rounded-full bg-gray-200 px-1">
          <input
            type="radio"
            id="position-left"
            name="adminStatus"
            value={PrismaDealStatus.DealReturned}
            checked={financeData.dealStatus === PrismaDealStatus.DealReturned}
            disabled={isDisabled}
            className="peer/left sr-only"
            onChange={() => handleChange("dealStatus", PrismaDealStatus.DealReturned)}
          />
          <label
            htmlFor="position-left"
            className={`peer-checked/left:text-white ${threeWayRadioBtnBaseStyle} ${isDisabled ? "peer-checked/left:bg-shark-400" : "peer-checked/left:bg-cerulean-600"}`}
          />
          <input
            type="radio"
            id="position-center"
            name="adminStatus"
            value="center"
            disabled={isDisabled}
            className="peer/center sr-only"
            checked={!isAdminBillingStatus}
          />
          <label
            htmlFor="position-center"
            className={`peer-checked/center:text-white ${threeWayRadioBtnBaseStyle} ${isDisabled ? "peer-checked/center:bg-shark-400" : "peer-checked/center:bg-cerulean-600"}`}
          />
          <input
            type="radio"
            id="position-right"
            name="adminStatus"
            value={PrismaDealStatus.AdminBillReviewed}
            checked={
              financeData.dealStatus === PrismaDealStatus.AdminBillReviewed ||
              (selectedEntry?.newStatus === PrismaDealStatus.AdminBillReviewed &&
                !isAdminBillingStatus)
            }
            disabled={isDisabled}
            className="peer/right sr-only"
            onChange={() => handleChange("dealStatus", PrismaDealStatus.AdminBillReviewed)}
          />
          <label
            htmlFor="position-right"
            className={`peer-checked/right:text-white ${threeWayRadioBtnBaseStyle} ${isDisabled ? "peer-checked/right:bg-shark-400" : "peer-checked/right:bg-cerulean-600"}`}
          />
        </div>
        <span className={`${isDisabled ? "text-shark-300" : ""}`}>
          APP
          {hasHistory && (
            <span className="ml-2 text-xs text-shark-400">
              by {`${selectedEntry?.updatedByRole} - ${selectedEntry?.updatedBy}`}
            </span>
          )}
        </span>
      </div>
      {hasHistory && (
        <p className="mt-1 text-xs text-shark-400">
          {formatStatusHistoryDateTime(selectedEntry?.updatedAt)}
        </p>
      )}
    </div>
  )
}

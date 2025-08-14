import React from "react"
import { Deal, PrismaDealStatus } from "@/core/entities/deal"
import { formatStatusHistoryDateTime } from "@/features/invoice/utils/dealUtils"
import { StatusHistoryEntry } from "@/features/invoice/config"
import Modal from "@/common/components/modal/NewModal"
import EditDeal from "./AccountantDealEdit"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { IFinanceData } from "@/common/components/cards/FinanceStatusCard"

interface Props {
  isDisabled: boolean
  financeData: IFinanceData
  statusHistory: Partial<Record<string, StatusHistoryEntry>>
  handleChange: (key: string, value: PrismaDealStatus) => void
  radioButtons: any
  extendedFinanceData?: Deal
}

export const DealStatusRadioButtons: React.FC<Props> = ({
  isDisabled,
  financeData,
  statusHistory,
  handleChange,
  radioButtons,
  extendedFinanceData,
}) => {
  const { user } = useAuthStore.getState()
  const userRole = user?.role

  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      {radioButtons.map(({ label, value }) => {
        const statusEntry = statusHistory?.[value]
        const hasHistory = !!statusEntry

        return (
          <label
            key={value}
            className={`flex items-center gap-2 ${isDisabled ? "text-shark-300" : "text-shark-900"} font-regular mb-[0.35rem] text-sm`}
          >
            <input
              type="radio"
              name="status"
              className="form-radio h-[1rem] w-[1rem]"
              value={value}
              checked={financeData.dealStatus === value}
              onChange={() => handleChange("dealStatus", value)}
              disabled={isDisabled}
            />
            <div className="flex flex-col">
              <span>
                {label}{" "}
                {hasHistory && (
                  <span className="text-xs text-shark-400">
                    {` by ${statusEntry.updatedByRole} - ${statusEntry.updatedBy}`}
                  </span>
                )}
              </span>
              {hasHistory && (
                <span className="text-xs text-shark-400">
                  {formatStatusHistoryDateTime(statusEntry.updatedAt)}
                </span>
              )}
            </div>

            {["FinanceManager", "FinanceDirector", "FinanceAssistant"].includes(userRole ?? "") &&
              label === "Accounting Returned" &&
              financeData.dealStatus === value && (
                <button
                  type="button"
                  onClick={openModal}
                  className="regular-text-sm text-cerulean-600 underline underline-offset-1"
                >
                  View Details
                </button>
              )}
          </label>
        )
      })}

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit Deal Details">
        <EditDeal data={extendedFinanceData} onClose={closeModal} />
      </Modal>
    </>
  )
}

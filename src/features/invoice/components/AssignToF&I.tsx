import React, { useEffect, useState } from "react"
import { dealService } from "../services/dealApi"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { useDealStore } from "../store/dealStore"
import { useModalStore } from "@/common/components/modal/store/modalStore"
import { LinkSentIcon, LockIcon, RotationIcon } from "@/assets"
import Modal from "@/common/components/modal/Modal"
import { createModalConfigs } from "@/common/utils/modalConfigs"
import { IDealInAssignQueue } from "../hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface Employee {
  firstName: string
  lastName: string
}

interface Manager {
  FIManagerNo: string
  employee: Employee
  DayCount: number
}

export const AssignDealToFin = () => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore.getState()
  const companyId: string = user!.companyId!.toString()
  const { createdDealId, showRotation, isReassign } = useDealStore()
  const { closeAssignDeal } = useModalStore()
  const [managers, setManagers] = useState<Manager[]>([])
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null)
  const { setCurrentModal, currentModal, toggleDisableModalButton, openMakeReadyModal } =
    useModalStore()

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await dealService.fetchManagers(companyId)
        setManagers(response ?? [])
      } catch (error) {
        console.error("Error fetching managers:", error)
      }
    }

    fetchManagers()
  }, [companyId])

  const handleManagerSelect = (id: string) => {
    if (selectedManagerId === id) setSelectedManagerId(null)
    else setSelectedManagerId(id)
  }

  const assignQueueMutation = useMutation({
    mutationFn: async ({ fn }: { fn: () => Promise<any> }) => await fn(),

    onSuccess: (updatedData) => {
      queryClient.setQueryData(
        ["getDealInAssignQueue", createdDealId],
        (oldData: IDealInAssignQueue | undefined) => {
          if (!oldData) return oldData
          return { ...oldData, dealId: updatedData.data.RelayDealId }
        }
      )

      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === `/finance/getFinanceQueue`,
      })
    },

    onError: (error) => {
      console.error("Error:", error)
    },

    onSettled: () => {
      toggleDisableModalButton()
    },
  })

  const handleAssign = async () => {
    if (!createdDealId || !selectedManagerId) {
      console.warn("Deal ID or Manager ID missing")
      return
    }

    try {
      toggleDisableModalButton()

      await assignQueueMutation.mutateAsync({
        fn: () =>
          dealService.AssignDealToFinManager(
            String(createdDealId),
            selectedManagerId,
            companyId
          ),
      })

      setCurrentModal("dealCreated")
    } catch (error) {
      console.error("Failed to assign deal:", error)
    }
  }

  const sendDealInRotation = async () => {
    if (!createdDealId) {
      console.warn("Deal ID or Manager ID missing")
      return
    }

    try {
      toggleDisableModalButton()
      await assignQueueMutation.mutateAsync({
        fn: () => dealService.SendDealToRotation(createdDealId, companyId),
      })

      setCurrentModal("dealCreated")
    } catch (error) {
      console.error("Error sending deal to rotation:", error)
    }
  }

  const setDealAsPriority = async () => {
    if (!createdDealId) {
      console.warn("Deal ID or Manager ID missing")
      return
    }

    try {
      toggleDisableModalButton()
      await assignQueueMutation.mutateAsync({
        fn: () => dealService.SetDealAsPriority(createdDealId, companyId),
      })

      setCurrentModal("dealCreated")
    } catch (error) {
      console.error("Error setting deal as priority:", error)
    }
  }
  const MODAL_CONFIGS = createModalConfigs({
    setCurrentModal,
    LockIcon,
    LinkSentIcon,
    closeAssignDeal,
    openMakeReadyModal,
  })

  return (
    <div className="w-[39.375rem] space-y-6 p-4">
      <div
        className={`' grid items-center justify-items-center px-4 py-2 text-center text-[14px] font-normal text-blue-500 ${
          showRotation ? "grid-cols-4" : "grid-cols-2"
        }`}
      >
        <span className="justify-self-start">Manager</span>
        {showRotation && (
          <>
            <span>Status</span>
            <span>Turns</span>
          </>
        )}

        <span>Request</span>
      </div>

      {managers.length > 0 ? (
        managers.map((manager) => (
          <div
            key={manager.FIManagerNo}
            className={`grid cursor-pointer items-center justify-items-center rounded-lg px-4 py-3 text-shark-900 ${
              selectedManagerId === manager.FIManagerNo ? "bg-blue-50" : "hover:bg-gray-100"
            } ${showRotation ? "grid-cols-4" : "grid-cols-2"}`}
            onClick={() => handleManagerSelect(manager.FIManagerNo)}
          >
            <div className="justify-self-start">
              {manager.employee.firstName} {manager.employee.lastName}
            </div>

            {showRotation && (
              <>
                <div>Available</div>
                <div>{manager.DayCount}</div>
              </>
            )}

            <div className="flex justify-center">
              <input
                type="radio"
                checked={selectedManagerId === manager.FIManagerNo}
                onChange={() => handleManagerSelect(manager.FIManagerNo)}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="grid items-center justify-items-center rounded-lg px-4 py-3">
          No Managers Available
        </div>
      )}

      <button
        onClick={handleAssign}
        className="font-sm h-[44px] w-full rounded-[4px] bg-cerulean-600 py-2 text-white hover:bg-blue-700"
      >
        Assign Deal
      </button>
      {showRotation && !isReassign && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div
              onClick={sendDealInRotation}
              className="cursor-pointer items-center justify-items-center rounded-lg bg-[#F0F4FE] px-[10px] py-6 text-center"
            >
              <p className="mb-4 w-[8.75rem] text-sm text-shark-400">
                Send deal to finance department
              </p>
              <span className="flex items-center justify-center gap-2 text-[12px] font-normal text-cerulean-600">
                Rotation <img src={RotationIcon} />
              </span>
            </div>
            <div
              onClick={setDealAsPriority}
              className="cursor-pointer items-center justify-items-center rounded-lg bg-[#F0F4FE] px-[10px] py-6 text-center"
            >
              <p className="mb-4 w-[18.063] text-sm text-shark-400">
                This is a priority deal has priority overall deals in finance queue
              </p>
              <span className="flex items-center justify-center gap-2 text-[12px] font-normal text-red-600">
                Priority <img src={RotationIcon} />
              </span>
            </div>
          </div>
        </>
      )}

      {currentModal && (
        <Modal
          isOpen={true}
          onClose={() => setCurrentModal(null)}
          heading={MODAL_CONFIGS[currentModal].heading}
          buttonText={MODAL_CONFIGS[currentModal].buttonText}
          onButtonClick={() => MODAL_CONFIGS[currentModal].onButtonClick?.()}
          icon={MODAL_CONFIGS[currentModal].icon}
          size="w-[30.5rem] h-[26.4375rem]"
          iconBgClass={MODAL_CONFIGS[currentModal].iconBgClass}
          headingClass="text-shark-500 mb-[1rem]"
          buttonClass={MODAL_CONFIGS[currentModal].buttonClass}
        >
          {MODAL_CONFIGS[currentModal].content}
        </Modal>
      )}
    </div>
  )
}

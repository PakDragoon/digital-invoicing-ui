// stores/useModalStore.ts
import { ModalType } from "@/common/utils/modalConfigs"
import { create } from "zustand"

interface ModalStore {
  isCreateDealOpen: boolean
  isMakeReadyOpen: boolean
  isTableRowEditOpen: boolean
  isDealEditOpen: boolean
  currentModal: ModalType | null
  disableModalButton: boolean
  isFilterOpen: boolean
  isFilterLoading: boolean
  isAssigDealToFinOpen: boolean
  isNewObjectiveOpen: boolean
  isUsedObjectiveOpen: boolean
  isFinanceObjectiveOpen: boolean
  isNotifySalesPersonOpen: boolean
  isCustomerModalOpen: boolean
  isSendToFinanceEdit: boolean

  setSendToFinanceEdit: (v: boolean) => void
  closeCustomerModal: () => void
  openCustomerModal: () => void

  openCreateDealModal: () => void
  closeCreateDealModal: () => void

  openNewObjModal: () => void
  closeNewObjModal: () => void

  openUsedObjModal: () => void
  closeUsedObjModal: () => void

  openFinanceObjModal: () => void
  closeFinanceObjModal: () => void

  openMakeReadyModal: () => void
  closeMakeReadyModal: () => void
  openEditDeal: () => void
  closeEditDeal: () => void
  openTableRowEdit: () => void
  closeTableRowEdit: () => void
  toggleDisableModalButton: () => void
  toggleFilterModal: () => void
  setFilterLoading: (value: boolean) => void
  openAssignDeal: () => void
  closeAssignDeal: () => void
  openNotifySalesperson: () => void
  closeNotifySalesperson: () => void
  setCurrentModal: (modal: ModalType | null) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  isCreateDealOpen: false,
  isMakeReadyOpen: false,
  isTableRowEditOpen: false,
  currentModal: null,
  disableModalButton: false,
  isDealEditOpen: false,
  isSendToFinanceEdit: false,
  isFilterOpen: false,
  isFilterLoading: false,
  isAssigDealToFinOpen: false,
  isNewObjectiveOpen: false,
  isUsedObjectiveOpen: false,
  isFinanceObjectiveOpen: false,

  isNotifySalesPersonOpen: false,
  isCustomerModalOpen: false,

  openCreateDealModal: () => set({ isCreateDealOpen: true }),
  closeCreateDealModal: () => set({ isCreateDealOpen: false }),

  openNewObjModal: () => set({ isNewObjectiveOpen: true }),
  closeNewObjModal: () => set({ isNewObjectiveOpen: false }),

  openUsedObjModal: () => set({ isUsedObjectiveOpen: true }),
  closeUsedObjModal: () => set({ isUsedObjectiveOpen: false }),

  openFinanceObjModal: () => set({ isFinanceObjectiveOpen: true }),
  closeFinanceObjModal: () => set({ isFinanceObjectiveOpen: false }),
  openMakeReadyModal: () => set({ isMakeReadyOpen: true }),
  closeMakeReadyModal: () => set({ isMakeReadyOpen: false }),
  openEditDeal: () => set({ isDealEditOpen: true }),
  closeEditDeal: () => set({ isDealEditOpen: false }),
  setSendToFinanceEdit: (v: boolean) => set({ isSendToFinanceEdit: v }),
  openTableRowEdit: () => set({ isTableRowEditOpen: true }),
  closeTableRowEdit: () => set({ isTableRowEditOpen: false }),
  toggleDisableModalButton: () =>
    set((state) => ({ disableModalButton: !state.disableModalButton })),
  toggleFilterModal: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  setFilterLoading: (value: boolean) => set({ isFilterLoading: value }),
  openAssignDeal: () => set({ isAssigDealToFinOpen: true }),
  closeAssignDeal: () => set({ isAssigDealToFinOpen: false }),

  openNotifySalesperson: () => set({ isNotifySalesPersonOpen: true }),
  closeNotifySalesperson: () => set({ isNotifySalesPersonOpen: false }),
  setCurrentModal: (modal) => set({ currentModal: modal }),

  closeCustomerModal: () => set({ isCustomerModalOpen: false }),
  openCustomerModal: () => set({ isCustomerModalOpen: true }),
}))

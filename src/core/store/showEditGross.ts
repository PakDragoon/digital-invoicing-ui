import { create } from "zustand"

type OpenModalFlagStore = {
  openModal: boolean
  setOpenModal: (value: boolean) => void
  toggleOpenModal: () => void
}

export const useSetOpenModalStore = create<OpenModalFlagStore>((set) => ({
  openModal: false,
  setOpenModal: (value) => set({ openModal: value }),
  toggleOpenModal: () => set((state) => ({ openModal: !state.openModal })),
}))

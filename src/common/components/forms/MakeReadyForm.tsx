import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import CustomButton, { VariantType } from "../buttons/CustomButton"
import TextField from "../inputs/CustomTextField"
import { createModalConfigs } from "@/common/utils/modalConfigs"
import { useModalStore } from "../modal/store/modalStore"
import Modal from "../modal/Modal"
import { Add, LinkSentIcon, LockIcon } from "@/assets"
import {
  IItems,
  MakeReadyFields,
  MakeReadyFormData,
} from "@/features/makeready/makeready-form/MakeReadyFormConfig"
import { InitialFormData } from "@/features/invoice/deal-form/CreateDealFieldConfig"
import MakeReadyInputField from "@/features/makeready/components/MakeReadyInputFields"

import { FaTrash } from "react-icons/fa"
import ListComments from "@/features/comment/components/ListComments"
import { EntityType } from "@/common/constants/comment"
import { getMRStatusLabel } from "@/features/makeready/utils/makereadyUtils"

interface ButtonConfig {
  key: string
  idleText: string
  loadingText?: string
  onClick: (data: any) => Promise<void>
  variant: VariantType
  popup?: string
}

interface Props {
  title?: string
  dealNo?: string
  dealFields: MakeReadyFields[]
  initialFormData: InitialFormData
  loading: Record<string, boolean>
  buttons: ButtonConfig[]
  setDealershipDealNo?: React.Dispatch<React.SetStateAction<string>>
  populatedData?: Omit<MakeReadyFormData, "salesperson1Id" | "salesperson2Id" | "assignedToId">
  equipments: { id?: string; name: string; delete: boolean; status: boolean; isTemp?: boolean }[]
  setEquipments: React.Dispatch<
    React.SetStateAction<
      { id?: string; name: string; delete: boolean; status: boolean; isTemp?: boolean }[]
    >
  >
}

const MakeReadyForm: React.FC<Props> = ({
  dealNo,
  dealFields,
  initialFormData,
  loading,
  buttons,
  setDealershipDealNo,
  populatedData,
  equipments,
  setEquipments,
}) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
    reset,
  } = useForm({ mode: "onChange", defaultValues: initialFormData })
  const {
    currentModal,
    setCurrentModal,
    closeCreateDealModal,
    openMakeReadyModal,
    closeMakeReadyModal,
    closeTableRowEdit,
  } = useModalStore()

  const [inputValue, setInputValue] = React.useState<string>("")
  const dealershipDealNo = watch("dealershipDealNo")

  useEffect(() => {
    setDealershipDealNo?.(dealershipDealNo)
  }, [dealershipDealNo])

  const MODAL_CONFIGS = createModalConfigs({
    setCurrentModal,
    LockIcon,
    LinkSentIcon,
    closeCreateDealModal,
    openMakeReadyModal,
    closeMakeReadyModal,
    closeEditMakeReady: closeTableRowEdit,
  })
  const currentConfig = currentModal ? MODAL_CONFIGS[currentModal] : null
  useEffect(() => {
    reset(populatedData)
  }, [populatedData])
  const formSections = [{ title: "Deal Information", fields: dealFields }]

  const wrappedButtons = buttons.map(({ key, idleText, loadingText, onClick, variant, popup }) => ({
    key,
    text: loading[key] ? (loadingText ?? idleText) : idleText,
    variant,
    onClick: handleSubmit(onClick),
    disabled: !isValid || loading[key],
    popup,
  }))

  const addItem = () => {
    if (inputValue.trim() !== "") {
      setEquipments((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          name: inputValue,
          delete: false,
          status: false,
          isTemp: true,
        },
      ])
      setInputValue("")
    }
  }

  const removeItem = (itemToRemove: IItems) => {
    setEquipments((prev) =>
      prev.map((item) => (item.id === itemToRemove.id ? { ...item, delete: true } : item))
    )
  }

  const checkItem = (itemToToggle: IItems) => {
    setEquipments((prev) =>
      prev.map((item) => (item.id === itemToToggle.id ? { ...item, status: !item.status } : item))
    )
  }

  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.938rem]">
        {formSections.map(({ title, fields }, index) => (
          <React.Fragment key={index}>
            <div className="flex justify-between">
              <span className="semibold-text-sm text-cerulean-600">{title}</span>
              {initialFormData?.status && (
                <span className="semibold-text-md text-oldlace-700">
                  Status: {getMRStatusLabel(initialFormData?.status)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem] shadow-md">
              {fields.map((item) => (
                <MakeReadyInputField
                  key={item.field}
                  {...{ dealNo, data: item, control, type: item.type }}
                />
              ))}
            </div>
          </React.Fragment>
        ))}
        <span className="semibold-text-sm text-cerulean-600">Equipment / Adds</span>

        <div className="flex flex-col gap-4 rounded-md px-4 py-6 shadow-md">
          <div className="flex flex-wrap gap-4">
            {equipments
              .filter((item) => !item.delete)
              .map((item) => (
                <div key={item.id} className="flex items-center rounded-md bg-[#FFF9EC] pr-3">
                  <div className="grid h-[56px] w-[142px] place-content-center rounded-md bg-[#FFF9EC] px-2">
                    <span className="text-center text-xs font-normal">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-5 pl-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 cursor-pointer rounded border border-gray-400 accent-cerulean-500"
                      checked={item.status === true}
                      onChange={() => checkItem(item)}
                    />

                    <span
                      onClick={() => removeItem(item)}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-4">
            <input
              placeholder="Enter Input Name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-[56px] w-[142px] rounded-md border border-[#CDD0D4] px-2 text-xs outline-none focus:border-cerulean-500"
            />

            <button
              onClick={addItem}
              className="grid h-[56px] w-[142px] place-content-center rounded-md border border-dashed border-[#666B74] px-2"
            >
              <div className="flex items-center gap-2 text-sm text-[#3A3C3F]">
                <img src={Add} alt="Add" />
                <span>Add New Item</span>
              </div>
            </button>
          </div>
        </div>

        <span className="semibold-text-sm text-cerulean-600">Comments</span>
        {initialFormData?.id ? (
          <ListComments
            entityId={initialFormData.id}
            entityType={EntityType.MakeReady}
            isReadOnly={false}
          />
        ) : (
          <div className="rounded-md px-[1rem] py-[1.5rem] shadow-md">
            <div className="grid w-1/2 grid-cols-2 gap-4">
              <div className="col-span-2">
                <Controller
                  name="comment"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      type="textarea"
                      placeholder="Comment"
                      height="h-auto"
                      textAreaRows={6}
                      border="border-shark-200"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="sticky bottom-0 flex place-content-end gap-[1rem] bg-[#fcfcfc] py-4">
        {wrappedButtons.map(({ key, text, variant, onClick, disabled, popup }) => (
          <CustomButton
            key={key}
            text={text}
            variant={variant}
            onClick={onClick}
            disabled={
              disabled ||
              loading[key] ||
              (key === "completed" && initialFormData.status === "Completed")
            }
            {...(popup && { popup })}
          />
        ))}
      </div>
      {currentConfig && (
        <Modal
          isOpen={true}
          onClose={() => setCurrentModal(null)}
          heading={currentConfig.heading}
          buttonText={currentConfig.buttonText}
          onButtonClick={() => {
            currentConfig.onButtonClick?.()
          }}
          icon={currentConfig.icon}
          size="w-[30.5rem] h-[26.4375rem]"
          iconBgClass={currentConfig.iconBgClass}
          headingClass="text-shark-500 mb-[1rem]"
          buttonClass={currentConfig.buttonClass}
        >
          {currentConfig.content}
        </Modal>
      )}
    </div>
  )
}

export default MakeReadyForm

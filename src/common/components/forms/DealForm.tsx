import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import CustomButton, { VariantType } from "../buttons/CustomButton"
import TextField from "../inputs/CustomTextField"
import DealInputField from "@/features/invoice/components/DealInputField"
import {
  InvoiceFields,
  InvoiceFormData,
  InitialFormData,
} from "../../../features/invoice/deal-form/CreateDealFieldConfig"
import { createModalConfigs } from "@/common/utils/modalConfigs"
import { useModalStore } from "../modal/store/modalStore"
import Modal from "../modal/Modal"
import { LinkSentIcon, LockIcon } from "@/assets"


export interface ButtonConfig {
  key: string
  idleText: string
  loadingText?: string
  onClick: (data: any) => Promise<void>
  variant: VariantType
  popup?: string
  disabled?: boolean
  hidden?: boolean
}

interface Props {
  title?: string
  dealNo?: string
  dealFields: InvoiceFields[]
  vehicleFields: InvoiceFields[]
  tradeFields: InvoiceFields[]
  initialFormData: InitialFormData
  loading: Record<string, boolean>
  buttons: ButtonConfig[]
  setDealershipDealNo?: React.Dispatch<React.SetStateAction<string>>
  populatedData?: InvoiceFormData

}

const DealForm: React.FC<Props> = ({
  dealNo,
  dealFields,
  vehicleFields,
  tradeFields,
  initialFormData,
  loading,
  buttons,
  setDealershipDealNo,
  populatedData,

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
    openEditDeal,
    isDealEditOpen,
    closeEditDeal,
  } = useModalStore()

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
    openEditDeal,
    closeEditDeal,
  })
  useEffect(() => {
    reset(populatedData)
  }, [populatedData])
  const formSections = [
    { title: "Deal Information", fields: dealFields },
    { title: "Vehicles Sold", fields: vehicleFields },
    { title: "Trade", fields: tradeFields },
  ]

  const wrappedButtons = buttons.map(({ key, idleText, loadingText, onClick, variant, popup }) => ({
    key,
    text: loading[key] ? (loadingText ?? idleText) : idleText,
    variant,
    onClick: handleSubmit(onClick),
    disabled: !isValid || loading[key],
    popup,
  }))
  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.938rem]">
        {formSections.map(({ title, fields }, index) => (
          <React.Fragment key={index}>
            <span className="semibold-text-sm text-cerulean-600">{title}</span>
            <div className="grid grid-cols-5 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem] shadow-md">
              {fields.map((item) => (
                <DealInputField key={item.field} {...{ dealNo, data: item, control }} />
              ))}
            </div>
          </React.Fragment>
        ))}

        {isDealEditOpen ? null : (
          <>
            <span className="semibold-text-sm text-cerulean-600">Comments</span>
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
                        border="border-shark-200"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <footer className="sticky bottom-0 z-10 p-4">
        <div className="flex justify-end gap-[1rem]">
          {wrappedButtons.map(({ key, text, variant, onClick, disabled, popup }) => (
            <CustomButton
              key={key}
              text={text}
              variant={variant}
              onClick={onClick}
              disabled={disabled}
              {...(popup && { popup })}
            />
          ))}
        </div>
      </footer>
      {currentModal && (
        <Modal
          isOpen={true}
          onClose={() => setCurrentModal(null)}
          heading={MODAL_CONFIGS[currentModal].heading}
          buttonText={MODAL_CONFIGS[currentModal].buttonText}
          onButtonClick={() => {
            MODAL_CONFIGS[currentModal].onButtonClick?.()
          }}
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

export default DealForm

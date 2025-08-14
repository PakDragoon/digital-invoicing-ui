import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dealService } from "@/features/invoice/services/dealApi"
import DealForm from "@/common/components/forms/DealForm"
import { DealStatus } from "@/core/entities/deal"
import { toast } from "react-toastify"
import {
  DealConfig,
  InvoiceFormData,
  initialData,
  useSalespersonOptions,
} from "../deal-form/CreateDealFieldConfig"
import { useModalStore } from "@/common/components/modal/store/modalStore"
import { useDealStore } from "../store/dealStore"
import { getErrorMessage } from '@/common/utils/errors.utils'

interface Props {
  data: Partial<InvoiceFormData>
}

function makeFieldsOptionalExceptDealNo(fields: any[]) {
  return fields.map((field) =>
    field.field === "dealershipDealNo"
      ? { ...field, require: true }
      : { ...field, require: false, disabled: false }
  )
}

const EditDeal: React.FC<Props> = ({ data }) => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const queryClient = useQueryClient()
  const { setCurrentModal, toggleDisableModalButton, isSendToFinanceEdit, setSendToFinanceEdit, openAssignDeal } = useModalStore()
  const { DisplayRotation } = useDealStore()
  const salespersonOptions = useSalespersonOptions()

  const isQuoteDeal = data.dealStatus === DealStatus.Quote

  const dealEditFieldsRaw = DealConfig.fields.deal(salespersonOptions, true)
  const vehicleEditFieldsRaw = DealConfig.fields.vehicle(true)
  const tradeEditFieldsRaw = DealConfig.fields.trade(true)

  const dealEditFields = (isQuoteDeal && !isSendToFinanceEdit)
    ? makeFieldsOptionalExceptDealNo(dealEditFieldsRaw)
    : dealEditFieldsRaw
  const vehicleEditFields = (isQuoteDeal && !isSendToFinanceEdit)
    ? makeFieldsOptionalExceptDealNo(vehicleEditFieldsRaw)
    : vehicleEditFieldsRaw
  const tradeEditFields = (isQuoteDeal && !isSendToFinanceEdit)
    ? makeFieldsOptionalExceptDealNo(tradeEditFieldsRaw)
    : tradeEditFieldsRaw

  const dealId = data.id
  const dealNo = data.dealershipDealNo
  const initialFormData = initialData(dealNo ?? "", data)

  const updateDealCommentMutation = useMutation({
    mutationFn: (formData: Partial<InvoiceFormData>) => dealService.updateDeal(dealId ?? "", formData),
    onSuccess: (updatedData) => {
      if (updatedData) queryClient.setQueryData(["getDealByDealNo", dealNo], updatedData.data)
      if (isSendToFinanceEdit) {
        setSendToFinanceEdit(false)
        openAssignDeal()
      } else setCurrentModal("dealUpdated")
      toggleDisableModalButton()
    },
    onError: (error) => {
      console.error("Error updating deal: ", error)
      const errorMessage = getErrorMessage(error) ?? 'Unable to update deal. Please try again later.';
      toast.error(errorMessage)
    },
    onSettled: () => setLoadingStates((prev) => ({ ...prev, update: false })),
  })

  const onSubmit = async (formData: Partial<InvoiceFormData>) => {
    DisplayRotation()
    // if (formData.estimatedSalesGross <= 0) {
    //   toast.error("Estimated Sales Gross must be greater than 0");
    //   return Promise.resolve();
    // }
    toggleDisableModalButton()
    setLoadingStates((prev) => ({ ...prev, update: true }))
    updateDealCommentMutation.mutate(formData)
  }

  return (
    <DealForm
      dealNo={dealNo}
      dealFields={dealEditFields}
      tradeFields={tradeEditFields}
      vehicleFields={vehicleEditFields}
      initialFormData={initialFormData}
      loading={loadingStates}
      buttons={[
        {
          key: "update",
          idleText: isSendToFinanceEdit ? "Send to Finance" : "Update Deal",
          loadingText: "Updating Deal...",
          onClick: onSubmit,
          variant: "outlined",
          popup: "Fill the Required Fields!",
          disabled: data.dealStatus === "Finalized",
        },
      ]}
    />
  )
}

export default EditDeal

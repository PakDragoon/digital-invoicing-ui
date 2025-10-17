import React, { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import CustomButton from "../buttons/CustomButton"
import { useDocumentTypes } from "@/features/invoice/hooks"
import { FormData } from "@/common/components/forms/data-fields/filters"
import { useAuthStore } from "@/features/auth/stores/authStore"
import MultiCheckBox from "@/common/components/inputs/MultiCheckBox"
import { DealFormData } from "@/features/invoice/deal-form/AccountantDealFieldsConfig"
import { useAccountantStore } from "@/features/dashboard/components/Accountant/store"

interface DealDocument {
  id: string
  docTypeId: string
  docTypeName: string
  isReceived: boolean
}

interface Props {
  handleSubmit?: (
    formData: Partial<DealFormData> & { documents: string[]; allSelectedDocuments: string[] }
  ) => void
  dealDocuments?: DealDocument[]
}

const MissingDocumentsForm: React.FC<Props> = ({
  handleSubmit: submitHandler,
  dealDocuments = [],
}) => {
  const companyId: string = useAuthStore((state) => state.user?.companyId?.toString() ?? "")
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: { documents: [] },
  })
  const { data, isLoading, isError } = useDocumentTypes(companyId)

  const receivedDocuments = new Set(
    dealDocuments?.filter((doc) => doc.isReceived).map((doc) => doc.docTypeId)
  )

  const documentTypes = Array.isArray(data)
    ? data.map((type) => {
        const isReceived = receivedDocuments.has(type.id)
        return {
          value: type.id,
          label: type.docTypeName,
          disabled: isReceived,
          checked: isReceived,
        }
      })
    : []

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && documentTypes.length > 0) {
      const receivedDocumentIds = documentTypes.filter((doc) => doc.checked).map((doc) => doc.value)
      if (receivedDocumentIds.length > 0) setValue("documents", receivedDocumentIds)
      initialized.current = true
    }
  }, [documentTypes, setValue])

  const onSubmit = async (data: { documents: string[] }) => {
    const newlySelectedDocuments = data.documents.filter((docId) => !receivedDocuments.has(docId))
    submitHandler?.({
      ...data,
      documents: newlySelectedDocuments,
      allSelectedDocuments: data.documents,
    })
  }

  return (
    <div className="flex flex-col gap-[1rem] px-[1.2rem] py-[1rem]">
      <div className="flex flex-col gap-[0.5rem]">
        <MultiCheckBox
          title="Document Types"
          control={control}
          options={documentTypes}
          name="documents"
        />
      </div>
      <div className="flex place-content-center gap-[1rem]">
        <CustomButton
          text="Add"
          variant="fill"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        />
      </div>
    </div>
  )
}

export default MissingDocumentsForm

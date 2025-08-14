import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { toast } from "react-toastify"
import CustomButton from "../buttons/CustomButton"
import { useDocumentTypes } from "@/features/invoice/hooks"
import { useAuthStore } from "@/features/auth/stores/authStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dealService } from "@/features/invoice/services/dealApi"
import { DealDocument } from "@/core/entities"
import TextField from "@/common/components/inputs/CustomTextField"
import CreatableSelectComponent from "../CreatableSelect"

interface Props {
  dealId: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const DealDocumentForm: React.FC<Props> = ({ dealId, setIsOpen }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { user } = useAuthStore.getState()
  const dealershipId = (user?.dealershipId ?? "").toString()
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {  comment: "", docTypeId: "" },
  })
  const { data, isLoading, isError } = useDocumentTypes(dealershipId)
  const documentTypes = data?.map((type) => ({ id: type.id, name: type.docTypeName })) || []
  if (!isLoading && isError) toast.error("Error fetching document types")
  if (!isLoading && documentTypes.length === 0)
    toast.error("No document types found for current dealership")

  const addDealDocumentMutation = useMutation({
    mutationFn: ({ docTypeId, comment }: { docTypeId: number; comment: string }) =>
      dealService.addDealDocument(dealId, docTypeId, comment),
    onSuccess: (updatedData: DealDocument) => {
      queryClient.setQueryData(
        ["getDealDocuments", dealId, dealershipId],
        (oldData: DealDocument[]) => {
          if (updatedData) return [...oldData, updatedData]
        }
      )
      setIsOpen(false)
    },
    onError: (error) =>
      toast.error(error.message || "Unable to add invoice document. Please try again later."),
    onSettled: () => setLoading(false),
  })

  const onSubmit = (data) => {
    setLoading(true)
    let docTypeId: number

    if (!isNaN(Number(data.docTypeId))) {
      docTypeId = Number(data.docTypeId)
    } else {
      const matched = documentTypes.find((type) => type.name === data.docTypeId)
      if (!matched) {
        console.error("Invalid document type selected:", data.docTypeId)
        setLoading(false)
        return
      }
      docTypeId = Number(matched.id)
    }

    addDealDocumentMutation.mutate({
      docTypeId,
      comment: data.comment,
    })
  }

  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.938rem]">
        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Document Type</span>
        <div className="grid grid-cols-2 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem]">
          <Controller
            name="docTypeId"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <CreatableSelectComponent
                value={value}
                onChange={(selected) => {
                  onChange(selected)
                }}
                placeholder="Select or create Document Type"
                options={documentTypes}
                allowCreate={true}
                error={error?.message}
                size="large"
                create="dealDoc"
              />
            )}
          />
        </div>
        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Comments</span>
        <div className="grid gap-[1.25rem] rounded-md border border-shark-200 px-[1rem] py-[1rem]">
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="textarea"
                placeholder="Comment"
                height="h-auto"
                textAreaRows={6}
                border="border-shark-200"
                hideFocusedLabel
              />
            )}
          />
        </div>
      </div>

      <div className="flex place-content-center gap-[1rem]">
        <CustomButton
          text={loading ? "Adding..." : "Add"}
          variant="fill"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || loading}
          size="large"
          popup="Fill the Required Fields!"
        />
      </div>
    </div>
  )
}

export default DealDocumentForm

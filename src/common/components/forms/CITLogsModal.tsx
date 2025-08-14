import React, { useState } from "react"
import { useForm } from "react-hook-form"
import DealInputField from "@/features/invoice/components/DealInputField"
import { CITLogFields, CITLogsData } from "@/common/components/forms/data-fields/CITFieldsConfig"
import { Link } from "@tanstack/react-router"
import { ROUTES } from "@/common/routes"
import CustomButton from "../buttons/CustomButton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dealService } from "@/features/invoice/services/dealApi"
import { toast } from "react-toastify"
import KeyValueBadge from "@/common/components/chip/KeyValueBadge"

interface Props {
  dealId?: string
  dealNo?: string
  citInfoFields: CITLogFields[]
  contractStatusFields: CITLogFields[]
  initialFormData: CITLogsData
}

const CITLogsModal: React.FC<Props> = ({
  dealId,
  dealNo,
  citInfoFields,
  contractStatusFields,
  initialFormData,
}) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState<boolean>(false)
  const { control, handleSubmit } = useForm({ mode: "onChange", defaultValues: initialFormData })
  const formSections = [
    { title: "CIT Information", fields: citInfoFields },
    { title: "Relay Contract Status", fields: contractStatusFields },
  ]

  const updateContractMutation = useMutation({
    mutationFn: (payload: Partial<CITLogsData>) => dealService.updateContractStatusAndDate(dealId!, payload),
    onSuccess: (updatedData) => {
      if (updatedData) queryClient.setQueryData(["getDealByDealNo", dealNo], updatedData.data)
      toast.success("Contract status updated successfully")
    },
    onError: (error) => {
      toast.success("Error updating contract status")
      console.error("Error updating contract status:", error)
    },
    onSettled: () => setLoading(false),
  })

  const onSubmit = async (data: CITLogsData) => {
    setLoading(true)
    const { contractStatus, contractFundedDate } = data
    const payload = { contractStatus, contractFundedDate }
    updateContractMutation.mutate(payload)
  }

  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.938rem]">
        {formSections.map((section, index) => {
          const isCIT = section.title === "CIT Information"
          const { id, hasRouteOneContract } = initialFormData || {}
          const showEmptyCIT = isCIT && (!id || (id && hasRouteOneContract === false))

          return (
            <React.Fragment key={section.title}>
              <div className="flex justify-between">
                <span className="semibold-text-sm text-cerulean-600">{section.title}</span>
                {!index && (
                  <span className="semibold-text-md text-cerulean-700">Deal # {dealNo}</span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 rounded-md p-6 shadow-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {showEmptyCIT ? (
                  <div className="col-span-full py-8 text-center text-shark-500">
                    No contract is attached to this deal yet.
                  </div>
                ) : (
                  section.fields.map((item) => {
                    const label = item.label
                    const value = initialFormData?.[item.field]
                    return isCIT ? (
                      <KeyValueBadge key={item.field} keyLabel={label} value={value} />
                    ) : (
                      <DealInputField
                        key={item.field}
                        dealNo={dealNo}
                        data={item}
                        control={control}
                      />
                    )
                  })
                )}
              </div>
            </React.Fragment>
          )
        })}
      </div>

      <div className="flex place-content-end gap-[1rem]">
        {dealNo && (
          <>
            <CustomButton
              text={loading ? "Updating..." : "Update"}
              variant="contained"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
            />

            <Link
              to={ROUTES.INVOICE_DETAIL}
              params={{ id: dealNo }}
              className="rounded-[0.25rem] border border-primary px-[1.75rem] py-[0.45rem] text-center text-[0.9rem] font-medium text-primary hover:bg-primary hover:text-shark-50"
            >
              View Deal
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default CITLogsModal

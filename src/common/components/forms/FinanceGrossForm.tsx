import React from "react"
import { useForm, Controller } from "react-hook-form"
import TextField from "../inputs/CustomTextField"
import CustomButton from "../buttons/CustomButton"
import { PrismaDealStatus } from "@/core/entities/deal"
import { useSetOpenModalStore } from '@/core/store/showEditGross'

interface Props {
  estimatedFinanceGross?: number
  loading: boolean
  handleChange: (key: string, value: PrismaDealStatus, gross?: number) => void
  currentStatus: PrismaDealStatus
}

const FinanceGrossForm: React.FC<Props> = ({ estimatedFinanceGross, loading, handleChange, currentStatus }) => {
  const { control, handleSubmit, formState: { isValid } } = useForm({
    mode: "onChange",
    defaultValues: { estimatedFinanceGross: estimatedFinanceGross ?? " " },
  })
  const editFinanceGross = useSetOpenModalStore((state) => state.openModal)

  const onSubmit = async (data: any) =>
    handleChange(
      "dealStatus",
      editFinanceGross ? currentStatus : PrismaDealStatus.FinanceComplete,
      data.estimatedFinanceGross
    )

  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.938rem]">
        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">
          Estimated Finance Gross
        </span>
        <div className="grid grid-cols-2 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem]">
          <Controller
            key="estimatedFinanceGross"
            name="estimatedFinanceGross"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                placeholder="Est Finance Gross"
                value={String(field.value)}
                required={true}
                variant="contained"
                size="large"
                includeNegative
              />
            )}
          />
        </div>
      </div>

      <div className="flex place-content-center gap-[1rem]">
        <CustomButton
          text={loading ? "Submitting..." : "Submit"}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || loading}
          size="large"
          popup="Fill the Required Fields!"
        />
      </div>
    </div>
  )
}

export default FinanceGrossForm

import React from "react"
import { useForm, Controller } from "react-hook-form"
import CustomDropdown from "../inputs/CustomDropdown"
import TextField from "../inputs/CustomTextField"
import CustomButton from "../buttons/CustomButton"
import {
  dealStatusOptions,
  vehicleStatusOptions,
  businessMonthOptions,
  FormData,
  initialFormData,
} from "@/common/components/forms/data-fields/filters"
import { useModalStore } from "@/common/components/modal/store/modalStore"
import { formatBusinessMonth, getCurrentBusinessMonth } from "@/common/utils"

interface Props {
  handleSubmit?: (formData: FormData) => void
  initialValues?: Partial<FormData>
}

const FiltersForm: React.FC<Props> = ({ handleSubmit: submitHandler, initialValues }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...initialFormData, ...initialValues,
       businessMonth:
    initialValues?.businessMonth || formatBusinessMonth(getCurrentBusinessMonth()),
    },

  })
  const { isFilterLoading } = useModalStore()

  const onSubmit = (formData: FormData) => submitHandler?.(formData)

  return (
    <div className="flex flex-col gap-[1rem] px-[1.2rem] py-[1rem]">
      <div className="flex flex-col gap-[0.5rem]">
        <MultiCheckBoxComponent
          title="Status"
          control={control}
          options={dealStatusOptions}
          name="dealStatus"
        />

        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Business Month</span>
        <div className="grid gap-[1.25rem] rounded-md pb-[1.5rem] pt-[1rem]">
          <Controller
            name="businessMonth"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomDropdown
                label="Business Month"
                options={businessMonthOptions ?? []}
                value={value}
                onSelect={onChange}
                size="large"
                maxOptionsHeight="12rem"
              />
            )}
          />
        </div>

        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Date Picker</span>
        <div className="flex gap-[1.25rem] rounded-md pb-[1.5rem] pt-[1rem]">
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                startDate={field.value?.[0] || null}
                endDate={field.value?.[1] || null}
                type="daterange"
                placeholder="Date Range"
                variant="contained"
                size="large"
                hideFocusedLabel
              />
            )}
          />
        </div>

        <MultiCheckBoxComponent
          title="Vehicle Status"
          control={control}
          options={vehicleStatusOptions}
          name="vehicleStatus"
        />
      </div>

      <div className="sticky bottom-2 flex place-content-center gap-[1rem] bg-[#fcfcfc]">
        <CustomButton
          text="Apply"
          variant="fill"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          width="w-[6rem]"
          loadingText="Applying..."
          loading={isFilterLoading}
        />
        <CustomButton
          text="Reset"
          variant="outlined"
          onClick={() => reset(initialFormData)}
          disabled={!isValid}
          width="w-[6rem]"
        />
      </div>
    </div>
  )
}

function MultiCheckBoxComponent({ control, name, options, title }) {
  return (
    <>
      <span className="semibold-text-sm text-cerulean-600">{title}</span>
      <div className="flex gap-[1.25rem] rounded-md pb-[1.5rem] pt-[1rem]">
        <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange } }) => (
            <div className="flex w-full flex-wrap gap-x-4 gap-y-2">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 text-sm text-shark-600">
                  <input
                    className="form-checkbox h-4 w-4"
                    type="checkbox"
                    value={opt.value}
                    checked={value?.includes(opt.value)}
                    onChange={(e) => {
                      if (e.target.checked) onChange([...(value || []), opt.value])
                      else onChange((value || []).filter((v: string) => v !== opt.value))
                    }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}
        />
      </div>
    </>
  )
}

export default FiltersForm

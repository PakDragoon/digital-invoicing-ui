import React from "react"
import { useForm, Controller } from "react-hook-form"
import CustomDropdown from "../inputs/CustomDropdown"
import TextField from "../inputs/CustomTextField"
import CustomButton from "../buttons/CustomButton"
import { usePlatesStatusFields, plateStatusOptions } from "./data-fields/platesStatus"
import Chip from "@/common/components/chip/Chip"

interface Props {}

const initialFormData = {
  platesStatus: "",
  contractFundedDate: "",
}

const PlatesStatusForm: React.FC<Props> = () => {
  const platesStatusFields = usePlatesStatusFields()
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      ...initialFormData,
    },
  })

  const onSubmit = (data: any) => console.log("Payload: ", data)

  return (
    <div className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]">
      <div className="flex flex-col gap-[0.5rem]">
        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Plates Status</span>
        <div className="flex gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem]">
          <Controller
            control={control}
            name="platesStatus"
            rules={{ required: true }}
            render={({ field }) => (
              <div className="flex gap-8">
                {plateStatusOptions.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    checked={field.value === option}
                    onSelect={() => field.onChange(option)}
                    size="small"
                  />
                ))}
              </div>
            )}
          />
        </div>

        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Plates Info</span>
        <div className="grid grid-cols-4 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem]">
          {platesStatusFields.map(({ type, field, label, options, require }) =>
            type === "select" ? (
              <Controller
                key={field}
                name={field}
                control={control}
                rules={{ required: require }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <CustomDropdown
                    label={label}
                    options={options ?? []}
                    onSelect={onChange}
                    required={require}
                    size="large"
                  />
                )}
              />
            ) : (
              <Controller
                key={field}
                name={field}
                control={control}
                rules={{ required: require }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    type={type}
                    placeholder={label}
                    required={require}
                    variant="contained"
                    size="large"
                  />
                )}
              />
            )
          )}
        </div>

        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Add Comment</span>
        <div className="grid grid-cols-1 gap-[1.25rem] rounded-md px-[1rem] py-[1.5rem]">
          <Controller
            key="comment"
            name="comment"
            control={control}
            rules={{ required: false }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="textarea"
                placeholder="Add Comment"
                required={false}
                variant="contained"
                size="large"
              />
            )}
          />
        </div>
      </div>

      <div className="flex place-content-center gap-[1rem]">
        <CustomButton
          text="Update Status"
          variant="fill"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
          size="large"
          popup="Fill the Required Fields!"
        />
      </div>
    </div>
  )
}

export default PlatesStatusForm

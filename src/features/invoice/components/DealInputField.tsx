import React from "react"
import { Controller, Control } from "react-hook-form"
import TextField from "@/common/components/inputs/CustomTextField"
import { InitialFormData } from "../deal-form/CreateDealFieldConfig"
import CustomDropdownV2 from "@/common/components/inputs/CustomDropdownV2"
import { IOption2 } from "@/common/components/CreatableSelect"

export type Option = string | IOption

export interface IOption {
  name: string
  id: string
}

interface IFieldProps {
  type: string
  field: string
  label: string
  options?: Option[] | IOption2[]
  require: boolean
  disabled?: boolean
  config?: {
    dynamicOptions?: boolean
    format?: (value: string) => string
  }
}

interface IProps {
  data: IFieldProps
  control: Control<InitialFormData>
  dealNo?: string
}

const DealInputField: React.FC<IProps> = ({
  dealNo,
  control,
  data: { type, field, label, options, require, disabled, config },
}) => {
  const getFieldValue = (field: string, value: any, dealNo?: string) => {
    if (field === "salesperson1" || field === "salesperson2")
      return typeof value === "object" && value !== null && "name" in value ? value.name : ""
    return typeof value === "string" ? value : (value?.name ?? "")
  }

  return (
    <>
      {type === "select" ? (
        <Controller
          name={field}
          control={control}
          rules={{ required: require }}
          render={({ field: { onChange, value } }) => (
            <CustomDropdownV2
              label={label}
              options={(options || []) as IOption[]}
              required={require}
              value={getFieldValue(field, value, dealNo)}
              onSelect={(val) => onChange(val)}
              disabled={disabled}
            />
          )}
        />
      ) : (
        <Controller
          name={field}
          control={control}
          rules={{ required: require }}
          render={({ field: { onChange, value, ...rest } }) => (
            <TextField
              {...rest}
              type={type}
              placeholder={label}
              required={require}
              variant="contained"
              value={
                value instanceof Date
                  ? value.toISOString().slice(0, 10)
                  : getFieldValue(field, value, dealNo)
              }
              disabled={disabled}
              onChange={(e) => {
                const rawValue = e instanceof Date || typeof e === "string" ? e : e.target.value
                let formattedValue = rawValue

                if (type === "date") formattedValue = rawValue ? new Date(rawValue) : null
                else if (config?.format) formattedValue = config.format(rawValue)

                onChange(formattedValue)
              }}
              config={config}
              includeNegative={["Est Sales Gross"].includes(label)}
            />
          )}
        />
      )}
    </>
  )
}

export default DealInputField

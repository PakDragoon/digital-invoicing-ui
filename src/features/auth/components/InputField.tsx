import React from "react"
import { Controller, Control } from "react-hook-form"
import TextField from "@/common/components/inputs/CustomTextField"
import { ProfileFormData } from "@/features/auth/components/ProfileFormConfig"

export interface IFieldProps {
  type: string
  field: string
  label: string
  require: boolean
  disabled?: boolean
  config?: {
    format?: (phone: string | undefined) => string
    fullWidth: boolean
  }
}

interface IProps {
  data: IFieldProps
  control: Control<ProfileFormData>
}

const InputField: React.FC<IProps> = ({
  control,
  data: { type, field, label, require, disabled, config },
}) => {
  return (
    <Controller
      key={field}
      name={field}
      control={control}
      rules={require ? { required: `${label} is required` } : undefined}
      render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
        <div className="w-full">
          <TextField
            {...rest}
            type={type}
            placeholder={label}
            required={require}
            variant="contained"
            value={value ?? ""}
            onChange={(e) => {
              const rawValue = e.target.value
              const formattedValue = config?.format ? config.format(rawValue) : rawValue
              onChange(formattedValue)
            }}
            config={config}
            disabled={disabled}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
        </div>
      )}
    />
  )
}

export default InputField

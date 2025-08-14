import { Controller, Control } from "react-hook-form"
import React from "react"

interface Option {
  value: string
  label: string
  disabled?: boolean
  checked?: boolean
}

interface MultiCheckBoxComponentProps<T> {
  control: Control<T>
  name: string
  options: Option[]
  title: string
}

interface FormData {
  documents: string[]
}

function MultiCheckBoxComponent({
  control,
  name,
  options,
  title,
}: MultiCheckBoxComponentProps<FormData>) {
  return (
    <>
      <span className="semibold-text-sm text-cerulean-600">{title}</span>
      <div className="flex gap-[1.25rem] rounded-md pb-[1.5rem] pt-[1rem]">
        <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange } }) => (
            <div className="flex w-full flex-wrap gap-x-4 gap-y-2">
              {options.map((opt) => {
                const currentValues = value || []

                const isChecked = currentValues.some((v) => v.value === opt.value)
                const isDisabled = opt.disabled || false

                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-2 text-sm ${
                      isDisabled
                        ? "cursor-not-allowed text-gray-400"
                        : "cursor-pointer text-shark-600"
                    }`}
                  >
                    <input
                      className={`form-checkbox h-4 w-4 rounded border-gray-300 text-cerulean-600 ${
                        isDisabled ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      type="checkbox"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={(e) => {
                        if (isDisabled) return

                        const optionObject = { value: opt.value, label: opt.label }

                        if (e.target.checked) {
                          onChange([...currentValues, optionObject])
                        } else {
                          onChange(currentValues.filter((v) => v.value !== opt.value))
                        }
                      }}
                    />
                    {opt.label}
                  </label>
                )
              })}
            </div>
          )}
        />
      </div>
    </>
  )
}

export default MultiCheckBoxComponent

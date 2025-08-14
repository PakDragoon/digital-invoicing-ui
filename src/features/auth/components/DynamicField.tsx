import React, { JSX } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import TextField from '@/common/components/TextField'
import CreatableSelect from '@/common/components/CreatableSelect'
import { ISignupField } from '@/pages/signup/SignUpFormConfig'
import { dmsIntegrationSchema, ISignUpFormData } from '@/features/auth/schemas/signupSchema'
import { z } from 'zod'

const DynamicField = ({ fieldConfig }: { fieldConfig: ISignupField }): JSX.Element => {
  const { control, register, formState: { errors } } = useFormContext<ISignUpFormData>()
  const error = errors[fieldConfig.field]?.message

  return (
    <Controller
      name={fieldConfig.field}
      control={control}
      rules={fieldConfig.require ? { required: `${fieldConfig.label} is required` } : undefined}
      render={({ field }) => {
        if (fieldConfig.type === 'select') {
          return (
            <div className="mb-2">
              <label className="text-sm font-normal text-shark-500 block mb-2">{fieldConfig.label}</label>
              <CreatableSelect
                {...field}
                placeholder={fieldConfig.config?.placeholder || fieldConfig.label}
                options={fieldConfig.options || []}
                error={error}
                allowCreate={fieldConfig.config?.allowCreate}
                size="medium"
              />
            </div>
          )
        }

        if (fieldConfig.type === 'radio') {
          return (
            <div className="flex flex-col gap-2 items-center mb-2">
              <div className="text-sm text-shark-500 mb-4">{fieldConfig.label}</div>
              <div className="flex gap-6">
                {(fieldConfig.options || []).map(({ label, value }) => (
                  <label
                    key={label}
                    className="flex items-center gap-2 text-shark-900 font-regular text-md"
                  >
                    <input
                      type="radio"
                      name={fieldConfig.field}
                      {...register(fieldConfig.field as keyof z.infer<typeof dmsIntegrationSchema>)}
                      className="form-radio h-[1rem] w-[1rem]"
                      value={String(value)}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          )
        }

        if (fieldConfig.type === 'file') {
          return (
            <div className="mb-2">
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file);
                  }}
                  accept={fieldConfig.config?.accept || undefined}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id={`file-${fieldConfig.field}`}
                />
                <label
                  htmlFor={`file-${fieldConfig.field}`}
                  className="flex items-center justify-between w-full px-4 py-3 border-2 border border-cerulean-400 rounded-lg cursor-pointer hover:border-cerulean-500 transition-colors"
                >
                  <span className="text-cerulean-600 font-medium">
                    {field.value?.name || fieldConfig.config?.placeholder || 'Upload CSV'}
                  </span>
                  <span className="text-cerulean-600 text-xl">+</span>
                </label>
              </div>
              {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
            </div>
          )
        }

        return (
          <div className="mb-2">
            <TextField
              size="medium"
              {...field}
              label={fieldConfig.label}
              type={fieldConfig.type}
              onChange={(e) => {
                const rawValue = e.target.value;
                const formattedValue = fieldConfig.config?.format ? fieldConfig.config.format(rawValue) : rawValue;
                field.onChange(formattedValue);
              }}
              placeholder={fieldConfig.config?.placeholder || fieldConfig.label}
              error={error}
            />
          </div>
        )
      }}
    />
  )
}

export default DynamicField

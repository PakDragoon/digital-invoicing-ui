import { WidgetProps } from "@rjsf/utils"

const CustomTextField: React.FC<WidgetProps> = ({
  id,
  value,
  required,
  onChange,
  disabled,
  schema,
  rawErrors,
  uiSchema,
}) => {
  const errorMessage: string | undefined =
    (uiSchema?.["ui:errorMessage"] as string) || (rawErrors?.length ? rawErrors[0] : undefined)

  const hasError = Boolean(errorMessage)

  const inputType =
    schema.type === "string" && schema.format === "email"
      ? "email"
      : schema.type === "string" && schema.format === "password"
        ? "password"
        : schema.type === "number"
          ? "number"
          : "text"

  const placeholder = (uiSchema?.["ui:placeholder"] as string) || ""
  const isRequired = required || schema.minLength !== undefined

  return (
    <div className="mb-5 mt-2 flex w-[385px] flex-col space-y-2">
      <input
        id={id}
        type={inputType}
        value={value ?? ""}
        onChange={(e) => {
          const processedValue = inputType === "number" ? Number(e.target.value) : e.target.value
          onChange(processedValue)
        }}
        disabled={disabled}
        required={isRequired}
        placeholder={placeholder}
        className={`w-full border ${
          hasError ? "border-red-500" : "border-gray-300"
        } rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />
      {hasError && <span className="text-sm text-red-500">{errorMessage}</span>}
    </div>
  )
}

export default CustomTextField

import React, { useId } from "react"

interface TextFieldProps {
  label?: string
  value?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  name?: string
  icon?: React.ReactNode
  size?: "small" | "medium" | "large"
  containerClassName?: string
  error?: string
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  name,
  size = "default",
  icon,
  containerClassName = "",
  error,
}) => {
  const sizeClasses: Record<"small" | "medium" | "large" | "default", string> = {
    small: "h-[2rem]",
    medium: "h-[2.5rem]",
    large: "h-[3rem]",
    default: "h-[3rem]",
  }

  const inputId = useId()
  const heightClass = sizeClasses[(size as keyof typeof sizeClasses) ?? "default"]

  return (
    <div className={`flex w-full flex-col ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="mb-2 text-sm font-normal text-shark-500">
          {label}
        </label>
      )}

      <div
        className={`flex ${heightClass} w-full items-center justify-center border ${
          error ? "border-red-500" : "border-shark-200"
        } gap-[0.5rem] rounded-[0.25rem] bg-white px-[0.625rem] py-[0.4375rem] ${
          error
            ? "focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500"
            : "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500"
        }`}
      >
        {icon && <div className="h-[1.125rem] w-[1.125rem] text-[#666B74]">{icon}</div>}

        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-none text-[0.875rem] font-normal leading-[1.25rem] text-shark-950 outline-none"
          aria-invalid={error ? "true" : "false"}
        />
      </div>

      {error && <p className="mt-1 text-sm font-normal text-red-500">{error}</p>}
    </div>
  )
}

export default TextField

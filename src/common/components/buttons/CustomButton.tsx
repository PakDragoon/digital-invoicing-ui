import React from "react"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

export type VariantType = "outlined" | "contained"

interface CustomButtonProps {
  text?: string
  icon?: React.ReactNode
  variant?: VariantType
  onClick?: () => void
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  size?: string
  popup?: string
  width?: string
  type?: string
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  icon,
  variant = "outlined",
  onClick,
  loading = false,
  loadingText = "Loading...",
  disabled = false,
  size = "medium",
  popup,
  width = "min-w-[10.125rem]",
  type = "",
}) => {
  const baseClasses = `flex items-center justify-center gap-2 px-[0.75rem] 
    ${size === "large" ? "py-[0.75rem]" : size === "small" ? "py-[0.25rem]" : "py-[0.5rem]"}
    rounded-[4px] font-medium text-[14px] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer ${width}`
  const outlinedClasses = `${disabled ? "border-shark-500 text-shark-500" : "border-cerulean-500 text-cerulean-500 hover:bg-cerulean-50"} border bg-transparent`
  const containedClasses = `${disabled ? "bg-shark-500" : "bg-cerulean-600 border-cerulean-500 hover:bg-blue-800"} text-white border`

  const finalClasses =
    variant === "outlined"
      ? `${baseClasses} ${outlinedClasses}`
      : `${baseClasses} ${containedClasses}`

  return (
    <div className="group relative inline-block">
      <button
        className={finalClasses}
        onClick={onClick}
        disabled={disabled || loading}
        type={type as "submit" | "reset" | "button" | undefined}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" && onClick && !disabled && !loading) {
            onClick()
          }
        }}
      >
        {loading ? (
          <>
            <AiOutlineLoading3Quarters className="animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {icon}
            {text}
          </>
        )}
      </button>

      {disabled && popup && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 transform rounded bg-shark-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {popup}
        </div>
      )}
    </div>
  )
}

export default CustomButton

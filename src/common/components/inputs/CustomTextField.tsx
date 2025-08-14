import React, { forwardRef, useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { setHours, setMinutes } from "date-fns"

interface TextFieldProps {
  label?: string
  value?: string | Date | null
  onChange?: (e: any) => void
  placeholder?: string
  type?: string
  name?: string
  icon?: React.ReactNode
  size?: "small" | "medium" | "large"
  required?: boolean
  height?: string
  variant?: "outlined" | "contained"
  border?: string
  disabled?: boolean
  textAreaRows?: number
  hideFocusedLabel?: boolean
  startDate?: Date | null
  endDate?: Date | null
  includeNegative? : boolean
  config?: {
    dynamicOptions?: boolean
    format?: (value: string) => string
  }
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      value,
      onChange,
      placeholder = "",
      type = "text",
      name,
      size = "default",
      icon,
      required = false,
      height,
      variant = "outlined",
      border,
      disabled,
      textAreaRows = 4,
      hideFocusedLabel = false,
      startDate,
      endDate,
      includeNegative = false,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    const sizeClasses: Record<"small" | "medium" | "large" | "default", string> = {
      small: "h-[2rem]",
      medium: "h-[2.25rem]",
      large: "h-[2.75rem]",
      default: "h-[2.25rem]",
    }

    const heightClass = height
      ? height
      : sizeClasses[(size as keyof typeof sizeClasses) ?? "default"]
    const baseContainerClasses = `w-full flex items-center justify-center rounded gap-[8px] px-[10px] py-[7px] focus-within:ring-2 focus-within:ring-cerulean-500  relative`
    const inputTextClasses =
      (value == "contained"
        ? "regular-text-xs text-shark-500"
        : "text-shark-500 text-[12px] font-[400]") + (value !== "" ? " bg-cerulean-50" : "")

    const variantClasses = value
      ? `text-cerulean-500 bg-cerulean-50 border border-cerulean-500`
      : `text-shark-500 bg-shark-100`

    const parseDate = (dateValue: string | Date | null | undefined): Date | null => {
      if (!dateValue) return null
      if (dateValue instanceof Date) return isNaN(dateValue.getTime()) ? null : dateValue

      try {
        const parsedDate = new Date(dateValue)
        return isNaN(parsedDate.getTime()) ? null : parsedDate
      } catch (e) {
        console.error("Invalid date format:", dateValue)
        return null
      }
    }

    const handleDateChange = (date: Date | null) => {
      if (date) {
        setParsedDate(date);
        onChange?.(date);
      } else {
        setParsedDate(null);
        onChange?.(null);
      }
    }
    React.useEffect(() => {
      const style = document.createElement("style")
      style.innerHTML = `
        .react-datepicker__input-container input {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .react-datepicker__input-container input:focus {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .react-datepicker-wrapper {
          width: 100%;
        }
      `
      document.head.appendChild(style)

      return () => {
        document.head.removeChild(style)
      }
    }, [])

    const [parsedDate, setParsedDate] = useState<Date | null>(null);
    useEffect(() => {
       setParsedDate(parseDate(value)) 
    },[value])

    return (
      <div className={`flex w-full flex-col`}>
        {label && <label className="mb-1 text-sm font-medium text-shark-800">{label}</label>}
        <div className={`${heightClass} ${baseContainerClasses} ${variantClasses} `}>
          {icon && <div className="h-[1.125rem] w-[1.125rem] text-shark-300">{icon}</div>}
          {required && <span className="ml-1 mr-1 text-sm text-cinnabar-400">*</span>}

          {type === "date" ? (
            <DatePicker
              selected={parsedDate}
              onChange={(date: Date | null) => handleDateChange(date)}
              isClearable
              dateFormat="MM/dd/yyyy"
              showTimeSelect={false}
              minDate={new Date()} 
              className={`w-full border-none bg-transparent text-[12px] font-[400] text-shark-500 outline-none placeholder:text-shark-500 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              placeholderText={placeholder}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              wrapperClassName="w-full"
            />

          ) : type === "time" ? (
            <DatePicker
              selected={parsedDate}
              onChange={(date: Date | null) => handleDateChange(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              minTime={setHours(setMinutes(new Date(), 0), 8)}
              maxTime={setHours(setMinutes(new Date(), 0), 22)}
              className={`w-full border-none bg-transparent text-[12px] font-[400] text-shark-500 outline-none placeholder:text-shark-500 ${
                disabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              placeholderText={placeholder}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              wrapperClassName="w-full"
            />
          ) : type === "daterange" ? (
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => onChange?.(update)}
              isClearable
              placeholderText={placeholder}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full border-none bg-transparent text-[12px] font-[400] text-shark-500 outline-none placeholder:text-shark-500"
              wrapperClassName="w-full"
            />
          ) : type === "textarea" ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              required={required}
              name={name}
              value={typeof value === "string" ? value : ""}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused || value ? "" : placeholder}
              className={`min-h-[50px] w-full border-none bg-transparent outline-none ${inputTextClasses} `}
              disabled={disabled}
              rows={textAreaRows}
            />
          ) : (
            <input
              ref={ref}
              required={required}
              type={type}
              name={name}
              value={typeof value === "string" ? value : ""}
              onChange={(e) => {
                let val = e.target.value
                if (type === "number" && !includeNegative) {
                  const num = Math.abs(Number(val))
                  onChange?.({ ...e, target: { ...e.target, value: num.toString() } })
                } else {
                  onChange?.(e)
                }
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused || value ? "" : placeholder}
              className={`w-full ${height ?? ""} ${height ? "relative bottom-3" : ""} outline-none placeholder:text-shark-500 ${inputTextClasses} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${value ? "" : "border-none bg-transparent"}`}
              disabled={disabled}
              min={type === "number" && !includeNegative ? "0" : undefined}
            />
          )}

          {!hideFocusedLabel && (isFocused || value) && (
            <span
              className={`absolute -top-2 left-3 bg-cerulean-50 px-1 text-xs text-gray-500 transition-all duration-200`}
            >
              {placeholder}
            </span>
          )}
        </div>
      </div>
    )
  }
)

TextField.displayName = "TextField"

export default TextField

import { IOption } from "@/features/invoice/components/DealInputField"
import { useCallback, useEffect, useRef, useState } from "react"
import DownArrow from "@/assets/icons/DownArrow.svg"

interface DropdownProps {
  label?: string
  options: string[] | IOption[]
  size?: "small" | "medium" | "large"
  icon?: React.ReactNode
  onSelect?: (value: string | { name: string; id: string }) => void
  required?: boolean
  value: string
  disabled?: boolean
  maxOptionsHeight?: string
  hideFocusedLabel?: boolean
  isClearable?: boolean
}

export default function CustomDropdown({
  label = "Select",
  options,
  size = "medium",
  icon,
  onSelect,
  required = false,
  value,
  disabled = false,
  maxOptionsHeight,
  hideFocusedLabel = false,
  isClearable = true,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
        setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Sync selected with value prop
  useEffect(() => setSelected(value), [value])

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev)
  }

  const handleSelect = useCallback(
    (opt: string | { name: string; id: string }) => {
      if (opt === "") {
        setSelected("")
        setIsOpen(false)
        onSelect?.("")
        return
      }
      const val = typeof opt === "string" ? opt : opt.name
      setSelected(val)
      setIsOpen(false)
      onSelect?.(val)
    },
    [onSelect]
  )

  const heightClass =
    (
      { small: "h-[1.75rem]", medium: "h-[2.25rem]", large: "h-[2.75rem]" } as Record<
        string,
        string
      >
    )[size] || "h-[2.25rem]"

  // Derive classes based on state
  const bgClass = isOpen || selected ? "bg-cerulean-50" : "bg-shark-100"
  const borderClass = isOpen || selected ? "border border-cerulean-500 " : "border-transparent"
  const textClass = "text-shark-500"

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Floating Label */}
      {!hideFocusedLabel && (isOpen || selected) && (
        <span
          className={`absolute -top-2 left-[10px] px-1 text-xs ${bgClass} z-30 flex items-center text-shark-700 transition-all duration-200`}
        >
          {required && !selected && !isOpen && <span className="mr-1 text-cinnabar-400">*</span>}
          {label}
        </span>
      )}

      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`regular-text-xs flex w-full items-center justify-between rounded px-[10px] ${heightClass} ${bgClass} ${borderClass} ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {icon && <div className="h-[1.125rem] w-[1.125rem] text-shark-300">{icon}</div>}
        <span className={`flex-1 truncate pl-[6px] ${textClass} flex items-center`}>
          {required && <span className="mr-2 text-sm text-cinnabar-400">*</span>}
          {selected || (!isOpen && label)}
        </span>
        <img src={DownArrow} alt="Down Arrow" className="h-[1.125rem] w-[1.125rem]" />
      </button>

      {isOpen && (
        <ul
          className="regular-text-xs absolute left-0 right-0 z-50 mt-1 rounded border border-gray-300 bg-white shadow"
          style={maxOptionsHeight ? { maxHeight: maxOptionsHeight, overflowY: "auto" } : undefined}
        >
          {isClearable && (
            <li
              onClick={() => handleSelect("")}
              className="cursor-pointer px-4 py-2 text-red-500 hover:bg-red-100"
            >
              Clear selection
            </li>
          )}

          {options.map((option) => {
            const isString = typeof option === "string"
            const display = isString ? option : option.name
            const val = isString ? option : option
            const isActive = selected === display
            return (
              <li
                key={isString ? option : option.id}
                onClick={() => handleSelect(val)}
                className={`cursor-pointer px-4 py-2 text-gray-700 hover:bg-blue-100 ${
                  isActive ? "bg-cerulean-100 font-semibold text-cerulean-700" : ""
                }`}
              >
                {display}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

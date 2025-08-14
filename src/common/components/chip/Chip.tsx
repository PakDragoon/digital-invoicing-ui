import React from "react"

interface ChipProps {
  label: string
  checked: boolean
  onSelect: () => void
  size?: "small" | "medium" | "large"
  disabled?: boolean
}

const Chip: React.FC<ChipProps> = ({
  size = "small",
  disabled = false,
  label,
  checked,
  onSelect,
}) => {
  const baseClasses =
    "flex items-center gap-[0.75rem] rounded-full border transition-all duration-200 select-none"

  const sizeClass =
    size === "small"
      ? " text-sm py-2 px-3"
      : size === "medium"
        ? " text-base py-2 px-4"
        : " text-lg py-4 px-6"

  const interactionClass = disabled ? "cursor-not-allowed" : "cursor-pointer"

  const colorClass = checked
    ? "bg-cerulean-600 border-cerulean-600 text-white"
    : disabled
      ? "bg-transparent border-shark-300 text-shark-300"
      : "bg-transparent border-shark-400 text-shark-400 hover:bg-shark-50"

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      aria-pressed={checked}
      className={`${baseClasses} ${interactionClass} ${colorClass} ${sizeClass}`}
    >
      <span className="font-medium">{label}</span>
    </button>
  )
}

export default Chip

import React from "react"

interface KeyValueBadgeProps {
  keyLabel: string
  value: string | number | Date | boolean | null | undefined
}

const KeyValueBadge: React.FC<KeyValueBadgeProps> = ({ keyLabel, value }) => {
  const displayValue = value instanceof Date ? value.toLocaleDateString() : value

  return (
    <div className="relative inline-block min-h-[2.375rem] rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm">
      <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">{keyLabel}</span>
      {displayValue}
    </div>
  )
}

export default KeyValueBadge

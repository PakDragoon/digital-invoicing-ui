import React, { useState } from "react"

interface ToggleSwitchProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  labelLeft?: string // Optional label on the left side
  labelRight?: string // Optional label on the right side
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  labelLeft,
  labelRight,
}) => {
  const [isOn, setIsOn] = useState(checked)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onChange?.(newState)
  }

  return (
    <div className="flex items-center space-x-2 text-shark-500">
      {labelLeft && <span>{labelLeft}</span>}
      <button
        onClick={handleToggle}
        style={{
          width: "30px",
          padding: "3px",
        }}
        className={`flex items-center rounded-full transition-colors duration-300 ${
          isOn ? "bg-blue-500" : "bg-gray-200"
        }`}
      >
        <div
          style={{
            width: "12px",
            height: "12px",
            transform: `translateX(${isOn ? "12px" : "0"})`,
          }}
          className={`rounded-full transition-transform duration-300 ${
            isOn ? "bg-white" : "bg-gray-400"
          }`}
        />
      </button>
      {labelRight && <span>{labelRight}</span>}
    </div>
  )
}

export default ToggleSwitch

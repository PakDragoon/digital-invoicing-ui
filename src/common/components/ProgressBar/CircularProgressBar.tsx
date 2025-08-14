import React from "react"

interface CircularProgressBarProps {
  total: number
  progress: number
  size?: number
  strokeWidth?: number
  bgColor?: string
  progressColor?: string
  textColor?: string
  showText?: boolean
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  total,
  progress,
  size = 120,
  strokeWidth = 10,
  bgColor = "bg-gray-200",
  progressColor = "bg-blue-500",
  textColor = "text-gray-800",
  showText = true,
}) => {
  // Validate inputs
  const validatedTotal = Math.max(Number(total) || 0, 0)
  const validatedProgress = Math.min(Math.max(Number(progress) || 0, 0), validatedTotal)

  // Calculate percentage
  const percentage = validatedTotal === 0 ? 0 : (validatedProgress / validatedTotal) * 100
  const bgColorNew = percentage === 0 ? "text-gray-200" : bgColor

  // SVG calculations
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="-rotate-90 transform" width={size} height={size}>
        {/* Background circle */}
        <circle
          className={`text-${bgColorNew.split("-")[1]}-${bgColorNew.split("-")[2]}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />

        {/* Progress circle */}
        <circle
          className={`text-${progressColor.split("-")[1]}-${progressColor.split("-")[2]}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* Percentage text */}
      {showText && (
        <div className={`absolute text-xl font-bold ${textColor}`}>{Math.round(percentage)}%</div>
      )}
    </div>
  )
}

export default CircularProgressBar

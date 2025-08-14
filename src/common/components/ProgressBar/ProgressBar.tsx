import React from "react"

interface ProgressBarProps {
  progress: number
  color?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = "#FF9B9B" }) => {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#F3F3F3]">
      <div
        className="h-full rounded-full transition-all duration-300 ease-in-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )
}

export default ProgressBar

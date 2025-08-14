import React from 'react'

interface ProgressBarProps { label: string; percent: number }

const ProgressBar: React.FC<ProgressBarProps> = ({ label, percent }) => {
  const barColor = percent < 100 ? 'bg-cerulean-600' : 'bg-screamin-600'
  return (
    <div>
      <div className="w-full h-2 bg-gray-200 rounded mb-2">
        <div className={`h-full rounded ${barColor} transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
      <div className="text-sm text-shark-500 mb-1 flex justify-between">
        <span>{label}</span><span>{percent}%</span>
      </div>
    </div>
  )
}

export default ProgressBar

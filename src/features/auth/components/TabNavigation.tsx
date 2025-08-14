import React from "react"
import { SIGNUP_FORM_TABS } from '@/features/auth/constants'

interface IProps {
  currentStep: number
  onTabClick: (stepIndex: number) => void
  completedSteps: number[]
}

const TabNavigation: React.FC<IProps> = ({ currentStep, onTabClick, completedSteps }) => {
  return (
    <div className="w-full mb-2 md:mb-8">
      <div className="flex border-b border-gray-200">
        {SIGNUP_FORM_TABS.map(({ label }, index) => {
          const isActive = index === currentStep
          const isCompleted = completedSteps.includes(index)
          const headerClass = isActive ? 'border-blue-600 text-blue-600 bg-blue-50'
            : isCompleted ? 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-300'
              : 'border-transparent text-gray-400 cursor-not-allowed'

          return (
            <button
              key={index}
              onClick={() => isCompleted && onTabClick(index)}
              disabled={!isCompleted}
              className={`flex-1 px-2 py-2 text-xs lg:text-sm font-medium text-center border-b-2 transition-colors ${headerClass}`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{label}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default TabNavigation

import React, { lazy, Suspense, useState } from "react"
import { SignupLogo } from "@/assets"
import { Link } from "@tanstack/react-router"
const Stepper = lazy(() => import("./Stepper"))
import { ROUTES } from "@/common/routes"
import TabNavigation from '@/features/auth/components/TabNavigation'
import { SIGNUP_FORM_TABS } from '@/features/auth/constants'

const SignupForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleTabClick = (stepIndex) => setCurrentStep(stepIndex)
  const handleStepChange = (newStep) => setCurrentStep(newStep)

  const handleStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps(prev => [...prev, stepIndex])
    }
  }

  return (
    <div className="flex w-[35rem] flex-col items-center justify-center">
      <TabNavigation
        currentStep={currentStep}
        onTabClick={handleTabClick}
        completedSteps={completedSteps}
      />

      <div className="flex w-full flex-col justify-center items-center">
        <div className="flex w-full items-center justify-center py-4">
          <img src={`${SignupLogo}`} alt="Logo" className="h-[2.65rem]" />
        </div>

        <h2 className="mb-[0.9375rem] w-[26.75rem] text-center text-[30px] font-semibold leading-[38px] text-shark-500">
          {SIGNUP_FORM_TABS[currentStep].title}
        </h2>

        <p className="text-center text-[1rem] font-normal text-shark-500 mb-6">
          {SIGNUP_FORM_TABS[currentStep].description}
        </p>

        <div className="space-y-4 w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <Stepper
              currentStep={currentStep}
              onStepComplete={handleStepComplete}
              onStepChange={handleStepChange}
            />
          </Suspense>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have have an account?{" "}
            <Link className="text-[14px] text-primary hover:underline" to={ROUTES.ROOT}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupForm

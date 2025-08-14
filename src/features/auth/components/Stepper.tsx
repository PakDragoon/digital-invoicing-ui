import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState, useEffect } from 'react'
import { FormProvider, useForm } from "react-hook-form"
import { ZodType } from "zod"
import { stepSchemas, ISignUpFormData } from '../schemas/signupSchema'
import { defaultValues } from '@/pages/signup/SignUpFormConfig'
import Modal from '@/common/components/modal/Modal'
import { createModalConfigs, ModalType } from '@/common/utils/modalConfigs'
import { LinkSentIcon } from '@/assets'
import { useMutation } from '@tanstack/react-query'
import { createDealership, updateEmployee } from '@/features/auth/services/authApi'
import { getErrorMessage } from '@/common/utils/errors.utils'
import { toast } from 'react-toastify'
import StepFields from './StepFields'
import { IUpdateEmployee } from '@/features/auth/components/ProfileForm'
import { useCsvUpload } from '../hooks/useCsvUpload'
import StepButtons from './StepButtons'
import UploadProgressDisplay from './UploadProgressDisplay'
import { UPLOAD_EMPLOYEE_CSV_API_URL } from '@/features/auth/constants'
import api from '@/core/config/api'
import { useNavigate } from '@tanstack/react-router'

interface StepperProps {
  currentStep?: number
  onStepComplete?: (stepIndex: number) => void
  onStepChange?: (stepIndex: number) => void
}

const Stepper: React.FC<StepperProps> = ({
  currentStep: externalCurrentStep = 0,
  onStepComplete,
  onStepChange
}) => {
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const token: string | null = searchParams.get("token")
  const dealershipId: string | null = searchParams.get("dealershipId")
  const companyId: string | null = searchParams.get("companyId")
  const employeeId: string | null = searchParams.get("employeeId")
  const [loading, setLoading] = useState<boolean>(false)
  const [globalFormData, setGlobalFormData] = useState<Partial<ISignUpFormData>>({})
  const [currentModal, setCurrentModal] = useState<ModalType>(null)
  const currentStep = externalCurrentStep
  const currentSchema: ZodType<Partial<ISignUpFormData>> = stepSchemas[currentStep]

  const { uploadProgress, processingProgress, uploadStatus, startUpload, cancelUpload } = useCsvUpload(UPLOAD_EMPLOYEE_CSV_API_URL, companyId, dealershipId)

  const methods = useForm<ISignUpFormData>({
    resolver: zodResolver(currentSchema),
    defaultValues,
    mode: "onChange",
  })

  const { handleSubmit, trigger, getValues } = methods

  useEffect(() => {
    const verifyInviteToken = async () => {
      if (!token || !employeeId || !dealershipId) return

      try {
        const response = await api.get(`/employee/verify/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { dealershipId },
        })

        if (response?.data?.data === true || response?.data?.data === null) navigate({ to: '/' })
      } catch (error) {
        console.error('Failed to verify invite:', error)
      }
    }

    verifyInviteToken()
  }, [token, employeeId, dealershipId])

  useEffect(() => {
    if (dealershipId && onStepChange) {
      onStepChange(2)
      setCurrentModal('welcomeOnboard')
    }
  }, [dealershipId])

  useEffect(() => {
    if (externalCurrentStep !== undefined) {
      const currentValues = methods.getValues()
      setGlobalFormData((prev) => ({ ...prev, ...currentValues }))
    }
  }, [externalCurrentStep])

  const nextStep = async () => {
    const isValid = await trigger()
    if (!isValid) return

    const currentValues = getValues()
    setGlobalFormData((prev) => ({ ...prev, ...currentValues }))

    if (onStepComplete) onStepComplete(currentStep)
    const nextStepIndex = currentStep + 1

    if (onStepChange) onStepChange(nextStepIndex)
  }

  const createDealershipMutation = useMutation({
    mutationFn: (payload: ISignUpFormData) => createDealership(payload),
    onSuccess: () => setCurrentModal("inviteSent"),
    onError: (error) => {
      console.error('Error creating dealership: ', error)
      const errorMessage = getErrorMessage(error) ?? 'Unable to create dealership. Please try again later.';
      toast.error(errorMessage)
    },
    onSettled: () => setLoading(false),
  })

  const setPasswordMutation = useMutation({
    mutationFn: (payload: IUpdateEmployee) => updateEmployee(payload, employeeId!, token!, undefined),
    onSuccess: () => {
      toast.success('Password set successfully')
      onStepChange?.(currentStep + 1)
    },
    onError: (error) => {
      console.error('Error setting password: ', error)
      const errorMessage = getErrorMessage(error) ?? 'Unable to set password. Please try again later.';
      toast.error(errorMessage)
    },
    onSettled: () => setLoading(false),
  })

  const submitAll = (finalValues: ISignUpFormData) => {
    setLoading(true)
    const fullForm = { ...globalFormData, ...finalValues }
    createDealershipMutation.mutate(fullForm)
  }

  const setupPassword = ({ password }: { password: string }) => {
    if (!dealershipId || !employeeId) return toast.error('Failed! Missing dealership or employee ID.')
    setLoading(true)
    const payload: IUpdateEmployee = { dealershipId, password, isActive: true }
    setPasswordMutation.mutate(payload)
  }

  const handleUploadAction = () => {
    if (uploadStatus === 'idle' || uploadStatus === 'error') {
      const file = getValues().file
      startUpload(file)
    } else if (uploadStatus === 'uploading') {
      cancelUpload()
    }
  }

  const MODAL_CONFIGS = createModalConfigs({
    email: getValues()?.email,
    setCurrentModal,
    LinkSentIcon: String(LinkSentIcon),
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitAll)} key={currentStep}>
        <StepFields step={currentStep} />

        {currentStep === 4 && (
          <UploadProgressDisplay
            uploadStatus={uploadStatus}
            uploadProgress={uploadProgress}
            processingProgress={processingProgress}
          />
        )}

        <StepButtons
          currentStep={currentStep}
          loading={loading}
          uploadStatus={uploadStatus}
          onNext={nextStep}
          onSubmit={handleSubmit(submitAll)}
          onSetPassword={handleSubmit(setupPassword)}
          onSkip={() => onStepChange?.(currentStep + 1)}
          onUploadAction={handleUploadAction}
          setCurrentModal={setCurrentModal}
        />
      </form>

      {currentModal && (
        <Modal
          isOpen={Boolean(currentModal)}
          onClose={() => setCurrentModal(null)}
          heading={MODAL_CONFIGS[currentModal].heading}
          buttonText={MODAL_CONFIGS[currentModal].buttonText}
          onButtonClick={MODAL_CONFIGS[currentModal].onButtonClick}
          icon={MODAL_CONFIGS[currentModal].icon}
          size="w-[26.5rem] h-[28.5rem]"
          iconBgClass={MODAL_CONFIGS[currentModal].iconBgClass}
          headingClass="text-shark-500 mb-[1rem] leading-[1.35rem]"
          buttonClass={MODAL_CONFIGS[currentModal].buttonClass}
        >
          {MODAL_CONFIGS[currentModal].content}
        </Modal>
      )}
    </FormProvider>
  )
}

export default Stepper

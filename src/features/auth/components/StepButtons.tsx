import React from 'react'
import { UploadStatus } from '@/features/auth/hooks/useCsvUpload'
import { ModalType } from '@/common/utils/modalConfigs'
import { FiDownload } from "react-icons/fi";

interface StepButtonsProps {
  currentStep: number
  loading: boolean
  uploadStatus: UploadStatus
  onNext: () => void
  onSubmit: () => void
  onSetPassword: () => void
  onSkip: () => void
  onUploadAction: () => void
  setCurrentModal: (modal: ModalType) => void
}

type StepButton = {
  label: string;
  action: () => void | Promise<void>;
  type?: 'primary' | 'secondary';
  isAsync?: boolean;
  loadingText?: string;
  disabled?: boolean;
};

type StepButtonConfig = Record<number, StepButton[]>;

const StepButtons: React.FC<StepButtonsProps> = ({
  currentStep,
  loading,
  uploadStatus,
  onNext,
  onSubmit,
  onSetPassword,
  onSkip,
  onUploadAction,
  setCurrentModal
}) => {
  const getButtonClass = (type: "primary" | "secondary" = "primary") => {
    return type === "secondary"
      ? "bg-gray-300 text-gray-700"
      : "bg-blue-600 text-white"
  }

  const getUploadButtonText = () => {
    switch (uploadStatus) {
      case 'idle': return 'Upload CSV'
      case 'uploading': return 'Cancel Upload'
      case 'processing': return 'Processing…'
      case 'success': return 'Done'
      case 'error': return 'Retry'
      default: return 'Upload CSV'
    }
  }

  const handleUploadAction = () => {
    if (uploadStatus === 'success') {
      setCurrentModal('dealershipCreated')
    } else {
      onUploadAction()
    }
  }

  const stepButtonConfigs: StepButtonConfig = {
    0: [{ label: "Next", action: onNext }],
    1: [{
      label: "Send Invite",
      action: onSubmit,
      isAsync: true,
      loadingText: "Sending Invite...",
      disabled: loading
    }],
    2: [{
      label: "Set Password",
      action: onSetPassword,
      isAsync: true,
      loadingText: "Setting Password...",
      disabled: loading
    }],
    // TODO: will be removed after csv upload tested
    // 2: [{
    //   label: "Set Password",
    //   action: onSkip,
    // }],
    3: [
      { label: "Skip", action: onSkip, type: "secondary" as const },
      { label: "Next", action: onNext },
    ],
    4: [{
      label: getUploadButtonText(),
      action: handleUploadAction,
      type: uploadStatus === 'processing' ? 'secondary' as const : 'primary' as const,
      disabled: uploadStatus === 'processing'
    }],
  }

  const buttons = stepButtonConfigs[currentStep as keyof typeof stepButtonConfigs] || []

  return (
    <div className="buttons mt-6">
      <div className="flex w-full justify-between gap-2">
        {buttons.map((btn, index) => (
          <button
            key={index}
            type="button"
            onClick={btn.action}
            className={`h-[44px] w-full rounded p-2 text-sm font-medium transition ${getButtonClass(btn.type)}`}
            disabled={btn.disabled}
          >
            {btn.isAsync && btn.disabled ? btn.loadingText : btn.label}
          </button>
        ))}
      </div>
      {currentStep === 4 && (
        <div className="flex justify-center items-center text-center mt-2 gap-1">
          <a
            href="/sample_employee.csv"
            download
            className="group flex items-center gap-1 text-sm text-shark-600 hover:text-cerulean-600"
          >
            <span className="underline group-hover:text-cerulean-600">
              Sample Sheet.csv
            </span>
            <FiDownload className="group-hover:text-cerulean-600" />
          </a>
        </div>
      )}
    </div>
  )
}

export default StepButtons

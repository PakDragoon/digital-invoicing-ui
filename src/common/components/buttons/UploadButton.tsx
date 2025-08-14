import React from 'react'
import { UploadStatus } from '@/features/auth/hooks/useCsvUpload'

interface UploadButtonProps {
  uploadStatus: UploadStatus
  onUploadAction: () => void
  className?: string
  disabled?: boolean
  primaryColor?: string
  primaryTextColor?: string
  secondaryColor?: string
  secondaryTextColor?: string
  disabledColor?: string
  disabledTextColor?: string
}

const UploadButton: React.FC<UploadButtonProps> = ({
  uploadStatus,
  onUploadAction,
  className = '',
  disabled = false,
  primaryColor = 'bg-cerulean-600',
  primaryTextColor = 'text-white',
  secondaryColor = 'bg-cinnabar-600',
  secondaryTextColor = 'text-white',
  disabledColor = 'bg-shark-300',
  disabledTextColor = 'text-shark-700'
}) => {
  const getUploadButtonText = () => {
    switch (uploadStatus) {
      case 'idle': return 'Upload CSV'
      case 'uploading': return 'Cancel Upload'
      case 'processing': return 'Processing…'
      case 'success': return 'Clear'
      case 'error': return 'Retry'
      default: return 'Upload CSV'
    }
  }

  const getButtonClass = () => {
    const baseClass = "h-[44px] w-full rounded p-2 text-sm font-medium transition cursor-pointer"
    let colorClass = ''

    if (disabled || uploadStatus === 'processing') colorClass = `${disabledColor} ${disabledTextColor} cursor-not-allowed`
    else if (uploadStatus === 'uploading') colorClass = `${secondaryColor} ${secondaryTextColor}`
    else colorClass = `${primaryColor} ${primaryTextColor} hover:opacity-90`

    return `${baseClass} ${colorClass} ${className}`
  }

  return (
    <button
      type="button"
      onClick={onUploadAction}
      className={getButtonClass()}
      disabled={disabled}
    >
      {getUploadButtonText()}
    </button>
  )
}

export default UploadButton

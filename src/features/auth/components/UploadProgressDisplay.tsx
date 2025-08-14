import React from 'react'
import ProgressBar from '@/features/auth/components/ProgressBar'
import { UploadStatus } from '../hooks/useCsvUpload'

interface UploadProgressDisplayProps {
  uploadStatus: UploadStatus
  uploadProgress: number
  processingProgress: number
}

const UploadProgressDisplay: React.FC<UploadProgressDisplayProps> = ({
  uploadStatus,
  uploadProgress,
  processingProgress
}) => {
  if (uploadStatus === 'idle') return null
  const statusMap: Record<UploadStatus, { label: string; percent: number }> = {
    uploading: { label: 'Uploading', percent: uploadProgress },
    processing: { label: 'Processing', percent: processingProgress },
    success: { label: 'Successfully Processed', percent: processingProgress },
    idle: { label: '', percent: 0 }, error: { label: '', percent: 0 },
  }

  const { label, percent } = statusMap[uploadStatus]

  return (
    <div className="mt-4">
      <ProgressBar key={uploadStatus} label={label} percent={percent} />
    </div>
  )
}

export default UploadProgressDisplay

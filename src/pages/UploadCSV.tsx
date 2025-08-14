import React, { useState } from "react"
import ImageUploader from "@/features/auth/components/ImageUploader"
import { useCsvUpload } from '@/features/auth/hooks/useCsvUpload'
import { UPLOAD_DEAL_CSV_API_URL } from '@/features/auth/constants'
import UploadProgressDisplay from '@/features/auth/components/UploadProgressDisplay'
import { useAuthStore } from '@/features/auth/stores/authStore'
import UploadButton from '@/common/components/buttons/UploadButton'
import { toast } from 'react-toastify'
import { ALLOWED_SHEET_TYPES } from '@/common/constants/file-upload'

const UploadCsv: React.FC = () => {
  const token = useAuthStore((state) => state.accessToken)
  const [file, setFile] = useState<File | null>(null)

  const {
    uploadProgress,
    processingProgress,
    uploadStatus,
    startUpload,
    cancelUpload,
    resetUpload
  } = useCsvUpload(UPLOAD_DEAL_CSV_API_URL, '1', '1', token)

  const handleUploadAction = () => {
    if (!file) return toast.error("Please select a file to upload")
    if (uploadStatus === 'idle' || uploadStatus === 'error') startUpload(file)
    else if (uploadStatus === 'uploading') cancelUpload()
    else {
      setFile(null)
      resetUpload()
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-semibold">Upload CSV File</h2>

      <ImageUploader
        setValue={(field, value) => {
          if (field === "csvFile") setFile(value as File)
        }}
        type="CSV"
        allowedTypes={ALLOWED_SHEET_TYPES}
        onUpload={(file) => setFile(file)}
        setFile={setFile}
        file={file}
      />

      <UploadProgressDisplay
        uploadStatus={uploadStatus}
        uploadProgress={uploadProgress}
        processingProgress={processingProgress}
      />

      <div className="mt-4">
        <UploadButton
          uploadStatus={uploadStatus}
          onUploadAction={handleUploadAction}
          disabled={!file || uploadStatus === 'processing'}
        />
      </div>
    </div>
  )
}

export default UploadCsv

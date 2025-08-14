import React, { useState } from "react"
import { UseFormSetValue } from "react-hook-form"
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/common/constants/file-upload"

interface ImageUploaderProps {
  setValue: UseFormSetValue<any>
  type: string
  title?: string
  onUpload?: (file: File) => void
  initialImage?: string
  allowedTypes?: string[]
  maxSize?: number
  setFile: (file: File | null) => void
  file?: File | null
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setValue,
  title,
  onUpload,
  allowedTypes = ALLOWED_IMAGE_TYPES,
  maxSize = MAX_FILE_SIZE,
  setFile,
  file,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationState, setValidationState] = useState<"default" | "valid" | "invalid">("default")

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type)) {
      const readableTypes = allowedTypes
        .map((type) => type.split("/")[1]?.toUpperCase())
        .filter(Boolean)
        .join(", ")
      setError(`Only files of type (${readableTypes}) are allowed`)
      setValidationState("invalid")
      return false
    }

    if (file.size > (maxSize || MAX_FILE_SIZE)) {
      setError("File size cannot exceed 5 MB")
      setValidationState("invalid")
      return false
    }

    setError(null)
    setValidationState("valid")
    return true
  }

  const handleImageUpload = (file: File) => {
    setFile(file)
    if (!validateFile(file)) return

    const reader = new FileReader()
    let cancelled = false
    reader.onload = (e) => {
      if (!cancelled) {
        const result = e.target?.result as string
        const isImage = file.type.startsWith("image/")
        const isCSV = file.type === "text/csv"

        if (isImage) {
          setImagePreview(result)
        } else if (isCSV) {
          setImagePreview(null)
        }

        setValue(file.type, file)
        onUpload?.(file)
      }
    }

    reader.onerror = () => {
      console.error("FileReader error:", reader.error)
    }

    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file)
    } else if (file.type === "text/csv") {
      reader.readAsText(file)
    } else {
      console.warn("Unsupported file type for preview")
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) handleImageUpload(files[0])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (!validateFile(files[0])) return
    if (files.length > 0) handleImageUpload(files[0])
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)

    const items = Array.from(e.dataTransfer.items)
    const fileItem = items.find((item) => item.kind === "file" && item.type)

    const mimeType = fileItem?.type
    if (mimeType) {
      const isValid = allowedTypes.includes(mimeType)
      if (!isValid) {
        const readableTypes = allowedTypes
          .map((type) => type.split("/")[1]?.toUpperCase())
          .filter(Boolean)
          .join(", ")
        setError(`Only files of type (${readableTypes}) are allowed.`)
        setValidationState("invalid")
      } else {
        setError(null)
        setValidationState("valid")
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      setValidationState("default")
      setError(null)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setValue("", null)
    setFile(null)
    setError(null)
    setValidationState("default")
  }

  const getBorderColor = () => {
    if (validationState === "valid") return "border-green-400"
    if (validationState === "invalid") return "border-red-400"
    return isDragOver ? "border-blue-400" : "border-gray-300"
  }

  const dropAreaClasses = `border-2 border-dashed rounded-lg p-6 text-center transition-colors ${getBorderColor()} ${
    isDragOver ? "bg-blue-50" : ""
  }`

  return (
    <div className="lg:col-span-1">
      <div className="rounded-md px-4 py-6 shadow-lg">
        <h3 className="mb-4 text-sm font-medium text-gray-700">{title}</h3>

        {file ? (
          <div className="relative">
            {imagePreview && file.type.startsWith("image/") ? (
              <img src={imagePreview} alt="File" className="h-48 w-full rounded-lg object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-700">
                {file.name}
              </div>
            )}

            <button
              type="button"
              onClick={removeImage}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div
            className={dropAreaClasses}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="rounded-full bg-gray-100 p-3">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600">Drag and drop a file here, or</p>
              <label className="inline-flex cursor-pointer items-center rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600">
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Choose File
                <input
                  type="file"
                  accept={allowedTypes.join(",")}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageUploader

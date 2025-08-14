import { useRef, useState } from "react"
interface CustomFileUploadProps {
  onFileChange: (file: File | null) => void
  acceptedFileTypes?: string
}

const CustomFileUpload: React.FC<CustomFileUploadProps> = ({
  onFileChange,
  acceptedFileTypes = ".xls,.xlsx",
}) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setFileName(file ? file.name : null)
    onFileChange(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const file = event.dataTransfer.files?.[0] || null
    setFileName(file ? file.name : null)
    onFileChange(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      onClick={triggerFileInput}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="cursor-pointer rounded-md border-2 border-[#3455DB] p-3 text-center"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={acceptedFileTypes}
        className="hidden"
      />
      {fileName ? (
        <p className="font-medium text-[#3455DB]">{fileName}</p>
      ) : (
        <p className="text-[#3455DB]">Drag & Drop or Upload .xls File</p>
      )}
    </div>
  )
}

export default CustomFileUpload

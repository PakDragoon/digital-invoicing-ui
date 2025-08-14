import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import { JOB_STATUS_API_URL } from '@/features/auth/constants'

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error'

export const useCsvUpload = (uploadUrl: string, companyId: string | null, dealershipId: string | null, token?: string) => {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    return () => {
      xhrRef.current?.abort()
      eventSourceRef.current?.close()
    }
  }, [])

  const startUpload = (file: File | undefined) => {
    if (!file) return toast.error('Please select a CSV first.')
    if (!companyId || !dealershipId) return toast.error('Company & Dealership ID are required.')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('companyId', companyId)
    formData.append('dealershipId', dealershipId)
    const req = new XMLHttpRequest()
    xhrRef.current = req
    setUploadStatus('uploading')
    setUploadProgress(0)

    req.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.floor((e.loaded / e.total) * 100))
    }

    req.onload = () => {
      if (req.status === 200 || req.status === 201) {
        const { jobId } = JSON.parse(req.responseText)
        setUploadStatus('processing')
        subscribeToProcessing(jobId)
      } else {
        setUploadStatus('error')
        toast.error('Upload failed')
      }
    }
    req.onerror = () => {
      setUploadStatus('error')
      toast.error('Upload error')
    }

    req.open('POST', uploadUrl)
    if (token) req.setRequestHeader('Authorization', `Bearer ${token}`)
    req.send(formData)
  }

  const cancelUpload = () => {
    xhrRef.current?.abort()
    eventSourceRef.current?.close()
    setUploadStatus('idle')
    setUploadProgress(0)
    setProcessingProgress(0)
  }

  const subscribeToProcessing = (jobId: string) => {
    setProcessingProgress(0)
    const es = new EventSource(`${JOB_STATUS_API_URL}/${jobId}`)
    eventSourceRef.current = es

    es.onmessage = (e) => {
      const { percent } = JSON.parse(e.data)
      setProcessingProgress(percent)
      if (percent === 100) {
        setUploadStatus('success')
        es.close()
      }
    }
    es.onerror = () => {
      setUploadStatus('error')
      toast.error('Processing failed')
      es.close()
    }
    es.addEventListener('close', () => es.close())
  }

  const resetUpload = () => {
    setUploadStatus('idle')
    setUploadProgress(0)
    setProcessingProgress(0)
  }

  return {
    uploadProgress,
    processingProgress,
    uploadStatus,
    startUpload,
    cancelUpload,
    resetUpload
  }
}

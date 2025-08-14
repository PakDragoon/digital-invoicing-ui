import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import api from "@/core/config/api"

export const useDownloadDealershipCsv = () => {
  return useMutation({
    mutationFn: async ({
      csvKey,
      originalFileName,
    }: {
      csvKey: string
      originalFileName: string
    }) => {
      const response = await api.get(`/common/download?csvKey=${csvKey}`, {
        responseType: "blob",
      })

      const blob = new Blob([response.data], { type: "text/csv" })
      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = originalFileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      return true
    },

    onSuccess: () => {
      toast.success("CSV downloaded successfully!")
    },

    onError: (error: any) => {
      console.error("Failed to download CSV:", error)
      toast.error("CSV download failed!")
    },
  })
}

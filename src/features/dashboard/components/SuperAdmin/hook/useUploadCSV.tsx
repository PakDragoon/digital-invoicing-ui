import { useMutation ,useQueryClient} from "@tanstack/react-query"

import { toast } from "react-toastify"
import api from "@/core/config/api"

export const useUploadDealershipCsv = () => {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      file,
      dealershipId,
      companyId,
    }: {
      file: File
      dealershipId: string
      companyId: string
    }) => {
      const formData = new FormData()
      formData.append("file", file)

      const fileName = file.name
      const key = `seeder/${companyId}/${dealershipId}/${fileName}`

      const response = await api.post(
        `/common/upload-csv?key=${encodeURIComponent(key)}&dealershipId=${dealershipId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )


      return response.data
    },
    onSuccess: () => {
      toast.success("CSV uploaded successfully!")
      queryClient.invalidateQueries({ queryKey: ["dealerships"] })
    },
    onError: (error) => {
      toast.error("Upload failed")
      console.error(error)
    },
  })
}

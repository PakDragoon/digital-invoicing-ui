import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import TextField from "../../../common/components/inputs/CustomTextField"
import CustomButton from "../../../common/components/buttons/CustomButton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { dealService } from "@/features/invoice/services/dealApi"
import { EntityType } from "@/common/constants/comment"
import { useGetComments } from "@/features/comment/hook/useComment"
import { FullPageLoader } from "@/common/components/FullPageLoader"
import colors from "@/common/constants/tailwind-colors"

interface Props {
  entityId: string
  entityNo?: string
  entityType: EntityType
  isReadOnly?: boolean
}

const COMMENT_HEADERS = [
  { key: "createdAt", label: "Date" },
  { key: "employeeName", label: "Name" },
  { key: "commentBody", label: "Comment" },
]

interface IComment {
  id: string
  companyId: string
  dealershipId: string
  employeeId: string
  employeeName: string
  entityId: string
  entityType: EntityType
  commentBody: string
  createdAt: string
  updatedAt: string
}

const ListComments: React.FC<Props> = ({ entityId, entityNo, entityType, isReadOnly = false }) => {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useGetComments(entityType, entityId)
  const comments = data?.data || []
  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: { comment: "" },
  })

  const updateDealCommentMutation = useMutation({
    mutationFn: ({ comment }) => dealService.saveComment(entityType, entityId, comment),
    onSuccess: (updatedData) => {
      reset({ comment: "" })
      queryClient.setQueryData(["getComments", entityType, entityId], (oldData: IComment[]) => {
        if (!updatedData) return oldData
        return {
          ...oldData,
          data: [...oldData.data, updatedData.data],
        }
      })
      setLoading(false)
    },
    onError: (error) => console.error("Error saving comment: ", error),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    updateDealCommentMutation.mutate(data)
  }

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <div className="flex flex-col gap-[0.5rem]">
        {!isReadOnly && (
          <div className="mb-1 flex items-center gap-[1rem]">
            <div className="flex-1">
              <Controller
                key="comment"
                name="comment"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="textarea"
                    variant="outlined"
                    height="h-auto"
                    textAreaRows={1}
                    border="border-shark-200"
                  />
                )}
              />
            </div>
            <div>
              <CustomButton
                text={loading ? "Adding..." : "Add"}
                variant="fill"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || loading}
                size="large"
                popup="Enter a comment!"
              />
            </div>
          </div>
        )}
        <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">All Comments</span>
        {isLoading && (
          <div className="flex h-[calc(90%-2rem)]">
            <FullPageLoader />
          </div>
        )}
        {isError && <div className="py-8 text-center text-red-500">Failed to get comments.</div>}
        {!isLoading && !isError && comments.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No comment found for {entityType} #{entityNo || entityId}
          </div>
        )}
        {comments.length > 0 && (
          <div className="flex gap-[1.25rem] rounded-md px-[1rem] py-[0.5rem]">
            <div className="min-h-auto max-h-[16rem] w-full gap-2.5 overflow-y-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-[#fcfcfc]">
                  <tr>
                    {COMMENT_HEADERS.map(({ key, label }) => (
                      <th key={key} className="cursor-pointer px-[1.25rem] py-4 text-cerulean-600">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-semibold text-cerulean-600">{label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comments.map((row, index) => (
                    <tr
                      key={index}
                      style={{ background: index % 2 === 0 ? colors.cerulean["100"] : "white" }}
                    >
                      {COMMENT_HEADERS.map(({ key }, index) => (
                        <td
                          key={key}
                          className="font-regular text-shark-1000 min-w-[6rem] px-3 py-[0.85rem] text-xs"
                        >
                          <span>{row[key]}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListComments

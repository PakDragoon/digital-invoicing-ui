import React, { useEffect, useMemo, useState } from "react"
import { useForm, Controller, useWatch } from "react-hook-form"
import TextField from "../inputs/CustomTextField"
import CustomButton from "../buttons/CustomButton"
import { formatPhoneNumber } from "@/common/utils"
import { toast } from "react-toastify"
import { Plate } from "@/core/entities/platesResponse"
import Chip from "../chip/Chip"
import { plateStatusOptions, PlateUpdatePayload } from "./data-fields/platesStatus"
import { humanize } from "@/common/utils/humanize"
import { updatePlate, useUpdatePlate } from "@/features/plates/hooks/useUpdatePlate"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { formatErrorMessage } from "@/common/utils/formatErrorMessage"
import ListComments from "@/features/comment/components/ListComments"
import { EntityType } from "@/common/constants/comment"
import { useAuthStore } from "@/features/auth/stores/authStore"

interface PlatesFormProps {
  data: Plate
}

const PlatesForm: React.FC<PlatesFormProps> = ({ data }) => {
  const [loadingStates, setLoadingStates] = useState(false)
  const [status, setStatus] = useState("")
  const queryClient = useQueryClient()
  const { mutate, isPending } = useUpdatePlate()

  const dealershipId: string = useAuthStore((state) => state.user?.dealershipId?.toString() ?? "")
  if (!dealershipId) throw new Error("Dealership Id does not exist")
  const userRole: string = useAuthStore((state) => state.user?.role?.toString() ?? "")
  if (!userRole) throw new Error("User role does not exist")
  const isDisabled = userRole !== "Receptionist"

  const initialFormData: PlateUpdatePayload = {
    plateStatus: (data.plateStatus as PlateUpdatePayload["plateStatus"]) ?? "Processing",
    plateNumber: data.plateNumber ?? "",
  }

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<PlateUpdatePayload>({
    mode: "onChange",
    defaultValues: initialFormData,
  })

  const onSubmit = (updatePayload: PlateUpdatePayload) => {
    setLoadingStates(true)
    mutate(
      {
        plateId: Number(data.id),
        dealershipId: Number(dealershipId),
        payload: {
          plateNumber: updatePayload.plateNumber,
          plateStatus: updatePayload.plateStatus,
        },
      },
      {
        onSuccess: () => {
          toast.success("Plate updated successfully")
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "/plates",
          })
        },
        onError: (error: any) => {
          toast.error(formatErrorMessage(error.formattedErrorMessage) || "Failed to update plate")
        },
        onSettled: () => setLoadingStates(false),
      }
    )
  }

  const watchedPlateStatus = useWatch({ control, name: "plateStatus" })
  const watchedPlateNumber = useWatch({ control, name: "plateNumber" })

  const isFormUnchanged = useMemo(() => {
    return (
      watchedPlateStatus === initialFormData.plateStatus &&
      watchedPlateNumber === initialFormData.plateNumber
    )
  }, [watchedPlateStatus, watchedPlateNumber, initialFormData])

  useEffect(() => {
    setStatus(data.plateStatus)
  }, [data.plateStatus])

  const updatePlateMutation = useMutation({
    mutationFn: ({ plateNumber, plateStatus }: PlateUpdatePayload) =>
      updatePlate({
        plateId: Number(data.id),
        dealershipId: Number(dealershipId),
        payload: {
          plateNumber: plateNumber,
          plateStatus: plateStatus,
        },
      }),
    onSuccess: () => {
      toast.success("Plate status updated successfully.")
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === `/plates`,
      })
    },
    onError: (error: Error) => {
      console.error("Error updating make ready: ", error)
      toast.error("Unable to update make ready. Please try again later.")
    },
    onSettled: () => setLoadingStates(false),
  })

  const updateStatus = (formData: PlateUpdatePayload) => {
    const plateStatus = formData.plateStatus
    const plateNumber = formData.plateNumber
    setStatus(formData.plateStatus)
    setLoadingStates(true)
    updatePlateMutation.mutate({ plateStatus, plateNumber })
  }

  return (
    <React.Fragment>
      {loadingStates ? (
        <div className="relative">
          <div className="semibold-text-sm absolute right-[2.5rem] top-[2.5rem] text-cerulean-600">
            Updating Plate...
          </div>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[2.625rem] px-[2.25rem] pb-[2.25rem] pt-[1.969rem]"
      >
        <div className="flex flex-col gap-[0.938rem]">
          <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">Status</span>
          <div className="mb-[32px] rounded-md">
            <Controller
              control={control}
              name="plateStatus"
              rules={{ required: true }}
              render={({ field }) => (
                <div className="flex gap-[2rem]">
                  {plateStatusOptions.map((option) => (
                    <Chip
                      key={option}
                      label={humanize(option)}
                      checked={field.value === option}
                      disabled={isDisabled}
                      onSelect={async () => {
                        field.onChange(option)
                        const formData = getValues()

                        try {
                          await updateStatus(formData)
                        } catch (error) {
                          console.error("Error updating plate:", error)
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            />
          </div>

          <span className="semibold-text-sm max-h-[1.25rem] text-cerulean-600">
            Plate Information
          </span>

          <div className="grid grid-cols-4 gap-[1.25rem] rounded-md px-[1rem] pb-[1.5rem] shadow-md">
            <TextField
              placeholder="Deal #"
              type="number"
              value={data.dealId}
              variant="contained"
              disabled={true}
            />

            <TextField
              placeholder="Customer Name"
              value={data.customerName}
              variant="contained"
              disabled={true}
            />

            <TextField
              placeholder="Sales Person"
              value={data.salesperson01}
              variant="contained"
              disabled={true}
            />

            <TextField
              placeholder="Sales Person 2"
              value={data.salesperson02}
              variant="contained"
              disabled={true}
            />

            <TextField
              placeholder="Cell Phone"
              variant="contained"
              value={formatPhoneNumber(data.phone ?? "")}
              disabled={true}
            />

            <TextField placeholder="Work Phone" variant="contained" disabled={true} />

            <TextField placeholder="Email" value={data.email} variant="contained" disabled={true} />

            <TextField
              placeholder="Age"
              variant="contained"
              value={data.age?.toString()}
              disabled={true}
            />

            <TextField
              placeholder="Make"
              value={data.make}
              variant="contained"
              disabled={true}
            />

            <TextField placeholder="Model" value={data.model} variant="contained" disabled={true} />

            <TextField placeholder="Year" value={data.year} variant="contained" disabled={true} />

            <Controller
              name="plateNumber"
              rules={{ required: true }}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Plate #"
                  variant="contained"
                  required
                  disabled={
                    ["Notified", "Delivered", "Mailed", "PickedUp"].includes(status) || isDisabled
                  }
                />
              )}
            />
          </div>

          <span className="semibold-text-sm text-cerulean-600">Add Comment</span>

          <ListComments entityId={data.id} entityType={EntityType.Plate} />
        </div>
        <footer className="sticky bottom-0 z-10 bg-lightBg p-4">
          {!isDisabled && (
            <div className="flex justify-center gap-4">
              <CustomButton
                text="Notify"
                type="submit"
                variant="outlined"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || isPending || isFormUnchanged}
                size="large"
                popup="Fill the Required Fields!"
              />
              <CustomButton
                text="Save"
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || isPending || isFormUnchanged}
                size="large"
                popup="Fill the Required Fields!"
              />
            </div>
          )}
        </footer>
      </form>
    </React.Fragment>
  )
}

export default PlatesForm

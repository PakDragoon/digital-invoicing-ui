import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import {
  profileFields,
  ProfileFormData,
  initialFormData,
  getProfileSchema,
} from "./ProfileFormConfig"
import InputField from "./InputField"
import { useAuthStore } from "@/features/auth/stores/authStore"
import CustomButton from "@/common/components/buttons/CustomButton"
import { useEmployee } from "@/features/auth/hooks/useEmployee"
import ImageUploader from "./ImageUploader"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateEmployee } from "@/features/auth/services/authApi"
import { sanitizePhoneNumber } from "@/common/utils/cleanPhoneNumber"
import { toast } from "react-toastify"
import { formatPhoneNumber } from "@/common/utils"
import { FullPageLoader } from "@/common/components/FullPageLoader"
import { getErrorMessage } from "@/common/utils/errors.utils"
import { zodResolver } from "@hookform/resolvers/zod"

export interface IUpdateEmployee {
  dealershipId: string
  firstName?: string
  lastName?: string
  phone?: string
  password?: string
  role?: string
  isActive?: boolean
}

const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient()
  const id = useAuthStore((state) => state.user?.id.toString() ?? "")
  const user = useAuthStore((state) => state.user ?? "")
  const role = useAuthStore((state) => state.user?.role.toString() ?? "")
  const dealershipId = useAuthStore((state) => state.user?.dealershipId?.toString() ?? "")
  const setUser = useAuthStore((state) => state.setUser)
  const [loading, setLoading] = useState<boolean>(false)
  const { data: employee } = useEmployee(id, dealershipId, role)
  const initialFormValues = initialFormData(employee)
  const [file, setFile] = useState<File | null>(null)
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: initialFormValues,
    resolver: zodResolver(getProfileSchema(role)),
  })

  useEffect(() => {
    if (employee) {
      const formData = initialFormData(employee)
      reset(formData)
    }
  }, [employee, reset])

  const updateProfileMutation = useMutation({
    mutationFn: (payload: IUpdateEmployee) => updateEmployee(payload, id, undefined, role),

    onSuccess: (updatedData) => {
      queryClient.invalidateQueries({ queryKey: ["getUser", id, dealershipId] })
      setUser(
        role === "Admin"
          ? { fullName: updatedData.fullName }
          : { firstName: updatedData.firstName, lastName: updatedData.lastName }
      )

      const newFormData = initialFormData(updatedData, user)
      reset(newFormData)

      toast.success("Profile updated successfully.")
    },
    onError: (error) => {
      console.error("Error updating employee: ", error)
      const errorMessage =
        getErrorMessage(error) ?? "Unable to update profile. Please try again later."
      toast.error(errorMessage)
    },
    onSettled: () => setLoading(false),
  })

  const onSubmit = (data: ProfileFormData) => {
    setLoading(true)
    const payload: IUpdateEmployee = {
      dealershipId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: sanitizePhoneNumber(data.phone),
      ...(data.newPassword && { password: data.newPassword }),
    }

    updateProfileMutation.mutate(payload)
  }

  const handleCancel = () => {
    if (employee) reset(initialFormData(employee))
  }

  if (!employee) {
    return (
      <div className="flex h-full items-center justify-center">
        <FullPageLoader />
      </div>
    )
  }

  return (
    <div className="mx-auto w-[60rem]">
      <h1 className="mb-6 text-2xl font-semibold">Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 rounded-md px-4 py-6 md:grid-cols-2">
              {profileFields
                .filter((field) => {
                  const excludedFieldsForAdmin = ["phone", "roleName", "dmsEmployeeId"]
                  return !(role === "Admin" && excludedFieldsForAdmin.includes(field.field))
                })
                .map((field) => (
                  <div
                    key={field.field}
                    className={`${field.config?.fullWidth ? "md:col-span-2" : "md:col-span-1"} mb-4`}
                  >
                    <InputField control={control} data={field} />
                  </div>
                ))}
            </div>
          </div>
          <ImageUploader
            setValue={setValue}
            title="Profile Picture"
            type="Profile"
            allowedTypes={["image/jpeg", "image/jpg", "image/png", "image/webp"]}
            setFile={setFile}
            file={file}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          {isDirty && <CustomButton text="Cancel" variant="outlined" onClick={handleCancel} />}
          <CustomButton
            text={loading ? "Updating..." : "Update Profile"}
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            disabled={loading || !isDirty}
          />
        </div>
      </form>
    </div>
  )
}

export default ProfilePage

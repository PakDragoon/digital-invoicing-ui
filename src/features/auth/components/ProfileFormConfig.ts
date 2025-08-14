import { formatPhoneNumber } from "@/common/utils"
import { IFieldProps } from "@/features/auth/components/InputField"
import { z } from "zod"
import { sanitizePhoneNumber } from "@/common/utils/cleanPhoneNumber"
export const getProfileSchema = (role: string) =>
  z
    .object({
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().min(1, "Last Name is required"),
      email: z.string().email("Invalid email").optional(),
      phone:
        role === "Admin"
          ? z
              .string()
              .optional()
              .transform((val) => (val ? sanitizePhoneNumber(val) : val))
          : z
              .string()
              .min(1, "Phone number is required")
              .transform((val) => sanitizePhoneNumber(val))
              .refine(
                (val) => /^\+1\d{10}$/.test(val),
                {
                  message: "Phone number must be in format +1 (XXX) XXX-XXXX",
                }
              ),
      dmsEmployeeId: z.string().optional(),
      roleName: z.string().optional(),
      profileImage: z.any().optional(),
      newPassword: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .refine((data) => !data.newPassword || data.newPassword.length >= 6, {
      message: "Password must be at least 6 characters long",
      path: ["newPassword"],
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })


export type ProfileFormData = z.infer<ReturnType<typeof getProfileSchema>> & {
  fullName?: string
}


export const initialFormData = (data: ProfileFormData) => {
  const fullName = data?.fullName?.trim() || ""
  const [firstName, lastName = ""] = fullName
    ? fullName.split(" ")
    : [data?.firstName || "", data?.lastName || ""]

  return {
    firstName: firstName || "",
    lastName: lastName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    dmsEmployeeId: data?.dmsEmployeeId || "",
    roleName: data?.roleName || "",
    profileImage: data?.profileImage || "",
    newPassword: "",
    confirmPassword: "",
  }
}

export const profileFields: IFieldProps[] = [
  {
    type: "text",
    field: "firstName",
    label: "First Name",
    require: true,
    config: { fullWidth: false },
  },
  {
    type: "text",
    field: "lastName",
    label: "Last Name",
    require: true,
    config: { fullWidth: false },
  },
  {
    type: "text",
    field: "email",
    label: "Email",
    disabled: true,
    require: false,
    config: { fullWidth: true },
  },
  {
    type: "text",
    field: "phone",
    label: "Phone",
    require: true,
    config: { format: formatPhoneNumber, fullWidth: true },
  },
  {
    type: "text",
    field: "dmsEmployeeId",
    label: "DMS Employee ID",
    disabled: true,
    require: false,
    config: { fullWidth: true },
  },
  {
    type: "text",
    field: "roleName",
    label: "Role",
    disabled: true,
    require: false,
    config: { fullWidth: true },
  },
  {
    type: "password",
    field: "newPassword",
    label: "New Password",
    disabled: false,
    require: false,
    config: { fullWidth: true },
  },
  {
    type: "password",
    field: "confirmPassword",
    label: "Confirm Password",
    disabled: false,
    require: false,
    config: { fullWidth: true },
  },
]

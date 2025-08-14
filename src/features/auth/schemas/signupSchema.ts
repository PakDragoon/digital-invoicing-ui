import { z } from "zod"
import { sanitizePhoneNumber } from '@/common/utils/cleanPhoneNumber'
import { MAX_FILE_SIZE } from '@/common/constants/file-upload'

const dealershipFieldsSchema = z
  .object({
    companyId: z.string().min(1, "Company name is required"),
    dealershipName: z.string().min(1, "Dealership name is required"),
    addressStreet1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "Zip Code is required"),
    dealershipPhone: z
      .string()
      .min(1, 'Phone number is required')
      .transform((val) => sanitizePhoneNumber(val))
      .refine((val) => {
        return /^\+1\d{10}$/.test(val);
      }, {
        message: 'Phone number must be in format +1 (XXX) XXX-XXXX',
      }),
    // TODO: needs to be tested with form data
    file: z
      .instanceof(File)
      .refine((file) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        return allowedTypes.includes(file.type);
      }, { message: "Only image files are allowed (JPG, JPEG, PNG, WEBP)" })
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: "File size must be less than 5MB"
      })
      .optional(),
  })
  .passthrough()

const userFieldsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(6, { message: "Email is required" })
    .refine(
      (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email)
      },
      { message: "Invalid email address" }
    ),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .transform((val) => sanitizePhoneNumber(val))
    .refine((val) => {
      return /^\+1\d{10}$/.test(val);
    }, {
      message: 'Phone number must be in format +1 (XXX) XXX-XXXX',
    }),
  roleId: z.string().min(1, "Please select a role")
})

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

const dmsIntegrationSchema = z.object({
  dmsIntegration: z.enum(["1", "2"]).optional(),
});

const csvUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => {
      const validTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      return validTypes.includes(file.type) ||
        file.name.endsWith('.csv') ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');
    }, {
      message: "Only CSV and Excel files are allowed",
    })
});

export { dealershipFieldsSchema, userFieldsSchema, passwordSchema, dmsIntegrationSchema, csvUploadSchema }

export const stepSchemas = [
  dealershipFieldsSchema,
  userFieldsSchema,
  passwordSchema,
  dmsIntegrationSchema,
  csvUploadSchema,
] as const;

export type ISignUpFormData = z.infer<typeof stepSchemas[0]> &
  z.infer<typeof stepSchemas[1]> &
  Partial<z.infer<typeof stepSchemas[2]>> &
  Partial<z.infer<typeof stepSchemas[3]>> &
  Partial<z.infer<typeof stepSchemas[4]>>;

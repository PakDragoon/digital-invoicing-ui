import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const forgotPasswordSchema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export const forgotPasswordJsonSchema = zodToJsonSchema(forgotPasswordSchema, "ForgotPasswordSchema")

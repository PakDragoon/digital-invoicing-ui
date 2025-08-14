import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const loginSchema = z.object({
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

  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const loginJsonSchema = zodToJsonSchema(loginSchema, "LoginSchema")

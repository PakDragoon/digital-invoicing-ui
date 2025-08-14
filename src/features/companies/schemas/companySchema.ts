import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"

export const companySchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters long"),
  domain: z
    .string()
    .min(3, "Domain must be at least 3 characters long")
    .url("Invalid domain format"),
})

export type CompanyFormData = z.infer<typeof companySchema>

// Convert Zod schema to JSON Schema for RJSF
export const companyJsonSchema = zodToJsonSchema(companySchema, "CompanySchema")

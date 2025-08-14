import { RJSFSchema } from "@rjsf/utils"

export const mapFormDataForDisplay = (
  schema: RJSFSchema,
  formData: Record<string, any>,
  reverseMappings: Record<string, string> = {}
): Record<string, any> => {
  return Object.keys(schema.properties || {}).reduce(
    (acc, key) => {
      const mappedKey = reverseMappings[key] || key
      acc[key] = formData[mappedKey] || undefined
      return acc
    },
    {} as Record<string, any>
  )
}

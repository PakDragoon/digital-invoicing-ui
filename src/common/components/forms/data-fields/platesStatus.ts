export type FormData = {
  contractStatus: string
  contractFundedDate: string
}

export type FormField<T> = {
  field: keyof T
  type: string
  label: string
  options?: string[]
  require: boolean
}

export const plateStatusOptions = ["Received", "Notified", "Mailed", "PickedUp"] as const

export type PlateStatus = (typeof plateStatusOptions)[number]

export interface PlateUpdatePayload {
  plateNumber: string
  plateStatus: PlateStatus
}

export const usePlatesStatusFields = () => {
  const platesStatusFields: FormField<FormData>[] = [
    { type: "text", field: "dealNo", label: "Deal No #", require: true },
    { type: "text", field: "customerName", label: "Customer Name", require: true },
    { type: "text", field: "salesperson1", label: "Sales Person 1", require: true },
    { type: "text", field: "salesperson2", label: "Sales Person 2", require: false },
    { type: "text", field: "cellPhone", label: "Cell Phone", require: true },
    { type: "text", field: "workPhone", label: "Work Phone", require: false },
    { type: "text", field: "email", label: "Email", require: true },
    { type: "text", field: "age", label: "Age", require: false },
    { type: "text", field: "vehicle", label: "Vehicle", require: false },
    { type: "text", field: "model", label: "Model", require: false },
    { type: "text", field: "color", label: "Color", require: false },
    { type: "text", field: "plateNumber", label: "Plate Number xxx-xxxx", require: false },
  ]

  return platesStatusFields
}

export enum SalesType {
  ALL = "All",
  NEW = "New",
  USED = "Used",
}

export interface SalesTypeOption {
  label: string
  value: SalesType
}

export const SalesTypes: SalesTypeOption[] = [
  { label: "All Sales", value: SalesType.ALL },
  { label: "New Sales", value: SalesType.NEW },
  { label: "Used Sales", value: SalesType.USED },
]

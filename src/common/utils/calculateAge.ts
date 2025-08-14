import { differenceInDays } from "date-fns"
export function calculateAgeInDays(
  startDate: Date | string,
  endDate?: Date | string | null
): number {
  const from = new Date(startDate)
  const to = endDate ? new Date(endDate) : new Date()

  return differenceInDays(to, from)
}

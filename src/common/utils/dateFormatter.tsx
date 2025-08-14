export const formatDate = (
  date: string | number | Date,
  format: Intl.DateTimeFormatOptions = {}
) => {
  if (!date) return "Invalid Date"

  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return "Invalid Date"

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...format,
  }).format(parsedDate)
}

export const formatDateToISO = (date: string) => {
  const parsed = new Date(date)
  return isNaN(parsed.getTime()) ? undefined : parsed.toISOString()
}

// Commonly Used Formats
export const formatFullDate = (date: string | number | Date) =>
  formatDate(date, { weekday: "long", year: "numeric", month: "long", day: "numeric" })

export const formatShortDate = (date: string | number | Date) =>
  formatDate(date, { year: "numeric", month: "short", day: "2-digit" })

export const formatTime = (date: string | number | Date) =>
  formatDate(date, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })

export const removeTimePart = (dateTimeStr: string): string =>
  dateTimeStr?.includes("T") ? dateTimeStr.split("T")[0] : dateTimeStr

export const parseDateStringToUTC = (dateString: string): Date | null => {
  if (!dateString) return null
  const [datePart] = dateString.split("T")
  const parts = datePart.split("-").map((p) => p.trim())
  if (parts.length !== 3) return null
  let year: number, month: number, day: number

  if (/^\d{4}$/.test(parts[0])) {
    year = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1
    day = parseInt(parts[2], 10)
  } else if (/^\d{4}$/.test(parts[2])) {
    day = parseInt(parts[0], 10)
    month = parseInt(parts[1], 10) - 1
    year = parseInt(parts[2], 10)
  } else {
    return null
  }

  return new Date(Date.UTC(year, month, day))
}

export function parseDDMMYYYY(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined
  const [day, month, year] = dateStr.split("-")
  const isoString = `${year}-${month}-${day}`
  const date = new Date(isoString)
  return isValidDate(date) ? date : undefined
}

export const isValidDate = (value: string | Date): boolean => {
  const d = new Date(value)
  return !isNaN(d.getTime())
}

export const formatToYYYYMMDD = (date: string | number | Date | null): string | null => {
  if (!date) return null

  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return null

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
  const day = String(parsedDate.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

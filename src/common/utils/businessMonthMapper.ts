export const generateBusinessMonthMap = (
  monthsAhead: number,
  isFilter: boolean = false
): Record<string, string> => {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  })

  const totalMonths = isFilter ? monthsAhead + 24 : monthsAhead
  const startOffset = isFilter ? -24 : 0

  return Array.from({ length: totalMonths }).reduce<Record<string, string>>((map, _, idx) => {
    const d = new Date(now.getFullYear(), now.getMonth() + startOffset + idx, 1)
    const label = fmt.format(d).toUpperCase()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    map[label] = `${year}-${month}`
    return map
  }, {})
}

export const generateProductionBusinessMonthMap = (): Record<string, string> => {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  })

  const currentYear = now.getFullYear()

  return Array.from({ length: 12 }).reduce<Record<string, string>>((map, _, idx) => {
    const d = new Date(currentYear, idx, 1)
    const label = fmt.format(d).toUpperCase()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    map[label] = `${currentYear}-${month}`
    return map
  }, {})
}

export const formatBusinessMonth = (businessMonth?: string): string => {
  let date = new Date()
  if (businessMonth?.match(/^\d{4}-\d{2}$/)) {
  const [year, month] = businessMonth.split('-').map(Number)
  date = new Date(year, month - 1, 1)
}
  

  if (businessMonth && businessMonth.length === 6) {
    const year = parseInt(businessMonth.slice(0, 4), 10)
    const month = parseInt(businessMonth.slice(4), 10) - 1

    if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 11) {
      const tempDate = new Date(year, month, 1)
      if (!isNaN(tempDate.getTime())) {
        date = tempDate
      }
    }
  }

  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  })
  return fmt.format(date).toUpperCase()
}

export const getCurrentBusinessMonth = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

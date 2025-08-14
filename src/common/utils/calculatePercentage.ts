export function calculatePercentage(
  value: string | number | null,
  total: string | number | null
): number {
  const numValue = Number(value)
  const numTotal = Number(total)

  if (!numTotal || isNaN(numTotal) || numTotal === 0) return 0
  if (!numValue || isNaN(numValue)) return 0

  return Number(((numValue / numTotal) * 100).toFixed(2))
}

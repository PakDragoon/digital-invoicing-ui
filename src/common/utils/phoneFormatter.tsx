export const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return ""
  const startsWithPlus = phone.startsWith("+")
  const cleaned = phone.replace(/\D/g, "")

  if (!cleaned) return startsWithPlus ? "+" : ""

  const limited = cleaned.slice(0, 11)
  const normalized = limited.length === 10 && !limited.startsWith("1") ? "1" + limited : limited
  const match = normalized.match(/^1(\d{3})(\d{3})(\d{4})$/)
  return match
    ? `+1 (${match[1]}) ${match[2]}-${match[3]}`
    : startsWithPlus && cleaned
      ? "+" + cleaned
      : cleaned
}

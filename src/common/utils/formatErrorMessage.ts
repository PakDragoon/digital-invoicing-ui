export function formatErrorMessage(message: string): string {
  if (!message) return ""

  // Trim whitespace
  message = message.trim()

  // Capitalize the first letter
  message = message.charAt(0).toUpperCase() + message.slice(1)

  // Add a full stop if it doesn't end with punctuation
  if (!/[.?!]$/.test(message)) {
    message += "."
  }

  return message
}

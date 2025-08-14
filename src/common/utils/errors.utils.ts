
export const getErrorMessage = (error: Error) => {
  const msg = error?.response?.data?.message
  if (Array.isArray(msg?.message)) return msg.message[0]
  if (typeof msg === "string") return msg
  if (typeof msg?.message === "string") return msg.message
  return null
}

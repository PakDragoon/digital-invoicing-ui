const colorMap: Record<string, string> = {}

export function getRandomColor(key: string, index: number): string {
  if (colorMap[key]) return colorMap[key]

  const colors = [
    "#FBA624",
    "#70FF70",
    "#FF6767",
    "#6C97EE",
    "#51FFFC",
    "#C43AEA",
    "#0AEAD3",
    "#D0FF5A",
    "#6C97EE",
  ]

  const color = colors[index % colors.length]
  colorMap[key] = color
  return color
}

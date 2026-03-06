export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

export function buildSectorPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
  innerR = 0
): string {
  const GAP = 2 // degrees gap between sectors
  const start = startAngle + GAP / 2
  const end = endAngle - GAP / 2

  const p1 = polarToCartesian(cx, cy, r, start)
  const p2 = polarToCartesian(cx, cy, r, end)
  const largeArc = end - start > 180 ? 1 : 0

  if (innerR > 0) {
    const p3 = polarToCartesian(cx, cy, innerR, end)
    const p4 = polarToCartesian(cx, cy, innerR, start)
    return [
      `M ${p1.x} ${p1.y}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
      'Z',
    ].join(' ')
  }

  return [
    `M ${cx} ${cy}`,
    `L ${p1.x} ${p1.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    'Z',
  ].join(' ')
}

import { interpolate } from "remotion"

export function fadeIn(frame: number, start = 0, length = 14): number {
  return interpolate(frame, [start, start + length], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
}

export function enterStyle(frame: number, start = 0): { opacity: number; transform: string } {
  const opacity = fadeIn(frame, start, 16)
  const y = interpolate(opacity, [0, 1], [14, 0])
  return { opacity, transform: `translateY(${y}px)` }
}

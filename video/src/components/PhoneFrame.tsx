import type { ReactNode } from "react"
import { INK, PAPER } from "../styles/tokens.ts"

export function PhoneFrame({ children, width = 520 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        width,
        height: Math.round(width * 1.72),
        borderRadius: 40,
        background: INK,
        padding: 12,
        boxShadow: "0 30px 70px rgba(28,25,23,0.16)",
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 30,
          background: PAPER,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  )
}

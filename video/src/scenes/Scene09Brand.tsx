import { AbsoluteFill, useCurrentFrame } from "remotion"
import { BrandClose } from "../components/ProductScreens.tsx"
import { fadeIn } from "../components/Transitions.tsx"
import { FOREST, PAPER } from "../styles/tokens.ts"

export function Scene09Brand() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 220, height: 6, background: FOREST, marginBottom: 28, opacity: fadeIn(frame, 4, 12) }} />
      <div style={{ opacity: fadeIn(frame, 8, 14) }}>
        <BrandClose />
      </div>
    </AbsoluteFill>
  )
}

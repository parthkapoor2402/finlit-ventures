import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { RecapScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene08Control() {
  const frame = useCurrentFrame()
  const pull = interpolate(frame, [0, 240], [1.04, 1], { extrapolateRight: "clamp" })
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...enterStyle(frame, 4), transform: `scale(${pull})` }}>
        <RecapScreen />
      </div>
    </AbsoluteFill>
  )
}

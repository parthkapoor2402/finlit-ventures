import { AbsoluteFill, useCurrentFrame } from "remotion"
import { CompareScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { COMPARE_REVEAL_FRAME } from "../data/timeline.ts"
import { PAPER } from "../styles/tokens.ts"

export function Scene05Comparison() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={enterStyle(frame, 8)}>
        <CompareScreen revealMath={frame >= COMPARE_REVEAL_FRAME} />
      </div>
    </AbsoluteFill>
  )
}

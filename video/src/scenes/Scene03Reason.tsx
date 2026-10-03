import { AbsoluteFill, useCurrentFrame } from "remotion"
import { ReasonScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene03Reason() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={enterStyle(frame, 4)}>
        <ReasonScreen selected={frame > 70} showNote={frame > 120} />
      </div>
    </AbsoluteFill>
  )
}

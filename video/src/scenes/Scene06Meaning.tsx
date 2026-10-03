import { AbsoluteFill, useCurrentFrame } from "remotion"
import { MeaningScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene06Meaning() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={enterStyle(frame, 6)}>
        <MeaningScreen />
      </div>
    </AbsoluteFill>
  )
}

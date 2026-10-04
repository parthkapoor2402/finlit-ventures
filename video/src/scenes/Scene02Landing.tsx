import { AbsoluteFill, useCurrentFrame } from "remotion"
import { LandingScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene02Landing() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={enterStyle(frame, 6)}>
        <LandingScreen pressed={frame > 140 && frame < 168} />
      </div>
    </AbsoluteFill>
  )
}

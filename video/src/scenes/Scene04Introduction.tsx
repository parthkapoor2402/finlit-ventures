import { AbsoluteFill, useCurrentFrame } from "remotion"
import { Landing } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene04Introduction() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "flex-start", paddingTop: 48 }}>
      <div style={enterStyle(frame, 8)}>
        <Landing selected={frame > 70} />
      </div>
    </AbsoluteFill>
  )
}

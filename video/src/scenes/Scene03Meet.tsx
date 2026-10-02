import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine, Landing, ReasonSelection } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene03Meet() {
  const frame = useCurrentFrame()
  const reasons = frame >= 72
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", paddingTop: 36 }}>
      <div style={enterStyle(frame, reasons ? 72 : 6)}>
        {reasons ? <ReasonSelection active="Market worry" /> : <Landing selected />}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 108, display: "flex", justifyContent: "center" }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

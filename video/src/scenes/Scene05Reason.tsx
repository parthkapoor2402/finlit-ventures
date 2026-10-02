import { AbsoluteFill, useCurrentFrame } from "remotion"
import { ReasonSelection } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene05Reason() {
  const frame = useCurrentFrame()
  const active = frame < 80 ? "Cash need" : "Market worry"
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 70, top: 48, width: 980, ...enterStyle(frame, 4) }}>
        <ReasonSelection active={active} />
      </div>
      <div style={{ position: "absolute", right: 80, top: 220, width: 640, ...enterStyle(frame, 30) }}>
        <p style={{ fontFamily: SERIF, fontSize: 48, lineHeight: 1.15, color: INK, margin: 0 }}>Your reason. Your decision.</p>
        <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.45, color: MUTED }}>
          Cash need stays a legitimate choice. The page does not rank the reasons, and it does not tell you which one to pick.
        </p>
      </div>
    </AbsoluteFill>
  )
}

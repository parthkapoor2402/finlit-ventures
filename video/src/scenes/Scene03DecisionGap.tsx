import { AbsoluteFill, useCurrentFrame } from "remotion"
import { InvestmentAppMock } from "../components/InvestmentAppMock.tsx"
import { PhoneFrame } from "../components/PhoneFrame.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene03DecisionGap() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 120, top: 80, ...enterStyle(frame, 6) }}>
        <PhoneFrame width={420}>
          <InvestmentAppMock paused />
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 980, top: 160, width: 780, ...enterStyle(frame, 24) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.5, color: MUTED, fontSize: 16, margin: 0 }}>BEFORE CONFIRM</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, lineHeight: 1.08, color: INK, margin: "12px 0" }}>
          Before you confirm, understand.
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: 22 }}>
            <p style={{ fontFamily: SERIF, fontSize: 28, margin: 0 }}>Make the change</p>
            <p style={{ color: MUTED, fontSize: 20, lineHeight: 1.4 }}>Your investing app can carry out the instruction.</p>
          </div>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: 22 }}>
            <p style={{ fontFamily: SERIF, fontSize: 28, margin: 0 }}>Understand the difference</p>
            <p style={{ color: MUTED, fontSize: 20, lineHeight: 1.4 }}>A separate check can show the contributions first.</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}

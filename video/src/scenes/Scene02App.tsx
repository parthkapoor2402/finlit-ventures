import { AbsoluteFill, useCurrentFrame } from "remotion"
import { InvestmentAppMock } from "../components/InvestmentAppMock.tsx"
import { PhoneFrame } from "../components/PhoneFrame.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene02App() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 120, top: 48, ...enterStyle(frame, 4) }}>
        <PhoneFrame width={400}>
          <InvestmentAppMock />
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 980, top: 180, width: 820, ...enterStyle(frame, 16) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.6, color: MUTED, fontSize: 16, margin: 0 }}>YOUR OWN APP</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, lineHeight: 1.08, color: INK, margin: "14px 0 0" }}>
          A change is on screen. It is not confirmed.
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 28, lineHeight: 1.4, color: INK, margin: "22px 0 0", maxWidth: 720 }}>
          Before you confirm, it helps to understand what the change means for the contributions you planned.
        </p>
      </div>
    </AbsoluteFill>
  )
}

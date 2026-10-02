import { AbsoluteFill, useCurrentFrame } from "remotion"
import { InvestmentAppMock } from "../components/InvestmentAppMock.tsx"
import { PhoneFrame } from "../components/PhoneFrame.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene01Opening() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 120, top: 70, ...enterStyle(frame, 6) }}>
        <PhoneFrame width={420} height={620}>
          <InvestmentAppMock />
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 640, top: 210, width: 1120, ...enterStyle(frame, 8) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.6, color: MUTED, fontSize: 16, margin: 0 }}>BEFORE YOU CONFIRM</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 68, lineHeight: 1.05, color: INK, margin: "16px 0 0" }}>
          A new monthly amount.
        </h1>
        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 52, lineHeight: 1.1, color: INK, margin: "18px 0 0" }}>
          Not the plan you already made.
        </h2>
      </div>
    </AbsoluteFill>
  )
}

import { AbsoluteFill, useCurrentFrame } from "remotion"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene10EndCard() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", ...enterStyle(frame, 6) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.8, color: MUTED, fontSize: 18, margin: 0 }}>FINLIT VENTURES</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 92, color: INK, margin: "10px 0 0" }}>Skip Check</h1>
        <p style={{ fontFamily: SERIF, fontSize: 40, margin: "16px 0 0" }}>See the difference. Make your decision.</p>
        <p style={{ fontFamily: SANS, fontSize: 22, color: MUTED, marginTop: 28 }}>Decision support. Not investment advice.</p>
        <p style={{ fontFamily: SANS, fontSize: 18, color: MUTED, marginTop: 8 }}>
          FinLit states that it is not registered with SEBI or AMFI.
        </p>
      </div>
    </AbsoluteFill>
  )
}

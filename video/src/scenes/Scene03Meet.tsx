import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene03Meet() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1100,
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 16,
          padding: "48px 56px",
          ...enterStyle(frame, 4),
        }}
      >
        <p style={{ fontFamily: SANS, margin: 0, color: MUTED, letterSpacing: 1.4, fontSize: 16 }}>SKIP CHECK</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 64, lineHeight: 1.05, color: INK, margin: "14px 0 0" }}>
          Skip Check by FinLit Ventures
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 32, lineHeight: 1.35, margin: "22px 0 0", maxWidth: 860 }}>
          It does not change the SIP. You finish any action in your own app.
        </p>
      </div>
      <div style={{ position: "absolute", bottom: 80 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

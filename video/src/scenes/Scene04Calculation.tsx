import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine } from "../components/SkipCheckUI.tsx"
import { fadeIn } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CALC_REVEAL_FRAME } from "../data/timeline.ts"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

const ROWS = [
  ["Current monthly SIP", WALKTHROUGH.current],
  ["Proposed monthly amount", WALKTHROUGH.proposed],
  ["Months", String(WALKTHROUGH.months)],
]

export function Scene04Calculation() {
  const frame = useCurrentFrame()
  const revealed = fadeIn(frame, CALC_REVEAL_FRAME, 12)
  const formula = `(${WALKTHROUGH.current} − ${WALKTHROUGH.proposed}) × ${WALKTHROUGH.months}`

  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1480,
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 16,
          padding: "42px 64px 36px",
          marginBottom: 48,
        }}
      >
        <p style={{ fontFamily: SANS, letterSpacing: 1.4, color: MUTED, fontSize: 16, margin: 0 }}>THE COMPARISON</p>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 48, marginTop: 18, alignItems: "center" }}>
          <div>
            {ROWS.map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `1px solid ${LINE}`, padding: "14px 0" }}>
                <span style={{ fontFamily: SANS, fontSize: 26, color: MUTED }}>{label}</span>
                <span style={{ fontFamily: SERIF, fontSize: 44, color: INK }}>{value}</span>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: SANS, fontSize: 28, color: INK, margin: 0 }}>{formula} =</p>
            <div style={{ position: "relative", height: 120, marginTop: 8 }}>
              <p style={{ position: "absolute", inset: 0, margin: 0, fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: MUTED, opacity: 1 - revealed }}>
                —
              </p>
              <p style={{ position: "absolute", inset: 0, margin: 0, fontFamily: SERIF, fontSize: 92, lineHeight: 1, color: INK, opacity: revealed }}>
                {WALKTHROUGH.difference}
              </p>
            </div>
            <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.35, color: INK, margin: "8px 0 0", maxWidth: 560 }}>
              Contributions that would not be invested
            </p>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 108 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

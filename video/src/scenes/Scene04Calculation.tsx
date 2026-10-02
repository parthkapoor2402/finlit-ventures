import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine } from "../components/SkipCheckUI.tsx"
import { fadeIn } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CALC_REVEAL_FRAME } from "../data/timeline.ts"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

const ROWS = [
  ["Current", WALKTHROUGH.current],
  ["Proposed", WALKTHROUGH.proposed],
  ["Months", `${WALKTHROUGH.months} months`],
]

export function Scene04Calculation() {
  const frame = useCurrentFrame()
  const revealed = fadeIn(frame, CALC_REVEAL_FRAME, 12)
  const formula = `(${WALKTHROUGH.current} − ${WALKTHROUGH.proposed}) × ${WALKTHROUGH.months}`

  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1500,
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 16,
          padding: "40px 56px 36px",
          marginBottom: 36,
        }}
      >
        <p style={{ fontFamily: SANS, letterSpacing: 1.4, color: MUTED, fontSize: 16, margin: 0 }}>THE GAP</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginTop: 22 }}>
          {ROWS.map(([label, value]) => (
            <div key={label} style={{ borderBottom: `1px solid ${LINE}`, paddingBottom: 12 }}>
              <div style={{ fontFamily: SANS, fontSize: 20, color: MUTED }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 48, color: INK, marginTop: 4 }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 28, minHeight: 96 }}>
          <p style={{ fontFamily: SANS, fontSize: 34, color: INK, margin: 0 }}>{formula} =</p>
          <div style={{ position: "relative", width: 480, height: 96 }}>
            <p
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                margin: 0,
                fontFamily: SERIF,
                fontSize: 80,
                lineHeight: "96px",
                color: MUTED,
                opacity: 1 - revealed,
              }}
            >
              —
            </p>
            <p
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                margin: 0,
                fontFamily: SERIF,
                fontSize: 80,
                lineHeight: "96px",
                color: INK,
                opacity: revealed,
              }}
            >
              {WALKTHROUGH.difference}
            </p>
          </div>
        </div>
        <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.35, color: INK, margin: "8px 0 0" }}>
          Contributions that would not be invested. The multiplication is the gap, not the decision.
        </p>
      </div>
      <div style={{ position: "absolute", bottom: 108 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

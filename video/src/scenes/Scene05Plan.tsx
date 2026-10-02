import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene05Plan() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 1500, ...enterStyle(frame, 4) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.4, color: MUTED, fontSize: 16, margin: 0 }}>
          MONTHS OF PLANNED CONTRIBUTIONS
        </p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 72, lineHeight: 1.05, color: INK, margin: "12px 0 0" }}>
          {WALKTHROUGH.plannedMonths}
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 28, lineHeight: 1.4, margin: "18px 0 0", maxWidth: 1100 }}>
          The contribution gap of {WALKTHROUGH.difference} adds this, at {WALKTHROUGH.proposed} a month. Not wealth, not a return, and not units.
        </p>
        <div
          style={{
            marginTop: 28,
            background: CARD,
            border: `1px solid ${LINE}`,
            padding: "22px 26px",
            ...enterStyle(frame, 10),
          }}
        >
          <p style={{ fontFamily: SANS, color: MUTED, fontSize: 16, margin: 0, letterSpacing: 1.2 }}>
            REMAINING CONTRIBUTION TARGET
          </p>
          <p style={{ fontFamily: SERIF, fontSize: 48, margin: "8px 0 0", color: INK }}>{WALKTHROUGH.target}</p>
          <p style={{ fontFamily: SANS, fontSize: 24, lineHeight: 1.4, margin: "8px 0 0" }}>{WALKTHROUGH.targetLine}</p>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 72 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

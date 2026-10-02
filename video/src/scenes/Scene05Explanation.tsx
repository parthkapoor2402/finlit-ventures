import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

const LINES = [
  { at: 8, text: "A contribution difference. Not an investment loss." },
  { at: 48, text: "Not a prediction of future returns. Future units are not estimated." },
  { at: 150, text: "Existing units remain invested unless you separately redeem them." },
]

export function Scene05Explanation() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 100, top: 120, width: 760, ...enterStyle(frame, 4) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.4, color: MUTED, fontSize: 16, margin: 0 }}>STILL THE SAME FIGURE</p>
        <p style={{ fontFamily: SERIF, fontSize: 104, lineHeight: 1, color: INK, margin: "12px 0 0" }}>{WALKTHROUGH.difference}</p>
        <p style={{ fontFamily: SANS, fontSize: 28, lineHeight: 1.4, margin: "16px 0 0", maxWidth: 640 }}>
          Contributions that would not be invested if {WALKTHROUGH.current} became {WALKTHROUGH.proposed} for {WALKTHROUGH.months} months.
        </p>
      </div>
      <div style={{ position: "absolute", left: 960, top: 140, width: 840 }}>
        {LINES.map((line) => (
          <div
            key={line.text}
            style={{
              marginBottom: 16,
              background: CARD,
              border: `1px solid ${LINE}`,
              padding: "18px 20px",
              fontFamily: SANS,
              fontSize: 28,
              lineHeight: 1.35,
              color: INK,
              ...enterStyle(frame, line.at),
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 108, display: "flex", justifyContent: "center" }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

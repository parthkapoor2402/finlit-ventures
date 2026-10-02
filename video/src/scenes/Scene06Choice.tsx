import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine, ChoiceSelector } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene06Choice() {
  const frame = useCurrentFrame()
  const recap = frame >= 70
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", paddingTop: 56 }}>
      <div style={{ width: 1500, ...enterStyle(frame, 4) }}>
        <p style={{ fontFamily: SERIF, fontSize: 52, lineHeight: 1.1, color: INK, margin: 0 }}>Keep, reduce, or pause.</p>
        <p style={{ fontFamily: SANS, fontSize: 24, color: MUTED, margin: "8px 0 0" }}>
          Same size. Same weight. The choice stays yours.
        </p>
        <ChoiceSelector selected={null} />
        {recap ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 22, ...enterStyle(frame, 70) }}>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: "16px 18px" }}>
              <p style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 1.2, color: MUTED, margin: 0 }}>IF YOU REDUCE</p>
              <p style={{ fontFamily: SERIF, fontSize: 42, margin: "8px 0 0", color: INK }}>{WALKTHROUGH.difference}</p>
              <p style={{ fontFamily: SANS, fontSize: 20, lineHeight: 1.4, margin: "6px 0 0" }}>
                {WALKTHROUGH.current} to {WALKTHROUGH.proposed} for {WALKTHROUGH.months} months. Contributions that would not be invested.
              </p>
            </div>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: "16px 18px" }}>
              <p style={{ fontFamily: SANS, fontSize: 16, letterSpacing: 1.2, color: MUTED, margin: 0 }}>IF YOU PAUSE — SEPARATE FIGURE</p>
              <p style={{ fontFamily: SERIF, fontSize: 42, margin: "8px 0 0", color: INK }}>{WALKTHROUGH.pauseDifference}</p>
              <p style={{ fontFamily: SANS, fontSize: 20, lineHeight: 1.4, margin: "6px 0 0" }}>
                A pause of {WALKTHROUGH.current} for {WALKTHROUGH.months} months, shown separately from the reduction.
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", bottom: 108 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

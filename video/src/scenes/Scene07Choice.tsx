import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine, ChoiceSelector } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { CARD, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene07Choice() {
  const frame = useCurrentFrame()
  const notes = frame >= 80
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", paddingTop: 64 }}>
      <div style={{ width: 1500, ...enterStyle(frame, 4) }}>
        <p style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1.05, color: INK, margin: 0 }}>Keep, reduce, or pause.</p>
        <p style={{ fontFamily: SANS, fontSize: 24, color: MUTED, margin: "8px 0 0" }}>Same size. Same weight. The choice stays yours.</p>
        <ChoiceSelector selected={null} />
        {notes ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 22, ...enterStyle(frame, 80) }}>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: "16px 18px" }}>
              <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.4, margin: 0 }}>
                A cash need can make a pause legitimate.
              </p>
            </div>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: "16px 18px" }}>
              <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.4, margin: 0 }}>
                The figure is not a loss. Existing units stay invested.
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", bottom: 64 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

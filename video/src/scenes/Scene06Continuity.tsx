import { AbsoluteFill, useCurrentFrame } from "remotion"
import { AdviceLine } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, FOREST, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene06Continuity() {
  const frame = useCurrentFrame()
  const contrast = frame >= 190
  const restart = frame >= 340
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", paddingTop: 72 }}>
      <div style={{ width: 1500 }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.4, color: MUTED, fontSize: 16, margin: 0 }}>
          FULL PAUSE, SHOWN SEPARATELY
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 28, marginTop: 12, ...enterStyle(frame, 4) }}>
          <p style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1, margin: 0, color: INK }}>{WALKTHROUGH.pauseDifference}</p>
          <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.35, margin: 0, maxWidth: 720 }}>
            A full pause of {WALKTHROUGH.current} for {WALKTHROUGH.months} months. Labeled separately from the reduction of {WALKTHROUGH.difference}.
          </p>
        </div>
        {contrast ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 28, ...enterStyle(frame, 190) }}>
            <Panel title="A pause" body="The uninterrupted contribution stops. The chosen monthly amount is ₹0." />
            <Panel title="A reduction" body={`${WALKTHROUGH.proposed} would continue. The same rupee gap can still be a different decision.`} />
          </div>
        ) : null}
        {restart ? (
          <div
            style={{
              marginTop: 22,
              background: CARD,
              border: `2px solid ${FOREST}`,
              padding: "18px 22px",
              ...enterStyle(frame, 340),
            }}
          >
            <p style={{ fontFamily: SANS, letterSpacing: 1.2, color: MUTED, fontSize: 16, margin: 0 }}>RESTART MONTH ON THE DECISION CARD</p>
            <p style={{ fontFamily: SERIF, fontSize: 42, margin: "8px 0 0" }}>{WALKTHROUGH.restartMonth}</p>
            <p style={{ fontFamily: SANS, fontSize: 22, margin: "6px 0 0" }}>Skip Check will not restart the SIP.</p>
          </div>
        ) : null}
      </div>
      <div style={{ position: "absolute", bottom: 64 }}>
        <AdviceLine />
      </div>
    </AbsoluteFill>
  )
}

function Panel({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: "18px 20px", minHeight: 150 }}>
      <p style={{ fontFamily: SERIF, fontSize: 36, margin: 0 }}>{title}</p>
      <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.4, margin: "8px 0 0" }}>{body}</p>
    </div>
  )
}

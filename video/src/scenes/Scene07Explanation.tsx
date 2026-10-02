import { AbsoluteFill, useCurrentFrame } from "remotion"
import { ContributionImpactCard } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, INK, LINE, PAPER, SANS, SERIF } from "../styles/tokens.ts"

const LINES = [
  "Existing units stay invested.",
  "Future units are not estimated.",
  "Skip Check does not change your SIP.",
]

export function Scene07Explanation() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ position: "absolute", left: 70, top: 40, transform: "scale(0.72)", transformOrigin: "top left" }}>
        <ContributionImpactCard showNumber />
      </div>
      <div style={{ position: "absolute", left: 980, top: 150, width: 840 }}>
        <p style={{ fontFamily: SERIF, fontSize: 46, margin: 0, color: INK, ...enterStyle(frame, 8) }}>Clear numbers. Clear limits.</p>
        <p style={{ fontFamily: SANS, fontSize: 24, marginTop: 8 }}>{WALKTHROUGH.difference} is the contribution gap for the reduction. Nothing else.</p>
        {LINES.map((line, index) => (
          <div
            key={line}
            style={{
              marginTop: 16,
              background: CARD,
              border: `1px solid ${LINE}`,
              padding: "16px 18px",
              fontFamily: SANS,
              fontSize: 26,
              ...enterStyle(frame, 40 + index * 36),
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}

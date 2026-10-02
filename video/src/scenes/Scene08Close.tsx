import { AbsoluteFill, useCurrentFrame } from "remotion"
import { fadeIn } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, FOREST, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

const ROWS = [
  ["Reason", "Cash need"],
  ["Choice", "Reduce"],
  ["Current", WALKTHROUGH.current],
  ["Proposed", WALKTHROUGH.proposed],
  ["Months", `${WALKTHROUGH.months} months`],
  ["Contribution gap", WALKTHROUGH.difference],
  ["Plan", WALKTHROUGH.plannedMonths],
  ["Restart month", WALKTHROUGH.restartMonth],
  ["Full pause, separately", WALKTHROUGH.pauseDifference],
]

export function Scene08Close() {
  const frame = useCurrentFrame()
  const advice = fadeIn(frame, 70, 14)
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 1280,
          background: CARD,
          border: `1px solid ${LINE}`,
          borderRadius: 16,
          padding: "32px 40px 28px",
        }}
      >
        <p style={{ fontFamily: SERIF, fontSize: 28, margin: 0 }}>Skip Check decision card</p>
        <p style={{ fontFamily: SANS, color: MUTED, fontSize: 18, margin: "4px 0 0" }}>
          A record to take back. Not an order.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px 28px", marginTop: 18 }}>
          {ROWS.map(([label, value]) => (
            <div key={label}>
              <div style={{ fontFamily: SANS, color: MUTED, fontSize: 15 }}>{label}</div>
              <div style={{ fontFamily: SERIF, fontSize: 28, color: INK, marginTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: SANS, fontSize: 22, margin: "18px 0 0", color: FOREST, opacity: advice }}>
          Decision support. Not investment advice.
        </p>
      </div>
    </AbsoluteFill>
  )
}

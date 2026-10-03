import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { enterStyle } from "../components/Transitions.tsx"
import { CARD, FOREST, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene01Dilemma() {
  const frame = useCurrentFrame()
  const push = interpolate(frame, [0, 200], [1, 1.06], { extrapolateRight: "clamp" })
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 80, alignItems: "center", transform: `scale(${push})` }}>
        <div style={{ width: 520, ...enterStyle(frame, 8) }}>
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: 28, boxShadow: "0 18px 40px rgba(28,25,23,0.06)" }}>
            <p style={{ fontFamily: SANS, color: MUTED, margin: 0 }}>This month</p>
            {["Rent", "Groceries", "School fees"].map((item) => (
              <div key={item} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${LINE}`, padding: "14px 0", fontFamily: SANS, fontSize: 22 }}>
                <span>{item}</span>
                <span style={{ width: 72, height: 10, background: LINE, alignSelf: "center" }} />
              </div>
            ))}
            <div style={{ marginTop: 16, height: 8, width: 180, background: FOREST, borderRadius: 8 }} />
          </div>
        </div>
        <div style={{ width: 760, ...enterStyle(frame, 18) }}>
          <p style={{ fontFamily: SANS, letterSpacing: 1.6, color: MUTED, margin: 0 }}>BEFORE YOU DECIDE</p>
          <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 78, lineHeight: 1.02, margin: "12px 0 0", color: INK }}>Life changes.</h1>
          <p style={{ fontFamily: SERIF, fontSize: 36, lineHeight: 1.25, color: INK, ...enterStyle(frame, 48) }}>
            Expenses appear. Priorities shift. Sometimes you reconsider your monthly SIP.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  )
}

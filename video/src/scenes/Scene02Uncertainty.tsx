import { AbsoluteFill, useCurrentFrame } from "remotion"
import { PhoneFrame } from "../components/PhoneFrame.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { CARD, FOREST, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene02Uncertainty() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, fontFamily: SANS, color: INK }}>
      <div style={{ position: "absolute", left: 80, top: 70, ...enterStyle(frame, 8) }}>
        <PhoneFrame width={430}>
          <div style={{ padding: 28 }}>
            <p style={{ margin: 0, letterSpacing: 1.4, color: MUTED, fontSize: 14 }}>THIS MONTH</p>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 32, margin: "12px 0" }}>The market feels uneven</h2>
            <svg width="340" height="140" viewBox="0 0 340 140">
              <polyline
                fill="none"
                stroke={FOREST}
                strokeWidth="3"
                points="8,90 50,84 90,98 130,76 170,88 210,70 250,80 290,64 332,72"
              />
            </svg>
            <p style={{ color: MUTED, fontSize: 18, lineHeight: 1.4 }}>A quiet chart. Not a crisis. Enough to make someone pause.</p>
          </div>
        </PhoneFrame>
      </div>
      <div style={{ position: "absolute", left: 620, top: 120, width: 520, ...enterStyle(frame, 40) }}>
        <div style={{ background: CARD, border: `1px solid ${LINE}`, padding: "28px 28px 24px" }}>
          <p style={{ margin: 0, letterSpacing: 1.4, color: MUTED, fontSize: 14 }}>AT HOME</p>
          <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 36, margin: "12px 0" }}>A bill can come first</h2>
          <p style={{ fontSize: 22, lineHeight: 1.45, margin: 0 }}>
            Rent, a medical bill, or a salary that has not arrived. A cash need is a real reason to change a SIP.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, ...enterStyle(frame, 90) }}>
          {["Market worry", "Cash need", "Goals change"].map((label) => (
            <span key={label} style={{ border: `1px solid ${LINE}`, background: CARD, padding: "10px 14px", fontSize: 18 }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}

import { CARD, INK, LINE, MUTED, SANS, SERIF } from "../styles/tokens.ts"

/** A generic investing screen. No broker name. The change is not confirmed. */
export function InvestmentAppMock() {
  return (
    <div style={{ padding: "26px 22px", fontFamily: SANS, color: INK, height: "100%" }}>
      <p style={{ margin: 0, fontSize: 13, letterSpacing: 1.4, color: MUTED }}>INVESTMENTS</p>
      <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 30, margin: "14px 0 4px" }}>Monthly SIP</h2>
      <p style={{ margin: 0, color: MUTED, fontSize: 16, lineHeight: 1.35 }}>One instruction. Not your whole portfolio.</p>
      <div style={{ marginTop: 22, background: CARD, border: `1px solid ${LINE}`, padding: "14px 16px" }}>
        <p style={{ margin: 0, color: MUTED, fontSize: 15 }}>Current monthly amount</p>
        <p style={{ margin: "4px 0 0", fontFamily: SERIF, fontSize: 36 }}>₹12,000</p>
      </div>
      <div style={{ marginTop: 14, background: CARD, border: `1px solid ${LINE}`, padding: "14px 16px" }}>
        <p style={{ margin: 0, color: MUTED, fontSize: 15 }}>Proposed change</p>
        <p style={{ margin: "4px 0 0", fontFamily: SERIF, fontSize: 32 }}>Reduce to ₹6,000</p>
      </div>
      <div
        style={{
          marginTop: 22,
          height: 52,
          border: `1px solid ${LINE}`,
          color: MUTED,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Not confirmed
      </div>
    </div>
  )
}

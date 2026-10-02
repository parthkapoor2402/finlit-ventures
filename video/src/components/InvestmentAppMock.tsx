import { CARD, FOREST, INK, LINE, MUTED, SANS, SERIF } from "../styles/tokens.ts"

/** A generic investing screen. It is not a named broker and it does not complete a change. */
export function InvestmentAppMock({ paused = false }: { paused?: boolean }) {
  return (
    <div style={{ padding: "28px 26px", fontFamily: SANS, color: INK, height: "100%" }}>
      <p style={{ margin: 0, fontSize: 14, letterSpacing: 1.4, color: MUTED }}>INVESTMENTS</p>
      <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 34, margin: "18px 0 8px" }}>Monthly SIP</h2>
      <p style={{ margin: 0, color: MUTED, fontSize: 18, lineHeight: 1.4 }}>One instruction. Not your whole portfolio.</p>
      <div
        style={{
          marginTop: 28,
          background: CARD,
          border: `1px solid ${LINE}`,
          padding: "18px 18px 16px",
        }}
      >
        <p style={{ margin: 0, color: MUTED, fontSize: 16 }}>Current monthly amount</p>
        <p style={{ margin: "6px 0 0", fontFamily: SERIF, fontSize: 42 }}>₹12,000</p>
      </div>
      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        {["Keep as it is", "Reduce the amount", "Pause the instruction"].map((label) => (
          <div
            key={label}
            style={{
              border: `1px solid ${LINE}`,
              minHeight: 52,
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              fontSize: 18,
              background: CARD,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 26,
          height: 54,
          background: paused ? "transparent" : FOREST,
          color: paused ? MUTED : "#f6f1e8",
          border: paused ? `1px solid ${LINE}` : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        {paused ? "Not confirmed" : "Review change"}
      </div>
    </div>
  )
}

import type { ReactNode } from "react"
import { WALKTHROUGH } from "../data/calculation.ts"
import { AMBER, CARD, FOREST, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function AdviceLine() {
  return (
    <p style={{ fontFamily: SANS, fontSize: 18, color: MUTED, margin: 0 }}>Decision support. Not investment advice.</p>
  )
}

export function ProductCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 980,
        minHeight: 640,
        background: CARD,
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        padding: "36px 52px 40px",
        boxShadow: "0 18px 50px rgba(28,25,23,0.05)",
        fontFamily: SANS,
        color: INK,
      }}
    >
      <p style={{ margin: 0, fontFamily: SERIF, fontSize: 22 }}>Skip Check</p>
      <p style={{ margin: "2px 0 0", color: MUTED, fontSize: 16 }}>by FinLit Ventures</p>
      {children}
    </div>
  )
}

export function Landing({ selected = false }: { selected?: boolean }) {
  return (
    <ProductCard>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 48, lineHeight: 1.15, margin: "28px 0 0" }}>
        Before you change your SIP, see the contribution difference.
      </h1>
      <p style={{ fontSize: 24, lineHeight: 1.45, maxWidth: 760 }}>
        A separate check for one SIP. It does not change the instruction. You finish any action in your own app.
      </p>
      <div style={{ display: "grid", gap: 14, marginTop: 28 }}>
        <Door
          title="I'm about to change a SIP"
          body="In my own app, and I have not confirmed it. This is a decision session."
          active={selected}
        />
        <Door title="I'm only reading" body="A sample. It is not a decision session." active={false} />
      </div>
    </ProductCard>
  )
}

function Door({ title, body, active }: { title: string; body: string; active: boolean }) {
  return (
    <div
      style={{
        border: `2px solid ${active ? FOREST : LINE}`,
        background: PAPER,
        padding: "16px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div style={{ fontFamily: SERIF, fontSize: 28 }}>{title}</div>
        <div style={{ color: MUTED, fontSize: 18, marginTop: 4 }}>{body}</div>
      </div>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 18,
          border: `2px solid ${active ? FOREST : LINE}`,
          background: active ? FOREST : "transparent",
        }}
      />
    </div>
  )
}

const REASONS = ["Cash need", "Market worry", "Goal reached or near", "Fund no longer fits", "I'm not sure"]

export function ReasonSelection({ active = "Market worry" }: { active?: string }) {
  return (
    <ProductCard>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 46, margin: "26px 0 8px" }}>
        What's making you consider this change?
      </h1>
      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        {REASONS.map((reason) => (
          <div
            key={reason}
            style={{
              border: `2px solid ${reason === active ? FOREST : LINE}`,
              minHeight: 58,
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              fontSize: 24,
              background: PAPER,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 16,
                border: `2px solid ${reason === active ? FOREST : LINE}`,
                marginRight: 14,
                background: reason === active ? FOREST : "transparent",
              }}
            />
            {reason}
          </div>
        ))}
      </div>
    </ProductCard>
  )
}

export function SipInputForm() {
  return (
    <ProductCard>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 44, margin: "24px 0 6px" }}>Amounts for this SIP</h1>
      <Field label="Current monthly SIP" value={WALKTHROUGH.current} />
      <Field label="Monthly amount you are considering" value={WALKTHROUGH.proposed} />
      <Field label="Months to compare" value={`${WALKTHROUGH.months} months`} />
    </ProductCard>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize: 18, color: MUTED }}>{label}</div>
      <div
        style={{
          marginTop: 6,
          border: `2px solid ${LINE}`,
          background: PAPER,
          fontFamily: SERIF,
          fontSize: 34,
          padding: "8px 14px",
        }}
      >
        {value}
      </div>
    </div>
  )
}

export function ContributionImpactCard({ showNumber }: { showNumber: boolean }) {
  return (
    <ProductCard>
      <p style={{ margin: "22px 0 0", color: AMBER, fontSize: 16, letterSpacing: 1.2 }}>MARKET WORRY</p>
      <p
        style={{
          fontFamily: SERIF,
          fontSize: showNumber ? 108 : 64,
          margin: "12px 0 0",
          letterSpacing: -1,
          lineHeight: 1,
        }}
      >
        {showNumber ? WALKTHROUGH.difference : "—"}
      </p>
      <p style={{ fontSize: 26, lineHeight: 1.35, maxWidth: 760, marginTop: 18 }}>
        Contributions that would not be invested over this period under these inputs.
      </p>
      <p style={{ fontSize: 22, color: MUTED, marginTop: 14 }}>
        ({WALKTHROUGH.current} − {WALKTHROUGH.proposed}) × {WALKTHROUGH.months} = {WALKTHROUGH.difference}
      </p>
      <p style={{ fontSize: 22, marginTop: 10 }}>A contribution comparison. Not a loss or a return forecast.</p>
    </ProductCard>
  )
}

const CHOICES = [
  { title: "Keep", body: "The monthly amount stays the same. The difference for that choice is ₹0." },
  { title: "Reduce", body: "The monthly amount is above ₹0 and below the current SIP." },
  { title: "Pause", body: "The monthly amount for this comparison is ₹0." },
]

export function ChoiceSelector({ selected }: { selected: "Keep" | "Reduce" | "Pause" | null }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 28 }}>
      {CHOICES.map((choice) => {
        const on = selected === choice.title
        return (
          <div
            key={choice.title}
            style={{
              border: `2px solid ${on ? FOREST : LINE}`,
              background: PAPER,
              minHeight: 210,
              padding: "18px 16px",
            }}
          >
            <div style={{ fontFamily: SERIF, fontSize: 36 }}>{choice.title}</div>
            <p style={{ color: MUTED, fontSize: 18, lineHeight: 1.4 }}>{choice.body}</p>
          </div>
        )
      })}
    </div>
  )
}

export function ComprehensionCheck() {
  return (
    <ProductCard>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 42, margin: "22px 0 8px" }}>Restate the comparison</h1>
      <p style={{ color: MUTED, fontSize: 20 }}>A check that the figure was clear. Not a test of financial knowledge.</p>
      <Statement text="It is contributions that would not be invested under these inputs." />
      <Statement text="Existing units stay invested unless I redeem them in my own app." />
    </ProductCard>
  )
}

function Statement({ text }: { text: string }) {
  return (
    <div
      style={{
        marginTop: 16,
        border: `2px solid ${FOREST}`,
        padding: "14px 16px",
        fontSize: 24,
        lineHeight: 1.35,
        background: PAPER,
      }}
    >
      {text}
    </div>
  )
}

export function RecapScreen() {
  const rows = [
    ["Reason", "Market worry"],
    ["Choice", "Pause"],
    ["Current monthly SIP", WALKTHROUGH.current],
    ["Proposed monthly SIP", "₹0"],
    ["Comparison period", "6 months"],
    ["If you pause", WALKTHROUGH.pauseDifference],
    ["If you reduce to " + WALKTHROUGH.proposed, WALKTHROUGH.difference],
  ]
  return (
    <ProductCard>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 46, margin: "18px 0 8px" }}>Your recap</h1>
      <p style={{ fontSize: 22, marginTop: 0 }}>A record of what you entered. Not an order.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 28px", marginTop: 12 }}>
        {rows.map(([label, value]) => (
          <div key={label}>
            <div style={{ color: MUTED, fontSize: 16 }}>{label}</div>
            <div style={{ fontFamily: SERIF, fontSize: 30 }}>{value}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 22, lineHeight: 1.4, marginTop: 18 }}>
        Any change has to be finished in your own investing app. Skip Check will not restart the SIP.
      </p>
    </ProductCard>
  )
}

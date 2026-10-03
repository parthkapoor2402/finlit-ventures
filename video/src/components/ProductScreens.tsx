import type { CSSProperties, ReactNode } from "react"
import { WALKTHROUGH } from "../data/calculation.ts"
import { CARD, FOREST, INK, LINE, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Browser({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: 1240,
        minHeight: 680,
        background: PAPER,
        border: `1px solid ${LINE}`,
        borderRadius: 18,
        boxShadow: "0 24px 60px rgba(28,25,23,0.08)",
        overflow: "visible",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 52,
          borderBottom: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 28px",
        }}
      >
        <span style={{ fontFamily: SERIF, fontSize: 22, color: INK }}>Skip Check</span>
        <span style={{ fontFamily: SANS, fontSize: 16, color: MUTED }}>by FinLit</span>
      </div>
      <div style={{ padding: "28px 48px 32px", flex: 1 }}>{children}</div>
    </div>
  )
}

export function Progress({ step }: { step: number }) {
  const labels = ["Your situation", "The numbers", "Optional clarity", "Your recap"]
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
      {labels.map((label, index) => (
        <div
          key={label}
          style={{
            border: `1px solid ${LINE}`,
            background: CARD,
            borderRadius: 14,
            padding: "8px 12px",
            fontFamily: SANS,
            fontSize: 16,
            color: INK,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: 22,
              height: 22,
              borderRadius: 22,
              border: `1px solid ${FOREST}`,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 8,
              fontSize: 13,
            }}
          >
            {index < step ? "✓" : index + 1}
          </span>
          {label}
        </div>
      ))}
    </div>
  )
}

function button(filled: boolean, pressed = false): CSSProperties {
  return {
    minHeight: 48,
    borderRadius: 999,
    padding: "0 22px",
    fontFamily: SANS,
    fontSize: 18,
    border: filled ? "none" : `1px solid ${FOREST}`,
    background: filled ? FOREST : "transparent",
    color: filled ? CARD : INK,
    transform: pressed ? "scale(0.98)" : "none",
    boxShadow: pressed ? `0 0 0 4px rgba(30,77,58,0.18)` : "none",
  }
}

export function LandingScreen({ pressed }: { pressed: boolean }) {
  return (
    <Browser>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 48, lineHeight: 1.12, margin: "8px 0 0", color: INK }}>
        Thinking about reducing or pausing your SIP?
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.45, maxWidth: 980, color: INK }}>
        That’s okay. Life, expenses, and priorities change. Let’s look at what a change could mean for your planned contributions—without pressure to choose any particular option.
      </p>
      <p style={{ fontFamily: SANS, fontSize: 18, color: MUTED }}>About 2 minutes · No changes are made to your SIP.</p>
      <p style={{ fontFamily: SANS, fontSize: 18, color: MUTED }}>You don’t need to justify your decision. This is a space to understand the numbers.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
        <div style={button(true, pressed)}>Explore my options</div>
        <div style={button(false)}>I’m just exploring</div>
      </div>
    </Browser>
  )
}

const REASONS = [
  "My expenses or priorities have changed.",
  "I’m unsure about market movements.",
  "My plans or timeline have changed.",
  "I want to understand my investment better.",
  "My income or expenses have changed.",
  "I’m still figuring things out.",
  "Something else.",
]

export function ReasonScreen({ selected, showNote }: { selected: boolean; showNote: boolean }) {
  return (
    <Browser>
      <Progress step={0} />
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 40, margin: "18px 0 6px" }}>What’s on your mind?</h1>
      <p style={{ fontFamily: SANS, fontSize: 18, color: MUTED, marginTop: 0 }}>
        Choose whatever feels closest. You can skip this if you’d rather not say.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {REASONS.slice(0, 6).map((reason) => {
          const on = selected && reason.startsWith("My income")
          return (
            <div
              key={reason}
              style={{
                border: `2px solid ${on ? FOREST : LINE}`,
                background: CARD,
                borderRadius: 14,
                padding: "10px 14px",
                fontFamily: SANS,
                fontSize: 17,
              }}
            >
              {reason}
            </div>
          )
        })}
      </div>
      <p style={{ fontFamily: SANS, fontSize: 16, color: MUTED, marginBottom: 4 }}>Optional note</p>
      <div style={{ border: `2px solid ${LINE}`, background: CARD, minHeight: 42, borderRadius: 8, padding: "8px 12px", fontFamily: SANS, fontSize: 18 }}>
        {showNote ? "Temporary change in monthly expenses." : ""}
      </div>
    </Browser>
  )
}

export function InputScreen({ current, proposed, months }: { current: string; proposed: string; months: string }) {
  return (
    <Browser>
      <Progress step={1} />
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 40, margin: "16px 0 8px" }}>The amounts for this comparison</h1>
      <Field label="Current monthly SIP" value={current} />
      <Field label="What monthly amount are you considering?" value={proposed} hint="Enter a smaller amount, or ₹0 if you are exploring a pause." />
      <p style={{ fontFamily: SANS, fontSize: 18 }}>☐ I haven’t decided on an amount yet.</p>
      <Field label="Duration in months" value={months} hint="From 1 to 24." />
    </Browser>
  )
}

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18 }}>{label}</div>
      {hint ? <div style={{ fontFamily: SANS, color: MUTED, fontSize: 15 }}>{hint}</div> : null}
      <div style={{ marginTop: 4, border: `2px solid ${LINE}`, background: CARD, minHeight: 42, borderRadius: 8, padding: "8px 12px", fontFamily: SANS, fontSize: 22 }}>
        {value}
        <span style={{ opacity: value ? 0 : 1 }}>|</span>
      </div>
    </div>
  )
}

export function CompareScreen({ revealMath }: { revealMath: boolean }) {
  return (
    <Browser>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 32, margin: "0 0 12px" }}>
        See how different choices change your planned contributions.
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <Card title="Keep" monthly={WALKTHROUGH.current} total={WALKTHROUGH.keepTotal} diff="₹0 difference from the current plan." />
        <Card title="Reduce" monthly={WALKTHROUGH.proposed} total={WALKTHROUGH.reduceTotal} diff={`${WALKTHROUGH.difference} less in planned contributions.`} />
        <Card title="Pause" monthly="₹0" total={WALKTHROUGH.pauseTotal} diff={`${WALKTHROUGH.pauseDifference} less in planned contributions.`} />
      </div>
      <p style={{ fontFamily: SERIF, fontSize: 26, margin: "14px 0 0", opacity: revealMath ? 1 : 0 }}>
        ({WALKTHROUGH.current} − {WALKTHROUGH.proposed}) × {WALKTHROUGH.months} = {WALKTHROUGH.difference}
      </p>
    </Browser>
  )
}

function Card({ title, monthly, total, diff }: { title: string; monthly: string; total: string; diff: string }) {
  return (
    <div style={{ border: `1px solid ${LINE}`, background: CARD, borderRadius: 16, padding: 14, minHeight: 168 }}>
      <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 28, margin: 0 }}>{title}</h2>
      <p style={{ fontFamily: SANS, fontSize: 16, margin: "8px 0 0" }}>Monthly: {monthly}</p>
      <p style={{ fontFamily: SANS, fontSize: 16, margin: "4px 0 0" }}>Planned over the period: {total}</p>
      <p style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, margin: "8px 0 0" }}>{diff}</p>
    </div>
  )
}

export function MeaningScreen() {
  return (
    <Browser>
      <p style={{ fontFamily: SERIF, fontSize: 36, lineHeight: 1.25, margin: "12px 0 0" }}>
        This is the difference in planned contributions under your inputs.
      </p>
      <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.4 }}>
        It is <span style={{ borderBottom: `3px solid ${FOREST}` }}>not an investment loss</span>, a return forecast, or a prediction of future portfolio value.
      </p>
      <div style={{ marginTop: 18, border: `1px solid ${LINE}`, background: CARD, borderRadius: 16, padding: 20 }}>
        <p style={{ fontFamily: SANS, fontSize: 24, margin: 0 }}>
          Existing units remain invested when future contributions are paused. Pausing does not redeem or sell them.
        </p>
      </div>
      <p style={{ fontFamily: SERIF, fontSize: 42, margin: "22px 0 0" }}>{WALKTHROUGH.difference}</p>
      <p style={{ fontFamily: SANS, color: MUTED, fontSize: 18 }}>less in planned contributions · {WALKTHROUGH.months} months</p>
    </Browser>
  )
}

export function BotScreen({ showReply }: { showReply: boolean }) {
  return (
    <Browser>
      <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 36, margin: "4px 0" }}>SIP Check Bot</h2>
      <p style={{ fontFamily: SANS, color: MUTED, fontSize: 18 }}>
        This assistant explains the numbers the app already calculated. It does not choose for you, and it does not change your SIP.
      </p>
      <div style={{ marginTop: 16, background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, padding: 16 }}>
        <p style={{ fontFamily: SANS, fontWeight: 600, margin: 0 }}>You</p>
        <p style={{ fontFamily: SANS, fontSize: 22, margin: "4px 0 0" }}>What happens to my existing units?</p>
      </div>
      <div style={{ marginTop: 12, background: PAPER, border: `1px solid ${LINE}`, borderRadius: 16, padding: 16, opacity: showReply ? 1 : 0 }}>
        <p style={{ fontFamily: SANS, fontWeight: 600, margin: 0 }}>SIP Check</p>
        <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.4 }}>
          Pausing future contributions does not itself redeem the units you already hold. Their value can still change with the market.
        </p>
        <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.4 }}>
          The <strong>{WALKTHROUGH.difference}</strong> figure compares planned contributions. It is not an investment loss.
        </p>
      </div>
    </Browser>
  )
}

export function RecapScreen() {
  return (
    <Browser>
      <Progress step={3} />
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 40, margin: "16px 0 8px" }}>Here’s what you explored.</h1>
      <p style={{ fontFamily: SANS, fontSize: 20 }}>My income or expenses have changed.</p>
      <p style={{ fontFamily: SANS, fontSize: 20, margin: "4px 0" }}>Current monthly SIP: {WALKTHROUGH.current}</p>
      <p style={{ fontFamily: SANS, fontSize: 20, margin: "4px 0" }}>Proposed monthly contribution: {WALKTHROUGH.proposed}</p>
      <p style={{ fontFamily: SANS, fontSize: 20, margin: "4px 0" }}>Duration: {WALKTHROUGH.months} months</p>
      <p style={{ fontFamily: SANS, fontSize: 22, fontWeight: 600 }}>Contribution difference: {WALKTHROUGH.difference}</p>
      <p style={{ fontFamily: SANS, fontSize: 20 }}>Skip Check has not changed your SIP.</p>
      <div style={{ ...button(true), display: "inline-flex", alignItems: "center", marginTop: 8 }}>Connect with FinLit Ventures</div>
    </Browser>
  )
}

export function BrandClose() {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: SANS, letterSpacing: 1.4, color: MUTED, fontSize: 18, margin: 0 }}>FINLIT VENTURES</p>
      <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 92, margin: "12px 0 0", color: INK }}>Skip Check</h1>
      <p style={{ fontFamily: SERIF, fontSize: 40, color: FOREST, margin: "12px 0 0" }}>See the difference. Make your decision.</p>
    </div>
  )
}

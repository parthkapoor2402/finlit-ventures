import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion"
import { InvestmentAppMock } from "../components/InvestmentAppMock.tsx"
import { PhoneFrame } from "../components/PhoneFrame.tsx"
import { fadeIn } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene07Close() {
  const frame = useCurrentFrame()
  const card = fadeIn(frame, 46, 14)
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <div style={{ opacity: 1 - card }}>
        <div style={{ position: "absolute", left: 150, top: 64 }}>
          <PhoneFrame width={360}>
            <InvestmentAppMock />
          </PhoneFrame>
        </div>
        <Img
          src={staticFile("assets/opening.jpg")}
          style={{ position: "absolute", right: 90, top: 150, width: 820, height: 520, objectFit: "cover", borderRadius: 8 }}
        />
        <h1
          style={{
            position: "absolute",
            left: 150,
            top: 760,
            width: 700,
            fontFamily: SERIF,
            fontWeight: 500,
            fontSize: 42,
            color: INK,
            margin: 0,
          }}
        >
          Back in your own app. Still not confirmed.
        </h1>
      </div>
      <AbsoluteFill style={{ opacity: card, alignItems: "center", justifyContent: "center", background: PAPER }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 72, color: INK, margin: 0 }}>Skip Check by FinLit Ventures</h1>
          <p style={{ fontFamily: SERIF, fontSize: 40, margin: "22px 0 0", color: INK }}>See the difference. Make your decision.</p>
          <p style={{ fontFamily: SANS, fontSize: 24, color: MUTED, marginTop: 28 }}>Decision support. Not investment advice.</p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene01Opening() {
  const frame = useCurrentFrame()
  const copy = enterStyle(frame, 18)
  const second = enterStyle(frame, 200)

  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Img
        src={staticFile("assets/opening.jpg")}
        style={{
          position: "absolute",
          left: 72,
          top: 118,
          width: 1040,
          height: 585,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
      <div style={{ position: "absolute", left: 1160, top: 180, width: 680, ...copy }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.6, color: MUTED, fontSize: 16, margin: 0 }}>EARLY EVENING</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 62, lineHeight: 1.08, color: INK, margin: "14px 0 0" }}>
          Life changes. Plans change.
        </h1>
      </div>
      <p
        style={{
          position: "absolute",
          left: 1160,
          top: 430,
          width: 620,
          fontFamily: SANS,
          fontSize: 28,
          lineHeight: 1.4,
          color: INK,
          margin: 0,
          ...second,
        }}
      >
        A monthly SIP is a small decision, made again and again, until a month asks for a different one.
      </p>
    </AbsoluteFill>
  )
}

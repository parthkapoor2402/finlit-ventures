import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

const NOTES = ["An unexpected expense", "An uncertain market", "A change in priorities"]

export function Scene01Opening() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Img
        src={staticFile("assets/opening.jpg")}
        style={{
          position: "absolute",
          left: 72,
          top: 96,
          width: 980,
          height: 760,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />
      <div style={{ position: "absolute", left: 1110, top: 168, width: 720, ...enterStyle(frame, 10) }}>
        <p style={{ fontFamily: SANS, letterSpacing: 1.6, color: MUTED, fontSize: 16, margin: 0 }}>AT HOME, AFTER WORK</p>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 58, lineHeight: 1.08, color: INK, margin: "16px 0 0" }}>
          Life doesn't always go according to plan.
        </h1>
      </div>
      <div style={{ position: "absolute", left: 1110, top: 470, width: 680 }}>
        {NOTES.map((note, index) => (
          <p
            key={note}
            style={{
              fontFamily: SANS,
              fontSize: 28,
              lineHeight: 1.35,
              color: INK,
              margin: "0 0 12px",
              ...enterStyle(frame, 78 + index * 10),
            }}
          >
            {note}
          </p>
        ))}
        <p style={{ fontFamily: SANS, fontSize: 22, color: MUTED, margin: "18px 0 0", ...enterStyle(frame, 112) }}>
          Enough to make you rethink a monthly SIP.
        </p>
      </div>
    </AbsoluteFill>
  )
}

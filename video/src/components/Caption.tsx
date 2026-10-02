import { useCurrentFrame, useVideoConfig } from "remotion"
import { CAPTIONS } from "../data/captions.ts"
import { INK, SANS } from "../styles/tokens.ts"

export function Caption() {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const time = frame / fps
  const cue = CAPTIONS.find((item) => time >= item.start && time < item.end)
  if (!cue) return null

  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        right: 140,
        bottom: 28,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          maxWidth: 1500,
          background: "rgba(255,253,248,0.94)",
          color: INK,
          fontFamily: SANS,
          fontSize: 30,
          lineHeight: 1.35,
          textAlign: "center",
          padding: "12px 22px",
          borderRadius: 6,
        }}
      >
        {cue.text}
      </p>
    </div>
  )
}

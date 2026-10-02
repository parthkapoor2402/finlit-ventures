import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion"
import { RecapScreen } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { INK, PAPER, SERIF } from "../styles/tokens.ts"

export function Scene09Handoff() {
  const frame = useCurrentFrame()
  const backHome = frame > 90
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      {backHome ? (
        <>
          <Img
            src={staticFile("assets/opening.jpg")}
            style={{ position: "absolute", right: 80, top: 120, width: 760, height: 428, objectFit: "cover", borderRadius: 8 }}
          />
          <h1 style={{ position: "absolute", left: 90, top: 240, width: 820, fontFamily: SERIF, fontWeight: 500, fontSize: 68, color: INK, margin: 0, ...enterStyle(frame, 96) }}>
            You stay in control.
          </h1>
        </>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 40, ...enterStyle(frame, 4) }}>
          <div style={{ transform: "scale(0.92)", transformOrigin: "top center" }}>
            <RecapScreen />
          </div>
        </div>
      )}
    </AbsoluteFill>
  )
}

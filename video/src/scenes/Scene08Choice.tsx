import { AbsoluteFill, useCurrentFrame } from "remotion"
import { ChoiceSelector, ComprehensionCheck } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WALKTHROUGH } from "../data/calculation.ts"
import { INK, MUTED, PAPER, SANS, SERIF } from "../styles/tokens.ts"

export function Scene08Choice() {
  const frame = useCurrentFrame()
  const showCheck = frame > 190
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", paddingTop: 48 }}>
      {showCheck ? (
        <div style={enterStyle(frame, 230)}>
          <ComprehensionCheck />
        </div>
      ) : (
        <div style={{ width: 1200, ...enterStyle(frame, 6) }}>
          <p style={{ fontFamily: SERIF, fontSize: 52, margin: 0, color: INK }}>No pressure. No automatic changes.</p>
          <p style={{ fontFamily: SANS, fontSize: 24, color: MUTED, marginTop: 8 }}>Keep, reduce, and pause are the same size. None is preselected for you.</p>
          <ChoiceSelector selected={frame > 50 ? "Pause" : null} />
          <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.45, maxWidth: 980 }}>
            A pause of {WALKTHROUGH.current} for {WALKTHROUGH.months} months is {WALKTHROUGH.pauseDifference} in contributions that would not be invested. Skip Check will not restart the SIP. A restart month is only a note.
          </p>
        </div>
      )}
    </AbsoluteFill>
  )
}

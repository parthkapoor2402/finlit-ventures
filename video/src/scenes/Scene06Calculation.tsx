import { AbsoluteFill, useCurrentFrame } from "remotion"
import { ContributionImpactCard, SipInputForm } from "../components/SkipCheckUI.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene06Calculation() {
  const frame = useCurrentFrame()
  const showResult = frame > 150
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "flex-start", paddingTop: 36 }}>
      <div style={enterStyle(frame, 6)}>{showResult ? <ContributionImpactCard showNumber /> : <SipInputForm />}</div>
    </AbsoluteFill>
  )
}

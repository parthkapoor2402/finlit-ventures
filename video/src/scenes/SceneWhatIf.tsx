import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion"
import { WhatIfScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { WHATIF_AMOUNT_END, WHATIF_AMOUNT_START, WHATIF_MONTHS_END, WHATIF_MONTHS_START } from "../data/timeline.ts"
import { PAPER } from "../styles/tokens.ts"

const ease = Easing.inOut(Easing.cubic)

export function SceneWhatIf() {
  const frame = useCurrentFrame()
  const proposed = interpolate(frame, [WHATIF_AMOUNT_START, WHATIF_AMOUNT_END], [2300, 1000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  })
  const months = interpolate(frame, [WHATIF_MONTHS_START, WHATIF_MONTHS_END], [12, 6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  })
  const entered = enterStyle(frame, 4)
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...entered, marginTop: -36 }}>
        <WhatIfScreen proposedAmount={proposed} monthCount={months} />
      </div>
    </AbsoluteFill>
  )
}

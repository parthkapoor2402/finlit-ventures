import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion"
import { InputScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene04Numbers() {
  const frame = useCurrentFrame()
  const current = frame < 40 ? "" : "5000".slice(0, Math.min(4, Math.floor((frame - 40) / 6) + 1))
  const proposed = frame < 90 ? "" : "2300".slice(0, Math.min(4, Math.floor((frame - 90) / 6) + 1))
  const months = frame < 150 ? "" : "12".slice(0, Math.min(2, Math.floor((frame - 150) / 8) + 1))
  const focus = interpolate(frame, [70, 100], [1, 1.02], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...enterStyle(frame, 4), transform: `scale(${focus})` }}>
        <InputScreen current={current} proposed={proposed} months={months} />
      </div>
    </AbsoluteFill>
  )
}

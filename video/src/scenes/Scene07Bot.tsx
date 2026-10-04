import { AbsoluteFill, useCurrentFrame } from "remotion"
import { BotScreen } from "../components/ProductScreens.tsx"
import { enterStyle } from "../components/Transitions.tsx"
import { PAPER } from "../styles/tokens.ts"

export function Scene07Bot() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: PAPER, alignItems: "center", justifyContent: "center" }}>
      <div style={enterStyle(frame, 6)}>
        <BotScreen showReply={frame > 70} />
      </div>
    </AbsoluteFill>
  )
}

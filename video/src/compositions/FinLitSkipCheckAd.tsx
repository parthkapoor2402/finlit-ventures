import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion"
import { Caption } from "../components/Caption.tsx"
import { SCENES } from "../data/timeline.ts"
import { Scene01Opening } from "../scenes/Scene01Opening.tsx"
import { Scene02Uncertainty } from "../scenes/Scene02Uncertainty.tsx"
import { Scene03DecisionGap } from "../scenes/Scene03DecisionGap.tsx"
import { Scene04Introduction } from "../scenes/Scene04Introduction.tsx"
import { Scene05Reason } from "../scenes/Scene05Reason.tsx"
import { Scene06Calculation } from "../scenes/Scene06Calculation.tsx"
import { Scene07Explanation } from "../scenes/Scene07Explanation.tsx"
import { Scene08Choice } from "../scenes/Scene08Choice.tsx"
import { Scene09Handoff } from "../scenes/Scene09Handoff.tsx"
import { Scene10EndCard } from "../scenes/Scene10EndCard.tsx"
import { PAPER } from "../styles/tokens.ts"

const SCENE_VIEW = {
  opening: Scene01Opening,
  uncertainty: Scene02Uncertainty,
  gap: Scene03DecisionGap,
  intro: Scene04Introduction,
  reason: Scene05Reason,
  calculation: Scene06Calculation,
  explanation: Scene07Explanation,
  choice: Scene08Choice,
  handoff: Scene09Handoff,
  end: Scene10EndCard,
} as const

export function FinLitSkipCheckAd() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Audio src={staticFile("audio/voiceover.mp3")} />
      <Audio src={staticFile("audio/music.mp3")} volume={0.09} />
      {SCENES.map((scene) => {
        const View = SCENE_VIEW[scene.id]
        return (
          <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
            <View />
          </Sequence>
        )
      })}
      <Caption />
    </AbsoluteFill>
  )
}

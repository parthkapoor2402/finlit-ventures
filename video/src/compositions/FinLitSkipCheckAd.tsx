import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion"
import { Caption } from "../components/Caption.tsx"
import { SCENES } from "../data/timeline.ts"
import { Scene01Dilemma } from "../scenes/Scene01Dilemma.tsx"
import { Scene02Landing } from "../scenes/Scene02Landing.tsx"
import { Scene03Reason } from "../scenes/Scene03Reason.tsx"
import { Scene04Numbers } from "../scenes/Scene04Numbers.tsx"
import { Scene05Comparison } from "../scenes/Scene05Comparison.tsx"
import { Scene06Meaning } from "../scenes/Scene06Meaning.tsx"
import { Scene07Bot } from "../scenes/Scene07Bot.tsx"
import { Scene08Control } from "../scenes/Scene08Control.tsx"
import { Scene09Brand } from "../scenes/Scene09Brand.tsx"
import { PAPER } from "../styles/tokens.ts"

const SCENE_VIEW = {
  dilemma: Scene01Dilemma,
  landing: Scene02Landing,
  reason: Scene03Reason,
  numbers: Scene04Numbers,
  comparison: Scene05Comparison,
  meaning: Scene06Meaning,
  bot: Scene07Bot,
  control: Scene08Control,
  close: Scene09Brand,
} as const

export function FinLitSkipCheckAd() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Audio src={staticFile("audio/voiceover.mp3")} volume={1} />
      <Audio src={staticFile("audio/music.mp3")} volume={0.12} />
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

import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion"
import { Caption } from "../components/Caption.tsx"
import { SCENES } from "../data/timeline.ts"
import { Scene01Opening } from "../scenes/Scene01Opening.tsx"
import { Scene02App } from "../scenes/Scene02App.tsx"
import { Scene03Meet } from "../scenes/Scene03Meet.tsx"
import { Scene04Calculation } from "../scenes/Scene04Calculation.tsx"
import { Scene05Explanation } from "../scenes/Scene05Explanation.tsx"
import { Scene06Choice } from "../scenes/Scene06Choice.tsx"
import { Scene07Close } from "../scenes/Scene07Close.tsx"
import { PAPER } from "../styles/tokens.ts"

const SCENE_VIEW = {
  opening: Scene01Opening,
  app: Scene02App,
  meet: Scene03Meet,
  calculation: Scene04Calculation,
  explanation: Scene05Explanation,
  choice: Scene06Choice,
  close: Scene07Close,
} as const

export function FinLitSkipCheckAd() {
  return (
    <AbsoluteFill style={{ background: PAPER }}>
      <Audio src={staticFile("audio/voiceover.mp3")} volume={1} />
      <Audio src={staticFile("audio/music.mp3")} volume={0.22} />
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

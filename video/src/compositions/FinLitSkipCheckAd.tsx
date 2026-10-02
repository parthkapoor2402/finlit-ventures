import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion"
import { Caption } from "../components/Caption.tsx"
import { SCENES } from "../data/timeline.ts"
import { Scene01Opening } from "../scenes/Scene01Opening.tsx"
import { Scene03Meet } from "../scenes/Scene03Meet.tsx"
import { Scene04Calculation } from "../scenes/Scene04Calculation.tsx"
import { Scene05Plan } from "../scenes/Scene05Plan.tsx"
import { Scene06Continuity } from "../scenes/Scene06Continuity.tsx"
import { Scene07Choice } from "../scenes/Scene07Choice.tsx"
import { Scene08Close } from "../scenes/Scene08Close.tsx"
import { PAPER } from "../styles/tokens.ts"

const SCENE_VIEW = {
  opening: Scene01Opening,
  meet: Scene03Meet,
  calculation: Scene04Calculation,
  plan: Scene05Plan,
  continuity: Scene06Continuity,
  choice: Scene07Choice,
  close: Scene08Close,
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

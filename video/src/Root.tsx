import { Composition } from "remotion"
import { FinLitSkipCheckAd } from "./compositions/FinLitSkipCheckAd.tsx"
import { DURATION_IN_FRAMES, FPS } from "./data/timeline.ts"

export function RemotionRoot() {
  return (
    <Composition
      id="FinLitSkipCheckAd"
      component={FinLitSkipCheckAd}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  )
}

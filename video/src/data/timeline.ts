/** 70-second cut at 30 fps. 2100 frames. */
export const FPS = 30

export const DURATION_IN_FRAMES = 2100

/**
 * Local frame in the calculation scene when ₹36,000 fades in.
 * Global frame 955, as the narration says "thirty-six".
 */
export const CALC_REVEAL_FRAME = 205

/**
 * Scene 1 is 10 frames longer than the 8.000s mark, and scene 2 is 10 frames
 * shorter, so the cut lands after the word "SIP" (it ends at 8.188s).
 * Every other boundary matches the 70-second scene map. The sum is 2100.
 */
export const SCENES = [
  { id: "opening", from: 0, duration: 250 },
  { id: "app", from: 250, duration: 230 },
  { id: "meet", from: 480, duration: 270 },
  { id: "calculation", from: 750, duration: 450 },
  { id: "explanation", from: 1200, duration: 270 },
  { id: "choice", from: 1470, duration: 300 },
  { id: "close", from: 1770, duration: 330 },
] as const

export type SceneId = (typeof SCENES)[number]["id"]

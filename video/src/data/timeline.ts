/** Frame map aligned to the rendered voiceover, at 30 fps. */
export const FPS = 30

export const DURATION_IN_FRAMES = 3426

/** Local frame in the calculation scene when the ₹36,000 figure appears. */
export const CALC_REVEAL_FRAME = 205

export const SCENES = [
  { id: "opening", from: 0, duration: 261 },
  { id: "uncertainty", from: 261, duration: 432 },
  { id: "gap", from: 693, duration: 424 },
  { id: "intro", from: 1117, duration: 176 },
  { id: "reason", from: 1293, duration: 378 },
  { id: "calculation", from: 1671, duration: 385 },
  { id: "explanation", from: 2056, duration: 436 },
  { id: "choice", from: 2492, duration: 376 },
  { id: "handoff", from: 2868, duration: 191 },
  { id: "end", from: 3059, duration: 367 },
] as const

export type SceneId = (typeof SCENES)[number]["id"]

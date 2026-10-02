/** 70-second cut at 30 fps. 2100 frames. */
export const FPS = 30

export const DURATION_IN_FRAMES = 2100

/**
 * Local frame in the calculation scene when ₹36,000 fades in.
 * Global frame 461, as the narration says "thirty-six".
 */
export const CALC_REVEAL_FRAME = 119

/**
 * Cuts sit in the gaps between sentences. The sum is 2100.
 * Opening through the plan is the new decision. The rupee line is one scene, not the ending.
 */
export const SCENES = [
  { id: "opening", from: 0, duration: 196 },
  { id: "meet", from: 196, duration: 146 },
  { id: "calculation", from: 342, duration: 265 },
  { id: "plan", from: 607, duration: 291 },
  { id: "continuity", from: 898, duration: 542 },
  { id: "choice", from: 1440, duration: 278 },
  { id: "close", from: 1718, duration: 382 },
] as const

export type SceneId = (typeof SCENES)[number]["id"]

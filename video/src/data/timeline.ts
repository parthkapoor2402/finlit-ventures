/** 70-second product demo at 30 fps. Scene lengths follow the narration. */
export const FPS = 30

export const DURATION_IN_FRAMES = 2100

/** Local frame in the comparison scene when ₹32,400 is on screen with the spoken figure. */
export const COMPARE_REVEAL_FRAME = 269

export const SCENES = [
  { id: "dilemma", from: 0, duration: 202 },
  { id: "landing", from: 202, duration: 189 },
  { id: "reason", from: 391, duration: 234 },
  { id: "numbers", from: 625, duration: 206 },
  { id: "comparison", from: 831, duration: 364 },
  { id: "meaning", from: 1195, duration: 270 },
  { id: "bot", from: 1465, duration: 264 },
  { id: "control", from: 1729, duration: 213 },
  { id: "close", from: 1942, duration: 158 },
] as const

export type SceneId = (typeof SCENES)[number]["id"]

/** Product demo at 30 fps. The What if scene adds 12 seconds after the comparison. */
export const FPS = 30

export const DURATION_IN_FRAMES = 2460

/** Local frame in the comparison scene when ₹32,400 is on screen with the spoken figure. */
export const COMPARE_REVEAL_FRAME = 269

/** Local frames in the What if scene. The amount lands on ₹1,000, then months land on 6 as the result is spoken. */
export const WHATIF_AMOUNT_START = 65
export const WHATIF_AMOUNT_END = 117
export const WHATIF_MONTHS_START = 143
export const WHATIF_MONTHS_END = 253

export const SCENES = [
  { id: "dilemma", from: 0, duration: 202 },
  { id: "landing", from: 202, duration: 189 },
  { id: "reason", from: 391, duration: 234 },
  { id: "numbers", from: 625, duration: 206 },
  { id: "comparison", from: 831, duration: 364 },
  { id: "whatif", from: 1195, duration: 360 },
  { id: "meaning", from: 1555, duration: 270 },
  { id: "bot", from: 1825, duration: 264 },
  { id: "control", from: 2089, duration: 213 },
  { id: "close", from: 2302, duration: 158 },
] as const

export type SceneId = (typeof SCENES)[number]["id"]

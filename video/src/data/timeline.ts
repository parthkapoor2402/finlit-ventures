/** Frame map aligned to the rendered voiceover, at 30 fps. */
export const FPS = 30

export const DURATION_IN_FRAMES = 3690

export const SCENES = [
  { id: "opening", from: 0, duration: 388 },
  { id: "uncertainty", from: 388, duration: 382 },
  { id: "gap", from: 770, duration: 373 },
  { id: "intro", from: 1143, duration: 325 },
  { id: "reason", from: 1468, duration: 377 },
  { id: "calculation", from: 1845, duration: 478 },
  { id: "explanation", from: 2323, duration: 561 },
  { id: "choice", from: 2884, duration: 397 },
  { id: "handoff", from: 3281, duration: 167 },
  { id: "end", from: 3448, duration: 242 },
] as const

export type SceneId = (typeof SCENES)[number]["id"]

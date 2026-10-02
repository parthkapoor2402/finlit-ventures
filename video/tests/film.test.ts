import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { NARRATION } from "../src/data/script.ts"
import { DURATION_IN_FRAMES, FPS, SCENES } from "../src/data/timeline.ts"
import { WALKTHROUGH } from "../src/data/calculation.ts"
import { CAPTIONS } from "../src/data/captions.ts"

const summed = SCENES.reduce((total, scene) => total + scene.duration, 0)
assert.equal(summed, DURATION_IN_FRAMES)
assert.equal(SCENES[0]?.from, 0)
for (let index = 1; index < SCENES.length; index += 1) {
  const previous = SCENES[index - 1]
  const current = SCENES[index]
  if (!previous || !current) continue
  assert.equal(current.from, previous.from + previous.duration)
}

assert.equal(WALKTHROUGH.rawDifference, "36000")
assert.equal(WALKTHROUGH.difference, "₹36,000")
assert.equal(WALKTHROUGH.pauseDifference, "₹72,000")
assert.equal(WALKTHROUGH.current, "₹12,000")
assert.equal(WALKTHROUGH.proposed, "₹6,000")

const lowered = NARRATION.toLowerCase()
for (const phrase of ["you should", "ai-powered", "groww", "zerodha", "you will lose", "guaranteed return"]) {
  assert.equal(lowered.includes(phrase), false, phrase)
}

assert.ok(CAPTIONS.length >= 20)
assert.ok(CAPTIONS[CAPTIONS.length - 1]!.end > 100)
const seconds = DURATION_IN_FRAMES / FPS
assert.ok(seconds > 108 && seconds < 125, `duration ${seconds}`)

const vtt = readFileSync(new URL("../public/audio/voiceover.vtt", import.meta.url), "utf8")
assert.ok(vtt.includes("thirty-six thousand"))
assert.ok(vtt.includes("The options remain yours"))

console.log(`film checks passed (${seconds.toFixed(1)}s, ${CAPTIONS.length} captions)`)

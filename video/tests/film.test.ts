import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { CAPTIONS } from "../src/data/captions.ts"
import { WALKTHROUGH } from "../src/data/calculation.ts"
import { NARRATION } from "../src/data/script.ts"
import { CALC_REVEAL_FRAME, DURATION_IN_FRAMES, FPS, SCENES } from "../src/data/timeline.ts"

const summed = SCENES.reduce((total, scene) => total + scene.duration, 0)
assert.equal(summed, DURATION_IN_FRAMES)
assert.equal(DURATION_IN_FRAMES, 2100)
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
assert.equal(WALKTHROUGH.months, "6")

const lowered = NARRATION.toLowerCase()
for (const phrase of ["you should", "ai-powered", "groww", "zerodha", "you will lose", "guaranteed return"]) {
  assert.equal(lowered.includes(phrase), false, phrase)
}
for (const phrase of ["thirty-six thousand", "keep, reduce, or pause", "see the difference"]) {
  assert.equal(lowered.includes(phrase), true, phrase)
}

assert.ok(CAPTIONS.length >= 16)
const last = CAPTIONS[CAPTIONS.length - 1]
assert.ok(last)
assert.ok(last.endFrame > 60 * FPS && last.endFrame < 68 * FPS)

const calculation = SCENES.find((scene) => scene.id === "calculation")
assert.ok(calculation)
const reveal = calculation.from + CALC_REVEAL_FRAME
const revealCue = CAPTIONS.find((cue) => cue.text.toLowerCase().includes("thirty-six thousand"))
assert.ok(revealCue)
assert.ok(reveal >= revealCue.startFrame && reveal < revealCue.endFrame)

const seconds = DURATION_IN_FRAMES / FPS
assert.ok(seconds >= 69.9 && seconds <= 70.1, `duration ${seconds}`)

const vtt = readFileSync(new URL("../public/audio/voiceover.vtt", import.meta.url), "utf8")
const srt = readFileSync(new URL("../public/subtitles/finlit-skip-check-brand-film.srt", import.meta.url), "utf8")
for (const phrase of ["thirty-six thousand", "Keep, reduce, or pause", "See the difference"]) {
  assert.ok(vtt.includes(phrase), phrase)
  assert.ok(srt.includes(phrase), phrase)
}

console.log(`film checks passed (${seconds.toFixed(1)}s, ${CAPTIONS.length} captions)`)

import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { CAPTIONS } from "../src/data/captions.ts"
import { WHAT_IF, WALKTHROUGH, figuresFor } from "../src/data/calculation.ts"
import { NARRATION } from "../src/data/script.ts"
import { COMPARE_REVEAL_FRAME, DURATION_IN_FRAMES, FPS, SCENES, WHATIF_MONTHS_END } from "../src/data/timeline.ts"

const summed = SCENES.reduce((total, scene) => total + scene.duration, 0)
assert.equal(summed, DURATION_IN_FRAMES)
assert.equal(DURATION_IN_FRAMES, 2460)
assert.equal(SCENES[0]?.from, 0)
for (let index = 1; index < SCENES.length; index += 1) {
  const previous = SCENES[index - 1]
  const current = SCENES[index]
  if (!previous || !current) continue
  assert.equal(current.from, previous.from + previous.duration)
}

assert.equal(WALKTHROUGH.rawDifference, "32400")
assert.equal(WALKTHROUGH.difference, "₹32,400")
assert.equal(WALKTHROUGH.pauseDifference, "₹60,000")
assert.equal(WALKTHROUGH.keepTotal, "₹60,000")
assert.equal(WALKTHROUGH.reduceTotal, "₹27,600")
assert.equal(WALKTHROUGH.current, "₹5,000")
assert.equal(WALKTHROUGH.proposed, "₹2,300")
assert.equal(WALKTHROUGH.months, "12")
assert.equal(WHAT_IF.rawReduce, "24000")
assert.equal(WHAT_IF.reduceDiff, "₹24,000")
assert.equal(WHAT_IF.keepTotal, "₹30,000")
assert.equal(WHAT_IF.reduceTotal, "₹6,000")
assert.equal(WHAT_IF.pauseDiff, "₹30,000")
assert.equal(WHAT_IF.months, "6")
assert.equal(WHAT_IF.proposed, "1000")
assert.equal(figuresFor(1000, 12).rawReduce, "48000")
assert.equal(figuresFor(2300, 12).rawReduce, "32400")

const lowered = NARRATION.toLowerCase()
for (const phrase of ["you should", "ai-powered", "groww", "zerodha", "you will lose", "guaranteed return"]) {
  assert.equal(lowered.includes(phrase), false, phrase)
}
for (const phrase of [
  "thirty-two thousand four hundred",
  "keep, reduce, or pause",
  "what if",
  "one thousand rupees",
  "six months",
  "twenty-four thousand",
  "not an investment loss",
  "existing units stay invested",
  "without deciding for you",
]) {
  assert.equal(lowered.includes(phrase), true, phrase)
}

assert.ok(CAPTIONS.length >= 12)
const last = CAPTIONS[CAPTIONS.length - 1]
assert.ok(last)
assert.ok(last.endFrame <= DURATION_IN_FRAMES)
assert.ok(last.endFrame > 80 * FPS)

const comparison = SCENES.find((scene) => scene.id === "comparison")
assert.ok(comparison)
const reveal = comparison.from + COMPARE_REVEAL_FRAME
const revealCue = CAPTIONS.find((cue) => cue.text.toLowerCase().includes("thirty-two thousand four hundred"))
assert.ok(revealCue)
assert.ok(reveal >= revealCue.startFrame && reveal < revealCue.endFrame)

const whatif = SCENES.find((scene) => scene.id === "whatif")
assert.ok(whatif)
assert.equal(whatif.duration, 360)
const settled = whatif.from + WHATIF_MONTHS_END
const explored = CAPTIONS.find((cue) => cue.text.toLowerCase().includes("twenty-four thousand"))
assert.ok(explored)
assert.ok(settled >= explored.startFrame && settled < explored.endFrame)

const seconds = DURATION_IN_FRAMES / FPS
assert.ok(seconds <= 82.01, `duration ${seconds}`)
assert.ok(seconds >= 80, `duration ${seconds}`)

const vtt = readFileSync(new URL("../public/audio/voiceover.vtt", import.meta.url), "utf8")
const srt = readFileSync(new URL("../public/subtitles/finlit-skip-check-brand-film.srt", import.meta.url), "utf8")
for (const phrase of ["thirty-two thousand four hundred", "twenty-four thousand", "not an investment loss", "Make your decision"]) {
  assert.ok(vtt.toLowerCase().includes(phrase.toLowerCase()), phrase)
  assert.ok(srt.toLowerCase().includes(phrase.toLowerCase()), phrase)
}

console.log(`film checks passed (${seconds.toFixed(1)}s, ${CAPTIONS.length} captions)`)

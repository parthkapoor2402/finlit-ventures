/** Global frames at 30 fps. Cue text is the narration actually spoken in that window. */
export type Cue = { startFrame: number; endFrame: number; text: string }

export const CAPTIONS: Cue[] = [
  { startFrame: 13, endFrame: 191, text: "Life changes. Expenses shift, and sometimes you reconsider your monthly SIP." },
  { startFrame: 215, endFrame: 298, text: "Skip Check by FinLit helps you understand" },
  { startFrame: 298, endFrame: 380, text: "what a change could mean, before you decide." },
  { startFrame: 404, endFrame: 509, text: "Start with what's changed. You can choose a reason," },
  { startFrame: 509, endFrame: 614, text: "add a note, or skip the explanation entirely." },
  { startFrame: 638, endFrame: 729, text: "Enter your current contribution, the amount you're considering," },
  { startFrame: 729, endFrame: 820, text: "and how long the change might last." },
  { startFrame: 844, endFrame: 1014, text: "Now compare the possibilities. Keep, reduce, or pause." },
  { startFrame: 1014, endFrame: 1185, text: "Reducing to two thousand three hundred rupees means thirty-two thousand four hundred rupees less in planned contributions over twelve months." },
  { startFrame: 1208, endFrame: 1332, text: "That's a difference in planned contributions, not an investment loss." },
  { startFrame: 1332, endFrame: 1455, text: "Existing units stay invested when future contributions are paused." },
  { startFrame: 1478, endFrame: 1599, text: "Need more clarity? SIP Check Bot explains the numbers," },
  { startFrame: 1599, endFrame: 1719, text: "and the difference between reducing and pausing, without deciding for you." },
  { startFrame: 1743, endFrame: 1837, text: "Understand the difference, review your options," },
  { startFrame: 1837, endFrame: 1932, text: "and make your own decision in your own investing app." },
  { startFrame: 1956, endFrame: 2089, text: "Skip Check. See the difference. Make your decision." },
]

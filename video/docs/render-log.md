# Render log

Master film rendered and probed on 2 October 2026.

## Command

From `video/`:

```bash
npx remotion render src/index.ts FinLitSkipCheckAd out/finlit-skip-check-brand-film.mp4 --codec=h264 --crf=18
```

Remotion 4.0.532. Exit code 0. The root `dist/` folder is the Vite build, so the master file is not written there.

## Encoded file

| Check | Result |
| --- | --- |
| Path | `video/out/finlit-skip-check-brand-film.mp4` |
| Size | 8.7 MB |
| Duration | 123.000 seconds (3,690 frames) |
| Resolution | 1920 × 1080, 16:9 |
| Frame rate | 30 fps, progressive |
| Video | H.264 High, yuvj420p |
| Audio | AAC LC, 48 kHz, stereo, present for the full duration |
| Loudness | mean −25.3 dB, peak −7.2 dB |

Subtitles matching the burned-in cues: `video/public/subtitles/finlit-skip-check-brand-film.srt` (33 cues). A copy sits beside the master at `video/out/finlit-skip-check-brand-film.srt`.

## What was checked on the encoded frames

- Opening headline, generic SIP screen, and the two-panel gap before confirmation.
- Inputs ₹12,000, ₹6,000, and 6 months, shown before the result.
- Impact card ₹36,000 with `(₹12,000 − ₹6,000) × 6 = ₹36,000`, labelled as contributions that would not be invested, not a loss or a return forecast.
- Existing units stay invested, future units are not estimated, and Skip Check does not change the SIP.
- Keep, Reduce, and Pause are the same size. Pause is outlined, not filled.
- Recap labels a pause of ₹72,000 and a reduction of ₹36,000 as separate figures from the same calculator.
- End card: “See the difference. Make your decision.”, “Decision support. Not investment advice.”, and the SEBI / AMFI registration line.
- No named broker mark. Captions sit in the lower band and do not cover the hero figure.

`node --experimental-strip-types tests/film.test.ts` passed (123.0s, 33 captions). ESLint on the film sources passed.

## Limits

The narration is synthetic (`en-IN-NeerjaNeural`), not a recorded actor. The music is an original sine pad, not a performed piano score. The opening picture is a generated still, framed inside the shot. The film is 123 seconds because the voice was not time-stretched to force 120. There is no 9:16 cut. The product screens are drawn for the film and use the prototype’s calculator; they are not a capture of the running app.

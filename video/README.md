# Skip Check product demo

An 82-second film of the current Skip Check journey: landing, reason, amounts, Keep / Reduce / Pause, the What if explorer, the contribution-difference explanation, SIP Check Bot, and the recap.

The picture is 1920×1080 at 30 fps. The spoken track is in the MP4.

## Voice

The narration is Microsoft Edge neural voice `en-IN-NeerjaExpressiveNeural`, generated one sentence at a time with `edge-tts`. Rates differ by sentence so the lines fit the scenes. The finished file is not time-stretched.

ElevenLabs, Cartesia, and Grok text-to-speech were not used. No credentials for those services are configured. The music bed is the existing file `public/audio/music.mp3`, held under the voice.

## Render

From `video/`:

```bash
npm install
npm test
npm run render
```

The render writes `video/out/finlit-skip-check-brand-film.mp4`.

Copy the public files:

```bash
mkdir -p dist
cp out/finlit-skip-check-brand-film.mp4 dist/finlit-skip-check-product-demo.mp4
cp public/subtitles/finlit-skip-check-brand-film.srt dist/finlit-skip-check-product-demo.srt
```

Check the file:

```bash
ffprobe -hide_banner dist/finlit-skip-check-product-demo.mp4
```

Expect H.264, 1920×1080, 30 fps, about 82 seconds, and an AAC audio stream.

## Demo page

`site/index.html` plays the MP4 with the SRT captions. Serve `video/dist` after the copy step:

```bash
python3 -m http.server 8090 --directory dist
```

Open `http://127.0.0.1:8090/`.

## Arithmetic in the film

The figures come from `calculateContributionDifference`:

- Current monthly SIP ₹5,000
- Proposed monthly SIP ₹2,300
- 12 months
- Reduce: ₹32,400 less in planned contributions
- Pause: ₹60,000 less in planned contributions

The What if scene then moves the same ₹5,000 SIP to ₹1,000 for 6 months. Reducing means ₹24,000 less in planned contributions. Keeping is ₹30,000 with no difference. Pausing means ₹30,000 less. Those cards use the same calculator.

That number is planned contributions, not an investment loss. Skip Check does not change the SIP.

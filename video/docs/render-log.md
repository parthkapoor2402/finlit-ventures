# Render log

Remade on 2 October 2026 to the revised narration, with the voice mixed loud enough to hear and the file encoded so a browser can play picture and sound together.

## Voice

Grok Text to Speech was requested (`voice_id` `ara`, female, warm). `POST https://api.x.ai/v1/tts` returned 401: no `XAI_API_KEY` is present in this environment. The narration in the file is edge-tts `en-IN-NeerjaNeural` (female, Indian English), rate −8%, volume +100%, then loudness-normalised. Music is ducked under the voice.

Speech window (2–10 seconds): mean −18.1 dB, peak −2.0 dB.

## Commands

From `video/`:

```bash
npx remotion render src/index.ts FinLitSkipCheckAd out/finlit-skip-check-brand-film.mp4 --codec=h264 --crf=18
```

The delivered file then replaces that audio with the loud voice and ducked music, and re-encodes the picture as `yuv420p` with the moov atom at the front:

```bash
ffmpeg -i out/finlit-skip-check-brand-film.mp4 -i public/audio/voiceover.mp3 -i public/audio/music.mp3 \
  -filter_complex "[1:a]aformat=sample_rates=48000:channel_layouts=stereo,apad=pad_dur=10,asplit=2[voice][key];[2:a]aformat=sample_rates=48000:channel_layouts=stereo,volume=0.16[music];[music][key]sidechaincompress=threshold=0.02:ratio=12:attack=10:release=400[ducked];[voice][ducked]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 18 -r 30 -c:a aac -b:a 192k -ac 2 -movflags +faststart -shortest /tmp/finlit-web.mp4
ffmpeg -i /tmp/finlit-web.mp4 -c:v copy -c:a aac -ar 48000 -ac 2 -b:a 192k -movflags +faststart out/finlit-skip-check-brand-film.mp4
```

## Encoded file

| Check | Result |
| --- | --- |
| Path | `video/out/finlit-skip-check-brand-film.mp4` |
| Size | 5.9 MB |
| Duration | 114.200 seconds |
| Resolution | 1920 × 1080 |
| Frame rate | 30 fps |
| Picture | H.264 High, yuv420p |
| Sound | AAC LC, 48 kHz, stereo |
| Subtitles | `video/public/subtitles/finlit-skip-check-brand-film.srt` |

`npm test` inside `video/` passed (114.2s, 24 captions). ESLint on the film sources passed.

## Public playback

Deck hyperlink (raw MP4 when the deck sends a referrer):

https://qu.ax/x/P4Ym8.mp4

Player page (same file, press play, sound on):

https://qu.ax/P4Ym8.mp4/

The host stores that copy with no expiry date. SHA-256 `e3f3c0480259c71dfa4e56b356b72aacddab8914c2af8797734256a6ca99bbdc`, 6,102,517 bytes, H.264, AAC LC, 48 kHz stereo, 114.200 seconds. A request that includes a referrer returns `video/mp4`. A request with no referrer redirects to the player page, which is not muted. Chrome decoded the AAC track while the picture advanced.

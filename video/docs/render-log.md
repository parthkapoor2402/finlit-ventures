# Render log

Recut on 2 October 2026 to a 70-second film. The narration was generated again, sentence by sentence. The previous 114-second track was not time-stretched.

## Voice

Grok Text to Speech was requested (`voice_id` `ara`, language `en`, `text_normalization` true). No `XAI_API_KEY` is present, so `https://api.x.ai/v1/tts` was not called. The voice in this film is not Grok.

The narration is edge-tts `en-IN-NeerjaNeural` (female, Indian English), one sentence at a time, then joined. Pitch is −1Hz or +0Hz. Volume is between +4% and +14%. Rates:

| Line | Rate |
| --- | --- |
| Life doesn't always go according to plan. | +18% |
| An unexpected expense… rethink your SIP. | +28% |
| But before you make that change… | +12% |
| Meet Skip Check by FinLit Ventures. | +10% |
| A simple way to compare your options… | +10% |
| Say your monthly SIP is twelve thousand rupees… | +8% |
| That's thirty-six thousand rupees… | +9% |
| That's a contribution difference… | +18% |
| Your existing units remain invested… | +18% |
| Keep, reduce, or pause. | +12% |
| Review the difference… | +11% |
| Skip Check. | +9% |
| See the difference. | +8% |
| Make your decision. | +8% |

Scene 1 and scene 5 are quicker than +12% so those lines finish inside their scenes. Gaps inside a scene are about 0.20–0.32 seconds. The holds between scenes are longer, including the pause before the rupee figures and before the last line.

The joined voice was processed with:

```bash
ffmpeg -i voice-raw.wav -af "highpass=f=85,equalizer=f=220:t=q:w=1.1:g=-1.2,equalizer=f=2800:t=q:w=1.0:g=1.0,acompressor=threshold=-20dB:ratio=1.6:attack=15:release=180:makeup=1.2:knee=8,loudnorm=I=-16:TP=-1.5:LRA=11" -ac 2 -ar 48000 voice-proc.wav
```

Measured on that file: integrated −16.2 LUFS, true peak −4.5 dBTP. Duration 64.639 seconds. The last word, "decision", ends at 64.239 seconds. The file was not time-stretched to 70 seconds.

## Picture

From `video/`:

```bash
npx remotion render src/index.ts FinLitSkipCheckAd out/finlit-skip-check-brand-film.mp4 --codec=h264 --crf=18
```

Remotion wrote H.264 High at 1920×1080, 30 fps, 2100 frames, but the pixel format was `yuvj420p`. Its embedded music was effectively silent in the holds (about −60 dB, and digital silence during the calculation hold), so the delivered file replaces that audio with the mastered mix and re-encodes the picture as `yuv420p`.

Music is an original centered piano-and-pad score. It is ducked in the file from 24.6s to 49.3s, and the mix side-chain ducks it again under the voice. No commercial track.

```bash
ffmpeg -i /tmp/vo-build/voice-proc.wav -i /tmp/vo-build/music.wav \
  -filter_complex "[0:a]apad=whole_dur=70,asplit=2[voice][key];[1:a]atrim=0:70,asetpts=PTS-STARTPTS,volume=1.35[music];[music][key]sidechaincompress=threshold=0.02:ratio=8:attack=25:release=420:makeup=1[ducked];[voice][ducked]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0,alimiter=limit=0.891:attack=10:release=80,aformat=sample_rates=48000:channel_layouts=stereo[a]" \
  -map "[a]" -c:a pcm_s16le -ar 48000 -ac 2 /tmp/vo-build/mix.wav
```

The limiter did not reduce this mix. The peak was already −3.4 dB.

```bash
ffmpeg -i /workspace/video/out/finlit-skip-check-brand-film.mp4 -i /tmp/vo-build/mix.wav \
  -filter_complex "[1:a]volume=1.25,alimiter=limit=0.891:attack=8:release=60,aformat=sample_rates=48000:channel_layouts=stereo[a]" \
  -map 0:v:0 -map "[a]" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 18 -r 30 -frames:v 2100 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -t 70 /tmp/finlit-master.mp4
```

That pass fixed the picture. Its audio was hotter than −1 dB after AAC, so the delivered file keeps that picture and attaches `mix.wav` with no extra gain:

```bash
ffmpeg -i /tmp/finlit-master.mp4 -i /tmp/vo-build/mix.wav \
  -filter_complex "[1:a]volume=1.0,aformat=sample_rates=48000:channel_layouts=stereo[a]" \
  -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart -t 70 /tmp/finlit-final.mp4
```

Speech-window mean −17.94 dB. Scene 1 window (0.2–8.1s) mean −18.21 dB. Peak −3.4 dB. Left/right correlation 1.0, so a mono downmix stays at the same level. The calculation hold (36.2–39.5s) sits at −43.9 dB. The end-card hold (65–69.2s) sits at −35.5 dB.

## Encoded file

| Check | Result |
| --- | --- |
| Path | `video/out/finlit-skip-check-brand-film.mp4` (gitignored) |
| Size | 4,298,407 bytes |
| SHA-256 | `0260a3ead29ae0a75fd1d2a4cbdefbceb012b8341a54896181b68218d01b0722` |
| Duration | 70.000 seconds |
| Frames | 2100 |
| Resolution | 1920 × 1080 |
| Frame rate | 30 fps |
| Picture | H.264 High, yuv420p, bt709 |
| Sound | AAC LC, 48 kHz, stereo, 192 kbps |
| Voice file | 64.639 seconds, last word at 64.239 seconds |
| Subtitles | `video/public/subtitles/finlit-skip-check-brand-film.srt` |
| Faststart | `moov` atom follows `ftyp` |

Scene 1 is 250 frames and scene 2 is 230 frames, so the cut falls after "SIP" (that word ends at 8.188 seconds). Every other boundary matches the requested 70-second map. The total stays 2100 frames.

`npm test` inside `video/` passed (70.0s, 19 captions). The calculator check in that test is ₹12,000 to ₹6,000 for 6 months = ₹36,000, and a separate pause of ₹12,000 for 6 months = ₹72,000. ESLint on the film sources passed.

## Public playback

Deck hyperlink (raw MP4 when the request sends a referrer):

https://qu.ax/x/fDJe0.mp4

Player page:

https://qu.ax/fDJe0.mp4/

The host returned `expires: null`. A request with referrer `https://docs.google.com/` returns HTTP 200, `content-type: video/mp4`, `content-length: 4298407`. The downloaded bytes match the local SHA-256. ffprobe on that download reports H.264 High, yuv420p, AAC LC, 48 kHz stereo, duration 70.000 seconds, 2100 frames. A request with no referrer redirects to the player page. In headless Chrome the player `<video>` is not muted, volume is 1, `currentTime` advanced (0.73s to 1.93s), and `webkitAudioDecodedByteCount` increased (25504 to 54185).

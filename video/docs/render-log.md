# Render log

Product demo rendered on 3 October 2026.

## Voice

ElevenLabs, Cartesia, and Grok text-to-speech were not used. No credentials for those services are configured.

The voice is Edge neural `en-IN-NeerjaExpressiveNeural`, one sentence at a time, with a different rate on each sentence. The joined track is not time-stretched. Music from `video/public/audio/music.mp3` sits under the voice.

The delivered MP4 contains an AAC stereo stream. Measured loudness is about −24 dB mean and −6 dB peak, so the voice is present.

## Picture

Remotion rendered 2100 frames at 30 fps, 1920×1080, H.264. Duration 70.016 seconds. The example is ₹5,000 reduced to ₹2,300 for 12 months, which is ₹32,400 less in planned contributions. A pause is ₹60,000 less in planned contributions.

## Public page

A temporary public page was opened with a Cloudflare tunnel and checked from outside this machine. The page, the MP4, and the SRT each returned HTTP 200. The downloaded MP4 is 70.016 seconds and includes the AAC voice track.

There is no Vercel, Netlify, or other permanent host signed in, so this link lasts only while that tunnel is running.

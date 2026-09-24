# UI Audio

## Current scope and source

This pass adds interface effects, without new visual transitions. These are actual
audio files from HoYoverse's [Dream of Roving Stars web event](https://act.hoyoverse.com/ys/event/e20230928review/),
not a verified recreation of the desktop game's constellation audio. Research did
not establish a complete catalog of every Genshin sound. The older
[community extraction archive](https://github.com/Escartem/GenshinAudio) contains
unnamed files; those were not assigned arbitrary UI meanings.

The official event's `index_9ebceaa3d0ec1c0141cb.js` references these files under
`https://act.hoyoverse.com/ys/event/e20230928review/medias/`:

| Source filename | Local file in `music/sfx/` | Starlight mapping |
| --- | --- | --- |
| `btn.b0025177..mp3` | `button.mp3` | Click; quieter hover and keyboard focus |
| `btn_module.135a2304..mp3` | `open.mp3` | Open a memory |
| `change.0cdd91d9..mp3` | `change.mp3` | Previous/next and back/close |
| `unlock.8ffc906c..mp3` | `unlock.mp3` | First successful photo load per memory |

The mapping is our design choice. Hover is an attenuated button clip, not a
separately verified game hover asset. Downloaded clips remain in ignored `music/`;
availability online does not establish redistribution permission. This local
adapter returns 404 outside development, without `LOCAL_PRIVATE_MEDIA=true`, or
for non-loopback hosts. No third-party request occurs during page use.

## How it works

`UiSounds` shares effects volume and maps mouse/keyboard interactions to cues.
Semantic actions override the default click. `UiSoundEngine` owns one Web Audio
context, decodes each of four files once after interaction, and reuses buffers.
Effects have a separate volume/mute control beneath the cat. Music is independent.

Browser gesture requirements mean initial hover can be silent. Unloaded cues are
dropped rather than played late. Hover is throttled, overlap is limited to four
voices, and missing/invalid audio never blocks navigation. Cleanup aborts downloads,
stops voices, and closes the context. Volume is session-only.

## Validation and next step

`tests/sounds.spec.ts` checks real local MP3 decoding, playback triggers, independent
mute/volume, close actions, and invalid-audio resilience. The real-file check skips
on fresh clones without local clips. Tests verify scheduling, not subjective sound
similarity. Audition against the actual game before claiming an exact match; visual
transitions remain a later step.

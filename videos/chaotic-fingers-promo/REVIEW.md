# Review — Chaotic Fingers promo (pass 1)

## Creative calls
- Storyline A "Chaos, then the click" (STORYLINES.md); B (one video call, continuous take) and C (kinetic garbage-type cut on the beat) not built.
- Every product screen is the real UI rebuilt from docs/screenshots with copy taken from the Swift source; the menu-bar
  icon and every glyph are the app's real SF Symbols; the end-card tile copies the real icon tile (#EBEBEB→#BCBCBC).
- The click-to-silence turn: key clatter runs from frame 0 and is cut dead on the click at 13.82 s.
- One schedule, three recomposed formats (src/build.mjs). 9:16 keeps content in x 96-960, y 250-1130, captions above y 1230.

## Measured
- `check`: ok on all three projects. Voice -16.4 LUFS integrated, -1.7 dBTP (gain + limiter, originals in src/vo-raw/).
- Snapshot sheets at ~20 beats per format, looked at by eye. Sound was measured, not heard.

## Pass 2 (after `snapshot --review` seams + phone sheet)
- P0 fixed: flying letters (vanish, privacy) and the end-card wordmark showed early as ghosts — fromTo applied its
  from-state at build; now `immediateRender:false`.
- P1 fixed: claim opened on ~0.6 s of empty ground; cut moved to 56.35 s, 0.2 s before "screen".
- Rendered mix: -13.3 LUFS integrated, -1.1 dBTP; 14.25-15.25 s after the click measures -91 dB (the silence holds).
  Slightly hotter than -14; platforms normalise down. Lower the clatter (0.7 -> 0.55) when the music pass re-renders.
- Kept: a 1-3 frame empty ground at most cuts while the next scene's first element enters (reads as a soft dip).

## Not done yet
- Music bed: HeyGen catalog chosen; not signed in at render time, so v1 renders carry voice + SFX only.
  After `auth login`: resolve a bed to assets/music/bed.mp3, `node src/build.mjs`, re-render (build.mjs mixes it at 0.14 under the voice from 14.4 s).

## Weakest shots
- t=20.6 s vanish (16:9): dashboard left, keys right, empty middle — with time, carry the letters across into the window.
- t=48.6 s privacy: flying letters bunch above the keys; reads as busy rather than "discarded".
- t=27.8 s menu bar: the right-click menu is on screen ~1 s, a glimpse rather than a read.

## Warnings kept on purpose
- text_below_floor / contrast_aa_failure on the dashboard and Settings: real UI at real proportions in establishing shots; the
  segmented control is dimmed because the app dims it while blocking.
- line_unread on the draft (0-4.5 s): the text is meant to be destroyed, not read; on the mode cards: the VO carries the switch.
- outside_safe_zone (9:16) for TikTok-only zones and two window-chrome titles under the Shorts top bar.

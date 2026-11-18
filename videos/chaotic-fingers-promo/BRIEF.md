---
workflow: hyperframes
flow: automation
storyboard: no
message: "Lock your Mac's keyboard and trackpad in one click — and never get locked out."
destination: [youtube, linkedin, instagram, x]
aspect: [1920x1080, 1080x1920, 1080x1080]
language: en
audience: Mac users with toddlers or pets, and people who clean their keyboards
length: 60-75s
angle: chaos-to-control
voice: kokoro/af_heart
---

## Intent

Marketing film for Chaotic Fingers (macOS 14+) that shows every feature and what the app
solves. Chaos → control: open on the problems (toddler mashing keys, cat on the keyboard,
wiping the keyboard), one click locks it, then the features, close on "never locked out".
User's words: "show all the features of this and what this app can solve", for YouTube,
LinkedIn, Instagram and X.

## Assets

- ../../docs/screenshots/dashboard.png — real dashboard UI; rebuilt 1:1 as live states.
- ../../docs/screenshots/settings.png — real Settings window; rebuilt 1:1.
- ../../icon.png — real baby-hand cutout (alpha); payoff + end card.
- ../../Resources/AppIcon.icns — app icon; end-card mark.
- ../../Resources/{keyboard,trackpad,both}_bg.png — the app's own header textures.

## Customizations

- AI voiceover: local Kokoro, voice af_heart (user picked by ear).
- Music bed: HeyGen catalog after user signs in (user chose over synthesized/none).
- Chaos SFX: key clatter during the problem scenes, cut to silence the instant it locks.
- Burned-in word-timed captions (feeds autoplay muted).
- Three deliverables: 16:9 master, 9:16 and 1:1 recomposed (not squeezed).
- CTA: "Free for macOS 14+" + github.com/1mrajeevranjan/Chaotic-Fingers (confirmed).

## Notes

- Look: the app's own — light macOS, system blue, real UI copy from source; no invented screens.
- The September promo (dist/chaotic-fingers-promo.mp4) stays untouched.
- 2026-11-18: rendered v1 without music (user: "Render now, music later"); add the HeyGen bed after sign-in.
- All three formats are generated: edit src/ (scenes, schedule, ui), run `node src/build.mjs`, never hand-edit
  ../chaotic-fingers-promo-{vertical,square}.

# SPEC — Chaotic Fingers promo (storyline A)

GOAL:    a Mac user with a toddler, pet or cleaning cloth installs Chaotic Fingers, trusting they can never lock themselves out.
OUTPUT:  HyperFrames, 1920x1080 (master) + 1080x1920 + 1080x1080, 30 fps. Same scenes, recomposed per format by src/build.mjs.
TIME:    66.0 s x 30 = 1980 frames. Narrated: the af_heart voice is the clock; every event lands on its word.
LOOK:    ground #F5F5F7 flat, the app's own key-pattern PNGs at 100% inside window headers and 7% as world texture;
         chaos desktop ground #DCD6CB (warm desk), flat.
         ink #1D1D1F, secondary #6E6E73, hairline #E6E6E6; accent #3478F6 (sampled from the real button) only on
         the live control, one claim word and the CTA; status red #FF3B30, recovery orange #FF9500, ok green #34C759.
         Inter 900 display at 96 px / -3% tracking (tall 120 px), Inter 700 UI, Inter 400 body >= 26 px after any push.
         Medium: real macOS UI rebuilt 1:1 from docs/screenshots (labels from source), physical keycaps
         (top #FFFFFF -> #F2F2F4, 2 px #D2D2D7 rim, 0 10px 0 #C7C7CC skirt, 0 24px 40px rgba(0,0,0,.14)).
         Window shadow 0 30px 80px rgba(0,0,0,.18) + 0 0 0 1px rgba(0,0,0,.08). No grain, no vignette.
OBJECTS: the email draft window (To / Subject / body, traffic lights) — generic, no app branding;
         the real dashboard (icon tile, title, subtitle, Keyboard|Trackpad|Both, effect card, Start/Stop button);
         the menu bar strip with the real hand.raised / hand.raised.fill symbol;
         physical keycaps (Shift, Command, Option, esc, return, K/T/B, space) with real legends;
         the real Settings window; the real baby-hand cutout (icon.png); the real app icon.
MOTION:  arrive expo.out 0.5-0.7 s; camera/scale moves power2.inOut 0.5 s; exits power3.in 0.25-0.3 s;
         key press = y +8 px & skirt 10->2 px in 0.06 s, release 0.12 s; UI state flips instant (it is a UI);
         titles per-word blur 6->0 in 0.13 s, 0.067 s apart, then dead still.
SHOTS:   S1 0.0-10.2 draft floods (frame 0 already flooded) -> sent flies off -> 5 windows pop -> space bar held, cursor races. Clatter.
         S2 10.2-15.0 dashboard arrives from the clicked chaos; cursor clicks Start Blocking on "click": silence, red Stop, status strip.
         S3 15.0-18.2 punch-in on segmented control + card; Keyboard/Trackpad/Both on their words; header texture swaps.
         S4 18.2-23.0 keycaps hammer, draft cursor stays still; pointer glides to Stop on "Stop".
         S5 23.0-28.2 window carries into the menu bar icon; click on "One click": hollow -> filled hand.
         S6 28.2-32.3 Shift + Command keycaps down; third key rolls K -> T -> B with its mode under it.
         S7 32.3-37.5 both Shift keys held; ring fills in a real 3.0 s; lock opens; "Inputs active".
         S8 37.5-41.7 esc esc return return pressed on their words; "Quits the app. Inputs released."
         S9 41.7-46.0 Settings: Light->Dark on "dark" (window turns dark), Dock / Menu Bar / Launch at Login toggles on their words.
         S10 46.0-49.9 typed letters fall into the status strip and are discarded.
         S11 49.9-55.2 the real baby hand comes down on the keycaps; the draft above stays clean, cursor blinking.
         S12 55.2-58.8 "Screen on. Inputs off." — "Inputs off." in accent.
         S13 58.8-66.0 hand shrinks into the app icon tile, wordmark wipes in, "Free for macOS 14+" + repo URL hold 3 s+.
BANNED:  dark void ground; glow/particles; gradients beyond the keycap face; three cards in a row; title over a dimmed
         screenshot; logo docked in a corner; everything fading up; invented app UI (every product label comes from source);
         Apple app branding on the draft window; titles moving after they land; music synthesised in code.
QA:      0.0 (thumbnail: flood + VO caption), 13.9 (click -> red Stop), 16.4 (Trackpad card copy), 35.5 (ring mid-fill),
         43.6 (dark Settings), 52.0 (hand on keys, clean draft), 57.0 (claim), 64.5 (end card + CTA); captions inside title-safe;
         tall: nothing outside 168-1330 px but texture.

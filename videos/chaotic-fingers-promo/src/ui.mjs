// Shared look and the product's UI, rebuilt 1:1 from docs/screenshots with the
// labels copied from the app's source (Views/LandingView.swift, StatusOverlayView.swift).

export const C = {
  ground: "#F5F5F7", desk: "#DCD6CB", ink: "#1D1D1F", dim: "#6E6E73", hair: "#E6E6E6",
  blue: "#3478F6", red: "#FF3B30", orange: "#FF9500", green: "#34C759", seg: "#ECECEC",
};

// Per-format canvas, the stage every scene centres in, and the caption band.
export const FORMATS = {
  wide: { k: "wide", w: 1920, h: 1080, stage: [96, 60, 1728, 820], capBottom: 112, capMax: 1500, title: 96 },
  square: { k: "square", w: 1080, h: 1080, stage: [60, 56, 960, 800], capBottom: 112, capMax: 900, title: 84 },
  // tall keeps clear of the Reels/Shorts top bar, right action rail and bottom caption area
  tall: { k: "tall", w: 1080, h: 1920, stage: [96, 250, 864, 880], capBottom: 690, capMax: 840, title: 112 },
};

// The three modes, verbatim from the app.
export const MODES = {
  keyboard: {
    sym: "keyboard", seg: "Keyboard", title: "Secure your keyboard", desc: "Lock the keyboard so keystrokes cannot reach any app.",
    r1: "Key presses are swallowed everywhere.", r2: "The pointer still works, so this window stays clickable.",
    r3: "Hold both Shift keys for 3 seconds to unlock.", status: "Keyboard locked", hint: "Hold both Shift keys for 3s", bg: "keyboard_bg",
  },
  trackpad: {
    sym: "rectangle.and.hand.point.up.left", seg: "Trackpad", title: "Secure your trackpad", desc: "Lock the trackpad and mouse so the pointer cannot reach any app.",
    r1: "Pointer, clicks and scrolling are swallowed.", r2: "Typing still works, and this window stays clickable.",
    r3: "Hold both Option keys for 3 seconds to unlock.", status: "Trackpad locked", hint: "Hold both Option keys for 3s", bg: "trackpad_bg",
  },
  both: {
    sym: "lock.shield", seg: "Both", title: "Secure both inputs", desc: "Lock the keyboard and the pointer together — a full input freeze.",
    r1: "Keys, pointer, clicks and scrolling are swallowed.", r2: "This window stays clickable so you can stop.",
    r3: "Hold both Command keys for 3 seconds to unlock.", status: "Keyboard and trackpad locked", hint: "Hold both Command keys for 3s", bg: "both_bg",
  },
};

export const sym = (name, cls = "", style = "") =>
  `<i class="sym ${cls}" style="-webkit-mask-image:url('assets/sym/${name}.png');mask-image:url('assets/sym/${name}.png');${style}"></i>`;

// The standard macOS arrow pointer, drawn (the system ships it only as a runtime image).
export const cursor = (id) =>
  `<svg id="${id}" class="cursor" viewBox="-2 -2 20 29" width="54" height="78"><path d="M0 0V22.5L5.3 17.4L8.9 25.6L12.3 24.1L8.8 16.1H15.6Z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;

export const baseCss = (F) => `
#root { position: absolute; inset: 0; overflow: hidden; font-family: 'Inter', sans-serif; color: ${C.ink}; background: ${C.ground}; -webkit-font-smoothing: antialiased; }
.stage { position: absolute; left: ${F.stage[0]}px; top: ${F.stage[1]}px; width: ${F.stage[2]}px; height: ${F.stage[3]}px; display: flex; align-items: center; justify-content: center; }
.fill { position: absolute; inset: 0; }
.sym { display: inline-block; flex: none; background: currentColor; -webkit-mask-size: contain; mask-size: contain; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; -webkit-mask-position: center; mask-position: center; }
.cursor { position: absolute; left: 0; top: 0; z-index: 50; filter: drop-shadow(0 3px 4px rgba(0,0,0,.3)); }
.title { font-weight: 900; font-size: ${F.title}px; letter-spacing: -0.03em; line-height: 1.04; text-align: center; text-wrap: balance; }
.title .w { display: inline-block; }
.note { font-weight: 700; font-size: ${F.k === "tall" ? 40 : 34}px; letter-spacing: -0.01em; color: ${C.dim}; text-align: center; }
.tl3 { position: absolute; left: 16px; top: 13px; display: flex; gap: 9px; z-index: 3; }
.tl3 i { width: 13px; height: 13px; border-radius: 50%; background: #FF5F57; box-shadow: inset 0 0 0 .5px rgba(0,0,0,.12); }
.tl3 i:nth-child(2) { background: #FEBC2E; } .tl3 i:nth-child(3) { background: #DCDCDC; }
.mwin .tl3 { top: 21px; left: 22px; gap: 10px; } .mwin .tl3 i { width: 15px; height: 15px; }
.mwin { background: #fff; border-radius: 16px; box-shadow: 0 30px 80px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.08); overflow: hidden; position: relative; }
.mbar { height: 56px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; color: #3a3a3c; border-bottom: 1px solid ${C.hair}; position: relative; }
/* physical keycap: base skirt + cap that travels 8px on a press */
.key { position: relative; height: 140px; width: var(--kw, 140px); flex: none; }
.key .base { position: absolute; inset: 10px 0 -10px 0; border-radius: 24px; background: #C7C7CC; box-shadow: 0 26px 40px rgba(0,0,0,.16); }
.key .cap { position: absolute; inset: 0; border-radius: 24px; background: linear-gradient(#FFFFFF, #F2F2F4); border: 2px solid #D2D2D7; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 700; font-size: 32px; color: ${C.ink}; }
.key .cap .lg { font-size: 44px; font-weight: 400; }
.key .cap.small { justify-content: flex-start; align-items: flex-end; padding: 0 0 18px 22px; font-size: 26px; font-weight: 400; }
/* the real dashboard at 1pt = 1px; .dash scales it by zoom so text stays crisp */
.dash { zoom: var(--z, 1.6); }
.dwin { width: 480px; height: 480px; background: #fff; border-radius: 16px; overflow: hidden; position: relative; box-shadow: 0 18px 50px rgba(0,0,0,.18), 0 0 0 .6px rgba(0,0,0,.1); }
.dhead { position: absolute; left: 0; top: 0; width: 480px; height: 182px; border-bottom: 1px solid ${C.hair}; overflow: hidden; }
.dhead .tex { position: absolute; inset: 0; background-size: 320px; background-position: center; }
.dttl { position: absolute; top: 9px; width: 100%; text-align: center; font-weight: 700; font-size: 13px; }
.tile { background: linear-gradient(#EDEDED, #BCBCBC); border-radius: 22.5%; box-shadow: 0 1px 3px rgba(0,0,0,.18), inset 0 0 0 .5px rgba(0,0,0,.08); }
.dtile { position: absolute; left: 213px; top: 58px; width: 54px; height: 54px; } .dicon { position: absolute; left: 6px; top: 6px; width: 42px; height: 42px; }
.dname { position: absolute; top: 118px; width: 100%; text-align: center; font-weight: 700; font-size: 15px; }
.dsub { position: absolute; top: 142px; width: 100%; text-align: center; font-size: 9.6px; color: #8A8A8E; }
.seg { position: absolute; left: 20px; top: 203px; width: 440px; height: 24px; border-radius: 6px; background: ${C.seg}; display: flex; }
.seg b { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: 400; font-size: 12.5px; position: relative; z-index: 1; }
.seg .pill { position: absolute; left: 0; top: 0; width: 146.7px; height: 24px; border-radius: 6px; background: #3375F0; }
.seg b.on { color: #fff; }
.card { position: absolute; left: 20px; top: 247px; width: 440px; height: 135px; border: 1px solid ${C.hair}; border-radius: 9px; background: #fff; }
.card .lay { position: absolute; inset: 0; }
.chead { position: absolute; left: 13px; top: 14px; display: flex; gap: 13px; align-items: flex-start; }
.chead .sym { width: 31px; height: 22px; color: #7a7a7e; margin-top: 2px; }
.ct { font-weight: 700; font-size: 11.5px; } .cd { font-size: 9.6px; color: #8A8A8E; margin-top: 4px; }
.crule { position: absolute; left: 12px; right: 12px; top: 55px; height: 1px; background: ${C.hair}; }
.row { position: absolute; left: 13px; display: flex; align-items: center; gap: 12px; font-size: 9.8px; }
.row .sym { width: 10px; height: 10px; }
.btn { position: absolute; left: 20px; top: 432px; width: 440px; height: 28px; border-radius: 14px; background: ${C.blue}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12.5px; }
.btn .lab { position: absolute; }
.status { position: absolute; left: 20px; top: 394px; width: 440px; height: 28px; border-radius: 8px; background: #FFF5E8; border: 1px solid #F6C98A; display: flex; align-items: center; gap: 8px; padding: 0 12px; font-size: 10px; color: #6b4a14; }
.status b { font-weight: 700; } .status .sym { width: 15px; height: 11px; color: ${C.orange}; }
`;

const modeLayer = (P, key, m) => `
  <div class="lay" id="${P}-lay-${key}">
    <div class="chead">${sym(m.sym)}<div><div class="ct">${m.title}</div><div class="cd">${m.desc}</div></div></div>
    <div class="crule"></div>
    <div class="row" style="top:68px">${sym("nosign", "", "color:#7a7a7e")}<span>${m.r1}</span></div>
    <div class="row" style="top:90px">${sym("checkmark.circle", "", `color:${C.green}`)}<span>${m.r2}</span></div>
    <div class="row" style="top:112px">${sym("hand.raised", "", `color:${C.orange}`)}<span>${m.r3}</span></div>
  </div>`;

// P = id prefix; modes = which card layers to include (first one visible).
export function dashboard(P, { modes = ["keyboard"], z = 1.6 } = {}) {
  const m0 = MODES[modes[0]];
  return `<div class="dash" id="${P}-dash" style="--z:${z}"><div class="dwin" id="${P}-win">
  <div class="dhead">${modes.map((k, i) => `<div class="tex" id="${P}-tex-${k}" style="background-image:url('assets/img/${MODES[k].bg}.png');opacity:${i ? 0 : 0.5}"></div>`).join("")}
    <div class="tl3"><i></i><i></i><i></i></div><div class="dttl">Chaotic Fingers</div>
    <div class="dtile tile"><img class="dicon" src="assets/img/app-icon.png" alt=""></div><div class="dname" id="${P}-name">Chaotic Fingers</div>
    <div class="dsub">Safeguard your inputs when your li'l one is around</div></div>
  <div class="seg" id="${P}-seg"><i class="pill" id="${P}-pill"></i><b id="${P}-s0" class="on">Keyboard</b><b id="${P}-s1">Trackpad</b><b id="${P}-s2">Both</b></div>
  <div class="card" id="${P}-card">${modes.map((k, i) => modeLayer(P, k, MODES[k]).replace('class="lay"', `class="lay" style="opacity:${i ? 0 : 1}"`)).join("")}</div>
  <div class="status" id="${P}-status" style="opacity:0">${sym(m0.sym)}<b>${m0.status}</b><span>· ${m0.hint}</span></div>
  <div class="btn" id="${P}-btn"><span class="lab" id="${P}-start">Start Blocking</span><span class="lab" id="${P}-stop" style="opacity:0">Stop Blocking</span></div>
</div></div>`;
}

// A keycap; legend is HTML. cls "small" puts the legend bottom-left like a modifier key.
export const key = (id, legend, { w = 140, cls = "" } = {}) =>
  `<div class="key" id="${id}" style="--kw:${w}px"><div class="base"></div><div class="cap ${cls}" id="${id}-cap">${legend}</div></div>`;

// GSAP for a key press at time t (held for `hold` seconds, or released quickly).
export const press = (id, t, hold = 0.1) =>
  `tl.to("#${id}-cap",{y:9,duration:0.06,ease:"power2.in"},${t.toFixed(3)});` +
  `tl.to("#${id}-cap",{y:0,duration:0.14,ease:"power2.out"},${(t + 0.06 + hold).toFixed(3)});`;

// Per-word title: blur 6 -> 0, 0.067 s apart, then dead still.
export const words = (P, text, accentFrom = Infinity) =>
  text.split(" ").map((w, i) => `<span class="w" id="${P}-w${i}"${i >= accentFrom ? ` style="color:${C.blue}"` : ""}>${w}</span>`).join(" ");
export const wordsIn = (P, n, t) =>
  Array.from({ length: n }, (_, i) =>
    `tl.fromTo("#${P}-w${i}",{opacity:0,filter:"blur(6px)"},{opacity:1,filter:"blur(0px)",duration:0.13,ease:"power2.out"},${(t + i * 0.067).toFixed(3)});`).join("");

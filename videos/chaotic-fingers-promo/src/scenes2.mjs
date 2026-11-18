// Scenes 6-13: shortcuts, recovery, failsafe, settings, privacy, payoff, claim, end card.
import { C, sym, key, press, words, wordsIn } from "./ui.mjs";

const f3 = (n) => (+n).toFixed(3);
const geo = (F) => {
  const [sx, sy, sw, sh] = F.stage;
  return { sx, sy, sw, sh, cx: sx + sw / 2, cy: sy + sh / 2 };
};
const rise = (ids, t0 = 0, step = 0.07) =>
  ids.map((id, i) => `tl.fromTo("#${id}",{y:60,opacity:0},{y:0,opacity:1,duration:0.55,ease:"expo.out"},${f3(t0 + i * step)});`).join("");
const blurIn = (id, t) => `tl.fromTo("#${id}",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.18,ease:"power2.out"},${f3(t)});`;
const blurOut = (id, t) => `tl.to("#${id}",{opacity:0,filter:"blur(6px)",duration:0.14,ease:"power2.in"},${f3(t)});`;

export function shortcuts(F, sc, at) {
  const L = (g) => g - sc.start;
  const tS = L(at("v09", "shift")), tC = L(at("v09", "command")), tK = L(at("v09", "k")), tT = L(at("v09", "t")), tB = L(at("v09", "b"));
  const rel = tB + 0.45;
  const LBL = ["Keyboard", "Trackpad", "Both"];
  let js = rise(["sc-w0", "sc-w1", "sc-w2"]);
  js += `tl.fromTo("#sc-shift-cap",{y:0},{y:9,duration:0.06,ease:"power2.in"},${f3(tS)});tl.to("#sc-shift-cap",{y:0,duration:0.14},${f3(rel)});`;
  js += `tl.fromTo("#sc-cmd-cap",{y:0},{y:9,duration:0.06,ease:"power2.in"},${f3(tC)});tl.to("#sc-cmd-cap",{y:0,duration:0.14},${f3(rel)});`;
  [tK, tT, tB].forEach((t, i) => {
    if (i) js += `tl.to("#sc-slot",{y:${-56 * i},duration:0.1,ease:"power2.inOut"},${f3(t - 0.1)});`;
    js += press("sc-let", t, 0.1);
    js += blurIn(`sc-lb${i}`, t + 0.02);
    if (i) js += `tl.set("#sc-lb${i - 1}",{color:"${C.dim}"},${f3(t)});`;
  });
  const css = `.slotwin { height: 56px; overflow: hidden; } #sc-slot div { height: 56px; line-height: 56px; text-align: center; font-size: 46px; }
.wrap { display: flex; flex-direction: ${F.k === "wide" ? "row" : "column"}; align-items: center; gap: ${F.k === "wide" ? 90 : 70}px; }
.row3 { display: flex; gap: ${F.k === "wide" ? 30 : 22}px; align-items: flex-start; }
.lbls { display: flex; flex-direction: column; gap: 14px; } .lbls .note { text-align: left; color: ${C.blue}; white-space: nowrap; }
.lbls .note b { display: inline-block; width: 4.4em; color: ${C.ink}; }`;
  const html = `<div class="stage"><div class="wrap" style="zoom:${{ wide: 1.45, square: 1, tall: 1.15 }[F.k]}"><div class="row3">
  <div id="sc-w0">${key("sc-shift", `<span class="lg">⇧</span>shift`, { w: 250 })}</div>
  <div id="sc-w1">${key("sc-cmd", `<span class="lg">⌘</span>command`, { w: 260 })}</div>
  <div id="sc-w2">${key("sc-let", `<div class="slotwin"><div id="sc-slot"><div>K</div><div>T</div><div>B</div></div></div>`, { w: 140 })}
</div>
</div><div class="lbls">${LBL.map((l, i) => `<div class="note" id="sc-lb${i}" style="opacity:0"><b>⇧⌘${"KTB"[i]}</b>${l}</div>`).join("")}</div></div></div>`;
  return { css, html, js };
}

export function recovery(F, sc, at) {
  const L = (g) => g - sc.start;
  const hold = L(at("v10", "hold")), done = hold + 3.0;
  const CIRC = 2 * Math.PI * 70;
  let js = blurIn("rc-status", 0) + rise(["rc-a", "rc-ring", "rc-b"], 0.1);
  js += `tl.fromTo(["#rc-a-cap","#rc-b-cap"],{y:0},{y:9,duration:0.06,ease:"power2.in"},${f3(hold)});tl.to(["#rc-a-cap","#rc-b-cap"],{y:0,duration:0.14},${f3(done + 0.1)});`;
  js += `tl.fromTo("#rc-arc",{strokeDashoffset:${f3(CIRC)}},{strokeDashoffset:0,duration:3.0,ease:"none"},${f3(hold)});`;
  js += `tl.set("#rc-lock",{opacity:0},${f3(done)});tl.set("#rc-open",{opacity:1},${f3(done)});tl.set("#rc-arc",{stroke:"${C.green}"},${f3(done)});`;
  js += blurOut("rc-s1", done - 0.05) + blurIn("rc-s2", done + 0.08);
  js += blurIn("rc-note", hold + 0.25);
  const tall = F.k === "tall";
  const css = `.col { display: flex; flex-direction: column; align-items: center; gap: ${tall ? 90 : 64}px; }
.strip { position: relative; height: 84px; width: ${tall ? 780 : 860}px; }
.strip > div { position: absolute; inset: 0; border-radius: 22px; display: flex; align-items: center; justify-content: center; gap: 18px; font-size: 30px; }
.strip > div { white-space: nowrap; } #rc-s1 { background: #FFF5E8; border: 2px solid #F6C98A; color: #6b4a14; } #rc-s1 .sym { width: 44px; height: 30px; color: ${C.orange}; }
#rc-s2 { background: #EAF8EE; border: 2px solid #A6E3B7; color: #1f5d33; } #rc-s2 .sym { width: 34px; height: 34px; color: ${C.green}; }
.strip b { font-weight: 700; }
.krow { display: flex; align-items: center; gap: 40px; }
.ring { position: relative; width: 180px; height: 180px; }
.ring .sym { position: absolute; left: 62px; top: 58px; width: 56px; height: 62px; color: ${C.ink}; }`;
  const html = `<div class="stage"><div class="col" style="zoom:${{ wide: 1.35, square: 1, tall: 1.1 }[F.k]}">
  <div class="strip" id="rc-status"><div id="rc-s1">${sym("keyboard")}<b>Keyboard locked</b><span>· Hold both Shift keys for 3s</span></div>
    <div id="rc-s2" style="opacity:0">${sym("checkmark.circle")}<b>Inputs active</b><span>· Nothing is blocked</span></div></div>
  <div class="krow">
    <div id="rc-a">${key("rc-a", `<span class="lg">⇧</span>shift`, { w: 260 })}</div>
    <div class="ring" id="rc-ring"><svg width="180" height="180" viewBox="0 0 180 180"><circle cx="90" cy="90" r="70" fill="none" stroke="#E5E5EA" stroke-width="12"/>
      <circle id="rc-arc" cx="90" cy="90" r="70" fill="none" stroke="${C.blue}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${f3(CIRC)}" stroke-dashoffset="${f3(CIRC)}" transform="rotate(-90 90 90)"/></svg>
      <span id="rc-lock">${sym("lock.fill")}</span><span id="rc-open" style="opacity:0">${sym("lock.open.fill")}</span></div>
    <div id="rc-b">${key("rc-b", `<span class="lg">⇧</span>shift`, { w: 260 })}</div>
  </div>
  <div class="note" id="rc-note" style="opacity:0">Trackpad mode: both Option keys<br>Both mode: both Command keys</div>
</div></div>`;
  return { css, html, js };
}

export function failsafe(F, sc, at) {
  const L = (g) => g - sc.start;
  const ts = [0, 1, 2, 3].map((i) => L(at("v11", i + 4)));
  let js = blurIn("fs-top", 0.05) + rise(["fs-w0", "fs-w1", "fs-w2", "fs-w3"], 0.1, 0.06);
  ts.forEach((t, i) => { js += press(`fs-k${i}`, t, 0.12) + `tl.set("#fs-k${i}-cap",{borderColor:"${C.blue}",color:"${C.blue}"},${f3(t)});`; });
  js += blurIn("fs-note", ts[2] + 0.05);
  const narrow = F.k !== "wide";
  const css = `.col { display: flex; flex-direction: column; align-items: center; gap: 60px; } .krow { display: flex; gap: ${narrow ? 18 : 26}px; }`;
  const keys = [["esc", 140], ["esc", 140], ["return", narrow ? 220 : 240], ["return", narrow ? 220 : 240]];
  const html = `<div class="stage"><div class="col" style="zoom:${{ wide: 1.5, square: 1, tall: 1.1 }[F.k]}">
  <div class="note" id="fs-top" style="opacity:0">Works in any mode</div>
  <div class="krow">${keys.map(([l, w], i) => `<div id="fs-w${i}">${key(`fs-k${i}`, l, { w })}</div>`).join("")}</div>
  <div class="note" id="fs-note" style="opacity:0;color:${C.ink}">Quits the app. Every input comes back.</div>
</div></div>`;
  return { css, html, js };
}

const ST_ROWS = [["Show in Dock", "Keep the app icon visible in your Dock."], ["Show in Menu Bar", "Quick access from the system menu bar."],
  ["Launch at Login", "Start Chaotic Fingers automatically when you log in."]];
function settingsWin(P, dark) {
  const p = dark
    ? { bg: "#1E1E1E", grp: "#2C2C2E", line: "#3A3A3C", ink: "#F5F5F7", dim: "#98989D", seg: "#3A3A3C", trk: "#39393D" }
    : { bg: "#FFFFFF", grp: "#FFFFFF", line: C.hair, ink: C.ink, dim: "#8A8A8E", seg: C.seg, trk: "#E5E5EA" };
  return `<div class="swin" id="${P}" style="background:${p.bg};color:${p.ink}">
  <div class="tl3"><i></i><i></i><i></i></div><div class="stt">Settings</div>
  <div class="slb" style="top:52px">Appearance</div>
  <div class="grp" style="top:74px;height:48px;background:${p.grp};border-color:${p.line}">
    <div class="sseg" style="background:${p.seg}"><i class="spill" id="${P}-pill"></i>${["Light", "Dark", "System Default"].map((t, i) => `<b id="${P}-o${i}"${i === 2 ? ' style="color:#fff"' : ""}>${t}</b>`).join("")}</div></div>
  <div class="slb" style="top:144px">Visibility</div>
  <div class="grp" style="top:166px;height:141px;background:${p.grp};border-color:${p.line}">
    ${ST_ROWS.map(([t, d], i) => `<div class="srow" style="top:${i * 47}px;${i ? `border-top:1px solid ${p.line}` : ""}"><div class="sr-t">${t}</div><div class="sr-d" style="color:${p.dim}">${d}</div>
      <div class="tgl" id="${P}-t${i}" style="background:${p.trk}"><i class="knob" id="${P}-n${i}"></i></div></div>`).join("")}</div>
</div>`;
}

export function settings(F, sc, at) {
  const L = (g) => g - sc.start;
  const z = { wide: 2.1, square: 1.85, tall: 1.7 }[F.k];
  const tLight = L(at("v12", "light")), tDark = L(at("v12", "dark")), tg = [L(at("v12", "dock")), L(at("v12", "menu")), L(at("v12", "launch"))];
  const both = (sel, vars, t) => `tl.to(["#st-l${sel}","#st-d${sel}"],${vars},${f3(t)});`;
  const PW = 436 / 3;
  let js = `tl.fromTo("#st-pos",{scale:0.94,opacity:0,filter:"blur(10px)"},{scale:1,opacity:1,filter:"blur(0px)",duration:0.55,ease:"expo.out"},0);`;
  js += `tl.set("#st-l-pill",{x:${f3(PW * 2)}},0);tl.set("#st-d-pill",{x:${f3(PW * 2)}},0);`;
  [[tLight, 0, 2], [tDark, 1, 0]].forEach(([t, to, from]) => {
    js += both("-pill", `{x:${f3(PW * to)},duration:0.24,ease:"power3.inOut"}`, t - 0.1);
    js += `tl.set(["#st-l-o${from}","#st-d-o${from}"],{color:"inherit"},${f3(t)});tl.set(["#st-l-o${to}","#st-d-o${to}"],{color:"#fff"},${f3(t)});`;
  });
  js += `tl.to("#st-l",{opacity:0,duration:0.3,ease:"power2.inOut"},${f3(tDark)});tl.fromTo("#st-d",{opacity:0},{opacity:1,duration:0.3,ease:"power2.inOut"},${f3(tDark)});`;
  tg.forEach((t, i) => {
    js += both(`-n${i}`, `{x:22,duration:0.18,ease:"power3.out"}`, t);
    js += both(`-t${i}`, `{backgroundColor:"${C.blue}",duration:0.15,ease:"power2.out"}`, t);
  });
  const css = `.swin { position: absolute; left: 0; top: 0; width: 500px; height: 330px; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 50px rgba(0,0,0,.2), 0 0 0 .6px rgba(0,0,0,.12); }
.stt { position: absolute; top: 11px; width: 100%; text-align: center; font-weight: 700; font-size: 13px; }
.slb { position: absolute; left: 20px; font-weight: 700; font-size: 12.5px; }
.grp { position: absolute; left: 20px; width: 460px; border: 1px solid; border-radius: 9px; }
.sseg { position: absolute; left: 12px; top: 12px; width: 436px; height: 24px; border-radius: 6px; display: flex; }
.sseg b { flex: 1; display: flex; align-items: center; justify-content: center; font-weight: 400; font-size: 12.5px; position: relative; z-index: 1; }
.spill { position: absolute; left: 0; top: 0; width: ${f3(PW)}px; height: 24px; border-radius: 6px; background: #3375F0; }
.srow { position: absolute; left: 12px; right: 12px; height: 47px; } .sr-t { position: absolute; top: 9px; font-size: 12.5px; } .sr-d { position: absolute; top: 26px; font-size: 9.6px; }
.tgl { position: absolute; right: 0; top: 13px; width: 44px; height: 22px; border-radius: 11px; } .knob { position: absolute; left: 2px; top: 2px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.3); }`;
  const html = `<div class="stage"><div id="st-pos" style="zoom:${z};position:relative;width:500px;height:330px">${settingsWin("st-l", false)}${settingsWin("st-d", true).replace('class="swin"', 'class="swin" style0')}</div></div>`
    .replace('style0 id="st-d" style="', 'id="st-d" style="opacity:0;');
  return { css, html, js };
}

export function privacy(F, sc, at) {
  const L = (g) => g - sc.start;
  const g = geo(F);
  const KEYS = ["Q", "W", "E", "R"];
  const ky = g.sy + g.sh - 150, kx0 = g.cx - (4 * 140 + 3 * 24) / 2, ny = g.sy + g.sh * 0.46;
  const line = "Input events are discarded, not inspected.";
  let js = wordsIn("pv", line.split(" ").length, 0.15) + rise(KEYS.map((_, i) => `pv-kw${i}`), 0.05, 0.05);
  js += blurIn("pv-no", 0.3);
  let letters = "", n = 0;
  for (let t = 0.6; t < sc.dur - 0.6; t += 0.21, n++) {
    const i = n % 4, x0 = kx0 + i * 164 + 70;
    js += press(`pv-k${i}`, t, 0.04);
    js += `tl.fromTo("#pv-l${n}",{x:0,y:0,opacity:1,scale:1,filter:"blur(0px)"},{opacity:1,x:${f3(g.cx - x0)},y:${f3(ny - ky + 40)},scale:0.5,duration:0.42,ease:"power2.in",immediateRender:false},${f3(t + 0.04)});`;
    js += `tl.to("#pv-l${n}",{opacity:0,filter:"blur(6px)",duration:0.08},${f3(t + 0.47)});`;
    letters += `<span class="ltr" data-layout-ignore id="pv-l${n}" style="left:${x0 - 20}px;top:${ky - 50}px;opacity:0">${KEYS[i]}</span>`;
  }
  const css = `.ltr { position: absolute; width: 40px; text-align: center; font-weight: 700; font-size: 46px; }
#pv-title { position: absolute; left: ${g.sx}px; width: ${g.sw}px; top: ${g.sy + (F.k === "tall" ? 60 : 10)}px; font-size: ${Math.round(F.title * 0.62)}px; }
#pv-no { position: absolute; left: ${g.cx - 120}px; top: ${ny - 120}px; width: 240px; height: 240px; color: ${C.dim}; }`;
  const html = `<div class="title" id="pv-title">${words("pv", line)}</div>${sym("nosign", "", "")}
${KEYS.map((k, i) => `<div id="pv-kw${i}" style="position:absolute;left:${kx0 + i * 164}px;top:${ky}px">${key(`pv-k${i}`, k)}</div>`).join("")}${letters}`
    .replace('<i class="sym "', '<i id="pv-no" class="sym "');
  return { css, html, js };
}

// Fingertips sit 20% down the hand photo; they land on the middle of the keys.
const PAY = {
  wide: { dx: 96, dy: 170, dw: 780, dh: 360, nk: 4, kw: 140, gap: 20, kx0: 1060, ky: 400, hh: 860 },
  square: { dx: 90, dy: 56, dw: 900, dh: 260, nk: 6, kw: 120, gap: 16, kx0: 132, ky: 400, hh: 760 },
  tall: { dx: 96, dy: 260, dw: 864, dh: 380, nk: 6, kw: 120, gap: 16, kx0: 120, ky: 770, hh: 1000 },
};
export function payoff(F, sc, at) {
  const L = (g) => g - sc.start;
  const P = PAY[F.k];
  const KEYS = ["J", "K", "L", ";", "H", "G"].slice(0, P.nk), rowW = P.nk * P.kw + (P.nk - 1) * P.gap;
  const hw = P.hh * (1050 / 1400), hx = P.kx0 + rowW / 2 - hw / 2, hy = P.ky + 70 - 0.2 * P.hh;
  let js = `tl.fromTo("#py-draft",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.2,ease:"power2.out"},0);`;
  js += rise(KEYS.map((_, i) => `py-kw${i}`), 0.05, 0.04);
  js += `tl.fromTo("#py-hand",{y:${f3(F.h - hy + 40)},rotation:6},{y:0,rotation:-4,duration:0.75,ease:"expo.out"},${f3(L(at("v14", "let")) - 0.3)});`;
  const pats = [0, 1, 2, 3, 4, 5].map((i) => L(at("v14", "play")) + i * 0.42);
  pats.forEach((t, i) => {
    js += `tl.to("#py-hand",{y:26,duration:0.1,ease:"power2.in"},${f3(t)});tl.to("#py-hand",{y:0,duration:0.2,ease:"power2.out"},${f3(t + 0.1)});`;
    [i % P.nk, (i + 1) % P.nk].forEach((k) => { js += press(`py-k${k}`, t + 0.08, 0.06); });
  });
  for (let t = 0.5; t < sc.dur; t += 1.0) js += `tl.set("#py-caret",{opacity:0},${f3(t)});tl.set("#py-caret",{opacity:1},${f3(t + 0.5)});`;
  const fs = F.k === "tall" ? 36 : 31;
  const css = `.mwin { position: absolute; } .body { padding: 24px 30px; font-size: ${fs}px; line-height: 1.45; }
.caret { display: inline-block; width: 3px; height: 1.1em; background: ${C.blue}; vertical-align: -0.18em; margin-left: 2px; }
#py-hand { position: absolute; left: ${f3(hx)}px; top: ${f3(hy)}px; width: ${f3(hw)}px; height: ${P.hh}px; z-index: 10; filter: drop-shadow(0 30px 40px rgba(0,0,0,.25)); transform-origin: 50% 100%; }`;
  const html = `<div class="fill" style="background:url('assets/img/both_bg.png') center/700px;opacity:.07"></div>
<div class="mwin" id="py-draft" style="left:${P.dx}px;top:${P.dy}px;width:${P.dw}px;height:${P.dh}px">
  <div class="mbar"><div class="tl3"><i></i><i></i><i></i></div>Q4 plan — Draft</div>
  <div class="body">Hi team — the Q4 plan is attached. Can we review it Thursday before the launch?<i class="caret" id="py-caret"></i></div></div>
${KEYS.map((k, i) => `<div id="py-kw${i}" style="position:absolute;left:${P.kx0 + i * (P.kw + P.gap)}px;top:${P.ky}px">${key(`py-k${i}`, k, { w: P.kw })}</div>`).join("")}
<img id="py-hand" src="assets/img/hand.png" alt="">`;
  return { css, html, js };
}

export function claim(F, sc, at) {
  const L = (g) => g - sc.start;
  const ts = ["screen", "on", "inputs", "off"].map((w) => L(at("v15", w)));
  const size = { wide: 132, square: 128, tall: 136 }[F.k];
  const br = F.k === "wide" ? " " : "<br>";
  let js = "";
  ts.forEach((t, i) => { js += `tl.fromTo("#cl-w${i}",{opacity:0,filter:"blur(6px)"},{opacity:1,filter:"blur(0px)",duration:0.13,ease:"power2.out"},${f3(t)});`; });
  const w = (i, s, acc) => `<span class="w" id="cl-w${i}" style="opacity:0${acc ? `;color:${C.blue}` : ""}">${s}</span>`;
  const css = `.title { font-size: ${size}px; }`;
  const html = `<div class="fill" style="background:url('assets/img/both_bg.png') center/700px;opacity:.07"></div>
<div class="stage"><div class="title">${w(0, "Screen")} ${w(1, "on.")}${br}${w(2, "Inputs", 1)} ${w(3, "off.", 1)}</div></div>`;
  return { css, html, js };
}

export function endcard(F, sc, at) {
  const L = (g) => g - sc.start;
  const g = geo(F), wide = F.k === "wide";
  const icon = wide ? 210 : 230, wm = wide ? 92 : 84;
  const handH = { wide: 640, square: 560, tall: 760 }[F.k], handW = handH * (1050 / 1400);
  // lockup: icon beside the wordmark (wide) or above it (square/tall)
  const lockW = wide ? icon + 40 + 15 * wm * 0.56 : 0;
  const ix = wide ? g.cx - lockW / 2 : g.cx - icon / 2;
  const iy = wide ? g.cy - icon / 2 - 90 : g.cy - icon - (F.k === "tall" ? 120 : 110);
  const tMark = L(at("v16", "chaotic")), tName = L(at("v16", "fingers")) - 0.2, tFree = L(at("v16", "free"));
  const NAME = "Chaotic Fingers";
  let js = `tl.fromTo("#ec-hand",{y:${F.h * 0.6},opacity:1},{y:0,duration:0.65,ease:"expo.out"},0);`;
  js += `tl.to("#ec-hand",{x:${f3(ix + icon / 2 - g.cx)},y:${f3(iy + icon / 2 - (g.cy + 20))},scale:${f3((icon * 0.62) / handH)},duration:0.55,ease:"power3.inOut"},${f3(tMark)});`;
  js += `tl.fromTo("#ec-tile",{opacity:0,scale:0.2},{opacity:1,scale:1,duration:0.5,ease:"expo.out"},${f3(tMark + 0.15)});`;
  js += `tl.fromTo("#ec-icon",{opacity:0},{opacity:1,duration:0.2,ease:"power2.out"},${f3(tMark + 0.4)});`;
  js += `tl.to("#ec-hand",{opacity:0,duration:0.12},${f3(tMark + 0.5)});`;
  NAME.split("").forEach((_, i) => { js += `tl.fromTo("#ec-c${i}",{opacity:0.15,filter:"blur(4px)"},{opacity:1,filter:"blur(0px)",duration:0.16,ease:"power2.out",immediateRender:false},${f3(tName + i * 0.035)});`; });
  js += blurIn("ec-free", tFree) + `tl.fromTo("#ec-cta",{opacity:0,y:16},{opacity:1,y:0,duration:0.5,ease:"expo.out"},${f3(tFree + 0.3)});`;
  const css = `#ec-hand { position: absolute; left: ${f3(g.cx - handW / 2)}px; top: ${f3(g.cy + 20 - handH / 2)}px; width: ${f3(handW)}px; height: ${handH}px; filter: drop-shadow(0 30px 40px rgba(0,0,0,.2)); }
#ec-tile { position: absolute; left: ${f3(ix)}px; top: ${f3(iy)}px; width: ${icon}px; height: ${icon}px; }
#ec-icon { position: absolute; left: ${f3(icon * 0.11)}px; top: ${f3(icon * 0.11)}px; width: ${f3(icon * 0.78)}px; height: ${f3(icon * 0.78)}px; }
#ec-name { position: absolute; font-weight: 900; font-size: ${wm}px; letter-spacing: -0.03em; white-space: nowrap; ${wide ? `left:${f3(ix + icon + 40)}px;top:${f3(iy + icon / 2 - wm * 0.62)}px;` : `left:0;width:100%;text-align:center;top:${f3(iy + icon + 40)}px;`} }
#ec-name span { display: inline-block; white-space: pre; }
.cta { position: absolute; left: 0; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 26px; top: ${f3(wide ? iy + icon + 70 : iy + icon + 40 + wm * 1.3 + 50)}px; }
#ec-free { font-weight: 700; font-size: ${wide ? 40 : 38}px; }
#ec-cta { background: ${C.blue}; color: #fff; font-weight: 700; font-size: ${wide ? 34 : 30}px; padding: 20px 40px; border-radius: 999px; box-shadow: 0 14px 30px rgba(52,120,246,.28); }`;
  const html = `<div class="fill" style="background:url('assets/img/keyboard_bg.png') center/700px;opacity:.07"></div>
<div class="tile" id="ec-tile" style="opacity:0"><img id="ec-icon" src="assets/img/app-icon.png" alt="" style="opacity:0"></div><img id="ec-hand" src="assets/img/hand.png" alt="">
<div id="ec-name">${NAME.split("").map((c, i) => `<span id="ec-c${i}" style="opacity:0">${c}</span>`).join("")}</div>
<div class="cta"><div id="ec-free" style="opacity:0">Free for macOS 14+</div><div id="ec-cta" style="opacity:0">github.com/1mrajeevranjan/Chaotic-Fingers</div></div>`;
  return { css, html, js };
}

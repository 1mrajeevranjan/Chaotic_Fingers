// Scenes 1-5: the chaos, the click, the modes, keys vanishing, the menu bar.
// Each returns { css, html, js } in scene-local time; build.mjs wraps and places it.
import { C, MODES, sym, cursor, dashboard, key, press } from "./ui.mjs";

const f3 = (n) => (+n).toFixed(3);

// Deterministic toddler-mash: runs of home-row keys.
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const MASH = "jjkkll;;hhggffddssaa'',,nnmmuuiiyy";
function junk(len, seed) {
  const r = rng(seed); let s = "";
  while (s.length < len) { const c = MASH[Math.floor(r() * MASH.length)]; s += c.repeat(2 + Math.floor(r() * 7)); if (r() < 0.12) s += " "; }
  return s.slice(0, len);
}

const geo = (F) => {
  const [sx, sy, sw, sh] = F.stage;
  return { sx, sy, sw, sh, cx: sx + sw / 2, cy: sy + sh / 2, keysY: sy + sh - 150 };
};
const Z_REVEAL = { wide: 1.6, square: 1.55, tall: 1.8 };

export function chaos(F, sc, at) {
  const L = (g) => g - sc.start;
  const { sx, sw, sh, sy, cx, keysY } = geo(F);
  const tall = F.k === "tall";
  const ww = Math.min(1040, sw), wh = tall ? 600 : 470;
  const wx = cx - ww / 2, wy = sy + Math.max(0, (sh - 150 - 50 - wh) / 2);
  const KEYS = ["J", "K", "L", ";", "H", "G"], kw = 120, gap = 16;
  const rowW = KEYS.length * kw + (KEYS.length - 1) * gap, kx0 = cx - rowW / 2;
  const J = junk(900, 7);
  const r = rng(11);
  let js = "";
  const c0 = L(at("v03", "wiping")), c1 = c0 + 1.35;
  // the mash: presses until the keys leave for the space bar; the cloth does its own
  const last = KEYS.map(() => -1);
  for (let t = 0.05; t < 7.25; t += 0.07 + r() * 0.09) {
    const k = Math.floor(r() * KEYS.length);
    if (t - last[k] < 0.26 || (t > c0 - 0.3 && t < c1 + 0.3)) continue;
    last[k] = t;
    js += press(`ch-k${k}`, t, 0.03);
  }
  // the cloth wipes across and presses each key it passes
  const cs = c0 - 0.15, cd = c1 - c0 + 0.3, travel = F.w + 380;
  KEYS.forEach((_, i) => { const p = (kx0 + i * (kw + gap) + kw / 2 + 190) / travel; js += press(`ch-k${i}`, cs + p * cd, 0.12); });
  // five windows pop on "opens … apps"
  const wins = ["Downloads", "Untitled 3", "Budget.xlsx", "Q4 plan (copy)", "Screenshot 2026-11-18"];
  const pw = tall ? 540 : 460, ph = tall ? 320 : 270;
  const popT0 = L(at("v03", "opens")), popT1 = L(at("v03", "apps"));
  const popHtml = wins.map((t, i) => {
    const x = wx + 30 + i * ((ww - pw - 60) / 4), y = wy + 10 + i * ((wh - ph - 20) / 4) + (i % 2 ? 18 : 0);
    return `<div class="mwin pop" id="ch-p${i}" style="left:${x}px;top:${y}px;width:${pw}px;height:${ph}px;opacity:0">
      <div class="mbar"><div class="tl3"><i></i><i></i><i></i></div>${sym(i ? "doc.text" : "folder", "", "width:20px;height:18px;color:#8a8a8e;margin-right:8px")}${t}</div>
      ${[0.82, 0.64, 0.9, 0.5].map((w, j) => `<div class="ln" style="width:${w * 100 - 10}%;top:${66 + j * 38}px"></div>`).join("")}</div>`;
  }).join("");
  wins.forEach((_, i) => {
    const t = popT0 + (i * (popT1 - popT0)) / 4;
    js += `tl.fromTo("#ch-p${i}",{opacity:0,scale:0.8},{opacity:1,scale:1,duration:0.32,ease:"back.out(1.6)"},${f3(t)});`;
    js += `tl.to("#ch-p${i}",{opacity:0,scale:0.92,duration:0.2,ease:"power3.in"},${f3(L(at("v04", "and")) - 0.25 + i * 0.03)});`;
  });
  // space bar for the cat; caret racing through an empty document
  const sbT = L(at("v04", "and")) + 0.1, spaceT = L(at("v04", "space"));
  KEYS.forEach((_, i) => { js += `tl.to("#ch-k${i}",{y:60,opacity:0,duration:0.25,ease:"power3.in"},${f3(sbT - 0.3 + i * 0.03)});`; });
  js += `tl.fromTo("#ch-space",{y:70,opacity:0},{y:0,opacity:1,duration:0.55,ease:"expo.out"},${f3(sbT)});`;
  js += `tl.fromTo("#ch-space-cap",{y:0},{y:9,duration:0.06,ease:"power2.in"},${f3(spaceT)});`;
  js += `tl.fromTo("#ch-doc",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.2,ease:"power2.out"},${f3(sbT + 0.05)});`;
  const lines = 7, lineH = tall ? 64 : 52, caretW = ww - 120;
  for (let i = 0; i < lines; i++) {
    const t = spaceT + 0.05 + i * ((sc.dur - spaceT - 0.1) / lines);
    js += `tl.set("#ch-caret",{y:${i * lineH},x:0},${f3(t)});tl.to("#ch-caret",{x:${caretW},duration:${f3((sc.dur - spaceT - 0.1) / lines - 0.02)},ease:"none"},${f3(t)});`;
  }
  // the draft floods, then goes out on "out"
  js += `const J=${JSON.stringify(J)},el=document.getElementById("ch-junk"),o={n:44};
tl.fromTo(o,{n:44},{n:420,duration:${f3(L(at("v02", "out")))},ease:"none",onUpdate(){el.textContent=J.slice(0,Math.round(o.n));}},0);`;
  js += `tl.to("#ch-draft",{y:${-(wy + wh + 80)},scale:0.7,rotation:-3,duration:0.4,ease:"power3.in"},${f3(L(at("v02", "out")) - 0.08)});`;

  const css = `
#root { background: ${C.desk}; }
.mwin { position: absolute; }
.fld { padding: 14px 28px; border-bottom: 1px solid ${C.hair}; font-size: 24px; color: ${C.dim}; } .fld b { color: ${C.ink}; font-weight: 400; }
.body { padding: 22px 28px; font-size: ${tall ? 34 : 29}px; line-height: 1.45; overflow: hidden; word-break: break-all; height: ${wh - 40 - 2 * 56}px; }
.junk { color: ${C.ink}; }
.caret { display: inline-block; width: 3px; height: 1.1em; background: ${C.blue}; vertical-align: -0.18em; margin-left: 2px; }
.pop .ln { position: absolute; left: 30px; height: 16px; border-radius: 8px; background: #ECECEE; }
.cloth { position: absolute; width: 300px; height: 200px; border-radius: 70px 90px 60px 100px; background: #8DB7D9 repeating-linear-gradient(35deg, rgba(255,255,255,.18) 0 3px, transparent 3px 7px); box-shadow: 0 30px 40px rgba(0,0,0,.18); }
#ch-doc .dl { position: absolute; left: 40px; right: 40px; height: 2px; background: #F0F0F2; }`;
  const html = `
<div class="mwin" id="ch-draft" style="left:${wx}px;top:${wy}px;width:${ww}px;height:${wh}px">
  <div class="mbar"><div class="tl3"><i></i><i></i><i></i></div>Q4 plan — Draft</div>
  <div class="fld">To: <b>team@company.com</b></div><div class="fld">Subject: <b>Q4 plan</b></div>
  <div class="body">Hi team — the Q4 plan is attached. Can we review it Thursday before the <span class="junk" id="ch-junk">${J.slice(0, 44)}</span><i class="caret"></i></div>
</div>
${popHtml}
<div class="mwin" id="ch-doc" style="left:${wx}px;top:${wy}px;width:${ww}px;height:${wh}px;opacity:0">
  <div class="mbar"><div class="tl3"><i></i><i></i><i></i></div>Untitled 4</div>
  <div style="position:absolute;left:40px;top:${tall ? 80 : 70}px;font-size:${tall ? 34 : 29}px">Notes for Thursday</div>
  ${Array.from({ length: lines }, (_, i) => `<div class="dl" style="top:${(tall ? 160 : 140) + i * lineH}px"></div>`).join("")}
  <i class="caret" id="ch-caret" style="position:absolute;left:40px;top:${(tall ? 122 : 106)}px;height:${tall ? 40 : 34}px"></i>
</div>
${KEYS.map((k, i) => `<div style="position:absolute;left:${kx0 + i * (kw + gap)}px;top:${keysY}px">${key(`ch-k${i}`, k, { w: kw })}</div>`).join("")}
<div id="ch-space" style="position:absolute;left:${cx - 380}px;top:${keysY}px;opacity:0">${key("ch-space", "", { w: 760 })}</div>
<div class="cloth" id="ch-cloth" style="left:-340px;top:${keysY - 40}px"></div>`;
  js += `tl.fromTo("#ch-cloth",{x:0,rotation:-8},{x:${travel},rotation:4,duration:${f3(cd)},ease:"none"},${f3(cs)});`;
  return { css, html, js };
}

export function reveal(F, sc, at) {
  const L = (g) => g - sc.start;
  const { sy, sh, cx, keysY } = geo(F);
  const z = Z_REVEAL[F.k], W = 480 * z;
  const wx = cx - W / 2, wy = sy + (sh - W) / 2;
  const bx = wx + 20 * z, by = wy + 432 * z, bw = 440 * z, bh = 28 * z;
  const sbx = cx - 380, sby = keysY, sbw = 760, sbh = 140;
  const click = L(at("v05", "click"));
  const curX = bx + bw * 0.62, curY = by + bh * 0.55;
  const js = `
tl.fromTo("#rv-flood",{opacity:1},{opacity:0,duration:0.4,ease:"power2.inOut"},0);
tl.fromTo("#rv-proxy",{x:${f3(sbx + sbw / 2 - (bx + bw / 2))},y:${f3(sby + sbh / 2 - (by + bh / 2))},scaleX:${f3(sbw / bw)},scaleY:${f3(sbh / bh)},backgroundColor:"#F2F2F4",filter:"blur(0px)"},
  {x:0,y:0,scaleX:1,scaleY:1,backgroundColor:"${C.blue}",duration:0.5,ease:"power3.inOut"},0.02);
tl.fromTo("#rv-proxy",{filter:"blur(0px)"},{filter:"blur(4px)",duration:0.25,ease:"power2.in",yoyo:true,repeat:1},0.02);
tl.fromTo("#rv-pos",{scale:0.88,opacity:0,filter:"blur(10px)"},{scale:1,opacity:1,filter:"blur(0px)",duration:0.7,ease:"expo.out"},0.3);
tl.to("#rv-proxy",{opacity:0,duration:0.1},0.95);
tl.fromTo("#rv-cur",{x:${F.w + 60},y:${f3(Math.min(F.h, curY + 420))}},{x:${f3(curX)},y:${f3(curY)},duration:0.6,ease:"expo.out"},${f3(click - 0.75)});
tl.fromTo("#rv-cur",{scale:1},{scale:0.88,duration:0.06,ease:"power2.in",yoyo:true,repeat:1,transformOrigin:"0 0"},${f3(click - 0.04)});
tl.fromTo("#rv-btn",{scale:1},{scale:0.97,duration:0.06,yoyo:true,repeat:1},${f3(click - 0.02)});
tl.set("#rv-btn",{backgroundColor:"${C.red}"},${f3(click)});
tl.set("#rv-start",{opacity:0},${f3(click)});tl.set("#rv-stop",{opacity:1},${f3(click)});
tl.set("#rv-status",{opacity:1},${f3(click)});tl.set("#rv-seg",{opacity:0.45},${f3(click)});`;
  const css = `#rv-flood { background: ${C.desk}; } #rv-proxy { position: absolute; left: ${bx}px; top: ${by}px; width: ${bw}px; height: ${bh}px; border-radius: ${14 * z}px; z-index: 5; }`;
  const html = `<div class="fill" id="rv-flood"></div>
<div id="rv-pos" style="position:absolute;left:${wx}px;top:${wy}px;transform-origin:50% 92%">${dashboard("rv", { z })}</div>
<div id="rv-proxy"></div>${cursor("rv-cur")}`;
  return { css, html, js };
}

export function modes(F, sc, at) {
  const L = (g) => g - sc.start;
  const z = { wide: 2.5, square: 2.05, tall: 1.78 }[F.k];
  const ks = ["keyboard", "trackpad", "both"];
  const times = [L(at("v06", "keyboard")), L(at("v06", "trackpad")), L(at("v06", "both"))];
  let js = `tl.fromTo("#md-iso",{scale:0.92,opacity:0,filter:"blur(8px)"},{scale:1,opacity:1,filter:"blur(0px)",duration:0.5,ease:"expo.out"},0);`;
  for (let i = 1; i < 3; i++) {
    const t = times[i];
    js += `tl.to("#md-pill",{x:${f3(146.7 * i)},duration:0.24,ease:"power3.inOut"},${f3(t - 0.12)});`;
    js += `tl.set("#md-s${i - 1}",{color:"${C.ink}"},${f3(t)});tl.set("#md-s${i}",{color:"#fff"},${f3(t)});`;
    js += `tl.to("#md-lay-${ks[i - 1]}",{opacity:0,filter:"blur(6px)",duration:0.13,ease:"power2.in"},${f3(t - 0.05)});`;
    js += `tl.fromTo("#md-lay-${ks[i]}",{opacity:0,filter:"blur(6px)"},{opacity:1,filter:"blur(0px)",duration:0.13,ease:"power2.out"},${f3(t + 0.08)});`;
    js += `tl.to("#md-bg-${ks[i - 1]}",{opacity:0,duration:0.3,ease:"power2.inOut"},${f3(t - 0.05)});tl.to("#md-bg-${ks[i]}",{opacity:0.5,duration:0.3,ease:"power2.inOut"},${f3(t - 0.05)});`;
  }
  // the seg and card alone, lifted out of the real window
  const dash = dashboard("md", { modes: ks, z });
  const iso = dash.replace(/<div class="dwin"[^>]*>[\s\S]*?(<div class="seg")/, `<div class="dwin iso" id="md-win">$1`)
    .replace(/<div class="status"[\s\S]*$/, "</div></div>");
  const css = `.iso { height: 196px !important; background: transparent !important; box-shadow: none !important; overflow: visible !important; }
.iso .seg { top: 6px; } .iso .card { top: 50px; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
.mbg { position: absolute; inset: 0; background-size: 560px; background-position: center; }`;
  const html = `${ks.map((k, i) => `<div class="mbg" id="md-bg-${k}" style="background-image:url('assets/img/${MODES[k].bg}.png');opacity:${i ? 0 : 0.5}"></div>`).join("")}
<div class="stage"><div id="md-iso">${iso}</div></div>`;
  return { css, html, js };
}

const LAYOUT_VANISH = {
  wide: (g) => ({ z: 1.45, dx: g.sx + 70, dy: g.cy - 348, kx: g.sx + g.sw - 70 - 620, ky: g.cy - 30 }),
  square: (g) => ({ z: 1.22, dx: g.cx - 293, dy: g.sy, kx: g.cx - 310, ky: g.sy + 586 + 50 }),
  tall: (g) => ({ z: 1.4, dx: g.cx - 336, dy: g.sy + 10, kx: g.cx - 310, ky: g.sy + 672 + 60 }),
};

export function vanish(F, sc, at) {
  const L = (g) => g - sc.start;
  const g = geo(F), Lv = LAYOUT_VANISH[F.k](g), z = Lv.z;
  const KEYS = ["A", "S", "D", "F"];
  const r = rng(23);
  let js = `tl.fromTo("#vn-pos",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.18,ease:"power2.out"},0);`;
  js += KEYS.map((_, i) => `tl.fromTo("#vn-kw${i}",{y:50,opacity:0},{y:0,opacity:1,duration:0.5,ease:"expo.out"},${f3(0.05 + i * 0.06)});`).join("");
  let letters = "";
  const end = L(at("v07", "the")) + 0.2;
  let n = 0;
  const last = [-1, -1, -1, -1];
  for (let t = 0.45; t < end; t += 0.11 + r() * 0.08, n++) {
    let i = Math.floor(r() * 4);
    if (t - last[i] < 0.26) i = (i + 1) % 4;
    if (t - last[i] < 0.26) i = (i + 1) % 4;
    last[i] = t;
    js += press(`vn-k${i}`, t, 0.03);
    js += `tl.fromTo("#vn-l${n}",{y:0,opacity:1,filter:"blur(0px)"},{y:-120,opacity:0,filter:"blur(8px)",duration:0.5,ease:"power2.out",immediateRender:false},${f3(t + 0.04)});`;
    letters += `<span class="ltr" data-layout-ignore id="vn-l${n}" style="left:${Lv.kx + i * 160 + 70 - 18}px;top:${Lv.ky - 40}px;opacity:0">${KEYS[i].toLowerCase()}</span>`;
  }
  const bx = Lv.dx + 20 * z, by = Lv.dy + 432 * z, bw = 440 * z, bh = 28 * z;
  const stopT = L(at("v07", "stop"));
  js += `tl.fromTo("#vn-cur",{x:${F.w + 60},y:${f3(by - 180)}},{x:${f3(Lv.dx + 300 * z)},y:${f3(Lv.dy + 300 * z)},duration:0.6,ease:"expo.out"},${f3(L(at("v07", "pointer")))});`;
  js += `tl.to("#vn-cur",{x:${f3(bx + bw * 0.4)},y:${f3(by + bh * 0.55)},duration:0.55,ease:"power2.inOut"},${f3(stopT - 0.62)});`;
  js += `tl.fromTo("#vn-cur",{scale:1},{scale:0.88,duration:0.06,ease:"power2.in",yoyo:true,repeat:1,transformOrigin:"0 0"},${f3(stopT - 0.04)});`;
  js += `tl.set("#vn-btn",{backgroundColor:"${C.blue}"},${f3(stopT)});tl.set("#vn-stop",{opacity:0},${f3(stopT)});tl.set("#vn-start",{opacity:1},${f3(stopT)});`;
  js += `tl.set("#vn-status",{opacity:0},${f3(stopT)});tl.set("#vn-seg",{opacity:1},${f3(stopT)});`;
  const dash = dashboard("vn", { z }).replace('id="vn-status" style="opacity:0"', 'id="vn-status" style="opacity:1"')
    .replace('class="seg" id="vn-seg"', 'class="seg" id="vn-seg" style="opacity:.45"')
    .replace('class="btn" id="vn-btn"', `class="btn" id="vn-btn" style="background:${C.red}"`)
    .replace('id="vn-start">', 'id="vn-start" style="opacity:0">').replace('id="vn-stop" style="opacity:0"', 'id="vn-stop"');
  const css = `.ltr { position: absolute; font-weight: 700; font-size: 44px; color: ${C.ink}; width: 36px; text-align: center; }`;
  const html = `<div id="vn-pos" style="position:absolute;left:${Lv.dx}px;top:${Lv.dy}px">${dash}</div>
${KEYS.map((k, i) => `<div id="vn-kw${i}" style="position:absolute;left:${Lv.kx + i * 160}px;top:${Lv.ky}px">${key(`vn-k${i}`, k)}</div>`).join("")}
${letters}${cursor("vn-cur")}`;
  return { css, html, js };
}

export function menubar(F, sc, at) {
  const L = (g) => g - sc.start;
  const g = geo(F);
  const tall = F.k === "tall";
  const barY = tall ? g.sy : 0, barH = 64;
  const iconX = F.w - (F.k === "wide" ? 360 : 330), icx = iconX + 20, icy = barY + 32;
  const s = { wide: 1.8, square: 1.6, tall: 1.9 }[F.k], tx = F.w / 2, ty = { wide: 280, square: 260, tall: 520 }[F.k];
  const z = 1.2, W = 480 * z, dx = g.cx - W / 2, dy = g.cy - W / 2 + (tall ? 0 : 30);
  const clickT = L(at("v08", "click")), menuT = L(at("v08", "mode")) + 0.2, winT = L(at("v08", "window"));
  const items = [["macwindow", "Dashboard"], ["gearshape", "Settings…"], ["ellipsis.circle", "More"], ["power", "Quit Chaotic Fingers"]];
  const js = `
tl.fromTo("#mb-pos",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.15,ease:"power2.out"},0);
tl.fromTo("#mb-bar",{y:${-barH - 20}},{y:0,duration:0.5,ease:"expo.out"},0.25);
tl.to("#mb-pos",{x:${f3(tx - (dx + W / 2))},y:${f3(ty - (dy + W / 2))},scale:0.04,duration:0.45,ease:"power3.in"},${f3(winT - 0.05)});
tl.to("#mb-pos",{opacity:0,duration:0.08},${f3(winT + 0.38)});
tl.fromTo("#mb-cam",{x:0,y:0,scale:1},{x:${f3(tx - icx)},y:${f3(ty - icy)},scale:${s},duration:0.55,ease:"power2.inOut"},${f3(winT)});
tl.fromTo("#mb-cur",{x:${F.w + 60},y:${ty + 300}},{x:${f3(tx - 6)},y:${f3(ty - 4)},duration:0.55,ease:"expo.out"},${f3(clickT - 0.6)});
tl.fromTo("#mb-cur",{scale:1},{scale:0.88,duration:0.06,ease:"power2.in",yoyo:true,repeat:1,transformOrigin:"0 0"},${f3(clickT - 0.04)});
tl.set("#mb-off",{opacity:0},${f3(clickT)});tl.set("#mb-on",{opacity:1},${f3(clickT)});
tl.fromTo("#mb-note",{opacity:0,filter:"blur(8px)"},{opacity:1,filter:"blur(0px)",duration:0.18,ease:"power2.out"},${f3(L(at("v08", "locks")))});
tl.to("#mb-note",{opacity:0,filter:"blur(6px)",duration:0.15,ease:"power2.in"},${f3(menuT - 0.2)});
tl.fromTo("#mb-menu",{opacity:0,scale:0.96},{opacity:1,scale:1,duration:0.14,ease:"expo.out"},${f3(menuT)});`;
  const css = `#root { background: ${C.desk}; }
#mb-bezel { position: absolute; left: -3000px; width: ${F.w + 6000}px; top: ${barY - 3000}px; height: 3000px; background: #0E0E10; }
#mb-bar { position: absolute; left: -3000px; top: ${barY}px; width: ${F.w + 6000}px; height: ${barH}px; background: rgba(255,255,255,.82); box-shadow: 0 1px 0 rgba(0,0,0,.08); }
.clock { position: absolute; left: ${iconX + 3000 + 70}px; top: 0; height: ${barH}px; display: flex; align-items: center; font-weight: 700; font-size: 26px; }
.mbi { position: absolute; left: ${iconX + 3000}px; top: 12px; width: 40px; height: 40px; color: ${C.ink}; }
#mb-note { position: absolute; left: 0; width: 100%; top: ${f3(ty + 70 * s + 30)}px; }
#mb-menu { position: absolute; left: ${icx - 220}px; top: ${barY + barH + 8}px; width: 440px; padding: 10px; border-radius: 22px; background: rgba(250,250,250,.96); box-shadow: 0 24px 60px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.08); transform-origin: 50% 0; }
.mi { display: flex; align-items: center; gap: 18px; height: 56px; padding: 0 18px; font-size: 26px; border-radius: 12px; } .mi .sym { width: 28px; height: 28px; color: #3a3a3c; }
.msep { height: 1px; background: rgba(0,0,0,.1); margin: 6px 14px; }`;
  const html = `<div class="fill" id="mb-cam" style="transform-origin:${icx}px ${icy}px">
<div id="mb-bezel"></div>
<div id="mb-bar"><span id="mb-off" style="position:absolute;left:0;top:0">${sym("hand.raised", "mbi", "")}</span>
  <span id="mb-on" style="opacity:0;position:absolute;left:0;top:0">${sym("hand.raised.fill", "mbi", "")}</span>
  <div class="clock">Tue 18 Nov 9:41</div></div>
<div id="mb-menu" style="opacity:0">${items.map(([s, t], i) => `${i === 2 || i === 3 ? '<div class="msep"></div>' : ""}<div class="mi">${sym(s)}${t}</div>`).join("")}</div>
</div>
<div class="note" id="mb-note" style="opacity:0">Default mode: <span style="color:${C.ink}">Keyboard</span></div>
<div id="mb-pos" style="position:absolute;left:${dx}px;top:${dy}px">${dashboard("mb", { z })}</div>${cursor("mb-cur")}`;
  return { css, html, js };
}

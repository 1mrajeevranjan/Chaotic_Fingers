// Writes the film three times — 16:9 here, 9:16 and 1:1 as sibling projects —
// from one schedule and one set of scenes.   node src/build.mjs
import { writeFileSync, mkdirSync, cpSync, rmSync, existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DURATION, SCENES, VO, at, scene } from "./schedule.mjs";
import { FORMATS, baseCss } from "./ui.mjs";
import * as S1 from "./scenes1.mjs";
import * as S2 from "./scenes2.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const MAIN = join(HERE, "..");
const DIRS = { wide: MAIN, square: join(MAIN, "..", "chaotic-fingers-promo-square"), tall: join(MAIN, "..", "chaotic-fingers-promo-vertical") };
const BUILDERS = { ...S1, ...S2 };
const f3 = (n) => (+n).toFixed(3);
const FRAME = 1 / 30;

function sceneFile(F, sc) {
  const { css, html, js } = BUILDERS[sc.id](F, sc, at);
  return `<template>
<style>${baseCss(F)}${css}</style>
<div id="root" data-composition-id="${sc.id}" data-width="${F.w}" data-height="${F.h}">
${html}
</div>
<script>
(function () {
  const tl = gsap.timeline({ paused: true });
  ${js}
  window.__timelines["${sc.id}"] = tl;
})();
</script>
</template>
`;
}

// Caption groups: up to 4 words (3 on narrow formats), broken at a sentence
// end or a pause of 150 ms or more.
function captionGroups(F) {
  const max = F.k === "wide" ? 4 : 3, groups = [];
  for (const v of VO) {
    let cur = [];
    v.words.forEach((w, i) => {
      cur.push(w);
      const next = v.words[i + 1];
      if (!next || cur.length >= max || /[.?!:]$/.test(w.text) || next.start - w.end >= 0.15) { groups.push(cur); cur = []; }
    });
  }
  return groups.map((g, i) => {
    const next = groups[i + 1];
    const start = Math.max(0.1, g[0].start - 0.05);
    const end = Math.min(next ? next[0].start - 0.05 : DURATION, g.at(-1).end + 0.3);
    return { text: g.map((w) => w.text).join(" "), start, end };
  });
}

function captionsFile(F) {
  const groups = captionGroups(F);
  const size = F.k === "wide" ? 44 : 48;
  const js = groups.map((g, i) =>
    `tl.fromTo("#cap-${i}",{opacity:0},{opacity:1,duration:0.1,ease:"power2.out"},${f3(g.start)});` +
    `tl.to("#cap-${i}",{opacity:0,duration:0.12,ease:"power2.in"},${f3(g.end - 0.12)});tl.set("#cap-${i}",{opacity:0,visibility:"hidden"},${f3(g.end)});`).join("\n  ");
  return `<template>
<style>
#root { position: absolute; inset: 0; font-family: 'Inter', sans-serif; }
.cap { position: absolute; left: 0; width: 100%; bottom: ${F.capBottom}px; text-align: center; overflow: visible; }
.cap span { display: inline-block; max-width: ${F.capMax}px; background: rgba(29,29,31,.84); color: #fff; font-weight: 700; font-size: ${size}px; line-height: 1.2; letter-spacing: -0.01em; padding: 12px 26px 14px; border-radius: 16px; }
</style>
<div id="root" data-composition-id="captions" data-width="${F.w}" data-height="${F.h}">
${groups.map((g, i) => `<div class="cap" id="cap-${i}" style="opacity:0"><span>${g.text}</span></div>`).join("\n")}
</div>
<script>
(function () {
  const tl = gsap.timeline({ paused: true });
  ${js}
  window.__timelines["captions"] = tl;
})();
</script>
</template>
`;
}

// ---- sound -------------------------------------------------------------
function audioTags() {
  const tags = [];
  const a = (id, src, start, lane, opts = {}) => tags.push(
    `<audio id="${id}" src="${src}" data-start="${f3(start)}" data-track-index="${lane}" data-volume="${opts.vol ?? 1}"` +
    `${opts.dur ? ` data-duration="${f3(opts.dur)}"` : ""}${opts.media ? ` data-media-start="${f3(opts.media)}"` : ""}` +
    `${opts.fin ? ` data-fade-in="${opts.fin}"` : ""}${opts.fout ? ` data-fade-out="${opts.fout}"` : ""}></audio>`);
  VO.forEach((v) => a(`vo-${v.id}`, `assets/vo/${v.id}.wav`, v.start, 20, { dur: probe(join(MAIN, "assets", "vo", `${v.id}.wav`)) }));
  // the clatter: back-to-back takes of the typing loop, cut dead on the click
  const stop = at("v05", "click") + FRAME;
  const takes = [0, 0.35, 0.15, 0.5];
  for (let t = 0, i = 0; t < stop; i++) {
    const dur = Math.min(1.0, stop - t);
    a(`clatter-${i}`, "assets/sfx/typing.mp3", t, 21, { dur, media: takes[i % 4], vol: t < scene("reveal").start ? 0.7 : 0.4 });
    t += dur;
  }
  const fx = [];
  const hit = (file, t, vol = 0.8, extra = {}) => fx.push({ file, t: t + FRAME, vol, ...extra });
  hit("whoosh", at("v02", "out") - 0.12, 0.6);
  ["pop", "click-soft", "pop", "click-soft", "pop"].forEach((f, i) => hit(f, at("v03", "opens") + (i * (at("v03", "apps") - at("v03", "opens"))) / 4, 0.55));
  hit("whoosh-short", scene("reveal").start, 0.5);
  hit("click", at("v05", "click"), 0.9);
  ["trackpad", "both"].forEach((w) => hit("click-soft", at("v06", w), 0.5));
  hit("click", at("v07", "stop"), 0.9);
  hit("whoosh", at("v08", "window") - 0.05, 0.55);
  hit("click", at("v08", "click"), 0.9);
  hit("click-soft", at("v08", "mode") - 0.3, 0.5);
  ["shift", "command", "k", "t", "b"].forEach((w) => hit("key-press", at("v09", w), 0.7));
  hit("key-press", at("v10", "hold"), 0.8);
  hit("sparkle", at("v10", "hold") + 3.0, 0.35);
  [4, 5, 6, 7].forEach((i) => hit("key-press", at("v11", i), 0.75));
  ["light", "dark", "dock", "menu", "launch"].forEach((w) => hit("click-soft", at("v12", w), 0.5));
  [0, 1, 2, 3, 4, 5].forEach((i) => hit("key-press", at("v14", "play") + i * 0.42 + 0.08, 0.3));
  const mark = at("v16", "chaotic") + 0.38;
  hit("riser", mark - 2.47, 0.4, { media: 1.0, dur: 2.6 }); // file peaks 3.47 s in
  hit("impact-bass-1", mark, 0.6);
  // a lane per overlap, lowest free lane first
  const lanes = [];
  fx.sort((x, y) => x.t - y.t).forEach((e, i) => {
    const len = e.dur ?? SFX_LEN[e.file];
    let lane = lanes.findIndex((end) => end <= e.t);
    if (lane < 0) { lane = lanes.length; lanes.push(0); }
    lanes[lane] = e.t + len;
    a(`sfx-${i}`, `assets/sfx/${e.file}.mp3`, e.t, 22 + lane, { vol: e.vol, media: e.media, dur: len });
  });
  const music = join(MAIN, "assets", "music", "bed.mp3");
  if (existsSync(music)) a("music", "assets/music/bed.mp3", at("v05", "click") + 0.6, 30, { vol: 0.14, dur: DURATION - at("v05", "click") - 0.6, fin: 0.8, fout: 2.0 });
  return tags.join("\n    ");
}
const probe = (file) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString().trim();
const SFX_LEN = { whoosh: 0.575, "whoosh-short": 0.575, pop: 0.72, "click-soft": 0.366, click: 0.366, "key-press": 0.4, sparkle: 1.8, riser: 10.03, "impact-bass-1": 2.12, typing: 1.5 };

function indexFile(F) {
  const hosts = SCENES.map((s) =>
    `<div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${f3(s.start)}" data-duration="${f3(s.dur)}" data-track-index="1" data-track-kind="graphics" data-width="${F.w}" data-height="${F.h}"></div>`).join("\n    ");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${F.w}, height=${F.h}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${F.w}px; height: ${F.h}px; overflow: hidden; background: #F5F5F7; }
      #main { position: relative; width: 100%; height: 100%; }
      #captions { z-index: 20; }
    </style>
  </head>
  <body>
    <div id="main" data-composition-id="main" data-start="0" data-duration="${f3(DURATION)}" data-width="${F.w}" data-height="${F.h}">
    ${hosts}
    <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${f3(DURATION)}" data-track-index="2" data-track-kind="captions" data-width="${F.w}" data-height="${F.h}"></div>
    ${audioTags()}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
}

for (const [k, F] of Object.entries(FORMATS)) {
  const dir = DIRS[k];
  mkdirSync(join(dir, "compositions"), { recursive: true });
  if (dir !== MAIN) {
    rmSync(join(dir, "assets"), { recursive: true, force: true });
    cpSync(join(MAIN, "assets"), join(dir, "assets"), { recursive: true });
    for (const f of ["hyperframes.json", "package.json"]) cpSync(join(MAIN, f), join(dir, f));
    const meta = JSON.parse(readFileSync(join(MAIN, "meta.json"), "utf8"));
    writeFileSync(join(dir, "meta.json"), JSON.stringify({ ...meta, id: `${meta.id}-${k}`, name: `${meta.name} (${k === "tall" ? "9x16" : "1x1"})` }, null, 2));
    writeFileSync(join(dir, "README.md"), `Generated by ../chaotic-fingers-promo/src/build.mjs — edit there, then rebuild.\n`);
  }
  for (const sc of SCENES) writeFileSync(join(dir, "compositions", `${sc.id}.html`), sceneFile(F, sc));
  writeFileSync(join(dir, "compositions", "captions.html"), captionsFile(F));
  writeFileSync(join(dir, "index.html"), indexFile(F));
  console.log(`${k}: ${F.w}x${F.h} -> ${dir}`);
}

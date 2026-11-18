// The film's clock. Voice lines are placed in film time; every scene event is
// derived from a word inside a line, so retiming a line moves its pictures too.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = dirname(fileURLToPath(import.meta.url));
const SCRIPT = JSON.parse(readFileSync(join(SRC, "vo.json"), "utf8"));

export const DURATION = 66.0;

// [line id, film start in seconds]
const VO_STARTS = {
  v01: 0.3, v02: 3.3, v03: 5.1, v04: 7.45, v05: 10.6, v06: 15.3, v07: 18.4, v08: 23.4,
  v09: 28.5, v10: 32.6, v11: 37.7, v12: 42.5, v13: 46.8, v14: 50.9, v15: 56.1, v16: 60.1,
};

export const SCENES = [
  ["chaos", 0.0, 10.2],
  ["reveal", 10.2, 15.0],
  ["modes", 15.0, 18.2],
  ["vanish", 18.2, 23.0],
  ["menubar", 23.0, 28.5],
  ["shortcuts", 28.5, 32.3],
  ["recovery", 32.3, 37.9],
  ["failsafe", 37.9, 42.2],
  ["settings", 42.2, 46.5],
  ["privacy", 46.5, 50.4],
  ["payoff", 50.4, 56.35],
  ["claim", 56.35, 59.3],
  ["endcard", 59.3, DURATION],
].map(([id, start, end]) => ({ id, start, end, dur: +(end - start).toFixed(3) }));

// Word timings come from whisper; caption text comes from the script, matched
// by position (whisper drops case and punctuation, never words).
export const VO = SCRIPT.map(([id, text]) => {
  const words = JSON.parse(readFileSync(join(SRC, "words", `${id}.json`), "utf8"));
  const timed = Array.isArray(words) ? words : words.words;
  const said = text.split(/\s+/);
  if (timed.length !== said.length) throw new Error(`${id}: ${timed.length} timed words vs ${said.length} scripted`);
  const start = VO_STARTS[id];
  return {
    id, text, start,
    words: said.map((w, i) => ({ text: w, start: +(start + timed[i].start).toFixed(3), end: +(start + timed[i].end).toFixed(3) })),
  };
});

const byId = Object.fromEntries(VO.map((v) => [v.id, v]));

// Film time of a word: at("v05", "click") or at("v11", 1) (0-based index). Repeated
// words take their first match unless an index is given.
export function at(line, word, edge = "start") {
  const v = byId[line];
  const w = typeof word === "number" ? v.words[word] : v.words.find((x) => x.text.toLowerCase().replace(/[^a-z0-9']/g, "") === word);
  if (!w) throw new Error(`no word ${word} in ${line}`);
  return w[edge];
}

export const scene = (id) => SCENES.find((s) => s.id === id);

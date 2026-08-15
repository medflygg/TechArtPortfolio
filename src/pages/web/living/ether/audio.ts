import type { ChapterId, DnaAxes, IngredientId, ScentId } from "./etherWorld";

type UiSound = "enter" | "select" | "soft" | "chime" | "whoosh" | "place" | "bloom" | "tick";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambientGain: GainNode | null = null;
let fxGain: GainNode | null = null;
let muted = false;

let oscA: OscillatorNode | null = null;
let oscB: OscillatorNode | null = null;
let oscC: OscillatorNode | null = null;
let noiseSrc: AudioBufferSourceNode | null = null;
let noiseFilter: BiquadFilterNode | null = null;
let ambientFilter: BiquadFilterNode | null = null;
let lfo: OscillatorNode | null = null;
let lfoGain: GainNode | null = null;
let noiseGainNode: GainNode | null = null;
let gCNode: GainNode | null = null;
let started = false;
let currentChapter: ChapterId = "hero";
let currentScent: ScentId = "nocturne";

/** Active one-shot voices — stolen on each new play to prevent cacophony. */
let voiceBus: GainNode | null = null;
let voiceGeneration = 0;
let lastWhooshAt = 0;
let lastTickAt = 0;
let lastDnaAt = 0;

const SCENT_ROOT: Record<ScentId, { root: number; color: OscillatorType }> = {
  nocturne: { root: 110, color: "sine" },
  ember: { root: 98, color: "triangle" },
  mist: { root: 130.8, color: "sine" },
};

type NoteVoice = {
  freqs: number[];
  type: OscillatorType;
  filter: number;
  noise?: number;
  noiseHz?: number;
  attack: number;
  release: number;
  detune?: number;
  fm?: number;
};

const NOTE_VOICE: Record<IngredientId, NoteVoice> = {
  bergamot: { freqs: [988, 1480, 1976], type: "sine", filter: 5200, attack: 0.008, release: 0.48, detune: 12 },
  iris: { freqs: [277, 415], type: "triangle", filter: 980, attack: 0.2, release: 1.25, detune: 0 },
  rose: { freqs: [392, 588, 784], type: "sine", filter: 2400, attack: 0.04, release: 0.9, detune: 18 },
  cedar: { freqs: [73, 110], type: "triangle", filter: 420, attack: 0.12, release: 1.2, noise: 0.07, noiseHz: 180 },
  vanilla: { freqs: [220, 330, 440], type: "sine", filter: 1100, attack: 0.09, release: 1.15, detune: 3 },
  oud: { freqs: [49, 73], type: "sawtooth", filter: 260, attack: 0.2, release: 1.4, noise: 0.08, noiseHz: 110, fm: 2.8 },
  pepper: { freqs: [1319, 1976], type: "square", filter: 4200, attack: 0.002, release: 0.18, noise: 0.1, noiseHz: 2800 },
  musk: { freqs: [87, 131, 174], type: "sine", filter: 480, attack: 0.24, release: 1.35, noise: 0.025, noiseHz: 240 },
  jasmine: { freqs: [523, 784, 1047], type: "sine", filter: 3200, attack: 0.03, release: 0.85, detune: 22 },
  amber: { freqs: [165, 247, 330], type: "triangle", filter: 900, attack: 0.11, release: 1.2, detune: 6 },
  resin: { freqs: [41, 55], type: "sawtooth", filter: 180, attack: 0.28, release: 1.55, noise: 0.1, noiseHz: 90, fm: 1.6 },
  sandalwood: { freqs: [98, 147], type: "triangle", filter: 620, attack: 0.14, release: 1.3, noise: 0.04, noiseHz: 320 },
};

const CHAPTER_BED: Record<
  ChapterId,
  { filter: number; noise: number; pulse: number; third: number; fifth: number; volume: number; lfo: number }
> = {
  hero: { filter: 360, noise: 0.01, pulse: 0.08, third: 1.5, fifth: 1.0, volume: 0.34, lfo: 0.05 },
  inside: { filter: 1200, noise: 0.04, pulse: 0.35, third: 2.0, fifth: 1.5, volume: 0.55, lfo: 0.14 },
  anatomy: { filter: 780, noise: 0.012, pulse: 0.16, third: 1.66, fifth: 1.25, volume: 0.4, lfo: 0.08 },
  origin: { filter: 480, noise: 0.03, pulse: 0.22, third: 1.33, fifth: 2.0, volume: 0.48, lfo: 0.04 },
  lab: { filter: 900, noise: 0.012, pulse: 0.15, third: 1.75, fifth: 1.5, volume: 0.4, lfo: 0.1 },
  dna: { filter: 640, noise: 0.02, pulse: 0.28, third: 2.25, fifth: 1.5, volume: 0.42, lfo: 0.15 },
  match: { filter: 500, noise: 0.01, pulse: 0.1, third: 1.5, fifth: 1.25, volume: 0.4, lfo: 0.06 },
  reveal: { filter: 420, noise: 0.006, pulse: 0.08, third: 1.66, fifth: 2.0, volume: 0.5, lfo: 0.05 },
  drydown: { filter: 200, noise: 0.035, pulse: 0.04, third: 1.25, fifth: 1.0, volume: 0.26, lfo: 0.03 },
  bag: { filter: 280, noise: 0.006, pulse: 0.03, third: 1.5, fifth: 1.0, volume: 0.2, lfo: 0.02 },
};

function ensure() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.48;
    master.connect(ctx.destination);

    ambientGain = ctx.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(master);

    fxGain = ctx.createGain();
    fxGain.gain.value = 0.85;
    fxGain.connect(master);

    voiceBus = ctx.createGain();
    voiceBus.gain.value = 1;
    voiceBus.connect(fxGain);
  }
  return ctx;
}

function makeNoiseBuffer(c: AudioContext, seconds = 2) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buf;
}

/** Cut previous one-shots immediately — stops stacked cacophony. */
function stealVoices(c: AudioContext) {
  if (!fxGain) return;
  voiceGeneration += 1;
  const gen = voiceGeneration;
  if (voiceBus) {
    const now = c.currentTime;
    try {
      voiceBus.gain.cancelScheduledValues(now);
      voiceBus.gain.setValueAtTime(Math.max(0.0001, voiceBus.gain.value), now);
      voiceBus.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    } catch {
      /* ignore */
    }
    const old = voiceBus;
    voiceBus = c.createGain();
    voiceBus.gain.value = 0.0001;
    voiceBus.connect(fxGain);
    voiceBus.gain.exponentialRampToValueAtTime(1, now + 0.05);
    // Disconnect old bus after fade
    window.setTimeout(() => {
      if (gen !== voiceGeneration - 0) {
        try {
          old.disconnect();
        } catch {
          /* ignore */
        }
      }
    }, 80);
  } else {
    voiceBus = c.createGain();
    voiceBus.connect(fxGain);
  }
  return voiceBus;
}

function duckAmbient(c: AudioContext, amount = 0.55, ms = 280) {
  if (!ambientGain || muted) return;
  const now = c.currentTime;
  const cur = Math.max(0.0001, ambientGain.gain.value);
  ambientGain.gain.cancelScheduledValues(now);
  ambientGain.gain.setValueAtTime(cur, now);
  ambientGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, cur * amount), now + 0.04);
  ambientGain.gain.exponentialRampToValueAtTime(cur, now + ms / 1000);
}

function startBed(c: AudioContext) {
  if (started || !ambientGain) return;
  started = true;

  ambientFilter = c.createBiquadFilter();
  ambientFilter.type = "lowpass";
  ambientFilter.frequency.value = 360;
  ambientFilter.Q.value = 0.65;
  ambientFilter.connect(ambientGain);

  const merge = c.createGain();
  merge.gain.value = 1;
  merge.connect(ambientFilter);

  oscA = c.createOscillator();
  oscB = c.createOscillator();
  oscC = c.createOscillator();
  oscA.type = "sine";
  oscB.type = "sine";
  oscC.type = "triangle";
  oscA.frequency.value = 110;
  oscB.frequency.value = 165;
  oscC.frequency.value = 220;

  const gA = c.createGain();
  const gB = c.createGain();
  gCNode = c.createGain();
  gA.gain.value = 0.18;
  gB.gain.value = 0.1;
  gCNode.gain.value = 0.04;
  oscA.connect(gA);
  oscB.connect(gB);
  oscC.connect(gCNode);
  gA.connect(merge);
  gB.connect(merge);
  gCNode.connect(merge);

  lfo = c.createOscillator();
  lfoGain = c.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain);
  lfoGain.connect(oscA.frequency);
  lfo.start();

  noiseFilter = c.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = 500;
  noiseFilter.Q.value = 0.35;
  noiseGainNode = c.createGain();
  noiseGainNode.gain.value = 0.01;
  noiseFilter.connect(noiseGainNode);
  noiseGainNode.connect(merge);
  noiseSrc = c.createBufferSource();
  noiseSrc.buffer = makeNoiseBuffer(c);
  noiseSrc.loop = true;
  noiseSrc.connect(noiseFilter);
  noiseSrc.start();

  oscA.start();
  oscB.start();
  oscC.start();

  ambientGain.gain.cancelScheduledValues(c.currentTime);
  ambientGain.gain.setValueAtTime(0.0001, c.currentTime);
  ambientGain.gain.exponentialRampToValueAtTime(0.34, c.currentTime + 2.5);
}

function morphBed(chapter: ChapterId, scent: ScentId, local = 0) {
  if (!ctx || !started || !oscA || !oscB || !oscC || !ambientFilter || !ambientGain) return;
  const bed = CHAPTER_BED[chapter];
  const s = SCENT_ROOT[scent];
  const now = ctx.currentTime;

  oscA.type = s.color;
  oscA.frequency.setTargetAtTime(s.root * bed.fifth, now, 0.5);
  oscB.frequency.setTargetAtTime(s.root * bed.third, now, 0.5);
  oscC.frequency.setTargetAtTime(s.root * bed.third * 1.01, now, 0.55);
  ambientFilter.frequency.setTargetAtTime(bed.filter + local * 70, now, 0.6);
  noiseGainNode?.gain.setTargetAtTime(bed.noise, now, 0.7);
  gCNode?.gain.setTargetAtTime(0.03 + bed.pulse * 0.08, now, 0.55);
  if (lfo) lfo.frequency.setTargetAtTime(bed.lfo, now, 0.9);
  if (lfoGain) lfoGain.gain.setTargetAtTime(5 + bed.pulse * 14, now, 0.8);

  const vol = muted ? 0.0001 : bed.volume;
  ambientGain.gain.setTargetAtTime(vol, now, 0.85);
}

/** Preference-profile bed — axes reshape pitch, warmth filter, and pulse. */
export function setAmbientDna(axes: DnaAxes) {
  currentChapter = "dna";
  if (!ctx || !started || !oscA || !oscB || !oscC || !ambientFilter || !ambientGain) return;
  const now = ctx.currentTime;
  const root = 96 + axes.dayNight * 40 + axes.lightDark * 18;
  const bright = 420 + axes.freshWarm * -180 + (1 - axes.lightDark) * 220;
  oscA.type = axes.minimalSensual > 0.55 ? "triangle" : "sine";
  oscA.frequency.setTargetAtTime(root, now, 0.35);
  oscB.frequency.setTargetAtTime(root * (1.25 + axes.calmPower * 0.55), now, 0.35);
  oscC.frequency.setTargetAtTime(root * (1.5 + axes.freshWarm * 0.4), now, 0.4);
  ambientFilter.frequency.setTargetAtTime(bright, now, 0.4);
  noiseGainNode?.gain.setTargetAtTime(0.008 + axes.minimalSensual * 0.028, now, 0.45);
  gCNode?.gain.setTargetAtTime(0.02 + axes.calmPower * 0.07, now, 0.4);
  if (lfo) lfo.frequency.setTargetAtTime(0.06 + axes.dayNight * 0.12, now, 0.5);
  if (lfoGain) lfoGain.gain.setTargetAtTime(4 + axes.freshWarm * 12, now, 0.45);
  ambientGain.gain.setTargetAtTime(muted ? 0.0001 : 0.44, now, 0.5);
}

/**
 * Skin timeline bed — ambient follows dry-down hour and the notes currently present.
 * Opening: brighter / airier. Heart: mid warmth. Base: darker, slower, more body.
 */
export function setAmbientDrydown(scent: ScentId, dry: number, noteIds: IngredientId[]) {
  currentChapter = "drydown";
  currentScent = scent;
  if (!ctx || !started || !oscA || !oscB || !oscC || !ambientFilter || !ambientGain) return;
  const now = ctx.currentTime;
  const t = Math.min(1, Math.max(0, dry));
  const s = SCENT_ROOT[scent];

  let rootBias = 0;
  if (noteIds.length) {
    const sum = noteIds.reduce((acc, id) => acc + (NOTE_VOICE[id]?.freqs[0] ?? 110), 0);
    rootBias = sum / noteIds.length;
  }
  const root = s.root * (1.15 - t * 0.45) + rootBias * 0.08;
  const filterHz = 780 - t * 560 + (1 - t) * 120;
  const noise = 0.012 + t * 0.045;
  const pulse = 0.12 - t * 0.08;

  oscA.type = t > 0.55 ? "triangle" : s.color;
  oscA.frequency.setTargetAtTime(root, now, 0.4);
  oscB.frequency.setTargetAtTime(root * (1.33 + t * 0.12), now, 0.4);
  oscC.frequency.setTargetAtTime(root * (1.66 - t * 0.2), now, 0.45);
  ambientFilter.frequency.setTargetAtTime(Math.max(120, filterHz), now, 0.45);
  noiseGainNode?.gain.setTargetAtTime(noise, now, 0.5);
  gCNode?.gain.setTargetAtTime(0.02 + pulse * 0.1, now, 0.4);
  if (lfo) lfo.frequency.setTargetAtTime(0.08 - t * 0.05, now, 0.55);
  if (lfoGain) lfoGain.gain.setTargetAtTime(6 + (1 - t) * 10, now, 0.5);
  ambientGain.gain.setTargetAtTime(muted ? 0.0001 : 0.22 + (1 - t) * 0.12, now, 0.55);
}

const DNA_AXIS_TONE: Record<
  keyof DnaAxes,
  { base: number; span: number; type: OscillatorType; filter: number }
> = {
  calmPower: { base: 160, span: 260, type: "sine", filter: 1800 },
  dayNight: { base: 220, span: 300, type: "triangle", filter: 1400 },
  freshWarm: { base: 520, span: -280, type: "sine", filter: 3200 },
  minimalSensual: { base: 380, span: -140, type: "triangle", filter: 1600 },
  lightDark: { base: 640, span: -420, type: "sine", filter: 2400 },
};

/** Soft continuous tone while dragging a preference axis — no voice stealing. */
export function playDnaAxis(axis: keyof DnaAxes, value: number) {
  if (muted) return;
  const c = ensure();
  if (!c || !fxGain) return;
  void c.resume();
  startBed(c);
  const now = c.currentTime;
  if (now - lastDnaAt < 0.055) return;
  lastDnaAt = now;

  const spec = DNA_AXIS_TONE[axis];
  const freq = Math.max(55, spec.base + value * spec.span);
  const osc = c.createOscillator();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  osc.type = spec.type;
  osc.frequency.value = freq;
  f.type = "lowpass";
  f.frequency.value = spec.filter;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.028, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  osc.connect(f);
  f.connect(g);
  g.connect(fxGain);
  osc.start(now);
  osc.stop(now + 0.16);
}

function noiseBurst(c: AudioContext, dest: AudioNode, amount: number, filterHz: number, dur: number) {
  const now = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = makeNoiseBuffer(c, 1);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = filterHz;
  f.Q.value = 0.8;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(amount, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  src.connect(f);
  f.connect(g);
  g.connect(dest);
  src.start(now);
  src.stop(now + dur + 0.05);
}

export function setUniverseMuted(next: boolean) {
  muted = next;
  const c = ensure();
  if (master && c) {
    master.gain.cancelScheduledValues(c.currentTime);
    master.gain.setTargetAtTime(next ? 0.0001 : 0.48, c.currentTime, 0.08);
  }
}

export function isUniverseMuted() {
  return muted;
}

export function resumeUniverseAudio() {
  const c = ensure();
  if (!c) return;
  void c.resume();
  startBed(c);
  morphBed(currentChapter, currentScent, 0);
}

export function setAmbientChapter(chapter: ChapterId, scent: ScentId, local = 0) {
  currentChapter = chapter;
  currentScent = scent;
  const c = ensure();
  if (!c || !started) return;
  morphBed(chapter, scent, local);
}

export function setAmbientScent(scent: ScentId) {
  currentScent = scent;
  if (!started) return;
  // DNA / dry-down use dedicated beds — don't clobber them with the generic chapter bed.
  if (currentChapter === "dna" || currentChapter === "drydown") return;
  morphBed(currentChapter, scent, 0);
}

export function playTone(kind: IngredientId | "ambient" | "click") {
  if (muted) return;
  const c = ensure();
  if (!c || !fxGain) return;
  void c.resume();
  startBed(c);

  if (kind === "click") {
    playUi("soft");
    return;
  }
  if (kind === "ambient") {
    playUi("bloom");
    return;
  }

  const bus = stealVoices(c);
  if (!bus) return;
  duckAmbient(c, 0.5, 320);

  const v = NOTE_VOICE[kind];
  const now = c.currentTime;

  v.freqs.forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    const ftr = c.createBiquadFilter();
    osc.type = v.type;
    osc.frequency.value = f;
    if (v.detune) osc.detune.value = (i % 2 === 0 ? 1 : -1) * v.detune;

    if (v.fm) {
      const mod = c.createOscillator();
      const modG = c.createGain();
      mod.frequency.value = f * 0.5;
      modG.gain.value = f * v.fm * 0.12;
      mod.connect(modG);
      modG.connect(osc.frequency);
      mod.start(now);
      mod.stop(now + v.release + 0.05);
    }

    ftr.type = "lowpass";
    ftr.frequency.value = v.filter;
    const peak = 0.1 / (1 + i * 0.45);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + v.attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + v.release);

    osc.connect(ftr);
    ftr.connect(g);
    g.connect(bus);
    osc.start(now);
    osc.stop(now + v.release + 0.05);
  });

  if (v.noise) noiseBurst(c, bus, v.noise, v.noiseHz ?? 400, Math.min(0.45, v.release * 0.4));
}

export function playUi(kind: UiSound) {
  if (muted) return;
  const c = ensure();
  if (!c || !fxGain) return;
  void c.resume();
  startBed(c);
  const now = c.currentTime;

  if (kind === "whoosh") {
    if (now - lastWhooshAt < 0.55) return;
    lastWhooshAt = now;
    const bus = stealVoices(c);
    if (!bus) return;
    duckAmbient(c, 0.65, 400);
    noiseBurst(c, bus, 0.045, 380, 0.4);
    const src = c.createBufferSource();
    src.buffer = makeNoiseBuffer(c, 1);
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.1;
    f.frequency.setValueAtTime(260, now);
    f.frequency.exponentialRampToValueAtTime(1600, now + 0.32);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.04, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    src.connect(f);
    f.connect(g);
    g.connect(bus);
    src.start(now);
    src.stop(now + 0.45);
    return;
  }

  if (kind === "tick") {
    if (now - lastTickAt < 0.05) return;
    lastTickAt = now;
    // Soft tick without stealing other voices — used for continuous slider feedback.
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = 720 + Math.random() * 200;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.022, now + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(g);
    g.connect(fxGain);
    osc.start(now);
    osc.stop(now + 0.09);
    return;
  }

  const bus = stealVoices(c);
  if (!bus) return;
  duckAmbient(c, 0.6, 300);

  const map: Record<Exclude<UiSound, "whoosh" | "tick">, { freqs: number[]; release: number; gain: number }> = {
    enter: { freqs: [196, 294, 392], release: 0.9, gain: 0.05 },
    select: { freqs: [523, 784], release: 0.45, gain: 0.055 },
    soft: { freqs: [660], release: 0.25, gain: 0.04 },
    chime: { freqs: [392, 523, 659], release: 1.0, gain: 0.045 },
    place: { freqs: [262, 330, 392], release: 0.7, gain: 0.05 },
    bloom: { freqs: [196, 247, 294], release: 1.4, gain: 0.04 },
  };
  const spec = map[kind];
  spec.freqs.forEach((f, i) => {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    const t0 = now + i * 0.03;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(spec.gain / (1 + i * 0.35), t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + spec.release);
    osc.connect(g);
    g.connect(bus);
    osc.start(t0);
    osc.stop(t0 + spec.release + 0.05);
  });
}

export function unlockEtherAudio() {
  resumeUniverseAudio();
  playUi("enter");
}

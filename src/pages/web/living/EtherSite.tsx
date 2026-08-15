import {
  type CSSProperties,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  isUniverseMuted,
  playDnaAxis,
  playTone,
  playUi,
  resumeUniverseAudio,
  setAmbientChapter,
  setAmbientDna,
  setAmbientDrydown,
  setAmbientScent,
  setUniverseMuted,
  unlockEtherAudio,
} from "./ether/audio";
import { InteractionBurst, type BurstHandle } from "./ether/interactionBurst";
import { EtherUniverseCanvas, type UniverseState } from "./ether/EtherUniverseCanvas";
import {
  type DnaAxes,
  type IngredientId,
  type Locale,
  type NoteTier,
  type ScentId,
  CHAPTERS,
  CHAPTER_VH,
  INGREDIENTS,
  LAB_POOL,
  ORIGINS,
  blendLab,
  chapterFromProgress,
  drydownFieldAccent,
  drydownPhaseFromT,
  getScent,
  mixNoteAccents,
  scoreDna,
} from "./ether/etherWorld";

export type LivingMode = "full" | "thumb";

const DNA_LABELS: {
  key: keyof DnaAxes;
  left: Record<Locale, string>;
  right: Record<Locale, string>;
  accent: string;
}[] = [
  {
    key: "calmPower",
    left: { en: "Calm", ru: "Спокойствие" },
    right: { en: "Power", ru: "Сила" },
    accent: "#7EB8E8",
  },
  {
    key: "dayNight",
    left: { en: "Day", ru: "День" },
    right: { en: "Night", ru: "Ночь" },
    accent: "#8B6BC4",
  },
  {
    key: "freshWarm",
    left: { en: "Fresh", ru: "Свежесть" },
    right: { en: "Warm", ru: "Тепло" },
    accent: "#D4923A",
  },
  {
    key: "minimalSensual",
    left: { en: "Minimal", ru: "Минимализм" },
    right: { en: "Sensual", ru: "Чувственность" },
    accent: "#C45A78",
  },
  {
    key: "lightDark",
    left: { en: "Light", ru: "Свет" },
    right: { en: "Dark", ru: "Тень" },
    accent: "#A8A094",
  },
];

const COPY = {
  en: {
    brand: "ÉTHER",
    host: "ether.studio",
    heroLine: "A fragrance made only for you.",
    heroSub: "Explore atmosphere and sound — then we compose the formula.",
    heroBody: "No catalogue bottles. Your scent begins as a private climate: what you hear, feel, and choose.",
    scroll: "Scroll to begin",
    listen: "Enable sound",
    listening: "Sound on",
    insideTitle: "First impression",
    insideBody: "Before a name or a bottle — density, warmth, and air. This is how your scent will open.",
    anatomyTitle: "The structure of a scent",
    anatomyHint: "Hover each note to hear its character. Top opens, heart defines, base remains.",
    topNotes: "Top",
    heartNotes: "Heart",
    baseNotes: "Base",
    originTitle: "Materials & places",
    originBody: "Each origin carries a distinct voice. Select a place to hear the ingredient it contributes.",
    discover: "Listen",
    labTitle: "Build your climate",
    labBody: "Combine up to five materials. The field and the sound respond as your blend takes shape.",
    clearLab: "Clear",
    dnaTitle: "Your preference profile",
    dnaSub: "Five axes — no catalogue. Tune how the finished scent should feel on you.",
    matchTitle: "Three directions",
    matchBody: "Based on your choices, three climates emerge. Listen to each, then select the one that fits.",
    matchPct: "closeness",
    revealTitle: "Your private formula",
    revealBody: "Composed from this journey alone. We keep the visual abstract — the scent is the product.",
    revealPoem: ["Night folds inward.", "Senses deepen.", "What you chose becomes", "who you wear."],
    commission: "Commission this scent",
    drydownTitle: "On the skin, over time",
    drydownBody: "As hours pass, the opening softens and deeper notes remain. Move the timeline to hear and see the shift.",
    drydownTop: "Opening",
    drydownHeart: "Heart",
    drydownBase: "Dry-down",
    drydownNow: "Now present",
    bagTitle: "Commission",
    bagBody: "Share your details. We will compose your formula from the journey you just made.",
    checkout: "Request composition",
    done: "Received — we will write to you shortly.",
    mute: "Mute",
    muted: "Unmute",
    emptyBag: "Choose a direction first — return to the three climates.",
    name: "Name",
    email: "Email",
    ship: "City",
    memory: "Your brief",
    memorySub: "Places and notes you explored — the starting brief for your custom scent.",
    thumbTag: "Custom fragrance · Atmosphere · Sound",
  },
  ru: {
    brand: "ÉTHER",
    host: "ether.studio",
    heroLine: "Аромат, созданный только для вас.",
    heroSub: "Исследуйте атмосферу и звук — затем мы соберём формулу.",
    heroBody: "Без каталога флаконов. Ваш аромат начинается как личный климат: то, что вы слышите, чувствуете и выбираете.",
    scroll: "Скролл — начать",
    listen: "Включить звук",
    listening: "Звук включён",
    insideTitle: "Первое впечатление",
    insideBody: "До имени и флакона — плотность, тепло и воздух. Так откроется ваш аромат.",
    anatomyTitle: "Структура аромата",
    anatomyHint: "Наведите на ноту, чтобы услышать характер. Верх открывает, сердце задаёт, база остаётся.",
    topNotes: "Верх",
    heartNotes: "Сердце",
    baseNotes: "База",
    originTitle: "Материалы и места",
    originBody: "У каждого истока свой голос. Выберите место — услышите ингредиент.",
    discover: "Слушать",
    labTitle: "Соберите климат",
    labBody: "До пяти материалов. Поле и звук меняются, пока складывается ваш бленд.",
    clearLab: "Очистить",
    dnaTitle: "Профиль ощущений",
    dnaSub: "Пять осей — без каталога. Настройте, как аромат должен ощущаться на вас.",
    matchTitle: "Три направления",
    matchBody: "По вашим выборам складываются три климата. Слушайте каждый и выберите подходящий.",
    matchPct: "близость",
    revealTitle: "Ваша личная формула",
    revealBody: "Собрана только из этого путешествия. Визуал остаётся абстрактным — продукт это аромат.",
    revealPoem: ["Ночь складывается внутрь.", "Чувства углубляются.", "То, что вы выбрали,", "становится тем, что вы носите."],
    commission: "Заказать этот аромат",
    drydownTitle: "На коже со временем",
    drydownBody: "С часами верхние ноты уходят, остаются более глубокие. Двигайте шкалу — слышите и видите смену.",
    drydownTop: "Открытие",
    drydownHeart: "Сердце",
    drydownBase: "Сухой шлейф",
    drydownNow: "Сейчас звучит",
    bagTitle: "Заказ",
    bagBody: "Оставьте контакты. Мы соберём формулу по путешествию, которое вы только что прошли.",
    checkout: "Запросить композицию",
    done: "Заявка принята — мы скоро напишем.",
    mute: "Выкл. звук",
    muted: "Вкл. звук",
    emptyBag: "Сначала выберите направление — вернитесь к трём климатам.",
    name: "Имя",
    email: "Email",
    ship: "Город",
    memory: "Ваш бриф",
    memorySub: "Места и ноты, которые вы исследовали — старт для кастомного аромата.",
    thumbTag: "Кастомный аромат · Атмосфера · Звук",
  },
} as const;

function UniverseStyles() {
  return (
    <style>{`
.eu-root {
  --eu-bg: #050505;
  --eu-ink: #EAE6DD;
  --eu-muted: rgba(234,230,221,0.5);
  --eu-line: rgba(234,230,221,0.14);
  --eu-accent: #6B4EFF;
  --eu-font-display: "Cormorant Garamond", "Fraunces", "Times New Roman", serif;
  --eu-font-body: "DM Sans", system-ui, sans-serif;
  position: relative;
  width: 100%; height: 100%; min-height: 100%;
  background: var(--eu-bg);
  color: var(--eu-ink);
  font-family: var(--eu-font-body);
  overflow: hidden;
  isolation: isolate;
}
.eu-root[data-mode="thumb"] { pointer-events: none; }
.eu-chrome {
  position: absolute; top: 0; left: 0; right: 0; z-index: 30;
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.5rem 0.9rem;
  border-bottom: 1px solid var(--eu-line);
  background: rgba(5,5,5,0.7);
  backdrop-filter: blur(10px);
  font-size: 0.58rem; letter-spacing: 0.1em; color: var(--eu-muted);
}
.eu-chrome__dots { display: flex; gap: 0.25rem; }
.eu-chrome__dots i { width: 6px; height: 6px; border-radius: 50%; background: #333; display: block; }
.eu-chrome__url { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.eu-chrome button {
  border: 0; background: transparent; color: var(--eu-muted); cursor: pointer;
  font: inherit; font-size: 0.54rem; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 0.15rem 0; border-bottom: 1px solid transparent;
}
.eu-chrome button.is-live { color: var(--eu-ink); border-bottom-color: var(--eu-accent); }

.eu-stage { position: absolute; inset: 0; top: 28px; overflow: hidden; }
.eu-scroll { position: absolute; inset: 0; overflow: auto; opacity: 0; pointer-events: none; z-index: 0; }
.eu-scroll__spacer { width: 1px; }

.eu-hud { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
.eu-layer {
  position: absolute; inset: 0;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.eu-layer.is-on { opacity: 1; transform: translateY(0); pointer-events: auto; }
.eu-layer.is-on.eu-layer--pass { pointer-events: none; }
.eu-layer.is-on.eu-layer--pass .eu-hit { pointer-events: auto; }

.eu-brand {
  font-family: var(--eu-font-display);
  font-weight: 500; letter-spacing: 0.42em;
  font-size: clamp(1.85rem, 4.6vw, 3.1rem);
  text-transform: uppercase;
}
.eu-hero .eu-brand {
  display: inline-block;
  /* Optical center: letter-spacing adds space after glyphs */
  padding-left: 0.42em;
}
.eu-kicker {
  font-size: 0.5rem; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--eu-muted); margin: 0 0 0.65rem;
}
.eu-display {
  margin: 0;
  font-family: var(--eu-font-display);
  font-weight: 500;
  font-size: clamp(1.35rem, 3.2vw, 2.1rem);
  letter-spacing: 0.02em;
  line-height: 1.25;
  max-width: 20ch;
}
.eu-lead {
  margin: 0.7rem 0 0;
  font-size: clamp(0.68rem, 1.25vw, 0.78rem);
  letter-spacing: 0.04em;
  color: rgba(234,230,221,0.72);
  line-height: 1.55;
  max-width: 38ch;
  text-transform: none;
}
.eu-body {
  margin: 0.85rem 0 0;
  font-size: 0.78rem;
  line-height: 1.55;
  color: rgba(234,230,221,0.55);
  max-width: 34ch;
  letter-spacing: 0.02em;
}
.eu-hint {
  margin: 0.55rem 0 0;
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  color: rgba(234,230,221,0.4);
  max-width: 32ch;
  line-height: 1.5;
}

.eu-hero {
  display: flex; flex-direction: column; align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 6.5% 1.4rem 7.5%;
  text-align: center;
}
.eu-hero__top {
  display: flex; flex-direction: column; align-items: center;
  width: min(36rem, 92%);
}
.eu-hero .eu-display {
  max-width: 28ch; width: 100%;
  margin-left: auto; margin-right: auto;
  text-align: center;
}
.eu-hero .eu-lead,
.eu-hero .eu-body {
  margin-left: auto; margin-right: auto;
  text-align: center;
  max-width: 42ch;
}
.eu-hero__actions {
  display: flex; flex-direction: column; align-items: center; gap: 1rem;
}
.eu-listen {
  border: 0; background: transparent; cursor: pointer;
  color: var(--eu-ink); font: inherit;
  font-size: 0.58rem; letter-spacing: 0.18em; text-transform: uppercase;
  padding: 0.55rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--eu-accent) 65%, transparent);
}
.eu-listen.is-on { color: var(--eu-muted); border-bottom-color: var(--eu-line); cursor: default; }
.eu-scroll-hint {
  font-size: 0.48rem; letter-spacing: 0.36em; color: rgba(234,230,221,0.38);
  animation: eu-breathe 3.6s ease-in-out infinite;
}
@keyframes eu-breathe {
  0%, 100% { opacity: 0.22; }
  50% { opacity: 0.8; }
}

.eu-copy-block {
  position: absolute; left: 1.5rem; top: 12%;
  max-width: min(340px, 42vw);
}
.eu-copy-block--right {
  left: auto; right: 1.5rem; text-align: right;
}
.eu-copy-block--right .eu-display,
.eu-copy-block--right .eu-lead,
.eu-copy-block--right .eu-body,
.eu-copy-block--right .eu-hint { margin-left: auto; }

.eu-anatomy {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8% 6% 10%;
  max-width: min(420px, 48vw);
}
.eu-anatomy__intro { max-width: 34ch; margin-bottom: 1.6rem; }
.eu-anatomy__tiers {
  display: flex; flex-direction: column; gap: 1.35rem;
}
.eu-anatomy__tier { position: relative; }
.eu-anatomy__label {
  font-size: 0.5rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(234,230,221,0.42); margin-bottom: 0.4rem;
}
.eu-anatomy__list { display: flex; flex-direction: column; gap: 0.28rem; }
.eu-anatomy__list button {
  border: 0; background: transparent; text-align: left; cursor: pointer;
  color: var(--eu-ink); font: inherit;
  font-family: var(--eu-font-display);
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  letter-spacing: 0.04em; padding: 0.1rem 0;
  opacity: 0.42; transition: opacity 0.25s ease, color 0.25s ease, transform 0.25s ease;
}
.eu-anatomy__list.is-focusing button { opacity: 0.22; }
.eu-anatomy__list button.is-hot {
  opacity: 1;
  transform: translateX(4px);
}

.eu-origin {
  position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%);
  width: min(220px, 40vw);
  border-left: 1px solid var(--eu-line);
  padding-left: 1.1rem;
}
.eu-origin__intro { margin-bottom: 1rem; }
.eu-origin__intro .eu-display { font-size: clamp(1.1rem, 2.4vw, 1.45rem); max-width: 12ch; }
.eu-origin button {
  display: block; width: 100%;
  border: 0; background: transparent; text-align: left; cursor: pointer;
  color: var(--eu-ink); font: inherit;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(234,230,221,0.07);
}
.eu-origin button:last-child { border-bottom: 0; }
.eu-origin__place {
  display: block;
  font-family: var(--eu-font-display);
  font-size: 0.95rem; letter-spacing: 0.06em;
  transition: color 0.25s ease;
}
.eu-origin button.is-on .eu-origin__place { color: var(--eu-origin, var(--eu-accent)); }
.eu-origin__mood {
  display: block; margin-top: 0.28rem;
  font-size: 0.58rem; line-height: 1.4;
  color: rgba(234,230,221,0.42); letter-spacing: 0.02em;
  text-transform: none;
}
.eu-origin__sub {
  display: block; margin-top: 0.25rem;
  font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--eu-muted);
}

.eu-lab {
  position: absolute; left: 1.5rem; bottom: 1.5rem;
  width: min(300px, 78vw);
}
.eu-lab .eu-display { font-size: clamp(1.15rem, 2.5vw, 1.5rem); }
.eu-lab__head {
  display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;
  margin-top: 0.85rem;
  border-top: 1px solid var(--eu-line);
  padding-top: 0.75rem;
}
.eu-lab__head button {
  border: 0; background: transparent; cursor: pointer;
  color: var(--eu-muted); font: inherit; font-size: 0.5rem;
  letter-spacing: 0.16em; text-transform: uppercase;
}
.eu-lab__ings { display: flex; flex-wrap: wrap; gap: 0.7rem 1.15rem; margin-top: 0.85rem; }
.eu-lab__ings button {
  border: 0; background: transparent; cursor: pointer;
  color: var(--eu-muted); font: inherit;
  font-family: var(--eu-font-display);
  font-size: 0.85rem; letter-spacing: 0.04em;
  border-bottom: 1px solid transparent; padding: 0;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.eu-lab__ings button.is-in {
  color: var(--eu-ink);
  border-bottom-color: color-mix(in srgb, var(--eu-accent) 65%, transparent);
}

.eu-dna {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: min(400px, 88vw);
  text-align: center;
}
.eu-dna .eu-display { margin-left: auto; margin-right: auto; max-width: 16ch; }
.eu-dna .eu-lead { margin-left: auto; margin-right: auto; }
.eu-dna__axes { margin-top: 1.5rem; text-align: left; }
.eu-dna label {
  display: grid; gap: 0.35rem; margin-bottom: 1.05rem;
  font-size: 0.5rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--eu-muted);
}
.eu-dna__ends { display: flex; justify-content: space-between; color: rgba(234,230,221,0.72); }
.eu-dna__track {
  position: relative; height: 18px; display: grid; align-items: center;
  --eu-dna-v: 0.5;
  --eu-dna-c: #EAE6DD;
}
.eu-dna__track::before {
  content: ""; position: absolute; left: 0; right: 0; top: 50%;
  height: 2px; background: rgba(234,230,221,0.14); transform: translateY(-50%);
  border-radius: 1px;
}
.eu-dna__fill {
  position: absolute; left: 0; top: 50%; transform: translateY(-50%);
  height: 2px; width: calc(var(--eu-dna-v) * 100%);
  background: color-mix(in srgb, var(--eu-dna-c) 85%, #EAE6DD);
  border-radius: 1px;
  pointer-events: none;
  transition: width 0.05s linear;
}
.eu-dna__track::after {
  content: "";
  position: absolute;
  left: calc(var(--eu-dna-v) * 100%);
  top: 50%;
  width: 12px; height: 12px;
  margin: -6px 0 0 -6px;
  border-radius: 50%;
  border: 1.5px solid color-mix(in srgb, var(--eu-dna-c) 90%, #EAE6DD);
  background: color-mix(in srgb, var(--eu-dna-c) 35%, #050505);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--eu-dna-c) 18%, transparent);
  pointer-events: none;
  z-index: 2;
  transition: left 0.05s linear, border-color 0.15s ease, background 0.15s ease;
}
.eu-dna input[type="range"] {
  position: relative; z-index: 3; width: 100%; height: 18px; margin: 0;
  -webkit-appearance: none; appearance: none; background: transparent;
  cursor: pointer;
}
.eu-dna input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 14px; height: 14px; border-radius: 50%;
  border: 0; background: transparent; cursor: pointer;
}
.eu-dna input[type="range"]::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 50%;
  border: 0; background: transparent; cursor: pointer;
}

.eu-match {
  height: 100%;
  display: flex; flex-direction: column; align-items: center;
  padding: 5.5% 1.25rem 6.5%;
  text-align: center;
}
.eu-match .eu-display { max-width: 16ch; }
.eu-match .eu-body { max-width: 42ch; margin-left: auto; margin-right: auto; }
.eu-match__row {
  margin-top: auto;
  display: flex; gap: clamp(1.4rem, 5.5vw, 3.5rem); justify-content: center; width: 100%;
}
.eu-match__card {
  width: min(140px, 26vw);
  border: 0; background: transparent; cursor: pointer;
  color: var(--eu-ink); text-align: center;
  opacity: 0.38; transition: opacity 0.35s ease, transform 0.35s ease;
}
.eu-match__card.is-on { opacity: 1; transform: translateY(-5px); }
.eu-match__card strong {
  display: block;
  font-family: var(--eu-font-display);
  letter-spacing: 0.16em; font-size: 0.85rem; font-weight: 500;
  margin-bottom: 0.45rem;
}
.eu-match__blurb {
  display: block;
  font-size: 0.58rem; line-height: 1.45;
  color: rgba(234,230,221,0.45);
  margin-bottom: 0.55rem;
  letter-spacing: 0.02em;
}
.eu-match__pct {
  font-size: 0.48rem; letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(234,230,221,0.28);
}
.eu-match__card.is-on .eu-match__pct { color: rgba(234,230,221,0.55); }

.eu-reveal {
  position: absolute; right: 7%; top: 50%; transform: translateY(-50%);
  text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.55rem;
  max-width: min(300px, 42vw);
}
.eu-reveal .eu-brand { font-size: 0.62rem; letter-spacing: 0.4em; }
.eu-reveal .eu-display { max-width: 14ch; }
.eu-reveal__poem {
  margin: 0.35rem 0 0; color: rgba(234,230,221,0.52);
  font-family: var(--eu-font-display); font-size: 0.92rem; line-height: 1.55; font-style: italic;
}
.eu-reveal__fade {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1), transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}
.eu-reveal__fade.is-in {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
.eu-price {
  font-family: var(--eu-font-display);
  font-size: 1.05rem; letter-spacing: 0.12em; margin-top: 0.35rem;
}
.eu-btn {
  border: 0; border-bottom: 1px solid rgba(234,230,221,0.4);
  background: transparent; color: var(--eu-ink); cursor: pointer; font: inherit;
  letter-spacing: 0.18em; text-transform: uppercase; font-size: 0.58rem;
  padding: 0.55rem 0; margin-top: 0.25rem;
}
.eu-btn:disabled { opacity: 0.35; cursor: default; }

.eu-dry {
  position: absolute; left: 50%; bottom: 1.6rem; transform: translateX(-50%);
  width: min(420px, 88vw);
  text-align: center;
}
.eu-dry .eu-display { margin: 0 auto 0.4rem; font-size: clamp(1.05rem, 2.2vw, 1.35rem); max-width: 18ch; }
.eu-dry .eu-body { margin: 0 auto 0.9rem; max-width: 42ch; }
.eu-dry__meta {
  font-size: 0.5rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--eu-muted);
}
.eu-dry__phase {
  margin: 0.75rem 0 0.35rem;
  font-size: 0.52rem; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--eu-dry, var(--eu-accent));
  transition: color 0.45s ease;
}
.eu-dry__notes {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 0.45rem 1rem;
  margin-bottom: 0.85rem;
  min-height: 1.6rem;
}
.eu-dry__note {
  font-family: var(--eu-font-display);
  font-size: 0.92rem; letter-spacing: 0.04em;
  transition: opacity 0.35s ease, color 0.35s ease, transform 0.35s ease;
}
.eu-dry input {
  width: 100%; height: 2px; margin: 0.55rem 0;
  -webkit-appearance: none; appearance: none;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--eu-dry, #EAE6DD) 55%, transparent),
    rgba(234,230,221,0.16)
  );
  outline: none;
  border-radius: 1px;
}
.eu-dry input::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--eu-dry, var(--eu-ink));
  border: 1px solid rgba(234,230,221,0.55);
  cursor: pointer;
}
.eu-dry input::-moz-range-thumb {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--eu-dry, var(--eu-ink));
  border: 1px solid rgba(234,230,221,0.55);
  cursor: pointer;
}

.eu-bag {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: min(400px, 90vw);
}
.eu-bag .eu-display { font-size: clamp(1.2rem, 2.6vw, 1.55rem); }
.eu-bag__memory { margin: 1rem 0; padding-top: 0.85rem; border-top: 1px solid var(--eu-line); }
.eu-bag__memory-title {
  font-family: var(--eu-font-display);
  letter-spacing: 0.12em; font-size: 0.85rem; margin-bottom: 0.3rem;
}
.eu-bag__memory p { margin: 0 0 0.45rem; font-size: 0.65rem; color: var(--eu-muted); }
.eu-bag__memory-list {
  font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--eu-muted); line-height: 1.55;
}
.eu-bag__line {
  display: flex; justify-content: space-between; gap: 1rem;
  padding: 0.55rem 0; border-bottom: 1px solid var(--eu-line); font-size: 0.82rem;
}
.eu-bag form { display: grid; gap: 0.5rem; margin-top: 1rem; }
.eu-bag input {
  background: transparent; border: 0; border-bottom: 1px solid var(--eu-line);
  color: var(--eu-ink); font: inherit; padding: 0.55rem 0; border-radius: 0;
}
.eu-bag input:focus { outline: none; border-bottom-color: var(--eu-accent); }
.eu-bag__empty { color: var(--eu-muted); font-size: 0.78rem; margin: 1rem 0 0; }
.eu-bag__done { margin-top: 1rem; color: var(--eu-accent); font-size: 0.8rem; }

.eu-thumb {
  position: absolute; inset: 0; top: 28px;
  background:
    radial-gradient(ellipse 48% 58% at 50% 55%, color-mix(in srgb, var(--eu-accent) 24%, transparent), transparent 72%),
    #050505;
  display: grid; place-items: center;
}
.eu-thumb__inner { text-align: center; }
.eu-thumb__brand {
  font-family: var(--eu-font-display);
  font-weight: 500; letter-spacing: 0.42em;
  font-size: clamp(1.3rem, 4vw, 2rem); text-transform: uppercase;
}
.eu-thumb__tag {
  margin: 0.6rem 0 0;
  font-size: 0.48rem; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(234,230,221,0.5);
}

@media (max-width: 720px) {
  .eu-anatomy { max-width: 86vw; padding-top: 8%; }
  .eu-copy-block { max-width: 78vw; }
  .eu-origin { right: 0.7rem; width: min(170px, 46vw); }
  .eu-reveal { right: 5%; max-width: 72vw; }
}
`}</style>
  );
}

export function EtherSite({
  accent = "#6B4EFF",
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const t = COPY[locale];
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastChapterRef = useRef<string>("hero");
  const audioOnRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [scentId, setScentId] = useState<ScentId>("nocturne");
  const [hoverNote, setHoverNote] = useState<IngredientId | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [lab, setLab] = useState<IngredientId[]>([]);
  const [dna, setDna] = useState<DnaAxes>({
    calmPower: 0.5,
    dayNight: 0.55,
    freshWarm: 0.4,
    minimalSensual: 0.55,
    lightDark: 0.6,
  });
  const [matchId, setMatchId] = useState<ScentId | null>(null);
  const [reveal, setReveal] = useState(0);
  const [drydown, setDrydown] = useState(0.15);
  const [bag, setBag] = useState<{ id: ScentId; qty: number }[]>([]);
  const [visitedOrigins, setVisitedOrigins] = useState<string[]>([]);
  const [touchedNotes, setTouchedNotes] = useState<IngredientId[]>([]);
  const [muted, setMuted] = useState(isUniverseMuted());
  const [audioOn, setAudioOn] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const burstRef = useRef<BurstHandle>(null);
  const dryPhaseRef = useRef<"top" | "heart" | "base">("top");
  const dryNotesRef = useRef<HTMLDivElement>(null);

  const chapterInfo = chapterFromProgress(progress);
  const chapter = chapterInfo.id;
  const local = chapterInfo.local;
  const scent = getScent(matchId ?? scentId);
  const rankings = scoreDna(dna);
  const labBlend = blendLab(lab);
  const totalVh = CHAPTERS.reduce((s, id) => s + CHAPTER_VH[id], 0);
  const matchBias = matchId === "ember" ? 1 : matchId === "mist" ? 0 : 0.5;

  useEffect(() => {
    if (mode !== "full") return;
    const el = scrollRef.current;
    const stage = el?.parentElement;
    if (!el || !stage) return;
    let raf = 0;
    let touchY = 0;
    let running = true;

    const maxScroll = () => Math.max(1, el.scrollHeight - el.clientHeight);
    const applyTarget = (next: number) => {
      targetProgressRef.current = Math.min(1, Math.max(0, next));
    };

    const jumpTo = (next: number) => {
      const p = Math.min(1, Math.max(0, next));
      targetProgressRef.current = p;
      progressRef.current = p;
      el.scrollTop = p * maxScroll();
      setProgress(p);
    };
    (window as unknown as { __etherJump?: (p: number) => void }).__etherJump = jumpTo;

    const tick = () => {
      if (!running) return;
      const cur = progressRef.current;
      const tgt = targetProgressRef.current;
      const next = cur + (tgt - cur) * 0.07;
      progressRef.current = Math.abs(tgt - next) < 0.00006 ? tgt : next;
      el.scrollTop = progressRef.current * maxScroll();
      setProgress((p) => (Math.abs(p - progressRef.current) < 0.00003 ? p : progressRef.current));
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const pixels =
        e.deltaMode === 1 ? e.deltaY * 18 : e.deltaMode === 2 ? e.deltaY * el.clientHeight : e.deltaY;
      applyTarget(targetProgressRef.current + pixels / (el.clientHeight * 5.2));
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      applyTarget(targetProgressRef.current + (touchY - y) / (el.clientHeight * 1.85));
      touchY = y;
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: true });
    applyTarget(0);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      delete (window as unknown as { __etherJump?: (p: number) => void }).__etherJump;
    };
  }, [mode]);

  useEffect(() => {
    if (chapter === "reveal") setReveal(Math.min(1, local * 1.15));
  }, [chapter, local]);

  useEffect(() => {
    if (chapter === "drydown") {
      setDrydown((d) => (Math.abs(d - local) < 0.02 ? d : local));
    }
  }, [chapter, local]);

  useEffect(() => {
    if (chapter === "match" && !matchId) setMatchId(rankings[0]?.scent.id ?? "nocturne");
  }, [chapter, matchId, rankings]);

  const spawnBurst = (
    el: HTMLElement | EventTarget | null | undefined,
    color: string,
    kind: "petal" | "smoke" | "spark" | "gold" | "cold" = "cold",
  ) => {
    if (!el || !(el instanceof HTMLElement)) return;
    burstRef.current?.spawnFrom(el, color, kind);
  };

  useEffect(() => {
    if (!audioOnRef.current) return;
    if (lastChapterRef.current !== chapter) {
      playUi("whoosh");
      lastChapterRef.current = chapter;
    }
    if (chapter === "drydown") {
      const phase = drydownPhaseFromT(drydown);
      setAmbientDrydown(
        matchId ?? scentId,
        drydown,
        scent.notes[phase].map((n) => n.id),
      );
    } else if (chapter === "dna") {
      setAmbientDna(dna);
    } else {
      setAmbientChapter(chapter, matchId ?? scentId, local);
    }
  }, [chapter, local, matchId, scentId, drydown, dna, scent.notes]);

  useEffect(() => {
    if (!audioOnRef.current) return;
    setAmbientScent(matchId ?? scentId);
  }, [matchId, scentId]);

  const dryField = drydownFieldAccent(scent, drydown);
  const dryPhase: NoteTier = drydownPhaseFromT(drydown);
  const dryPhaseLabel =
    dryPhase === "top" ? t.drydownTop : dryPhase === "heart" ? t.drydownHeart : t.drydownBase;
  const dryNotes = scent.notes[dryPhase];
  const dryMix = mixNoteAccents(dryNotes.map((n) => n.id));

  const focusAccent =
    chapter === "drydown"
      ? dryField
      : (hoverNote && INGREDIENTS[hoverNote].accent) ||
        (selectedOrigin &&
          INGREDIENTS[ORIGINS.find((o) => o.id === selectedOrigin)?.ingredient ?? "bergamot"].accent) ||
        scent.accent;

  const universeState: UniverseState = {
    chapter,
    local,
    scentId: matchId ?? scentId,
    accent: chapter === "drydown" ? dryField : scent.accent,
    focusAccent,
    hoverEnergy: hoverNote ? 1 : chapter === "dna" ? 0.35 : 0,
    selectEnergy: selectedOrigin || lab.length ? 1 : chapter === "drydown" ? 0.85 : 0,
    dna,
    drydown,
    reveal,
    labEnergy: lab.length / Math.max(1, LAB_POOL.length),
    matchBias,
  };

  const style = {
    "--eu-accent": scent.accent,
    "--eu-dry": dryField,
  } as CSSProperties;

  const enableSound = () => {
    unlockEtherAudio();
    audioOnRef.current = true;
    setAudioOn(true);
    setMuted(false);
    setUniverseMuted(false);
    if (chapter === "drydown") {
      setAmbientDrydown(
        matchId ?? scentId,
        drydown,
        scent.notes[dryPhase].map((n) => n.id),
      );
    } else if (chapter === "dna") {
      setAmbientDna(dna);
    } else {
      setAmbientChapter(chapter, matchId ?? scentId, local);
    }
  };

  const onMute = () => {
    if (!audioOnRef.current) {
      enableSound();
      return;
    }
    const next = !muted;
    setMuted(next);
    setUniverseMuted(next);
    if (!next) resumeUniverseAudio();
  };

  const hoverIngredient = (
    id: IngredientId | null,
    key: string | null,
    el?: HTMLElement | EventTarget | null,
  ) => {
    setHoverNote(id);
    setHoverKey(key);
    if (id) {
      setTouchedNotes((prev) => (prev.includes(id) ? prev : [...prev, id]));
      const trail = INGREDIENTS[id].trail;
      if (el) spawnBurst(el, INGREDIENTS[id].accent, trail);
      if (audioOnRef.current) playTone(id);
    }
  };

  const discoverOrigin = (id: string, el: HTMLElement | EventTarget) => {
    setSelectedOrigin(id);
    setVisitedOrigins((prev) => (prev.includes(id) ? prev : [...prev, id]));
    const o = ORIGINS.find((x) => x.id === id);
    if (o) {
      const placeEl =
        el instanceof HTMLElement
          ? el.querySelector<HTMLElement>(".eu-origin__place") ?? el
          : el;
      spawnBurst(placeEl, INGREDIENTS[o.ingredient].accent, INGREDIENTS[o.ingredient].trail);
      if (audioOnRef.current) {
        playUi("select");
        playTone(o.ingredient);
      }
      setScentId(
        o.ingredient === "vanilla" || o.ingredient === "cedar"
          ? "ember"
          : o.ingredient === "bergamot"
            ? "mist"
            : "nocturne",
      );
    }
  };

  const addToBag = (el?: HTMLElement | EventTarget | null) => {
    const id = matchId ?? scentId;
    setBag((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id, qty: 1 }];
    });
    if (audioOnRef.current) playUi("place");
    if (el) spawnBurst(el, scent.accent, "gold");
    targetProgressRef.current = 0.995;
    progressRef.current = 0.995;
    setProgress(0.995);
  };

  const onCheckout = (e: FormEvent) => {
    e.preventDefault();
    setCheckoutDone(true);
    if (audioOnRef.current) playUi("chime");
  };

  const on = (id: string) => (chapter === id ? " is-on" : "");

  const setDrydownInteractive = (v: number) => {
    setDrydown(v);
    const phase = drydownPhaseFromT(v);
    const notes = scent.notes[phase];
    const noteNodes = dryNotesRef.current?.querySelectorAll<HTMLElement>(".eu-dry__note");
    const pickNoteEl = () => {
      if (!noteNodes?.length) return dryNotesRef.current;
      return noteNodes[Math.floor(Math.random() * noteNodes.length)] ?? dryNotesRef.current;
    };
    if (phase !== dryPhaseRef.current) {
      dryPhaseRef.current = phase;
      const note = notes[0]?.id;
      if (note && audioOnRef.current) playTone(note);
      // Emit from each visible note label (letters), not the slider thumb
      noteNodes?.forEach((node, i) => {
        const nid = notes[i]?.id ?? note;
        if (nid) spawnBurst(node, INGREDIENTS[nid].accent, INGREDIENTS[nid].trail);
      });
    } else if (Math.random() > 0.65) {
      const note = notes[Math.floor(Math.random() * notes.length)]?.id;
      const el = pickNoteEl();
      if (note && el) spawnBurst(el, INGREDIENTS[note].accent, INGREDIENTS[note].trail);
    }
    if (audioOnRef.current) {
      setAmbientDrydown(
        matchId ?? scentId,
        v,
        notes.map((n) => n.id),
      );
    }
  };

  const setDnaAxis = (key: keyof DnaAxes, value: number) => {
    setDna((d) => {
      const next = { ...d, [key]: value };
      if (audioOnRef.current) {
        playDnaAxis(key, value);
        setAmbientDna(next);
      }
      return next;
    });
  };

  if (mode === "thumb") {
    return (
      <div className="eu-root" data-mode="thumb" style={{ ...style, "--eu-accent": accent } as CSSProperties}>
        <UniverseStyles />
        <header className="eu-chrome" aria-hidden>
          <span className="eu-chrome__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="eu-chrome__url">{t.host}</span>
        </header>
        <div className="eu-thumb">
          <div className="eu-thumb__inner">
            <div className="eu-thumb__brand">{t.brand}</div>
            <p className="eu-thumb__tag">{t.thumbTag}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="eu-root" data-mode="full" style={style}>
      <UniverseStyles />
      <header className="eu-chrome">
        <span className="eu-chrome__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="eu-chrome__url">
          {t.host} / {chapter}
        </span>
        <button type="button" className={audioOn && !muted ? "is-live" : ""} onClick={onMute}>
          {!audioOn ? t.listen : muted ? t.muted : t.mute}
        </button>
      </header>

      <div className="eu-stage">
        <EtherUniverseCanvas state={universeState} />
        <InteractionBurst ref={burstRef} enabled={mode === "full"} />

        <div className="eu-hud" aria-live="polite">
          <div className={`eu-layer eu-layer--pass${on("hero")}`}>
            <div className="eu-hero">
              <div className="eu-hero__top">
                <div className="eu-brand">{t.brand}</div>
                <p className="eu-display" style={{ marginTop: "0.85rem" }}>
                  {t.heroLine}
                </p>
                <p className="eu-lead">{t.heroSub}</p>
                <p className="eu-body">{t.heroBody}</p>
              </div>
              <div className="eu-hero__actions">
                {!audioOn ? (
                  <button type="button" className="eu-listen eu-hit" onClick={enableSound}>
                    {t.listen}
                  </button>
                ) : (
                  <span className="eu-listen is-on">{t.listening}</span>
                )}
                <div className="eu-scroll-hint">{t.scroll}</div>
              </div>
            </div>
          </div>

          <div className={`eu-layer eu-layer--pass${on("inside")}`}>
            <div className="eu-copy-block">
              <p className="eu-kicker">{scent.name}</p>
              <h2 className="eu-display">{t.insideTitle}</h2>
              <p className="eu-body">{t.insideBody}</p>
            </div>
          </div>

          <div className={`eu-layer eu-layer--pass${on("anatomy")}`}>
            <div className="eu-anatomy">
              <div className="eu-anatomy__intro">
                <h2 className="eu-display">{t.anatomyTitle}</h2>
                <p className="eu-hint">{t.anatomyHint}</p>
              </div>
              <div className="eu-anatomy__tiers">
                {(
                  [
                    ["top", t.topNotes],
                    ["heart", t.heartNotes],
                    ["base", t.baseNotes],
                  ] as const
                ).map(([tier, label]) => (
                  <div key={tier} className="eu-anatomy__tier">
                    <div className="eu-anatomy__label">{label}</div>
                    <div className={`eu-anatomy__list eu-hit${hoverKey ? " is-focusing" : ""}`}>
                      {scent.notes[tier as NoteTier].map((n, i) => {
                        const key = `${tier}-${i}-${n.id}`;
                        const hot = hoverKey === key;
                        return (
                          <button
                            key={key}
                            type="button"
                            className={hot ? "is-hot" : ""}
                            style={hot ? { color: INGREDIENTS[n.id].accent } : undefined}
                            onPointerEnter={(e) => hoverIngredient(n.id, key, e.currentTarget)}
                            onPointerLeave={() => hoverIngredient(null, null)}
                            onFocus={(e) => hoverIngredient(n.id, key, e.currentTarget)}
                            onBlur={() => hoverIngredient(null, null)}
                          >
                            {n.label[locale]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`eu-layer${on("origin")}`}>
            <div className="eu-origin">
              <div className="eu-origin__intro">
                <h2 className="eu-display">{t.originTitle}</h2>
                <p className="eu-hint">{t.originBody}</p>
              </div>
              {ORIGINS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={selectedOrigin === o.id ? "is-on" : ""}
                  style={
                    selectedOrigin === o.id
                      ? ({ "--eu-origin": INGREDIENTS[o.ingredient].accent } as CSSProperties)
                      : undefined
                  }
                  onClick={(e) => discoverOrigin(o.id, e.currentTarget)}
                >
                  <span className="eu-origin__place">{o.place[locale]}</span>
                  <span className="eu-origin__sub">
                    {INGREDIENTS[o.ingredient].label[locale]} · {t.discover}
                  </span>
                  {selectedOrigin === o.id && (
                    <span className="eu-origin__mood">{o.mood[locale]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className={`eu-layer${on("lab")}`}>
            <div className="eu-lab" style={{ "--eu-accent": labBlend.accent } as CSSProperties}>
              <h2 className="eu-display">{t.labTitle}</h2>
              <p className="eu-body">{t.labBody}</p>
              <div className="eu-lab__head">
                <span className="eu-kicker" style={{ margin: 0 }}>
                  {lab.length ? `${lab.length} / 5` : "—"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    setLab([]);
                    spawnBurst(e.currentTarget, scent.accent, "cold");
                    if (audioOnRef.current) playUi("soft");
                  }}
                >
                  {t.clearLab}
                </button>
              </div>
              <div className="eu-lab__ings">
                {LAB_POOL.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className={lab.includes(id) ? "is-in" : ""}
                    onClick={(e) => {
                      setLab((prev) =>
                        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-5),
                      );
                      hoverIngredient(id, `lab-${id}`, e.currentTarget);
                    }}
                    style={
                      lab.includes(id) ? { color: INGREDIENTS[id].accent, borderBottomColor: INGREDIENTS[id].accent } : undefined
                    }
                  >
                    {INGREDIENTS[id].label[locale]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`eu-layer${on("dna")}`}>
            <div className="eu-dna">
              <h2 className="eu-display">{t.dnaTitle}</h2>
              <p className="eu-lead">{t.dnaSub}</p>
              <div className="eu-dna__axes">
                {DNA_LABELS.map((axis) => (
                  <label key={axis.key}>
                    <span className="eu-dna__ends">
                      <span>{axis.left[locale]}</span>
                      <span>{axis.right[locale]}</span>
                    </span>
                    <div
                      className="eu-dna__track"
                      style={
                        {
                          "--eu-dna-v": dna[axis.key],
                          "--eu-dna-c": axis.accent,
                        } as CSSProperties
                      }
                    >
                      <span className="eu-dna__fill" aria-hidden />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={dna[axis.key]}
                        onChange={(e) => {
                          setDnaAxis(axis.key, Number(e.target.value));
                        }}
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={`eu-layer${on("match")}`}>
            <div className="eu-match">
              <h2 className="eu-display">{t.matchTitle}</h2>
              <p className="eu-body">{t.matchBody}</p>
              <div className="eu-match__row">
                {(["mist", "nocturne", "ember"] as ScentId[]).map((id) => {
                  const row = rankings.find((r) => r.scent.id === id) ?? {
                    scent: getScent(id),
                    match: 0,
                  };
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`eu-match__card${matchId === id ? " is-on" : ""}`}
                      style={{ "--eu-accent": row.scent.accent } as CSSProperties}
                      onClick={(e) => {
                        setMatchId(id);
                        setScentId(id);
                        const title = e.currentTarget.querySelector("strong");
                        spawnBurst(title ?? e.currentTarget, row.scent.accent, "gold");
                        if (audioOnRef.current) {
                          playUi("select");
                          setAmbientScent(id);
                        }
                      }}
                    >
                      <strong>{row.scent.name}</strong>
                      <span className="eu-match__blurb">{row.scent.blurb[locale]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={`eu-layer${on("reveal")}`}>
            <div className="eu-reveal">
              <div className={`eu-reveal__fade${reveal > 0.05 ? " is-in" : ""}`}>
                <div className="eu-brand">{t.brand}</div>
                <p className="eu-kicker">{t.revealTitle}</p>
              </div>
              <div className={`eu-reveal__fade${reveal > 0.15 ? " is-in" : ""}`}>
                <h2 className="eu-display">{scent.name}</h2>
              </div>
              <div className={`eu-reveal__fade${reveal > 0.28 ? " is-in" : ""}`}>
                <p className="eu-body" style={{ textAlign: "right" }}>
                  {t.revealBody}
                </p>
              </div>
              <div className={`eu-reveal__fade${reveal > 0.42 ? " is-in" : ""}`}>
                <p className="eu-reveal__poem">
                  {t.revealPoem.map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
              <div className={`eu-reveal__fade${reveal > 0.58 ? " is-in" : ""}`}>
                <div className="eu-price">€{scent.price}</div>
              </div>
              <div className={`eu-reveal__fade${reveal > 0.7 ? " is-in" : ""}`}>
                <button type="button" className="eu-btn" onClick={(e) => addToBag(e.currentTarget)}>
                  {t.commission}
                </button>
              </div>
            </div>
          </div>

          <div className={`eu-layer${on("drydown")}`}>
            <div className="eu-dry">
              <h2 className="eu-display">{t.drydownTitle}</h2>
              <p className="eu-body">{t.drydownBody}</p>
              <div className="eu-dry__meta">
                {String(Math.round(drydown * 8)).padStart(2, "0")}:00 · 00:00 — 08:00
              </div>
              <div className="eu-dry__phase" style={{ color: dryMix }}>
                {t.drydownNow} · {dryPhaseLabel}
              </div>
              <div className="eu-dry__notes" ref={dryNotesRef}>
                {dryNotes.map((n) => (
                  <span
                    key={`${dryPhase}-${n.id}-${n.label.en}`}
                    className="eu-dry__note"
                    style={{ color: INGREDIENTS[n.id].accent }}
                  >
                    {n.label[locale]}
                  </span>
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={drydown}
                onChange={(e) => setDrydownInteractive(Number(e.target.value))}
              />
            </div>
          </div>

          <div className={`eu-layer${on("bag")}`}>
            <div className="eu-bag">
              <h2 className="eu-display">{t.bagTitle}</h2>
              <p className="eu-body">{t.bagBody}</p>
              {(visitedOrigins.length > 0 || touchedNotes.length > 0) && (
                <div className="eu-bag__memory">
                  <div className="eu-bag__memory-title">{t.memory}</div>
                  <p>{t.memorySub}</p>
                  <div className="eu-bag__memory-list">
                    {visitedOrigins
                      .map((id) => ORIGINS.find((o) => o.id === id)?.place[locale])
                      .filter(Boolean)
                      .join(" → ")}
                    {touchedNotes.length > 0 && (
                      <div style={{ marginTop: "0.35rem" }}>
                        {touchedNotes.map((id) => INGREDIENTS[id].label[locale]).join(" · ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {bag.length === 0 ? (
                <p className="eu-bag__empty">{t.emptyBag}</p>
              ) : (
                bag.map((line) => {
                  const s = getScent(line.id);
                  return (
                    <div key={line.id} className="eu-bag__line">
                      <span>
                        {s.name} × {line.qty}
                      </span>
                      <span>€{s.price * line.qty}</span>
                    </div>
                  );
                })
              )}
              {checkoutDone ? (
                <p className="eu-bag__done">{t.done}</p>
              ) : (
                <form onSubmit={onCheckout}>
                  <input required name="name" placeholder={t.name} />
                  <input required type="email" name="email" placeholder={t.email} />
                  <input required name="ship" placeholder={t.ship} />
                  <button type="submit" className="eu-btn" disabled={!bag.length}>
                    {t.checkout}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="eu-scroll" ref={scrollRef}>
          <div className="eu-scroll__spacer" style={{ height: `${totalVh}vh` }} />
        </div>
      </div>
    </div>
  );
}

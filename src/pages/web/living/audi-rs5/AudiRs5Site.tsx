import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  CABIN_VIEWS,
  CALIPERS,
  CHAPTERS,
  DAMPERS,
  DEFAULT_CONFIG,
  INTERIORS,
  PAINTS,
  SCROLL_SPINE,
  SPECS,
  TECH_DATA,
  TORQUE_STATES,
  WHEELS,
  chapterFromScrollProgress,
  dynamicsFromScrollLocal,
  dynamicsIsHold,
  formatEuro,
  launchTFromAccelLocal,
  launchTelemetry,
  priceEuro,
  progressForChapterStart,
  quattroIsHold,
  scrollSpineTotalVh,
  specsIsHold,
  specsRowsRevealed,
  topSpeedFor,
  torqueFromQuattroLocal,
  type ChapterId,
  type ConfigState,
  type DynamicsLive,
  type Locale,
  type TorqueState,
} from "./audiRs5Data";
import { AudiRs5Canvas } from "./AudiRs5Canvas";

export type LivingMode = "full" | "thumb" | "immersive";

type Props = {
  accent: string;
  locale: Locale;
  mode: LivingMode;
};

const isLive = (mode: LivingMode) => mode === "full" || mode === "immersive";

const COPY = {
  en: {
    brand: "RS 5",
    host: "rs5.sculpture",
    heroTitle: "FORM,\nIN MOTION.",
    heroSub: "A sculpted five-door silhouette. Engineered to become performance.",
    explore: "Configure",
    loading: "Loading sculpture",
    body: "Body",
    selectLight: "Select the light.",
    surfaceNote: "Surface reacts to the studio light.",
    performance: "Performance",
    paint: "Paint",
    calipers: "Calipers",
    wheels: "Wheel finish",
    options: "Options",
    sportDiff: "Sport differential",
    drc: "Dynamic Ride Control",
    dynamicPkg: "RS dynamic package",
    sportExhaust: "RS sport exhaust",
    accelTitle: "Distance becomes a surface.",
    accelNote: "Official 0–100 as a measured strip. Car stays still. Distance moves.",
    launch: "Launch",
    reset: "Reset",
    scrollStrip: "Scroll the distance",
    seconds: "Seconds",
    elapsed: "Elapsed",
    meters: "Meters",
    distanceStrip: "Distance Strip",
    quattroTitle: "Torque becomes light.",
    quattroNote: "Permanent quattro · default 40:60 · live redistribution.",
    dynamicsTitle: "Load finds its path.",
    dynamicsNote: "Corner load on four corners. DRC equalizes opposite pressures.",
    loadLab: "Load Lab",
    bodyRoll: "Body roll",
    cornerLoad: "Corner load",
    fl: "FL",
    fr: "FR",
    rl: "RL",
    rr: "RR",
    cabinTitle: "Driver climate.",
    cabinNote: "Fine Nappa · RS Monitor context · cabin materials.",
    monitor: "RS Monitor",
    thumbTag: "Digital sculpture · Configurator · Performance",
    drag: "Drag to orbit",
    toInterior: "Interior →",
    toExterior: "← Exterior",
    orderTitle: "Reserve your RS 5.",
    orderNote: "Your configuration will be forwarded to your Audi partner.",
    orderName: "Full name",
    orderEmail: "Email",
    orderPhone: "Phone",
    orderCity: "City",
    orderSubmit: "Place order",
    orderDone: "Thank you. An Audi partner will contact you shortly.",
    orderSummary: "Your configuration",
    from: "From",
    phaseEntry: "Corner entry",
    phasePeak: "Peak load",
    phaseExit: "Corner exit",
    drcOn: "DRC linked",
    drcOff: "Open dampers",
    scrollLoad: "Scroll the load path",
    specsKicker: "Technical data",
    specsNote: "Factory figures · Coupé and Sportback.",
    scrollHint: "Scroll",
  },
  ru: {
    brand: "RS 5",
    host: "rs5.sculpture",
    heroTitle: "FORM,\nIN MOTION.",
    heroSub: "Скульптурный пятидверный силуэт. Форма, созданная для динамики.",
    explore: "Configure",
    loading: "Загрузка скульптуры",
    body: "Кузов",
    selectLight: "Выберите свет.",
    surfaceNote: "Поверхность отвечает студийному свету.",
    performance: "Performance",
    paint: "Цвет",
    calipers: "Суппорты",
    wheels: "Отделка дисков",
    options: "Опции",
    sportDiff: "Sport differential",
    drc: "Dynamic Ride Control",
    dynamicPkg: "RS dynamic package",
    sportExhaust: "RS sport exhaust",
    accelTitle: "Дистанция становится поверхностью.",
    accelNote: "Официальные 0–100 как мерная полоса. Машина стоит. Движется путь.",
    launch: "Старт",
    reset: "Сброс",
    scrollStrip: "Скролл — дистанция",
    seconds: "Секунды",
    elapsed: "Прошло",
    meters: "Метры",
    distanceStrip: "Distance Strip",
    quattroTitle: "Момент становится светом.",
    quattroNote: "Постоянный quattro · база 40:60 · живое перераспределение.",
    dynamicsTitle: "Нагрузка находит путь.",
    dynamicsNote: "Угловая нагрузка на четыре угла. DRC выравнивает диагонали.",
    loadLab: "Load Lab",
    bodyRoll: "Крен кузова",
    cornerLoad: "Нагрузка углов",
    fl: "ПЛ",
    fr: "ПП",
    rl: "ЗЛ",
    rr: "ЗП",
    cabinTitle: "Климат водителя.",
    cabinNote: "Fine Nappa · контекст RS Monitor · материалы салона.",
    monitor: "RS Monitor",
    thumbTag: "Digital sculpture · Конфигуратор · Динамика",
    drag: "Потяните, чтобы вращать",
    toInterior: "Interior →",
    toExterior: "← Exterior",
    orderTitle: "Зарезервировать RS 5.",
    orderNote: "Ваша конфигурация будет передана партнёру Audi.",
    orderName: "Имя",
    orderEmail: "Email",
    orderPhone: "Телефон",
    orderCity: "Город",
    orderSubmit: "Оформить",
    orderDone: "Спасибо. Партнёр Audi свяжется с вами в ближайшее время.",
    orderSummary: "Ваша конфигурация",
    from: "От",
    phaseEntry: "Вход в поворот",
    phasePeak: "Пик нагрузки",
    phaseExit: "Выход",
    drcOn: "DRC связан",
    drcOff: "Открытые амортизаторы",
    scrollLoad: "Скролл — путь нагрузки",
    specsKicker: "Технические данные",
    specsNote: "Заводские показатели · Coupé и Sportback.",
    scrollHint: "Скролл",
  },
} as const;

function Styles() {
  return (
    <style>{`
      .rs5-root {
        --rs-void: #090909;
        --rs-surface: #151514;
        --rs-bone: #EEE7DD;
        --rs-champagne: #D7B98F;
        --rs-graphite: #3F3A34;
        --rs-red: #E14A5D;
        --rs-cool: #75A7AE;
        --rs-muted: #8F877D;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: var(--rs-void);
        color: var(--rs-bone);
        font-family: "Manrope", "Sora", system-ui, sans-serif;
        overflow: hidden;
        user-select: none;
      }
      .rs5-chrome {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 28px;
        padding: 0 12px;
        background: #10100f;
        border-bottom: 1px solid rgba(238,231,221,.06);
        font-size: 10px;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--rs-muted);
        flex-shrink: 0;
      }
      .rs5-chrome__dots { display: flex; gap: 5px; }
      .rs5-chrome__dots i {
        width: 8px; height: 8px; border-radius: 50%;
        background: #2a2825; display: block;
      }
      .rs5-stage {
        position: relative;
        flex: 1;
        min-height: 0;
        background:
          radial-gradient(ellipse 46% 66% at 66% 44%, rgba(125, 104, 75, .14), transparent 72%),
          radial-gradient(ellipse 34% 56% at 78% 46%, rgba(70, 99, 108, .07), transparent 76%),
          #090909;
      }
      .rs5-scroll {
        position: absolute;
        inset: 0;
        overflow: auto;
        opacity: 0;
        pointer-events: none;
        z-index: 0;
      }
      .rs5-scroll__spacer { width: 1px; }
      .rs5-canvas {
        position: absolute;
        inset: 0;
      }
      .rs5-canvas canvas {
        width: 100% !important;
        height: 100% !important;
        display: block;
      }
      .rs5-ui {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
      }
      .rs5-ui * { pointer-events: auto; }
      .rs5-sitehead {
        position: absolute;
        top: 22px;
        left: 42px;
        right: 42px;
        display: flex;
        align-items: center;
        gap: 26px;
        height: 32px;
        z-index: 4;
      }
      .rs5-rings {
        display: flex;
        width: 96px;
        height: 30px;
        align-items: center;
        pointer-events: none;
      }
      .rs5-rings i {
        width: 27px;
        height: 27px;
        margin-right: -5px;
        border: 2px solid var(--rs-bone);
        border-radius: 50%;
        box-sizing: border-box;
      }
      .rs5-system {
        font-size: 10px;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: var(--rs-bone);
        white-space: nowrap;
        pointer-events: none;
      }
      .rs5-nav {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-left: auto;
      }
      .rs5-nav button {
        border: 0;
        background: transparent;
        color: var(--rs-muted);
        font: 500 10px/1 Manrope, Sora, sans-serif;
        letter-spacing: .1em;
        text-transform: uppercase;
        padding: 8px 0;
        cursor: pointer;
        border-bottom: 1px solid transparent;
        transition: color .18s ease, border-color .18s ease;
      }
      .rs5-nav button:hover {
        color: var(--rs-bone);
      }
      .rs5-nav button:focus-visible {
        outline: 1px solid var(--rs-champagne);
        outline-offset: 3px;
      }
      .rs5-nav button[data-on="1"] {
        background: transparent;
        color: var(--rs-bone);
        border-bottom-color: var(--rs-champagne);
      }
      .rs5-hero {
        position: absolute;
        left: 46px;
        top: 94px;
        max-width: 390px;
      }
      .rs5-hero-stats {
        position: absolute;
        right: 52px;
        top: 118px;
        display: grid;
        gap: 18px;
        text-align: right;
        pointer-events: none;
      }
      .rs5-hero-stats strong {
        display: block;
        font-weight: 300;
        font-size: 34px;
        letter-spacing: -.02em;
        line-height: 1;
      }
      .rs5-hero-stats span {
        display: block;
        margin-top: 4px;
        color: var(--rs-muted);
        font-size: 9px;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .rs5-scroll-cue {
        position: absolute;
        left: 50%;
        bottom: 28px;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        z-index: 4;
        pointer-events: none;
        color: var(--rs-muted);
      }
      .rs5-scroll-cue span {
        font-size: 9px;
        letter-spacing: .22em;
        text-transform: uppercase;
      }
      .rs5-scroll-cue i {
        display: block;
        width: 10px;
        height: 10px;
        border-right: 1px solid var(--rs-champagne);
        border-bottom: 1px solid var(--rs-champagne);
        transform: rotate(45deg);
        opacity: .85;
        animation: rs5-scroll-cue 1.6s ease-in-out infinite;
      }
      @keyframes rs5-scroll-cue {
        0%, 100% { transform: translateY(0) rotate(45deg); opacity: .35; }
        50% { transform: translateY(5px) rotate(45deg); opacity: .95; }
      }
      .rs5-root[data-reduced="1"] .rs5-scroll-cue i {
        animation: none;
        opacity: .7;
      }
      .rs5-specs {
        position: absolute;
        left: 46px;
        top: 88px;
        bottom: 40px;
        width: min(440px, 44vw);
        display: flex;
        flex-direction: column;
        pointer-events: none;
        z-index: 2;
      }
      .rs5-specs__engine {
        margin: 0 0 6px;
        font-weight: 300;
        font-size: 22px;
        letter-spacing: .04em;
        color: var(--rs-bone);
      }
      .rs5-specs__models {
        margin: 0 0 12px;
        color: var(--rs-muted);
        font-size: 12px;
        letter-spacing: .04em;
        line-height: 1.4;
      }
      .rs5-specs__note {
        margin: 0 0 10px;
        color: #6e675f;
        font-size: 10px;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .rs5-specs__sheet {
        flex: 1;
        min-height: 0;
        overflow: hidden;
      }
      .rs5-specs__row {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
        gap: 10px 16px;
        padding: 8px 0;
        border-top: 1px solid rgba(63,58,52,.55);
        opacity: 0;
        transform: translate3d(0, 14px, 0);
        transition: opacity .55s cubic-bezier(.22,.8,.28,1), transform .55s cubic-bezier(.22,.8,.28,1);
      }
      .rs5-specs__row:first-child {
        border-top-color: rgba(215,185,143,.35);
      }
      .rs5-specs__row[data-in="1"] {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      .rs5-root[data-reduced="1"] .rs5-specs__row {
        opacity: 1;
        transform: none;
        transition: none;
      }
      .rs5-specs__row dt {
        margin: 0;
        color: var(--rs-muted);
        font-size: 10px;
        letter-spacing: .06em;
        line-height: 1.35;
      }
      .rs5-specs__row dd {
        margin: 0;
        color: var(--rs-bone);
        font-size: 12px;
        font-weight: 400;
        letter-spacing: .01em;
        line-height: 1.4;
        text-align: right;
      }
      .rs5-kicker {
        font-size: 11px;
        letter-spacing: .18em;
        text-transform: uppercase;
        color: var(--rs-champagne);
        margin-bottom: 10px;
      }
      .rs5-title {
        font-weight: 300;
        font-size: clamp(42px, 5vw, 68px);
        line-height: 1.16;
        letter-spacing: -.03em;
        margin: 0 0 12px;
        white-space: pre-line;
      }
      .rs5-sub {
        margin: 0 0 22px;
        color: var(--rs-muted);
        font-size: 14px;
        line-height: 1.45;
        max-width: 34ch;
      }
      .rs5-cta {
        border: 0;
        border-bottom: 1px solid var(--rs-champagne);
        background: transparent;
        color: var(--rs-bone);
        font: 500 10px/1 Manrope, Sora, sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        padding: 10px 0 12px;
        cursor: pointer;
        transition: color .18s ease, border-color .18s ease, opacity .18s ease;
      }
      .rs5-cta:hover {
        color: #fff;
        border-bottom-color: var(--rs-bone);
      }
      .rs5-cta:active { opacity: .82; }
      .rs5-cta:focus-visible {
        outline: 1px solid var(--rs-champagne);
        outline-offset: 4px;
      }
      .rs5-cta--fill {
        border: 0;
        border-radius: 10px;
        background: var(--rs-bone);
        color: #11110f;
        padding: 12px 18px;
        transition: background .18s ease, color .18s ease, transform .18s ease, box-shadow .18s ease;
      }
      .rs5-cta--fill:hover {
        background: var(--rs-champagne);
        color: #11110f;
        box-shadow: 0 0 0 1px rgba(215,185,143,.35);
      }
      .rs5-cta--fill:active {
        transform: translateY(1px);
        background: #c9ab84;
      }
      .rs5-panel {
        position: absolute;
        left: 28px;
        bottom: 28px;
        width: min(420px, calc(100% - 56px));
        padding: 18px 18px 16px;
        background: rgba(21,21,20,.82);
        border: 1px solid rgba(63,58,52,.85);
        border-radius: 16px;
        backdrop-filter: blur(12px);
      }
      .rs5-panel h2 {
        margin: 0 0 6px;
        font-weight: 300;
        font-size: 26px;
        letter-spacing: -.02em;
      }
      .rs5-panel p {
        margin: 0 0 14px;
        color: var(--rs-muted);
        font-size: 12px;
        line-height: 1.45;
      }
      .rs5-panel--config {
        left: 34px;
        top: 108px;
        bottom: auto;
        width: 236px;
        padding: 22px 20px;
      }
      .rs5-panel--config .rs5-panel__lead {
        margin: 0 0 16px;
        font-weight: 300;
        font-size: 22px;
        letter-spacing: -.02em;
      }
      .rs5-panel--config .rs5-panel__note {
        margin: 10px 0 0;
        color: var(--rs-muted);
        font-size: 10px;
        line-height: 1.4;
      }
      .rs5-panel--perf {
        left: auto;
        right: 34px;
        top: 108px;
        bottom: auto;
        width: 210px;
        padding: 22px 20px;
      }
      .rs5-panel--perf .rs5-stat {
        border-color: rgba(63,58,52,.55);
      }
      .rs5-panel--story {
        left: 46px;
        bottom: 98px;
        width: 320px;
        padding: 0;
        background: transparent;
        border: 0;
        border-radius: 0;
        backdrop-filter: none;
      }
      .rs5-panel--story h2 {
        font-size: 34px;
        line-height: 1.18;
        text-transform: uppercase;
      }
      .rs5-panel--dynamics {
        left: 44px;
        top: 270px;
        bottom: auto;
        width: 260px;
      }
      .rs5-dynamics-story {
        top: 92px;
        bottom: auto;
      }
      .rs5-live {
        position: absolute;
        left: 36px;
        top: 84px;
        text-align: left;
        pointer-events: none;
        max-width: 250px;
      }
      .rs5-live__n {
        font-weight: 200;
        font-size: clamp(56px, 6.2vw, 88px);
        letter-spacing: -.06em;
        line-height: .88;
        color: rgba(232, 226, 214, 0.72);
        font-variant-numeric: tabular-nums;
      }
      .rs5-live__u {
        margin-top: 6px;
        font-size: 10px;
        letter-spacing: .2em;
        text-transform: uppercase;
        color: var(--rs-muted);
      }
      .rs5-live__t {
        margin-top: 8px;
        color: var(--rs-champagne);
        font-size: 10px;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .rs5-live__title {
        margin: 16px 0 6px;
        font-weight: 300;
        font-size: 15px;
        letter-spacing: -.015em;
        text-transform: uppercase;
        line-height: 1.2;
      }
      .rs5-live__note {
        margin: 0 0 14px;
        color: var(--rs-muted);
        font-size: 11px;
        line-height: 1.4;
        max-width: 230px;
      }
      .rs5-live__hint {
        margin: 0;
        color: #625c55;
        font-size: 9px;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .rs5-live__actions {
        pointer-events: auto;
      }
      .rs5-load-lab {
        position: absolute;
        right: 42px;
        top: 108px;
        width: 240px;
        padding: 18px 16px;
        border: 1px solid rgba(63,58,52,.85);
        border-radius: 14px;
        background: rgba(21,21,20,.86);
        backdrop-filter: blur(12px);
      }
      .rs5-roll-readout {
        margin-bottom: 16px;
      }
      .rs5-roll-readout strong {
        display: block;
        font-weight: 300;
        font-size: 48px;
        letter-spacing: -.04em;
        line-height: 1;
      }
      .rs5-roll-readout span {
        color: var(--rs-muted);
        font-size: 9px;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .rs5-corners {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px 14px;
      }
      .rs5-corner {
        display: grid;
        gap: 6px;
      }
      .rs5-corner span {
        font-size: 8px;
        letter-spacing: .1em;
        color: var(--rs-muted);
        text-transform: uppercase;
      }
      .rs5-corner i {
        display: block;
        height: 6px;
        border-radius: 4px;
        background: #2a2825;
        overflow: hidden;
      }
      .rs5-corner i::after {
        content: "";
        display: block;
        height: 100%;
        width: var(--load, 40%);
        background: linear-gradient(90deg, var(--rs-cool), var(--rs-champagne));
        transition: width .28s cubic-bezier(.22,.61,.36,1);
      }
      .rs5-dynamics-mode {
        margin-bottom: 14px;
        padding: 12px 12px 11px;
        border: 1px solid rgba(63,58,52,.9);
        background: rgba(14,14,13,.88);
      }
      .rs5-dynamics-mode__kicker {
        display: block;
        margin-bottom: 6px;
        color: #6e675f;
        font-size: 8px;
        letter-spacing: .16em;
        text-transform: uppercase;
      }
      .rs5-dynamics-mode strong {
        display: block;
        font-weight: 400;
        font-size: 15px;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--rs-bone);
      }
      .rs5-dynamics-mode em {
        display: block;
        margin-top: 6px;
        font-style: normal;
        font-size: 10px;
        letter-spacing: .1em;
        text-transform: uppercase;
        color: #6e675f;
      }
      .rs5-dynamics-mode[data-drc="1"] em {
        color: var(--rs-champagne);
      }
      .rs5-dynamics-mode__phase {
        display: block;
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(63,58,52,.7);
        color: var(--rs-cool);
        font-size: 9px;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .rs5-corner[data-hot="1"] i::after {
        background: linear-gradient(90deg, var(--rs-red), var(--rs-champagne));
      }
      .rs5-cabin-dock {
        position: absolute;
        left: 50%;
        bottom: 22px;
        transform: translateX(-50%);
        width: min(560px, calc(100% - 320px));
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 14px 16px;
        border: 1px solid rgba(63,58,52,.85);
        border-radius: 14px;
        background: rgba(21,21,20,.86);
        backdrop-filter: blur(12px);
      }
      .rs5-cabin-dock__copy {
        min-width: 0;
      }
      .rs5-cabin-dock .rs5-sub {
        margin: 0;
        font-size: 11px;
        max-width: 36ch;
      }
      .rs5-cabin-dock .rs5-label { margin-bottom: 8px; }
      .rs5-hotspot {
        position: absolute;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--rs-bone);
        border: 3px solid rgba(215,185,143,.5);
        pointer-events: none;
        z-index: 3;
      }
      .rs5-hotspot::after {
        content: attr(data-label);
        position: absolute;
        left: 20px;
        top: 0;
        white-space: nowrap;
        font-size: 8px;
        letter-spacing: .1em;
        text-transform: uppercase;
        color: var(--rs-champagne);
      }
      .rs5-hotspot--steer { left: 42%; top: 46%; }
      .rs5-hotspot--mmi { left: 54%; top: 38%; }
      .rs5-hotspot--seat { left: 58%; top: 58%; }
      .rs5-root[data-chapter="cabin"][data-cabin="seats"] .rs5-hotspot--steer,
      .rs5-root[data-chapter="cabin"][data-cabin="seats"] .rs5-hotspot--mmi { display: none; }
      .rs5-root[data-chapter="cabin"][data-cabin="seats"] .rs5-hotspot--seat {
        left: 48%;
        top: 52%;
      }
      .rs5-torque-dock {
        position: absolute;
        left: 50%;
        bottom: 26px;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 0;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid rgba(63,58,52,.85);
        background: rgba(21,21,20,.84);
        backdrop-filter: blur(12px);
        pointer-events: none;
      }
      .rs5-torque-dock__mode {
        position: relative;
        padding: 6px 16px;
        font-size: 9px;
        letter-spacing: .12em;
        text-transform: uppercase;
        color: var(--rs-muted);
        white-space: nowrap;
        transition: color .2s ease;
      }
      .rs5-torque-dock__mode + .rs5-torque-dock__mode::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        width: 1px;
        height: 12px;
        margin-top: -6px;
        background: rgba(63,58,52,.9);
      }
      .rs5-torque-dock__mode[data-on="1"] {
        color: var(--rs-bone);
      }
      .rs5-torque-dock__mode[data-on="1"]::after {
        content: "";
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 2px;
        height: 1px;
        background: var(--rs-champagne);
      }
      .rs5-torque-dock__mode em {
        display: block;
        margin-top: 4px;
        font-style: normal;
        font-size: 8px;
        letter-spacing: .1em;
        color: #625c55;
      }
      .rs5-torque-dock__mode[data-on="1"] em {
        color: var(--rs-champagne);
      }
      .rs5-configbar {
        position: absolute;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        min-width: 520px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 8px 12px 8px 16px;
        border: 1px solid rgba(63,58,52,.85);
        border-radius: 12px;
        background: rgba(21,21,20,.86);
        backdrop-filter: blur(12px);
      }
      .rs5-configbar__value {
        font-size: 10px;
        letter-spacing: .08em;
        color: var(--rs-muted);
        text-transform: uppercase;
        line-height: 1.3;
      }
      .rs5-configbar__price {
        font-variant-numeric: tabular-nums;
        font-weight: 300;
        font-size: clamp(18px, 2vw, 22px);
        letter-spacing: -.03em;
        color: var(--rs-bone);
        white-space: nowrap;
        line-height: 1.05;
      }
      .rs5-configbar__price span {
        display: block;
        margin-top: 2px;
        color: var(--rs-muted);
        font-size: 8px;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .rs5-configbar__end {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .rs5-configbar .rs5-cta--fill {
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 11px;
      }
      .rs5-panel__cta {
        margin-top: 14px;
        width: 100%;
        text-align: center;
      }
      .rs5-cabin-dock__price {
        font-variant-numeric: tabular-nums;
        font-weight: 300;
        font-size: 24px;
        letter-spacing: -.03em;
        color: var(--rs-bone);
        text-align: right;
        white-space: nowrap;
      }
      .rs5-cabin-dock__price span {
        display: block;
        margin-top: 4px;
        color: var(--rs-muted);
        font-size: 8px;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .rs5-order {
        position: absolute;
        left: 36px;
        top: 88px;
        bottom: 28px;
        width: min(340px, 34vw);
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 18px 18px 16px;
        border: 1px solid rgba(63,58,52,.85);
        background: rgba(21,21,20,.78);
        pointer-events: auto;
      }
      .rs5-order h2 {
        margin: 0;
        font-weight: 300;
        font-size: 24px;
        letter-spacing: -.02em;
        text-transform: uppercase;
      }
      .rs5-order__note {
        margin: 0;
        color: var(--rs-muted);
        font-size: 11px;
        line-height: 1.4;
      }
      .rs5-order label {
        display: grid;
        gap: 6px;
        color: var(--rs-muted);
        font-size: 9px;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .rs5-order input {
        border: 1px solid rgba(63,58,52,.9);
        background: #151514;
        color: var(--rs-bone);
        font: 400 13px/1.2 Manrope, Sora, sans-serif;
        letter-spacing: .02em;
        padding: 11px 12px;
        border-radius: 0;
      }
      .rs5-order input:focus {
        outline: 1px solid rgba(215,185,143,.55);
        border-color: rgba(215,185,143,.55);
      }
      .rs5-order__summary {
        margin-top: auto;
        padding-top: 12px;
        border-top: 1px solid rgba(63,58,52,.75);
      }
      .rs5-order__summary strong {
        display: block;
        margin-top: 8px;
        font-weight: 300;
        font-size: 28px;
        letter-spacing: -.03em;
        font-variant-numeric: tabular-nums;
      }
      .rs5-order__meta {
        margin-top: 8px;
        color: var(--rs-muted);
        font-size: 10px;
        letter-spacing: .08em;
        text-transform: uppercase;
        line-height: 1.45;
      }
      .rs5-order__done {
        margin: 0;
        color: var(--rs-champagne);
        font-size: 12px;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .rs5-orbit-hint {
        position: absolute;
        left: 50%;
        bottom: 104px;
        transform: translateX(-50%);
        font-size: 9px;
        letter-spacing: .12em;
        color: #625c55;
        text-transform: uppercase;
        pointer-events: none;
      }
      .rs5-camera-rail {
        position: absolute;
        left: 24px;
        top: 92px;
        bottom: 132px;
        width: 118px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 18px 12px;
        background: rgba(21,21,20,.82);
        border: 1px solid rgba(63,58,52,.85);
        border-radius: 14px;
        backdrop-filter: blur(10px);
      }
      .rs5-camera-rail button {
        border: 0;
        background: #242321;
        color: var(--rs-muted);
        font: 500 9px/1 Manrope, Sora, sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        padding: 14px 9px;
        border-radius: 9px;
        text-align: left;
        cursor: pointer;
      }
      .rs5-camera-rail button[data-on="1"] {
        background: var(--rs-bone);
        color: #11110f;
      }
      .rs5-quattro-map {
        position: absolute;
        left: 50%;
        top: 50%;
        width: min(420px, 46vw);
        height: min(520px, 62vh);
        transform: translate(-50%, -52%);
        pointer-events: none;
        color: var(--rs-bone);
      }
      .rs5-quattro-map__rail {
        position: absolute;
        left: 50%;
        border-radius: 999px;
        transform: translateX(-50%);
        box-shadow: 0 0 18px currentColor;
        transition: width .5s cubic-bezier(.22,.61,.36,1), box-shadow .5s ease;
      }
      .rs5-quattro-map__rail--rear {
        top: 12%;
        bottom: 50%;
        color: var(--rs-champagne);
        background: currentColor;
      }
      .rs5-quattro-map__rail--front {
        top: 50%;
        bottom: 12%;
        color: var(--rs-cool);
        background: currentColor;
      }
      .rs5-quattro-map__axle {
        position: absolute;
        left: 14%;
        right: 14%;
        border-radius: 999px;
        background: currentColor;
        box-shadow: 0 0 18px currentColor;
        transition: height .5s cubic-bezier(.22,.61,.36,1), box-shadow .5s ease;
      }
      .rs5-quattro-map__axle::before,
      .rs5-quattro-map__axle::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: currentColor;
        transform: translateY(-50%);
      }
      .rs5-quattro-map__axle::before { left: -6px; }
      .rs5-quattro-map__axle::after { right: -6px; }
      .rs5-quattro-map__axle--rear { top: 12%; color: var(--rs-champagne); }
      .rs5-quattro-map__axle--front { bottom: 12%; color: var(--rs-cool); }
      .rs5-torque-dock {
        display: none;
      }
      .rs5-quattro-map__center {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        min-width: 132px;
        padding: 14px 16px 12px;
        border: 1px solid rgba(63,58,52,.9);
        border-radius: 2px;
        background: rgba(14,14,13,.9);
        text-align: center;
        pointer-events: none;
      }
      .rs5-quattro-map__center-kicker {
        display: block;
        margin-bottom: 8px;
        color: #6e675f;
        font-size: 8px;
        letter-spacing: .18em;
        text-transform: uppercase;
      }
      .rs5-quattro-map__center-mode {
        display: block;
        color: var(--rs-bone);
        font-weight: 400;
        font-size: 13px;
        letter-spacing: .1em;
        text-transform: uppercase;
        line-height: 1.15;
      }
      .rs5-quattro-map__center-ratio {
        display: block;
        margin-top: 10px;
        color: var(--rs-bone);
        font-variant-numeric: tabular-nums;
        font-weight: 300;
        font-size: 20px;
        letter-spacing: .06em;
        line-height: 1;
      }
      .rs5-quattro-map__center[data-mode="front"] .rs5-quattro-map__center-ratio {
        color: var(--rs-cool);
      }
      .rs5-quattro-map__center[data-mode="rear"] .rs5-quattro-map__center-ratio {
        color: var(--rs-champagne);
      }
      .rs5-quattro-map__center[data-mode="normal"] .rs5-quattro-map__center-ratio {
        color: var(--rs-bone);
      }
      .rs5-quattro-map__center-split {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 10px;
        padding-top: 9px;
        border-top: 1px solid rgba(63,58,52,.7);
        color: #6e675f;
        font-size: 8px;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .rs5-quattro-map__center-split span:first-child { color: var(--rs-cool); }
      .rs5-quattro-map__center-split span:last-child { color: var(--rs-champagne); }
      .rs5-quattro-map__label {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 8px;
        line-height: 1.45;
        letter-spacing: .1em;
        text-transform: uppercase;
        text-align: center;
        white-space: nowrap;
      }
      .rs5-quattro-map__label--rear { top: 0; color: var(--rs-champagne); }
      .rs5-quattro-map__label--front { bottom: 0; color: var(--rs-cool); }
      .rs5-explain {
        display: grid;
        gap: 7px;
        margin: 15px 0 0;
        padding: 0;
        list-style: none;
        color: var(--rs-muted);
        font-size: 10px;
        line-height: 1.35;
      }
      .rs5-explain li::before {
        content: "—";
        margin-right: 8px;
        color: var(--rs-champagne);
      }
      .rs5-diff-panel {
        position: absolute;
        right: 58px;
        bottom: 60px;
        width: 300px;
        padding: 18px;
        border-radius: 14px;
        border: 1px solid rgba(63,58,52,.85);
        background: rgba(21,21,20,.82);
      }
      .rs5-vector {
        display: grid;
        grid-template-columns: .65fr 1fr;
        gap: 12px;
        margin-top: 16px;
      }
      .rs5-vector i {
        height: 4px;
        border-radius: 4px;
        background: #686762;
      }
      .rs5-vector i:last-child { background: var(--rs-champagne); }
      .rs5-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }
      .rs5-label {
        width: 100%;
        font-size: 9px;
        letter-spacing: .14em;
        text-transform: uppercase;
        color: var(--rs-muted);
        margin-bottom: 2px;
      }
      .rs5-swatch {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.15);
        transition: border-color .18s ease, transform .15s ease, box-shadow .18s ease;
      }
      .rs5-swatch[data-on="1"] { border-color: var(--rs-bone); }
      .rs5-swatch:hover {
        box-shadow: inset 0 0 0 1px rgba(255,255,255,.28), 0 0 0 1px rgba(215,185,143,.35);
        transform: scale(1.06);
      }
      .rs5-swatch:focus-visible {
        outline: 1px solid var(--rs-champagne);
        outline-offset: 2px;
      }
      .rs5-chip {
        border: 1px solid rgba(63,58,52,.9);
        background: #22211f;
        color: var(--rs-muted);
        font: 500 10px/1 Manrope, Sora, sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        padding: 10px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition:
          background .18s ease,
          color .18s ease,
          border-color .18s ease,
          transform .15s ease,
          box-shadow .18s ease;
      }
      .rs5-chip:hover {
        color: var(--rs-bone);
        border-color: rgba(215,185,143,.55);
        background: #2c2a28;
        box-shadow: inset 0 0 0 1px rgba(215,185,143,.18);
      }
      .rs5-chip:active {
        transform: translateY(1px);
        background: #1a1a1d;
      }
      .rs5-chip:focus-visible {
        outline: 1px solid var(--rs-champagne);
        outline-offset: 2px;
      }
      .rs5-chip:disabled {
        opacity: .45;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      .rs5-chip:disabled:hover {
        color: var(--rs-muted);
        border-color: rgba(63,58,52,.9);
        background: #22211f;
        box-shadow: none;
      }
      .rs5-chip[data-on="1"] {
        background: var(--rs-bone);
        color: #11110f;
        border-color: var(--rs-bone);
        box-shadow: none;
      }
      .rs5-chip[data-on="1"]:hover {
        background: var(--rs-champagne);
        border-color: var(--rs-champagne);
        color: #11110f;
      }
      .rs5-chip[data-on="1"]:disabled:hover {
        background: var(--rs-bone);
        border-color: var(--rs-bone);
        color: #11110f;
      }
      .rs5-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 8px 0;
        border-top: 1px solid rgba(63,58,52,.55);
        font-size: 11px;
        color: var(--rs-bone);
      }
      .rs5-toggle button {
        border: 0;
        min-width: 42px;
        padding: 6px 10px;
        border-radius: 999px;
        background: #22211f;
        color: var(--rs-muted);
        font: 600 9px/1 Manrope, Sora, sans-serif;
        letter-spacing: .08em;
        text-transform: uppercase;
        cursor: pointer;
        transition: background .18s ease, color .18s ease, transform .15s ease;
      }
      .rs5-toggle button:hover {
        color: var(--rs-bone);
        background: #2c2a28;
      }
      .rs5-toggle button:active { transform: translateY(1px); }
      .rs5-toggle button:focus-visible {
        outline: 1px solid var(--rs-champagne);
        outline-offset: 2px;
      }
      .rs5-toggle button[data-on="1"] {
        background: var(--rs-red);
        color: #fff;
      }
      .rs5-toggle button[data-on="1"]:hover {
        background: #f05a6b;
        color: #fff;
      }
      .rs5-side {
        position: absolute;
        right: 28px;
        top: 70px;
        width: 180px;
        padding: 16px;
        background: rgba(21,21,20,.78);
        border: 1px solid rgba(63,58,52,.8);
        border-radius: 14px;
        backdrop-filter: blur(10px);
      }
      .rs5-side__title {
        font-size: 9px;
        letter-spacing: .14em;
        text-transform: uppercase;
        color: var(--rs-champagne);
        margin-bottom: 12px;
      }
      .rs5-stat {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        padding: 7px 0;
        border-bottom: 1px solid rgba(63,58,52,.45);
        font-size: 12px;
      }
      .rs5-stat span:first-child { color: var(--rs-muted); font-size: 10px; letter-spacing: .08em; text-transform: uppercase; }
      .rs5-stat strong { font-weight: 500; }
      .rs5-side--plain {
        top: 86px;
        right: 46px;
        background: transparent;
        border: 0;
        backdrop-filter: none;
      }
      .rs5-axle {
        position: absolute;
        pointer-events: none;
        text-align: center;
      }
      .rs5-axle--rear {
        left: 42px;
        top: 96px;
        transform: none;
        text-align: left;
        color: var(--rs-champagne);
      }
      .rs5-axle--front {
        right: 42px;
        top: auto;
        bottom: 130px;
        left: auto;
        transform: none;
        text-align: right;
        color: var(--rs-cool);
      }
      .rs5-axle strong {
        display: block;
        font-weight: 300;
        font-size: 74px;
        line-height: 1;
        letter-spacing: -.05em;
      }
      .rs5-axle span {
        font-size: 8px;
        letter-spacing: .14em;
        color: var(--rs-muted);
        text-transform: uppercase;
      }
      .rs5-timeline {
        position: absolute;
        left: 36px;
        right: 36px;
        bottom: 38px;
        height: 2px;
        background: #3e3732;
      }
      .rs5-timeline__fill {
        height: 100%;
        background: var(--rs-champagne);
        width: 0%;
      }
      .rs5-timeline__pulse {
        position: absolute;
        top: -7px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--rs-red);
        transform: translateX(-50%);
      }
      .rs5-timeline__ticks {
        position: absolute;
        left: 0;
        right: 0;
        top: 14px;
        display: flex;
        justify-content: space-between;
        color: #665f57;
        font-size: 8px;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      .rs5-load {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(9,9,9,.72);
        z-index: 5;
        pointer-events: none;
      }
      .rs5-load__inner {
        width: min(280px, 70%);
        text-align: center;
      }
      .rs5-load__bar {
        height: 2px;
        background: #2a2622;
        margin-top: 14px;
        border-radius: 2px;
        overflow: hidden;
      }
      .rs5-load__bar i {
        display: block;
        height: 100%;
        background: var(--rs-champagne);
        width: 0%;
      }
      .rs5-root[data-mode="thumb"] .rs5-nav,
      .rs5-root[data-mode="thumb"] .rs5-panel,
      .rs5-root[data-mode="thumb"] .rs5-side,
      .rs5-root[data-mode="thumb"] .rs5-load {
        display: none;
      }
      .rs5-thumb {
        display: none;
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 70% 55% at 65% 45%, rgba(122,37,50,.28), transparent 60%),
          radial-gradient(ellipse 50% 40% at 30% 70%, rgba(215,185,143,.12), transparent 55%),
          #090909;
        z-index: 3;
        padding: 28px;
      }
      .rs5-root[data-mode="thumb"] .rs5-thumb { display: flex; flex-direction: column; justify-content: flex-end; }
      .rs5-root[data-mode="thumb"] .rs5-canvas { display: none; }
      .rs5-thumb__brand {
        font-size: 11px;
        letter-spacing: .2em;
        text-transform: uppercase;
        color: var(--rs-champagne);
        margin-bottom: 10px;
      }
      .rs5-thumb__title {
        font-weight: 300;
        font-size: 42px;
        letter-spacing: -.03em;
        margin: 0 0 8px;
      }
      .rs5-thumb__tag {
        color: var(--rs-muted);
        font-size: 12px;
      }
      .rs5-silhouette {
        position: absolute;
        right: 6%;
        top: 18%;
        width: 58%;
        height: 52%;
        background:
          linear-gradient(135deg, #f4eee3 0%, #a58d6d 22%, #eee6d9 48%, #4d4439 72%, #151412 100%);
        clip-path: polygon(8% 62%, 12% 42%, 24% 34%, 34% 16%, 64% 14%, 78% 30%, 92% 40%, 98% 56%, 94% 68%, 10% 68%);
        opacity: .92;
        filter: drop-shadow(0 18px 28px rgba(0,0,0,.55));
      }
      @media (max-width: 820px) {
        .rs5-sitehead { left: 14px; right: 14px; gap: 12px; }
        .rs5-rings { width: 72px; transform: scale(.8); transform-origin: left center; }
        .rs5-system { display: none; }
        .rs5-nav { gap: 12px; overflow-x: auto; }
        .rs5-hero, .rs5-panel, .rs5-specs { left: 14px; right: 14px; width: auto; bottom: 18px; }
        .rs5-specs { top: 70px; bottom: 24px; }
        .rs5-specs__row { grid-template-columns: 1fr; gap: 4px; }
        .rs5-specs__row dd { text-align: left; }
        .rs5-side { display: none; }
        .rs5-live { left: 14px; top: 70px; }
        .rs5-live__n { font-size: 40px; }
        .rs5-configbar, .rs5-cabin-dock { min-width: 0; width: calc(100% - 28px); }
        .rs5-camera-rail, .rs5-quattro-map, .rs5-load-lab { display: none; }
        .rs5-diff-panel { display: none; }
      }
    `}</style>
  );
}

export function AudiRs5Site({ accent, locale, mode }: Props) {
  const t = COPY[locale] ?? COPY.en;
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadProgress, setLoadProgress] = useState(0);
  const [launchT, setLaunchT] = useState(0);
  const [torqueLive, setTorqueLive] = useState({ front: 15, rear: 85, mode: "rear" as TorqueState });
  const [dynamicsLive, setDynamicsLive] = useState<DynamicsLive>(() => dynamicsFromScrollLocal(0));
  const [orderSent, setOrderSent] = useState(false);
  const [chapterOverride, setChapterOverride] = useState<ChapterId | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const launchTRef = useRef(0);
  const launchTargetRef = useRef(0);
  const torqueFrontRef = useRef(15);
  const torqueRearRef = useRef(85);
  const torqueTargetRef = useRef({ front: 15, rear: 85, mode: "rear" as TorqueState });
  const dynamicsRef = useRef<DynamicsLive>(dynamicsFromScrollLocal(0));
  const chapterOverrideRef = useRef<ChapterId | null>(null);
  chapterOverrideRef.current = chapterOverride;
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mapped = chapterFromScrollProgress(progress);
  const chapter: ChapterId =
    mode === "thumb" ? "hero" : chapterOverride ?? mapped.id;
  const activeChapter = chapter;
  const specsReveal =
    activeChapter === "specs"
      ? reducedMotion
        ? TECH_DATA.rows.length
        : specsRowsRevealed(mapped.id === "specs" ? mapped.local : 1, TECH_DATA.rows.length)
      : 0;
  const totalVh = scrollSpineTotalVh();
  const torqueFront = Math.round(torqueLive.front);
  const torqueRear = Math.round(torqueLive.rear);
  const torqueMode = torqueLive.mode;
  const strokeFront = `${(2 + torqueLive.front / 18).toFixed(2)}px`;
  const strokeRear = `${(2 + torqueLive.rear / 18).toFixed(2)}px`;

  const sceneState = useMemo(
    () => ({
      chapter: activeChapter,
      config,
      launchT,
      dynamicsRollDeg: dynamicsLive.rollDeg,
      reducedMotion,
    }),
    [activeChapter, config, launchT, dynamicsLive.rollDeg, reducedMotion],
  );

  const jumpToProgress = (next: number, opts?: { override?: ChapterId | null }) => {
    const el = scrollRef.current;
    const p = Math.min(1, Math.max(0, next));
    targetProgressRef.current = p;
    progressRef.current = p;
    if (el) {
      const max = Math.max(1, el.scrollHeight - el.clientHeight);
      el.scrollTop = p * max;
    }
    setProgress(p);
    if (opts && "override" in opts) {
      setChapterOverride(opts.override ?? null);
    } else {
      setChapterOverride(null);
    }
    // Snap launch / torque readouts so nav jumps don't ease across scenes.
    const landed = chapterFromScrollProgress(p);
    const launch =
      landed.id === "acceleration"
        ? launchTFromAccelLocal(landed.local)
        : landed.index < SCROLL_SPINE.indexOf("acceleration")
          ? 0
          : 1;
    launchTargetRef.current = launch;
    launchTRef.current = launch;
    setLaunchT(launch);

    const torqueSnap =
      landed.id === "quattro"
        ? torqueFromQuattroLocal(landed.local)
        : landed.index < SCROLL_SPINE.indexOf("quattro")
          ? torqueFromQuattroLocal(0)
          : torqueFromQuattroLocal(1);
    torqueTargetRef.current = torqueSnap;
    torqueFrontRef.current = torqueSnap.front;
    torqueRearRef.current = torqueSnap.rear;
    setTorqueLive(torqueSnap);

    const dynamicsSnap =
      landed.id === "dynamics"
        ? dynamicsFromScrollLocal(landed.local)
        : landed.index < SCROLL_SPINE.indexOf("dynamics")
          ? dynamicsFromScrollLocal(0)
          : dynamicsFromScrollLocal(1);
    dynamicsRef.current = dynamicsSnap;
    setDynamicsLive(dynamicsSnap);
  };

  const goChapter = (id: ChapterId) => {
    if (id === "order" || id === "cabin") {
      setChapterOverride(id);
      return;
    }
    if (id === "exterior") {
      jumpToProgress(progressForChapterStart("exterior"), { override: "exterior" });
      return;
    }
    if (SCROLL_SPINE.includes(id)) {
      jumpToProgress(progressForChapterStart(id));
      return;
    }
    setChapterOverride(id);
  };

  useEffect(() => {
    if (!isLive(mode)) return;
    const el = scrollRef.current;
    const stage = el?.parentElement;
    if (!el || !stage) return;
    let raf = 0;
    let touchY = 0;
    let running = true;
    const accelIndex = SCROLL_SPINE.indexOf("acceleration");

    const isConfiguratorLocked = () => {
      const o = chapterOverrideRef.current;
      if (o === "exterior" || o === "cabin" || o === "order") return true;
      return chapterFromScrollProgress(progressRef.current).id === "exterior";
    };

    const maxScroll = () => Math.max(1, el.scrollHeight - el.clientHeight);
    const applyTarget = (next: number) => {
      if (isConfiguratorLocked()) return;
      targetProgressRef.current = Math.min(1, Math.max(0, next));
      setChapterOverride(null);
    };

    const tick = () => {
      if (!running) return;
      const cur = progressRef.current;
      const tgt = targetProgressRef.current;
      const chapterCur = chapterFromScrollProgress(cur);
      const atAccel = chapterCur.id === "acceleration";
      const atQuattro = chapterCur.id === "quattro";
      const atDynamics = chapterCur.id === "dynamics";
      const atSpecsHold = chapterCur.id === "specs" && specsIsHold(chapterCur.local);
      const ease =
        atAccel || atQuattro || atDynamics || atSpecsHold
          ? atSpecsHold
            ? 0.032
            : atAccel
              ? 0.045
              : 0.038
          : 0.08;
      const next = cur + (tgt - cur) * ease;
      progressRef.current = Math.abs(tgt - next) < 0.00004 ? tgt : next;
      el.scrollTop = progressRef.current * maxScroll();
      setProgress((p) => (Math.abs(p - progressRef.current) < 0.00003 ? p : progressRef.current));

      const mappedNow = chapterFromScrollProgress(progressRef.current);
      let launchWanted = launchTargetRef.current;
      if (mappedNow.id === "acceleration") {
        launchWanted = launchTFromAccelLocal(mappedNow.local);
      } else if (mappedNow.index < accelIndex) {
        launchWanted = 0;
      } else {
        launchWanted = 1;
      }
      launchTargetRef.current = launchWanted;
      const launchEase = atAccel || Math.abs(launchWanted - launchTRef.current) > 0.002 ? 0.085 : 0.16;
      const launchNext = launchTRef.current + (launchWanted - launchTRef.current) * launchEase;
      launchTRef.current = Math.abs(launchWanted - launchNext) < 0.0002 ? launchWanted : launchNext;
      setLaunchT((v) => (Math.abs(v - launchTRef.current) < 0.0004 ? v : launchTRef.current));

      const quattroIndex = SCROLL_SPINE.indexOf("quattro");
      const torqueWanted =
        mappedNow.id === "quattro"
          ? torqueFromQuattroLocal(mappedNow.local)
          : mappedNow.index < quattroIndex
            ? torqueFromQuattroLocal(0)
            : torqueFromQuattroLocal(1);
      torqueTargetRef.current = torqueWanted;
      const torqueEase = atQuattro ? 0.048 : 0.14;
      torqueFrontRef.current += (torqueWanted.front - torqueFrontRef.current) * torqueEase;
      torqueRearRef.current += (torqueWanted.rear - torqueRearRef.current) * torqueEase;
      if (Math.abs(torqueWanted.front - torqueFrontRef.current) < 0.02) torqueFrontRef.current = torqueWanted.front;
      if (Math.abs(torqueWanted.rear - torqueRearRef.current) < 0.02) torqueRearRef.current = torqueWanted.rear;
      setTorqueLive((prev) => {
        const front = torqueFrontRef.current;
        const rear = torqueRearRef.current;
        const mode = torqueWanted.mode;
        if (
          Math.abs(prev.front - front) < 0.04 &&
          Math.abs(prev.rear - rear) < 0.04 &&
          prev.mode === mode
        ) {
          return prev;
        }
        return { front, rear, mode };
      });

      const dynamicsIndex = SCROLL_SPINE.indexOf("dynamics");
      const dynamicsWanted =
        mappedNow.id === "dynamics"
          ? dynamicsFromScrollLocal(mappedNow.local)
          : mappedNow.index < dynamicsIndex
            ? dynamicsFromScrollLocal(0)
            : dynamicsFromScrollLocal(1);
      const dynEase = atDynamics ? 0.055 : 0.16;
      const prev = dynamicsRef.current;
      const blended: DynamicsLive = {
        damper: dynamicsWanted.damper,
        drc: dynamicsWanted.drc,
        phase: dynamicsWanted.phase,
        rollDeg: prev.rollDeg + (dynamicsWanted.rollDeg - prev.rollDeg) * dynEase,
        fl: prev.fl + (dynamicsWanted.fl - prev.fl) * dynEase,
        fr: prev.fr + (dynamicsWanted.fr - prev.fr) * dynEase,
        rl: prev.rl + (dynamicsWanted.rl - prev.rl) * dynEase,
        rr: prev.rr + (dynamicsWanted.rr - prev.rr) * dynEase,
      };
      dynamicsRef.current = blended;
      setDynamicsLive((p) => {
        if (
          p.damper === blended.damper &&
          p.drc === blended.drc &&
          p.phase === blended.phase &&
          Math.abs(p.rollDeg - blended.rollDeg) < 0.03 &&
          Math.abs(p.fl - blended.fl) < 0.15
        ) {
          return p;
        }
        return blended;
      });
      // Keep config in sync for any leftover consumers.
      if (mappedNow.id === "dynamics") {
        setConfig((c) =>
          c.damper === dynamicsWanted.damper && c.drc === dynamicsWanted.drc
            ? c
            : { ...c, damper: dynamicsWanted.damper, drc: dynamicsWanted.drc },
        );
      }

      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isConfiguratorLocked()) return;
      const pixels =
        e.deltaMode === 1 ? e.deltaY * 18 : e.deltaMode === 2 ? e.deltaY * el.clientHeight : e.deltaY;
      const chapterNow = chapterFromScrollProgress(targetProgressRef.current);
      const sensitivity =
        chapterNow.id === "acceleration"
          ? chapterNow.local >= 0.7
            ? 8.5
            : 7.2
          : chapterNow.id === "quattro"
            ? quattroIsHold(chapterNow.local)
              ? 8.2
              : 6.6
            : chapterNow.id === "dynamics"
              ? dynamicsIsHold(chapterNow.local)
                ? 8.0
                : 6.5
              : chapterNow.id === "specs"
                ? specsIsHold(chapterNow.local)
                  ? 9.0
                  : 6.8
                : 5.0;
      applyTarget(targetProgressRef.current + pixels / (el.clientHeight * sensitivity));
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isConfiguratorLocked()) return;
      const y = e.touches[0]?.clientY ?? touchY;
      applyTarget(targetProgressRef.current + (touchY - y) / (el.clientHeight * 2.2));
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
    };
  }, [mode]);

  useEffect(() => {
    if (activeChapter !== "order") setOrderSent(false);
  }, [activeChapter]);

  const patch = (partial: Partial<ConfigState>) => setConfig((c) => ({ ...c, ...partial }));

  const url = `${t.host} / ${activeChapter}`;
  const launchTime = launchTelemetry(launchT).timeS;
  const totalPrice = priceEuro(config);
  const priceLabel = formatEuro(totalPrice);
  const configLine = `${PAINTS.find((p) => p.id === config.paint)?.label[locale]} · ${
    WHEELS.find((w) => w.id === config.wheel)?.label[locale]
  } · ${INTERIORS.find((i) => i.id === config.interior)?.label[locale]}`;
  const phaseLabel =
    dynamicsLive.phase === "entry"
      ? t.phaseEntry
      : dynamicsLive.phase === "peak"
        ? t.phasePeak
        : t.phaseExit;

  return (
    <div
      className="rs5-root"
      data-mode={mode}
      data-chapter={activeChapter}
      data-cabin={config.cabinView}
      data-reduced={reducedMotion ? 1 : 0}
      style={{ "--live-a": accent } as CSSProperties}
    >
      <Styles />
      {mode !== "immersive" && (
        <header className="rs5-chrome" aria-hidden>
          <span className="rs5-chrome__dots">
            <i />
            <i />
            <i />
          </span>
          <span>{url}</span>
        </header>
      )}

      <div className="rs5-stage">
        {isLive(mode) && (
          <div className="rs5-scroll" ref={scrollRef} aria-hidden>
            <div className="rs5-scroll__spacer" style={{ height: `${totalVh}vh` }} />
          </div>
        )}
        {isLive(mode) && (
          <AudiRs5Canvas
            className="rs5-canvas"
            state={sceneState}
            onReady={() => setReady(true)}
            onProgress={setLoadProgress}
          />
        )}

        <div className="rs5-thumb" aria-hidden={mode !== "thumb"}>
          <div className="rs5-silhouette" />
          <div className="rs5-thumb__brand">Audi · {t.brand}</div>
          <h2 className="rs5-thumb__title">{t.heroTitle}</h2>
          <div className="rs5-thumb__tag">{t.thumbTag}</div>
        </div>

        <div className="rs5-ui">
          {isLive(mode) && (
            <header className="rs5-sitehead">
              <span className="rs5-rings" aria-label="Audi">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="rs5-system">
                RS 5 /{" "}
                {activeChapter === "acceleration"
                  ? "Distance Strip"
                  : activeChapter === "dynamics"
                    ? "Load Lab"
                    : activeChapter === "cabin"
                      ? "Configurator"
                      : CHAPTERS.find((c) => c.id === activeChapter)?.label.en}
              </span>
              <nav className="rs5-nav" aria-label="RS5 chapters">
                {CHAPTERS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    data-on={
                      activeChapter === c.id || (c.id === "exterior" && activeChapter === "cabin") ? 1 : 0
                    }
                    onClick={() => goChapter(c.id)}
                  >
                    {c.label[locale]}
                  </button>
                ))}
              </nav>
            </header>
          )}

          {activeChapter === "hero" && (
            <>
              <div className="rs5-hero">
                <div className="rs5-kicker">Audi {t.brand} Sportback</div>
                <h1 className="rs5-title">{t.heroTitle}</h1>
                <p className="rs5-sub">{t.heroSub}</p>
                {isLive(mode) && (
                  <button type="button" className="rs5-cta" onClick={() => goChapter("exterior")}>
                    {t.explore}
                  </button>
                )}
              </div>
              <div className="rs5-hero-stats" aria-hidden>
                <div>
                  <strong>{SPECS.powerPs}</strong>
                  <span>PS</span>
                </div>
                <div>
                  <strong>{SPECS.torqueNm}</strong>
                  <span>Nm</span>
                </div>
                <div>
                  <strong>{SPECS.zeroToHundred}</strong>
                  <span>0–100 s</span>
                </div>
              </div>
              {isLive(mode) && (
                <div className="rs5-scroll-cue" aria-hidden>
                  <span>{t.scrollHint}</span>
                  <i />
                </div>
              )}
            </>
          )}

          {activeChapter === "specs" && (
            <section className="rs5-specs" aria-label={t.specsKicker}>
              <div className="rs5-kicker">{t.specsKicker}</div>
              <h2 className="rs5-specs__engine">{TECH_DATA.engine}</h2>
              <p className="rs5-specs__models">{TECH_DATA.models[locale]}</p>
              <p className="rs5-specs__note">{t.specsNote}</p>
              <dl className="rs5-specs__sheet">
                {TECH_DATA.rows.map((row, i) => (
                  <div
                    key={row.label.en}
                    className="rs5-specs__row"
                    data-in={specsReveal > i ? 1 : 0}
                  >
                    <dt>{row.label[locale]}</dt>
                    <dd>{row.value[locale]}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {activeChapter === "exterior" && (
            <>
              <div className="rs5-panel rs5-panel--config">
                <div className="rs5-kicker">{t.body}</div>
                <div className="rs5-panel__lead">{t.selectLight}</div>
                <div className="rs5-label">{t.paint}</div>
                <div className="rs5-row">
                  {PAINTS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="rs5-swatch"
                      title={p.label[locale]}
                      data-on={config.paint === p.id ? 1 : 0}
                      style={{ background: p.hex }}
                      onClick={() => patch({ paint: p.id })}
                    />
                  ))}
                </div>
                <div className="rs5-label">{t.wheels}</div>
                <div className="rs5-row">
                  {WHEELS.map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      className="rs5-swatch"
                      title={w.label[locale]}
                      data-on={config.wheel === w.id ? 1 : 0}
                      style={{ background: w.hex }}
                      onClick={() => patch({ wheel: w.id })}
                    />
                  ))}
                </div>
                <div className="rs5-label">{t.calipers}</div>
                <div className="rs5-row">
                  {CALIPERS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="rs5-swatch"
                      title={c.label[locale]}
                      data-on={config.caliper === c.id ? 1 : 0}
                      style={{ background: c.hex }}
                      onClick={() => patch({ caliper: c.id })}
                    />
                  ))}
                </div>
                <div className="rs5-label">{t.options}</div>
                <div className="rs5-toggle">
                  <span>{t.dynamicPkg}</span>
                  <button
                    type="button"
                    data-on={config.dynamicPackage ? 1 : 0}
                    onClick={() => patch({ dynamicPackage: !config.dynamicPackage })}
                  >
                    {config.dynamicPackage ? "On" : "Off"}
                  </button>
                </div>
                <div className="rs5-toggle">
                  <span>{t.sportExhaust}</span>
                  <button
                    type="button"
                    data-on={config.sportExhaust ? 1 : 0}
                    onClick={() => patch({ sportExhaust: !config.sportExhaust })}
                  >
                    {config.sportExhaust ? "On" : "Off"}
                  </button>
                </div>
                <p className="rs5-panel__note">{t.surfaceNote}</p>
                <button
                  type="button"
                  className="rs5-cta rs5-cta--fill rs5-panel__cta"
                  onClick={() => goChapter("cabin")}
                >
                  {t.toInterior}
                </button>
              </div>
              <aside className="rs5-panel rs5-panel--perf">
                <div className="rs5-kicker">{t.performance}</div>
                <div className="rs5-side__title">Your RS 5</div>
                <div className="rs5-stat">
                  <span>Power</span>
                  <strong>{SPECS.powerPs} PS</strong>
                </div>
                <div className="rs5-stat">
                  <span>Torque</span>
                  <strong>{SPECS.torqueNm} Nm</strong>
                </div>
                <div className="rs5-stat">
                  <span>0–100</span>
                  <strong>{SPECS.zeroToHundred} s</strong>
                </div>
                <div className="rs5-stat">
                  <span>Vmax</span>
                  <strong>{topSpeedFor(config)} km/h</strong>
                </div>
              </aside>
              <div className="rs5-orbit-hint">{t.drag}</div>
              <div className="rs5-configbar">
                <span className="rs5-configbar__value">{configLine}</span>
                <div className="rs5-configbar__end">
                  <div className="rs5-configbar__price">
                    {priceLabel}
                    <span>{t.from}</span>
                  </div>
                  <button type="button" className="rs5-cta rs5-cta--fill" onClick={() => goChapter("order")}>
                    Order →
                  </button>
                </div>
              </div>
            </>
          )}

          {activeChapter === "acceleration" && (
            <>
              <div className="rs5-live">
                <div className="rs5-live__n" aria-hidden>
                  {launchTime.toFixed(1)}
                </div>
                <div className="rs5-live__u" aria-hidden>
                  {t.seconds}
                </div>
                <div className="rs5-live__t" aria-hidden>
                  0–100 · {SPECS.zeroToHundredDistanceM} m
                </div>
                <h2 className="rs5-live__title">{t.accelTitle}</h2>
                <p className="rs5-live__note">{t.accelNote}</p>
                <p className="rs5-live__hint">{t.scrollStrip}</p>
              </div>
            </>
          )}

          {activeChapter === "quattro" && (
            <>
              <div className="rs5-quattro-map" aria-hidden>
                <i
                  className="rs5-quattro-map__rail rs5-quattro-map__rail--rear"
                  style={{ width: strokeRear }}
                />
                <i
                  className="rs5-quattro-map__rail rs5-quattro-map__rail--front"
                  style={{ width: strokeFront }}
                />
                <i
                  className="rs5-quattro-map__axle rs5-quattro-map__axle--rear"
                  style={{ height: strokeRear }}
                />
                <i
                  className="rs5-quattro-map__axle rs5-quattro-map__axle--front"
                  style={{ height: strokeFront }}
                />
                <div className="rs5-quattro-map__center" data-mode={torqueMode}>
                  <span className="rs5-quattro-map__center-kicker">quattro · split</span>
                  <span className="rs5-quattro-map__center-mode">
                    {TORQUE_STATES.find((s) => s.id === torqueMode)?.label[locale] ?? torqueMode}
                  </span>
                  <strong className="rs5-quattro-map__center-ratio">
                    {torqueFront}:{torqueRear}
                  </strong>
                  <div className="rs5-quattro-map__center-split">
                    <span>Front {torqueFront}%</span>
                    <span>Rear {torqueRear}%</span>
                  </div>
                </div>
              </div>
              <div className="rs5-axle rs5-axle--rear">
                <strong>{torqueRear}</strong>
                <span>Rear axle / %</span>
              </div>
              <div className="rs5-axle rs5-axle--front">
                <strong>{torqueFront}</strong>
                <span>Front axle / %</span>
              </div>
              <div className="rs5-panel rs5-panel--story">
                <h2>{t.quattroTitle}</h2>
                <p>{t.quattroNote}</p>
                <ul className="rs5-explain">
                  <li>Scroll shifts torque from Max rear to Max front.</li>
                  <li>Line weight shows the current torque share.</li>
                </ul>
                <div className="rs5-toggle">
                  <span>{t.sportDiff}</span>
                  <button
                    type="button"
                    data-on={config.sportDiff ? 1 : 0}
                    onClick={() => patch({ sportDiff: !config.sportDiff })}
                  >
                    {config.sportDiff ? "On" : "Off"}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeChapter === "dynamics" && (
            <>
              <div className="rs5-panel rs5-panel--story rs5-dynamics-story">
                <div className="rs5-kicker">{t.loadLab}</div>
                <h2>{t.dynamicsTitle}</h2>
                <p>{t.dynamicsNote}</p>
                <p className="rs5-live__hint">{t.scrollLoad}</p>
              </div>
              <div className="rs5-panel rs5-panel--dynamics">
                <div className="rs5-dynamics-mode" data-drc={dynamicsLive.drc ? 1 : 0}>
                  <span className="rs5-dynamics-mode__kicker">Damper · DRC</span>
                  <strong>
                    {DAMPERS.find((d) => d.id === dynamicsLive.damper)?.label[locale] ?? dynamicsLive.damper}
                  </strong>
                  <em>{dynamicsLive.drc ? t.drcOn : t.drcOff}</em>
                  <span className="rs5-dynamics-mode__phase">{phaseLabel}</span>
                </div>
                <div className="rs5-toggle">
                  <span>{t.sportDiff}</span>
                  <button
                    type="button"
                    data-on={config.sportDiff ? 1 : 0}
                    onClick={() => patch({ sportDiff: !config.sportDiff })}
                  >
                    {config.sportDiff ? "On" : "Off"}
                  </button>
                </div>
              </div>
              <aside className="rs5-load-lab">
                <div className="rs5-roll-readout">
                  <strong>{dynamicsLive.rollDeg.toFixed(1)}°</strong>
                  <span>{t.bodyRoll}</span>
                </div>
                <div className="rs5-label">{t.cornerLoad}</div>
                <div className="rs5-corners">
                  {(
                    [
                      ["fl", t.fl, dynamicsLive.fl],
                      ["fr", t.fr, dynamicsLive.fr],
                      ["rl", t.rl, dynamicsLive.rl],
                      ["rr", t.rr, dynamicsLive.rr],
                    ] as const
                  ).map(([id, label, load]) => (
                    <div key={id} className="rs5-corner" data-hot={load > 55 ? 1 : 0}>
                      <span>{label}</span>
                      <i style={{ "--load": `${load}%` } as CSSProperties} />
                    </div>
                  ))}
                </div>
                <div className="rs5-configbar__value" style={{ marginTop: 14 }}>
                  {dynamicsLive.drc ? "DRC cross-links diagonals" : "Open dampers · free diagonal load"}
                </div>
              </aside>
              <aside className="rs5-diff-panel">
                <div className="rs5-side__title">Sport differential</div>
                <div className="rs5-configbar__value">
                  {config.sportDiff ? "Outer rear receives more torque" : "Open rear distribution"}
                </div>
                <div className="rs5-vector" aria-hidden>
                  <i style={{ opacity: config.sportDiff ? 0.45 : 0.9 }} />
                  <i style={{ opacity: config.sportDiff ? 1 : 0.35 }} />
                </div>
              </aside>
            </>
          )}

          {activeChapter === "cabin" && (
            <>
              <div className="rs5-camera-rail">
                <div className="rs5-label">Camera</div>
                {CABIN_VIEWS.map((view, index) => (
                  <button
                    key={view.id}
                    type="button"
                    data-on={config.cabinView === view.id ? 1 : 0}
                    onClick={() => patch({ cabinView: view.id })}
                  >
                    0{index + 1} · {view.label[locale]}
                  </button>
                ))}
              </div>
              {config.cabinView === "driver" && (
                <>
                  <span className="rs5-hotspot rs5-hotspot--steer" data-label="Steering / Alcantara" />
                  <span className="rs5-hotspot rs5-hotspot--mmi" data-label="MMI / RS Monitor" />
                  <span className="rs5-hotspot rs5-hotspot--seat" data-label="Nappa / stitch" />
                </>
              )}
              {config.cabinView === "seats" && (
                <span className="rs5-hotspot rs5-hotspot--seat" data-label="Nappa / honeycomb" />
              )}
              <div className="rs5-cabin-dock">
                <div className="rs5-cabin-dock__copy">
                  <div className="rs5-kicker">{t.cabinTitle}</div>
                  <p className="rs5-sub">{t.cabinNote}</p>
                  <button
                    type="button"
                    className="rs5-cta rs5-cta--fill rs5-panel__cta"
                    onClick={() => goChapter("exterior")}
                  >
                    {t.toExterior}
                  </button>
                </div>
                <div>
                  <div className="rs5-label">Cabin material</div>
                  <div className="rs5-row">
                    {INTERIORS.map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        className="rs5-swatch"
                        title={i.label[locale]}
                        data-on={config.interior === i.id ? 1 : 0}
                        style={{ background: i.hex }}
                        onClick={() => patch({ interior: i.id })}
                      />
                    ))}
                  </div>
                </div>
                <div className="rs5-cabin-dock__price">
                  {priceLabel}
                  <span>{t.from}</span>
                  <button
                    type="button"
                    className="rs5-cta rs5-cta--fill rs5-panel__cta"
                    onClick={() => goChapter("order")}
                  >
                    Order →
                  </button>
                </div>
              </div>
              <aside className="rs5-side">
                <div className="rs5-side__title">{t.monitor}</div>
                <div className="rs5-stat">
                  <span>G lateral</span>
                  <strong>0.84</strong>
                </div>
                <div className="rs5-stat">
                  <span>Oil</span>
                  <strong>96°C</strong>
                </div>
                <div className="rs5-stat">
                  <span>Boost</span>
                  <strong>1.4 bar</strong>
                </div>
                <div className="rs5-stat">
                  <span>Tyre R</span>
                  <strong>45°C</strong>
                </div>
                <div className="rs5-stat">
                  <span>Drive</span>
                  <strong>quattro</strong>
                </div>
              </aside>
            </>
          )}

          {activeChapter === "order" && (
            <>
              <form
                className="rs5-order"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOrderSent(true);
                }}
              >
                <div className="rs5-kicker">Order</div>
                <h2>{t.orderTitle}</h2>
                <p className="rs5-order__note">{t.orderNote}</p>
                {orderSent ? (
                  <p className="rs5-order__done">{t.orderDone}</p>
                ) : (
                  <>
                    <label>
                      {t.orderName}
                      <input name="name" autoComplete="name" required />
                    </label>
                    <label>
                      {t.orderEmail}
                      <input name="email" type="email" autoComplete="email" required />
                    </label>
                    <label>
                      {t.orderPhone}
                      <input name="phone" type="tel" autoComplete="tel" required />
                    </label>
                    <label>
                      {t.orderCity}
                      <input name="city" autoComplete="address-level2" required />
                    </label>
                    <button type="submit" className="rs5-cta rs5-cta--fill rs5-panel__cta">
                      {t.orderSubmit}
                    </button>
                  </>
                )}
                <div className="rs5-order__summary">
                  <div className="rs5-kicker">{t.orderSummary}</div>
                  <strong>{priceLabel}</strong>
                  <div className="rs5-order__meta">{configLine}</div>
                </div>
              </form>
              <div className="rs5-orbit-hint">{t.drag}</div>
            </>
          )}

        </div>

        {isLive(mode) && !ready && (
          <div className="rs5-load">
            <div className="rs5-load__inner">
              <div className="rs5-kicker">{t.loading}</div>
              <div className="rs5-load__bar">
                <i style={{ width: `${Math.round(loadProgress * 100)}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

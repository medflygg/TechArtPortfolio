import { type CSSProperties, type ReactNode, useState } from "react";
import { CopperLiquidBg } from "./CopperLiquidBg";
import { kilnArtPhotos } from "./kilnArtPhotos";

export type LivingMode = "full" | "thumb";
type Locale = "en" | "ru";
type PageId = "home" | "work" | "process" | "contact";

type ArtPiece = {
  id: string;
  img: string;
  title: Record<Locale, string>;
  caption: Record<Locale, string>;
  featured?: boolean;
};

const WORK_PIECES: ArtPiece[] = [
  {
    id: "vessel",
    img: kilnArtPhotos.vessel,
    title: { en: "Vessel", ru: "Сосуд" },
    caption: {
      en: "Hammered copper bowl · oxidized rim · 2024",
      ru: "Медная чаша · окисленный край · 2024",
    },
    featured: true,
  },
  {
    id: "disc",
    img: kilnArtPhotos.disc,
    title: { en: "Disc", ru: "Диск" },
    caption: {
      en: "Wall-mounted disc · brushed patina · Ø 48 cm",
      ru: "Настенный диск · патина · Ø 48 см",
    },
    featured: true,
  },
  {
    id: "fold",
    img: kilnArtPhotos.fold,
    title: { en: "Fold", ru: "Складка" },
    caption: {
      en: "Folded sheet sculpture · heat-formed edge",
      ru: "Скульптура из листа · термоформованный край",
    },
    featured: true,
  },
  {
    id: "ribbon",
    img: kilnArtPhotos.ribbon,
    title: { en: "Ribbon", ru: "Лента" },
    caption: {
      en: "Suspended copper ribbon · tension study",
      ru: "Подвесная медная лента · исследование натяжения",
    },
    featured: true,
  },
  {
    id: "mask",
    img: kilnArtPhotos.mask,
    title: { en: "Mask", ru: "Маска" },
    caption: {
      en: "Relief mask · fire-annealed surface",
      ru: "Рельефная маска · поверхность после отжига",
    },
  },
  {
    id: "patina",
    img: kilnArtPhotos.patina,
    title: { en: "Patina Study", ru: "Патина" },
    caption: {
      en: "Verdigris gradient on hammered plane",
      ru: "Градиент патины на кованой плоскости",
    },
  },
  {
    id: "forge",
    img: kilnArtPhotos.forge,
    title: { en: "Forge Mark", ru: "Метка кузни" },
    caption: {
      en: "Charred copper panel · industrial scale",
      ru: "Обожжённая медная панель · индустриальный масштаб",
    },
  },
  {
    id: "ember",
    img: kilnArtPhotos.ember,
    title: { en: "Ember", ru: "Уголёк" },
    caption: {
      en: "Glowing edge fragment · limited edition",
      ru: "Фрагмент с раскалённым краем · лимитированная серия",
    },
  },
];

const COPY = {
  en: {
    brand: "KILN",
    host: "kiln.atelier",
    nav: { home: "Home", work: "Work", process: "Process", contact: "Contact" },
    heroHeadline: "Heat. Copper. Form.",
    heroLead:
      "Contemporary copper sculpture atelier — hand-formed metal objects where fire, weight, and restraint meet.",
    ctaWork: "View works",
    ctaProcess: "Process",
    featured: "Selected works",
    workTitle: "Works",
    workSub: "Copper · hammered · patinated · 2019–2025",
    processTitle: "Process",
    processSub: "Four stages from raw sheet to finished object",
    steps: [
      {
        title: "Heat",
        desc: "Annealing in controlled flame until the metal yields — temperature read by color, not gauge.",
      },
      {
        title: "Hammer",
        desc: "Raising and planishing on the stump. Each blow compresses grain; rhythm replaces measurement.",
      },
      {
        title: "Patina",
        desc: "Chemical and fire patinas applied in layers. Verdigris, oxide, and polish define the final voice.",
      },
      {
        title: "Finish",
        desc: "Wax seal or open surface. Object leaves the bench when light reads correctly from every angle.",
      },
    ],
    contactTitle: "Commission",
    contactSub: "Limited studio commissions · 6–12 week lead",
    formName: "Name",
    formEmail: "Email",
    formBrief: "Brief",
    formSubmit: "Send inquiry",
    hours: "Studio hours",
    hoursVal: "Tue–Sat · 10:00–18:00",
    location: "Location",
    locationVal: "Berlin · by appointment",
    footer: "© KILN Atelier — portfolio case",
    formPhName: "Your name",
    formPhEmail: "you@email.com",
    formPhBrief: "Dimensions, intent, timeline…",
  },
  ru: {
    brand: "KILN",
    host: "kiln.atelier",
    nav: { home: "Главная", work: "Работы", process: "Процесс", contact: "Контакт" },
    heroHeadline: "Жар. Медь. Форма.",
    heroLead:
      "Современная медная скульптурная мастерская — объекты, где встречаются огонь, вес и сдержанность.",
    ctaWork: "Смотреть работы",
    ctaProcess: "Процесс",
    featured: "Избранное",
    workTitle: "Работы",
    workSub: "Медь · ковка · патина · 2019–2025",
    processTitle: "Процесс",
    processSub: "Четыре этапа от листа до готового объекта",
    steps: [
      {
        title: "Жар",
        desc: "Отжиг в контролируемом пламени — температура по цвету, не по прибору.",
      },
      {
        title: "Молот",
        desc: "Подъём и правка на чеканке. Каждый удар сжимает структуру; ритм важнее измерения.",
      },
      {
        title: "Патина",
        desc: "Химические и огневые патины слоями. Verdigris, оксид и полировка задают характер.",
      },
      {
        title: "Финиш",
        desc: "Воск или открытая поверхность. Объект уходит со стола, когда свет читается со всех сторон.",
      },
    ],
    contactTitle: "Заказ",
    contactSub: "Ограниченные студийные заказы · 6–12 недель",
    formName: "Имя",
    formEmail: "Email",
    formBrief: "Описание",
    formSubmit: "Отправить",
    hours: "Часы работы",
    hoursVal: "Вт–Сб · 10:00–18:00",
    location: "Адрес",
    locationVal: "Берлин · по записи",
    footer: "© KILN Atelier — portfolio case",
    formPhName: "Ваше имя",
    formPhEmail: "you@email.com",
    formPhBrief: "Размеры, задача, сроки…",
  },
} as const;

function kaStyle(accent: string): CSSProperties {
  return { "--ka-a": accent, "--ka-copper": "#c47a3a", "--ka-ember": "#ff6b35" } as CSSProperties;
}

function KaStyles() {
  return (
    <style>{`
      .ka-root {
        --ka-a: #e8c07a;
        --ka-copper: #c47a3a;
        --ka-ember: #ff6b35;
        --ka-bg: #0c0907;
        --ka-bg2: #14100c;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100%;
        background: var(--ka-bg);
        color: rgba(255, 245, 235, 0.88);
        font-family: var(--font-body, "Sora", sans-serif);
        font-size: 11px;
        line-height: 1.4;
        overflow: hidden;
        user-select: none;
      }

      .ka-root[data-mode="thumb"] { font-size: 9px; }

      .ka-chrome {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px;
        padding: 0 10px;
        background: #1a1410;
        border-bottom: 1px solid rgba(196, 122, 58, 0.15);
        flex-shrink: 0;
      }

      .ka-root[data-mode="thumb"] .ka-chrome { height: 20px; padding: 0 6px; }

      .ka-chrome__dots { display: flex; gap: 4px; }
      .ka-chrome__dots i {
        width: 7px; height: 7px; border-radius: 50%;
      }
      .ka-root[data-mode="thumb"] .ka-chrome__dots i { width: 5px; height: 5px; }
      .ka-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .ka-chrome__dots i:nth-child(2) { background: #febc2e; }
      .ka-chrome__dots i:nth-child(3) { background: #28c840; }

      .ka-chrome__url {
        flex: 1;
        height: 16px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.35);
        color: rgba(232, 192, 122, 0.45);
        font-size: 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .ka-body {
        overflow: auto;
        flex: 1;
        min-height: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: var(--ka-bg);
      }

      .ka-nav {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        border-bottom: 1px solid rgba(196, 122, 58, 0.12);
        background: rgba(20, 16, 12, 0.92);
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(8px);
      }

      .ka-root[data-mode="thumb"] .ka-nav { padding: 5px 8px; gap: 4px; }

      .ka-nav__brand {
        font-family: var(--font-display, "Syne", sans-serif);
        font-weight: 700;
        font-size: 13px;
        letter-spacing: 0.22em;
        color: var(--ka-a);
        margin-right: auto;
      }

      .ka-nav__link {
        appearance: none;
        border: 0;
        background: transparent;
        color: rgba(255, 245, 235, 0.45);
        font: inherit;
        font-size: 9px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
      }

      .ka-nav__link:hover {
        color: rgba(255, 245, 235, 0.85);
        background: rgba(196, 122, 58, 0.08);
      }

      .ka-nav__link.is-active {
        color: var(--ka-a);
        background: rgba(196, 122, 58, 0.14);
      }

      .ka-page {
        flex: 1;
        min-height: 0;
        animation: ka-fade 0.32s ease;
      }

      @keyframes ka-fade {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ── Hero abstract background ── */
      .ka-hero {
        position: relative;
        overflow: hidden;
        min-height: 240px;
        border-bottom: 1px solid rgba(196, 122, 58, 0.18);
        display: flex;
        align-items: flex-end;
        isolation: isolate;
      }

      .ka-root[data-mode="thumb"] .ka-hero { min-height: 128px; }

      .ka-hero__veil {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background:
          linear-gradient(90deg, rgba(8, 4, 2, 0.78) 0%, rgba(8, 4, 2, 0.4) 52%, rgba(8, 4, 2, 0.18) 100%),
          linear-gradient(0deg, rgba(8, 4, 2, 0.72) 0%, transparent 58%);
      }

      .ka-hero__bg,
      .ka-hero__shimmer,
      .ka-hero__grain,
      .ka-hero__rings,
      .ka-hero__orb {
        display: none;
      }

      .ka-hero__copy {
        position: relative;
        z-index: 2;
        padding: 28px 20px 24px;
        max-width: 58%;
      }

      .ka-root[data-mode="thumb"] .ka-hero__copy {
        padding: 12px 10px 10px;
        max-width: 72%;
      }

      .ka-hero__eyebrow {
        font-size: 8px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--ka-copper);
        margin-bottom: 6px;
      }

      .ka-hero h1 {
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.02em;
        line-height: 1.1;
        margin: 0 0 8px;
        color: rgba(255, 248, 240, 0.96);
      }

      .ka-root[data-mode="thumb"] .ka-hero h1 { font-size: 14px; margin-bottom: 4px; }

      .ka-hero p {
        margin: 0 0 12px;
        font-size: 10px;
        color: rgba(255, 245, 235, 0.55);
        max-width: 36em;
      }

      .ka-root[data-mode="thumb"] .ka-hero p { font-size: 8px; margin-bottom: 8px; }

      .ka-hero__actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .ka-btn {
        appearance: none;
        border: 0;
        font: inherit;
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 7px 14px;
        border-radius: 2px;
        cursor: pointer;
        transition: transform 0.15s, box-shadow 0.2s, background 0.15s;
      }

      .ka-root[data-mode="thumb"] .ka-btn { padding: 5px 10px; font-size: 8px; }

      .ka-btn--primary {
        background: linear-gradient(135deg, var(--ka-copper) 0%, #a05a28 100%);
        color: #fff8f0;
        box-shadow: 0 0 20px rgba(255, 107, 53, 0.25);
        animation: ka-cta-glow 4s ease-in-out infinite;
      }

      @keyframes ka-cta-glow {
        0%, 100% { box-shadow: 0 0 16px rgba(255, 107, 53, 0.2); }
        50% { box-shadow: 0 0 28px rgba(255, 107, 53, 0.45); }
      }

      .ka-btn--primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 32px rgba(255, 107, 53, 0.5);
      }

      .ka-btn--ghost {
        background: transparent;
        color: var(--ka-a);
        border: 1px solid rgba(232, 192, 122, 0.35);
      }

      .ka-btn--ghost:hover {
        background: rgba(196, 122, 58, 0.1);
        transform: translateY(-1px);
      }

      /* ── Featured strip (editorial, not inventory) ── */
      .ka-strip {
        padding: 18px 16px 22px;
        border-bottom: 1px solid rgba(196, 122, 58, 0.12);
        background: linear-gradient(180deg, #100c09 0%, var(--ka-bg) 100%);
      }

      .ka-root[data-mode="thumb"] .ka-strip { padding: 8px 8px 10px; }

      .ka-strip__head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
      }

      .ka-strip__head h2 {
        margin: 0;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: -0.01em;
        text-transform: none;
        color: rgba(255, 245, 235, 0.92);
      }

      .ka-root[data-mode="thumb"] .ka-strip__head h2 { font-size: 10px; }

      .ka-strip__layout {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        gap: 10px;
        align-items: stretch;
      }

      .ka-root[data-mode="thumb"] .ka-strip__layout {
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .ka-feature {
        position: relative;
        overflow: hidden;
        min-height: 180px;
        cursor: pointer;
        border: 1px solid rgba(196, 122, 58, 0.18);
        background: #0a0705;
        transition: border-color 0.25s, transform 0.25s;
      }

      .ka-root[data-mode="thumb"] .ka-feature { min-height: 88px; }

      .ka-feature:hover {
        border-color: rgba(232, 192, 122, 0.4);
        transform: translateY(-2px);
      }

      .ka-feature__img {
        position: absolute;
        inset: 0;
      }

      .ka-feature__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: scale(1.03);
        transition: transform 0.5s ease;
      }

      .ka-feature:hover .ka-feature__img img { transform: scale(1.08); }

      .ka-feature__veil {
        position: absolute;
        inset: 0;
        background: linear-gradient(0deg, rgba(8, 4, 2, 0.88) 0%, rgba(8, 4, 2, 0.15) 55%, transparent 100%);
        pointer-events: none;
      }

      .ka-feature__copy {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 12px;
        z-index: 1;
      }

      .ka-root[data-mode="thumb"] .ka-feature__copy {
        left: 6px;
        right: 6px;
        bottom: 6px;
      }

      .ka-feature__copy strong {
        display: block;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.02em;
        color: #fff5eb;
      }

      .ka-root[data-mode="thumb"] .ka-feature__copy strong { font-size: 10px; }

      .ka-feature__copy span {
        display: block;
        margin-top: 4px;
        font-size: 9px;
        line-height: 1.35;
        color: rgba(255, 230, 210, 0.55);
      }

      .ka-root[data-mode="thumb"] .ka-feature__copy span { display: none; }

      .ka-side-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ka-root[data-mode="thumb"] .ka-side-list { gap: 6px; }

      .ka-side-item {
        flex: 1;
        display: grid;
        grid-template-columns: 72px 1fr;
        gap: 10px;
        align-items: center;
        min-height: 0;
        padding: 0;
        cursor: pointer;
        border: 1px solid rgba(196, 122, 58, 0.14);
        background: rgba(20, 14, 10, 0.65);
        transition: border-color 0.2s, background 0.2s;
      }

      .ka-root[data-mode="thumb"] .ka-side-item {
        grid-template-columns: 1fr;
        border: 0;
        background: transparent;
      }

      .ka-side-item:hover {
        border-color: rgba(232, 192, 122, 0.35);
        background: rgba(28, 18, 12, 0.9);
      }

      .ka-side-item__thumb {
        height: 100%;
        min-height: 56px;
        overflow: hidden;
        background: #0a0705;
      }

      .ka-root[data-mode="thumb"] .ka-side-item__thumb {
        min-height: 48px;
        aspect-ratio: 4 / 3;
      }

      .ka-side-item__thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .ka-side-item__meta {
        padding-right: 10px;
      }

      .ka-root[data-mode="thumb"] .ka-side-item__meta { display: none; }

      .ka-side-item__meta b {
        display: block;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 12px;
        font-weight: 650;
        color: #fff5eb;
      }

      .ka-side-item__meta em {
        display: block;
        margin-top: 3px;
        font-style: normal;
        font-size: 8px;
        line-height: 1.35;
        color: rgba(255, 230, 210, 0.45);
      }

      /* legacy art-card kept for work page only */
      .ka-art-card {
        flex: 0 0 auto;
        width: 120px;
        cursor: pointer;
        transition: transform 0.2s;
      }

      .ka-root[data-mode="thumb"] .ka-art-card { width: 72px; }

      .ka-art-card:hover { transform: translateY(-3px); }

      .ka-art-card__frame {
        position: relative;
        aspect-ratio: 4 / 5;
        border-radius: 2px;
        overflow: hidden;
        background: linear-gradient(145deg, #1a1208, #0c0907);
        border: 1px solid rgba(196, 122, 58, 0.2);
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .ka-art-card:hover .ka-art-card__frame {
        border-color: rgba(232, 192, 122, 0.45);
        box-shadow: 0 8px 24px rgba(255, 107, 53, 0.12);
      }

      .ka-art-card__frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .ka-art-card__fallback {
        width: 100%;
        height: 100%;
        background:
          linear-gradient(135deg, rgba(196, 122, 58, 0.25), rgba(255, 107, 53, 0.08)),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(232, 192, 122, 0.04) 3px,
            rgba(232, 192, 122, 0.04) 4px
          );
      }

      .ka-art-card__title {
        margin-top: 6px;
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.06em;
        color: var(--ka-a);
      }

      .ka-art-card__cap {
        font-size: 7px;
        color: rgba(255, 245, 235, 0.4);
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ── Work grid ── */
      .ka-work {
        padding: 16px 14px;
      }

      .ka-root[data-mode="thumb"] .ka-work { padding: 10px 8px; }

      .ka-work__head { margin-bottom: 14px; }

      .ka-work__head h2 {
        margin: 0 0 4px;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 16px;
        font-weight: 700;
        letter-spacing: 0.04em;
      }

      .ka-work__head p {
        margin: 0;
        font-size: 9px;
        color: rgba(255, 245, 235, 0.45);
      }

      .ka-masonry {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .ka-root[data-mode="thumb"] .ka-masonry {
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }

      .ka-work-item {
        cursor: default;
        transition: transform 0.22s ease;
      }

      .ka-work-item:hover { transform: translateY(-4px); }

      .ka-work-item:nth-child(3n + 2) .ka-work-item__frame { aspect-ratio: 3 / 4; }
      .ka-work-item:nth-child(5n) .ka-work-item__frame { aspect-ratio: 1; }

      .ka-work-item__frame {
        position: relative;
        aspect-ratio: 4 / 5;
        overflow: hidden;
        border-radius: 2px;
        border: 1px solid rgba(196, 122, 58, 0.15);
        background: #14100c;
        transition: border-color 0.25s, box-shadow 0.25s;
      }

      .ka-work-item:hover .ka-work-item__frame {
        border-color: rgba(232, 192, 122, 0.5);
        box-shadow:
          0 12px 32px rgba(0, 0, 0, 0.4),
          0 0 24px rgba(196, 122, 58, 0.15);
      }

      .ka-work-item__frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.35s ease;
      }

      .ka-work-item:hover .ka-work-item__frame img { transform: scale(1.03); }

      .ka-work-item__meta {
        padding: 8px 2px 0;
      }

      .ka-work-item__meta h3 {
        margin: 0 0 3px;
        font-size: 10px;
        font-weight: 600;
        color: var(--ka-a);
        letter-spacing: 0.04em;
      }

      .ka-work-item__meta p {
        margin: 0;
        font-size: 8px;
        color: rgba(255, 245, 235, 0.42);
        line-height: 1.35;
      }

      /* ── Process ── */
      .ka-process {
        display: grid;
        grid-template-columns: 1fr 140px;
        gap: 16px;
        padding: 16px 14px;
        min-height: 280px;
      }

      .ka-root[data-mode="thumb"] .ka-process {
        grid-template-columns: 1fr;
        padding: 10px 8px;
        gap: 10px;
      }

      .ka-process__head { margin-bottom: 14px; grid-column: 1 / -1; }

      .ka-process__head h2 {
        margin: 0 0 4px;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 16px;
        font-weight: 700;
      }

      .ka-process__head p {
        margin: 0;
        font-size: 9px;
        color: rgba(255, 245, 235, 0.45);
      }

      .ka-steps { display: flex; flex-direction: column; gap: 12px; }

      .ka-step {
        display: grid;
        grid-template-columns: 36px 1fr;
        gap: 10px;
        align-items: start;
        padding: 10px 12px;
        border-radius: 3px;
        background: rgba(20, 16, 12, 0.6);
        border: 1px solid rgba(196, 122, 58, 0.1);
        transition: border-color 0.2s;
      }

      .ka-step:hover { border-color: rgba(196, 122, 58, 0.28); }

      .ka-step__icon {
        width: 36px;
        height: 36px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: rgba(196, 122, 58, 0.12);
        border: 1px solid rgba(232, 192, 122, 0.2);
      }

      .ka-step__icon svg { width: 20px; height: 20px; }

      .ka-step h3 {
        margin: 0 0 4px;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--ka-a);
      }

      .ka-step p {
        margin: 0;
        font-size: 9px;
        color: rgba(255, 245, 235, 0.5);
        line-height: 1.45;
      }

      .ka-metal-panel {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        background: linear-gradient(180deg, #1a1208 0%, #0c0907 100%);
        border: 1px solid rgba(196, 122, 58, 0.2);
        min-height: 200px;
      }

      .ka-root[data-mode="thumb"] .ka-metal-panel { min-height: 100px; }

      .ka-metal-panel__shimmer {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          45deg,
          transparent 40%,
          rgba(232, 192, 122, 0.08) 50%,
          transparent 60%
        );
        background-size: 200% 200%;
        animation: ka-metal-shine 6s linear infinite;
      }

      @keyframes ka-metal-shine {
        0% { background-position: 100% 100%; }
        100% { background-position: 0% 0%; }
      }

      .ka-metal-panel__grain {
        position: absolute;
        inset: 0;
        opacity: 0.25;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
        animation: ka-grain 10s steps(6) infinite;
        mix-blend-mode: soft-light;
      }

      .ka-metal-panel__svg {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        opacity: 0.85;
      }

      .ka-ripple {
        fill: none;
        stroke: var(--ka-copper);
        stroke-width: 0.8;
        animation: ka-ripple-expand 5s ease-out infinite;
      }

      .ka-ripple:nth-child(2) { animation-delay: 1.2s; stroke: var(--ka-a); }
      .ka-ripple:nth-child(3) { animation-delay: 2.4s; stroke: var(--ka-ember); opacity: 0.6; }

      @keyframes ka-ripple-expand {
        0% { r: 8; opacity: 0.8; }
        100% { r: 42; opacity: 0; }
      }

      /* ── Contact ── */
      .ka-contact {
        display: grid;
        grid-template-columns: 1fr 100px;
        gap: 16px;
        padding: 16px 14px 20px;
      }

      .ka-root[data-mode="thumb"] .ka-contact {
        grid-template-columns: 1fr;
        padding: 10px 8px 12px;
      }

      .ka-contact__head { margin-bottom: 12px; }

      .ka-contact__head h2 {
        margin: 0 0 4px;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 16px;
        font-weight: 700;
      }

      .ka-contact__head p {
        margin: 0;
        font-size: 9px;
        color: rgba(255, 245, 235, 0.45);
      }

      .ka-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ka-field label {
        display: block;
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255, 245, 235, 0.45);
        margin-bottom: 4px;
      }

      .ka-field input,
      .ka-field textarea {
        width: 100%;
        box-sizing: border-box;
        padding: 7px 10px;
        border-radius: 2px;
        border: 1px solid rgba(196, 122, 58, 0.2);
        background: rgba(0, 0, 0, 0.35);
        color: rgba(255, 245, 235, 0.85);
        font: inherit;
        font-size: 9px;
        resize: none;
        transition: border-color 0.15s;
      }

      .ka-field input:focus,
      .ka-field textarea:focus {
        outline: none;
        border-color: rgba(232, 192, 122, 0.45);
      }

      .ka-field textarea { min-height: 56px; }

      .ka-info {
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .ka-info__block dt {
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ka-copper);
        margin-bottom: 2px;
      }

      .ka-info__block dd {
        margin: 0;
        font-size: 9px;
        color: rgba(255, 245, 235, 0.6);
      }

      .ka-contact__deco {
        position: relative;
        display: grid;
        place-items: center;
        align-self: start;
      }

      .ka-contact-orb {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: radial-gradient(circle at 40% 35%, #ffd4a8, var(--ka-ember) 40%, #5a2010 80%);
        box-shadow: 0 0 40px rgba(255, 107, 53, 0.35);
        animation: ka-ember-pulse 3.5s ease-in-out infinite;
      }

      .ka-contact-ring {
        position: absolute;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        border: 1px solid rgba(196, 122, 58, 0.35);
        animation: ka-ring-pulse 4s ease-in-out infinite;
      }

      .ka-contact-ring:nth-child(2) {
        width: 108px;
        height: 108px;
        animation-delay: 1s;
        border-color: rgba(232, 192, 122, 0.2);
      }

      .ka-footer {
        margin-top: auto;
        padding: 8px 14px;
        border-top: 1px solid rgba(196, 122, 58, 0.1);
        font-size: 8px;
        color: rgba(255, 245, 235, 0.28);
        text-align: center;
      }
    `}</style>
  );
}

function Shell({
  url,
  accent,
  mode,
  children,
}: {
  url: string;
  accent: string;
  mode: LivingMode;
  children: ReactNode;
}) {
  return (
    <div className="ka-root" data-mode={mode} style={kaStyle(accent)}>
      <KaStyles />
      <header className="ka-chrome">
        <span className="ka-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="ka-chrome__url">{url}</span>
      </header>
      <div className="ka-body">{children}</div>
    </div>
  );
}

function ArtImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="ka-art-card__fallback" aria-hidden />;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ProcessIcon({ step }: { step: number }) {
  const icons = [
    /* heat */
    <svg key="heat" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3c0 4-4 6-4 10a4 4 0 1 0 8 0c0-4-4-6-4-10Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="rgba(255,107,53,0.2)"
      />
      <path d="M12 8v6M9.5 11h5" stroke="#ff6b35" strokeWidth="0.8" opacity="0.7" />
    </svg>,
    /* hammer */
    <svg key="hammer" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="14" width="10" height="3" rx="0.5" fill="#c47a3a" transform="rotate(-35 9 15.5)" />
      <rect x="13" y="6" width="4" height="8" rx="0.5" fill="#e8c07a" transform="rotate(-35 15 10)" />
    </svg>,
    /* patina */
    <svg key="patina" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="#5a8a6a" strokeWidth="1" fill="rgba(90,138,106,0.15)" />
      <path d="M8 14c2 2 6 2 8 0" stroke="#c47a3a" strokeWidth="0.8" opacity="0.6" />
    </svg>,
    /* finish */
    <svg key="finish" viewBox="0 0 24 24" fill="none" aria-hidden>
      <polygon points="12,4 20,10 16,20 8,20 4,10" stroke="#e8c07a" strokeWidth="1" fill="rgba(232,192,122,0.1)" />
      <circle cx="12" cy="12" r="2" fill="#e8c07a" opacity="0.8" />
    </svg>,
  ];
  return <span style={{ color: "#e8c07a" }}>{icons[step]}</span>;
}

function MetalPanel() {
  return (
    <aside className="ka-metal-panel" aria-hidden>
      <div className="ka-metal-panel__shimmer" />
      <div className="ka-metal-panel__grain" />
      <div className="ka-metal-panel__svg">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle className="ka-ripple" cx="50" cy="50" r="8" />
          <circle className="ka-ripple" cx="50" cy="50" r="8" />
          <circle className="ka-ripple" cx="50" cy="50" r="8" />
        </svg>
      </div>
    </aside>
  );
}

export function KilnAtelierSite({
  accent = "#e8c07a",
  locale,
  mode,
}: {
  accent?: string;
  locale: "en" | "ru";
  mode: "full" | "thumb";
}) {
  const t = COPY[locale];
  const [page, setPage] = useState<PageId>("home");
  const activePage = mode === "thumb" ? "home" : page;

  const featured = WORK_PIECES.filter((p) => p.featured);
  const navPages: { id: PageId; label: string }[] = [
    { id: "home", label: t.nav.home },
    { id: "work", label: t.nav.work },
    { id: "process", label: t.nav.process },
    { id: "contact", label: t.nav.contact },
  ];

  const goTo = (id: PageId) => {
    if (mode === "full") setPage(id);
  };

  return (
    <Shell url={`${t.host} / ${activePage}`} accent={accent} mode={mode}>
      <nav className="ka-nav">
        <span className="ka-nav__brand">{t.brand}</span>
        {mode === "full" &&
          navPages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`ka-nav__link${activePage === p.id ? " is-active" : ""}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
      </nav>

      <main className="ka-page">
        {activePage === "home" && (
          <>
            <section className="ka-hero">
              <CopperLiquidBg />
              <div className="ka-hero__veil" aria-hidden />
              <div className="ka-hero__copy">
                <div className="ka-hero__eyebrow">{t.brand}</div>
                <h1>{t.heroHeadline}</h1>
                <p>{t.heroLead}</p>
                <div className="ka-hero__actions">
                  <button type="button" className="ka-btn ka-btn--primary" onClick={() => goTo("work")}>
                    {t.ctaWork}
                  </button>
                  {mode === "full" && (
                    <button type="button" className="ka-btn ka-btn--ghost" onClick={() => goTo("process")}>
                      {t.ctaProcess}
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="ka-strip">
              <div className="ka-strip__head">
                <h2>{t.featured}</h2>
              </div>
              <div className="ka-strip__layout">
                {featured[0] && (
                  <article
                    className="ka-feature"
                    onClick={() => goTo("work")}
                    onKeyDown={(e) => e.key === "Enter" && goTo("work")}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="ka-feature__img">
                      <ArtImage src={featured[0].img} alt={featured[0].title[locale]} />
                    </div>
                    <div className="ka-feature__veil" />
                    <div className="ka-feature__copy">
                      <strong>{featured[0].title[locale]}</strong>
                      <span>{featured[0].caption[locale]}</span>
                    </div>
                  </article>
                )}
                <div className="ka-side-list">
                  {featured.slice(1, mode === "thumb" ? 3 : 4).map((piece) => (
                    <article
                      key={piece.id}
                      className="ka-side-item"
                      onClick={() => goTo("work")}
                      onKeyDown={(e) => e.key === "Enter" && goTo("work")}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="ka-side-item__thumb">
                        <ArtImage src={piece.img} alt={piece.title[locale]} />
                      </div>
                      <div className="ka-side-item__meta">
                        <b>{piece.title[locale]}</b>
                        <em>{piece.caption[locale]}</em>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activePage === "work" && mode === "full" && (
          <section className="ka-work">
            <header className="ka-work__head">
              <h2>{t.workTitle}</h2>
              <p>{t.workSub}</p>
            </header>
            <div className="ka-masonry">
              {WORK_PIECES.map((piece) => (
                <article key={piece.id} className="ka-work-item">
                  <div className="ka-work-item__frame">
                    <ArtImage src={piece.img} alt={piece.title[locale]} />
                  </div>
                  <div className="ka-work-item__meta">
                    <h3>{piece.title[locale]}</h3>
                    <p>{piece.caption[locale]}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === "process" && mode === "full" && (
          <section className="ka-process">
            <header className="ka-process__head">
              <h2>{t.processTitle}</h2>
              <p>{t.processSub}</p>
            </header>
            <div className="ka-steps">
              {t.steps.map((step, i) => (
                <article key={step.title} className="ka-step">
                  <div className="ka-step__icon">
                    <ProcessIcon step={i} />
                  </div>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.desc}</p>
                  </div>
                </article>
              ))}
            </div>
            <MetalPanel />
          </section>
        )}

        {activePage === "contact" && mode === "full" && (
          <section className="ka-contact">
            <div>
              <header className="ka-contact__head">
                <h2>{t.contactTitle}</h2>
                <p>{t.contactSub}</p>
              </header>
              <form className="ka-form" onSubmit={(e) => e.preventDefault()}>
                <div className="ka-field">
                  <label htmlFor="ka-name">{t.formName}</label>
                  <input id="ka-name" type="text" placeholder={t.formPhName} />
                </div>
                <div className="ka-field">
                  <label htmlFor="ka-email">{t.formEmail}</label>
                  <input id="ka-email" type="email" placeholder={t.formPhEmail} />
                </div>
                <div className="ka-field">
                  <label htmlFor="ka-brief">{t.formBrief}</label>
                  <textarea id="ka-brief" placeholder={t.formPhBrief} rows={3} />
                </div>
                <button type="submit" className="ka-btn ka-btn--primary">
                  {t.formSubmit}
                </button>
              </form>
              <dl className="ka-info">
                <div className="ka-info__block">
                  <dt>{t.hours}</dt>
                  <dd>{t.hoursVal}</dd>
                </div>
                <div className="ka-info__block">
                  <dt>{t.location}</dt>
                  <dd>{t.locationVal}</dd>
                </div>
              </dl>
            </div>
            <div className="ka-contact__deco" aria-hidden>
              <div className="ka-contact-ring" />
              <div className="ka-contact-ring" />
              <div className="ka-contact-orb" />
            </div>
          </section>
        )}
      </main>

      <footer className="ka-footer">{t.footer}</footer>
    </Shell>
  );
}

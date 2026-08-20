import { type CSSProperties, type FormEvent, type MouseEvent, useState } from "react";
import { VelvetLiquidBg } from "./VelvetLiquidBg";
import { vesperPhotos } from "./vesperPhotos";

export type LivingMode = "full" | "thumb";
type Locale = "en" | "ru";
type PageId = "home" | "maison" | "menu" | "hall" | "rooms" | "access";

type Act = {
  id: string;
  time: string;
  title: Record<Locale, string>;
  kind: Record<Locale, string>;
  body: Record<Locale, string>;
};

type Interior = {
  id: string;
  img: string;
  title: Record<Locale, string>;
  caption: Record<Locale, string>;
};

type Table = {
  id: string;
  roman: string;
  kind: Record<Locale, string>;
  covers: number;
  status: "open" | "held" | "members";
  col: number;
  row: number;
};

type Room = {
  id: string;
  img: string;
  title: Record<Locale, string>;
  kind: Record<Locale, string>;
  covers: number;
  status: "open" | "held" | "members";
};

type MenuItem = {
  id: string;
  section: "cellar" | "kitchen";
  name: Record<Locale, string>;
  note: Record<Locale, string>;
  price: string;
};

const ACTS: Act[] = [
  {
    id: "doors",
    time: "21:00",
    title: { en: "Doors", ru: "Двери" },
    kind: { en: "Arrival", ru: "Вход" },
    body: {
      en: "The house opens. Coats, a first glass, no announcements.",
      ru: "Дом открывается. Пальто, первый бокал, без объявлений.",
    },
  },
  {
    id: "velvet",
    time: "22:00",
    title: { en: "Velvet Hour", ru: "Velvet Hour" },
    kind: { en: "Trio", ru: "Трио" },
    body: {
      en: "A jazz trio at the edge of the room. Conversation stays, volume does not.",
      ru: "Джазовое трио у края зала. Разговор остаётся, громкость — нет.",
    },
  },
  {
    id: "glass",
    time: "23:15",
    title: { en: "The Glass Voice", ru: "Стеклянный голос" },
    kind: { en: "Voice", ru: "Голос" },
    body: {
      en: "One soprano. Twenty minutes. The room agrees to listen.",
      ru: "Одна сопрано. Двадцать минут. Зал соглашается слушать.",
    },
  },
  {
    id: "orpheus",
    time: "00:30",
    title: { en: "Orpheus", ru: "Орфей" },
    kind: { en: "Movement", ru: "Движение" },
    body: {
      en: "A short dance for the floor, not the stage. Lights stay low.",
      ru: "Короткий танец для пола, не для сцены. Свет остаётся низким.",
    },
  },
];

const INTERIORS: Interior[] = [
  {
    id: "salon",
    img: vesperPhotos.salon,
    title: { en: "Grand Salon", ru: "Большой салон" },
    caption: {
      en: "The first room. Chandeliers stay dim until the house sits.",
      ru: "Первая комната. Люстры не поднимают, пока не сядут гости.",
    },
  },
  {
    id: "theatre",
    img: vesperPhotos.theatre,
    title: { en: "Theatre", ru: "Театр" },
    caption: {
      en: "Eighty seats. The curtain is architecture, not decoration.",
      ru: "Восемьдесят мест. Занавес — архитектура, не декор.",
    },
  },
  {
    id: "cellar",
    img: vesperPhotos.cellar,
    title: { en: "Cellar", ru: "Погреб" },
    caption: {
      en: "The list lives below the stage. We pour from the wall, not a trolley.",
      ru: "Карта вин — под сценой. Наливаем со стены, не с тележки.",
    },
  },
  {
    id: "bar",
    img: vesperPhotos.bar,
    title: { en: "The Bar", ru: "Бар" },
    caption: {
      en: "A single counter after midnight. Conversation, not a cocktail list.",
      ru: "Одна стойка после полуночи. Разговор, не коктейльная карта.",
    },
  },
];

const TABLES: Table[] = [
  { id: "t1", roman: "I", kind: { en: "Banquette", ru: "Банкетка" }, covers: 4, status: "open", col: 2, row: 3 },
  { id: "t2", roman: "II", kind: { en: "Circle", ru: "Круглый" }, covers: 2, status: "held", col: 1, row: 2 },
  { id: "t3", roman: "III", kind: { en: "Box", ru: "Ложа" }, covers: 6, status: "members", col: 1, row: 1 },
  { id: "t4", roman: "IV", kind: { en: "Circle", ru: "Круглый" }, covers: 2, status: "open", col: 2, row: 1 },
  { id: "t5", roman: "V", kind: { en: "Banquette", ru: "Банкетка" }, covers: 4, status: "open", col: 3, row: 1 },
  { id: "t6", roman: "VI", kind: { en: "Circle", ru: "Круглый" }, covers: 2, status: "held", col: 4, row: 1 },
  { id: "t7", roman: "VII", kind: { en: "Box", ru: "Ложа" }, covers: 4, status: "open", col: 4, row: 2 },
  { id: "t8", roman: "VIII", kind: { en: "Perch", ru: "У стойки" }, covers: 2, status: "open", col: 3, row: 3 },
];

const ROOMS: Room[] = [
  {
    id: "rouge",
    img: vesperPhotos.rouge,
    title: { en: "Chambre Rouge", ru: "Красная" },
    kind: { en: "VIP booth", ru: "VIP-кабинка" },
    covers: 8,
    status: "open",
  },
  {
    id: "study",
    img: vesperPhotos.study,
    title: { en: "The Study", ru: "Кабинет" },
    kind: { en: "Closed lounge", ru: "Закрытый лаунж" },
    covers: 4,
    status: "open",
  },
  {
    id: "mirror",
    img: vesperPhotos.mirror,
    title: { en: "Mirrors", ru: "Зеркала" },
    kind: { en: "Pole · champagne", ru: "Пилон · шампанское" },
    covers: 6,
    status: "members",
  },
  {
    id: "vault",
    img: vesperPhotos.vault,
    title: { en: "The Vault", ru: "Свод" },
    kind: { en: "Booth for two", ru: "Кабинка на двоих" },
    covers: 2,
    status: "held",
  },
];

const MENU: MenuItem[] = [
  {
    id: "pomerol",
    section: "cellar",
    name: { en: "Pomerol, 2016", ru: "Помероль, 2016" },
    note: {
      en: "Right bank · the house wine",
      ru: "Правый берег Бордо. Вино, которое наливаем своим",
    },
    price: "240",
  },
  {
    id: "blanc",
    section: "cellar",
    name: { en: "Meursault, 2019", ru: "Мёрсо, 2019" },
    note: {
      en: "White burgundy · for the first hour",
      ru: "Белая Бургундия. К первому бокалу, пока зал ещё говорит",
    },
    price: "180",
  },
  {
    id: "grower",
    section: "cellar",
    name: { en: "Grower champagne", ru: "Шампанское рекольтанта" },
    note: {
      en: "Extra brut · no house cuvée theatre",
      ru: "Extra brut с участка. Без купажа «от дома»",
    },
    price: "160",
  },
  {
    id: "madeira",
    section: "cellar",
    name: { en: "Madeira, 1978", ru: "Мадера, 1978" },
    note: { en: "After Orpheus", ru: "После «Орфея» — когда уже не нужна речь" },
    price: "90",
  },
  {
    id: "oysters",
    section: "kitchen",
    name: { en: "Oysters, four", ru: "Устрицы Belon — четыре" },
    note: {
      en: "Belon · lemon, nothing else",
      ru: "Только лимон. Соус не ставим",
    },
    price: "48",
  },
  {
    id: "sole",
    section: "kitchen",
    name: { en: "Sole meunière", ru: "Морской язык meunière" },
    note: {
      en: "The only fish we cook",
      ru: "Единственная рыба на плите. Масло, петрушка",
    },
    price: "72",
  },
  {
    id: "beef",
    section: "kitchen",
    name: { en: "Côte de bœuf", ru: "Кот де бёф" },
    note: {
      en: "For the Rouge · share",
      ru: "Для Красной комнаты. На стол, не порциями",
    },
    price: "140",
  },
  {
    id: "chocolate",
    section: "kitchen",
    name: { en: "Dark chocolate, salt", ru: "Горький шоколад, соль" },
    note: {
      en: "No pastry cart",
      ru: "Десертной тележки нет. Одна пластина на двоих",
    },
    price: "22",
  },
];

const COPY = {
  en: {
    brand: "VESPER",
    house: "Maison",
    host: "vesper.house",
    nav: { home: "House", maison: "Maison", menu: "Menu", hall: "Hall", rooms: "Rooms", access: "Access" },
    kicker: "Private cabaret · Paris",
    lead: "Tables by invitation. The night is composed, not listed.",
    ctaTable: "A table in the hall",
    ctaNight: "The house",
    maisonTitle: "The house",
    maisonSub: "Four rooms. One programme. The building is the show.",
    interiors: "Interiors",
    programme: "Tonight",
    holdFor: "Hold a table for this hour",
    menuTitle: "The list",
    menuSub: "Cellar and kitchen. We do not print a card.",
    cellar: "Cellar",
    kitchen: "Kitchen",
    sendToRoom: "Send to the table",
    sentTitle: "Noted.",
    sentLead: "It goes to the table you hold. Nothing else is asked.",
    hallTitle: "The hall",
    hallSub: "Eight tables around the stage. The show faces the floor.",
    stage: "Stage",
    cabinets: "Rooms",
    cabinetsSub: "VIP off the salon. Curtain, not the parterre.",
    covers: "covers",
    taken: "Held",
    takenRoom: "Held",
    membersOnly: "Members only",
    open: "Open",
    openRoom: "Open",
    holdCta: "Hold this table",
    holdRoomCta: "Hold this room",
    heldTitle: "Held.",
    heldLead: "Twenty minutes on the book. The house will write.",
    forHour: "For",
    membersHint: "A members' box — request access.",
    hallHint: "Choose a table. The stage looks into the hall.",
    accessTitle: "The book",
    accessSub: "A name is enough. We do not sell nights.",
    formName: "Name",
    formNote: "Who brings you",
    formSubmit: "Leave a name",
    formPhName: "Your name",
    formPhNote: "Member, or a house known to us",
    sealed: "Your name is with the house.",
    sealedLead: "If a table opens, we write. Nothing else.",
    footer: "VESPER — members' house · portfolio case",
  },
  ru: {
    brand: "VESPER",
    house: "Maison",
    host: "vesper.house",
    nav: { home: "Дом", maison: "Maison", menu: "Меню", hall: "Зал", rooms: "Комнаты", access: "Доступ" },
    kicker: "Закрытый кабаре · Париж",
    lead: "Столы по приглашению. Ночь сочиняют, а не публикуют.",
    ctaTable: "Стол в зале",
    ctaNight: "Дом",
    maisonTitle: "Дом",
    maisonSub: "Четыре комнаты. Одна программа. Здание и есть шоу.",
    interiors: "Интерьеры",
    programme: "Сегодня",
    holdFor: "Держать стол на этот час",
    menuTitle: "Карта",
    menuSub: "Вино и кухня. Печатного меню нет — называете, что нужно.",
    cellar: "Вино",
    kitchen: "Кухня",
    sendToRoom: "Подать к столу",
    sentTitle: "Приняли.",
    sentLead: "Подадут к столу, который держите. Больше ничего не спрашиваем.",
    hallTitle: "Зал",
    hallSub: "Восемь столов вокруг сцены. Программа смотрит в партер, не за дверь.",
    stage: "Сцена",
    cabinets: "Комнаты",
    cabinetsSub: "VIP за дверью салона. Занавес, не партер.",
    covers: "места",
    taken: "Занят",
    takenRoom: "Занята",
    membersOnly: "Для своих",
    open: "Свободен",
    openRoom: "Свободна",
    holdCta: "Держать стол",
    holdRoomCta: "Держать комнату",
    heldTitle: "Держим.",
    heldLead: "Двадцать минут в книге. Дом напишет.",
    forHour: "На",
    membersHint: "Ложа для своих — запросите доступ.",
    hallHint: "Выберите стол. Сцена смотрит в зал.",
    accessTitle: "Книга",
    accessSub: "Имени достаточно. Мы не продаём ночи.",
    formName: "Имя",
    formNote: "Кто приводит",
    formSubmit: "Оставить имя",
    formPhName: "Ваше имя",
    formPhNote: "Участник дома или имя, которое мы знаем",
    sealed: "Ваше имя у дома.",
    sealedLead: "Если стол откроется — напишем. Больше ничего.",
    footer: "VESPER — закрытый дом · портфолио-кейс",
  },
};

function liveStyle(accent: string): CSSProperties {
  return { "--vs-a": accent } as CSSProperties;
}

function VesperStyles() {
  return (
    <style>{`
      @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap");

      .vs-root {
        --vs-a: #c9a36a;
        --vs-gold: #e8d5a8;
        --vs-wine: #6a1824;
        --vs-bg: #070305;
        --vs-ink: #f4ead8;
        --vs-display: "Cormorant Garamond", "Times New Roman", serif;
        --vs-body: var(--font-body, "Sora", sans-serif);
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100%;
        background: var(--vs-bg);
        color: var(--vs-ink);
        font-family: var(--vs-body);
        font-size: 11px;
        line-height: 1.4;
        overflow: hidden;
        user-select: none;
      }

      .vs-root[data-mode="thumb"] { font-size: 9px; }

      .vs-chrome {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px;
        padding: 0 10px;
        background: #12080a;
        border-bottom: 1px solid rgba(201, 163, 106, 0.14);
        flex-shrink: 0;
      }
      .vs-root[data-mode="thumb"] .vs-chrome { height: 20px; padding: 0 6px; }
      .vs-chrome__dots { display: flex; gap: 4px; }
      .vs-chrome__dots i { width: 7px; height: 7px; border-radius: 50%; }
      .vs-root[data-mode="thumb"] .vs-chrome__dots i { width: 5px; height: 5px; }
      .vs-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .vs-chrome__dots i:nth-child(2) { background: #febc2e; }
      .vs-chrome__dots i:nth-child(3) { background: #28c840; }
      .vs-chrome__url {
        flex: 1;
        height: 16px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 4px;
        background: rgba(0, 0, 0, 0.4);
        color: rgba(232, 213, 168, 0.42);
        font-size: 9px;
        letter-spacing: 0.04em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .vs-body {
        overflow: hidden;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        background: var(--vs-bg);
      }

      .vs-nav {
        display: flex;
        align-items: baseline;
        gap: 2px;
        padding: 10px 16px 9px;
        border-bottom: 1px solid rgba(201, 163, 106, 0.12);
        background: color-mix(in srgb, #070305 82%, transparent);
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(10px);
        flex-shrink: 0;
      }
      .vs-root[data-mode="thumb"] .vs-nav { padding: 6px 10px; }

      .vs-nav__brand {
        font-family: var(--vs-display);
        font-style: italic;
        font-weight: 500;
        font-size: 18px;
        letter-spacing: 0.28em;
        color: var(--vs-gold);
        margin-right: auto;
        line-height: 1;
      }
      .vs-root[data-mode="thumb"] .vs-nav__brand { font-size: 13px; letter-spacing: 0.22em; }

      .vs-nav__link {
        appearance: none;
        border: 0;
        background: transparent;
        color: rgba(244, 234, 216, 0.38);
        font: inherit;
        font-size: 9px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        padding: 5px 7px;
        cursor: pointer;
        position: relative;
        transition: color 0.18s;
      }
      .vs-nav__link:hover { color: rgba(244, 234, 216, 0.88); }
      .vs-nav__link.is-active { color: var(--vs-gold); }
      .vs-nav__link.is-active::after {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 2px;
        height: 1px;
        background: var(--vs-gold);
        transform-origin: left;
        animation: vs-line 0.22s ease both;
      }

      .vs-page {
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: auto;
        animation: vs-fade 0.22s ease;
      }
      .vs-root[data-mode="thumb"] .vs-page { overflow: hidden; }

      @keyframes vs-fade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes vs-line {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      @keyframes vs-letter {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes vs-sheen {
        from { transform: translateX(-120%) skewX(-18deg); }
        to { transform: translateX(220%) skewX(-18deg); }
      }

      /* ── Home ── */
      .vs-home {
        flex: 1;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .vs-hero {
        --mx: 42%;
        --my: 68%;
        position: relative;
        flex: 1;
        min-height: 0;
        overflow: hidden;
        display: flex;
        align-items: flex-end;
        isolation: isolate;
      }

      .vs-hero__static {
        position: absolute;
        inset: 0;
        z-index: 0;
        background:
          radial-gradient(ellipse 70% 55% at var(--mx) var(--my), #7a1020 0%, transparent 58%),
          radial-gradient(ellipse 50% 40% at 82% 8%, rgba(196, 90, 98, 0.16), transparent 52%),
          linear-gradient(180deg, #1a060a, #070305 70%);
      }

      .vs-hero__veil {
        position: absolute;
        inset: 0;
        z-index: 1;
        pointer-events: none;
        background:
          radial-gradient(circle 42% at var(--mx) var(--my), rgba(196, 90, 98, 0.14), transparent 58%),
          linear-gradient(180deg, rgba(7, 3, 5, 0.2) 0%, rgba(7, 3, 5, 0.5) 38%, rgba(7, 3, 5, 0.92) 100%);
        transition: background 0.12s linear;
      }

      .vs-hero__grain {
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
        opacity: 0.18;
        mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      }

      .vs-hero__copy {
        position: relative;
        z-index: 3;
        padding: 28px 22px 26px;
        width: 100%;
      }
      .vs-root[data-mode="thumb"] .vs-hero__copy { padding: 16px 14px 14px; }

      .vs-hero__kicker {
        margin: 0 0 10px;
        font-size: 9px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: var(--vs-gold);
      }
      .vs-root[data-mode="thumb"] .vs-hero__kicker { font-size: 10px; margin-bottom: 8px; }

      .vs-hero__brand {
        display: flex;
        flex-wrap: nowrap;
        gap: 0.06em;
        margin: 0 0 10px;
        font-family: var(--vs-display);
        font-style: italic;
        font-weight: 500;
        font-size: clamp(40px, 8vw, 72px);
        letter-spacing: 0;
        line-height: 0.9;
        color: #f7efe0;
        text-shadow: 0 2px 28px rgba(7, 3, 5, 0.7);
        white-space: nowrap;
      }
      .vs-hero__brand span {
        display: inline-block;
        opacity: 1;
      }
      .vs-root[data-mode="full"] .vs-hero__brand span {
        animation: vs-letter 0.36s ease both;
      }
      .vs-root[data-mode="thumb"] .vs-hero__brand {
        font-size: 58px;
        margin-bottom: 0;
        color: #f7efe0;
      }
      .vs-root[data-mode="thumb"] .vs-hero__brand span { animation: none; }

      .vs-hero__lead {
        margin: 0 0 18px;
        max-width: 36ch;
        font-size: 13px;
        line-height: 1.5;
        color: rgba(244, 234, 216, 0.78);
      }
      .vs-root[data-mode="thumb"] .vs-hero__lead,
      .vs-root[data-mode="thumb"] .vs-hero__actions,
      .vs-root[data-mode="thumb"] .vs-footer {
        display: none;
      }

      .vs-hero__actions { display: flex; flex-wrap: wrap; gap: 10px; }

      .vs-btn {
        appearance: none;
        position: relative;
        overflow: hidden;
        border: 1px solid var(--vs-gold);
        background: var(--vs-gold);
        color: #1a0c0e;
        font: inherit;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        padding: 11px 18px;
        cursor: pointer;
        transition: transform 0.18s, background 0.18s, color 0.18s, box-shadow 0.18s;
      }
      .vs-btn::after {
        content: "";
        position: absolute;
        inset: 0 auto 0 -40%;
        width: 40%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent);
        pointer-events: none;
        opacity: 0;
      }
      .vs-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(201, 163, 106, 0.22);
      }
      .vs-btn:hover::after {
        opacity: 1;
        animation: vs-sheen 0.4s ease;
      }
      .vs-btn--ghost {
        background: transparent;
        color: var(--vs-gold);
        box-shadow: none;
      }
      .vs-btn--ghost:hover {
        background: rgba(232, 213, 168, 0.06);
        box-shadow: none;
      }
      .vs-btn:disabled {
        opacity: 0.4;
        cursor: default;
        transform: none;
        box-shadow: none;
      }
      .vs-btn:disabled::after { display: none; }

      /* ── Interior pages ── */
      .vs-pad {
        padding: 18px 20px 22px;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
      }
      .vs-kicker {
        margin: 0 0 6px;
        font-size: 9px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--vs-gold);
      }
      .vs-h1 {
        margin: 0 0 6px;
        font-family: var(--vs-display);
        font-style: italic;
        font-weight: 500;
        font-size: clamp(28px, 5vw, 40px);
        letter-spacing: 0.04em;
        line-height: 1;
        color: var(--vs-gold);
      }
      .vs-sub {
        margin: 0 0 18px;
        max-width: 42ch;
        color: rgba(244, 234, 216, 0.5);
        font-size: 12px;
      }

      .vs-acts { display: grid; gap: 0; }
      .vs-act {
        border-top: 1px solid rgba(201, 163, 106, 0.14);
        transition: background 0.18s;
      }
      .vs-act:last-child { border-bottom: 1px solid rgba(201, 163, 106, 0.14); }
      .vs-act:hover { background: rgba(232, 213, 168, 0.03); }
      .vs-act.is-open { background: rgba(232, 213, 168, 0.04); }
      .vs-act__hit {
        appearance: none;
        width: 100%;
        display: grid;
        grid-template-columns: 52px 1fr auto;
        gap: 12px;
        align-items: baseline;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        padding: 14px 2px;
        cursor: pointer;
      }
      .vs-act__time {
        font-variant-numeric: tabular-nums;
        letter-spacing: 0.08em;
        color: var(--vs-gold);
        font-size: 11px;
      }
      .vs-act__title {
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 20px;
        font-weight: 500;
        letter-spacing: 0.04em;
      }
      .vs-act__kind {
        font-size: 8px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(244, 234, 216, 0.38);
      }
      .vs-act__body {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.22s ease;
      }
      .vs-act.is-open .vs-act__body { grid-template-rows: 1fr; }
      .vs-act__body > div {
        overflow: hidden;
        min-height: 0;
      }
      .vs-act__inner {
        padding: 0 0 12px 64px;
      }
      .vs-act__inner p {
        margin: 8px 0 10px;
        max-width: 46ch;
        color: rgba(244, 234, 216, 0.58);
        font-size: 12px;
      }
      .vs-act.is-open .vs-act__title {
        background: linear-gradient(90deg, var(--vs-gold), var(--vs-gold)) left bottom / 0 1px no-repeat;
        animation: vs-underline 0.26s ease 0.04s forwards;
      }
      @keyframes vs-underline {
        to { background-size: 100% 1px; }
      }

      /* ── Floor ── */
      .vs-floor-wrap {
        display: grid;
        grid-template-columns: 1.4fr 0.9fr;
        gap: 16px;
        align-items: stretch;
        flex: 1;
        min-height: 0;
      }
      .vs-floor {
        position: relative;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 8px;
        padding: 18px 14px 14px;
        min-height: 240px;
        border: 1px solid rgba(201, 163, 106, 0.32);
        background: rgba(232, 213, 168, 0.045);
      }
      .vs-stage {
        grid-column: 2 / 4;
        grid-row: 2;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(201, 163, 106, 0.55);
        font-size: 9px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: var(--vs-gold);
        background: #120308;
      }
      .vs-stage img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.42;
        display: block;
      }
      .vs-stage span {
        position: relative;
        z-index: 1;
        padding: 4px 8px;
        background: rgba(7, 3, 5, 0.55);
        letter-spacing: 0.28em;
      }
      .vs-table {
        appearance: none;
        border: 1px solid rgba(201, 163, 106, 0.42);
        background: rgba(7, 3, 5, 0.55);
        color: var(--vs-ink);
        font: inherit;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        transition: border-color 0.18s, background 0.18s, transform 0.18s, box-shadow 0.18s;
      }
      .vs-table strong {
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 16px;
        font-weight: 500;
        color: var(--vs-gold);
        line-height: 1;
      }
      .vs-table span {
        font-size: 7px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(244, 234, 216, 0.4);
      }
      .vs-table:hover:not(:disabled) {
        transform: translateY(-1px);
        border-color: var(--vs-gold);
      }
      .vs-table.is-on {
        border-color: var(--vs-gold);
        background: rgba(232, 213, 168, 0.1);
        box-shadow: 0 0 0 1px var(--vs-gold);
      }
      .vs-table.is-held {
        opacity: 0.38;
        cursor: default;
      }
      .vs-table.is-members {
        border-style: dashed;
      }

      .vs-side h3 {
        margin: 0 0 6px;
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 24px;
        font-weight: 500;
        color: var(--vs-gold);
      }
      .vs-side p {
        margin: 0 0 12px;
        color: rgba(244, 234, 216, 0.55);
        font-size: 12px;
      }
      .vs-meta {
        display: grid;
        gap: 4px;
        margin-bottom: 14px;
        font-size: 10px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(244, 234, 216, 0.42);
      }
      .vs-meta b { color: var(--vs-gold); font-weight: 500; }
      .vs-seal {
        padding: 16px 14px;
        border: 1px solid var(--vs-gold);
        background: rgba(232, 213, 168, 0.06);
        animation: vs-fade 0.22s ease;
      }
      .vs-seal strong {
        display: block;
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 22px;
        font-weight: 500;
        color: var(--vs-gold);
        margin-bottom: 4px;
      }

      /* ── Access ── */
      .vs-form {
        display: grid;
        gap: 10px;
        max-width: 320px;
        margin-top: 4px;
      }
      .vs-form label {
        display: grid;
        gap: 5px;
        font-size: 8px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: rgba(244, 234, 216, 0.45);
      }
      .vs-form input {
        appearance: none;
        border: 0;
        border-bottom: 1px solid rgba(201, 163, 106, 0.35);
        background: transparent;
        color: var(--vs-ink);
        font: inherit;
        font-size: 13px;
        padding: 8px 0;
        outline: none;
        letter-spacing: 0.02em;
        transition: border-color 0.18s;
      }
      .vs-form input:focus { border-bottom-color: var(--vs-gold); }
      .vs-form input::placeholder { color: rgba(244, 234, 216, 0.22); }

      /* ── Maison: interiors + programme ── */
      .vs-maison {
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        overflow: hidden;
      }
      .vs-maison__view {
        position: relative;
        min-height: 0;
        overflow: hidden;
        border-right: 1px solid rgba(201, 163, 106, 0.14);
      }
      .vs-maison__view img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: scale(1.04);
        transition: transform 0.28s ease;
      }
      .vs-maison__view:hover img { transform: scale(1.07); }
      .vs-maison__veil {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 35%, rgba(7, 3, 5, 0.88) 100%);
        pointer-events: none;
      }
      .vs-maison__cap {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 16px;
        z-index: 1;
      }
      .vs-maison__cap em {
        display: block;
        font-style: normal;
        font-size: 8px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: var(--vs-gold);
        margin-bottom: 4px;
      }
      .vs-maison__cap strong {
        display: block;
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 26px;
        font-weight: 500;
        color: #f7efe0;
      }
      .vs-maison__cap p {
        margin: 6px 0 0;
        max-width: 36ch;
        font-size: 11px;
        color: rgba(244, 234, 216, 0.7);
      }
      .vs-maison__side {
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: auto;
        padding: 14px 14px 16px;
      }
      .vs-maison__side .vs-act__hit {
        grid-template-columns: 44px 1fr auto;
        padding: 10px 0;
      }
      .vs-maison__side .vs-act__title { font-size: 16px; }
      .vs-maison__side .vs-act__inner { padding-left: 0; }
      .vs-root[data-mode="thumb"] .vs-nav__link {
        font-size: 7px;
        padding: 3px 4px;
        letter-spacing: 0.08em;
      }
      .vs-thumbs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        margin-bottom: 16px;
      }
      .vs-thumb {
        appearance: none;
        position: relative;
        border: 1px solid rgba(201, 163, 106, 0.22);
        padding: 0;
        overflow: hidden;
        aspect-ratio: 16 / 10;
        cursor: pointer;
        background: #120308;
        transition: border-color 0.18s;
      }
      .vs-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        opacity: 0.72;
        transition: opacity 0.16s, transform 0.22s;
      }
      .vs-thumb:hover img,
      .vs-thumb.is-on img {
        opacity: 1;
        transform: scale(1.04);
      }
      .vs-thumb.is-on { border-color: var(--vs-gold); }
      .vs-thumb span {
        position: absolute;
        left: 6px;
        bottom: 5px;
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #f7efe0;
        text-shadow: 0 1px 8px #070305;
      }

      /* ── Menu ── */
      .vs-menu {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
        flex: 1;
        min-height: 0;
      }
      .vs-menu h3 {
        margin: 0 0 10px;
        font-size: 8px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        color: var(--vs-gold);
        font-weight: 500;
      }
      .vs-dish {
        appearance: none;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: baseline;
        text-align: left;
        border: 0;
        border-bottom: 1px solid rgba(201, 163, 106, 0.12);
        background: transparent;
        color: inherit;
        font: inherit;
        padding: 10px 0;
        cursor: pointer;
        transition: background 0.18s;
      }
      .vs-dish:hover { background: rgba(232, 213, 168, 0.03); }
      .vs-dish.is-on .vs-dish__name {
        color: var(--vs-gold);
      }
      .vs-dish__name {
        display: block;
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 16px;
        font-weight: 500;
        transition: color 0.18s;
      }
      .vs-dish__note {
        display: block;
        margin-top: 2px;
        font-size: 10px;
        color: rgba(244, 234, 216, 0.42);
      }
      .vs-dish__price {
        font-variant-numeric: tabular-nums;
        font-size: 11px;
        letter-spacing: 0.06em;
        color: var(--vs-gold);
      }

      /* ── Rooms ── */
      .vs-rooms {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        flex: 1;
        min-height: 0;
      }
      .vs-rooms--row {
        grid-template-columns: repeat(4, 1fr);
        flex: 0 0 auto;
      }
      .vs-rooms--row .vs-room img { min-height: 108px; }
      .vs-rooms--row .vs-room__copy strong { font-size: 13px; }
      .vs-hall {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        gap: 14px;
      }
      .vs-hall .vs-floor-wrap { flex: 1; }
      .vs-room {
        appearance: none;
        position: relative;
        border: 1px solid rgba(120, 28, 42, 0.45);
        padding: 0;
        overflow: hidden;
        min-height: 0;
        cursor: pointer;
        background: #080204;
        text-align: left;
        color: inherit;
        font: inherit;
        transition: border-color 0.18s, transform 0.18s, filter 0.22s;
      }
      .vs-room:hover { transform: translateY(-1px); border-color: rgba(180, 50, 70, 0.7); }
      .vs-room.is-on { border-color: #c45a62; }
      .vs-room.is-held { opacity: 0.45; cursor: default; transform: none; }
      .vs-room.is-members { border-style: dashed; }
      .vs-room img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        min-height: 120px;
        filter: brightness(1.02) contrast(1.06) saturate(1.05);
        transition: filter 0.22s ease, transform 0.28s ease;
      }
      .vs-room:hover img,
      .vs-room.is-on img {
        filter: brightness(1.08) contrast(1.04) saturate(1.08);
        transform: scale(1.04);
      }
      .vs-room__veil {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 42%, rgba(8, 2, 4, 0.72) 100%);
        pointer-events: none;
      }
      .vs-room__copy {
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 10px;
        z-index: 1;
      }
      .vs-room__copy em {
        display: block;
        font-style: normal;
        font-size: 8px;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #c45a62;
        margin-bottom: 2px;
      }
      .vs-room__copy strong {
        display: block;
        font-family: var(--vs-display);
        font-style: italic;
        font-size: 18px;
        font-weight: 500;
      }

      .vs-footer {
        padding: 12px 20px 16px;
        border-top: 1px solid rgba(201, 163, 106, 0.1);
        color: rgba(244, 234, 216, 0.28);
        font-size: 8px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      @media (max-width: 640px) {
        .vs-floor-wrap,
        .vs-maison,
        .vs-menu { grid-template-columns: 1fr; }
        .vs-rooms--row { grid-template-columns: 1fr 1fr; }
        .vs-maison__view { min-height: 160px; border-right: 0; border-bottom: 1px solid rgba(201, 163, 106, 0.14); }
        .vs-hero__brand { font-size: 48px; }
        .vs-act__body > div { padding-left: 0; }
        .vs-act__inner { padding-left: 0; }
      }
    `}</style>
  );
}

function BrandLetters({ text, animate }: { text: string; animate: boolean }) {
  return (
    <h1 className="vs-hero__brand" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          style={animate ? { animationDelay: `${40 + i * 32}ms` } : undefined}
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}

export function VesperSite({
  accent = "#c9a36a",
  locale,
  mode,
}: {
  accent?: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const t = COPY[locale];
  const [page, setPage] = useState<PageId>("home");
  const [actId, setActId] = useState<string | null>(null);
  const [interiorId, setInteriorId] = useState(INTERIORS[0].id);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [held, setHeld] = useState(false);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [sealed, setSealed] = useState(false);
  const activePage = mode === "thumb" ? "home" : page;
  const selectedAct = ACTS.find((a) => a.id === actId) ?? null;
  const interior = INTERIORS.find((r) => r.id === interiorId) ?? INTERIORS[0];
  const selectedRoom = ROOMS.find((r) => r.id === roomId) ?? null;
  const selectedTable = TABLES.find((tb) => tb.id === tableId) ?? null;
  const selectedDish = MENU.find((m) => m.id === menuId) ?? null;

  const goTo = (id: PageId) => {
    if (mode !== "full") return;
    setPage(id);
  };

  const onHeroMove = (e: MouseEvent<HTMLElement>) => {
    if (mode !== "full") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  const pickTable = (tb: Table) => {
    if (mode !== "full") return;
    if (tb.status === "held") return;
    if (tb.status === "members") {
      goTo("access");
      return;
    }
    setTableId(tb.id);
    setRoomId(null);
    setHeld(false);
  };

  const pickRoom = (room: Room) => {
    if (mode !== "full") return;
    if (room.status === "held") return;
    if (room.status === "members") {
      goTo("access");
      return;
    }
    setRoomId(room.id);
    setTableId(null);
    setHeld(false);
  };

  const onSeal = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSealed(true);
  };

  const navPages: { id: PageId; label: string }[] = [
    { id: "home", label: t.nav.home },
    { id: "maison", label: t.nav.maison },
    { id: "menu", label: t.nav.menu },
    { id: "hall", label: t.nav.hall },
    { id: "rooms", label: t.nav.rooms },
    { id: "access", label: t.nav.access },
  ];

  const statusLabel = (s: Table["status"], kind: "table" | "room") => {
    if (s === "held") return kind === "room" ? t.takenRoom : t.taken;
    if (s === "members") return t.membersOnly;
    return kind === "room" ? t.openRoom : t.open;
  };

  return (
    <div className="vs-root" data-mode={mode} style={liveStyle(accent)}>
      <VesperStyles />
      <header className="vs-chrome" aria-hidden>
        <span className="vs-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="vs-chrome__url">
          {t.host} / {activePage}
        </span>
      </header>

      <div className="vs-body">
        <nav className="vs-nav" aria-label="Site">
          <span className="vs-nav__brand">{t.brand}</span>
          {navPages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`vs-nav__link${activePage === p.id ? " is-active" : ""}`}
              onClick={() => goTo(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>

        <main className="vs-page" key={activePage}>
          {activePage === "home" && (
            <div className="vs-home">
              <section className="vs-hero" onMouseMove={onHeroMove}>
                {mode === "thumb" ? (
                  <div className="vs-hero__static" />
                ) : (
                  <VelvetLiquidBg />
                )}
                <div className="vs-hero__veil" aria-hidden />
                <div className="vs-hero__grain" aria-hidden />
                <div className="vs-hero__copy">
                  <p className="vs-hero__kicker">{t.kicker}</p>
                  <BrandLetters text={t.brand} animate={mode === "full"} />
                  <p className="vs-hero__lead">{t.lead}</p>
                  <div className="vs-hero__actions">
                    <button type="button" className="vs-btn" onClick={() => goTo("hall")}>
                      {t.ctaTable}
                    </button>
                    <button
                      type="button"
                      className="vs-btn vs-btn--ghost"
                      onClick={() => goTo("maison")}
                    >
                      {t.ctaNight}
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activePage === "maison" && (
            <div className="vs-maison">
              <div className="vs-maison__view">
                <img src={interior.img} alt={interior.title[locale]} />
                <div className="vs-maison__veil" aria-hidden />
                <div className="vs-maison__cap">
                  <em>{t.interiors}</em>
                  <strong>{interior.title[locale]}</strong>
                  <p>{interior.caption[locale]}</p>
                </div>
              </div>
              <div className="vs-maison__side">
                <div className="vs-thumbs">
                  {INTERIORS.map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      className={`vs-thumb${interiorId === room.id ? " is-on" : ""}`}
                      onClick={() => setInteriorId(room.id)}
                    >
                      <img src={room.img} alt="" />
                      <span>{room.title[locale]}</span>
                    </button>
                  ))}
                </div>
                <p className="vs-kicker">{t.programme}</p>
                <h2 className="vs-h1" style={{ fontSize: 28, marginBottom: 8 }}>
                  {t.maisonTitle}
                </h2>
                <p className="vs-sub">{t.maisonSub}</p>
                <div className="vs-acts">
                  {ACTS.map((act) => {
                    const open = actId === act.id;
                    return (
                      <article key={act.id} className={`vs-act${open ? " is-open" : ""}`}>
                        <button
                          type="button"
                          className="vs-act__hit"
                          onClick={() => setActId(open ? null : act.id)}
                        >
                          <span className="vs-act__time">{act.time}</span>
                          <span className="vs-act__title">{act.title[locale]}</span>
                          <span className="vs-act__kind">{act.kind[locale]}</span>
                        </button>
                        <div className="vs-act__body">
                          <div>
                            <div className="vs-act__inner">
                              <p>{act.body[locale]}</p>
                              <button
                                type="button"
                                className="vs-btn vs-btn--ghost"
                                onClick={() => goTo("hall")}
                              >
                                {t.holdFor}
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activePage === "menu" && (
            <div className="vs-pad">
              <p className="vs-kicker">{t.nav.menu}</p>
              <h2 className="vs-h1">{t.menuTitle}</h2>
              <p className="vs-sub">{t.menuSub}</p>
              <div className="vs-menu">
                {(["cellar", "kitchen"] as const).map((section) => (
                  <div key={section}>
                    <h3>{section === "cellar" ? t.cellar : t.kitchen}</h3>
                    {MENU.filter((item) => item.section === section).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`vs-dish${menuId === item.id ? " is-on" : ""}`}
                        onClick={() => {
                          setMenuId(item.id);
                          setSent(false);
                        }}
                      >
                        <span>
                          <span className="vs-dish__name">{item.name[locale]}</span>
                          <span className="vs-dish__note">{item.note[locale]}</span>
                        </span>
                        <span className="vs-dish__price">{item.price}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                {sent && selectedDish ? (
                  <div className="vs-seal" style={{ maxWidth: 360 }}>
                    <strong>{t.sentTitle}</strong>
                    <p>
                      {selectedDish.name[locale]} · {t.sentLead}
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="vs-btn"
                    disabled={!selectedDish}
                    onClick={() => selectedDish && setSent(true)}
                  >
                    {t.sendToRoom}
                  </button>
                )}
              </div>
            </div>
          )}

          {activePage === "hall" && (
            <div className="vs-pad vs-hall">
              <div>
                <p className="vs-kicker">{t.nav.hall}</p>
                <h2 className="vs-h1">{t.hallTitle}</h2>
                <p className="vs-sub">
                  {t.hallSub}
                  {selectedAct ? ` · ${t.forHour} ${selectedAct.title[locale]} ${selectedAct.time}` : ""}
                </p>
              </div>
              <div className="vs-floor-wrap">
                <div className="vs-floor" aria-label={t.hallTitle}>
                  {TABLES.map((tb) => (
                    <button
                      key={tb.id}
                      type="button"
                      className={`vs-table${tableId === tb.id ? " is-on" : ""}${
                        tb.status === "held" ? " is-held" : ""
                      }${tb.status === "members" ? " is-members" : ""}`}
                      style={{ gridColumn: tb.col, gridRow: tb.row }}
                      disabled={tb.status === "held"}
                      onClick={() => pickTable(tb)}
                    >
                      <strong>{tb.roman}</strong>
                      <span>{statusLabel(tb.status, "table")}</span>
                    </button>
                  ))}
                  <div className="vs-stage">
                    <img src={vesperPhotos.theatre} alt="" />
                    <span>{t.stage}</span>
                  </div>
                </div>
                <aside className="vs-side">
                  {held && selectedTable ? (
                    <div className="vs-seal">
                      <strong>{t.heldTitle}</strong>
                      <p>{t.heldLead}</p>
                    </div>
                  ) : selectedTable ? (
                    <>
                      <h3>
                        {t.nav.hall} {selectedTable.roman}
                      </h3>
                      <p>
                        {selectedTable.kind[locale]} · {selectedTable.covers} {t.covers}
                      </p>
                      <div className="vs-meta">
                        <span>
                          {t.open} · <b>{selectedTable.roman}</b>
                        </span>
                      </div>
                      <button type="button" className="vs-btn" onClick={() => setHeld(true)}>
                        {t.holdCta}
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>{t.hallTitle}</h3>
                      <p>{t.hallHint}</p>
                    </>
                  )}
                </aside>
              </div>
            </div>
          )}

          {activePage === "rooms" && (
            <div className="vs-pad vs-hall">
              <div>
                <p className="vs-kicker">{t.nav.rooms}</p>
                <h2 className="vs-h1">{t.cabinets}</h2>
                <p className="vs-sub">{t.cabinetsSub}</p>
              </div>
              <div className="vs-floor-wrap">
                <div className="vs-rooms">
                  {ROOMS.map((room) => (
                    <button
                      key={room.id}
                      type="button"
                      className={`vs-room${roomId === room.id ? " is-on" : ""}${
                        room.status === "held" ? " is-held" : ""
                      }${room.status === "members" ? " is-members" : ""}`}
                      disabled={room.status === "held"}
                      onClick={() => pickRoom(room)}
                    >
                      <img src={room.img} alt="" />
                      <div className="vs-room__veil" />
                      <div className="vs-room__copy">
                        <em>{statusLabel(room.status, "room")}</em>
                        <strong>{room.title[locale]}</strong>
                      </div>
                    </button>
                  ))}
                </div>
                <aside className="vs-side">
                  {held && selectedRoom ? (
                    <div className="vs-seal">
                      <strong>{t.heldTitle}</strong>
                      <p>{t.heldLead}</p>
                    </div>
                  ) : selectedRoom ? (
                    <>
                      <h3>{selectedRoom.title[locale]}</h3>
                      <p>
                        {selectedRoom.kind[locale]} · {selectedRoom.covers} {t.covers}
                      </p>
                      <div className="vs-meta">
                        <span>
                          {t.openRoom} · <b>{selectedRoom.title[locale]}</b>
                        </span>
                      </div>
                      <button type="button" className="vs-btn" onClick={() => setHeld(true)}>
                        {t.holdRoomCta}
                      </button>
                    </>
                  ) : (
                    <>
                      <h3>{t.cabinets}</h3>
                      <p>{t.cabinetsSub}</p>
                    </>
                  )}
                </aside>
              </div>
            </div>
          )}

          {activePage === "access" && (
            <div className="vs-pad">
              <p className="vs-kicker">{t.nav.access}</p>
              <h2 className="vs-h1">{t.accessTitle}</h2>
              <p className="vs-sub">{t.accessSub}</p>
              {sealed ? (
                <div className="vs-seal" style={{ maxWidth: 360 }}>
                  <strong>{t.sealed}</strong>
                  <p>{t.sealedLead}</p>
                </div>
              ) : (
                <form className="vs-form" onSubmit={onSeal}>
                  <label>
                    {t.formName}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.formPhName}
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    {t.formNote}
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={t.formPhNote}
                      autoComplete="off"
                    />
                  </label>
                  <button type="submit" className="vs-btn" disabled={!name.trim()}>
                    {t.formSubmit}
                  </button>
                </form>
              )}
            </div>
          )}
        </main>

        <footer className="vs-footer">{t.footer}</footer>
      </div>
    </div>
  );
}

export function VesperSiteThumb(props: Omit<Parameters<typeof VesperSite>[0], "mode">) {
  return <VesperSite {...props} mode="thumb" />;
}

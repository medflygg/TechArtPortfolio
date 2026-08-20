import { type ReactNode, useMemo, useState } from "react";
import { shikhovoPhotos } from "./shikhovoPhotos";

export type LivingMode = "full" | "thumb";

type PageId =
  | "home"
  | "map"
  | "animals"
  | "tickets"
  | "celebrate"
  | "cottages"
  | "cottage"
  | "zone";

type Zone = {
  id: string;
  name: string;
  short: string;
  body: string;
  img: string;
  tip: string;
  map: { x: number; y: number };
};

type Animal = {
  id: string;
  name: string;
  zoneId: string;
  img: string;
  body: string;
  habit: string;
  fun: string;
  age: string;
};

type Ticket = {
  id: string;
  name: string;
  blurb: string;
  weekday: { adult: number; child: number };
  weekend: { adult: number; child: number };
  festival: { adult: number; child: number };
  ages: string;
  note: string;
};

type Celeb = {
  id: string;
  title: string;
  short: string;
  body: string;
  includes: string[];
  forWho: string;
};

type Cottage = {
  id: string;
  name: string;
  blurb: string;
  img: string;
  gallery: string[];
  guests: string;
  weekday: number;
  weekend: number;
  includes: string[];
  amenities: string[];
  rules: string[];
};

/** Pins relative to full plan image (park left, legend right). */
const ZONES: Zone[] = [
  {
    id: "husky",
    name: "Хаски-остров",
    short: "Упряжки и общение",
    body: "Сибирские хаски живут на отдельном острове. Можно познакомиться с собаками, а зимой — прокатиться на упряжке. С 1 февраля зона оплачивается отдельно к билету «Парк».",
    img: shikhovoPhotos.husky,
    tip: "Зона 18 · с 1 февраля отдельно",
    map: { x: 18, y: 20 },
  },
  {
    id: "deer",
    name: "Северная деревня",
    short: "Олений парк",
    body: "Северные олени и атмосфера северной деревни. Зимой — сани и упряжки. С 1 февраля оплачивается отдельно.",
    img: shikhovoPhotos.deer,
    tip: "Зона 19 · северные программы",
    map: { x: 28, y: 16 },
  },
  {
    id: "alpaca",
    name: "Деревня альпак",
    short: "Мягкие и любопытные",
    body: "Альпаки и ламы — спокойная прогулка, объятия и тёплые фото. Любимая зона у детей.",
    img: shikhovoPhotos.alpaca,
    tip: "Зона 14 · входит в «Парк»",
    map: { x: 38, y: 44 },
  },
  {
    id: "croc",
    name: "Крокодиловая ферма",
    short: "Самая большая в Подмосковье",
    body: "Кроконариум и экзотические гости. Смотрим спокойно, кормим только с разрешения сотрудников.",
    img: shikhovoPhotos.croc,
    tip: "Зона 20 · комплекс «Экзотик»",
    map: { x: 22, y: 36 },
  },
  {
    id: "pony",
    name: "Конный двор",
    short: "Лошади и пони",
    body: "Катания на лошадях и пони, фотосессии. Дополнительная услуга на территории.",
    img: shikhovoPhotos.pony,
    tip: "Зоны 16 / 26 · доп. услуга",
    map: { x: 50, y: 58 },
  },
  {
    id: "cottages",
    name: "Коттеджи и BBQ",
    short: "Дом Альпака · Дом Енота",
    body: "Гостевые дома «Дикие» и мангальные зоны для семейного дня или праздника.",
    img: shikhovoPhotos.cottage,
    tip: "Зоны 47–50 · бронь отдельно",
    map: { x: 12, y: 26 },
  },
];

const ANIMALS: Animal[] = [
  {
    id: "husky",
    name: "Сибирский хаски",
    zoneId: "husky",
    img: shikhovoPhotos.husky,
    body: "Дружелюбные ездовые собаки. Можно погладить и познакомиться на Хаски-острове.",
    habit: "Хаски-остров",
    fun: "Зимой — упряжка",
    age: "С 3 лет рядом",
  },
  {
    id: "alpaca",
    name: "Альпаки и ламы",
    zoneId: "alpaca",
    img: shikhovoPhotos.alpaca,
    body: "Пушистые и спокойные — идеальны для фото и мягкого общения.",
    habit: "Деревня альпак",
    fun: "Объятия и фото",
    age: "Любимцы малышей",
  },
  {
    id: "deer",
    name: "Северные олени",
    zoneId: "deer",
    img: shikhovoPhotos.deer,
    body: "Живут в Северной деревне. Зимой можно прокатиться на упряжке.",
    habit: "Северная деревня",
    fun: "Сани зимой",
    age: "Семейная зона",
  },
  {
    id: "croc",
    name: "Крокодилы",
    zoneId: "croc",
    img: shikhovoPhotos.croc,
    body: "Самая большая крокодиловая ферма в Подмосковье.",
    habit: "Кроконариум",
    fun: "Кормление с гидом",
    age: "Смотрим спокойно",
  },
  {
    id: "pony",
    name: "Лошади и пони",
    zoneId: "pony",
    img: shikhovoPhotos.pony,
    body: "Катания и фотосессии на конном дворе. Для детей — особенно пони.",
    habit: "Конюшня / манеж",
    fun: "Катание и фото",
    age: "Пони — для детей",
  },
  {
    id: "fox",
    name: "Лисы",
    zoneId: "alpaca",
    img: shikhovoPhotos.fox,
    body: "Рыжие жители хищного двора — смотрим и фотографируем рядом с вольером.",
    habit: "Хищный двор",
    fun: "Фото у вольера",
    age: "Под присмотром",
  },
  {
    id: "raccoon",
    name: "Еноты",
    zoneId: "alpaca",
    img: shikhovoPhotos.raccoon,
    body: "Любопытные лапки и тёплые носы. Живут в павильоне зоопарка.",
    habit: "Павильон зоопарка",
    fun: "Милые лапки",
    age: "Детям нравится",
  },
];

const TICKETS: Ticket[] = [
  {
    id: "park",
    name: "Билет «Парк»",
    blurb: "Основная территория зоофермы.",
    weekday: { adult: 800, child: 600 },
    weekend: { adult: 1000, child: 800 },
    festival: { adult: 1500, child: 1200 },
    ages: "Взрослый от 14 · детский 3–14",
    note: "Хаски-остров и Северная деревня с 1 февраля — отдельно.",
  },
  {
    id: "all",
    name: "Всё включено",
    blurb: "Парк + Хаски-остров + Северная деревня.",
    weekday: { adult: 2200, child: 1800 },
    weekend: { adult: 2200, child: 1800 },
    festival: { adult: 2200, child: 1800 },
    ages: "Взрослый от 14 · детский 5–14",
    note: "Удобно, если хотите обойти все северные зоны.",
  },
  {
    id: "aurora",
    name: "Северное сияние",
    blurb: "Северный день с акцентом на упряжки и деревню.",
    weekday: { adult: 2800, child: 2300 },
    weekend: { adult: 2800, child: 2300 },
    festival: { adult: 2800, child: 2300 },
    ages: "Взрослый от 14 · детский 5–14",
    note: "Состав комплекса уточняйте на кассе.",
  },
  {
    id: "exotic",
    name: "Экзотик",
    blurb: "Парк + крокодиловая ферма / тропикариум.",
    weekday: { adult: 1600, child: 1200 },
    weekend: { adult: 1600, child: 1200 },
    festival: { adult: 1600, child: 1200 },
    ages: "Взрослый от 14 · детский 3–14",
    note: "Самая большая крокодиловая ферма в Подмосковье.",
  },
];

const DAY_PLANS = [
  { title: "Обнять альпаку", body: "Спокойная прогулка и мягкие фото в деревне альпак.", icon: "paw" as const },
  { title: "Познакомиться с хаски", body: "Тёплое общение на Хаски-острове — особенно зимой на упряжке.", icon: "paw" as const },
  { title: "Заглянуть к крокодилам", body: "Экзотика для детей и взрослых в одном месте.", icon: "leaf" as const },
  { title: "Остаться в домике", body: "Мангал, коттедж и тихий вечер после прогулки.", icon: "home" as const },
];

const CELEB: Celeb[] = [
  {
    id: "bday",
    title: "День рождения",
    short: "Сценарий для детей без ярмарочной суеты",
    body: "Зоны с животными, мастер-классы и понятный маршрут. Можно добавить беседку, юрту или коттедж.",
    includes: [
      "Встреча у животных и фото",
      "Мастер-класс (ловец снов / роспись игрушки)",
      "Катание на пони или программа с хаски — по запросу",
      "Аренда беседки или юрты",
    ],
    forWho: "Семьи с детьми 3–12 лет",
  },
  {
    id: "school",
    title: "Школьный выезд",
    short: "Квесты и экскурсии для классов",
    body: "Готовые программы для 1–4, 5–8 и 9–11 классов: квесты, «В мире животных», Хаски-остров и Северная деревня.",
    includes: [
      "Экскурсия-квест «Путешествие сквозь время»",
      "«Шиховские скауты»",
      "Научно-познавательная «В мире животных»",
      "Комбо-обеды для групп",
    ],
    forWho: "Школьные группы и дошкольники",
  },
  {
    id: "family",
    title: "Семейный день",
    short: "Билеты + домик или мангал",
    body: "Приезжайте без записи с 10:00 до 19:00. Соберите день сами: животные, катания, мастер-классы и пикник.",
    includes: [
      "Билет «Парк» или комплекс",
      "Мангальная зона или коттедж",
      "Катания и тир по желанию",
      "Скидка 20% по карте москвича на вход",
    ],
    forWho: "Семьи и компании друзей",
  },
  {
    id: "corp",
    title: "Корпоратив и VIP",
    short: "Шатёр, юрта и командные программы",
    body: "От эко-корпоратива до VIP «Мир народов Арктики». Шатер до 80 человек, юрта «Роза Ветров», квесты для взрослых.",
    includes: [
      "Аренда шатра или тематической юрты",
      "Командные квесты и катания",
      "Индивидуальные VIP-программы",
      "Банкетная зона по запросу",
    ],
    forWho: "Команды и особые события",
  },
];

const COTTAGES: Cottage[] = [
  {
    id: "alpaca",
    name: "Дом Альпака",
    blurb: "Уютный домик с панорамными окнами рядом с деревней альпак.",
    img: shikhovoPhotos.cottage,
    gallery: shikhovoPhotos.cottageGallery,
    guests: "До 4 гостей · дети до 3 лет бесплатно",
    weekday: 10000,
    weekend: 12000,
    includes: [
      "Проживание 2 человек",
      "Мангальная зона",
      "Входные билеты в парк",
    ],
    amenities: [
      "Кухня: плита, микроволновка, чайник, посуда",
      "Зал с диваном, проектор, Алиса, Wi‑Fi",
      "Спальня с двуспальной кроватью",
      "Душ, фен, полотенца, гель и шампунь",
    ],
    rules: [
      "Заезд 15:00–18:00, выезд 11:00",
      "Доплата за доп. гостя — 2000 ₽/сутки",
      "Своих животных нельзя",
      "Аванс 50% (перенос не позднее чем за 7 суток)",
    ],
  },
  {
    id: "enot",
    name: "Дом Енота",
    blurb: "Уютный дом с озорным характером — манеж для малышей и детский стульчик.",
    img: shikhovoPhotos.cottage2,
    gallery: shikhovoPhotos.cottage2Gallery,
    guests: "До 4 гостей · дети до 3 лет бесплатно",
    weekday: 12000,
    weekend: 14000,
    includes: [
      "Проживание 2 человек",
      "Мангальная зона",
      "Входные билеты в парк",
    ],
    amenities: [
      "Кухня: плита, микроволновка, чайник, посуда",
      "Зал с диваном, ТВ, Алиса, Wi‑Fi, детский стульчик",
      "Спальня с двуспальной кроватью и манежем до 3 лет",
      "Душ, фен, полотенца, детский горшок",
    ],
    rules: [
      "Заезд 15:00–18:00, выезд до 11:00",
      "Доплата за доп. гостя — 2000 ₽/сутки",
      "Своих животных нельзя",
      "Предоплата 50% (перенос не позднее чем за 7 суток)",
    ],
  },
];

function money(n: number) {
  return `${n.toLocaleString("ru-RU")} ₽`;
}

function Icon({
  name,
  className = "",
}: {
  name: "paw" | "leaf" | "home" | "ticket" | "map" | "back" | "cal";
  className?: string;
}) {
  const common = {
    className: `sh-ico ${className}`,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };
  if (name === "paw") {
    return (
      <svg {...common}>
        <circle cx="7" cy="8" r="2.1" fill="currentColor" />
        <circle cx="12" cy="6.2" r="2.1" fill="currentColor" />
        <circle cx="17" cy="8" r="2.1" fill="currentColor" />
        <path
          d="M8.2 13.2c1.2-1.6 6.4-1.6 7.6 0 1 1.3.5 3.6-1.7 4.4-1.4.5-3 .5-4.2 0-2.2-.8-2.7-3.1-1.7-4.4Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === "leaf") {
    return (
      <svg {...common}>
        <path
          d="M19 5c-6.2.4-11 3.8-12.8 9.2-1.2 3.5.4 6.3 3.4 6.3 5.8 0 10.2-7.4 9.4-15.5Z"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="currentColor"
          fillOpacity="0.18"
        />
        <path d="M7.5 14.5c2.4-1.2 5-3.8 7.2-7.2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (name === "home") {
    return (
      <svg {...common}>
        <path
          d="M4.5 11.2 12 4.8l7.5 6.4V19a1.2 1.2 0 0 1-1.2 1.2H5.7A1.2 1.2 0 0 1 4.5 19v-7.8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="currentColor"
          fillOpacity="0.14"
        />
        <path d="M10 20.2v-5.4h4v5.4" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  if (name === "ticket") {
    return (
      <svg {...common}>
        <path
          d="M4 8.5A1.5 1.5 0 0 1 5.5 7h13A1.5 1.5 0 0 1 20 8.5v2a1.6 1.6 0 0 0 0 3.2v2A1.5 1.5 0 0 1 18.5 17h-13A1.5 1.5 0 0 1 4 15.5v-2a1.6 1.6 0 0 0 0-3.2v-1.8Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <path d="M12 8v8" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (name === "map") {
    return (
      <svg {...common}>
        <path
          d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="currentColor"
          fillOpacity="0.14"
        />
        <circle cx="12" cy="11" r="2.2" fill="currentColor" />
      </svg>
    );
  }
  if (name === "cal") {
    return (
      <svg {...common}>
        <rect
          x="4"
          y="6"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <path d="M8 4v4M16 4v4M4 10h16" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M14 6 8 12l6 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function Styles() {
  return (
    <style>{`
      @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&family=Literata:opsz,wght@7..72,600;7..72,700&display=swap");

      .sh-root {
        --sh-bg: #eef6f1;
        --sh-paper: #ffffff;
        --sh-ink: #1f3329;
        --sh-muted: rgba(31, 51, 41, 0.58);
        --sh-line: rgba(31, 51, 41, 0.1);
        --sh-a: #2f9e6b;
        --sh-soft: #dff3e8;
        --sh-display: "Literata", "Georgia", serif;
        --sh-body: "Nunito", "Trebuchet MS", sans-serif;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100%;
        position: relative;
        background:
          radial-gradient(ellipse 60% 42% at 8% 0%, rgba(47,158,107,0.14), transparent 55%),
          radial-gradient(ellipse 48% 36% at 100% 8%, rgba(58,143,214,0.10), transparent 52%),
          linear-gradient(180deg, #f7fcf9 0%, var(--sh-bg) 48%, #e8f3ec 100%);
        color: var(--sh-ink);
        font-family: var(--sh-body);
        font-size: 12px;
        line-height: 1.4;
        overflow: hidden;
        user-select: none;
      }
      .sh-root[data-mode="thumb"] { font-size: 10px; }

      .sh-ico { width: 14px; height: 14px; flex: 0 0 auto; display: block; }
      .sh-cta .sh-ico, .sh-back .sh-ico { width: 13px; height: 13px; }
      .sh-nav__link .sh-ico { width: 11px; height: 11px; }

      .sh-chrome {
        display: flex; align-items: center; gap: 8px;
        height: 26px; padding: 0 10px; flex-shrink: 0;
        background: rgba(255,255,255,0.72); border-bottom: 1px solid var(--sh-line);
      }
      .sh-root[data-mode="thumb"] .sh-chrome { height: 18px; padding: 0 6px; }
      .sh-chrome__dots { display: flex; gap: 4px; }
      .sh-chrome__dots i { width: 7px; height: 7px; border-radius: 50%; }
      .sh-root[data-mode="thumb"] .sh-chrome__dots i { width: 5px; height: 5px; }
      .sh-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .sh-chrome__dots i:nth-child(2) { background: #febc2e; }
      .sh-chrome__dots i:nth-child(3) { background: #28c840; }
      .sh-chrome__url {
        flex: 1; height: 16px; display: flex; align-items: center;
        padding: 0 8px; border-radius: 999px;
        background: rgba(255,255,255,0.85); color: rgba(31,51,41,0.45);
        font-size: 9px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
      }

      .sh-body {
        flex: 1; min-height: 0; overflow: auto;
        display: flex; flex-direction: column;
        container-type: size;
        scrollbar-gutter: stable;
      }
      .sh-root[data-mode="thumb"] .sh-body { overflow: hidden; scrollbar-gutter: auto; }

      .sh-nav {
        display: flex; align-items: center; gap: 3px;
        padding: 7px 10px; position: sticky; top: 0; z-index: 6;
        background: rgba(247,252,249,0.94); backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--sh-line);
        flex-shrink: 0;
        --sh-nav-h: 42px;
      }
      .sh-root[data-mode="thumb"] .sh-nav { padding: 5px 8px; }
      .sh-nav__brand {
        display: flex; align-items: center; gap: 7px;
        margin-right: auto; appearance: none; border: 0; background: transparent;
        cursor: pointer; color: inherit; font: inherit; padding: 0;
      }
      .sh-nav__logo { width: 20px; height: 20px; object-fit: contain; }
      .sh-root[data-mode="thumb"] .sh-nav__logo { width: 16px; height: 16px; }
      .sh-nav__name {
        font-family: var(--sh-display); font-weight: 700; font-size: 15px;
      }
      .sh-root[data-mode="thumb"] .sh-nav__name { font-size: 12px; }
      .sh-nav__link {
        appearance: none; border: 0; background: transparent;
        color: var(--sh-muted); font: inherit; font-weight: 700;
        font-size: 10px; padding: 5px 7px; border-radius: 999px; cursor: pointer;
        display: inline-flex; align-items: center; gap: 4px;
        transition: background 0.15s, color 0.15s;
      }
      .sh-nav__link:hover { color: var(--sh-ink); background: rgba(31,51,41,0.05); }
      .sh-nav__link.is-active { color: #fff; background: var(--sh-a); }

      .sh-back {
        appearance: none; border: 0; background: transparent;
        color: var(--sh-a); font: inherit; font-weight: 800;
        font-size: 11px; padding: 0 0 8px; cursor: pointer;
        display: inline-flex; align-items: center; gap: 5px;
      }

      .sh-hero {
        position: relative; flex-shrink: 0;
        min-height: 0; flex: 1.2; overflow: hidden;
        display: flex; flex-direction: column; justify-content: flex-end;
      }
      .sh-root[data-mode="thumb"] .sh-hero { flex: 1.15; }
      .sh-hero__img {
        position: absolute; inset: 0;
        background: center / cover no-repeat;
      }
      .sh-hero__veil {
        position: absolute; inset: 0;
        background:
          linear-gradient(90deg, rgba(20,40,30,0.72) 0%, rgba(20,40,30,0.28) 55%, rgba(20,40,30,0.15) 100%),
          linear-gradient(180deg, rgba(20,40,30,0.05) 20%, rgba(20,40,30,0.55) 100%);
      }
      .sh-hero__copy {
        position: relative; z-index: 1; padding: 16px 16px 14px; color: #fff;
        max-width: 36em;
      }
      .sh-root[data-mode="thumb"] .sh-hero__copy { padding: 10px 12px 12px; max-width: none; }
      .sh-kicker {
        font-size: 10px; font-weight: 800; letter-spacing: 0.08em;
        text-transform: uppercase; color: rgba(255,255,255,0.82); margin-bottom: 6px;
        display: inline-flex; align-items: center; gap: 6px;
      }
      .sh-root[data-mode="thumb"] .sh-kicker { font-size: 8px; margin-bottom: 4px; }
      .sh-hero h1 {
        font-family: var(--sh-display); font-size: 34px; line-height: 0.98;
        margin: 0 0 6px; font-weight: 700;
      }
      .sh-root[data-mode="thumb"] .sh-hero h1 { font-size: 24px; margin-bottom: 4px; }
      .sh-hero p { margin: 0 0 10px; color: rgba(255,255,255,0.9); max-width: 34em; }
      .sh-root[data-mode="thumb"] .sh-hero p {
        font-size: 10px; margin-bottom: 0; max-width: 28em;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }

      .sh-cta {
        appearance: none; border: 0; cursor: pointer; font: inherit; font-weight: 800;
        padding: 8px 13px; border-radius: 999px;
        display: inline-flex; align-items: center; gap: 6px;
        transition: transform 0.14s, box-shadow 0.14s;
      }
      .sh-cta:hover { transform: translateY(-1px); }
      .sh-cta--main { background: #fff; color: var(--sh-ink); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
      .sh-cta--green { background: var(--sh-a); color: #fff; }
      .sh-cta--soft { background: rgba(47,158,107,0.12); color: var(--sh-a); }
      .sh-cta-row { display: flex; flex-wrap: wrap; gap: 8px; }

      .sh-info {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 1px; background: var(--sh-line); flex-shrink: 0;
      }
      .sh-info__item { background: rgba(255,255,255,0.9); padding: 8px 10px; }
      .sh-root[data-mode="thumb"] .sh-info__item { padding: 5px 7px; }
      .sh-info__item strong { display: block; font-size: 10px; font-weight: 800; margin-bottom: 1px; }
      .sh-root[data-mode="thumb"] .sh-info__item strong { font-size: 8px; }
      .sh-info__item span { color: var(--sh-muted); font-size: 10px; font-weight: 600; }
      .sh-root[data-mode="thumb"] .sh-info__item span { font-size: 8px; }

      /* First viewport stage = body scrollport minus sticky nav */
      .sh-home-stage {
        flex: 1 0 auto;
        min-height: calc(100cqh - var(--sh-nav-h, 42px));
        display: flex;
        flex-direction: column;
      }
      .sh-root[data-mode="thumb"] .sh-home-stage {
        min-height: 0;
        flex: 1;
      }
      .sh-chips {
        display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
        padding: 10px 10px 12px; flex: 0.9; align-content: stretch;
        min-height: 0;
      }
      .sh-root[data-mode="thumb"] .sh-chips {
        gap: 5px; padding: 7px 8px 8px; flex: 0.85;
      }
      .sh-chip {
        appearance: none; border: 1px solid var(--sh-line); background: var(--sh-paper);
        border-radius: 12px; padding: 0; overflow: hidden; cursor: pointer; text-align: left;
        color: inherit; font: inherit; min-height: 0;
        height: 100%; display: flex; flex-direction: column;
      }
      .sh-root[data-mode="thumb"] .sh-chip { border-radius: 10px; }
      .sh-chip__img {
        flex: 1; min-height: 72px; background: center / cover no-repeat;
      }
      .sh-root[data-mode="thumb"] .sh-chip__img { min-height: 40px; }
      .sh-chip__txt { padding: 7px 8px 9px; flex-shrink: 0; }
      .sh-chip__txt strong { display: block; font-size: 11px; font-weight: 800; }
      .sh-chip__txt span { color: var(--sh-muted); font-size: 9px; }
      .sh-root[data-mode="thumb"] .sh-chip__txt { padding: 4px 5px 5px; }
      .sh-root[data-mode="thumb"] .sh-chip__txt strong { font-size: 8px; }
      .sh-root[data-mode="thumb"] .sh-chip__txt span { display: none; }

      .sh-section { padding: 6px 10px 14px; }
      .sh-section h2 {
        font-family: var(--sh-display); font-size: 20px; margin: 0 0 4px; font-weight: 700;
      }
      .sh-section > p { margin: 0 0 10px; color: var(--sh-muted); max-width: 44em; }
      .sh-plans { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
      .sh-plan {
        padding: 10px; border-radius: 12px; background: var(--sh-paper);
        border: 1px solid var(--sh-line);
      }
      .sh-plan h3 {
        margin: 0 0 3px; font-size: 12px; font-weight: 800;
        display: flex; align-items: center; gap: 6px; color: var(--sh-ink);
      }
      .sh-plan h3 .sh-ico { color: var(--sh-a); }
      .sh-plan p { margin: 0; color: var(--sh-muted); font-size: 10px; }

      .sh-home-map {
        margin-top: 10px; border-radius: 14px; overflow: hidden;
        border: 1px solid var(--sh-line); background: var(--sh-paper);
        display: grid; grid-template-columns: 1.15fr 0.85fr;
      }
      .sh-home-map__img { min-height: 128px; background: center / cover no-repeat; }
      .sh-home-map__copy { padding: 12px; display: flex; flex-direction: column; gap: 7px; }
      .sh-home-map__copy h3 { font-family: var(--sh-display); font-size: 16px; margin: 0; }
      .sh-home-map__copy p { margin: 0; color: var(--sh-muted); }

      .sh-page { padding: 10px 12px 16px; animation: sh-in 0.24s ease; }
      @keyframes sh-in {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: none; }
      }
      .sh-title {
        font-family: var(--sh-display); font-size: 22px; margin: 0 0 4px; font-weight: 700;
      }
      .sh-lead { margin: 0 0 10px; color: var(--sh-muted); max-width: 48em; }

      .sh-map-wrap {
        margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--sh-line);
      }
      .sh-map-wrap h3 {
        margin: 0 0 6px; font-family: var(--sh-display); font-size: 16px;
      }
      .sh-map-wrap > p { margin: 0 0 8px; color: var(--sh-muted); font-size: 11px; }
      .sh-map {
        position: relative; border-radius: 14px; overflow: hidden;
        border: 1px solid var(--sh-line); background: #e7efe6;
      }
      .sh-map__stage {
        position: relative; width: 100%;
      }
      .sh-map__img {
        width: 100%; height: auto; display: block;
      }
      .sh-pin {
        position: absolute; transform: translate(-50%, -100%);
        appearance: none; border: 0; cursor: pointer;
        padding: 0; background: transparent; z-index: 2;
      }
      .sh-pin__dot {
        width: 12px; height: 12px; border-radius: 50%;
        background: var(--sh-a); border: 2px solid #fff;
        box-shadow: 0 3px 8px rgba(31,51,41,0.28);
        display: block;
      }
      .sh-pin__label {
        position: absolute; left: 50%; top: -20px; transform: translateX(-50%);
        white-space: nowrap; font-size: 8px; font-weight: 800;
        background: #fff; color: var(--sh-ink); padding: 2px 6px; border-radius: 999px;
        border: 1px solid var(--sh-line); pointer-events: none;
      }
      .sh-zone-list { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 10px; }
      .sh-zone-card {
        display: grid; grid-template-columns: 72px 1fr auto; gap: 8px; align-items: center;
        padding: 6px; border-radius: 12px; background: var(--sh-paper);
        border: 1px solid var(--sh-line); cursor: pointer; text-align: left;
        appearance: none; color: inherit; font: inherit; width: 100%;
      }
      .sh-zone-card img { width: 72px; height: 54px; object-fit: cover; border-radius: 8px; }
      .sh-zone-card h3 { margin: 0 0 2px; font-size: 12px; font-weight: 800; }
      .sh-zone-card p { margin: 0; color: var(--sh-muted); font-size: 10px; }
      .sh-zone-card__go { color: var(--sh-a); font-weight: 800; font-size: 10px; }

      .sh-facts { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 10px; }
      .sh-fact {
        padding: 10px; border-radius: 12px; background: var(--sh-soft);
        border: 1px solid rgba(47,158,107,0.18);
      }
      .sh-fact h3 { margin: 0 0 3px; font-size: 12px; font-weight: 800; }
      .sh-fact p { margin: 0; color: var(--sh-muted); font-size: 10px; }

      .sh-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
      .sh-animal {
        border-radius: 14px; overflow: hidden; background: var(--sh-paper);
        border: 1px solid var(--sh-line); text-align: left;
        appearance: none; padding: 0; cursor: pointer; color: inherit; font: inherit;
        display: flex; flex-direction: column;
      }
      .sh-animal img { width: 100%; height: 88px; object-fit: cover; display: block; }
      .sh-animal__copy { padding: 8px 9px 10px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
      .sh-animal__copy h3 { margin: 0; font-size: 12px; font-weight: 800; }
      .sh-animal__copy p { margin: 0; color: var(--sh-muted); font-size: 10px; }
      .sh-animal__meta {
        display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px;
      }
      .sh-tag {
        font-size: 9px; font-weight: 800; padding: 3px 6px; border-radius: 999px;
        background: rgba(47,158,107,0.12); color: var(--sh-a);
      }
      .sh-tag--soft { background: rgba(31,51,41,0.06); color: var(--sh-muted); }
      .sh-animal__go {
        margin-top: auto; padding-top: 4px;
        color: var(--sh-a); font-weight: 800; font-size: 10px;
        display: inline-flex; align-items: center; gap: 4px;
      }

      .sh-detail {
        border-radius: 14px; overflow: hidden; background: var(--sh-paper);
        border: 1px solid var(--sh-line);
        display: grid; grid-template-columns: 1.05fr 1fr;
      }
      .sh-detail img { width: 100%; height: 100%; min-height: 180px; object-fit: cover; display: block; }
      .sh-detail__copy { padding: 14px; }
      .sh-detail__copy h2 {
        font-family: var(--sh-display); font-size: 22px; margin: 0 0 6px;
      }
      .sh-badge {
        display: inline-flex; align-items: center; gap: 5px; margin-bottom: 8px;
        padding: 4px 8px; border-radius: 999px; background: rgba(47,158,107,0.12);
        color: var(--sh-a); font-size: 10px; font-weight: 800;
      }

      .sh-ticket-layout {
        display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 10px; align-items: start;
      }
      .sh-ticket {
        width: 100%; text-align: left; appearance: none; cursor: pointer;
        background: var(--sh-paper); border: 1px solid var(--sh-line);
        border-radius: 12px; padding: 9px 10px; margin-bottom: 7px; color: inherit; font: inherit;
      }
      .sh-ticket.is-active { border-color: var(--sh-a); box-shadow: 0 0 0 2px rgba(47,158,107,0.18); }
      .sh-ticket h3 { margin: 0 0 2px; font-size: 13px; font-weight: 800; }
      .sh-ticket p { margin: 0 0 4px; color: var(--sh-muted); font-size: 11px; }
      .sh-ticket__meta { font-size: 10px; color: var(--sh-muted); margin-bottom: 3px; }
      .sh-ticket__price { font-weight: 800; color: var(--sh-a); font-size: 11px; }
      .sh-summary {
        position: sticky; top: 48px; background: var(--sh-paper);
        border: 1px solid var(--sh-line); border-radius: 14px; padding: 12px;
      }
      .sh-summary h3 { margin: 0 0 8px; font-family: var(--sh-display); font-size: 17px; }
      .sh-seg {
        display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 10px;
      }
      .sh-seg button {
        appearance: none; border: 1px solid rgba(47,158,107,0.35); background: #fff;
        border-radius: 999px; padding: 7px 4px; font: inherit; font-weight: 800;
        font-size: 10px; cursor: pointer; color: var(--sh-a);
      }
      .sh-seg button.is-on { background: var(--sh-a); color: #fff; border-color: var(--sh-a); }
      .sh-qty {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 7px; font-weight: 700;
      }
      .sh-qty__ctrl { display: flex; align-items: center; gap: 8px; }
      .sh-qty__ctrl button {
        width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--sh-line);
        background: #fff; font: inherit; font-weight: 800; cursor: pointer; color: var(--sh-ink);
      }
      .sh-total {
        display: flex; justify-content: space-between; align-items: baseline;
        margin: 10px 0; padding-top: 8px; border-top: 1px solid var(--sh-line);
      }
      .sh-total strong { font-family: var(--sh-display); font-size: 20px; }
      .sh-note { color: var(--sh-muted); font-size: 10px; margin: 0 0 8px; }
      .sh-held {
        margin-top: 8px; padding: 8px; border-radius: 10px;
        background: rgba(47,158,107,0.12); font-weight: 700; font-size: 11px;
      }
      .sh-rules {
        margin-top: 8px; padding: 10px; border-radius: 12px;
        background: rgba(58,143,214,0.08); border: 1px solid rgba(58,143,214,0.18);
      }
      .sh-rules h3 { margin: 0 0 5px; font-size: 12px; font-weight: 800; }
      .sh-rules ul { margin: 0; padding-left: 15px; color: var(--sh-muted); font-size: 10px; }

      .sh-celeb { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
      .sh-celeb__card {
        text-align: left; appearance: none; cursor: pointer; color: inherit; font: inherit;
        padding: 0; border-radius: 14px; background: var(--sh-paper);
        border: 1px solid var(--sh-line); overflow: hidden;
      }
      .sh-celeb__card.is-open { border-color: var(--sh-a); box-shadow: 0 0 0 2px rgba(47,158,107,0.14); }
      .sh-celeb__head { padding: 11px 12px; }
      .sh-celeb__head h3 {
        margin: 0 0 3px; font-size: 13px; font-weight: 800;
        display: flex; align-items: center; gap: 6px;
      }
      .sh-celeb__head h3 .sh-ico { color: var(--sh-a); }
      .sh-celeb__head p { margin: 0; color: var(--sh-muted); font-size: 10px; }
      .sh-celeb__body {
        padding: 0 12px 12px; border-top: 1px solid var(--sh-line);
        background: rgba(47,158,107,0.04);
      }
      .sh-celeb__body p { margin: 8px 0; color: var(--sh-ink); font-size: 11px; }
      .sh-celeb__body ul { margin: 0; padding-left: 15px; color: var(--sh-muted); font-size: 10px; }
      .sh-celeb__body li { margin-bottom: 3px; }
      .sh-celeb__who {
        margin-top: 8px; font-size: 10px; font-weight: 800; color: var(--sh-a);
      }

      .sh-cottage {
        display: grid; grid-template-columns: 1.05fr 1fr; gap: 0;
        border-radius: 14px; overflow: hidden; border: 1px solid var(--sh-line);
        background: var(--sh-paper); margin-bottom: 8px;
      }
      .sh-cottage img { width: 100%; height: 132px; object-fit: cover; }
      .sh-cottage__copy { padding: 11px; display: flex; flex-direction: column; gap: 6px; }
      .sh-cottage__copy h3 { margin: 0; font-size: 14px; font-weight: 800; }
      .sh-cottage__copy p { margin: 0; color: var(--sh-muted); flex: 1; font-size: 11px; }
      .sh-cottage__price { font-weight: 800; color: var(--sh-a); font-size: 12px; }

      .sh-cottage-detail {
        display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 10px; align-items: start;
      }
      .sh-gallery {
        display: grid; grid-template-columns: 1.4fr 1fr; gap: 6px;
      }
      .sh-gallery button {
        appearance: none; border: 0; padding: 0; cursor: pointer; background: transparent;
        border-radius: 10px; overflow: hidden; display: block; width: 100%;
      }
      .sh-gallery img {
        width: 100%; height: 110px; object-fit: cover; display: block;
        border: 1px solid var(--sh-line); border-radius: 10px;
        transition: transform 0.2s ease;
      }
      .sh-gallery button:hover img { transform: scale(1.02); }
      .sh-gallery button:first-child { grid-row: span 2; }
      .sh-gallery button:first-child img { height: 226px; }

      .sh-lightbox {
        position: absolute; inset: 0; z-index: 40;
        background: rgba(18, 28, 22, 0.88);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 10px; padding: 16px;
        animation: sh-in 0.18s ease;
      }
      .sh-lightbox__img-wrap {
        position: relative; width: min(92%, 860px); max-height: 70%;
        display: flex; align-items: center; justify-content: center;
      }
      .sh-lightbox__img-wrap img {
        max-width: 100%; max-height: min(62vh, 520px);
        object-fit: contain; border-radius: 12px;
        box-shadow: 0 16px 40px rgba(0,0,0,0.35);
      }
      .sh-lightbox__nav {
        position: absolute; top: 50%; transform: translateY(-50%);
        width: 36px; height: 36px; border-radius: 50%;
        border: 0; background: rgba(255,255,255,0.92); color: var(--sh-ink);
        font: inherit; font-weight: 800; font-size: 18px; cursor: pointer;
      }
      .sh-lightbox__nav--prev { left: 8px; }
      .sh-lightbox__nav--next { right: 8px; }
      .sh-lightbox__bar {
        display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 700;
      }
      .sh-lightbox__close {
        appearance: none; border: 0; cursor: pointer; font: inherit; font-weight: 800;
        padding: 8px 12px; border-radius: 999px; background: #fff; color: var(--sh-ink);
      }
      .sh-lightbox__dots { display: flex; gap: 5px; }
      .sh-lightbox__dots i {
        width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.35);
      }
      .sh-lightbox__dots i.is-on { background: #fff; }
      .sh-book {
        background: var(--sh-paper); border: 1px solid var(--sh-line);
        border-radius: 14px; padding: 12px;
      }
      .sh-book h3 {
        margin: 0 0 8px; font-family: var(--sh-display); font-size: 17px;
        display: flex; align-items: center; gap: 6px;
      }
      .sh-cal {
        display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 10px;
      }
      .sh-cal__dow {
        text-align: center; font-size: 9px; font-weight: 800; color: var(--sh-muted); padding: 2px 0;
      }
      .sh-cal__day {
        appearance: none; border: 1px solid transparent; background: rgba(31,51,41,0.03);
        border-radius: 8px; padding: 6px 0; font: inherit; font-weight: 800; font-size: 10px;
        cursor: pointer; color: var(--sh-ink);
      }
      .sh-cal__day.is-muted { opacity: 0.28; cursor: default; }
      .sh-cal__day.is-weekend { color: var(--sh-a); }
      .sh-cal__day.is-on { background: var(--sh-a); color: #fff; }
      .sh-book__price {
        display: flex; justify-content: space-between; align-items: baseline;
        margin: 8px 0 10px; padding-top: 8px; border-top: 1px solid var(--sh-line);
      }
      .sh-book__price strong { font-family: var(--sh-display); font-size: 20px; }
      .sh-list-block { margin-top: 10px; }
      .sh-list-block h4 { margin: 0 0 4px; font-size: 12px; font-weight: 800; }
      .sh-list-block ul { margin: 0; padding-left: 15px; color: var(--sh-muted); font-size: 10px; }

      .sh-footer {
        margin-top: auto; padding: 6px 12px 10px;
        color: rgba(31,51,41,0.4); font-size: 9px; font-weight: 700;
      }

      @media (max-width: 820px) {
        .sh-ticket-layout, .sh-home-map, .sh-cottage, .sh-cottage-detail, .sh-detail, .sh-celeb,
        .sh-plans, .sh-facts, .sh-zone-list, .sh-grid {
          grid-template-columns: 1fr;
        }
        .sh-gallery { grid-template-columns: 1fr 1fr; }
        .sh-gallery button:first-child { grid-row: auto; }
        .sh-gallery button:first-child img { height: 120px; }
        .sh-hero h1 { font-size: 28px; }
      }
    `}</style>
  );
}

function Shell({
  url,
  mode,
  children,
}: {
  url: string;
  mode: LivingMode;
  children: ReactNode;
}) {
  return (
    <div className="sh-root" data-mode={mode}>
      <Styles />
      <header className="sh-chrome" aria-hidden>
        <span className="sh-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="sh-chrome__url">{url}</span>
      </header>
      <div className="sh-body">{children}</div>
    </div>
  );
}

function buildMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { day: number | null; weekend: boolean }[] = [];
  for (let i = 0; i < startPad; i++) cells.push({ day: null, weekend: false });
  for (let d = 1; d <= daysInMonth; d++) {
    const wd = new Date(year, month, d).getDay();
    cells.push({ day: d, weekend: wd === 0 || wd === 5 || wd === 6 });
  }
  return cells;
}

export function ShikhovoSite({
  accent = "#2f9e6b",
  mode,
}: {
  accent?: string;
  locale?: "en" | "ru";
  mode: LivingMode;
}) {
  const [page, setPage] = useState<PageId>("home");
  const [zoneId, setZoneId] = useState("husky");
  const [zoneFrom, setZoneFrom] = useState<PageId>("map");
  const [ticketId, setTicketId] = useState("park");
  const [dayType, setDayType] = useState<"weekday" | "weekend" | "festival">("weekend");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [held, setHeld] = useState(false);
  const [celebOpen, setCelebOpen] = useState<string | null>("bday");
  const [cottageId, setCottageId] = useState("alpaca");
  const [bookDay, setBookDay] = useState(15);
  const [bookHeld, setBookHeld] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const activePage = mode === "thumb" ? "home" : page;
  const zone = ZONES.find((z) => z.id === zoneId) ?? ZONES[0];
  const ticket = TICKETS.find((t) => t.id === ticketId) ?? TICKETS[0];
  const cottage = COTTAGES.find((c) => c.id === cottageId) ?? COTTAGES[0];
  const price =
    dayType === "festival"
      ? ticket.festival
      : dayType === "weekend"
        ? ticket.weekend
        : ticket.weekday;
  const total = useMemo(
    () => price.adult * adults + price.child * children,
    [price, adults, children],
  );

  const month = 7; // August demo
  const year = 2026;
  const calCells = useMemo(() => buildMonthDays(year, month), [year, month]);
  const selectedWeekend = useMemo(() => {
    const wd = new Date(year, month, bookDay).getDay();
    return wd === 0 || wd === 5 || wd === 6;
  }, [bookDay, year, month]);
  const cottagePrice = selectedWeekend ? cottage.weekend : cottage.weekday;

  const go = (id: PageId) => {
    if (mode === "full") setPage(id);
  };

  const openZone = (id: string, from: PageId) => {
    setZoneId(id);
    setZoneFrom(from);
    go("zone");
  };

  const openCottage = (id: string) => {
    setCottageId(id);
    setBookHeld(false);
    setLightbox(null);
    go("cottage");
  };

  const gallery = cottage.gallery;
  const openLightbox = (index: number) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const stepLightbox = (dir: -1 | 1) => {
    if (lightbox == null) return;
    const next = (lightbox + dir + gallery.length) % gallery.length;
    setLightbox(next);
  };

  const nav: { id: PageId; label: string; icon?: "paw" | "map" | "ticket" | "home" | "leaf" }[] = [
    { id: "home", label: "Главная" },
    { id: "map", label: "Карта", icon: "map" },
    { id: "animals", label: "Животные", icon: "paw" },
    { id: "tickets", label: "Билеты", icon: "ticket" },
    { id: "celebrate", label: "Праздник", icon: "leaf" },
    { id: "cottages", label: "Домики", icon: "home" },
  ];

  const pageLabel =
    activePage === "zone"
      ? zone.name
      : activePage === "cottage"
        ? cottage.name
        : (nav.find((n) => n.id === activePage)?.label ?? "Главная");

  const navActive = (id: PageId) => {
    if (activePage === id) return true;
    if (activePage === "zone" && id === zoneFrom) return true;
    if (activePage === "cottage" && id === "cottages") return true;
    return false;
  };

  return (
    <Shell url={`shihovopark.ru / ${pageLabel}`} mode={mode}>
      <nav className="sh-nav" style={{ ["--sh-a" as string]: accent }}>
        <button type="button" className="sh-nav__brand" onClick={() => go("home")}>
          <img className="sh-nav__logo" src={shikhovoPhotos.logo} alt="" />
          <span className="sh-nav__name">Шихово</span>
        </button>
        {mode === "full" &&
          nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sh-nav__link${navActive(item.id) ? " is-active" : ""}`}
              onClick={() => go(item.id)}
            >
              {item.icon ? <Icon name={item.icon} /> : null}
              {item.label}
            </button>
          ))}
      </nav>

      {activePage === "home" && (
        <>
          <div className="sh-home-stage">
            <section className="sh-hero">
              <div
                className="sh-hero__img"
                style={{ backgroundImage: `url(${shikhovoPhotos.hero})` }}
              />
              <div className="sh-hero__veil" />
              <div className="sh-hero__copy">
                <div className="sh-kicker">
                  <Icon name="paw" /> Зооферма · Подмосковье
                </div>
                <h1>Шихово</h1>
                <p>
                  Здоровый семейный отдых на природе: хаски, альпаки, олени, крокодилы и уютные
                  домики.
                </p>
                {mode === "full" && (
                  <div className="sh-cta-row">
                    <button
                      type="button"
                      className="sh-cta sh-cta--main"
                      onClick={() => go("tickets")}
                    >
                      <Icon name="ticket" /> Выбрать билеты
                    </button>
                    <button type="button" className="sh-cta sh-cta--soft" onClick={() => go("map")}>
                      <Icon name="map" /> Карта территории
                    </button>
                  </div>
                )}
              </div>
            </section>

            <div className="sh-info">
              <div className="sh-info__item">
                <strong>Адрес</strong>
                <span>МО, дер. Шихово, 100с1</span>
              </div>
              <div className="sh-info__item">
                <strong>Режим</strong>
                <span>Пн–Вс 10:00–19:00 · касса до 18:30</span>
              </div>
              <div className="sh-info__item">
                <strong>Телефон</strong>
                <span>+7 (495) 255-31-21</span>
              </div>
            </div>

            <div className="sh-chips">
              {ZONES.slice(0, 4).map((z) => (
                <button
                  key={z.id}
                  type="button"
                  className="sh-chip"
                  onClick={() => openZone(z.id, "home")}
                >
                  <div className="sh-chip__img" style={{ backgroundImage: `url(${z.img})` }} />
                  <div className="sh-chip__txt">
                    <strong>{z.name}</strong>
                    <span>{z.short}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {mode === "full" && (
            <section className="sh-section">
              <h2>Что можно сделать за день</h2>
              <p>
                Без предварительной записи. Приезжайте семьёй — маршрут простой, зоны понятные, а
                детям легко ориентироваться.
              </p>
              <div className="sh-plans">
                {DAY_PLANS.map((item) => (
                  <article key={item.title} className="sh-plan">
                    <h3>
                      <Icon name={item.icon} /> {item.title}
                    </h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>

              <div className="sh-home-map">
                <div
                  className="sh-home-map__img"
                  style={{ backgroundImage: `url(${shikhovoPhotos.field})` }}
                />
                <div className="sh-home-map__copy">
                  <h3>Территория и зоны</h3>
                  <p>
                    Хаски-остров, Северная деревня, альпаки, крокодилы и домики — сначала зоны,
                    план-схема ниже на странице карты.
                  </p>
                  <div className="sh-cta-row">
                    <button type="button" className="sh-cta sh-cta--green" onClick={() => go("map")}>
                      <Icon name="map" /> Открыть карту
                    </button>
                    <button
                      type="button"
                      className="sh-cta sh-cta--soft"
                      onClick={() => go("animals")}
                    >
                      <Icon name="paw" /> Животные
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {activePage === "map" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go("home")}>
            <Icon name="back" /> На главную
          </button>
          <h2 className="sh-title">Карта территории</h2>
          <p className="sh-lead">
            Сначала выберите зону — удобнее для семьи. Подробная план-схема — внизу страницы.
          </p>
          <div className="sh-facts">
            <article className="sh-fact">
              <h3>Как добраться</h3>
              <p>МО, Дмитровский район, деревня Шихово, 100с1. Удобно на машине из Москвы.</p>
            </article>
            <article className="sh-fact">
              <h3>На месте</h3>
              <p>Касса до 18:30, территория до 19:00. С картой москвича — скидка 20% на вход.</p>
            </article>
          </div>
          <div className="sh-zone-list">
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                className="sh-zone-card"
                onClick={() => openZone(z.id, "map")}
              >
                <img src={z.img} alt="" />
                <div>
                  <h3>{z.name}</h3>
                  <p>{z.short}</p>
                </div>
                <span className="sh-zone-card__go">Открыть</span>
              </button>
            ))}
          </div>
          <div className="sh-map-wrap">
            <h3>План-схема парка</h3>
            <p>Нажмите точку на схеме — откроется зона.</p>
            <div className="sh-map">
              <div className="sh-map__stage">
                <img className="sh-map__img" src={shikhovoPhotos.map} alt="Карта зоофермы Шихово" />
                {ZONES.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    className="sh-pin"
                    style={{ left: `${z.map.x}%`, top: `${z.map.y}%` }}
                    onClick={() => openZone(z.id, "map")}
                    aria-label={z.name}
                  >
                    <span className="sh-pin__label">{z.name}</span>
                    <span className="sh-pin__dot" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {activePage === "zone" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go(zoneFrom)}>
            <Icon name="back" />{" "}
            {zoneFrom === "animals"
              ? "К животным"
              : zoneFrom === "home"
                ? "На главную"
                : "К карте"}
          </button>
          <article className="sh-detail">
            <img src={zone.img} alt={zone.name} />
            <div className="sh-detail__copy">
              <span className="sh-badge">
                <Icon name="paw" /> {zone.tip}
              </span>
              <h2>{zone.name}</h2>
              <p>{zone.body}</p>
              <div className="sh-cta-row" style={{ marginTop: 12 }}>
                <button type="button" className="sh-cta sh-cta--green" onClick={() => go("tickets")}>
                  <Icon name="ticket" /> Подобрать билеты
                </button>
                <button type="button" className="sh-cta sh-cta--soft" onClick={() => go("animals")}>
                  <Icon name="paw" /> Все животные
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {activePage === "animals" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go("home")}>
            <Icon name="back" /> На главную
          </button>
          <h2 className="sh-title">Наши животные</h2>
          <p className="sh-lead">
            Настоящие жители фермы. Нажмите карточку — откроется зона. Назад вернёт сюда.
          </p>
          <div className="sh-grid">
            {ANIMALS.map((a) => (
              <button
                key={a.id}
                type="button"
                className="sh-animal"
                onClick={() => openZone(a.zoneId, "animals")}
              >
                <img src={a.img} alt={a.name} />
                <div className="sh-animal__copy">
                  <h3>{a.name}</h3>
                  <p>{a.body}</p>
                  <div className="sh-animal__meta">
                    <span className="sh-tag">{a.habit}</span>
                    <span className="sh-tag sh-tag--soft">{a.fun}</span>
                    <span className="sh-tag sh-tag--soft">{a.age}</span>
                  </div>
                  <span className="sh-animal__go">
                    <Icon name="map" /> Смотреть зону
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {activePage === "tickets" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go("home")}>
            <Icon name="back" /> На главную
          </button>
          <h2 className="sh-title">Входные билеты</h2>
          <p className="sh-lead">Цены и возрасты — с сайта Шихово. Соберите день справа.</p>
          <div className="sh-ticket-layout">
            <div>
              {TICKETS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  className={`sh-ticket${ticketId === pack.id ? " is-active" : ""}`}
                  onClick={() => {
                    setTicketId(pack.id);
                    setHeld(false);
                  }}
                >
                  <h3>{pack.name}</h3>
                  <p>{pack.blurb}</p>
                  <div className="sh-ticket__meta">{pack.ages}</div>
                  <div className="sh-ticket__price">
                    будни от {money(pack.weekday.child)} · выходные от {money(pack.weekend.child)}
                  </div>
                </button>
              ))}
              <div className="sh-rules">
                <h3>Правила посещения</h3>
                <ul>
                  <li>Без своих животных</li>
                  <li>Без велосипедов, самокатов, роликов и беговелов</li>
                  <li>Кормить животных можно только разрешёнными лакомствами</li>
                </ul>
              </div>
            </div>
            <aside className="sh-summary">
              <h3>{ticket.name}</h3>
              <div className="sh-seg">
                <button
                  type="button"
                  className={dayType === "weekday" ? "is-on" : ""}
                  onClick={() => setDayType("weekday")}
                >
                  Будни
                </button>
                <button
                  type="button"
                  className={dayType === "weekend" ? "is-on" : ""}
                  onClick={() => setDayType("weekend")}
                >
                  Выходные
                </button>
                <button
                  type="button"
                  className={dayType === "festival" ? "is-on" : ""}
                  onClick={() => setDayType("festival")}
                >
                  Праздник
                </button>
              </div>
              <div className="sh-qty">
                <span>Взрослый</span>
                <div className="sh-qty__ctrl">
                  <button type="button" onClick={() => setAdults((n) => Math.max(1, n - 1))}>
                    −
                  </button>
                  <span>{adults}</span>
                  <button type="button" onClick={() => setAdults((n) => Math.min(10, n + 1))}>
                    +
                  </button>
                </div>
              </div>
              <div className="sh-qty">
                <span>Детский</span>
                <div className="sh-qty__ctrl">
                  <button type="button" onClick={() => setChildren((n) => Math.max(0, n - 1))}>
                    −
                  </button>
                  <span>{children}</span>
                  <button type="button" onClick={() => setChildren((n) => Math.min(10, n + 1))}>
                    +
                  </button>
                </div>
              </div>
              <p className="sh-note">
                {ticket.ages}. {ticket.note}
              </p>
              <div className="sh-total">
                <span>Итого</span>
                <strong>{money(total)}</strong>
              </div>
              <button
                type="button"
                className="sh-cta sh-cta--green"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setHeld(true)}
              >
                <Icon name="ticket" /> Забронировать день
              </button>
              {held ? (
                <div className="sh-held">
                  День зарезервирован в прототипе. На сайте — звонок или форма заявки.
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      )}

      {activePage === "celebrate" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go("home")}>
            <Icon name="back" /> На главную
          </button>
          <h2 className="sh-title">Ваш праздник</h2>
          <p className="sh-lead">
            Программы с сайта Шихово. Раскройте карточку — внутри состав и для кого.
          </p>
          <div className="sh-celeb">
            {CELEB.map((item) => {
              const open = celebOpen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`sh-celeb__card${open ? " is-open" : ""}`}
                  onClick={() => setCelebOpen(open ? null : item.id)}
                >
                  <div className="sh-celeb__head">
                    <h3>
                      <Icon name="leaf" /> {item.title}
                    </h3>
                    <p>{item.short}</p>
                  </div>
                  {open ? (
                    <div className="sh-celeb__body">
                      <p>{item.body}</p>
                      <ul>
                        {item.includes.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                      <div className="sh-celeb__who">{item.forWho}</div>
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="sh-cta-row" style={{ marginTop: 12 }}>
            <button type="button" className="sh-cta sh-cta--green" onClick={() => go("cottages")}>
              <Icon name="home" /> Смотреть домики
            </button>
            <button type="button" className="sh-cta sh-cta--soft" onClick={() => go("tickets")}>
              <Icon name="ticket" /> К билетам
            </button>
          </div>
        </section>
      )}

      {activePage === "cottages" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go("home")}>
            <Icon name="back" /> На главную
          </button>
          <h2 className="sh-title">Коттеджи и BBQ</h2>
          <p className="sh-lead">
            Дом Альпака и Дом Енота — фото с сайта. Откройте «Подробнее» для галереи, календаря и
            цен.
          </p>
          {COTTAGES.map((c) => (
            <article key={c.id} className="sh-cottage">
              <img src={c.img} alt={c.name} />
              <div className="sh-cottage__copy">
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
                <div className="sh-cottage__price">
                  будни {money(c.weekday)} · выходные {money(c.weekend)}
                </div>
                <button
                  type="button"
                  className="sh-cta sh-cta--green"
                  onClick={() => openCottage(c.id)}
                >
                  <Icon name="cal" /> Подробнее
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {activePage === "cottage" && (
        <section className="sh-page sh-page--inner">
          <button type="button" className="sh-back" onClick={() => go("cottages")}>
            <Icon name="back" /> К домикам
          </button>
          <h2 className="sh-title">{cottage.name}</h2>
          <p className="sh-lead">{cottage.blurb}</p>
          <div className="sh-cottage-detail">
            <div>
              <div className="sh-gallery">
                {gallery.map((src, i) => (
                  <button key={src} type="button" onClick={() => openLightbox(i)} aria-label="Открыть фото">
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
              <div className="sh-list-block">
                <h4>В стоимость входит</h4>
                <ul>
                  {cottage.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="sh-list-block">
                <h4>Удобства</h4>
                <ul>
                  {cottage.amenities.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="sh-list-block">
                <h4>Важно</h4>
                <ul>
                  {cottage.rules.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <aside className="sh-book">
              <h3>
                <Icon name="cal" /> Бронирование · август 2026
              </h3>
              <p className="sh-note">{cottage.guests}</p>
              <div className="sh-cal">
                {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((d) => (
                  <div key={d} className="sh-cal__dow">
                    {d}
                  </div>
                ))}
                {calCells.map((cell, i) =>
                  cell.day == null ? (
                    <button key={`e-${i}`} type="button" className="sh-cal__day is-muted" disabled>
                      {" "}
                    </button>
                  ) : (
                    <button
                      key={cell.day}
                      type="button"
                      className={`sh-cal__day${cell.weekend ? " is-weekend" : ""}${
                        bookDay === cell.day ? " is-on" : ""
                      }`}
                      onClick={() => {
                        setBookDay(cell.day!);
                        setBookHeld(false);
                      }}
                    >
                      {cell.day}
                    </button>
                  ),
                )}
              </div>
              <div className="sh-book__price">
                <span>{selectedWeekend ? "Выходные" : "Будни"} · 2 гостя</span>
                <strong>{money(cottagePrice)}</strong>
              </div>
              <button
                type="button"
                className="sh-cta sh-cta--green"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setBookHeld(true)}
              >
                <Icon name="home" /> Запросить бронь
              </button>
              {bookHeld ? (
                <div className="sh-held">
                  Заявка на {bookDay}.08.2026 сохранена в прототипе. На сайте: +7 (925) 668-08-85.
                </div>
              ) : null}
            </aside>
          </div>

          {lightbox != null ? (
            <div
              className="sh-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Галерея домика"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
            >
              <div className="sh-lightbox__img-wrap">
                <button
                  type="button"
                  className="sh-lightbox__nav sh-lightbox__nav--prev"
                  onClick={() => stepLightbox(-1)}
                  aria-label="Предыдущее фото"
                >
                  ‹
                </button>
                <img src={gallery[lightbox]} alt={`${cottage.name} · фото ${lightbox + 1}`} />
                <button
                  type="button"
                  className="sh-lightbox__nav sh-lightbox__nav--next"
                  onClick={() => stepLightbox(1)}
                  aria-label="Следующее фото"
                >
                  ›
                </button>
              </div>
              <div className="sh-lightbox__bar">
                <span>
                  {lightbox + 1} / {gallery.length}
                </span>
                <div className="sh-lightbox__dots">
                  {gallery.map((_, i) => (
                    <i key={i} className={i === lightbox ? "is-on" : ""} />
                  ))}
                </div>
                <button type="button" className="sh-lightbox__close" onClick={closeLightbox}>
                  Закрыть
                </button>
              </div>
            </div>
          ) : null}
        </section>
      )}

      {mode === "full" && (
        <footer className="sh-footer">
          Шихово · МО, Дмитровский район · Пн–Вс 10:00–19:00 · портфолио-кейс
        </footer>
      )}
    </Shell>
  );
}

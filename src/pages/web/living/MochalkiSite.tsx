import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import { mochalkiPhotos } from "./mochalkiPhotos";

export type LivingMode = "full" | "thumb";
type Locale = "en" | "ru";
type PageId = "home" | "catalog" | "product" | "cart" | "checkout";
type CategoryId = "all" | "body" | "face";

type Product = {
  id: string;
  category: "body" | "face";
  name: Record<Locale, string>;
  short: Record<Locale, string>;
  description: Record<Locale, string>;
  howTo: Record<Locale, string[]>;
  price: number;
  salePrice: number | null;
  img: string;
  gallery: string[];
  stock: number;
};

type CartLine = { id: string; qty: number };

const PRODUCTS: Product[] = [
  {
    id: "body-exfoliator",
    category: "body",
    name: {
      en: "Stimulite body exfoliator",
      ru: "Боди-эксфолиатор Stimulite",
    },
    short: {
      en: "Dual-sided honeycomb surface for the body.",
      ru: "Двусторонняя honeycomb-поверхность для тела.",
    },
    description: {
      en: "Dual-sided honeycomb gently renews skin, boosts circulation, and builds rich foam with a drop of gel. Use wet or dry.",
      ru: "Двусторонняя honeycomb-поверхность мягко обновляет кожу, стимулирует кровоток и даёт густую пену с каплей геля. Можно использовать влажным или сухим способом.",
    },
    howTo: {
      en: [
        "Wet the tool and skin with warm water",
        "Add a drop of gel or oil — cells foam up",
        "Guide in soft upward circles",
        "Rinse and hang to dry",
      ],
      ru: [
        "Смочите инструмент и кожу тёплой водой",
        "Добавьте каплю геля или масла — ячейки вспенят",
        "Ведите мягкими круговыми движениями вверх",
        "Ополосните и повесьте сушиться",
      ],
    },
    price: 9900,
    salePrice: 8900,
    img: mochalkiPhotos.body,
    gallery: [mochalkiPhotos.body, mochalkiPhotos.hero, mochalkiPhotos.face],
    stock: 12,
  },
  {
    id: "bath-mitt",
    category: "body",
    name: {
      en: "Bath mitt",
      ru: "Мочалка-миттен",
    },
    short: {
      en: "Mitt for shower and dry massage.",
      ru: "Миттен для душа и сухого массажа.",
    },
    description: {
      en: "Slips onto the hand for easy massage and foam with a drop of gel. Stimulite Honeycomb for a daily shower ritual.",
      ru: "Надевается на руку — удобный массаж и пена с каплей геля. Honeycomb Stimulite для ежедневного ритуала в душе.",
    },
    howTo: {
      en: [
        "Slip the mitt onto your hand",
        "Wet and add a little gel",
        "Massage skin in circles",
        "Rinse and dry",
      ],
      ru: [
        "Наденьте миттен на руку",
        "Смочите и добавьте немного геля",
        "Массируйте кожу круговыми движениями",
        "Ополосните и просушите",
      ],
    },
    price: 8490,
    salePrice: null,
    img: mochalkiPhotos.mitt,
    gallery: [mochalkiPhotos.mitt, mochalkiPhotos.body],
    stock: 8,
  },
  {
    id: "spa-cell",
    category: "face",
    name: {
      en: "Facial spa cell",
      ru: "Спа-ячейка для лица",
    },
    short: {
      en: "Gentle face cleansing without scrub.",
      ru: "Мягкое очищение лица без скраба.",
    },
    description: {
      en: "Soft pore cleansing without harsh scrub. Flexible Stimulite Honeycomb cells work with minimal product.",
      ru: "Бережное очищение пор без жёсткого скраба. Гибкие ячейки Stimulite Honeycomb работают с минимумом средства.",
    },
    howTo: {
      en: [
        "Wet the cell and face",
        "Add a drop of cleanser",
        "Gently glide over skin",
        "Rinse and dry",
      ],
      ru: [
        "Смочите ячейку и лицо",
        "Добавьте каплю геля для умывания",
        "Мягко пройдитесь по коже",
        "Ополосните и высушите",
      ],
    },
    price: 4490,
    salePrice: null,
    img: mochalkiPhotos.face,
    gallery: [mochalkiPhotos.face, mochalkiPhotos.body],
    stock: 15,
  },
];

const COPY = {
  en: {
    brand: "Supracor",
    host: "supracor.shop",
    nav: {
      home: "Home",
      catalog: "Catalog",
      technology: "Technology",
      delivery: "Delivery",
      cart: "Cart",
      checkout: "Checkout",
    },
    heroBrand: "Supracor",
    heroTitle: "Honeycomb care you feel from the first touch",
    heroLead: "Official Stimulite Honeycomb line for face and body · delivery across Russia",
    ctaCatalog: "View catalog",
    ctaTech: "How it works",
    heroNote: "Stimulite Honeycomb · Supracor",
    assortment: "Assortment",
    assortmentTitle: "Three tools. One technology.",
    techKicker: "Technology",
    techTitle: "Honeycomb wisdom in every touch",
    techLead:
      "Flexible Stimulite Honeycomb cells gently exfoliate, stimulate microcirculation, and foam with minimal product. Naturally antimicrobial — use wet or dry.",
    techPoints: ["No harsh abrasive", "Antibacterial material", "Built on Supracor tech"],
    whyTitle: "Why Supracor",
    why: [
      ["Original Supracor", "Stimulite Honeycomb line from a verified supply path."],
      ["Delivery across Russia", "Shipments in Moscow and to regions via carriers."],
      ["Care support", "Short guides for dry and wet use."],
    ],
    catalogKicker: "Catalog",
    catalogTitle: "Stimulite Honeycomb",
    catalogLead: "Original face and body tools with delivery across Russia.",
    chips: { all: "All", body: "For body", face: "For face" },
    details: "Details",
    add: "Add",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    inStock: "In stock",
    pcs: "pcs",
    howTo: "How to use",
    alsoViewed: "Also viewed",
    yourOrder: "Your order",
    cartLead: "No online payment — we confirm the order and payment separately",
    emptyCart: "Cart is empty",
    continueShopping: "To catalog",
    subtotal: "Subtotal",
    total: "Total",
    checkout: "Checkout",
    checkoutTitle: "Checkout",
    checkoutLead: "Prototype form — no real order is placed.",
    name: "Name",
    phone: "Phone",
    city: "City",
    address: "Address",
    delivery: "Delivery",
    deliveryOpts: ["Courier", "Pickup point", "Self pickup"],
    comment: "Comment",
    placeOrder: "Place order",
    cart: "Cart",
    more: "Details",
  },
  ru: {
    brand: "Supracor",
    host: "supracor.shop",
    nav: {
      home: "Главная",
      catalog: "Каталог",
      technology: "Технология",
      delivery: "Доставка",
      cart: "Корзина",
      checkout: "Оформление",
    },
    heroBrand: "Supracor",
    heroTitle: "Хаником-уход, который чувствуется с первого касания",
    heroLead: "Официальная линейка Stimulite Honeycomb для лица и тела · доставка по России",
    ctaCatalog: "Смотреть каталог",
    ctaTech: "Как это работает",
    heroNote: "Stimulite Honeycomb · Supracor",
    assortment: "Ассортимент",
    assortmentTitle: "Три инструмента. Одна технология.",
    techKicker: "Технология",
    techTitle: "Мудрость сот — в каждом касании",
    techLead:
      "Гибкие ячейки Stimulite Honeycomb мягко отшелушивают, стимулируют микроциркуляцию и создают пену с минимумом средства. Материал naturally antimicrobial — можно использовать мокрым и сухим способом.",
    techPoints: ["Без жёсткого абразива", "Антибактериальный материал", "Сделано на технологии Supracor"],
    whyTitle: "Почему Supracor",
    why: [
      ["Оригинал Supracor", "Линейка Stimulite Honeycomb с проверенного контура поставок."],
      ["Доставка по России", "Отправка по Москве и в регионы транспортными службами."],
      ["Поддержка ухода", "Короткие инструкции по сухому и влажному использованию."],
    ],
    catalogKicker: "Каталог",
    catalogTitle: "Stimulite Honeycomb",
    catalogLead: "Оригинальные инструменты для лица и тела с доставкой по России.",
    chips: { all: "Все", body: "Для тела", face: "Для лица" },
    details: "Подробнее",
    add: "В корзину",
    addToCart: "В корзину",
    buyNow: "Купить",
    inStock: "В наличии",
    pcs: "шт.",
    howTo: "Как использовать",
    alsoViewed: "Также смотрят",
    yourOrder: "Ваш заказ",
    cartLead: "Без онлайн-оплаты — подтвердим заказ и способ оплаты отдельно",
    emptyCart: "Корзина пуста",
    continueShopping: "В каталог",
    subtotal: "Подытог",
    total: "Итого",
    checkout: "Оформить",
    checkoutTitle: "Оформление",
    checkoutLead: "Прототип формы — реальный заказ не создаётся.",
    name: "Имя",
    phone: "Телефон",
    city: "Город",
    address: "Адрес",
    delivery: "Доставка",
    deliveryOpts: ["Курьер", "Пункт выдачи", "Самовывоз"],
    comment: "Комментарий",
    placeOrder: "Оформить заказ",
    cart: "Корзина",
    more: "Подробнее",
  },
} as const;

function formatRub(n: number, locale: Locale) {
  return `${n.toLocaleString(locale === "ru" ? "ru-RU" : "en-US")} ₽`;
}

function unitPrice(p: Product) {
  if (p.salePrice != null && p.salePrice > 0 && p.salePrice < p.price) return p.salePrice;
  return p.price;
}

function mkStyle(accent: string): CSSProperties {
  return { "--mk-a": accent } as CSSProperties;
}

function MkStyles() {
  return (
    <style>{`
      @import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap");

      .mk-root {
        --mk-a: #b8955a;
        --mk-mist: #f3f3f1;
        --mk-ink: #1c1a17;
        --mk-soft: #5c564e;
        --mk-honey: #b8955a;
        --mk-honey-deep: #8f7240;
        --mk-line: #e6e6e3;
        --mk-sand: #eceae6;
        --mk-display: "Fraunces", Georgia, serif;
        --mk-sans: "DM Sans", system-ui, sans-serif;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100%;
        background: var(--mk-mist);
        color: var(--mk-ink);
        font-family: var(--mk-sans);
        font-size: 12px;
        line-height: 1.4;
        overflow: hidden;
        user-select: none;
      }

      .mk-root[data-mode="thumb"] { font-size: 9px; }

      .mk-chrome {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px;
        padding: 0 10px;
        background: #ebe9e4;
        border-bottom: 1px solid rgba(28, 26, 23, 0.08);
        flex-shrink: 0;
      }

      .mk-root[data-mode="thumb"] .mk-chrome { height: 20px; padding: 0 6px; }

      .mk-chrome__dots { display: flex; gap: 4px; }
      .mk-chrome__dots i {
        width: 7px; height: 7px; border-radius: 50%;
      }
      .mk-root[data-mode="thumb"] .mk-chrome__dots i { width: 5px; height: 5px; }
      .mk-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .mk-chrome__dots i:nth-child(2) { background: #febc2e; }
      .mk-chrome__dots i:nth-child(3) { background: #28c840; }

      .mk-chrome__url {
        flex: 1;
        height: 16px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.7);
        color: rgba(28, 26, 23, 0.45);
        font-size: 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .mk-body {
        overflow: auto;
        flex: 1;
        min-height: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: var(--mk-mist);
      }

      .mk-nav {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        border-bottom: 1px solid rgba(28, 26, 23, 0.08);
        background: #fff;
        position: sticky;
        top: 0;
        z-index: 5;
        flex-shrink: 0;
      }

      .mk-root[data-mode="thumb"] .mk-nav { padding: 6px 8px; gap: 4px; }

      .mk-nav__brand {
        font-family: var(--mk-display);
        font-weight: 600;
        font-size: 18px;
        letter-spacing: -0.02em;
        color: var(--mk-ink);
        margin-right: auto;
        cursor: pointer;
        background: none;
        border: 0;
        padding: 0;
        font: inherit;
        font-family: var(--mk-display);
        font-weight: 600;
        font-size: 18px;
      }

      .mk-root[data-mode="thumb"] .mk-nav__brand { font-size: 12px; }

      .mk-nav__link {
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--mk-soft);
        font: inherit;
        font-size: 11px;
        font-weight: 500;
        padding: 4px 6px;
        border-radius: 4px;
        cursor: pointer;
        transition: color 0.15s;
        white-space: nowrap;
      }

      .mk-nav__link:hover,
      .mk-nav__link.is-active { color: var(--mk-ink); }

      .mk-cart-btn {
        appearance: none;
        border: 1px solid var(--mk-line);
        background: #fff;
        color: var(--mk-ink);
        font: inherit;
        font-size: 11px;
        font-weight: 600;
        padding: 5px 11px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .mk-cart-btn i {
        font-style: normal;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 999px;
        background: var(--mk-ink);
        color: #fff;
        font-size: 9px;
        font-weight: 700;
        display: grid;
        place-items: center;
      }

      .mk-page {
        flex: 1;
        min-height: 0;
        animation: mk-fade 0.28s ease;
      }

      .mk-page--home {
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      @keyframes mk-fade {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .mk-home-stage {
        flex: 1 0 auto;
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }

      .mk-hero {
        position: relative;
        overflow: hidden;
        min-height: 0;
        flex: 1;
        isolation: isolate;
        display: flex;
        align-items: flex-end;
      }

      .mk-root[data-mode="thumb"] .mk-hero {
        height: auto;
      }

      .mk-root[data-mode="thumb"] .mk-page {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .mk-root[data-mode="thumb"] .mk-home-stage {
        min-height: 0;
        flex: 1;
      }

      .mk-root[data-mode="thumb"] .mk-hero__copy {
        padding: 22px 18px 20px;
        max-width: 58%;
      }

      .mk-root[data-mode="thumb"] .mk-hero p.mk-hero__brand {
        font-size: 48px;
        margin-bottom: 10px;
      }

      .mk-root[data-mode="thumb"] .mk-hero h1 {
        font-size: 18px;
        margin-bottom: 8px;
      }

      .mk-root[data-mode="thumb"] .mk-hero p:not(.mk-hero__brand):not(.mk-hero__note) {
        font-size: 12px;
        margin-bottom: 12px;
        display: block;
      }

      .mk-root[data-mode="thumb"] .mk-hero__actions {
        display: flex;
        margin-bottom: 10px;
      }

      .mk-root[data-mode="thumb"] .mk-hero__note {
        display: block;
        font-size: 10px;
      }

      .mk-root[data-mode="thumb"] .mk-hero__bg img {
        object-position: 46% 8%;
      }

      .mk-root[data-mode="thumb"] .mk-nav {
        padding: 10px 16px;
      }

      .mk-root[data-mode="thumb"] .mk-nav__brand {
        font-size: 18px;
      }

      .mk-root[data-mode="thumb"] .mk-nav__link {
        display: inline-block;
        font-size: 11px;
      }

      .mk-root[data-mode="thumb"] .mk-cart-btn {
        font-size: 11px;
        padding: 5px 10px;
      }

      .mk-hero__bg {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .mk-hero__bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: 50% 12%;
        display: block;
      }

      .mk-hero__veil {
        position: absolute;
        inset: 0;
        z-index: 1;
        background:
          linear-gradient(90deg, rgba(28, 26, 23, 0.55) 0%, rgba(28, 26, 23, 0.22) 48%, transparent 72%),
          linear-gradient(0deg, rgba(28, 26, 23, 0.55) 0%, rgba(28, 26, 23, 0.12) 42%, transparent 68%);
      }

      .mk-hero__copy {
        position: relative;
        z-index: 2;
        padding: 28px 20px 24px;
        max-width: 58%;
        color: #fff;
      }

      .mk-hero p {
        margin: 0 0 12px;
        font-size: 12px;
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.85);
        max-width: 42ch;
      }

      .mk-hero p.mk-hero__brand {
        margin: 0 0 10px;
        font-family: var(--mk-display);
        font-size: clamp(36px, 5.5vw, 72px);
        font-weight: 600;
        line-height: 0.95;
        letter-spacing: -0.03em;
        color: #fff;
        max-width: none;
      }

      .mk-hero p.mk-hero__note {
        margin: 0;
        font-size: 11px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.65);
      }

      .mk-hero h1 {
        margin: 0 0 8px;
        font-family: var(--mk-display);
        font-size: clamp(16px, 2vw, 26px);
        font-weight: 500;
        line-height: 1.2;
        color: #fff;
      }

      .mk-hero__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
      }

      .mk-btn {
        appearance: none;
        border: 0;
        font: inherit;
        font-size: 11px;
        font-weight: 600;
        padding: 9px 14px;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.12s, background 0.15s;
      }

      .mk-btn--primary {
        background: var(--mk-ink);
        color: #fff;
      }

      .mk-btn--ghost {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.85);
      }

      .mk-btn--outline {
        background: transparent;
        color: var(--mk-ink);
        border: 1px solid var(--mk-line);
      }

      .mk-btn--honey {
        background: var(--mk-honey);
        color: #fff;
      }

      .mk-btn--sm {
        padding: 6px 10px;
        font-size: 10px;
      }

      .mk-btn:hover { transform: translateY(-1px); }

      .mk-section {
        padding: 22px 18px;
      }

      .mk-root[data-mode="thumb"] .mk-section { padding: 10px 8px; }

      .mk-kicker {
        margin: 0 0 6px;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mk-honey-deep);
      }

      .mk-section h2 {
        margin: 0 0 14px;
        font-family: var(--mk-display);
        font-size: clamp(18px, 2.2vw, 26px);
        font-weight: 600;
        letter-spacing: -0.02em;
      }

      .mk-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      .mk-root[data-mode="thumb"] .mk-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }

      .mk-card {
        overflow: hidden;
        border-radius: 10px;
        border: 1px solid var(--mk-line);
        background: #fff;
        cursor: pointer;
        transition: border-color 0.2s, transform 0.2s;
      }

      .mk-card:hover {
        border-color: color-mix(in srgb, var(--mk-honey) 45%, var(--mk-line));
        transform: translateY(-1px);
      }

      .mk-card__img {
        aspect-ratio: 4 / 3.2;
        overflow: hidden;
        background: var(--mk-sand);
      }

      .mk-card__img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.45s ease;
      }

      .mk-card:hover .mk-card__img img { transform: scale(1.03); }

      .mk-card__body {
        padding: 10px 12px 12px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .mk-card__cat {
        font-size: 9px;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mk-honey-deep);
      }

      .mk-card__body b {
        font-family: var(--mk-display);
        font-size: 14px;
        font-weight: 600;
        line-height: 1.2;
      }

      .mk-root[data-mode="thumb"] .mk-card__body b { font-size: 10px; }

      .mk-card__body em {
        font-style: normal;
        font-size: 11px;
        color: var(--mk-soft);
        line-height: 1.35;
      }

      .mk-root[data-mode="thumb"] .mk-card__body em { display: none; }

      .mk-card__row {
        margin-top: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .mk-card__row strong { font-size: 13px; }
      .mk-price-old {
        font-size: 11px;
        color: var(--mk-soft);
        text-decoration: line-through;
        margin-left: 6px;
        font-weight: 400;
      }

      .mk-tech {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 18px;
        align-items: center;
        padding: 22px 18px;
        background: #fff;
        border-top: 1px solid var(--mk-line);
        border-bottom: 1px solid var(--mk-line);
      }

      .mk-tech__media {
        overflow: hidden;
        border-radius: 10px;
        aspect-ratio: 5 / 4;
        background: var(--mk-sand);
      }

      .mk-tech__media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .mk-tech p.lead {
        margin: 0 0 12px;
        color: var(--mk-soft);
        font-size: 12px;
        line-height: 1.5;
        max-width: 44ch;
      }

      .mk-tech ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 8px;
      }

      .mk-tech li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        font-weight: 500;
      }

      .mk-tech li::before {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--mk-honey);
        flex-shrink: 0;
      }

      .mk-why {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      .mk-why article::before {
        content: "";
        display: block;
        width: 36px;
        height: 2px;
        background: var(--mk-honey);
        margin-bottom: 10px;
      }

      .mk-why h3 {
        margin: 0 0 6px;
        font-family: var(--mk-display);
        font-size: 16px;
        font-weight: 600;
      }

      .mk-why p {
        margin: 0;
        color: var(--mk-soft);
        font-size: 12px;
        line-height: 1.45;
      }

      .mk-pad {
        padding: 18px;
      }

      .mk-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin: 14px 0 16px;
      }

      .mk-chip {
        appearance: none;
        border: 1px solid var(--mk-line);
        background: transparent;
        color: var(--mk-soft);
        font: inherit;
        font-size: 11px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
      }

      .mk-chip.is-on {
        background: var(--mk-ink);
        border-color: var(--mk-ink);
        color: #fff;
      }

      .mk-pdp {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 20px;
        padding: 16px 18px 22px;
      }

      .mk-pdp__main {
        position: relative;
        overflow: hidden;
        border-radius: 10px;
        background: var(--mk-sand);
        aspect-ratio: 5 / 4;
      }

      .mk-pdp__main img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .mk-pdp__thumbs {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .mk-pdp__thumbs button {
        appearance: none;
        border: 1px solid var(--mk-line);
        padding: 0;
        width: 64px;
        height: 52px;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        background: var(--mk-sand);
      }

      .mk-pdp__thumbs button.is-on { border-color: var(--mk-honey); }

      .mk-pdp__thumbs img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .mk-pdp__cat {
        margin: 0 0 6px;
        font-size: 10px;
        font-weight: 500;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--mk-honey-deep);
      }

      .mk-pdp h2 {
        margin: 0 0 10px;
        font-family: var(--mk-display);
        font-size: clamp(20px, 2.4vw, 28px);
        font-weight: 600;
        line-height: 1.15;
      }

      .mk-pdp__price {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 6px;
      }

      .mk-pdp__price strong { font-size: 20px; }
      .mk-pdp__stock {
        margin: 0 0 12px;
        font-size: 11px;
        color: var(--mk-soft);
      }

      .mk-pdp__desc {
        margin: 0 0 14px;
        color: var(--mk-soft);
        font-size: 12px;
        line-height: 1.55;
      }

      .mk-pdp__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 10px;
      }

      .mk-pdp__note {
        margin: 0 0 16px;
        font-size: 11px;
        font-weight: 500;
        color: var(--mk-honey-deep);
      }

      .mk-pdp__howto h3 {
        margin: 0 0 8px;
        font-family: var(--mk-display);
        font-size: 16px;
        font-weight: 600;
      }

      .mk-pdp__howto ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: grid;
        gap: 6px;
      }

      .mk-pdp__howto li {
        font-size: 12px;
        color: var(--mk-soft);
      }

      .mk-pdp__howto li::before { content: "• "; color: var(--mk-honey); }

      .mk-crumb {
        padding: 12px 18px 0;
        font-size: 11px;
        color: var(--mk-soft);
      }

      .mk-crumb button {
        appearance: none;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0;
      }

      .mk-crumb button:hover { color: var(--mk-ink); }

      .mk-cart-layout {
        display: grid;
        grid-template-columns: 1.4fr 0.8fr;
        gap: 16px;
        padding: 18px;
      }

      .mk-cart-line {
        display: grid;
        grid-template-columns: 64px 1fr auto auto;
        gap: 10px;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--mk-line);
      }

      .mk-cart-line__thumb {
        width: 64px;
        height: 52px;
        border-radius: 6px;
        overflow: hidden;
        background: var(--mk-sand);
      }

      .mk-cart-line__thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .mk-stepper {
        display: flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--mk-line);
        border-radius: 4px;
        padding: 2px;
      }

      .mk-stepper button {
        appearance: none;
        border: 0;
        background: transparent;
        width: 22px;
        height: 22px;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
      }

      .mk-summary {
        border: 1px solid var(--mk-line);
        border-radius: 10px;
        background: #fff;
        padding: 14px;
        height: fit-content;
      }

      .mk-summary > div {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .mk-summary-total {
        padding-top: 8px;
        border-top: 1px solid var(--mk-line);
        font-weight: 600;
      }

      .mk-form {
        padding: 18px;
        max-width: 520px;
      }

      .mk-form h2 {
        margin: 0 0 6px;
        font-family: var(--mk-display);
        font-size: 24px;
        font-weight: 600;
      }

      .mk-form > p {
        margin: 0 0 14px;
        color: var(--mk-soft);
        font-size: 12px;
      }

      .mk-form label {
        display: grid;
        gap: 4px;
        margin-bottom: 10px;
        font-size: 11px;
        font-weight: 500;
        color: var(--mk-soft);
      }

      .mk-form input,
      .mk-form select,
      .mk-form textarea {
        appearance: none;
        border: 1px solid var(--mk-line);
        border-radius: 4px;
        padding: 8px 10px;
        font: inherit;
        font-size: 12px;
        color: var(--mk-ink);
        background: #fff;
      }

      .mk-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      @media (max-width: 720px) {
        .mk-root[data-mode="full"] .mk-grid,
        .mk-root[data-mode="full"] .mk-why {
          grid-template-columns: 1fr;
        }
        .mk-root[data-mode="full"] .mk-tech,
        .mk-root[data-mode="full"] .mk-pdp,
        .mk-root[data-mode="full"] .mk-cart-layout,
        .mk-root[data-mode="full"] .mk-form-row {
          grid-template-columns: 1fr;
        }
        .mk-root[data-mode="full"] .mk-hero__copy { max-width: 100%; }
        .mk-root[data-mode="full"] .mk-nav__link:not(.mk-nav__link--keep) {
          display: none;
        }
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
    <div className="mk-root" data-mode={mode} style={mkStyle(accent)}>
      <MkStyles />
      <header className="mk-chrome" aria-hidden>
        <span className="mk-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mk-chrome__url">{url}</span>
      </header>
      <div className="mk-body">{children}</div>
    </div>
  );
}

function ProductCard({
  product,
  locale,
  t,
  mode,
  onOpen,
  onAdd,
}: {
  product: Product;
  locale: Locale;
  t: (typeof COPY)[Locale];
  mode: LivingMode;
  onOpen: () => void;
  onAdd: () => void;
}) {
  const price = unitPrice(product);
  const catLabel = product.category === "body" ? t.chips.body : t.chips.face;
  return (
    <article
      className="mk-card"
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      role="button"
      tabIndex={0}
    >
      <div className="mk-card__img">
        <img src={product.img} alt={product.name[locale]} loading="lazy" />
      </div>
      <div className="mk-card__body">
        <span className="mk-card__cat">{catLabel}</span>
        <b>{product.name[locale]}</b>
        <em>{product.short[locale]}</em>
        <div className="mk-card__row">
          <span>
            <strong>{formatRub(price, locale)}</strong>
            {product.salePrice != null && (
              <span className="mk-price-old">{formatRub(product.price, locale)}</span>
            )}
          </span>
          {mode === "full" && (
            <button
              type="button"
              className="mk-btn mk-btn--primary mk-btn--sm"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              {t.add}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function MochalkiSite({
  accent = "#b8955a",
  locale,
  mode,
}: {
  accent: string;
  locale: "en" | "ru";
  mode: "full" | "thumb";
}) {
  const t = COPY[locale];
  const [page, setPage] = useState<PageId>("home");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedId, setSelectedId] = useState("body-exfoliator");
  const [filter, setFilter] = useState<CategoryId>("all");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const activePage = mode === "thumb" ? "home" : page;

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const product = PRODUCTS.find((p) => p.id === selectedId) ?? PRODUCTS[0];

  const filtered = PRODUCTS.filter((p) => (filter === "all" ? true : p.category === filter));

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { id, qty: 1 }];
    });
  };

  const setQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.id === id ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  };

  const cartLines = useMemo(
    () =>
      cart
        .map((line) => {
          const p = PRODUCTS.find((x) => x.id === line.id);
          if (!p) return null;
          return { ...p, qty: line.qty };
        })
        .filter(Boolean) as (Product & { qty: number })[],
    [cart],
  );

  const subtotal = cartLines.reduce((s, l) => s + unitPrice(l) * l.qty, 0);

  const openProduct = (id: string) => {
    setSelectedId(id);
    setGalleryIdx(0);
    if (mode === "full") setPage("product");
  };

  const go = (id: PageId) => {
    if (mode === "full") setPage(id);
  };

  return (
    <Shell url={`${t.host} / ${activePage}`} accent={accent} mode={mode}>
      <nav className="mk-nav">
        <button type="button" className="mk-nav__brand" onClick={() => go("home")}>
          {t.brand}
        </button>
        <button
          type="button"
          className={`mk-nav__link${activePage === "catalog" || activePage === "product" ? " is-active" : ""}`}
          onClick={() => go("catalog")}
        >
          {t.nav.catalog}
        </button>
        <button type="button" className="mk-nav__link" onClick={() => go("home")}>
          {t.nav.technology}
        </button>
        <button type="button" className="mk-nav__link" onClick={() => go("home")}>
          {t.nav.delivery}
        </button>
        {mode === "full" ? (
          <button type="button" className="mk-cart-btn" onClick={() => go("cart")}>
            {t.cart}
            <i>{cartCount}</i>
          </button>
        ) : (
          <span className="mk-cart-btn" style={{ cursor: "default" }}>
            {t.cart}
            <i>0</i>
          </span>
        )}
      </nav>

      <div key={activePage} className={`mk-page${activePage === "home" ? " mk-page--home" : ""}`}>
        {activePage === "home" && (
          <>
            <div className="mk-home-stage">
              <section className="mk-hero">
                <div className="mk-hero__bg" aria-hidden>
                  <img src={mochalkiPhotos.hero} alt="" loading="lazy" />
                </div>
                <div className="mk-hero__veil" aria-hidden />
                <div className="mk-hero__copy">
                  <p className="mk-hero__brand">{t.heroBrand}</p>
                  <h1>{t.heroTitle}</h1>
                  <p>{t.heroLead}</p>
                  <div className="mk-hero__actions">
                    <button
                      type="button"
                      className="mk-btn mk-btn--primary"
                      onClick={() => go("catalog")}
                    >
                      {t.ctaCatalog}
                    </button>
                    <button
                      type="button"
                      className="mk-btn mk-btn--ghost"
                      onClick={() => go("catalog")}
                    >
                      {t.ctaTech}
                    </button>
                  </div>
                  <p className="mk-hero__note">{t.heroNote}</p>
                </div>
              </section>
            </div>

            {mode === "full" && (
              <section className="mk-section">
                <p className="mk-kicker">{t.assortment}</p>
                <h2>{t.assortmentTitle}</h2>
                <div className="mk-grid">
                  {PRODUCTS.slice(0, 3).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      locale={locale}
                      t={t}
                      mode={mode}
                      onOpen={() => openProduct(p.id)}
                      onAdd={() => addToCart(p.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {mode === "full" && (
              <>
                <section className="mk-tech">
                  <div className="mk-tech__media">
                    <img src={mochalkiPhotos.body} alt="" loading="lazy" />
                  </div>
                  <div>
                    <p className="mk-kicker">{t.techKicker}</p>
                    <h2 style={{ marginBottom: 10 }}>{t.techTitle}</h2>
                    <p className="lead">{t.techLead}</p>
                    <ul>
                      {t.techPoints.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section className="mk-section">
                  <h2>{t.whyTitle}</h2>
                  <div className="mk-why">
                    {t.why.map(([title, text]) => (
                      <article key={title}>
                        <h3>{title}</h3>
                        <p>{text}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {activePage === "catalog" && mode === "full" && (
          <div className="mk-pad">
            <p className="mk-kicker">{t.catalogKicker}</p>
            <h2 style={{ margin: "0 0 6px", fontFamily: "var(--mk-display)", fontSize: 28, fontWeight: 600 }}>
              {t.catalogTitle}
            </h2>
            <p style={{ margin: "0 0 4px", color: "var(--mk-soft)", maxWidth: "48ch" }}>{t.catalogLead}</p>
            <div className="mk-chips">
              {(["all", "body", "face"] as CategoryId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`mk-chip${filter === id ? " is-on" : ""}`}
                  onClick={() => setFilter(id)}
                >
                  {t.chips[id]}
                </button>
              ))}
            </div>
            <div className="mk-grid">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  locale={locale}
                  t={t}
                  mode={mode}
                  onOpen={() => openProduct(p.id)}
                  onAdd={() => addToCart(p.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activePage === "product" && mode === "full" && (
          <>
            <p className="mk-crumb">
              <button type="button" onClick={() => go("catalog")}>
                {t.nav.catalog}
              </button>
              <span style={{ margin: "0 8px", color: "var(--mk-line)" }}>/</span>
              <span style={{ color: "var(--mk-ink)", fontWeight: 500 }}>{product.name[locale]}</span>
            </p>
            <div className="mk-pdp">
              <div>
                <div className="mk-pdp__main">
                  <img
                    src={product.gallery[galleryIdx] ?? product.img}
                    alt={product.name[locale]}
                    loading="lazy"
                  />
                </div>
                <div className="mk-pdp__thumbs">
                  {product.gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      className={galleryIdx === i ? "is-on" : ""}
                      onClick={() => setGalleryIdx(i)}
                      aria-label={`Photo ${i + 1}`}
                    >
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mk-pdp__cat">{product.category === "body" ? t.chips.body : t.chips.face}</p>
                <h2>{product.name[locale]}</h2>
                <div className="mk-pdp__price">
                  <strong>{formatRub(unitPrice(product), locale)}</strong>
                  {product.salePrice != null && (
                    <span className="mk-price-old">{formatRub(product.price, locale)}</span>
                  )}
                </div>
                <p className="mk-pdp__stock">
                  {t.inStock}: {product.stock} {t.pcs}
                </p>
                <p className="mk-pdp__desc">{product.description[locale]}</p>
                <div className="mk-pdp__actions">
                  <button type="button" className="mk-btn mk-btn--primary" onClick={() => addToCart(product.id)}>
                    {t.addToCart}
                  </button>
                  <button
                    type="button"
                    className="mk-btn mk-btn--honey"
                    onClick={() => {
                      addToCart(product.id);
                      go("checkout");
                    }}
                  >
                    {t.buyNow}
                  </button>
                </div>
                <p className="mk-pdp__note">{t.heroNote}</p>
                <div className="mk-pdp__howto">
                  <h3>{t.howTo}</h3>
                  <ul>
                    {product.howTo[locale].map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <section className="mk-section" style={{ background: "#fff", borderTop: "1px solid var(--mk-line)" }}>
              <h2>{t.alsoViewed}</h2>
              <div className="mk-grid">
                {PRODUCTS.filter((p) => p.id !== product.id).map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    locale={locale}
                    t={t}
                    mode={mode}
                    onOpen={() => openProduct(p.id)}
                    onAdd={() => addToCart(p.id)}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activePage === "cart" && mode === "full" && (
          <div className="mk-pad">
            <p className="mk-kicker">{t.cart}</p>
            <h2 style={{ margin: "0 0 6px", fontFamily: "var(--mk-display)", fontSize: 26, fontWeight: 600 }}>
              {t.yourOrder}
            </h2>
            <p style={{ margin: "0 0 14px", color: "var(--mk-soft)" }}>{t.cartLead}</p>
            <div className="mk-cart-layout" style={{ padding: 0 }}>
              <div>
                {cartLines.length === 0 ? (
                  <p style={{ color: "var(--mk-soft)" }}>
                    {t.emptyCart}{" "}
                    <button type="button" className="mk-btn mk-btn--outline mk-btn--sm" onClick={() => go("catalog")}>
                      {t.continueShopping}
                    </button>
                  </p>
                ) : (
                  cartLines.map((line) => (
                    <div key={line.id} className="mk-cart-line">
                      <div className="mk-cart-line__thumb">
                        <img src={line.img} alt="" loading="lazy" />
                      </div>
                      <div>
                        <b style={{ fontFamily: "var(--mk-display)", fontSize: 14 }}>{line.name[locale]}</b>
                        <em style={{ display: "block", fontStyle: "normal", color: "var(--mk-soft)", fontSize: 11 }}>
                          {line.short[locale]}
                        </em>
                      </div>
                      <div className="mk-stepper">
                        <button type="button" onClick={() => setQty(line.id, -1)}>
                          −
                        </button>
                        <span>{line.qty}</span>
                        <button type="button" onClick={() => setQty(line.id, 1)}>
                          +
                        </button>
                      </div>
                      <strong>{formatRub(unitPrice(line) * line.qty, locale)}</strong>
                    </div>
                  ))
                )}
              </div>
              {cartLines.length > 0 && (
                <aside className="mk-summary">
                  <div>
                    <span>{t.subtotal}</span>
                    <b>{formatRub(subtotal, locale)}</b>
                  </div>
                  <div className="mk-summary-total">
                    <span>{t.total}</span>
                    <b>{formatRub(subtotal, locale)}</b>
                  </div>
                  <button
                    type="button"
                    className="mk-btn mk-btn--primary"
                    style={{ width: "100%", marginTop: 8 }}
                    onClick={() => go("checkout")}
                  >
                    {t.checkout}
                  </button>
                </aside>
              )}
            </div>
          </div>
        )}

        {activePage === "checkout" && mode === "full" && (
          <div className="mk-form">
            <h2>{t.checkoutTitle}</h2>
            <p>{t.checkoutLead}</p>
            <label>
              {t.name}
              <input readOnly value={locale === "ru" ? "Анна К." : "Anna K."} />
            </label>
            <div className="mk-form-row">
              <label>
                {t.phone}
                <input readOnly value="+7 900 123-45-67" />
              </label>
              <label>
                {t.city}
                <input readOnly value={locale === "ru" ? "Москва" : "Moscow"} />
              </label>
            </div>
            <label>
              {t.address}
              <input readOnly value={locale === "ru" ? "ул. Тверская, 12" : "Tverskaya St, 12"} />
            </label>
            <label>
              {t.delivery}
              <select disabled defaultValue={t.deliveryOpts[0]}>
                {t.deliveryOpts.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </label>
            <label>
              {t.comment}
              <textarea readOnly rows={2} value={locale === "ru" ? "Позвоните перед доставкой" : "Call before delivery"} />
            </label>
            <button type="button" className="mk-btn mk-btn--primary" style={{ marginTop: 4 }}>
              {t.placeOrder}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

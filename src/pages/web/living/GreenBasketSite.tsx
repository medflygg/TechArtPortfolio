import { type CSSProperties, type ReactNode, useMemo, useState } from "react";
import { groceryPhotos } from "./groceryPhotos";

export type LivingMode = "full" | "thumb";
type Locale = "en" | "ru";
type PageId = "home" | "catalog" | "product" | "cart" | "checkout";

type Product = {
  id: string;
  name: Record<Locale, string>;
  weight: Record<Locale, string>;
  price: number;
  img: string;
  category: string;
  organic?: boolean;
};

type CartLine = { id: string; qty: number };

const PRODUCTS: Product[] = [
  {
    id: "kale",
    name: { en: "Organic kale", ru: "Органическая капуста кале" },
    weight: { en: "200g bag", ru: "200 г" },
    price: 3.2,
    img: groceryPhotos.kale,
    category: "vegetables",
    organic: true,
  },
  {
    id: "tomato",
    name: { en: "New potatoes", ru: "Молодой картофель" },
    weight: { en: "1 kg", ru: "1 кг" },
    price: 2.4,
    img: groceryPhotos.tomato,
    category: "vegetables",
  },
  {
    id: "carrot",
    name: { en: "Carrot bunch", ru: "Морковь пучок" },
    weight: { en: "500g", ru: "500 г" },
    price: 2.1,
    img: groceryPhotos.carrot,
    category: "vegetables",
  },
  {
    id: "blueberry",
    name: { en: "Blueberries", ru: "Голубика" },
    weight: { en: "125g", ru: "125 г" },
    price: 5.8,
    img: groceryPhotos.blueberry,
    category: "fruit",
  },
  {
    id: "spinach",
    name: { en: "Baby spinach", ru: "Молодой шпинат" },
    weight: { en: "200g", ru: "200 г" },
    price: 2.9,
    img: groceryPhotos.spinach,
    category: "vegetables",
    organic: true,
  },
  {
    id: "avocado",
    name: { en: "Avocado", ru: "Авокадо" },
    weight: { en: "1 pc", ru: "1 шт" },
    price: 1.8,
    img: groceryPhotos.avocado,
    category: "fruit",
  },
  {
    id: "sourdough",
    name: { en: "Sourdough loaf", ru: "Хлеб на закваске" },
    weight: { en: "1 loaf", ru: "1 буханка" },
    price: 4.1,
    img: groceryPhotos.bakery,
    category: "bakery",
  },
  {
    id: "yogurt",
    name: { en: "Greek yogurt", ru: "Греческий йогурт" },
    weight: { en: "400g", ru: "400 г" },
    price: 3.6,
    img: groceryPhotos.dairy,
    category: "dairy",
  },
];

const COPY = {
  en: {
    brand: "GreenBasket",
    host: "greenbasket.shop",
    nav: { home: "Home", catalog: "Catalog", product: "Product", cart: "Cart", checkout: "Checkout" },
    shop: "Shop",
    recipes: "Recipes",
    deals: "Deals",
    cart: "Cart",
    heroTitle: "Farm-fresh delivery",
    heroLead: "Seasonal produce to your door by noon. Sourced from 40+ local farms.",
    shopProduce: "Shop produce",
    categories: ["Vegetables", "Fruit", "Dairy", "Bakery", "Pantry"],
    add: "Add",
    addToCart: "Add to cart",
    organic: "Organic",
    filters: "Filters",
    filterOpts: ["Organic", "Local", "On sale", "Under $3"],
    catFilter: "Category",
    catOpts: ["All", "Leafy", "Root", "Fruit"],
    nutrition: "Nutrition",
    cal: "Cal",
    protein: "Protein",
    fiber: "Fiber",
    vitK: "Vit K",
    yourBasket: "Your basket",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    checkout: "Checkout",
    deliveryTitle: "Delivery",
    paymentTitle: "Payment",
    address: "Address",
    city: "City",
    slot: "Slot",
    card: "Card ending",
    placeOrder: "Place order",
    trust1: "Same-day slots",
    trust2: "40+ local farms",
    trust3: "Carbon-neutral",
    footer: "© GreenBasket",
    emptyCart: "Your basket is empty",
    continueShopping: "Browse catalog",
    qty: "Qty",
    remove: "Remove",
    pdpLead: "Crisp curly leaves · washed & ready",
  },
  ru: {
    brand: "GreenBasket",
    host: "greenbasket.shop",
    nav: { home: "Главная", catalog: "Каталог", product: "Товар", cart: "Корзина", checkout: "Оформление" },
    shop: "Магазин",
    recipes: "Рецепты",
    deals: "Акции",
    cart: "Корзина",
    heroTitle: "Доставка с фермы",
    heroLead: "Сезонные продукты к вашей двери к полудню. Более 40 местных ферм.",
    shopProduce: "Купить овощи",
    categories: ["Овощи", "Фрукты", "Молочное", "Выпечка", "Бакалея"],
    add: "В корзину",
    addToCart: "Добавить",
    organic: "Органика",
    filters: "Фильтры",
    filterOpts: ["Органика", "Местное", "Со скидкой", "До 300 ₽"],
    catFilter: "Категория",
    catOpts: ["Все", "Зелень", "Корнеплоды", "Фрукты"],
    nutrition: "Пищевая ценность",
    cal: "Ккал",
    protein: "Белки",
    fiber: "Клетчатка",
    vitK: "Вит. K",
    yourBasket: "Ваша корзина",
    subtotal: "Сумма",
    delivery: "Доставка",
    total: "Итого",
    checkout: "Оформить",
    deliveryTitle: "Доставка",
    paymentTitle: "Оплата",
    address: "Адрес",
    city: "Город",
    slot: "Интервал",
    card: "Карта",
    placeOrder: "Заказать",
    trust1: "Доставка в день заказа",
    trust2: "40+ местных ферм",
    trust3: "Нейтральный углеродный след",
    footer: "© GreenBasket",
    emptyCart: "Корзина пуста",
    continueShopping: "В каталог",
    qty: "Кол-во",
    remove: "Удалить",
    pdpLead: "Хрустящие листья · мытые и готовые",
  },
} as const;

function gbStyle(accent: string): CSSProperties {
  return { "--gb-a": accent } as CSSProperties;
}

function GbStyles() {
  return (
    <style>{`
      .gb-root {
        --gb-a: #16a34a;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 100%;
        background: #f8faf8;
        color: #1a2e1a;
        font-family: var(--font-body, "Sora", sans-serif);
        font-size: 11px;
        line-height: 1.35;
        overflow: hidden;
        user-select: none;
      }

      .gb-root[data-mode="thumb"] { font-size: 9px; }

      .gb-chrome {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px;
        padding: 0 10px;
        background: #eef2ee;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        flex-shrink: 0;
      }

      .gb-root[data-mode="thumb"] .gb-chrome { height: 20px; padding: 0 6px; }

      .gb-chrome__dots { display: flex; gap: 4px; }
      .gb-chrome__dots i {
        width: 7px; height: 7px; border-radius: 50%;
      }
      .gb-root[data-mode="thumb"] .gb-chrome__dots i { width: 5px; height: 5px; }
      .gb-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .gb-chrome__dots i:nth-child(2) { background: #febc2e; }
      .gb-chrome__dots i:nth-child(3) { background: #28c840; }

      .gb-chrome__url {
        flex: 1;
        height: 16px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.7);
        color: rgba(0, 0, 0, 0.45);
        font-size: 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .gb-body {
        overflow: auto;
        flex: 1;
        min-height: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #fafcfa;
      }

      .gb-nav {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: #fff;
        position: sticky;
        top: 0;
        z-index: 5;
      }

      .gb-root[data-mode="thumb"] .gb-nav { padding: 5px 8px; gap: 4px; }

      .gb-nav__brand {
        font-family: var(--font-display, "Syne", sans-serif);
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.04em;
        color: var(--gb-a);
        margin-right: auto;
      }

      .gb-nav__link {
        appearance: none;
        border: 0;
        background: transparent;
        color: rgba(0, 0, 0, 0.5);
        font: inherit;
        font-size: 9px;
        padding: 4px 6px;
        border-radius: 4px;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
      }

      .gb-nav__link:hover { color: #1a2e1a; background: rgba(0, 0, 0, 0.04); }
      .gb-nav__link.is-active {
        color: var(--gb-a);
        background: color-mix(in srgb, var(--gb-a) 12%, transparent);
        font-weight: 600;
      }

      .gb-cart-btn {
        appearance: none;
        border: 1px solid color-mix(in srgb, var(--gb-a) 35%, transparent);
        background: color-mix(in srgb, var(--gb-a) 8%, #fff);
        color: var(--gb-a);
        font: inherit;
        font-size: 9px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 999px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: transform 0.15s, box-shadow 0.15s;
      }

      .gb-cart-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--gb-a) 20%, transparent);
      }

      .gb-cart-btn i {
        font-style: normal;
        min-width: 16px;
        height: 16px;
        padding: 0 4px;
        border-radius: 999px;
        background: var(--gb-a);
        color: #fff;
        font-size: 8px;
        font-weight: 700;
        display: grid;
        place-items: center;
      }

      .gb-page {
        flex: 1;
        min-height: 0;
        animation: gb-fade 0.28s ease;
      }

      @keyframes gb-fade {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .gb-hero {
        position: relative;
        overflow: hidden;
        min-height: 180px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      }

      .gb-root[data-mode="thumb"] .gb-hero { min-height: 110px; }

      .gb-hero__bg {
        position: absolute;
        inset: 0;
      }

      .gb-hero__bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gb-hero__overlay {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(to right, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.4) 55%, rgba(0, 0, 0, 0.15) 100%),
          linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, transparent 55%);
      }

      .gb-hero__copy {
        position: relative;
        z-index: 1;
        padding: 16px 12px 12px;
        max-width: 70%;
      }

      .gb-root[data-mode="thumb"] .gb-hero__copy { padding: 10px 8px 8px; max-width: 85%; }

      .gb-hero h1 {
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: clamp(16px, 3vw, 24px);
        font-weight: 700;
        margin: 0 0 6px;
        line-height: 1.1;
        color: #fff;
      }

      .gb-root[data-mode="thumb"] .gb-hero h1 { font-size: 13px; margin-bottom: 3px; }

      .gb-hero p {
        margin: 0 0 10px;
        color: rgba(255, 255, 255, 0.88);
        font-size: 10px;
        max-width: 36ch;
      }

      .gb-root[data-mode="thumb"] .gb-hero p { font-size: 8px; margin-bottom: 6px; }

      .gb-hero__trust {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 10px;
      }

      .gb-root[data-mode="thumb"] .gb-hero__trust { gap: 4px; margin-top: 6px; }

      .gb-hero__trust span {
        font-size: 8px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255, 255, 255, 0.28);
        color: #fff;
        white-space: nowrap;
      }

      .gb-root[data-mode="thumb"] .gb-hero__trust span { font-size: 7px; padding: 3px 6px; }

      .gb-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .gb-btn {
        appearance: none;
        border: 0;
        cursor: pointer;
        font: inherit;
        font-size: 10px;
        font-weight: 600;
        padding: 8px 14px;
        border-radius: 8px;
        background: var(--gb-a);
        color: #fff;
        transition: transform 0.15s, filter 0.15s, box-shadow 0.15s;
      }

      .gb-btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.06);
        box-shadow: 0 6px 16px color-mix(in srgb, var(--gb-a) 30%, transparent);
      }

      .gb-btn--sm { padding: 5px 10px; font-size: 9px; }
      .gb-btn--ghost {
        background: transparent;
        color: var(--gb-a);
        border: 1px solid color-mix(in srgb, var(--gb-a) 40%, transparent);
      }

      .gb-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 8px 12px;
      }

      .gb-root[data-mode="thumb"] .gb-chips { padding: 5px 8px; gap: 4px; }

      .gb-chip {
        appearance: none;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: #fff;
        color: rgba(0, 0, 0, 0.6);
        font: inherit;
        font-size: 9px;
        padding: 5px 10px;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.15s;
      }

      .gb-chip:hover, .gb-chip.is-on {
        border-color: var(--gb-a);
        color: var(--gb-a);
        background: color-mix(in srgb, var(--gb-a) 10%, #fff);
      }

      .gb-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 0 12px 14px;
      }

      .gb-root[data-mode="thumb"] .gb-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 5px;
        padding: 0 8px 8px;
      }

      .gb-card {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.07);
        border-radius: 10px;
        overflow: hidden;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        cursor: pointer;
      }

      .gb-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        border-color: color-mix(in srgb, var(--gb-a) 35%, transparent);
      }

      .gb-card__img {
        aspect-ratio: 4/3;
        overflow: hidden;
        background: #eef5ee;
      }

      .gb-card__body { padding: 8px; }
      .gb-card__body b { display: block; font-size: 10px; margin-bottom: 2px; }
      .gb-card__body em { font-style: normal; font-size: 8px; color: rgba(0, 0, 0, 0.45); }
      .gb-card__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 6px;
      }

      .gb-card__row strong { font-size: 11px; color: var(--gb-a); }

      .gb-split {
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 10px;
        padding: 12px;
        min-height: 200px;
      }

      .gb-filters {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.07);
        border-radius: 10px;
        padding: 10px;
      }

      .gb-filters h4 {
        margin: 0 0 6px;
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: rgba(0, 0, 0, 0.45);
      }

      .gb-filters label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 9px;
        margin-bottom: 4px;
        cursor: pointer;
      }

      .gb-filters label i {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        font-style: normal;
      }

      .gb-filters label i.is-on {
        background: var(--gb-a);
        border-color: var(--gb-a);
      }

      .gb-pdp {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        padding: 14px 12px;
      }

      .gb-pdp__gallery {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }

      .gb-pdp__gallery div {
        border-radius: 10px;
        overflow: hidden;
        aspect-ratio: 1;
        border: 1px solid rgba(0, 0, 0, 0.06);
      }

      .gb-tag {
        display: inline-block;
        font-size: 8px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 3px 8px;
        border-radius: 4px;
        background: color-mix(in srgb, var(--gb-a) 15%, #fff);
        color: var(--gb-a);
        margin-bottom: 6px;
      }

      .gb-pdp h2 {
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 18px;
        margin: 0 0 6px;
      }

      .gb-price { font-size: 20px; font-weight: 700; color: var(--gb-a); margin: 8px 0; }

      .gb-nutrition {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin: 10px 0;
      }

      .gb-nutrition div {
        text-align: center;
        padding: 6px;
        border-radius: 8px;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
      }

      .gb-nutrition b { display: block; font-size: 11px; }
      .gb-nutrition span { font-size: 8px; color: rgba(0, 0, 0, 0.45); }

      .gb-cart-layout {
        display: grid;
        grid-template-columns: 1fr 140px;
        gap: 12px;
        padding: 12px;
      }

      .gb-cart-line {
        display: grid;
        grid-template-columns: 40px 1fr auto auto;
        gap: 8px;
        align-items: center;
        padding: 8px;
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        margin-bottom: 6px;
        transition: border-color 0.15s;
      }

      .gb-cart-line:hover { border-color: color-mix(in srgb, var(--gb-a) 30%, transparent); }

      .gb-cart-line__thumb {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        overflow: hidden;
        background: #eef5ee;
      }

      .gb-stepper {
        display: flex;
        align-items: center;
        gap: 4px;
        background: #f4f7f4;
        border-radius: 8px;
        padding: 2px;
      }

      .gb-stepper button {
        appearance: none;
        border: 0;
        width: 22px;
        height: 22px;
        border-radius: 6px;
        background: #fff;
        cursor: pointer;
        font-size: 12px;
        color: var(--gb-a);
        transition: background 0.15s;
      }

      .gb-stepper button:hover { background: color-mix(in srgb, var(--gb-a) 12%, #fff); }
      .gb-stepper span { min-width: 18px; text-align: center; font-weight: 600; font-size: 10px; }

      .gb-summary {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.07);
        border-radius: 10px;
        padding: 10px;
        align-self: start;
      }

      .gb-summary > div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 6px;
        font-size: 9px;
        color: rgba(0, 0, 0, 0.55);
      }

      .gb-summary > div b { color: #1a2e1a; font-size: 10px; }
      .gb-summary-total {
        border-top: 1px solid rgba(0, 0, 0, 0.08);
        padding-top: 8px;
        margin-top: 4px;
        font-weight: 700;
      }

      .gb-form {
        padding: 12px;
        max-width: 360px;
      }

      .gb-form h3 {
        font-size: 12px;
        margin: 0 0 8px;
        font-family: var(--font-display, "Syne", sans-serif);
      }

      .gb-form label {
        display: block;
        font-size: 9px;
        color: rgba(0, 0, 0, 0.5);
        margin-bottom: 8px;
      }

      .gb-form input {
        display: block;
        width: 100%;
        margin-top: 4px;
        padding: 8px 10px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 8px;
        font: inherit;
        font-size: 10px;
        background: #fff;
      }

      .gb-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .gb-footer {
        padding: 12px;
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        font-size: 8px;
        color: rgba(0, 0, 0, 0.35);
        text-align: center;
        background: #fff;
      }

      .gb-farm-banner {
        margin: 0 12px 12px;
        border-radius: 10px;
        overflow: hidden;
        min-height: 60px;
        position: relative;
      }

      .gb-farm-banner span {
        position: absolute;
        inset: auto 0 0 0;
        padding: 8px 10px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
        color: #fff;
        font-size: 9px;
        font-weight: 600;
      }

      @media (max-width: 640px) {
        .gb-root[data-mode="full"] .gb-nav {
          flex-wrap: wrap;
          gap: 6px;
          padding: 8px 10px;
        }

        .gb-root[data-mode="full"] .gb-nav__brand {
          width: 100%;
        }

        .gb-root[data-mode="full"] .gb-hero__copy {
          max-width: 100%;
          padding: 16px 12px 12px;
        }

        .gb-root[data-mode="full"] .gb-hero h1 {
          font-size: clamp(20px, 6.5vw, 28px);
        }

        .gb-root[data-mode="full"] .gb-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .gb-root[data-mode="full"] .gb-split,
        .gb-root[data-mode="full"] .gb-pdp,
        .gb-root[data-mode="full"] .gb-cart-layout {
          grid-template-columns: 1fr;
        }

        .gb-root[data-mode="full"] .gb-nutrition {
          grid-template-columns: repeat(2, 1fr);
        }

        .gb-root[data-mode="full"] .gb-cart-line {
          grid-template-columns: 40px 1fr auto;
          grid-template-rows: auto auto;
        }

        .gb-root[data-mode="full"] .gb-form-row {
          grid-template-columns: 1fr;
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
    <div className="gb-root" data-mode={mode} style={gbStyle(accent)}>
      <GbStyles />
      <header className="gb-chrome" aria-hidden>
        <span className="gb-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="gb-chrome__url">{url}</span>
      </header>
      <div className="gb-body">{children}</div>
    </div>
  );
}

const USD_TO_RUB = 95;

function formatPrice(n: number, locale: Locale) {
  if (locale === "ru") {
    const rub = Math.round(n * USD_TO_RUB);
    return `${rub.toLocaleString("ru-RU")} ₽`;
  }
  return `$${n.toFixed(2)}`;
}

export function GreenBasketSite({
  accent = "#16a34a",
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
  const [selectedProduct, setSelectedProduct] = useState("kale");
  const [activeChip, setActiveChip] = useState(0);
  const activePage = mode === "thumb" ? "home" : page;

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const product = PRODUCTS.find((p) => p.id === selectedProduct) ?? PRODUCTS[0];

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l));
      }
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

  const subtotal = cartLines.reduce((s, l) => s + l.price * l.qty, 0);
  const deliveryFee = cartLines.length > 0 ? 2.5 : 0;
  const total = subtotal + deliveryFee;

  const openProduct = (id: string) => {
    setSelectedProduct(id);
    if (mode === "full") setPage("product");
  };

  const navPages: { id: PageId; label: string }[] = [
    { id: "home", label: t.nav.home },
    { id: "catalog", label: t.nav.catalog },
    { id: "cart", label: t.nav.cart },
    { id: "checkout", label: t.nav.checkout },
  ];

  return (
    <Shell url={`${t.host} / ${activePage}`} accent={accent} mode={mode}>
      <nav className="gb-nav">
        <span className="gb-nav__brand">{t.brand}</span>
        {mode === "full" &&
          navPages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`gb-nav__link${activePage === p.id ? " is-active" : ""}`}
              onClick={() => setPage(p.id)}
            >
              {p.label}
            </button>
          ))}
        {mode === "full" && (
          <button type="button" className="gb-cart-btn" onClick={() => setPage("cart")}>
            {t.cart}
            <i>{cartCount}</i>
          </button>
        )}
        {mode === "thumb" && (
          <span className="gb-cart-btn" style={{ cursor: "default" }}>
            {t.cart}
            <i>3</i>
          </span>
        )}
      </nav>

      <div key={activePage} className="gb-page">
        {activePage === "home" && (
          <>
            <section className="gb-hero">
              <div className="gb-hero__bg" aria-hidden>
                <img className="gb-img" src={groceryPhotos.hero} alt="" loading="lazy" />
                <div className="gb-hero__overlay" />
              </div>
              <div className="gb-hero__copy">
                <h1>{t.heroTitle}</h1>
                <p>{t.heroLead}</p>
                <button
                  type="button"
                  className="gb-btn gb-btn--sm"
                  onClick={() => mode === "full" && setPage("catalog")}
                >
                  {t.shopProduce}
                </button>
                <div className="gb-hero__trust">
                  <span>{t.trust1}</span>
                  <span>{t.trust2}</span>
                  <span>{t.trust3}</span>
                </div>
              </div>
            </section>
            <div className="gb-chips">
              {t.categories.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className={`gb-chip${activeChip === i ? " is-on" : ""}`}
                  onClick={() => setActiveChip(i)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="gb-grid">
              {PRODUCTS.slice(0, mode === "thumb" ? 4 : 6).map((p) => (
                <article
                  key={p.id}
                  className="gb-card"
                  onClick={() => openProduct(p.id)}
                  onKeyDown={(e) => e.key === "Enter" && openProduct(p.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="gb-card__img">
                    <img className="gb-img" src={p.img} alt={p.name[locale]} loading="lazy" />
                  </div>
                  <div className="gb-card__body">
                    <b>{p.name[locale]}</b>
                    <em>{p.weight[locale]}</em>
                    <div className="gb-card__row">
                      <strong>{formatPrice(p.price, locale)}</strong>
                      {mode === "full" && (
                        <button
                          type="button"
                          className="gb-btn gb-btn--sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p.id);
                          }}
                        >
                          {t.add}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {mode === "full" && (
              <div className="gb-farm-banner">
                <img className="gb-img" src={groceryPhotos.farm} alt="" loading="lazy" style={{ minHeight: 70 }} />
                <span>{t.trust2}</span>
              </div>
            )}
          </>
        )}

        {activePage === "catalog" && mode === "full" && (
          <div className="gb-split">
            <aside className="gb-filters">
              <h4>{t.filters}</h4>
              {t.filterOpts.map((f, i) => (
                <label key={f}>
                  <i className={i < 2 ? "is-on" : undefined} />
                  {f}
                </label>
              ))}
              <h4 style={{ marginTop: 10 }}>{t.catFilter}</h4>
              {t.catOpts.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  className={`gb-chip${i === 0 ? " is-on" : ""}`}
                  style={{ marginBottom: 4, display: "block" }}
                >
                  {c}
                </button>
              ))}
            </aside>
            <div className="gb-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", padding: 0 }}>
              {PRODUCTS.map((p) => (
                <article key={p.id} className="gb-card" onClick={() => openProduct(p.id)} role="button" tabIndex={0}>
                  <div className="gb-card__img">
                    <img className="gb-img" src={p.img} alt={p.name[locale]} loading="lazy" />
                  </div>
                  <div className="gb-card__body">
                    <b>{p.name[locale]}</b>
                    <em>{p.weight[locale]}</em>
                    <div className="gb-card__row">
                      <strong>{formatPrice(p.price, locale)}</strong>
                      <button
                        type="button"
                        className="gb-btn gb-btn--sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p.id);
                        }}
                      >
                        {t.add}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activePage === "product" && mode === "full" && (
          <div className="gb-pdp">
            <div className="gb-pdp__gallery">
              <div>
                <img className="gb-img" src={product.img} alt="" loading="lazy" />
              </div>
              <div>
                <img className="gb-img" src={groceryPhotos.farm} alt="" loading="lazy" />
              </div>
            </div>
            <div>
              {product.organic && <span className="gb-tag">{t.organic}</span>}
              <h2>{product.name[locale]}</h2>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(0,0,0,0.55)" }}>
                {t.pdpLead} · {product.weight[locale]}
              </p>
              <div className="gb-price">{formatPrice(product.price, locale)}</div>
              <div className="gb-nutrition">
                {[
                  [t.cal, "35"],
                  [t.protein, "2g"],
                  [t.fiber, "2g"],
                  [t.vitK, "80%"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <b>{v}</b>
                    <span>{k}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="gb-btn" onClick={() => addToCart(product.id)}>
                {t.addToCart}
              </button>
            </div>
          </div>
        )}

        {activePage === "cart" && mode === "full" && (
          <div className="gb-cart-layout">
            <div>
              <h2 style={{ margin: "0 0 10px", fontSize: 14 }}>{t.yourBasket}</h2>
              {cartLines.length === 0 ? (
                <p style={{ color: "rgba(0,0,0,0.5)", fontSize: 10 }}>
                  {t.emptyCart}{" "}
                  <button type="button" className="gb-btn gb-btn--ghost gb-btn--sm" onClick={() => setPage("catalog")}>
                    {t.continueShopping}
                  </button>
                </p>
              ) : (
                cartLines.map((line) => (
                  <div key={line.id} className="gb-cart-line">
                    <div className="gb-cart-line__thumb">
                      <img className="gb-img" src={line.img} alt="" loading="lazy" />
                    </div>
                    <div>
                      <b style={{ fontSize: 10 }}>{line.name[locale]}</b>
                      <em style={{ display: "block", fontSize: 8, fontStyle: "normal", color: "rgba(0,0,0,0.45)" }}>
                        {line.weight[locale]}
                      </em>
                    </div>
                    <div className="gb-stepper">
                      <button type="button" onClick={() => setQty(line.id, -1)}>
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button type="button" onClick={() => setQty(line.id, 1)}>
                        +
                      </button>
                    </div>
                    <strong style={{ color: "var(--gb-a)", fontSize: 11 }}>
                      {formatPrice(line.price * line.qty, locale)}
                    </strong>
                  </div>
                ))
              )}
            </div>
            {cartLines.length > 0 && (
              <aside className="gb-summary">
                <div>
                  <span>{t.subtotal}</span>
                  <b>{formatPrice(subtotal, locale)}</b>
                </div>
                <div>
                  <span>{t.delivery}</span>
                  <b>{formatPrice(deliveryFee, locale)}</b>
                </div>
                <div className="gb-summary-total">
                  <span>{t.total}</span>
                  <b>{formatPrice(total, locale)}</b>
                </div>
                <button type="button" className="gb-btn" style={{ width: "100%", marginTop: 8 }} onClick={() => setPage("checkout")}>
                  {t.checkout}
                </button>
              </aside>
            )}
          </div>
        )}

        {activePage === "checkout" && mode === "full" && (
          <div className="gb-form">
            <h3>{t.deliveryTitle}</h3>
            <label>
              {t.address}
              <input readOnly value={locale === "ru" ? "ул. Луговая, 14" : "14 Meadow Lane"} />
            </label>
            <div className="gb-form-row">
              <label>
                {t.city}
                <input readOnly value={locale === "ru" ? "Хельсинки" : "Helsinki"} />
              </label>
              <label>
                {t.slot}
                <input readOnly value={locale === "ru" ? "Сегодня 11–13" : "Today 11–13"} />
              </label>
            </div>
            <h3 style={{ marginTop: 14 }}>{t.paymentTitle}</h3>
            <label>
              {t.card}
              <input readOnly value="•••• 4242" />
            </label>
            <div className="gb-summary" style={{ marginTop: 12 }}>
              <div className="gb-summary-total">
                <span>{t.total}</span>
                <b>{formatPrice(total || 21.4, locale)}</b>
              </div>
            </div>
            <button type="button" className="gb-btn" style={{ marginTop: 10, width: "100%" }}>
              {t.placeOrder}
            </button>
          </div>
        )}
      </div>
    </Shell>
  );
}

import { type CSSProperties, type ReactNode, useState } from "react";

export type LivingMode = "full" | "thumb";
type Locale = "en" | "ru";
type PageId = "dashboard" | "users" | "products" | "analytics" | "orders";

const COPY = {
  en: {
    brand: "NordPulse",
    host: "app.nordpulse.io",
    nav: {
      dashboard: "Dashboard",
      users: "Users",
      products: "Products",
      analytics: "Analytics",
      orders: "Orders",
    },
    overview: "Overview",
    overviewSub: "Q3 performance · live",
    export: "Export",
    revenue: "Revenue",
    activeUsers: "Active users",
    ordersKpi: "Orders",
    churn: "Churn",
    weeklyVolume: "Weekly volume",
    recentOrders: "Recent orders",
    id: "ID",
    client: "Client",
    total: "Total",
    status: "Status",
    teamDir: "Team directory",
    teamSub: "24 members · 3 pending",
    invite: "Invite",
    all: "All",
    admins: "Admins",
    editors: "Editors",
    viewers: "Viewers",
    searchPh: "Search users…",
    user: "User",
    role: "Role",
    edit: "Edit",
    inventory: "Inventory",
    inventorySub: "148 SKUs tracked",
    addProduct: "Add product",
    inStock: "in stock",
    conversion: "Conversion analytics",
    last30: "Last 30 days",
    sessions: "Sessions → purchase",
    funnel: "Funnel",
    visits: "Visits",
    signups: "Sign-ups",
    trials: "Trials",
    paid: "Paid",
    region: "Region breakdown",
    ordersTitle: "Orders",
    ordersSub: "Today · $5,750 total",
    paidLabel: "Paid",
    pendingLabel: "Pending",
    order: "Order",
    date: "Date",
    footer: "© NordPulse — portfolio case",
    statuses: { Paid: "Paid", Pending: "Pending", Shipped: "Shipped", Refund: "Refund", Active: "Active", Invited: "Invited", Suspended: "Suspended" },
    roles: { Admin: "Admin", Editor: "Editor", Viewer: "Viewer" },
  },
  ru: {
    brand: "NordPulse",
    host: "app.nordpulse.io",
    nav: {
      dashboard: "Дашборд",
      users: "Пользователи",
      products: "Товары",
      analytics: "Аналитика",
      orders: "Заказы",
    },
    overview: "Обзор",
    overviewSub: "Q3 · в реальном времени",
    export: "Экспорт",
    revenue: "Выручка",
    activeUsers: "Активные",
    ordersKpi: "Заказы",
    churn: "Отток",
    weeklyVolume: "Недельный объём",
    recentOrders: "Последние заказы",
    id: "ID",
    client: "Клиент",
    total: "Сумма",
    status: "Статус",
    teamDir: "Команда",
    teamSub: "24 участника · 3 ожидают",
    invite: "Пригласить",
    all: "Все",
    admins: "Админы",
    editors: "Редакторы",
    viewers: "Наблюдатели",
    searchPh: "Поиск…",
    user: "Пользователь",
    role: "Роль",
    edit: "Изменить",
    inventory: "Склад",
    inventorySub: "148 SKU",
    addProduct: "Добавить",
    inStock: "на складе",
    conversion: "Конверсия",
    last30: "30 дней",
    sessions: "Сессии → покупка",
    funnel: "Воронка",
    visits: "Визиты",
    signups: "Регистрации",
    trials: "Триалы",
    paid: "Оплата",
    region: "По регионам",
    ordersTitle: "Заказы",
    ordersSub: "Сегодня · $5 750",
    paidLabel: "Оплачено",
    pendingLabel: "Ожидание",
    order: "Заказ",
    date: "Дата",
    footer: "© NordPulse — portfolio case",
    statuses: { Paid: "Оплачен", Pending: "Ожидание", Shipped: "Отправлен", Refund: "Возврат", Active: "Активен", Invited: "Приглашён", Suspended: "Заблокирован" },
    roles: { Admin: "Админ", Editor: "Редактор", Viewer: "Наблюдатель" },
  },
} as const;

const USERS = [
  { id: "u1", initials: "AK", color: "#3b82f6", name: "Anna Korhonen", role: "Admin" as const, status: "Active" as const },
  { id: "u2", initials: "JL", color: "#6366f1", name: "Johan Lind", role: "Editor" as const, status: "Active" as const },
  { id: "u3", initials: "MS", color: "#0ea5e9", name: "Mira Salo", role: "Viewer" as const, status: "Invited" as const },
  { id: "u4", initials: "EB", color: "#64748b", name: "Erik Berg", role: "Editor" as const, status: "Active" as const },
  { id: "u5", initials: "TN", color: "#2563eb", name: "Tuva Nilsen", role: "Admin" as const, status: "Suspended" as const },
];

const PRODUCTS = [
  { name: "Pulse Desk", sku: "SKU-120", stock: 86, price: "$49" },
  { name: "Nord Seat", sku: "SKU-221", stock: 42, price: "$189" },
  { name: "Cable Kit", sku: "SKU-088", stock: 12, price: "$24" },
  { name: "Dock Pro", sku: "SKU-340", stock: 67, price: "$129" },
  { name: "Stand Mini", sku: "SKU-155", stock: 91, price: "$39" },
  { name: "Hub USB-C", sku: "SKU-402", stock: 28, price: "$59" },
];

const ORDERS = [
  { id: "#4821", client: "Helix Ltd", total: "$1,240", status: "Paid" as const, date: "Aug 10" },
  { id: "#4820", client: "Orbit Co", total: "$680", status: "Pending" as const, date: "Aug 10" },
  { id: "#4819", client: "Nimbus", total: "$2,110", status: "Shipped" as const, date: "Aug 9" },
  { id: "#4818", client: "Cedar", total: "$420", status: "Refund" as const, date: "Aug 9" },
  { id: "#4817", client: "Folio", total: "$990", status: "Paid" as const, date: "Aug 8" },
  { id: "#4816", client: "Apex", total: "$310", status: "Pending" as const, date: "Aug 8" },
];

const BAR_HEIGHTS = [40, 62, 48, 78, 55, 90, 70];
const LINE_POINTS = "10,80 50,70 90,74 130,48 170,55 210,32 250,40 270,28";
const LINE_POINTS2 = "10,90 50,85 90,82 130,78 170,70 210,68 250,60 270,58";

function npStyle(accent: string): CSSProperties {
  return { "--np-a": accent } as CSSProperties;
}

function NpStyles() {
  return (
    <style>{`
      .np-root {
        --np-a: #2563eb;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: #f1f5f9;
        color: #0f172a;
        font-family: var(--font-body, "Sora", sans-serif);
        font-size: 11px;
        line-height: 1.35;
        overflow: hidden;
        user-select: none;
      }

      .np-root[data-mode="thumb"] { font-size: 9px; }

      .np-chrome {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 28px;
        padding: 0 10px;
        background: #e2e8f0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        flex-shrink: 0;
      }

      .np-root[data-mode="thumb"] .np-chrome { height: 20px; padding: 0 6px; }

      .np-chrome__dots { display: flex; gap: 4px; }
      .np-chrome__dots i { width: 7px; height: 7px; border-radius: 50%; }
      .np-root[data-mode="thumb"] .np-chrome__dots i { width: 5px; height: 5px; }
      .np-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .np-chrome__dots i:nth-child(2) { background: #febc2e; }
      .np-chrome__dots i:nth-child(3) { background: #28c840; }

      .np-chrome__url {
        flex: 1;
        height: 16px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.8);
        color: rgba(0, 0, 0, 0.45);
        font-size: 9px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .np-body {
        flex: 1;
        min-height: 0;
        overflow: hidden;
        display: flex;
      }

      .np-side {
        width: 88px;
        flex-shrink: 0;
        background: #0f172a;
        color: #94a3b8;
        padding: 10px 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .np-root[data-mode="thumb"] .np-side { width: 56px; padding: 6px 4px; }

      .np-side__logo {
        font-family: var(--font-display, "Syne", sans-serif);
        font-weight: 700;
        font-size: 14px;
        color: var(--np-a);
        margin-bottom: 8px;
        letter-spacing: 0.04em;
      }

      .np-side__btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: inherit;
        font: inherit;
        font-size: 9px;
        text-align: left;
        padding: 6px 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .np-side__btn:hover { background: rgba(255, 255, 255, 0.06); color: #e2e8f0; }
      .np-side__btn.is-active {
        background: color-mix(in srgb, var(--np-a) 25%, transparent);
        color: #fff;
        font-weight: 600;
      }

      .np-main {
        flex: 1;
        min-width: 0;
        overflow: auto;
        background: #f8fafc;
      }

      .np-page { animation: np-fade 0.28s ease; padding-bottom: 12px; }

      @keyframes np-fade {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .np-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 14px 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: #fff;
      }

      .np-head h2 {
        margin: 0;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 14px;
        font-weight: 700;
      }

      .np-head p { margin: 2px 0 0; font-size: 9px; color: rgba(0, 0, 0, 0.45); }

      .np-btn {
        appearance: none;
        border: 0;
        cursor: pointer;
        font: inherit;
        font-size: 9px;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 6px;
        background: var(--np-a);
        color: #fff;
        transition: transform 0.15s, box-shadow 0.15s;
      }

      .np-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px color-mix(in srgb, var(--np-a) 35%, transparent);
      }

      .np-kpi-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        padding: 10px 14px;
      }

      .np-root[data-mode="thumb"] .np-kpi-row { grid-template-columns: repeat(2, 1fr); gap: 4px; padding: 6px 8px; }

      .np-kpi {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 10px;
        transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
      }

      .np-kpi:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        border-color: color-mix(in srgb, var(--np-a) 30%, transparent);
      }

      .np-kpi span { display: block; font-size: 8px; color: rgba(0, 0, 0, 0.45); text-transform: uppercase; letter-spacing: 0.04em; }
      .np-kpi b { display: block; font-size: 16px; font-weight: 700; margin: 4px 0 2px; font-family: var(--font-display, "Syne", sans-serif); }
      .np-kpi em { font-style: normal; font-size: 9px; font-weight: 600; color: #16a34a; }
      .np-kpi em.is-down { color: #dc2626; }

      .np-split {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 0 14px 10px;
      }

      .np-root[data-mode="thumb"] .np-split { grid-template-columns: 1fr; }

      .np-panel {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 10px;
      }

      .np-panel h3 {
        margin: 0 0 8px;
        font-size: 10px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.55);
      }

      .np-chart { width: 100%; height: auto; display: block; }

      .np-bar {
        transform-origin: bottom;
        animation: np-bar-grow 0.6s ease forwards;
        opacity: 0;
      }

      @keyframes np-bar-grow {
        from { transform: scaleY(0); opacity: 0; }
        to { transform: scaleY(1); opacity: 1; }
      }

      .np-line {
        stroke-dasharray: 400;
        stroke-dashoffset: 400;
        animation: np-line-draw 1.2s ease forwards;
      }

      @keyframes np-line-draw {
        to { stroke-dashoffset: 0; }
      }

      .np-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 9px;
      }

      .np-table th {
        text-align: left;
        padding: 6px 8px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.45);
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        font-size: 8px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .np-table td {
        padding: 7px 8px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
      }

      .np-table tr {
        transition: background 0.15s;
        cursor: pointer;
      }

      .np-table tbody tr:hover { background: color-mix(in srgb, var(--np-a) 6%, #fff); }
      .np-table tr.is-selected { background: color-mix(in srgb, var(--np-a) 12%, #fff); }

      .np-pill {
        display: inline-block;
        font-size: 8px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        text-transform: capitalize;
      }

      .np-pill--paid, .np-pill--active, .np-pill--shipped { background: #dcfce7; color: #166534; }
      .np-pill--pending, .np-pill--invited { background: #fef9c3; color: #854d0e; }
      .np-pill--refund, .np-pill--suspended { background: #fee2e2; color: #991b1b; }

      .np-filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: #fff;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }

      .np-tab {
        appearance: none;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: #fff;
        color: rgba(0, 0, 0, 0.55);
        font: inherit;
        font-size: 9px;
        padding: 5px 10px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.15s;
      }

      .np-tab:hover, .np-tab.is-on {
        border-color: var(--np-a);
        color: var(--np-a);
        background: color-mix(in srgb, var(--np-a) 8%, #fff);
      }

      .np-search {
        margin-left: auto;
        padding: 5px 10px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        font: inherit;
        font-size: 9px;
        background: #f8fafc;
        color: rgba(0, 0, 0, 0.4);
        min-width: 100px;
      }

      .np-user-cell {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .np-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-size: 8px;
        font-weight: 700;
        color: #fff;
        flex-shrink: 0;
      }

      .np-muted { color: rgba(0, 0, 0, 0.35); font-size: 9px; }

      .np-prod-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 10px 14px;
      }

      .np-prod-card {
        background: #fff;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 10px;
        transition: transform 0.2s, border-color 0.2s;
      }

      .np-prod-card:hover {
        transform: translateY(-2px);
        border-color: color-mix(in srgb, var(--np-a) 30%, transparent);
      }

      .np-prod-thumb {
        height: 48px;
        border-radius: 8px;
        background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
        margin-bottom: 8px;
      }

      .np-prod-card b { display: block; font-size: 10px; }
      .np-prod-card span { font-size: 8px; color: rgba(0, 0, 0, 0.4); }

      .np-stock {
        height: 4px;
        background: #e2e8f0;
        border-radius: 2px;
        margin: 6px 0 4px;
        overflow: hidden;
      }

      .np-stock i {
        display: block;
        height: 100%;
        background: var(--np-a);
        border-radius: 2px;
        transition: width 0.4s ease;
      }

      .np-prod-card em { font-style: normal; font-size: 8px; color: rgba(0, 0, 0, 0.45); }
      .np-prod-card strong { display: block; margin-top: 4px; font-size: 12px; color: var(--np-a); }

      .np-funnel-row {
        display: grid;
        grid-template-columns: 60px 1fr 32px;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        font-size: 9px;
      }

      .np-funnel-bar {
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
      }

      .np-funnel-bar i {
        display: block;
        height: 100%;
        border-radius: 4px;
        animation: np-funnel-grow 0.8s ease forwards;
        transform-origin: left;
        transform: scaleX(0);
      }

      @keyframes np-funnel-grow {
        to { transform: scaleX(1); }
      }

      .np-region-row {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .np-region {
        flex: 1;
        min-width: 60px;
        text-align: center;
        padding: 8px;
        border-radius: 8px;
        background: #f1f5f9;
        transition: background 0.15s;
      }

      .np-region:hover { background: color-mix(in srgb, var(--np-a) 10%, #f1f5f9); }
      .np-region b { display: block; font-size: 14px; font-weight: 700; color: var(--np-a); }
      .np-region span { font-size: 8px; color: rgba(0, 0, 0, 0.45); }

      .np-spark {
        display: inline-block;
        vertical-align: middle;
        margin-left: 4px;
      }

      .np-totals {
        display: flex;
        gap: 12px;
        font-size: 9px;
        color: rgba(0, 0, 0, 0.45);
      }

      .np-totals b { color: #0f172a; margin-left: 4px; }

      .np-footer {
        padding: 8px 14px;
        font-size: 8px;
        color: rgba(0, 0, 0, 0.35);
        border-top: 1px solid rgba(0, 0, 0, 0.06);
        background: #fff;
      }

      .np-pager {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 14px;
        font-size: 9px;
        color: rgba(0, 0, 0, 0.45);
      }

      .np-pager div { display: flex; gap: 4px; }

      .np-pager button {
        appearance: none;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background: #fff;
        width: 24px;
        height: 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
      }

      .np-pager button.is-on {
        background: var(--np-a);
        color: #fff;
        border-color: var(--np-a);
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
    <div className="np-root" data-mode={mode} style={npStyle(accent)}>
      <NpStyles />
      <header className="np-chrome" aria-hidden>
        <span className="np-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="np-chrome__url">{url}</span>
      </header>
      <div className="np-body">{children}</div>
    </div>
  );
}

function Sparkline({ accent }: { accent: string }) {
  return (
    <svg className="np-spark" width="40" height="14" viewBox="0 0 40 14" aria-hidden>
      <polyline
        className="np-line"
        fill="none"
        stroke={accent}
        strokeWidth="1.5"
        points="0,12 8,8 16,10 24,4 32,6 40,2"
      />
    </svg>
  );
}

function statusClass(status: string) {
  return `np-pill np-pill--${status.toLowerCase()}`;
}

export function NordPulseSite({
  accent = "#2563eb",
  locale,
  mode,
}: {
  accent: string;
  locale: "en" | "ru";
  mode: "full" | "thumb";
}) {
  const t = COPY[locale];
  const [page, setPage] = useState<PageId>("dashboard");
  const [userFilter, setUserFilter] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const activePage = mode === "thumb" ? "dashboard" : page;

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const navItems: { id: PageId; label: string }[] = [
    { id: "dashboard", label: t.nav.dashboard },
    { id: "users", label: t.nav.users },
    { id: "products", label: t.nav.products },
    { id: "analytics", label: t.nav.analytics },
    { id: "orders", label: t.nav.orders },
  ];

  const userTabs = [t.all, t.admins, t.editors, t.viewers];

  const kpis = [
    [t.revenue, "$248k", "+12%", false],
    [t.activeUsers, "1,842", "+4%", false],
    [t.ordersKpi, "386", "+9%", false],
    [t.churn, "2.1%", "-0.3%", true],
  ] as const;

  const funnel = [
    [t.visits, 100, "#93c5fd"],
    [t.signups, 62, "#60a5fa"],
    [t.trials, 38, "#3b82f6"],
    [t.paid, 18, "#1d4ed8"],
  ] as const;

  const regions = [
    ["Nordics", "34%"],
    ["DACH", "22%"],
    ["UK", "18%"],
    ["US", "16%"],
    ["Other", "10%"],
  ] as const;

  return (
    <Shell url={`${t.host} / ${activePage}`} accent={accent} mode={mode}>
      <aside className="np-side">
        <span className="np-side__logo">NP</span>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`np-side__btn${activePage === item.id ? " is-active" : ""}`}
            onClick={() => mode === "full" && setPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </aside>

      <main className="np-main">
        <div key={activePage} className="np-page">
          {activePage === "dashboard" && (
            <>
              <header className="np-head">
                <div>
                  <h2>{t.overview}</h2>
                  <p>{t.overviewSub}</p>
                </div>
                {mode === "full" && (
                  <button type="button" className="np-btn">
                    {t.export}
                  </button>
                )}
              </header>
              <div className="np-kpi-row">
                {kpis.map(([label, val, delta, isDown]) => (
                  <article key={label} className="np-kpi">
                    <span>{label}</span>
                    <b>
                      {val}
                      <Sparkline accent={accent} />
                    </b>
                    <em className={isDown ? "is-down" : undefined}>{delta}</em>
                  </article>
                ))}
              </div>
              <div className="np-split">
                <div className="np-panel">
                  <h3>{t.weeklyVolume}</h3>
                  <svg viewBox="0 0 280 100" className="np-chart" aria-hidden>
                    {BAR_HEIGHTS.map((h, i) => (
                      <rect
                        key={i}
                        className="np-bar"
                        x={18 + i * 36}
                        y={100 - h}
                        width={22}
                        height={h}
                        rx={3}
                        fill={i === 5 ? accent : "#93c5fd"}
                        style={{ animationDelay: `${i * 0.08}s` }}
                      />
                    ))}
                  </svg>
                </div>
                <div className="np-panel">
                  <h3>{t.recentOrders}</h3>
                  <table className="np-table">
                    <thead>
                      <tr>
                        <th>{t.id}</th>
                        <th>{t.client}</th>
                        <th>{t.total}</th>
                        <th>{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ORDERS.slice(0, 4).map((row) => (
                        <tr
                          key={row.id}
                          className={selectedRows.has(row.id) ? "is-selected" : undefined}
                          onClick={() => mode === "full" && toggleRow(row.id)}
                        >
                          <td>{row.id}</td>
                          <td>{row.client}</td>
                          <td>{row.total}</td>
                          <td>
                            <span className={statusClass(row.status)}>
                              {t.statuses[row.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activePage === "users" && mode === "full" && (
            <>
              <header className="np-head">
                <div>
                  <h2>{t.teamDir}</h2>
                  <p>{t.teamSub}</p>
                </div>
                <button type="button" className="np-btn">
                  {t.invite}
                </button>
              </header>
              <div className="np-filters">
                {userTabs.map((tab, i) => (
                  <button
                    key={tab}
                    type="button"
                    className={`np-tab${userFilter === i ? " is-on" : ""}`}
                    onClick={() => setUserFilter(i)}
                  >
                    {tab}
                  </button>
                ))}
                <input className="np-search" readOnly value={t.searchPh} />
              </div>
              <div className="np-panel" style={{ margin: "0 14px" }}>
                <table className="np-table">
                  <thead>
                    <tr>
                      <th>{t.user}</th>
                      <th>{t.role}</th>
                      <th>{t.status}</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {USERS.filter((u) => {
                      if (userFilter === 0) return true;
                      if (userFilter === 1) return u.role === "Admin";
                      if (userFilter === 2) return u.role === "Editor";
                      return u.role === "Viewer";
                    }).map((u) => (
                      <tr
                        key={u.id}
                        className={selectedRows.has(u.id) ? "is-selected" : undefined}
                        onClick={() => toggleRow(u.id)}
                      >
                        <td>
                          <div className="np-user-cell">
                            <span className="np-avatar" style={{ background: u.color }}>
                              {u.initials}
                            </span>
                            {u.name}
                          </div>
                        </td>
                        <td>{t.roles[u.role]}</td>
                        <td>
                          <span className={statusClass(u.status)}>{t.statuses[u.status]}</span>
                        </td>
                        <td className="np-muted">{t.edit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="np-pager">
                <span>1–5 of 24</span>
                <div>
                  <button type="button">‹</button>
                  <button type="button" className="is-on">
                    1
                  </button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">›</button>
                </div>
              </div>
            </>
          )}

          {activePage === "products" && mode === "full" && (
            <>
              <header className="np-head">
                <div>
                  <h2>{t.inventory}</h2>
                  <p>{t.inventorySub}</p>
                </div>
                <button type="button" className="np-btn">
                  {t.addProduct}
                </button>
              </header>
              <div className="np-prod-grid">
                {PRODUCTS.map((p) => (
                  <article key={p.sku} className="np-prod-card">
                    <div className="np-prod-thumb" />
                    <b>{p.name}</b>
                    <span>{p.sku}</span>
                    <div className="np-stock">
                      <i style={{ width: `${p.stock}%` }} />
                    </div>
                    <em>
                      {p.stock}% {t.inStock}
                    </em>
                    <strong>{p.price}</strong>
                  </article>
                ))}
              </div>
            </>
          )}

          {activePage === "analytics" && mode === "full" && (
            <>
              <header className="np-head">
                <div>
                  <h2>{t.conversion}</h2>
                  <p>{t.last30}</p>
                </div>
              </header>
              <div className="np-split">
                <div className="np-panel">
                  <h3>{t.sessions}</h3>
                  <svg viewBox="0 0 280 110" className="np-chart" aria-hidden>
                    <polyline
                      className="np-line"
                      fill="none"
                      stroke={accent}
                      strokeWidth="2.5"
                      points={LINE_POINTS}
                    />
                    <polyline
                      className="np-line"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      points={LINE_POINTS2}
                      style={{ animationDelay: "0.3s" }}
                    />
                  </svg>
                </div>
                <div className="np-panel">
                  <h3>{t.funnel}</h3>
                  {funnel.map(([label, w, color], i) => (
                    <div key={label} className="np-funnel-row">
                      <span>{label}</span>
                      <div className="np-funnel-bar">
                        <i style={{ width: `${w}%`, background: color, animationDelay: `${i * 0.15}s` }} />
                      </div>
                      <em>{w}%</em>
                    </div>
                  ))}
                </div>
              </div>
              <div className="np-panel" style={{ margin: "0 14px" }}>
                <h3>{t.region}</h3>
                <div className="np-region-row">
                  {regions.map(([r, p]) => (
                    <div key={r} className="np-region">
                      <b>{p}</b>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activePage === "orders" && mode === "full" && (
            <>
              <header className="np-head">
                <div>
                  <h2>{t.ordersTitle}</h2>
                  <p>{t.ordersSub}</p>
                </div>
                <div className="np-totals">
                  <span>
                    {t.paidLabel} <b>$4,340</b>
                  </span>
                  <span>
                    {t.pendingLabel} <b>$990</b>
                  </span>
                </div>
              </header>
              <div className="np-panel" style={{ margin: "0 14px" }}>
                <table className="np-table">
                  <thead>
                    <tr>
                      <th>{t.order}</th>
                      <th>{t.client}</th>
                      <th>{t.total}</th>
                      <th>{t.status}</th>
                      <th>{t.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ORDERS.map((row) => (
                      <tr
                        key={row.id}
                        className={selectedRows.has(row.id) ? "is-selected" : undefined}
                        onClick={() => toggleRow(row.id)}
                      >
                        <td>{row.id}</td>
                        <td>{row.client}</td>
                        <td>{row.total}</td>
                        <td>
                          <span className={statusClass(row.status)}>{t.statuses[row.status]}</span>
                        </td>
                        <td className="np-muted">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <footer className="np-footer">{t.footer}</footer>
      </main>
    </Shell>
  );
}

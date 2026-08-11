import type { ReactNode } from "react";

type MockProps = { id: string };

const MOCK_IDS = [
  "nordpulse-dash",
  "nordpulse-users",
  "nordpulse-products",
  "nordpulse-analytics",
  "nordpulse-orders",
  "greenbasket-home",
  "greenbasket-catalog",
  "greenbasket-pdp",
  "greenbasket-cart",
  "greenbasket-checkout",
  "toybox-home",
  "toybox-shop",
  "toybox-pdp",
  "toybox-cart",
  "toybox-account",
] as const;

type MockId = (typeof MOCK_IDS)[number];

function isMockId(id: string): id is MockId {
  return (MOCK_IDS as readonly string[]).includes(id);
}

function Frame({
  brand,
  url,
  tone,
  children,
}: {
  brand: string;
  url: string;
  tone: "crm" | "grocery" | "kids";
  children: ReactNode;
}) {
  return (
    <div className={`pmock pmock--${tone}`}>
      <div className="pmock-chrome">
        <span className="pmock-dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="pmock-url">{url}</span>
        <span className="pmock-brand">{brand}</span>
      </div>
      <div className="pmock-body">{children}</div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span className="pmock-avatar" style={{ background: color }}>
      {initials}
    </span>
  );
}

/* ─── NordPulse CRM ─── */

function NordpulseDash() {
  return (
    <Frame brand="NordPulse" url="app.nordpulse.io / dashboard" tone="crm">
      <div className="pmock-crm">
        <aside className="pmock-crm-side">
          <strong className="pmock-crm-logo">NP</strong>
          <nav>
            <span className="is-on">Dashboard</span>
            <span>Users</span>
            <span>Products</span>
            <span>Orders</span>
            <span>Analytics</span>
          </nav>
        </aside>
        <main className="pmock-crm-main">
          <header className="pmock-crm-head">
            <div>
              <h3>Overview</h3>
              <p>Q3 performance · live</p>
            </div>
            <button type="button" className="pmock-btn pmock-btn--blue">
              Export
            </button>
          </header>
          <div className="pmock-kpi-row">
            {[
              ["Revenue", "$248k", "+12%"],
              ["Active users", "1,842", "+4%"],
              ["Orders", "386", "+9%"],
              ["Churn", "2.1%", "-0.3%"],
            ].map(([l, v, d]) => (
              <div key={l} className="pmock-kpi">
                <span>{l}</span>
                <b>{v}</b>
                <em>{d}</em>
              </div>
            ))}
          </div>
          <div className="pmock-crm-split">
            <div className="pmock-panel">
              <h4>Weekly volume</h4>
              <svg viewBox="0 0 280 100" className="pmock-chart" aria-hidden>
                {[40, 62, 48, 78, 55, 90, 70].map((h, i) => (
                  <rect
                    key={i}
                    x={18 + i * 36}
                    y={100 - h}
                    width={22}
                    height={h}
                    rx={3}
                    fill={i === 5 ? "#2563eb" : "#93c5fd"}
                  />
                ))}
              </svg>
            </div>
            <div className="pmock-panel pmock-panel--table">
              <h4>Recent orders</h4>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["#4821", "Helix Ltd", "$1,240", "Paid"],
                    ["#4820", "Orbit Co", "$680", "Pending"],
                    ["#4819", "Nimbus", "$2,110", "Paid"],
                    ["#4818", "Cedar", "$420", "Refund"],
                  ].map((row) => (
                    <tr key={row[0]}>
                      {row.map((c) => (
                        <td key={c}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </Frame>
  );
}

function NordpulseUsers() {
  const users = [
    ["AK", "#3b82f6", "Anna Korhonen", "Admin", "Active"],
    ["JL", "#6366f1", "Johan Lind", "Editor", "Active"],
    ["MS", "#0ea5e9", "Mira Salo", "Viewer", "Invited"],
    ["EB", "#64748b", "Erik Berg", "Editor", "Active"],
    ["TN", "#2563eb", "Tuva Nilsen", "Admin", "Suspended"],
  ] as const;
  return (
    <Frame brand="NordPulse" url="app.nordpulse.io / users" tone="crm">
      <div className="pmock-crm">
        <aside className="pmock-crm-side">
          <strong className="pmock-crm-logo">NP</strong>
          <nav>
            <span>Dashboard</span>
            <span className="is-on">Users</span>
            <span>Products</span>
            <span>Orders</span>
            <span>Analytics</span>
          </nav>
        </aside>
        <main className="pmock-crm-main">
          <header className="pmock-crm-head">
            <div>
              <h3>Team directory</h3>
              <p>24 members · 3 pending</p>
            </div>
            <button type="button" className="pmock-btn pmock-btn--blue">
              Invite
            </button>
          </header>
          <div className="pmock-filters">
            <span className="is-on">All</span>
            <span>Admins</span>
            <span>Editors</span>
            <span>Viewers</span>
            <input readOnly value="Search users…" />
          </div>
          <div className="pmock-panel pmock-panel--table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map(([ini, col, name, role, status]) => (
                  <tr key={name}>
                    <td className="pmock-user-cell">
                      <Avatar initials={ini} color={col} />
                      {name}
                    </td>
                    <td>{role}</td>
                    <td>
                      <span
                        className={`pmock-pill pmock-pill--${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="pmock-muted">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pmock-pager">
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
        </main>
      </div>
    </Frame>
  );
}

function NordpulseProducts() {
  const products = [
    ["Pulse Desk", "SKU-120", 86, "$49"],
    ["Nord Seat", "SKU-221", 42, "$189"],
    ["Cable Kit", "SKU-088", 12, "$24"],
    ["Dock Pro", "SKU-340", 67, "$129"],
    ["Stand Mini", "SKU-155", 91, "$39"],
    ["Hub USB-C", "SKU-402", 28, "$59"],
  ];
  return (
    <Frame brand="NordPulse" url="app.nordpulse.io / products" tone="crm">
      <div className="pmock-crm">
        <aside className="pmock-crm-side">
          <strong className="pmock-crm-logo">NP</strong>
          <nav>
            <span>Dashboard</span>
            <span>Users</span>
            <span className="is-on">Products</span>
            <span>Orders</span>
            <span>Analytics</span>
          </nav>
        </aside>
        <main className="pmock-crm-main">
          <header className="pmock-crm-head">
            <div>
              <h3>Inventory</h3>
              <p>148 SKUs tracked</p>
            </div>
            <button type="button" className="pmock-btn pmock-btn--blue">
              Add product
            </button>
          </header>
          <div className="pmock-prod-grid">
            {products.map(([name, sku, stock, price]) => (
              <div key={sku} className="pmock-prod-card">
                <div className="pmock-prod-thumb pmock-prod-thumb--crm" />
                <div>
                  <b>{name}</b>
                  <span>{sku}</span>
                </div>
                <div className="pmock-stock">
                  <i style={{ width: `${stock}%` }} />
                </div>
                <em>{stock}% in stock</em>
                <strong>{price}</strong>
              </div>
            ))}
          </div>
        </main>
      </div>
    </Frame>
  );
}

function NordpulseAnalytics() {
  return (
    <Frame brand="NordPulse" url="app.nordpulse.io / analytics" tone="crm">
      <div className="pmock-crm">
        <aside className="pmock-crm-side">
          <strong className="pmock-crm-logo">NP</strong>
          <nav>
            <span>Dashboard</span>
            <span>Users</span>
            <span>Products</span>
            <span>Orders</span>
            <span className="is-on">Analytics</span>
          </nav>
        </aside>
        <main className="pmock-crm-main">
          <header className="pmock-crm-head">
            <div>
              <h3>Conversion analytics</h3>
              <p>Last 30 days</p>
            </div>
          </header>
          <div className="pmock-crm-split">
            <div className="pmock-panel">
              <h4>Sessions → purchase</h4>
              <svg viewBox="0 0 280 110" className="pmock-chart" aria-hidden>
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  points="10,80 50,70 90,74 130,48 170,55 210,32 250,40 270,28"
                />
                <polyline
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points="10,90 50,85 90,82 130,78 170,70 210,68 250,60 270,58"
                />
              </svg>
            </div>
            <div className="pmock-panel">
              <h4>Funnel</h4>
              {[
                ["Visits", 100, "#93c5fd"],
                ["Sign-ups", 62, "#60a5fa"],
                ["Trials", 38, "#3b82f6"],
                ["Paid", 18, "#1d4ed8"],
              ].map(([label, w, color]) => (
                <div key={String(label)} className="pmock-funnel-row">
                  <span>{label}</span>
                  <div className="pmock-funnel-bar">
                    <i style={{ width: `${w}%`, background: String(color) }} />
                  </div>
                  <em>{w}%</em>
                </div>
              ))}
            </div>
          </div>
          <div className="pmock-panel">
            <h4>Region breakdown</h4>
            <div className="pmock-region-row">
              {[
                ["Nordics", "34%"],
                ["DACH", "22%"],
                ["UK", "18%"],
                ["US", "16%"],
                ["Other", "10%"],
              ].map(([r, p]) => (
                <div key={r} className="pmock-region">
                  <b>{p}</b>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </Frame>
  );
}

function NordpulseOrders() {
  const orders = [
    ["#4821", "Helix Ltd", "$1,240", "Paid", "Aug 10"],
    ["#4820", "Orbit Co", "$680", "Pending", "Aug 10"],
    ["#4819", "Nimbus", "$2,110", "Shipped", "Aug 9"],
    ["#4818", "Cedar", "$420", "Refund", "Aug 9"],
    ["#4817", "Folio", "$990", "Paid", "Aug 8"],
    ["#4816", "Apex", "$310", "Pending", "Aug 8"],
  ];
  return (
    <Frame brand="NordPulse" url="app.nordpulse.io / orders" tone="crm">
      <div className="pmock-crm">
        <aside className="pmock-crm-side">
          <strong className="pmock-crm-logo">NP</strong>
          <nav>
            <span>Dashboard</span>
            <span>Users</span>
            <span>Products</span>
            <span className="is-on">Orders</span>
            <span>Analytics</span>
          </nav>
        </aside>
        <main className="pmock-crm-main">
          <header className="pmock-crm-head">
            <div>
              <h3>Orders</h3>
              <p>Today · $5,750 total</p>
            </div>
            <div className="pmock-totals">
              <span>
                Paid <b>$4,340</b>
              </span>
              <span>
                Pending <b>$990</b>
              </span>
            </div>
          </header>
          <div className="pmock-panel pmock-panel--table">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(([id, client, total, status, date]) => (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{client}</td>
                    <td>{total}</td>
                    <td>
                      <span
                        className={`pmock-pill pmock-pill--${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="pmock-muted">{date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </Frame>
  );
}

/* ─── GreenBasket grocery ─── */

function VegShape({ variant }: { variant: "leaf" | "carrot" | "apple" | "berry" }) {
  return <span className={`pmock-veg pmock-veg--${variant}`} aria-hidden />;
}

function GreenbasketHome() {
  return (
    <Frame brand="GreenBasket" url="greenbasket.shop" tone="grocery">
      <div className="pmock-gb">
        <header className="pmock-gb-nav">
          <strong>GreenBasket</strong>
          <nav>
            <span>Shop</span>
            <span>Recipes</span>
            <span>Deals</span>
          </nav>
          <span className="pmock-cart-badge">
            Cart <i>3</i>
          </span>
        </header>
        <section className="pmock-gb-hero">
          <div className="pmock-gb-hero-copy">
            <h3>Farm-fresh delivery</h3>
            <p>Seasonal produce to your door by noon.</p>
            <button type="button" className="pmock-btn pmock-btn--green">
              Shop produce
            </button>
          </div>
          <div className="pmock-gb-banner" aria-hidden>
            <VegShape variant="leaf" />
            <VegShape variant="carrot" />
            <VegShape variant="apple" />
            <VegShape variant="berry" />
          </div>
        </section>
        <div className="pmock-chips">
          {["Vegetables", "Fruit", "Dairy", "Bakery", "Pantry"].map((c, i) => (
            <span key={c} className={i === 0 ? "is-on" : undefined}>
              {c}
            </span>
          ))}
        </div>
        <div className="pmock-gb-cards">
          {[
            ["Organic kale", "$3.20", "leaf"],
            ["Heirloom tomato", "$4.50", "apple"],
            ["Carrot bunch", "$2.10", "carrot"],
            ["Blueberries", "$5.80", "berry"],
          ].map(([name, price, v]) => (
            <div key={name} className="pmock-gb-card">
              <div className="pmock-gb-card-art">
                <VegShape variant={v as "leaf" | "carrot" | "apple" | "berry"} />
              </div>
              <b>{name}</b>
              <span>{price}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function GreenbasketCatalog() {
  const items = [
    ["Baby spinach", "200g", "$2.90"],
    ["Avocado", "1 pc", "$1.80"],
    ["Cherry tomato", "250g", "$3.40"],
    ["Cucumber", "1 pc", "$1.20"],
    ["Bell pepper", "2 pc", "$2.60"],
    ["Broccoli", "400g", "$2.40"],
  ];
  return (
    <Frame brand="GreenBasket" url="greenbasket.shop / catalog" tone="grocery">
      <div className="pmock-gb pmock-gb--split">
        <aside className="pmock-gb-filters">
          <h4>Filters</h4>
          {["Organic", "Local", "On sale", "Under $3"].map((f, i) => (
            <label key={f}>
              <i className={i < 2 ? "is-on" : undefined} />
              {f}
            </label>
          ))}
          <h4>Category</h4>
          {["All", "Leafy", "Root", "Fruit"].map((c, i) => (
            <span key={c} className={i === 0 ? "is-on" : undefined}>
              {c}
            </span>
          ))}
        </aside>
        <div className="pmock-gb-grid">
          {items.map(([name, w, price]) => (
            <div key={name} className="pmock-gb-item">
              <div className="pmock-gb-item-art">
                <VegShape variant="leaf" />
              </div>
              <b>{name}</b>
              <em>{w}</em>
              <div className="pmock-gb-item-row">
                <strong>{price}</strong>
                <button type="button" className="pmock-btn pmock-btn--green pmock-btn--sm">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function GreenbasketPdp() {
  return (
    <Frame brand="GreenBasket" url="greenbasket.shop / kale" tone="grocery">
      <div className="pmock-gb pmock-gb--pdp">
        <div className="pmock-gb-pdp-art">
          <VegShape variant="leaf" />
          <VegShape variant="leaf" />
        </div>
        <div className="pmock-gb-pdp-info">
          <span className="pmock-tag-green">Organic</span>
          <h3>Organic kale</h3>
          <p>Crisp curly leaves · washed & ready · 200g bag</p>
          <strong className="pmock-price">$3.20</strong>
          <div className="pmock-nutrition">
            {[
              ["Cal", "35"],
              ["Protein", "2g"],
              ["Fiber", "2g"],
              ["Vit K", "80%"],
            ].map(([k, v]) => (
              <div key={k}>
                <b>{v}</b>
                <span>{k}</span>
              </div>
            ))}
          </div>
          <button type="button" className="pmock-btn pmock-btn--green">
            Add to cart
          </button>
        </div>
      </div>
    </Frame>
  );
}

function GreenbasketCart() {
  const lines = [
    ["Organic kale", "200g", "$3.20", 1],
    ["Blueberries", "125g", "$5.80", 2],
    ["Sourdough", "1 loaf", "$4.10", 1],
  ] as const;
  return (
    <Frame brand="GreenBasket" url="greenbasket.shop / cart" tone="grocery">
      <div className="pmock-gb pmock-gb--cart">
        <h3>Your basket</h3>
        <div className="pmock-cart-lines">
          {lines.map(([name, w, price, qty]) => (
            <div key={name} className="pmock-cart-line">
              <div className="pmock-gb-item-art pmock-gb-item-art--sm">
                <VegShape variant="apple" />
              </div>
              <div>
                <b>{name}</b>
                <em>{w}</em>
              </div>
              <div className="pmock-stepper">
                <button type="button">−</button>
                <span>{qty}</span>
                <button type="button">+</button>
              </div>
              <strong>{price}</strong>
            </div>
          ))}
        </div>
        <aside className="pmock-summary">
          <div>
            <span>Subtotal</span>
            <b>$18.90</b>
          </div>
          <div>
            <span>Delivery</span>
            <b>$2.50</b>
          </div>
          <div className="pmock-summary-total">
            <span>Total</span>
            <b>$21.40</b>
          </div>
          <button type="button" className="pmock-btn pmock-btn--green">
            Checkout
          </button>
        </aside>
      </div>
    </Frame>
  );
}

function GreenbasketCheckout() {
  return (
    <Frame brand="GreenBasket" url="greenbasket.shop / checkout" tone="grocery">
      <div className="pmock-gb pmock-gb--checkout">
        <div className="pmock-form">
          <h3>Delivery</h3>
          <label>
            Address
            <input readOnly value="14 Meadow Lane" />
          </label>
          <div className="pmock-form-row">
            <label>
              City
              <input readOnly value="Helsinki" />
            </label>
            <label>
              Slot
              <input readOnly value="Today 11–13" />
            </label>
          </div>
          <h3>Payment</h3>
          <div className="pmock-pay-opts">
            <span className="is-on">Card</span>
            <span>Invoice</span>
            <span>Wallet</span>
          </div>
          <label>
            Card number
            <input readOnly value="•••• •••• •••• 4242" />
          </label>
        </div>
        <aside className="pmock-summary">
          <h4>Order</h4>
          <div>
            <span>3 items</span>
            <b>$18.90</b>
          </div>
          <div>
            <span>Delivery</span>
            <b>$2.50</b>
          </div>
          <div className="pmock-summary-total">
            <span>Pay</span>
            <b>$21.40</b>
          </div>
          <button type="button" className="pmock-btn pmock-btn--green">
            Place order
          </button>
        </aside>
      </div>
    </Frame>
  );
}

/* ─── ToyBox kids ─── */

function ToyShape({ variant }: { variant: "bear" | "rocket" | "blocks" | "ball" }) {
  return <span className={`pmock-toy pmock-toy--${variant}`} aria-hidden />;
}

function ToyboxHome() {
  return (
    <Frame brand="ToyBox" url="play.toybox.kids" tone="kids">
      <div className="pmock-tb">
        <header className="pmock-tb-nav">
          <strong className="pmock-tb-logo">ToyBox</strong>
          <nav>
            <span>Shop</span>
            <span>Ages</span>
            <span>Gifts</span>
          </nav>
          <span className="pmock-tb-badge">2</span>
        </header>
        <section className="pmock-tb-hero">
          <div>
            <h3>Big fun, tiny prices</h3>
            <p>Toys picked by kids, packed with joy.</p>
            <button type="button" className="pmock-btn pmock-btn--orange">
              Start playing
            </button>
          </div>
          <div className="pmock-tb-hero-art">
            <ToyShape variant="bear" />
            <ToyShape variant="rocket" />
          </div>
        </section>
        <div className="pmock-age-row">
          {["0–2", "3–5", "6–8", "9+"].map((a, i) => (
            <span key={a} className={i === 1 ? "is-on" : undefined}>
              Ages {a}
            </span>
          ))}
        </div>
        <div className="pmock-tb-grid">
          {[
            ["Soft bear", "$18", "bear"],
            ["Space rocket", "$24", "rocket"],
            ["Color blocks", "$15", "blocks"],
            ["Bounce ball", "$9", "ball"],
          ].map(([name, price, v]) => (
            <div key={name} className="pmock-tb-card">
              <div className="pmock-tb-card-art">
                <ToyShape variant={v as "bear" | "rocket" | "blocks" | "ball"} />
              </div>
              <b>{name}</b>
              <span>{price}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ToyboxShop() {
  const toys = [
    ["Rainbow stack", "$16", "blocks", "#fde68a"],
    ["Teddy hug", "$22", "bear", "#fecdd3"],
    ["Zoom rocket", "$28", "rocket", "#bfdbfe"],
    ["Happy ball", "$8", "ball", "#bbf7d0"],
    ["Puzzle zoo", "$19", "blocks", "#fbcfe8"],
    ["Night owl", "$21", "bear", "#ddd6fe"],
  ] as const;
  return (
    <Frame brand="ToyBox" url="play.toybox.kids / shop" tone="kids">
      <div className="pmock-tb">
        <header className="pmock-tb-nav">
          <strong className="pmock-tb-logo">ToyBox</strong>
          <span className="pmock-tb-title">All toys</span>
        </header>
        <div className="pmock-tb-grid pmock-tb-grid--shop">
          {toys.map(([name, price, v, bg]) => (
            <div key={name} className="pmock-tb-card" style={{ background: bg }}>
              <div className="pmock-tb-card-art">
                <ToyShape variant={v} />
              </div>
              <b>{name}</b>
              <span>{price}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ToyboxPdp() {
  return (
    <Frame brand="ToyBox" url="play.toybox.kids / rocket" tone="kids">
      <div className="pmock-tb pmock-tb--pdp">
        <div className="pmock-tb-pdp-art">
          <ToyShape variant="rocket" />
        </div>
        <div className="pmock-tb-pdp-info">
          <span className="pmock-age-badge">Ages 3–5</span>
          <h3>Zoom rocket</h3>
          <p>Soft foam rocket with launch pad — indoor-safe thrills.</p>
          <strong className="pmock-price">$28</strong>
          <div className="pmock-swatches">
            <i style={{ background: "#f97316" }} />
            <i style={{ background: "#ec4899" }} />
            <i style={{ background: "#3b82f6" }} />
          </div>
          <button type="button" className="pmock-btn pmock-btn--orange">
            Add to cart
          </button>
        </div>
      </div>
    </Frame>
  );
}

function ToyboxCart() {
  return (
    <Frame brand="ToyBox" url="play.toybox.kids / cart" tone="kids">
      <div className="pmock-tb pmock-tb--cart">
        <h3>Cart</h3>
        <div className="pmock-cart-lines">
          {[
            ["Zoom rocket", "$28", 1],
            ["Soft bear", "$18", 1],
          ].map(([name, price, qty]) => (
            <div key={String(name)} className="pmock-cart-line pmock-cart-line--kids">
              <div className="pmock-tb-card-art pmock-tb-card-art--sm">
                <ToyShape variant="rocket" />
              </div>
              <div>
                <b>{name}</b>
                <em>Qty {qty}</em>
              </div>
              <strong>{price}</strong>
            </div>
          ))}
        </div>
        <label className="pmock-gift">
          <i className="is-on" />
          Gift wrap (+$3) — bright paper & bow
        </label>
        <aside className="pmock-summary pmock-summary--kids">
          <div className="pmock-summary-total">
            <span>Total</span>
            <b>$49</b>
          </div>
          <button type="button" className="pmock-btn pmock-btn--orange">
            Checkout
          </button>
        </aside>
      </div>
    </Frame>
  );
}

function ToyboxAccount() {
  return (
    <Frame brand="ToyBox" url="play.toybox.kids / account" tone="kids">
      <div className="pmock-tb pmock-tb--account">
        <h3>Kid profiles</h3>
        <div className="pmock-profiles">
          {[
            ["Mia", "#f9a8d4", "Ages 3–5"],
            ["Leo", "#93c5fd", "Ages 6–8"],
          ].map(([name, col, age]) => (
            <div key={name} className="pmock-profile">
              <Avatar initials={name.slice(0, 1)} color={col} />
              <div>
                <b>{name}</b>
                <span>{age}</span>
              </div>
            </div>
          ))}
          <div className="pmock-profile pmock-profile--add">+ Add kid</div>
        </div>
        <h4>Wishlist</h4>
        <div className="pmock-tb-grid pmock-tb-grid--wish">
          {[
            ["Color blocks", "blocks"],
            ["Bounce ball", "ball"],
            ["Teddy hug", "bear"],
          ].map(([name, v]) => (
            <div key={name} className="pmock-tb-card">
              <div className="pmock-tb-card-art">
                <ToyShape variant={v as "blocks" | "ball" | "bear"} />
              </div>
              <b>{name}</b>
              <span className="pmock-heart" />
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

const MOCKS: Record<MockId, () => ReactNode> = {
  "nordpulse-dash": NordpulseDash,
  "nordpulse-users": NordpulseUsers,
  "nordpulse-products": NordpulseProducts,
  "nordpulse-analytics": NordpulseAnalytics,
  "nordpulse-orders": NordpulseOrders,
  "greenbasket-home": GreenbasketHome,
  "greenbasket-catalog": GreenbasketCatalog,
  "greenbasket-pdp": GreenbasketPdp,
  "greenbasket-cart": GreenbasketCart,
  "greenbasket-checkout": GreenbasketCheckout,
  "toybox-home": ToyboxHome,
  "toybox-shop": ToyboxShop,
  "toybox-pdp": ToyboxPdp,
  "toybox-cart": ToyboxCart,
  "toybox-account": ToyboxAccount,
};

export function PortfolioMock({ id }: MockProps) {
  const Comp = isMockId(id) ? MOCKS[id] : null;
  return (
    <>
      <style>{PMOCK_CSS}</style>
      {Comp ? (
        Comp()
      ) : (
        <div className="pmock pmock--missing">
          <p>Unknown mock: {id}</p>
        </div>
      )}
    </>
  );
}

const PMOCK_CSS = `
.pmock {
  --pmock-font: "Segoe UI", system-ui, sans-serif;
  width: 100%;
  aspect-ratio: 16 / 10;
  min-height: 320px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #d8d8d8;
  background: #fff;
  font-family: var(--pmock-font);
  font-size: 11px;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 0 rgba(0,0,0,.04);
}
.pmock--missing {
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  color: #64748b;
}
.pmock-chrome {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}
.pmock--kids .pmock-chrome {
  background: #fff7ed;
  border-bottom-color: #fed7aa;
}
.pmock--grocery .pmock-chrome {
  background: #f0fdf4;
  border-bottom-color: #bbf7d0;
}
.pmock-dots { display: flex; gap: 4px; }
.pmock-dots i {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #cbd5e1;
}
.pmock-dots i:nth-child(1) { background: #f87171; }
.pmock-dots i:nth-child(2) { background: #fbbf24; }
.pmock-dots i:nth-child(3) { background: #4ade80; }
.pmock-url {
  flex: 1;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 3px 8px;
  color: #64748b;
  font-size: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pmock-brand {
  font-weight: 700;
  font-size: 10px;
  color: #334155;
}
.pmock-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.pmock-btn {
  appearance: none;
  border: 0;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 650;
  cursor: default;
  color: #fff;
}
.pmock-btn--sm { padding: 3px 8px; font-size: 10px; }
.pmock-btn--blue { background: #2563eb; }
.pmock-btn--green { background: #16a34a; }
.pmock-btn--orange { background: #f97316; }
.pmock-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
}

/* CRM */
.pmock-crm {
  display: grid;
  grid-template-columns: 112px 1fr;
  height: 100%;
  background: #f8fafc;
}
.pmock-crm-side {
  background: #1e293b;
  color: #e2e8f0;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.pmock-crm-logo {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #2563eb;
  display: grid;
  place-items: center;
  font-size: 11px;
}
.pmock-crm-side nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pmock-crm-side nav span {
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 10px;
  color: #94a3b8;
}
.pmock-crm-side nav span.is-on {
  background: #334155;
  color: #fff;
  font-weight: 600;
}
.pmock-crm-main {
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}
.pmock-crm-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.pmock-crm-head h3 { margin: 0; font-size: 13px; }
.pmock-crm-head p { margin: 2px 0 0; color: #64748b; font-size: 10px; }
.pmock-kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.pmock-kpi {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.pmock-kpi span { color: #64748b; font-size: 9px; }
.pmock-kpi b { font-size: 14px; }
.pmock-kpi em { font-style: normal; color: #16a34a; font-size: 9px; font-weight: 600; }
.pmock-crm-split {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 6px;
  min-height: 0;
  flex: 1;
}
.pmock-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  min-width: 0;
}
.pmock-panel h4 {
  margin: 0 0 6px;
  font-size: 10px;
  color: #475569;
  font-weight: 650;
}
.pmock-chart { width: 100%; height: auto; display: block; }
.pmock-panel--table { overflow: hidden; }
.pmock-panel table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}
.pmock-panel th {
  text-align: left;
  color: #94a3b8;
  font-weight: 600;
  padding: 3px 4px;
  border-bottom: 1px solid #e2e8f0;
}
.pmock-panel td {
  padding: 5px 4px;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.pmock-user-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pmock-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  align-items: center;
}
.pmock-filters span,
.pmock-pay-opts span,
.pmock-chips span,
.pmock-age-row span,
.pmock-gb-filters > span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e2e8f0;
  font-size: 10px;
  color: #475569;
}
.pmock-filters span.is-on,
.pmock-pay-opts span.is-on,
.pmock-chips span.is-on,
.pmock-age-row span.is-on,
.pmock-gb-filters > span.is-on {
  background: #dbeafe;
  border-color: #93c5fd;
  color: #1d4ed8;
  font-weight: 650;
}
.pmock-filters input,
.pmock-form input {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 10px;
  background: #fff;
  color: #64748b;
  min-width: 0;
}
.pmock-filters input { margin-left: auto; width: 120px; }
.pmock-pill {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 650;
  background: #e2e8f0;
  color: #334155;
}
.pmock-pill--paid, .pmock-pill--active, .pmock-pill--shipped {
  background: #dcfce7; color: #166534;
}
.pmock-pill--pending, .pmock-pill--invited {
  background: #fef9c3; color: #854d0e;
}
.pmock-pill--refund, .pmock-pill--suspended {
  background: #fee2e2; color: #991b1b;
}
.pmock-muted { color: #94a3b8; }
.pmock-pager {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  font-size: 10px;
}
.pmock-pager div { display: flex; gap: 3px; }
.pmock-pager button {
  appearance: none;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 5px;
  width: 22px;
  height: 22px;
  font-size: 10px;
  color: #475569;
}
.pmock-pager button.is-on {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.pmock-prod-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.pmock-prod-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px;
  display: grid;
  gap: 4px;
}
.pmock-prod-card b { font-size: 11px; }
.pmock-prod-card span, .pmock-prod-card em {
  font-size: 9px;
  color: #64748b;
  font-style: normal;
}
.pmock-prod-thumb {
  height: 36px;
  border-radius: 6px;
  background: linear-gradient(135deg, #dbeafe, #e2e8f0);
}
.pmock-stock {
  height: 5px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}
.pmock-stock i {
  display: block;
  height: 100%;
  background: #2563eb;
  border-radius: inherit;
}
.pmock-funnel-row {
  display: grid;
  grid-template-columns: 52px 1fr 28px;
  gap: 6px;
  align-items: center;
  margin-bottom: 5px;
  font-size: 10px;
}
.pmock-funnel-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}
.pmock-funnel-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
}
.pmock-region-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}
.pmock-region {
  background: #f8fafc;
  border-radius: 6px;
  padding: 6px 4px;
  text-align: center;
}
.pmock-region b { display: block; font-size: 12px; color: #2563eb; }
.pmock-region span { font-size: 9px; color: #64748b; }
.pmock-totals {
  display: flex;
  gap: 10px;
  font-size: 10px;
  color: #64748b;
}
.pmock-totals b { color: #0f172a; }

/* Grocery */
.pmock-gb {
  height: 100%;
  background: #fff;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.pmock-gb-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pmock-gb-nav strong {
  color: #15803d;
  font-size: 13px;
}
.pmock-gb-nav nav {
  display: flex;
  gap: 10px;
  color: #4b5563;
  font-size: 11px;
}
.pmock-cart-badge {
  margin-left: auto;
  background: #dcfce7;
  color: #166534;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: 650;
  font-size: 10px;
  display: inline-flex;
  gap: 5px;
  align-items: center;
}
.pmock-cart-badge i {
  background: #16a34a;
  color: #fff;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-style: normal;
  font-size: 9px;
}
.pmock-gb-hero {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 8px;
  background: linear-gradient(120deg, #ecfdf5, #f0fdf4 55%, #dcfce7);
  border-radius: 10px;
  padding: 12px;
  min-height: 96px;
}
.pmock-gb-hero-copy h3 { margin: 0; font-size: 15px; color: #14532d; }
.pmock-gb-hero-copy p { margin: 4px 0 8px; color: #3f6212; font-size: 11px; }
.pmock-gb-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.pmock-veg {
  display: block;
  position: relative;
}
.pmock-veg--leaf {
  width: 28px;
  height: 36px;
  background: #22c55e;
  border-radius: 60% 60% 45% 45%;
  transform: rotate(-18deg);
  box-shadow: 10px 4px 0 #86efac;
}
.pmock-veg--carrot {
  width: 14px;
  height: 34px;
  background: #f97316;
  border-radius: 8px 8px 12px 12px;
  box-shadow: 0 -8px 0 -2px #4ade80;
}
.pmock-veg--apple {
  width: 28px;
  height: 28px;
  background: #ef4444;
  border-radius: 50% 50% 45% 45%;
  box-shadow: inset -4px -2px 0 #b91c1c;
}
.pmock-veg--apple::before {
  content: "";
  position: absolute;
  top: -5px;
  left: 12px;
  width: 3px;
  height: 8px;
  background: #854d0e;
  border-radius: 2px;
}
.pmock-veg--berry {
  width: 22px;
  height: 22px;
  background: #6366f1;
  border-radius: 50%;
  box-shadow: 10px 6px 0 #818cf8, -8px 8px 0 #a5b4fc;
}
.pmock-chips { display: flex; gap: 5px; flex-wrap: wrap; }
.pmock-chips span.is-on {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}
.pmock-gb-cards, .pmock-gb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.pmock-gb-card, .pmock-gb-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.pmock-gb-card-art, .pmock-gb-item-art, .pmock-gb-pdp-art {
  height: 48px;
  border-radius: 6px;
  background: #f0fdf4;
  display: grid;
  place-items: center;
}
.pmock-gb-item-art--sm { width: 36px; height: 36px; flex-shrink: 0; }
.pmock-gb-card b, .pmock-gb-item b { font-size: 11px; }
.pmock-gb-card span, .pmock-gb-item em {
  color: #6b7280;
  font-size: 10px;
  font-style: normal;
}
.pmock-gb--split {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 8px;
  padding: 8px;
}
.pmock-gb-filters {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.pmock-gb-filters h4 {
  margin: 4px 0 0;
  font-size: 10px;
  color: #374151;
}
.pmock-gb-filters label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #4b5563;
}
.pmock-gb-filters label i,
.pmock-gift i {
  width: 12px;
  height: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 3px;
  background: #fff;
  display: inline-block;
}
.pmock-gb-filters label i.is-on,
.pmock-gift i.is-on {
  background: #16a34a;
  border-color: #16a34a;
  box-shadow: inset 0 0 0 2px #fff;
}
.pmock-gb-grid { grid-template-columns: repeat(3, 1fr); }
.pmock-gb-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
}
.pmock-gb--pdp {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 12px;
  padding: 12px;
}
.pmock-gb-pdp-art {
  height: 100%;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(160deg, #ecfdf5, #dcfce7);
}
.pmock-gb-pdp-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}
.pmock-gb-pdp-info h3 { margin: 0; font-size: 18px; color: #14532d; }
.pmock-gb-pdp-info p { margin: 0; color: #4b5563; }
.pmock-tag-green {
  align-self: flex-start;
  background: #dcfce7;
  color: #166534;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 650;
}
.pmock-price { font-size: 20px; color: #111; }
.pmock-nutrition {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: #f0fdf4;
  border-radius: 8px;
  padding: 8px;
}
.pmock-nutrition div { text-align: center; }
.pmock-nutrition b { display: block; font-size: 12px; color: #15803d; }
.pmock-nutrition span { font-size: 9px; color: #6b7280; }
.pmock-gb--cart, .pmock-gb--checkout {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 10px;
  align-items: start;
}
.pmock-gb--cart h3, .pmock-gb--checkout h3, .pmock-tb--cart h3, .pmock-tb--account h3 {
  margin: 0 0 6px;
  font-size: 14px;
  grid-column: 1 / -1;
}
.pmock-cart-lines { display: flex; flex-direction: column; gap: 6px; }
.pmock-cart-line {
  display: grid;
  grid-template-columns: 36px 1fr auto auto;
  gap: 8px;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 8px;
  background: #fff;
}
.pmock-cart-line b { display: block; font-size: 11px; }
.pmock-cart-line em { font-style: normal; font-size: 9px; color: #6b7280; }
.pmock-stepper {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 2px;
}
.pmock-stepper button {
  appearance: none;
  border: 0;
  background: #f3f4f6;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  font-size: 11px;
}
.pmock-stepper span { min-width: 12px; text-align: center; font-weight: 650; }
.pmock-summary {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.pmock-summary h4 { margin: 0; font-size: 11px; }
.pmock-summary > div {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #4b5563;
}
.pmock-summary-total {
  border-top: 1px solid #e5e7eb;
  padding-top: 7px;
  font-size: 13px !important;
  color: #111 !important;
}
.pmock-form {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pmock-form label {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 10px;
  color: #4b5563;
}
.pmock-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.pmock-pay-opts { display: flex; gap: 5px; }
.pmock-pay-opts span.is-on {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

/* Kids / ToyBox */
.pmock-tb {
  height: 100%;
  background: linear-gradient(180deg, #fff7ed, #fff);
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.pmock-tb-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pmock-tb-logo {
  font-size: 15px;
  color: #ea580c;
  letter-spacing: -0.02em;
  transform: rotate(-2deg);
}
.pmock-tb-nav nav {
  display: flex;
  gap: 8px;
  font-size: 11px;
  font-weight: 650;
  color: #9a3412;
}
.pmock-tb-badge {
  margin-left: auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #f472b6;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 11px;
}
.pmock-tb-title {
  font-weight: 700;
  color: #9a3412;
  font-size: 12px;
}
.pmock-tb-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: linear-gradient(135deg, #fdba74, #f9a8d4 55%, #fde68a);
  border-radius: 14px;
  padding: 12px 14px;
  min-height: 100px;
  color: #7c2d12;
}
.pmock-tb-hero h3 { margin: 0; font-size: 16px; }
.pmock-tb-hero p { margin: 4px 0 8px; font-size: 11px; }
.pmock-tb-hero-art {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.pmock-toy { display: block; position: relative; }
.pmock-toy--bear {
  width: 34px;
  height: 30px;
  background: #d6a07a;
  border-radius: 40% 40% 35% 35%;
  box-shadow: -12px -10px 0 -6px #d6a07a, 12px -10px 0 -6px #d6a07a;
}
.pmock-toy--rocket {
  width: 18px;
  height: 40px;
  background: #f97316;
  border-radius: 50% 50% 8px 8px;
  box-shadow: 0 12px 0 -6px #fbbf24, -10px 18px 0 -8px #60a5fa, 10px 18px 0 -8px #60a5fa;
}
.pmock-toy--blocks {
  width: 28px;
  height: 28px;
  background: #facc15;
  border-radius: 4px;
  box-shadow: 10px -8px 0 #f472b6, -8px 8px 0 #60a5fa;
}
.pmock-toy--ball {
  width: 28px;
  height: 28px;
  background: radial-gradient(circle at 30% 30%, #fda4af, #fb7185);
  border-radius: 50%;
  box-shadow: inset -4px -4px 0 rgba(0,0,0,.08);
}
.pmock-age-row { display: flex; gap: 5px; flex-wrap: wrap; }
.pmock-age-row span {
  background: #fff;
  border: 2px solid #fdba74;
  color: #9a3412;
  font-weight: 650;
}
.pmock-age-row span.is-on {
  background: #fb923c;
  border-color: #ea580c;
  color: #fff;
}
.pmock-tb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.pmock-tb-grid--shop { grid-template-columns: repeat(3, 1fr); }
.pmock-tb-grid--wish { grid-template-columns: repeat(3, 1fr); }
.pmock-tb-card {
  background: #fff;
  border: 2px solid #fed7aa;
  border-radius: 12px;
  padding: 7px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: center;
}
.pmock-tb-card-art {
  height: 52px;
  border-radius: 10px;
  background: #fff7ed;
  display: grid;
  place-items: center;
}
.pmock-tb-card-art--sm { width: 40px; height: 40px; }
.pmock-tb-card b { font-size: 11px; color: #7c2d12; }
.pmock-tb-card span { font-size: 11px; font-weight: 700; color: #ea580c; }
.pmock-tb--pdp {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 12px;
  padding: 12px;
}
.pmock-tb-pdp-art {
  background: linear-gradient(160deg, #fdba74, #f9a8d4);
  border-radius: 16px;
  display: grid;
  place-items: center;
  min-height: 180px;
}
.pmock-tb-pdp-art .pmock-toy { transform: scale(1.8); }
.pmock-tb-pdp-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}
.pmock-tb-pdp-info h3 { margin: 0; font-size: 18px; color: #9a3412; }
.pmock-tb-pdp-info p { margin: 0; color: #78716c; }
.pmock-age-badge {
  align-self: flex-start;
  background: #f472b6;
  color: #fff;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
}
.pmock-swatches { display: flex; gap: 6px; }
.pmock-swatches i {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #e7e5e4;
}
.pmock-tb--cart {
  display: flex;
  flex-direction: column;
}
.pmock-cart-line--kids {
  grid-template-columns: 40px 1fr auto;
  border-color: #fed7aa;
  background: #fffbeb;
}
.pmock-gift {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #9a3412;
  font-weight: 600;
  background: #fce7f3;
  border-radius: 8px;
  padding: 8px;
}
.pmock-gift i.is-on {
  background: #f472b6;
  border-color: #db2777;
}
.pmock-summary--kids {
  background: #fff7ed;
  border-color: #fdba74;
}
.pmock-tb--account h4 {
  margin: 4px 0 0;
  font-size: 12px;
  color: #9a3412;
}
.pmock-profiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.pmock-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 2px solid #fbcfe8;
  border-radius: 12px;
  padding: 8px;
}
.pmock-profile b { display: block; font-size: 12px; color: #9d174d; }
.pmock-profile span { font-size: 10px; color: #a8a29e; }
.pmock-profile--add {
  justify-content: center;
  color: #c2410c;
  font-weight: 700;
  border-style: dashed;
  border-color: #fdba74;
  background: #fff7ed;
}
.pmock-heart {
  width: 10px;
  height: 10px;
  margin: 2px auto 0;
  background: #f472b6;
  transform: rotate(45deg);
  display: block;
  position: relative;
}
.pmock-heart::before,
.pmock-heart::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  background: #f472b6;
  border-radius: 50%;
}
.pmock-heart::before { left: -5px; top: 0; }
.pmock-heart::after { left: 0; top: -5px; }
`;

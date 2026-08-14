import {
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useState,
} from "react";
import { GreenBasketSite } from "./GreenBasketSite";
import { KilnAtelierSite } from "./KilnAtelierSite";
import { MochalkiSite } from "./MochalkiSite";
import { NordPulseSite } from "./NordPulseSite";
import { ShikhovoSite } from "./ShikhovoSite";
import { VesperSite } from "./VesperSite";
import { photos } from "./photos";

export type LivingMode = "full" | "thumb";

type Locale = "en" | "ru";

type PageDef = { id: string; label: string };

type SiteCopyBlock = {
  brand: string;
  host: string;
  pages: PageDef[];
  homeId: string;
  headlines: Record<string, string>;
  leads: Record<string, string>;
  ctas: Record<string, string>;
  extras: Record<string, string>;
};

const COPY: Record<Locale, Record<string, SiteCopyBlock>> = {
  en: {
    "aurora-flute": {
      brand: "AURORA",
      host: "aurora.finance",
      homeId: "home",
      pages: [
        { id: "home", label: "Home" },
        { id: "product", label: "Product" },
        { id: "security", label: "Security" },
        { id: "pricing", label: "Pricing" },
        { id: "about", label: "About" },
      ],
      headlines: {
        home: "Clarity for every transfer.",
        product: "One surface for private wealth.",
        security: "Glass walls. Steel locks.",
        pricing: "Plans that stay quiet.",
        about: "Built by operators, not hype.",
      },
      leads: {
        home: "Premium finance with fluted glass panels, soft refraction, and CTAs that feel inevitable.",
        product: "Transfers, vaults, and yield in a single control language — refraction tokens shared across every panel.",
        security: "Hardware-backed keys, dual approval, and audit trails you can actually read.",
        pricing: "Private banking economics without the marble lobby. Start lean, scale when the desk does.",
        about: "A twelve-person studio shipping surfaces for family offices and boutique banks.",
      },
      ctas: {
        primary: "Open account",
        secondary: "See security",
        pricing: "Talk to sales",
        about: "Meet the team",
      },
      extras: {
        kicker: "Private banking · redesigned",
        stat1: "AUM tracked",
        stat2: "Avg. settle",
        stat3: "Uptime",
        plan1: "Desk",
        plan2: "House",
        plan3: "Atelier",
        person1: "Mira Chen · Design",
        person2: "Owen Blake · Product",
        person3: "Sofia Reyes · Security",
      },
    },
    "mirage-deck": {
      brand: "MIRAGE",
      host: "mirage.market",
      homeId: "drop",
      pages: [
        { id: "drop", label: "Drop" },
        { id: "market", label: "Market" },
        { id: "vault", label: "Vault" },
        { id: "about", label: "About" },
      ],
      headlines: {
        drop: "Cards that feel physical.",
        market: "Floor price, not floor noise.",
        vault: "Your collection, sealed.",
        about: "Season craft, not spam drops.",
      },
      leads: {
        drop: "Iridescent collectibles with tilt sheen, reveal moments, and a marketplace that stays cinematic.",
        market: "Live listings with foil grades and last-sale stamps — built for share crops.",
        vault: "Cold storage for mythics, soft glow for commons. Everything tilts under the cursor.",
        about: "Mirage is a season studio — four decks a year, no filler rarities.",
      },
      ctas: {
        primary: "Open pack",
        secondary: "View vault",
        market: "Place bid",
        about: "Join discord",
      },
      extras: {
        kicker: "Season 04 · limited deck",
        card1: "Obsidian Wing",
        card2: "Glass Mirage",
        card3: "Void Seal",
        card4: "Neon Lattice",
        rarity1: "Rare",
        rarity2: "Epic",
        rarity3: "Mythic",
        floor: "Floor · 2.4 ETH",
        owners: "1,842 owners",
      },
    },
    "prism-controls": {
      brand: "PRISM",
      host: "prism.app",
      homeId: "product",
      pages: [
        { id: "product", label: "Product" },
        { id: "states", label: "States" },
        { id: "customers", label: "Customers" },
        { id: "pricing", label: "Pricing" },
      ],
      headlines: {
        product: "Buttons that speak state.",
        states: "Idle → Hover → Armed → Done.",
        customers: "Teams that ship quieter UIs.",
        pricing: "One matrix. Every surface.",
      },
      leads: {
        product: "A SaaS control language — idle, hover, armed, confirmed — without noisy chrome.",
        states: "Click through the matrix. Armed and confirmed use light, not extra labels.",
        customers: "Product orgs that share one token file between Figma and production.",
        pricing: "Start free on marketing surfaces. Scale into app toolbars without a redesign.",
      },
      ctas: {
        primary: "Start free",
        secondary: "Book a demo",
        pricing: "Choose plan",
      },
      extras: {
        kicker: "Controls with memory",
        idle: "Idle",
        hover: "Hover",
        armed: "Armed",
        done: "Done",
        live: "Live state",
        cust1: "Northwind Labs",
        cust2: "Helix Ops",
        cust3: "Parcel Co",
        quote: "“Armed finally feels different from hover.” — Lena Park, Design Lead",
      },
    },
    northline: {
      brand: "NORTHLINE",
      host: "northline.studio",
      homeId: "journal",
      pages: [
        { id: "journal", label: "Journal" },
        { id: "study", label: "Study" },
        { id: "index", label: "Index" },
        { id: "about", label: "About" },
      ],
      headlines: {
        journal: "Research that reads like a journal.",
        study: "Holding the frame.",
        index: "Field notes, sorted.",
        about: "A studio of quiet grids.",
      },
      leads: {
        journal: "Editorial identity for a research studio — display type, hairline rules, quiet color.",
        study: "How constraint becomes a brand asset when every page shares one grid.",
        index: "Essays, studies, and marginalia from Vol. 01 through Vol. 12.",
        about: "Northline publishes field research for designers who still read longform.",
      },
      ctas: {
        primary: "Read the study",
        secondary: "Browse index",
        about: "Visit archive",
      },
      extras: {
        kicker: "Vol. 12 · Field notes",
        essay: "Essay",
        byline: "By Ada Morin · 14 min",
        date: "Mar 2026",
        studyLabel: "Study 08",
        index1: "Type as architecture",
        index2: "Margins that mean something",
        index3: "Print → web without loss",
      },
    },
    "folio-os": {
      brand: "FOLIO",
      host: "folio.os",
      homeId: "overview",
      pages: [
        { id: "overview", label: "Overview" },
        { id: "modules", label: "Modules" },
        { id: "security", label: "Security" },
        { id: "pricing", label: "Pricing" },
      ],
      headlines: {
        overview: "One token layer. Three products.",
        modules: "Composable UI that stays sharp.",
        security: "SSO, audit, and quiet compliance.",
        pricing: "Seats that scale with the desk.",
      },
      leads: {
        overview: "A B2B system that unifies skins without flattening character — tokens first, modules second.",
        modules: "Nav, tables, toasts, and inputs share interaction primitives across every product.",
        security: "Role-aware surfaces with exportable logs — built for handoff, not theater.",
        pricing: "Per-seat plans with shared tokens across Design, Ops, and Docs.",
      },
      ctas: {
        primary: "Request access",
        secondary: "See modules",
        pricing: "Start trial",
      },
      extras: {
        kicker: "Workspace OS",
        mod1: "Nav shell",
        mod2: "Data table",
        mod3: "Toast stack",
        mod4: "Input kit",
        seat1: "Studio · $29",
        seat2: "Team · $79",
        seat3: "Org · Custom",
      },
    },
    "kiln-identity": {
      brand: "KILN",
      host: "kiln.atelier",
      homeId: "home",
      pages: [
        { id: "home", label: "Home" },
        { id: "work", label: "Work" },
        { id: "process", label: "Process" },
        { id: "contact", label: "Contact" },
      ],
      headlines: {
        home: "Heat, copper, craft.",
        work: "Pieces from the shop floor.",
        process: "From billet to brand mark.",
        contact: "Commission a series.",
      },
      leads: {
        home: "Warm industrial identity for a workshop brand — the site continues the poster grid.",
        work: "Selected hardware, seals, and spatial marks for ateliers that still touch metal.",
        process: "Photography and type share the same margins as the print series.",
        contact: "Tell us about the surface. We reply within two studio days.",
      },
      ctas: {
        primary: "Commission",
        secondary: "Visit studio",
        contact: "Send brief",
      },
      extras: {
        kicker: "Hardware atelier",
        project1: "Copper seal series",
        project2: "Tool wall identity",
        project3: "Forge mark pack",
        step1: "Brief & material",
        step2: "Forge & proof",
        step3: "Stamp & ship",
        hours: "Tue–Sat · 10–18",
      },
    },
    "orbit-drop": {
      brand: "ORBIT",
      host: "orbit.atlas",
      homeId: "home",
      pages: [
        { id: "home", label: "Home" },
        { id: "story", label: "Story" },
        { id: "specs", label: "Specs" },
        { id: "access", label: "Access" },
      ],
      headlines: {
        home: "One frame. One surface.",
        story: "Built for the night launch.",
        specs: "Motion budgets, locked.",
        access: "Limited keys. No queue theater.",
      },
      leads: {
        home: "A high-craft launch page — cinematic hero, dual CTAs, metrics that stay out of the first-viewport noise.",
        story: "We started with a single composition and refused feature-card landfill below the fold.",
        specs: "Type, glow, and CTA hierarchy tuned as one system — measured on mid-tier laptops.",
        access: "Invite holders open first. Public waitlist follows when inventory clears.",
      },
      ctas: {
        primary: "Get access",
        secondary: "Watch reel",
        access: "Request key",
      },
      extras: {
        kicker: "Limited drop · 2026",
        metric1: "60fps hero",
        metric2: "12ms settle",
        metric3: "3 CTA states",
        spec1: "Display · Syne",
        spec2: "Body · Sora",
        spec3: "Glow · 18% mix",
      },
    },
    "signal-release": {
      brand: "SIGNAL",
      host: "signal.release",
      homeId: "chapters",
      pages: [
        { id: "chapters", label: "Chapters" },
        { id: "pulse", label: "Pulse" },
        { id: "frame", label: "Frame" },
        { id: "release", label: "Release" },
        { id: "waitlist", label: "Waitlist" },
      ],
      headlines: {
        chapters: "Scroll is the story.",
        pulse: "The problem we felt.",
        frame: "What we built.",
        release: "Why it converts.",
        waitlist: "Join before the drop.",
      },
      leads: {
        chapters: "A chaptered landing that explains a complex drop without a wall of cards.",
        pulse: "Noise everywhere. Signal needed a quieter path to understanding.",
        frame: "Five chapters, one rhythm — each section earns the next.",
        release: "Readers finish the story — then they ask for access.",
        waitlist: "One note when the release opens. No drip. No fake urgency.",
      },
      ctas: {
        primary: "Join waitlist",
        secondary: "Press kit",
        jump: "Jump to chapter",
      },
      extras: {
        kicker: "Release campaign",
        ch1: "01 · Pulse",
        ch2: "02 · Frame",
        ch3: "03 · Release",
        attendees: "2.4k at last preview",
        press: "Press kit · PDF",
      },
    },
    "vault-access": {
      brand: "VAULT",
      host: "vault.access",
      homeId: "invite",
      pages: [
        { id: "invite", label: "Invite" },
        { id: "members", label: "Members" },
        { id: "ritual", label: "Ritual" },
        { id: "faq", label: "FAQ" },
      ],
      headlines: {
        invite: "Access, earned.",
        members: "People already inside.",
        ritual: "How invitations work.",
        faq: "Quiet answers.",
      },
      leads: {
        invite: "A waitlist that feels like an invitation — quiet urgency, no fake timers.",
        members: "Founders, collectors, and editors who prefer letters over launches.",
        ritual: "Request → review → seal. One email when it matters.",
        faq: "Membership is invitation-led. We do not sell early access.",
      },
      ctas: {
        primary: "Request access",
        secondary: "Member notes",
        submit: "Submit",
        success: "You're on the list",
        successLead: "We'll write when a seat opens. Nothing else.",
      },
      extras: {
        kicker: "Invitation only",
        emailPh: "you@studio.com",
        member1: "Elena Voss",
        member2: "Kai Nakamura",
        member3: "Noor Haddad",
        role1: "Editor",
        role2: "Collector",
        role3: "Founder",
        faq1: "How long is the wait?",
        faq1a: "Usually two to six weeks. We review in small batches.",
        faq2: "Can I refer someone?",
        faq2a: "Members receive one sealed invite per season.",
        faq3: "Is there a fee?",
        faq3a: "No fee to join the list. Studio notes are complimentary.",
      },
    },
  },
  ru: {
    "aurora-flute": {
      brand: "AURORA",
      host: "aurora.finance",
      homeId: "home",
      pages: [
        { id: "home", label: "Главная" },
        { id: "product", label: "Продукт" },
        { id: "security", label: "Безопасность" },
        { id: "pricing", label: "Цены" },
        { id: "about", label: "О нас" },
      ],
      headlines: {
        home: "Ясность в каждом переводе.",
        product: "Одна поверхность для private wealth.",
        security: "Стеклянные стены. Стальные замки.",
        pricing: "Тарифы без шума.",
        about: "Сделано операторами, не хайпом.",
      },
      leads: {
        home: "Premium finance с fluted-glass панелями, мягкой рефракцией и CTA, которые ощущаются неизбежными.",
        product: "Переводы, сейфы и доход в одном языке контролов — токены рефракции на каждой панели.",
        security: "Ключи на железе, двойное подтверждение и аудиты, которые можно читать.",
        pricing: "Экономика private banking без мраморного лобби. Начните lean — масштабируйтесь с деском.",
        about: "Студия из двенадцати человек для family offices и бутиковых банков.",
      },
      ctas: {
        primary: "Открыть счёт",
        secondary: "Безопасность",
        pricing: "Связаться",
        about: "Команда",
      },
      extras: {
        kicker: "Private banking · заново",
        stat1: "AUM",
        stat2: "Settle",
        stat3: "Uptime",
        plan1: "Desk",
        plan2: "House",
        plan3: "Atelier",
        person1: "Мира Чен · Design",
        person2: "Оуэн Блейк · Product",
        person3: "София Рейес · Security",
      },
    },
    "mirage-deck": {
      brand: "MIRAGE",
      host: "mirage.market",
      homeId: "drop",
      pages: [
        { id: "drop", label: "Дроп" },
        { id: "market", label: "Маркет" },
        { id: "vault", label: "Хранилище" },
        { id: "about", label: "О проекте" },
      ],
      headlines: {
        drop: "Карты, которые ощущаются физическими.",
        market: "Floor price без шума.",
        vault: "Коллекция под печатью.",
        about: "Сезонный крафт, не спам-дропы.",
      },
      leads: {
        drop: "Иридесцентные коллекционки с tilt-бликом, reveal-моментами и кинематографичным маркетом.",
        market: "Живые лоты с foil-грейдами и метками last sale — заточены под share crops.",
        vault: "Холодное хранение для mythic, мягкое свечение для common. Всё наклоняется под курсором.",
        about: "Mirage — сезонная студия: четыре колоды в год, без пустых редкостей.",
      },
      ctas: {
        primary: "Открыть пак",
        secondary: "В хранилище",
        market: "Ставка",
        about: "Discord",
      },
      extras: {
        kicker: "Сезон 04 · limited deck",
        card1: "Obsidian Wing",
        card2: "Glass Mirage",
        card3: "Void Seal",
        card4: "Neon Lattice",
        rarity1: "Rare",
        rarity2: "Epic",
        rarity3: "Mythic",
        floor: "Floor · 2.4 ETH",
        owners: "1 842 владельца",
      },
    },
    "prism-controls": {
      brand: "PRISM",
      host: "prism.app",
      homeId: "product",
      pages: [
        { id: "product", label: "Продукт" },
        { id: "states", label: "Состояния" },
        { id: "customers", label: "Клиенты" },
        { id: "pricing", label: "Цены" },
      ],
      headlines: {
        product: "Кнопки, которые говорят состоянием.",
        states: "Idle → Hover → Armed → Done.",
        customers: "Команды с тихим UI.",
        pricing: "Одна матрица. Любая поверхность.",
      },
      leads: {
        product: "SaaS-язык контролов — idle, hover, armed, confirmed — без шумного хрома.",
        states: "Кликайте по матрице. Armed и confirmed — светом, не лишними лейблами.",
        customers: "Product-команды с одним токен-файлом между Figma и продакшеном.",
        pricing: "Бесплатно на маркетинге. Масштаб в тулбары без редизайна.",
      },
      ctas: {
        primary: "Начать",
        secondary: "Демо",
        pricing: "Выбрать",
      },
      extras: {
        kicker: "Контролы с памятью",
        idle: "Idle",
        hover: "Hover",
        armed: "Armed",
        done: "Done",
        live: "Живое состояние",
        cust1: "Northwind Labs",
        cust2: "Helix Ops",
        cust3: "Parcel Co",
        quote: "«Armed наконец отличается от hover.» — Лена Парк, Design Lead",
      },
    },
    northline: {
      brand: "NORTHLINE",
      host: "northline.studio",
      homeId: "journal",
      pages: [
        { id: "journal", label: "Журнал" },
        { id: "study", label: "Исследование" },
        { id: "index", label: "Индекс" },
        { id: "about", label: "О студии" },
      ],
      headlines: {
        journal: "Исследования, которые читаются как журнал.",
        study: "Удерживая рамку.",
        index: "Полевые заметки по порядку.",
        about: "Студия тихих сеток.",
      },
      leads: {
        journal: "Редакционная идентичность research-студии — display-тип, тонкие линии, спокойный цвет.",
        study: "Как ограничение становится активом бренда, когда у каждой страницы одна сетка.",
        index: "Эссе, исследования и маргиналии с Vol. 01 по Vol. 12.",
        about: "Northline публикует полевые исследования для дизайнеров, которые ещё читают longform.",
      },
      ctas: {
        primary: "Читать",
        secondary: "Индекс",
        about: "Архив",
      },
      extras: {
        kicker: "Vol. 12 · Полевые заметки",
        essay: "Эссе",
        byline: "Ада Морин · 14 мин",
        date: "Мар 2026",
        studyLabel: "Study 08",
        index1: "Тип как архитектура",
        index2: "Поля, которые значат",
        index3: "Печать → web без потерь",
      },
    },
    "folio-os": {
      brand: "FOLIO",
      host: "folio.os",
      homeId: "overview",
      pages: [
        { id: "overview", label: "Обзор" },
        { id: "modules", label: "Модули" },
        { id: "security", label: "Безопасность" },
        { id: "pricing", label: "Цены" },
      ],
      headlines: {
        overview: "Один слой токенов. Три продукта.",
        modules: "Компонуемый UI без потери остроты.",
        security: "SSO, аудит и тихий compliance.",
        pricing: "Места, что растут с деском.",
      },
      leads: {
        overview: "B2B-система, которая объединяет скины без выравнивания характера — сначала токены, потом модули.",
        modules: "Нав, таблицы, тосты и инпуты делят одни interaction-примитивы.",
        security: "Ролевые поверхности с экспортируемыми логами — для handoff, не для театра.",
        pricing: "Per-seat планы с общими токенами для Design, Ops и Docs.",
      },
      ctas: {
        primary: "Запросить доступ",
        secondary: "Модули",
        pricing: "Триал",
      },
      extras: {
        kicker: "Workspace OS",
        mod1: "Nav shell",
        mod2: "Data table",
        mod3: "Toast stack",
        mod4: "Input kit",
        seat1: "Studio · $29",
        seat2: "Team · $79",
        seat3: "Org · Custom",
      },
    },
    "kiln-identity": {
      brand: "KILN",
      host: "kiln.atelier",
      homeId: "home",
      pages: [
        { id: "home", label: "Главная" },
        { id: "work", label: "Работы" },
        { id: "process", label: "Процесс" },
        { id: "contact", label: "Контакт" },
      ],
      headlines: {
        home: "Жар, медь, крафт.",
        work: "Вещи с пола мастерской.",
        process: "От заготовки до знака.",
        contact: "Заказать серию.",
      },
      leads: {
        home: "Тёплая industrial-идентичность workshop-бренда — сайт продолжает сетку постеров.",
        work: "Железо, печати и пространственные знаки для ателье, которые ещё касаются металла.",
        process: "Фото и тип делят те же поля, что и печатная серия.",
        contact: "Расскажите о поверхности. Ответим за два студийных дня.",
      },
      ctas: {
        primary: "Комиссия",
        secondary: "Студия",
        contact: "Отправить бриф",
      },
      extras: {
        kicker: "Hardware atelier",
        project1: "Серия медных печатей",
        project2: "Идентичность tool wall",
        project3: "Пак forge mark",
        step1: "Бриф и материал",
        step2: "Ковка и пруф",
        step3: "Штамп и отправка",
        hours: "Вт–Сб · 10–18",
      },
    },
    "orbit-drop": {
      brand: "ORBIT",
      host: "orbit.atlas",
      homeId: "home",
      pages: [
        { id: "home", label: "Главная" },
        { id: "story", label: "История" },
        { id: "specs", label: "Спеки" },
        { id: "access", label: "Доступ" },
      ],
      headlines: {
        home: "Один кадр. Одна поверхность.",
        story: "Собрано для ночного запуска.",
        specs: "Бюджеты motion зафиксированы.",
        access: "Ограниченные ключи. Без театра очереди.",
      },
      leads: {
        home: "High-craft launch page — кинематографичный герой, dual CTA, метрики вне шума первого экрана.",
        story: "Начали с одной композиции и отказались от свалки feature-карточек ниже фолда.",
        specs: "Тип, glow и иерархия CTA как одна система — измерено на mid-tier ноутбуках.",
        access: "Сначала invite. Публичный waitlist — когда инвентарь освободится.",
      },
      ctas: {
        primary: "Получить доступ",
        secondary: "Смотреть reel",
        access: "Запросить ключ",
      },
      extras: {
        kicker: "Limited drop · 2026",
        metric1: "60fps hero",
        metric2: "12ms settle",
        metric3: "3 CTA states",
        spec1: "Display · Syne",
        spec2: "Body · Sora",
        spec3: "Glow · 18% mix",
      },
    },
    "signal-release": {
      brand: "SIGNAL",
      host: "signal.release",
      homeId: "chapters",
      pages: [
        { id: "chapters", label: "Главы" },
        { id: "pulse", label: "Pulse" },
        { id: "frame", label: "Frame" },
        { id: "release", label: "Release" },
        { id: "waitlist", label: "Waitlist" },
      ],
      headlines: {
        chapters: "Скролл — это история.",
        pulse: "Проблема, которую мы чувствовали.",
        frame: "Что мы собрали.",
        release: "Почему это конвертит.",
        waitlist: "До дропа.",
      },
      leads: {
        chapters: "Посадочная по главам, которая объясняет сложный дроп без стены карточек.",
        pulse: "Шум везде. Signal нужен был более тихий путь к пониманию.",
        frame: "Пять глав, один ритм — каждая секция зарабатывает следующую.",
        release: "Читатели дочитывают историю — и просят доступ.",
        waitlist: "Одно письмо, когда откроется релиз. Без drip. Без фейковой срочности.",
      },
      ctas: {
        primary: "В waitlist",
        secondary: "Press kit",
        jump: "К главе",
      },
      extras: {
        kicker: "Release campaign",
        ch1: "01 · Pulse",
        ch2: "02 · Frame",
        ch3: "03 · Release",
        attendees: "2.4k на превью",
        press: "Press kit · PDF",
      },
    },
    "vault-access": {
      brand: "VAULT",
      host: "vault.access",
      homeId: "invite",
      pages: [
        { id: "invite", label: "Invite" },
        { id: "members", label: "Участники" },
        { id: "ritual", label: "Ритуал" },
        { id: "faq", label: "FAQ" },
      ],
      headlines: {
        invite: "Доступ, который заслуживают.",
        members: "Те, кто уже внутри.",
        ritual: "Как работают приглашения.",
        faq: "Тихие ответы.",
      },
      leads: {
        invite: "Waitlist, который ощущается как приглашение — тихая срочность, без фейковых таймеров.",
        members: "Фаундеры, коллекционеры и редакторы, которые предпочитают письма запускам.",
        ritual: "Запрос → ревью → печать. Одно письмо, когда это важно.",
        faq: "Членство по приглашению. Мы не продаём early access.",
      },
      ctas: {
        primary: "Запросить доступ",
        secondary: "Заметки",
        submit: "Отправить",
        success: "Вы в списке",
        successLead: "Напишем, когда откроется место. Больше ничего.",
      },
      extras: {
        kicker: "Только по приглашению",
        emailPh: "you@studio.com",
        member1: "Елена Восс",
        member2: "Кай Накамура",
        member3: "Нур Хаддад",
        role1: "Editor",
        role2: "Collector",
        role3: "Founder",
        faq1: "Сколько ждать?",
        faq1a: "Обычно две–шесть недель. Ревью небольшими партиями.",
        faq2: "Можно ли пригласить?",
        faq2a: "Участники получают одно sealed-приглашение за сезон.",
        faq3: "Есть ли плата?",
        faq3a: "За лист платы нет. Студийные заметки бесплатны.",
      },
    },
  },
};

function liveStyle(accent: string): CSSProperties {
  return { "--live-a": accent } as CSSProperties;
}

function LivingStyles() {
  return (
    <style>{`
      .live-root {
        --live-a: #7ebee9;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: #090b0f;
        color: #e8eaef;
        font-family: var(--font-body, "Sora", sans-serif);
        font-size: 11px;
        line-height: 1.35;
        overflow: hidden;
        user-select: none;
      }

      .live-chrome {
        display: flex;
        align-items: center;
        gap: 10px;
        height: 28px;
        padding: 0 10px;
        background: #12151a;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        flex-shrink: 0;
      }

      .live-chrome__dots {
        display: flex;
        gap: 5px;
      }

      .live-chrome__dots i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #3a4048;
      }

      .live-chrome__dots i:nth-child(1) { background: #ff5f57; }
      .live-chrome__dots i:nth-child(2) { background: #febc2e; }
      .live-chrome__dots i:nth-child(3) { background: #28c840; }

      .live-chrome__url {
        flex: 1;
        height: 16px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.04);
        color: rgba(255, 255, 255, 0.42);
        font-size: 9px;
        letter-spacing: 0.02em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .live-body {
        overflow: auto;
        flex: 1;
        min-height: 0;
        position: relative;
        display: flex;
        flex-direction: column;
      }

      .live-root[data-mode="thumb"] .live-body {
        overflow: hidden;
      }

      .live-root[data-mode="thumb"] {
        background: #090b0f;
      }

      .live-nav {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        position: sticky;
        top: 0;
        z-index: 5;
        backdrop-filter: blur(12px);
        background: color-mix(in srgb, #090b0f 78%, transparent);
      }

      .live-nav__brand {
        font-family: var(--font-display, "Syne", sans-serif);
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.08em;
        color: var(--live-a);
        margin-right: auto;
      }

      .live-nav__btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: rgba(255, 255, 255, 0.48);
        font: inherit;
        font-size: 9px;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 4px 6px;
        border-radius: 4px;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
      }

      .live-nav__btn:hover {
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.05);
      }

      .live-nav__btn.is-active {
        color: #fff;
        background: color-mix(in srgb, var(--live-a) 22%, transparent);
      }

      .live-btn {
        appearance: none;
        border: 0;
        cursor: pointer;
        font: inherit;
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.03em;
        padding: 8px 14px;
        border-radius: 999px;
        background: var(--live-a);
        color: #0a0c10;
        transition: transform 0.15s, filter 0.15s, box-shadow 0.15s;
      }

      .live-btn:hover {
        transform: translateY(-1px);
        filter: brightness(1.08);
        box-shadow: 0 8px 24px color-mix(in srgb, var(--live-a) 35%, transparent);
      }

      .live-btn--ghost {
        background: transparent;
        color: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.16);
      }

      .live-btn--ghost:hover {
        border-color: color-mix(in srgb, var(--live-a) 55%, transparent);
        color: #fff;
        box-shadow: none;
      }

      .live-kicker {
        font-size: 9px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: color-mix(in srgb, var(--live-a) 80%, #fff);
        margin: 0 0 6px;
      }

      .live-h1 {
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: clamp(18px, 3.2vw, 28px);
        font-weight: 700;
        line-height: 1.05;
        margin: 0 0 8px;
        letter-spacing: -0.02em;
      }

      .live-lead {
        margin: 0 0 12px;
        color: rgba(255, 255, 255, 0.62);
        max-width: 42ch;
        font-size: 10px;
      }

      .live-ctas {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .live-img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .live-footer {
        padding: 14px 12px 18px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        color: rgba(255, 255, 255, 0.35);
        font-size: 8px;
        letter-spacing: 0.04em;
      }

      /* ——— Aurora ——— */
      .live-aurora {
        background:
          radial-gradient(ellipse 80% 50% at 70% 0%, color-mix(in srgb, var(--live-a) 18%, transparent), transparent 60%),
          linear-gradient(180deg, #0c0e14, #08090d);
      }

      .live-aurora__hero {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 12px;
        padding: 14px 12px;
        min-height: 160px;
      }

      .live-aurora__media {
        border-radius: 12px;
        overflow: hidden;
        min-height: 120px;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .live-aurora__media::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, color-mix(in srgb, var(--live-a) 25%, transparent), transparent 55%);
        pointer-events: none;
      }

      .live-glass {
        background: color-mix(in srgb, var(--live-a) 10%, rgba(255, 255, 255, 0.04));
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        padding: 10px;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
        transition: border-color 0.2s, transform 0.2s;
      }

      .live-glass:hover {
        border-color: color-mix(in srgb, var(--live-a) 45%, transparent);
        transform: translateY(-2px);
      }

      .live-glass::before {
        content: "";
        position: absolute;
        inset: -40% auto auto -20%;
        width: 60%;
        height: 80%;
        background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.14), transparent);
        transform: rotate(18deg);
        opacity: 0;
        transition: opacity 0.25s, transform 0.35s;
        pointer-events: none;
      }

      .live-glass:hover::before {
        opacity: 1;
        transform: rotate(18deg) translateX(40%);
      }

      .live-glass em {
        display: block;
        font-style: normal;
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.45);
        margin-bottom: 4px;
      }

      .live-glass strong {
        display: block;
        font-size: 16px;
        font-family: var(--font-display, "Syne", sans-serif);
      }

      .live-glass span {
        display: block;
        margin-top: 4px;
        font-size: 9px;
        color: color-mix(in srgb, var(--live-a) 70%, #fff);
      }

      .live-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 0 12px 14px;
      }

      .live-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 12px;
      }

      .live-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        padding: 12px;
      }

      .live-pad {
        padding: 14px 12px;
      }

      .live-price {
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 20px;
        margin: 6px 0;
      }

      .live-team {
        display: grid;
        grid-template-columns: 1.2fr 1fr;
        gap: 10px;
        padding: 12px;
      }

      .live-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .live-person {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
        font-size: 9px;
        color: rgba(255, 255, 255, 0.7);
      }

      /* ——— Mirage ——— */
      .live-mirage {
        background:
          radial-gradient(circle at 20% 10%, color-mix(in srgb, var(--live-a) 22%, transparent), transparent 45%),
          #070910;
      }

      .live-mirage__hero {
        padding: 14px 12px 8px;
      }

      .live-tilt {
        --mx: 50%;
        --my: 50%;
        position: relative;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14);
        aspect-ratio: 4 / 5;
        transform: perspective(600px) rotateX(calc((var(--my) - 50) * 0.12deg)) rotateY(calc((var(--mx) - 50) * -0.16deg));
        transition: transform 0.08s linear;
        background: #111;
      }

      .live-tilt::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at calc(var(--mx) * 1%) calc(var(--my) * 1%), rgba(255, 255, 255, 0.35), transparent 42%),
          linear-gradient(125deg, transparent 30%, color-mix(in srgb, var(--live-a) 40%, transparent) 50%, transparent 70%);
        mix-blend-mode: overlay;
        pointer-events: none;
      }

      .live-tilt__meta {
        position: absolute;
        left: 8px;
        right: 8px;
        bottom: 8px;
        z-index: 1;
        padding: 8px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(6px);
      }

      .live-tilt__meta strong {
        display: block;
        font-size: 11px;
      }

      .live-tilt__meta em {
        font-style: normal;
        font-size: 8px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--live-a);
      }

      .live-pack-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 8px;
        padding: 8px 12px 14px;
      }

      .live-market-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        padding: 12px;
      }

      /* ——— Prism ——— */
      .live-prism {
        background: linear-gradient(165deg, #0d0a12, #08080c 55%, #0a0c10);
      }

      .live-prism__hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 14px 12px;
      }

      .live-state-btns {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 10px 0;
      }

      .live-state-btn {
        appearance: none;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.04);
        color: rgba(255, 255, 255, 0.7);
        font: inherit;
        font-size: 9px;
        padding: 7px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.15s;
      }

      .live-state-btn[data-s="idle"] { opacity: 0.75; }
      .live-state-btn[data-s="hover"] {
        border-color: color-mix(in srgb, var(--live-a) 50%, transparent);
        color: #fff;
      }
      .live-state-btn[data-s="armed"] {
        background: color-mix(in srgb, var(--live-a) 28%, transparent);
        border-color: var(--live-a);
        color: #fff;
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--live-a) 40%, transparent);
      }
      .live-state-btn[data-s="done"] {
        background: var(--live-a);
        color: #0a0c10;
        border-color: transparent;
        font-weight: 700;
      }

      .live-state-panel {
        border-radius: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        font-size: 9px;
      }

      .live-state-panel b {
        color: var(--live-a);
      }

      .live-cust {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.06);
        margin-bottom: 6px;
      }

      /* ——— Northline ——— */
      .live-north {
        background: #0b0c0a;
        color: #e8ecd8;
      }

      .live-north .live-nav {
        background: color-mix(in srgb, #0b0c0a 85%, transparent);
        border-bottom-color: rgba(198, 242, 77, 0.15);
      }

      .live-north__hero {
        display: grid;
        grid-template-columns: 1.3fr 0.7fr;
        gap: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .live-north__copy {
        padding: 18px 14px;
      }

      .live-north__copy .live-h1 {
        font-size: clamp(22px, 4vw, 34px);
        max-width: 12ch;
      }

      .live-north__media {
        min-height: 160px;
        border-left: 1px solid rgba(255, 255, 255, 0.1);
      }

      .live-north article {
        padding: 12px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .live-north article h3 {
        margin: 0 0 4px;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 13px;
      }

      .live-rule {
        height: 1px;
        background: rgba(255, 255, 255, 0.12);
        margin: 10px 0;
      }

      /* ——— Folio ——— */
      .live-folio {
        display: flex;
        min-height: 100%;
        background: #08110f;
      }

      .live-folio__side {
        width: 88px;
        flex-shrink: 0;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 10px 8px;
        background: rgba(0, 0, 0, 0.25);
      }

      .live-folio__side .live-nav__brand {
        display: block;
        margin: 0 0 12px;
        font-size: 10px;
      }

      .live-folio__side .live-nav__btn {
        display: block;
        width: 100%;
        text-align: left;
        margin-bottom: 2px;
        padding: 6px 6px;
      }

      .live-folio__main {
        flex: 1;
        min-width: 0;
      }

      .live-mod {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        transition: border-color 0.15s, background 0.15s;
      }

      .live-mod:hover {
        border-color: color-mix(in srgb, var(--live-a) 45%, transparent);
        background: color-mix(in srgb, var(--live-a) 8%, transparent);
      }

      .live-mod h3 {
        margin: 0 0 4px;
        font-size: 11px;
      }

      .live-mod p {
        margin: 0;
        font-size: 9px;
        color: rgba(255, 255, 255, 0.5);
      }

      /* ——— Kiln ——— */
      .live-kiln {
        background:
          linear-gradient(180deg, #1a120c, #0e0b09 40%, #120e0a);
        color: #f2e6d4;
      }

      .live-kiln__hero {
        position: relative;
        min-height: 170px;
      }

      .live-kiln__hero .live-img {
        position: absolute;
        inset: 0;
        opacity: 0.55;
      }

      .live-kiln__hero-copy {
        position: relative;
        z-index: 1;
        padding: 28px 14px 20px;
        background: linear-gradient(90deg, rgba(10, 8, 6, 0.75), transparent 70%);
      }

      .live-gallery {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
        padding: 10px 12px 14px;
      }

      .live-gallery figure {
        margin: 0;
        border-radius: 8px;
        overflow: hidden;
        aspect-ratio: 1;
        border: 1px solid rgba(232, 192, 122, 0.2);
        position: relative;
      }

      .live-gallery figcaption {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 6px;
        font-size: 8px;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
      }

      .live-steps {
        display: grid;
        gap: 8px;
        padding: 12px;
      }

      .live-step {
        display: grid;
        grid-template-columns: 28px 1fr;
        gap: 8px;
        align-items: start;
      }

      .live-step i {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        font-style: normal;
        font-size: 10px;
        font-weight: 700;
        background: color-mix(in srgb, var(--live-a) 25%, transparent);
        border: 1px solid color-mix(in srgb, var(--live-a) 50%, transparent);
      }

      /* ——— Orbit ——— */
      .live-orbit {
        background: #05070c;
      }

      .live-orbit__hero {
        position: relative;
        min-height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .live-orbit__hero .live-img {
        position: absolute;
        inset: 0;
        opacity: 0.65;
      }

      .live-orbit__hero-copy {
        position: relative;
        z-index: 1;
        padding: 20px 14px;
        background: linear-gradient(transparent, rgba(5, 7, 12, 0.92) 40%);
      }

      .live-metrics {
        display: flex;
        gap: 16px;
        padding: 10px 14px 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      }

      .live-metrics strong {
        display: block;
        font-family: var(--font-display, "Syne", sans-serif);
        font-size: 14px;
      }

      .live-metrics span {
        font-size: 8px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.45);
      }

      /* ——— Signal ——— */
      .live-signal {
        background: #070807;
      }

      .live-chapters {
        display: grid;
        gap: 6px;
        padding: 12px;
      }

      .live-chapter {
        appearance: none;
        text-align: left;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
        color: inherit;
        font: inherit;
        padding: 10px 12px;
        border-radius: 10px;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
      }

      .live-chapter:hover {
        border-color: color-mix(in srgb, var(--live-a) 50%, transparent);
        background: color-mix(in srgb, var(--live-a) 10%, transparent);
      }

      .live-chapter strong {
        display: block;
        font-size: 12px;
        margin-bottom: 2px;
      }

      .live-chapter span {
        font-size: 9px;
        color: rgba(255, 255, 255, 0.5);
      }

      .live-signal__band {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        min-height: 140px;
      }

      .live-signal__band > div {
        padding: 14px;
      }

      .live-signal__band .live-img {
        min-height: 140px;
      }

      /* ——— Vault ——— */
      .live-vault {
        background:
          radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--live-a) 16%, transparent), transparent 55%),
          #0c0a08;
      }

      .live-vault__hero {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 14px 12px;
      }

      .live-form {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
      }

      .live-form input {
        appearance: none;
        border: 1px solid rgba(255, 255, 255, 0.14);
        background: rgba(0, 0, 0, 0.35);
        color: #fff;
        font: inherit;
        font-size: 10px;
        padding: 9px 10px;
        border-radius: 8px;
        outline: none;
      }

      .live-form input:focus {
        border-color: color-mix(in srgb, var(--live-a) 60%, transparent);
      }

      .live-success {
        padding: 12px;
        border-radius: 10px;
        border: 1px solid color-mix(in srgb, var(--live-a) 45%, transparent);
        background: color-mix(in srgb, var(--live-a) 12%, transparent);
      }

      .live-success strong {
        display: block;
        font-size: 13px;
        margin-bottom: 4px;
        color: var(--live-a);
      }

      .live-faq details {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding: 8px 0;
      }

      .live-faq summary {
        cursor: pointer;
        font-size: 10px;
        font-weight: 600;
      }

      .live-faq p {
        margin: 6px 0 0;
        font-size: 9px;
        color: rgba(255, 255, 255, 0.55);
      }

      @media (max-width: 640px) {
        .live-aurora__hero,
        .live-prism__hero,
        .live-north__hero,
        .live-vault__hero,
        .live-team,
        .live-signal__band,
        .live-mirage__hero {
          grid-template-columns: 1fr;
        }

        .live-chrome { height: 22px; }

        .live-folio {
          flex-direction: column;
        }

        .live-folio__side {
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: 4px;
          border-right: 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .live-folio__side .live-nav__brand {
          margin: 0 8px 0 0;
        }

        .live-folio__side .live-nav__btn {
          width: auto;
          margin: 0;
        }
      }

      @media (max-width: 420px) {
        .live-aurora__hero,
        .live-prism__hero,
        .live-north__hero,
        .live-vault__hero,
        .live-team,
        .live-signal__band {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}

function BrowserShell({
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
    <div className="live-root" data-mode={mode} style={liveStyle(accent)}>
      <LivingStyles />
      <header className="live-chrome" aria-hidden>
        <span className="live-chrome__dots">
          <i />
          <i />
          <i />
        </span>
        <span className="live-chrome__url">{url}</span>
      </header>
      <div className="live-body">{children}</div>
    </div>
  );
}

function useSitePage(homeId: string, mode: LivingMode) {
  const [pageId, setPageId] = useState(homeId);
  const active = mode === "thumb" ? homeId : pageId;
  return { pageId: active, setPageId };
}

function SiteNav({
  brand,
  pages,
  pageId,
  onNavigate,
}: {
  brand: string;
  pages: PageDef[];
  pageId: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav className="live-nav" aria-label="Site">
      <span className="live-nav__brand">{brand}</span>
      {pages.map((p) => (
        <button
          key={p.id}
          type="button"
          className={`live-nav__btn${pageId === p.id ? " is-active" : ""}`}
          onClick={() => onNavigate(p.id)}
        >
          {p.label}
        </button>
      ))}
    </nav>
  );
}

function urlFor(host: string, pageId: string) {
  return `${host} / ${pageId}`;
}

/* ========== AURORA ========== */
function AuroraSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["aurora-flute"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-aurora">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "home" && (
          <>
            <section className="live-aurora__hero">
              <div>
                <p className="live-kicker">{c.extras.kicker}</p>
                <h1 className="live-h1">{c.headlines.home}</h1>
                <p className="live-lead">{c.leads.home}</p>
                <div className="live-ctas">
                  <button type="button" className="live-btn">
                    {c.ctas.primary}
                  </button>
                  <button
                    type="button"
                    className="live-btn live-btn--ghost"
                    onClick={() => setPageId("security")}
                  >
                    {c.ctas.secondary}
                  </button>
                </div>
              </div>
              <div className="live-aurora__media">
                <img className="live-img" src={photos.financeCity} alt="City skyline" loading="lazy" />
              </div>
            </section>
            <div className="live-stats">
              <article className="live-glass">
                <em>{c.extras.stat1}</em>
                <strong>$2.4B</strong>
                <span>+12.4% QoQ</span>
              </article>
              <article className="live-glass">
                <em>{c.extras.stat2}</em>
                <strong>1.8s</strong>
                <span>median</span>
              </article>
              <article className="live-glass">
                <em>{c.extras.stat3}</em>
                <strong>99.99%</strong>
                <span>30-day</span>
              </article>
            </div>
            <div className="live-grid-2">
              <div className="live-aurora__media" style={{ minHeight: 90 }}>
                <img className="live-img" src={photos.financeDesk} alt="Trading desk" loading="lazy" />
              </div>
              <article className="live-glass">
                <em>Yield desk</em>
                <strong>4.8%</strong>
                <span>Private vault · Mira Chen</span>
              </article>
            </div>
          </>
        )}

        {pageId === "product" && (
          <div className="live-pad">
            <p className="live-kicker">Product</p>
            <h1 className="live-h1">{c.headlines.product}</h1>
            <p className="live-lead">{c.leads.product}</p>
            <div className="live-aurora__media" style={{ minHeight: 110, marginBottom: 10 }}>
              <img className="live-img" src={photos.dashboard} alt="Product dashboard" loading="lazy" />
            </div>
            <div className="live-grid-3" style={{ padding: 0 }}>
              {["Transfers", "Vaults", "Yield"].map((label, i) => (
                <article key={label} className="live-glass">
                  <em>0{i + 1}</em>
                  <strong style={{ fontSize: 12 }}>{label}</strong>
                  <span>Shared refraction tokens</span>
                </article>
              ))}
            </div>
          </div>
        )}

        {pageId === "security" && (
          <div className="live-pad">
            <p className="live-kicker">Security</p>
            <h1 className="live-h1">{c.headlines.security}</h1>
            <p className="live-lead">{c.leads.security}</p>
            <div className="live-grid-2" style={{ padding: 0 }}>
              <article className="live-glass">
                <em>Hardware</em>
                <strong style={{ fontSize: 13 }}>HSM-backed</strong>
                <span>Dual approval · Owen Blake</span>
              </article>
              <div className="live-aurora__media" style={{ minHeight: 100 }}>
                <img className="live-img" src={photos.abstractGlass} alt="Glass abstraction" loading="lazy" />
              </div>
            </div>
          </div>
        )}

        {pageId === "pricing" && (
          <div className="live-pad">
            <p className="live-kicker">Pricing</p>
            <h1 className="live-h1">{c.headlines.pricing}</h1>
            <p className="live-lead">{c.leads.pricing}</p>
            <div className="live-grid-3" style={{ padding: 0 }}>
              {[
                [c.extras.plan1, "$0", "Marketing surface"],
                [c.extras.plan2, "$480", "Family desk"],
                [c.extras.plan3, "Custom", "Atelier bank"],
              ].map(([name, price, note]) => (
                <article key={name} className="live-glass">
                  <em>{name}</em>
                  <div className="live-price">{price}</div>
                  <span>{note}</span>
                </article>
              ))}
            </div>
            <div className="live-ctas" style={{ marginTop: 12 }}>
              <button type="button" className="live-btn">
                {c.ctas.pricing}
              </button>
            </div>
          </div>
        )}

        {pageId === "about" && (
          <div className="live-team">
            <div>
              <p className="live-kicker">About</p>
              <h1 className="live-h1">{c.headlines.about}</h1>
              <p className="live-lead">{c.leads.about}</p>
              <div className="live-person">
                <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
                {c.extras.person1}
              </div>
              <div className="live-person">
                <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
                {c.extras.person2}
              </div>
              <div className="live-person">
                <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
                {c.extras.person3}
              </div>
            </div>
            <div className="live-aurora__media" style={{ minHeight: 160 }}>
              <img className="live-img" src={photos.financeTeam} alt="Team" loading="lazy" />
            </div>
          </div>
        )}

        <footer className="live-footer">© Aurora Finance — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

/* ========== MIRAGE ========== */
function MirageSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["mirage-deck"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);
  const packCards = [
    { name: c.extras.card1, rarity: c.extras.rarity1, img: photos.foilArt },
    { name: c.extras.card2, rarity: c.extras.rarity2, img: photos.hologram },
    { name: c.extras.card3, rarity: c.extras.rarity3, img: photos.neonCard },
    { name: c.extras.card4, rarity: c.extras.rarity2, img: photos.abstractGlass },
  ];
  const [revealed, setRevealed] = useState(0);

  const onTilt = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 100;
    const my = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${mx}`);
    el.style.setProperty("--my", `${my}`);
  };

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-mirage">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "drop" && (
          <>
            <section className="live-mirage__hero">
              <p className="live-kicker">{c.extras.kicker}</p>
              <h1 className="live-h1">{c.headlines.drop}</h1>
              <p className="live-lead">{c.leads.drop}</p>
              <div className="live-ctas">
                <button
                  type="button"
                  className="live-btn"
                  onClick={() => setRevealed((n) => (n + 1) % packCards.length)}
                >
                  {c.ctas.primary}
                </button>
                <button
                  type="button"
                  className="live-btn live-btn--ghost"
                  onClick={() => setPageId("vault")}
                >
                  {c.ctas.secondary}
                </button>
              </div>
            </section>
            <div className="live-pack-row">
              {packCards.slice(0, 3).map((_, i) => {
                const shown = packCards[(revealed + i) % packCards.length];
                return (
                  <article
                    key={`${shown.name}-${i}`}
                    className="live-tilt"
                    onMouseMove={onTilt}
                  >
                    <img className="live-img" src={shown.img} alt={shown.name} loading="lazy" />
                    <div className="live-tilt__meta">
                      <em>{shown.rarity}</em>
                      <strong>{shown.name}</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}

        {pageId === "market" && (
          <div className="live-pad">
            <p className="live-kicker">Market</p>
            <h1 className="live-h1">{c.headlines.market}</h1>
            <p className="live-lead">{c.leads.market}</p>
            <p style={{ margin: "0 0 8px", color: "var(--live-a)", fontSize: 10 }}>
              {c.extras.floor} · {c.extras.owners}
            </p>
            <div className="live-market-row" style={{ padding: 0 }}>
              {packCards.map((card) => (
                <article key={card.name} className="live-tilt" onMouseMove={onTilt}>
                  <img className="live-img" src={card.img} alt={card.name} loading="lazy" />
                  <div className="live-tilt__meta">
                    <em>{card.rarity}</em>
                    <strong>{card.name}</strong>
                    <span style={{ fontSize: 8, opacity: 0.7 }}>Last · 1.9 ETH · 2h ago</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="live-ctas" style={{ marginTop: 10 }}>
              <button type="button" className="live-btn">
                {c.ctas.market}
              </button>
            </div>
          </div>
        )}

        {pageId === "vault" && (
          <div className="live-pad">
            <p className="live-kicker">Vault</p>
            <h1 className="live-h1">{c.headlines.vault}</h1>
            <p className="live-lead">{c.leads.vault}</p>
            <div className="live-pack-row" style={{ padding: 0 }}>
              {packCards.slice(0, 3).map((card) => (
                <article key={card.name} className="live-tilt" onMouseMove={onTilt}>
                  <img className="live-img" src={card.img} alt={card.name} loading="lazy" />
                  <div className="live-tilt__meta">
                    <em>Sealed</em>
                    <strong>{card.name}</strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {pageId === "about" && (
          <div className="live-pad">
            <p className="live-kicker">About</p>
            <h1 className="live-h1">{c.headlines.about}</h1>
            <p className="live-lead">{c.leads.about}</p>
            <div className="live-aurora__media" style={{ minHeight: 120, marginBottom: 10 }}>
              <img className="live-img" src={photos.hologram} alt="Studio foil" loading="lazy" />
            </div>
            <div className="live-person">
              <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
              Nova Ellis · Season Director · Updated 3d ago
            </div>
            <div className="live-ctas" style={{ marginTop: 12 }}>
              <button type="button" className="live-btn">
                {c.ctas.about}
              </button>
            </div>
          </div>
        )}

        <footer className="live-footer">© Mirage Market — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

/* ========== PRISM ========== */
type PrismState = "idle" | "hover" | "armed" | "done";
const PRISM_CYCLE: PrismState[] = ["idle", "hover", "armed", "done"];

function PrismSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["prism-controls"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);
  const [state, setState] = useState<PrismState>("idle");

  const cycle = () => {
    setState((s) => PRISM_CYCLE[(PRISM_CYCLE.indexOf(s) + 1) % PRISM_CYCLE.length]);
  };

  const label =
    state === "idle"
      ? c.extras.idle
      : state === "hover"
        ? c.extras.hover
        : state === "armed"
          ? c.extras.armed
          : c.extras.done;

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-prism">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "product" && (
          <section className="live-prism__hero">
            <div>
              <p className="live-kicker">{c.extras.kicker}</p>
              <h1 className="live-h1">{c.headlines.product}</h1>
              <p className="live-lead">{c.leads.product}</p>
              <div className="live-state-btns">
                <button type="button" className="live-state-btn" data-s={state} onClick={cycle}>
                  {label}
                </button>
                <button type="button" className="live-btn live-btn--ghost" onClick={cycle}>
                  Cycle state
                </button>
              </div>
              <div className="live-state-panel">
                {c.extras.live}: <b>{state}</b> · click to advance
              </div>
              <div className="live-ctas" style={{ marginTop: 10 }}>
                <button type="button" className="live-btn">
                  {c.ctas.primary}
                </button>
                <button type="button" className="live-btn live-btn--ghost">
                  {c.ctas.secondary}
                </button>
              </div>
            </div>
            <div className="live-aurora__media" style={{ minHeight: 150, borderRadius: 12, overflow: "hidden" }}>
              <img className="live-img" src={photos.productUi} alt="Product UI" loading="lazy" />
            </div>
          </section>
        )}

        {pageId === "states" && (
          <div className="live-pad">
            <p className="live-kicker">States</p>
            <h1 className="live-h1">{c.headlines.states}</h1>
            <p className="live-lead">{c.leads.states}</p>
            <div className="live-state-btns">
              {PRISM_CYCLE.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="live-state-btn"
                  data-s={s}
                  onClick={() => setState(s)}
                >
                  {s === "idle"
                    ? c.extras.idle
                    : s === "hover"
                      ? c.extras.hover
                      : s === "armed"
                        ? c.extras.armed
                        : c.extras.done}
                </button>
              ))}
            </div>
            <div className="live-state-panel" style={{ marginTop: 8 }}>
              Selected: <b>{state}</b>
            </div>
            <div className="live-aurora__media" style={{ minHeight: 100, marginTop: 12, borderRadius: 10, overflow: "hidden" }}>
              <img className="live-img" src={photos.dashboard} alt="Dashboard" loading="lazy" />
            </div>
          </div>
        )}

        {pageId === "customers" && (
          <div className="live-pad">
            <p className="live-kicker">Customers</p>
            <h1 className="live-h1">{c.headlines.customers}</h1>
            <p className="live-lead">{c.leads.customers}</p>
            {[c.extras.cust1, c.extras.cust2, c.extras.cust3].map((name) => (
              <div key={name} className="live-cust">
                <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
                <div>
                  <strong style={{ fontSize: 11 }}>{name}</strong>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>Since 2024 · Design system</div>
                </div>
              </div>
            ))}
            <p className="live-lead" style={{ marginTop: 10 }}>
              {c.extras.quote}
            </p>
            <div className="live-aurora__media" style={{ minHeight: 90, borderRadius: 10, overflow: "hidden" }}>
              <img className="live-img" src={photos.office} alt="Office" loading="lazy" />
            </div>
          </div>
        )}

        {pageId === "pricing" && (
          <div className="live-pad">
            <p className="live-kicker">Pricing</p>
            <h1 className="live-h1">{c.headlines.pricing}</h1>
            <p className="live-lead">{c.leads.pricing}</p>
            <div className="live-grid-3" style={{ padding: 0 }}>
              {[
                ["Free", "$0", "Marketing"],
                ["Pro", "$49", "App toolbar"],
                ["Enterprise", "Custom", "Full matrix"],
              ].map(([n, p, note]) => (
                <article key={n} className="live-glass">
                  <em>{n}</em>
                  <div className="live-price">{p}</div>
                  <span>{note}</span>
                </article>
              ))}
            </div>
            <div className="live-ctas" style={{ marginTop: 12 }}>
              <button type="button" className="live-btn">
                {c.ctas.pricing}
              </button>
            </div>
          </div>
        )}

        <footer className="live-footer">© Prism — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

/* ========== NORTHLINE ========== */
function NorthlineSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale].northline;
  const { pageId, setPageId } = useSitePage(c.homeId, mode);

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-north">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "journal" && (
          <>
            <section className="live-north__hero">
              <div className="live-north__copy">
                <p className="live-kicker">{c.extras.kicker}</p>
                <h1 className="live-h1">{c.headlines.journal}</h1>
                <p className="live-lead">{c.leads.journal}</p>
                <div className="live-ctas">
                  <button type="button" className="live-btn" onClick={() => setPageId("study")}>
                    {c.ctas.primary}
                  </button>
                  <button
                    type="button"
                    className="live-btn live-btn--ghost"
                    onClick={() => setPageId("index")}
                  >
                    {c.ctas.secondary}
                  </button>
                </div>
              </div>
              <div className="live-north__media">
                <img className="live-img" src={photos.journal} alt="Journal" loading="lazy" />
              </div>
            </section>
            <article>
              <em style={{ fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--live-a)" }}>
                {c.extras.essay} · {c.extras.date}
              </em>
              <h3>Holding the frame</h3>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.55)" }}>
                {c.extras.byline}
              </p>
            </article>
          </>
        )}

        {pageId === "study" && (
          <div className="live-pad">
            <p className="live-kicker">{c.extras.studyLabel}</p>
            <h1 className="live-h1">{c.headlines.study}</h1>
            <p className="live-lead">{c.leads.study}</p>
            <div className="live-rule" />
            <div className="live-grid-2" style={{ padding: 0 }}>
              <div style={{ borderRadius: 4, overflow: "hidden", minHeight: 120 }}>
                <img className="live-img" src={photos.library} alt="Library" loading="lazy" />
              </div>
              <div style={{ borderRadius: 4, overflow: "hidden", minHeight: 120 }}>
                <img className="live-img" src={photos.research} alt="Research" loading="lazy" />
              </div>
            </div>
            <p className="live-lead" style={{ marginTop: 12 }}>
              Type as architecture — Syne for display, Sora for body — one scale from print to web.
            </p>
          </div>
        )}

        {pageId === "index" && (
          <div className="live-pad">
            <p className="live-kicker">Index</p>
            <h1 className="live-h1">{c.headlines.index}</h1>
            <p className="live-lead">{c.leads.index}</p>
            {[c.extras.index1, c.extras.index2, c.extras.index3].map((title, i) => (
              <article key={title} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <em style={{ fontSize: 8, color: "var(--live-a)" }}>0{i + 1}</em>
                <h3 style={{ margin: "2px 0", fontFamily: "var(--font-display, Syne, sans-serif)", fontSize: 13 }}>
                  {title}
                </h3>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Vol. {10 + i} · Ada Morin</span>
              </article>
            ))}
          </div>
        )}

        {pageId === "about" && (
          <div className="live-pad">
            <p className="live-kicker">About</p>
            <h1 className="live-h1">{c.headlines.about}</h1>
            <p className="live-lead">{c.leads.about}</p>
            <div style={{ borderRadius: 4, overflow: "hidden", minHeight: 130, marginBottom: 10 }}>
              <img className="live-img" src={photos.library} alt="Studio library" loading="lazy" />
            </div>
            <div className="live-person">
              <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
              Ada Morin · Editor · Est. 2019
            </div>
            <div className="live-ctas" style={{ marginTop: 12 }}>
              <button type="button" className="live-btn">
                {c.ctas.about}
              </button>
            </div>
          </div>
        )}

        <footer className="live-footer">Northline Journal — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

/* ========== FOLIO ========== */
function FolioSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["folio-os"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-folio">
        <aside className="live-folio__side">
          <span className="live-nav__brand">{c.brand}</span>
          {c.pages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`live-nav__btn${pageId === p.id ? " is-active" : ""}`}
              onClick={() => setPageId(p.id)}
            >
              {p.label}
            </button>
          ))}
        </aside>
        <div className="live-folio__main">
          {pageId === "overview" && (
            <div className="live-pad">
              <p className="live-kicker">{c.extras.kicker}</p>
              <h1 className="live-h1">{c.headlines.overview}</h1>
              <p className="live-lead">{c.leads.overview}</p>
              <div className="live-ctas">
                <button type="button" className="live-btn">
                  {c.ctas.primary}
                </button>
                <button
                  type="button"
                  className="live-btn live-btn--ghost"
                  onClick={() => setPageId("modules")}
                >
                  {c.ctas.secondary}
                </button>
              </div>
              <div
                className="live-aurora__media"
                style={{ minHeight: 120, marginTop: 12, borderRadius: 10, overflow: "hidden" }}
              >
                <img className="live-img" src={photos.dashboard} alt="Workspace dashboard" loading="lazy" />
              </div>
            </div>
          )}

          {pageId === "modules" && (
            <div className="live-pad">
              <p className="live-kicker">Modules</p>
              <h1 className="live-h1">{c.headlines.modules}</h1>
              <p className="live-lead">{c.leads.modules}</p>
              <div className="live-grid-2" style={{ padding: 0 }}>
                {[c.extras.mod1, c.extras.mod2, c.extras.mod3, c.extras.mod4].map((m) => (
                  <article key={m} className="live-mod">
                    <h3>{m}</h3>
                    <p>Shared tokens · v3.2</p>
                  </article>
                ))}
              </div>
              <div
                style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", minHeight: 90 }}
              >
                <img className="live-img" src={photos.productUi} alt="Modules UI" loading="lazy" />
              </div>
            </div>
          )}

          {pageId === "security" && (
            <div className="live-pad">
              <p className="live-kicker">Security</p>
              <h1 className="live-h1">{c.headlines.security}</h1>
              <p className="live-lead">{c.leads.security}</p>
              <div className="live-grid-2" style={{ padding: 0 }}>
                <article className="live-mod">
                  <h3>SSO / SAML</h3>
                  <p>Okta · Entra · Google</p>
                </article>
                <article className="live-mod">
                  <h3>Audit export</h3>
                  <p>CSV · SIEM · last sync 2h</p>
                </article>
              </div>
              <div
                style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", minHeight: 100 }}
              >
                <img className="live-img" src={photos.office} alt="Secure office" loading="lazy" />
              </div>
            </div>
          )}

          {pageId === "pricing" && (
            <div className="live-pad">
              <p className="live-kicker">Pricing</p>
              <h1 className="live-h1">{c.headlines.pricing}</h1>
              <p className="live-lead">{c.leads.pricing}</p>
              <div className="live-grid-3" style={{ padding: 0 }}>
                {[c.extras.seat1, c.extras.seat2, c.extras.seat3].map((seat) => (
                  <article key={seat} className="live-mod">
                    <h3>{seat}</h3>
                    <p>Per seat / mo</p>
                  </article>
                ))}
              </div>
              <div className="live-ctas" style={{ marginTop: 12 }}>
                <button type="button" className="live-btn">
                  {c.ctas.pricing}
                </button>
              </div>
            </div>
          )}

          <footer className="live-footer">© Folio OS — portfolio case</footer>
        </div>
      </div>
    </BrowserShell>
  );
}

/* ========== ORBIT ========== */
function OrbitSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["orbit-drop"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-orbit">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "home" && (
          <>
            <section className="live-orbit__hero">
              <img className="live-img" src={photos.nightCity} alt="Night city" loading="lazy" />
              <div className="live-orbit__hero-copy">
                <p className="live-kicker">{c.extras.kicker}</p>
                <h1 className="live-h1">{c.headlines.home}</h1>
                <p className="live-lead">{c.leads.home}</p>
                <div className="live-ctas">
                  <button type="button" className="live-btn" onClick={() => setPageId("access")}>
                    {c.ctas.primary}
                  </button>
                  <button type="button" className="live-btn live-btn--ghost">
                    {c.ctas.secondary}
                  </button>
                </div>
              </div>
            </section>
            <div className="live-metrics">
              <div>
                <strong>{c.extras.metric1}</strong>
                <span>Perf</span>
              </div>
              <div>
                <strong>{c.extras.metric2}</strong>
                <span>Motion</span>
              </div>
              <div>
                <strong>{c.extras.metric3}</strong>
                <span>CTA</span>
              </div>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ borderRadius: 10, overflow: "hidden", minHeight: 90 }}>
                <img className="live-img" src={photos.device} alt="Device" loading="lazy" />
              </div>
            </div>
          </>
        )}

        {pageId === "story" && (
          <div className="live-pad">
            <p className="live-kicker">Story</p>
            <h1 className="live-h1">{c.headlines.story}</h1>
            <p className="live-lead">{c.leads.story}</p>
            <div className="live-grid-2" style={{ padding: 0 }}>
              <div style={{ borderRadius: 10, overflow: "hidden", minHeight: 110 }}>
                <img className="live-img" src={photos.nightCity} alt="Launch night" loading="lazy" />
              </div>
              <div style={{ borderRadius: 10, overflow: "hidden", minHeight: 110 }}>
                <img className="live-img" src={photos.device} alt="Product frame" loading="lazy" />
              </div>
            </div>
            <div className="live-person" style={{ marginTop: 10 }}>
              <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
              Jules Park · Creative · Drop notes · Apr 2026
            </div>
          </div>
        )}

        {pageId === "specs" && (
          <div className="live-pad">
            <p className="live-kicker">Specs</p>
            <h1 className="live-h1">{c.headlines.specs}</h1>
            <p className="live-lead">{c.leads.specs}</p>
            <div className="live-grid-3" style={{ padding: 0 }}>
              {[c.extras.spec1, c.extras.spec2, c.extras.spec3].map((s) => (
                <article key={s} className="live-glass">
                  <em>Token</em>
                  <strong style={{ fontSize: 12 }}>{s}</strong>
                </article>
              ))}
            </div>
          </div>
        )}

        {pageId === "access" && (
          <div className="live-pad">
            <p className="live-kicker">Access</p>
            <h1 className="live-h1">{c.headlines.access}</h1>
            <p className="live-lead">{c.leads.access}</p>
            <div className="live-ctas">
              <button type="button" className="live-btn">
                {c.ctas.access}
              </button>
            </div>
            <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", minHeight: 110 }}>
              <img className="live-img" src={photos.invite} alt="Access invite" loading="lazy" />
            </div>
          </div>
        )}

        <footer className="live-footer">© Orbit — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

/* ========== SIGNAL ========== */
function SignalSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["signal-release"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-signal">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "chapters" && (
          <>
            <div className="live-pad" style={{ paddingBottom: 4 }}>
              <p className="live-kicker">{c.extras.kicker}</p>
              <h1 className="live-h1">{c.headlines.chapters}</h1>
              <p className="live-lead">{c.leads.chapters}</p>
            </div>
            <div className="live-signal__band">
              <img className="live-img" src={photos.crowd} alt="Crowd event" loading="lazy" />
              <div>
                <p style={{ margin: "0 0 6px", fontSize: 9, color: "var(--live-a)" }}>{c.extras.attendees}</p>
                <p className="live-lead">{c.leads.pulse}</p>
                <div className="live-ctas">
                  <button type="button" className="live-btn" onClick={() => setPageId("waitlist")}>
                    {c.ctas.primary}
                  </button>
                </div>
              </div>
            </div>
            <div className="live-chapters">
              {[
                { id: "pulse", label: c.extras.ch1, lead: c.leads.pulse },
                { id: "frame", label: c.extras.ch2, lead: c.leads.frame },
                { id: "release", label: c.extras.ch3, lead: c.leads.release },
              ].map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  className="live-chapter"
                  onClick={() => setPageId(ch.id)}
                >
                  <strong>{ch.label}</strong>
                  <span>{ch.lead}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {pageId === "pulse" && (
          <div className="live-pad">
            <p className="live-kicker">{c.extras.ch1}</p>
            <h1 className="live-h1">{c.headlines.pulse}</h1>
            <p className="live-lead">{c.leads.pulse}</p>
            <div style={{ borderRadius: 10, overflow: "hidden", minHeight: 130 }}>
              <img className="live-img" src={photos.crowd} alt="Pulse event" loading="lazy" />
            </div>
          </div>
        )}

        {pageId === "frame" && (
          <div className="live-pad">
            <p className="live-kicker">{c.extras.ch2}</p>
            <h1 className="live-h1">{c.headlines.frame}</h1>
            <p className="live-lead">{c.leads.frame}</p>
            <div style={{ borderRadius: 10, overflow: "hidden", minHeight: 130 }}>
              <img className="live-img" src={photos.device} alt="Frame product" loading="lazy" />
            </div>
          </div>
        )}

        {pageId === "release" && (
          <div className="live-pad">
            <p className="live-kicker">{c.extras.ch3}</p>
            <h1 className="live-h1">{c.headlines.release}</h1>
            <p className="live-lead">{c.leads.release}</p>
            <div style={{ borderRadius: 10, overflow: "hidden", minHeight: 120, marginBottom: 10 }}>
              <img className="live-img" src={photos.nightCity} alt="Release night" loading="lazy" />
            </div>
            <button type="button" className="live-btn live-btn--ghost">
              {c.extras.press}
            </button>
          </div>
        )}

        {pageId === "waitlist" && (
          <div className="live-pad">
            <p className="live-kicker">Waitlist</p>
            <h1 className="live-h1">{c.headlines.waitlist}</h1>
            <p className="live-lead">{c.leads.waitlist}</p>
            <div className="live-ctas">
              <button type="button" className="live-btn">
                {c.ctas.primary}
              </button>
              <button type="button" className="live-btn live-btn--ghost">
                {c.ctas.secondary}
              </button>
            </div>
            <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", minHeight: 100 }}>
              <img className="live-img" src={photos.invite} alt="Waitlist" loading="lazy" />
            </div>
          </div>
        )}

        <footer className="live-footer">Signal Release — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

/* ========== VAULT ========== */
function VaultSite({
  accent,
  locale,
  mode,
}: {
  accent: string;
  locale: Locale;
  mode: LivingMode;
}) {
  const c = COPY[locale]["vault-access"];
  const { pageId, setPageId } = useSitePage(c.homeId, mode);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <BrowserShell url={urlFor(c.host, pageId)} accent={accent} mode={mode}>
      <div className="live-vault">
        <SiteNav brand={c.brand} pages={c.pages} pageId={pageId} onNavigate={setPageId} />

        {pageId === "invite" && (
          <section className="live-vault__hero">
            <div>
              <p className="live-kicker">{c.extras.kicker}</p>
              <h1 className="live-h1">{c.headlines.invite}</h1>
              <p className="live-lead">{c.leads.invite}</p>
              {submitted ? (
                <div className="live-success">
                  <strong>{c.ctas.success}</strong>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)" }}>
                    {c.ctas.successLead}
                  </span>
                </div>
              ) : (
                <form className="live-form" onSubmit={onSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    placeholder={c.extras.emailPh}
                    aria-label="Email"
                  />
                  <button type="submit" className="live-btn">
                    {c.ctas.submit}
                  </button>
                </form>
              )}
            </div>
            <div className="live-aurora__media" style={{ minHeight: 150, borderRadius: 12, overflow: "hidden" }}>
              <img className="live-img" src={photos.invite} alt="Invitation" loading="lazy" />
            </div>
          </section>
        )}

        {pageId === "members" && (
          <div className="live-pad">
            <p className="live-kicker">Members</p>
            <h1 className="live-h1">{c.headlines.members}</h1>
            <p className="live-lead">{c.leads.members}</p>
            {[
              [c.extras.member1, c.extras.role1],
              [c.extras.member2, c.extras.role2],
              [c.extras.member3, c.extras.role3],
            ].map(([name, role]) => (
              <div key={name} className="live-cust">
                <img className="live-avatar" src={photos.portrait} alt="" loading="lazy" />
                <div>
                  <strong style={{ fontSize: 11 }}>{name}</strong>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)" }}>{role} · joined 2025</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", minHeight: 90 }}>
              <img className="live-img" src={photos.texture} alt="Member texture" loading="lazy" />
            </div>
          </div>
        )}

        {pageId === "ritual" && (
          <div className="live-pad">
            <p className="live-kicker">Ritual</p>
            <h1 className="live-h1">{c.headlines.ritual}</h1>
            <p className="live-lead">{c.leads.ritual}</p>
            <div className="live-steps" style={{ padding: 0 }}>
              {["Request", "Review", "Seal"].map((step, i) => (
                <div key={step} className="live-step">
                  <i>{i + 1}</i>
                  <div>
                    <strong style={{ fontSize: 11 }}>{step}</strong>
                    <p style={{ margin: "2px 0 0", fontSize: 9, color: "rgba(255,255,255,0.5)" }}>
                      Batch every Thursday
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, borderRadius: 10, overflow: "hidden", minHeight: 100 }}>
              <img className="live-img" src={photos.texture} alt="Ritual" loading="lazy" />
            </div>
          </div>
        )}

        {pageId === "faq" && (
          <div className="live-pad live-faq">
            <p className="live-kicker">FAQ</p>
            <h1 className="live-h1">{c.headlines.faq}</h1>
            <p className="live-lead">{c.leads.faq}</p>
            <details open>
              <summary>{c.extras.faq1}</summary>
              <p>{c.extras.faq1a}</p>
            </details>
            <details>
              <summary>{c.extras.faq2}</summary>
              <p>{c.extras.faq2a}</p>
            </details>
            <details>
              <summary>{c.extras.faq3}</summary>
              <p>{c.extras.faq3a}</p>
            </details>
          </div>
        )}

        <footer className="live-footer">Vault Access — portfolio case</footer>
      </div>
    </BrowserShell>
  );
}

const SITES: Record<
  string,
  (p: { accent: string; locale: Locale; mode: LivingMode }) => ReactNode
> = {
  "aurora-flute": (p) => <AuroraSite {...p} />,
  "mirage-deck": (p) => <MirageSite {...p} />,
  "prism-controls": (p) => <PrismSite {...p} />,
  northline: (p) => <NorthlineSite {...p} />,
  "folio-os": (p) => <FolioSite {...p} />,
  "kiln-identity": (p) => <KilnAtelierSite {...p} />,
  "orbit-drop": (p) => <OrbitSite {...p} />,
  "signal-release": (p) => <SignalSite {...p} />,
  "vault-access": (p) => <VaultSite {...p} />,
  nordpulse: (p) => <NordPulseSite {...p} />,
  greenbasket: (p) => <GreenBasketSite {...p} />,
  mochalki: (p) => <MochalkiSite {...p} />,
  vesper: (p) => <VesperSite {...p} />,
  shikhovo: (p) => <ShikhovoSite {...p} />,
};

export function LivingSite({
  caseId,
  accent,
  locale,
  mode = "full",
}: {
  caseId: string;
  accent: string;
  locale: "en" | "ru";
  mode?: LivingMode;
}) {
  const render = SITES[caseId];
  if (!render) {
    return (
      <div className="live-root" data-mode={mode} style={liveStyle(accent)}>
        <LivingStyles />
        <header className="live-chrome" aria-hidden>
          <span className="live-chrome__dots">
            <i />
            <i />
            <i />
          </span>
          <span className="live-chrome__url">unknown.site / —</span>
        </header>
        <div className="live-body live-pad">
          <p className="live-lead">Unknown case: {caseId}</p>
        </div>
      </div>
    );
  }
  return <>{render({ accent, locale, mode })}</>;
}

export function LivingSiteThumb(props: Omit<Parameters<typeof LivingSite>[0], "mode">) {
  return <LivingSite {...props} mode="thumb" />;
}

export type Locale = "en" | "ru";

export const translations = {
  en: {
    meta: {
      title: "ATLAS — Nikita Korolkov · Web Design & Tech Art",
      description:
        "Nikita Korolkov — high-craft websites, product UI, procedural surfaces, Unreal Tech Art. Deploy, domain, Cloudflare, ongoing support.",
    },
    nav: {
      ta: "Tech Art",
      web: "Work",
      work: "Work",
      shaders: "Shaders",
      studio: "Studio",
      portfolio: "Portfolio",
      contact: "Contact",
      backHome: "← Home",
    },
    home: {
      kicker: "Nikita Korolkov · Web design & Tech Art",
      lead:
        "I design and build high-craft websites — shops, product UI, and live interfaces with motion and GPU surfaces that feel intentional.",
      leadSecondary:
        "Also Unreal Engine Tech Art — render systems, shaders, and tooling (often under VR constraints).",
      leadOps:
        "I ship sites to production too — hosting, domain, Cloudflare, and ongoing support after launch.",
      ctaWork: "View work",
      ctaContact: "Get in touch",
      ctaTa: "Unreal Tech Art →",
      proofKicker: "Selected work",
      proofTitle: "Proof, not slides",
      proofLead:
        "Interactive cases you can click through — plus a live shader lab for procedural surfaces.",
      proofAll: "All web work →",
      closeTitle: "Need a site that looks right — and stays online?",
      closeLead:
        "Design, build, deploy, domain, Cloudflare, support. Short brief — I reply in Telegram.",
      closeCta: "Message on Telegram",
      featured: {
        mochalki: {
          tag: "Ecommerce",
          title: "Supracor",
          body: "Full shop flow — catalog, product, cart, checkout.",
        },
        vesper: {
          tag: "Private house",
          title: "Vesper",
          body: "Members' cabaret — invitation, tonight's house, live table book.",
        },
        shikhovo: {
          tag: "Estate site",
          title: "Shikhovo",
          body: "Light family eco-farm — map, animals, tickets, cottages.",
        },
        kiln: {
          tag: "Atelier site",
          title: "Kiln",
          body: "Copper sculpture brand — heat, craft, multi-page living UI.",
        },
        studio: {
          tag: "Shader lab",
          title: "Procedural studio",
          body: "Live WebGL surfaces — tune, preview, export for production.",
        },
      },
    },
    workWeb: {
      kicker: "Selected work · Web",
      title: "Web work",
      lead:
        "Full multi-page websites and interactive product surfaces — each built as a case you can explore.",
      back: "← Web work",
      caseRole: "Portfolio case · design & interactive prototype",
      caseHintCarousel:
        "Browse screens — a multi-page case from a real design file.",
      caseHintLiving:
        "Click sections inside the mock — multiple pages and live interaction.",
      caseCtaTitle: "Want something in this lane?",
      caseCtaBody:
        "Shops, ateliers, dashboards, procedural surfaces — plus deploy, domain, Cloudflare and support. Write me.",
      caseCta: "Contact",
      caseFullscreen: "Fullscreen",
      caseExitFullscreen: "Close",
      studio: {
        title: "Procedural shader studio",
        tags: "WebGL · Export · Live lab",
      },
      categories: {
        holo: {
          title: "Holo & fluted UI",
          tags: "Surfaces · Cards · Motion",
          lead: "Glass, iridescence, and control states — product sites that feel physical on screen.",
          back: "← Holo & fluted UI",
        },
        launch: {
          title: "Full websites",
          tags: "Shops · CRM · Multi-page",
          lead: "Complete site cases — private houses, ecommerce with cart, CRM dashboards, ateliers.",
          back: "← Full websites",
        },
      },
      cases: {
        "aurora-flute": {
          title: "Aurora Flute",
          tags: "Fintech · Glass UI · 2025",
        },
        "mirage-deck": {
          title: "Mirage Deck",
          tags: "Collectibles · Marketplace · 2025",
        },
        "prism-controls": {
          title: "Prism Controls",
          tags: "SaaS · Interaction · 2024",
        },
        northline: {
          title: "Northline",
          tags: "Editorial · Identity · 2025",
        },
        "folio-os": {
          title: "Folio OS",
          tags: "Workspace · System · 2024",
        },
        "kiln-identity": {
          title: "Kiln",
          tags: "Copper atelier · Brand · 2024",
        },
        mochalki: {
          title: "Supracor",
          tags: "Ecommerce · Cart · Checkout",
        },
        vesper: {
          title: "Vesper",
          tags: "Private cabaret · By invitation · Live UI",
        },
        ether: {
          title: "ÉTHER",
          tags: "Bespoke scent · Atmosphere · Sound",
        },
        "audi-rs5": {
          title: "Audi RS 5",
          tags: "Digital sculpture · Configurator · 2020",
        },
        shikhovo: {
          title: "Shikhovo",
          tags: "Family farm · Map · Tickets · RU",
        },
        "yy-portfolio": {
          title: "YY Portfolio",
          tags: "Personal site · Projects · 5 screens",
        },
        nordpulse: {
          title: "NordPulse",
          tags: "CRM · Analytics · Live UI",
        },
        greenbasket: {
          title: "GreenBasket",
          tags: "Grocery · Cart · Delivery",
        },
        "kiln-site": {
          title: "Kiln Atelier",
          tags: "Copper sculpture · Heat · Live UI",
        },
      },
    },
    portfolio: {
      kicker: "Portfolio · Web",
      title: "Selected sites",
      lead:
        "Dense multi-page cases — shops, CRM, grocery delivery, atelier, personal portfolio. Local imagery and live interaction where it matters.",
      back: "← Portfolio",
      cases: {
        mochalki: {
          audience: "Ecommerce · bath & body",
          title: "Supracor",
          tags: "Catalog · Cart · Checkout · Live",
          lead: "Warm retail storefront with catalog, product page, cart and checkout flow.",
        },
        vesper: {
          audience: "Private members' cabaret",
          title: "Vesper",
          tags: "Invitation · Programme · Tables · Live",
          lead: "A closed house in Paris — tonight's programme, a live floor, names in the book.",
        },
        ether: {
          audience: "Bespoke fragrance house",
          title: "ÉTHER",
          tags: "Atmosphere · Sound · DNA · Commission",
          lead: "No finished bottle — immerse in abstract fields and sound, then commission a scent composed only for you.",
        },
        "audi-rs5": {
          audience: "Performance digital showroom",
          title: "Audi RS 5 Sportback",
          tags: "3D · Configurator · Material data sculpture",
          lead: "Digital sculpture of the RS 5 — exterior and cabin configuration with spatial performance scenes for acceleration, quattro, and DRC.",
        },
        shikhovo: {
          audience: "Family eco-farm",
          title: "Shikhovo",
          tags: "Map · Animals · Tickets · Cottages",
          lead: "Bright Russian family site — territory map, real park photos, simple ticket day planner.",
        },
        "yy-portfolio": {
          audience: "Personal portfolio",
          title: "YY Portfolio",
          tags: "Projects · About · Contacts · 5 screens",
          lead: "Light multi-page personal site — home, project grid, case, about, contacts.",
        },
        nordpulse: {
          audience: "B2B CRM",
          title: "NordPulse",
          tags: "Dashboard · Users · Analytics · Live",
          lead: "Interactive CRM — switch modules, select rows, explore charts for products and users.",
        },
        greenbasket: {
          audience: "Grocery delivery",
          title: "GreenBasket",
          tags: "Catalog · Cart · Checkout · Photos",
          lead: "Serious grocery shop with hi-res produce, add-to-cart, quantity controls and checkout.",
        },
        "kiln-identity": {
          audience: "Contemporary copper atelier",
          title: "Kiln",
          tags: "Sculpture · Heat · Metal · Live",
          lead: "Modern copper atelier — abstract heat animations and hypothetical forged art pieces.",
        },
      },
    },
    workTa: {
      kicker: "Selected work · Tech Art",
      title: "Unreal Tech Art",
      lead:
        "UE systems work — render budgets, shader lighting, pipelines and tools. Much of it shipped under Standalone VR constraints.",
      lab: {
        title: "Shader lab",
        tags: "Fullscreen · Materials · Live GLSL",
      },
      projects: {
        "mass-npc": {
          title: "Mass NPC render system",
          tags: "Vertex · Standalone VR",
        },
        scopes: {
          title: "Dual-render VR scopes",
          tags: "Forward · Mobile Multiview",
        },
        "fake-lights": {
          title: "Shader fake dynamic lighting",
          tags: "Mobile Forward · Toon",
        },
        "lbe-pipeline": {
          title: "LBE pipeline & tools",
          tags: "EUW · Python · CI/CD",
        },
      },
    },
    caseMassNpc: {
      back: "← TA work",
      kicker: "Vertex · Standalone VR · 2023–2026",
      title: "Mass NPC render system",
      problemTitle: "Problem",
      problem:
        "Skeletal Mesh crowds killed Standalone VR budgets. Action scenes with players and dense NPC counts could not hold frame lock on Quest / Pico.",
      approachTitle: "Approach",
      approach:
        "A custom mass-render path replacing Skeletal Mesh, with vertex-shader smoothing and Mobile / Forward-friendly batching — tuned under action load, not empty scenes.",
      before: "Before — Skeletal Mesh crowds",
      after: "After — custom mass render",
      resultTitle: "Result",
      result:
        "Stable 72 FPS lock with 200 NPCs + players in action. Older HMDs (Quest 2 / Pico 4) moved from ~30 FPS at 6 players to ~73 FPS at 12.",
    },
    contact: {
      kicker: "Contact",
      name: "Nikita Korolkov",
      role: "Web designer · Tech artist",
      title: "Let’s talk about your project",
      lead:
        "Open for websites, product UI, procedural surfaces, Unreal Tech Art — and production launch: hosting, domain, Cloudflare, support. Fastest reply — Telegram.",
      back: "← Home",
      emailLabel: "Email",
      email: "corolkovnikita@gmail.com",
      telegramLabel: "Telegram",
      telegram: "@sprtbx",
      telegramUrl: "https://t.me/sprtbx",
      ctaTelegram: "Message on Telegram",
      ctaEmail: "Write an email",
      caps: {
        "01": {
          title: "Websites & product UI",
          body: "Shops, landing systems, dashboards — clear structure, strong craft, real interaction.",
        },
        "02": {
          title: "Motion & GPU surfaces",
          body: "Shader backgrounds, holo / fluted UI, export-ready GLSL and React.",
        },
        "03": {
          title: "Unreal Tech Art",
          body: "Render systems, shaders, pipelines — including hard VR / Mobile Forward budgets when needed.",
        },
        "04": {
          title: "Deploy & support",
          body: "Hosting, domain, Cloudflare, SSL, handoff — and ongoing care after the site is live.",
        },
        "05": {
          title: "How we start",
          body: "Short brief in Telegram → scope & timeline → design / prototype / launch.",
        },
      },
    },
    studio: {
      kicker: "Web · procedural FX",
      title: "Shader studio",
      lead:
        "Two rooms: full-bleed backgrounds, and a logo lab — SVG in Static Noise, Mercury, Gem, Fluid Chrome, Neon or smoke.",
      back: "← Web work",
      rooms: "Studio rooms",
      roomBg: "Backgrounds",
      roomLogo: "Logo lab",
      exportCode: "Export code",
      copied: "Copied",
      image: "Image",
      imageNote:
        "Optional local texture for Blockify / Pixels / Fluted. Stays in the browser — never uploaded.",
      svg: "Logo SVG",
      svgNote:
        "Local SVG only — rasterized in the browser, never uploaded. Default mark is ATLAS.",
      chooseSvg: "Choose SVG",
      replaceSvg: "Replace SVG",
      useDefault: "ATLAS mark",
      chooseImage: "Choose image",
      replaceImage: "Replace image",
      clear: "Clear",
      colors: "Colors",
      params: "Parameters",
      exportFragment: "Export · fragment",
      exportReact: "Export · React",
      hintSmoke: "Drag to aim — when you stop, it keeps drifting that way",
      hintInteractive: "Soft cursor influence — no hard warp",
      hintLogo: "Hover the mark — effects react to the cursor",
      hintStatic: "Magnet clump · lag tail · gravity lean · fly home",
      logoHints: {
        "static-noise": "Magnet clump · lag tail · gravity lean · fly home",
        mercury: "Liquid metal sim · drag to stir, keeps flowing",
        gem: "Crystal facets · orbiting light · soft edge glow",
        "fluid-chrome": "Molten chrome inside the mark · stir with cursor",
        smokey: "Fluid smoke trapped in the silhouette · drag to stir",
        neon: "Iridescent neon tube · soft bloom · flicker",
      },
      hintImageOn: "Local image",
      hintImageOff: "Optional local image (never uploaded)",
      hintAmbient: "Ambient animation",
      errImageType: "Pick an image file (png / jpg / webp)",
      errImageRead: "Could not read image",
      errSvgType: "Pick an SVG file",
      errSvgRead: "Could not read SVG",
    },
    shadersLab: {
      kicker: "Lab · Tech Art",
      title: "Shader lab",
      lead:
        "Fullscreen multipass and material previews — Rain Forest, clouds, fake lights. Edit GLSL live.",
      back: "← Tech Art",
    },
  },
  ru: {
    meta: {
      title: "ATLAS — Никита Корольков · Web Design & Tech Art",
      description:
        "Никита Корольков — сайты с сильным визуалом, продуктовые интерфейсы, процедурные поверхности и Tech Art на Unreal. Запуск, домен, Cloudflare, поддержка.",
    },
    nav: {
      ta: "Tech Art",
      web: "Работы",
      work: "Работы",
      shaders: "Шейдеры",
      studio: "Студия",
      portfolio: "Портфолио",
      contact: "Контакты",
      backHome: "← Главная",
    },
    home: {
      kicker: "Никита Корольков · веб-дизайн и Tech Art",
      lead:
        "Проектирую и собираю сайты с сильным визуалом — магазины, продуктовые интерфейсы и живые экраны с motion и GPU-атмосферой без случайного декора.",
      leadSecondary:
        "Также Tech Art в Unreal Engine — системы рендера, шейдеры и инструменты, часто под жёсткие VR-бюджеты.",
      leadOps:
        "Довожу сайты до продакшена: хостинг, домен, Cloudflare и сопровождение после запуска.",
      ctaWork: "Смотреть работы",
      ctaContact: "Написать",
      ctaTa: "Unreal Tech Art →",
      proofKicker: "Избранное",
      proofTitle: "Не слайды — живые кейсы",
      proofLead:
        "Интерактивные проекты, которые можно пройти руками, и живая шейдер-лаборатория для процедурных поверхностей.",
      proofAll: "Все web-работы →",
      closeTitle: "Нужен сайт, который выглядит сильно — и стабильно работает?",
      closeLead:
        "Дизайн, сборка, запуск, домен, Cloudflare, поддержка. Краткий бриф — отвечаю в Telegram.",
      closeCta: "Написать в Telegram",
      featured: {
        mochalki: {
          tag: "Магазин",
          title: "Supracor",
          body: "Полный путь покупателя: каталог, карточка, корзина, оформление.",
        },
        vesper: {
          tag: "Закрытый дом",
          title: "Vesper",
          body: "Кабаре по приглашению — программа ночи и живая книга столов.",
        },
        shikhovo: {
          tag: "Усадьба",
          title: "Шихово",
          body: "Семейная зооферма — карта, животные, билеты, домики.",
        },
        kiln: {
          tag: "Ателье",
          title: "Kiln",
          body: "Бренд медной скульптуры — жар, крафт, многостраничный живой сайт.",
        },
        studio: {
          tag: "Шейдер-лаб",
          title: "Procedural studio",
          body: "Живые WebGL-поверхности: настройка, превью, экспорт в прод.",
        },
      },
    },
    workWeb: {
      kicker: "Избранные работы · Web",
      title: "Web-работы",
      lead:
        "Полноценные многостраничные сайты и интерактивные продуктовые интерфейсы — каждый кейс можно пройти руками.",
      back: "← Работы Web",
      caseRole: "Портфолио-кейс · дизайн и интерактивный прототип",
      caseHintCarousel:
        "Листайте экраны — многостраничный кейс из реального макета.",
      caseHintLiving:
        "Кликайте разделы внутри макета — несколько страниц и живое взаимодействие.",
      caseCtaTitle: "Нужно что-то в этом духе?",
      caseCtaBody:
        "Магазины, ателье, дашборды, процедурные поверхности — плюс запуск, домен, Cloudflare и поддержка. Напишите.",
      caseCta: "Связаться",
      caseFullscreen: "На весь экран",
      caseExitFullscreen: "Закрыть",
      studio: {
        title: "Procedural shader studio",
        tags: "WebGL · Экспорт · Live lab",
      },
      categories: {
        holo: {
          title: "Holo и fluted UI",
          tags: "Поверхности · Карточки · Motion",
          lead: "Стекло, переливы и состояния контролов — продуктовые сайты, которые ощущаются физическими.",
          back: "← Holo и fluted UI",
        },
        launch: {
          title: "Полноценные сайты",
          tags: "Магазины · CRM · Многостраничники",
          lead: "Цельные кейсы — закрытые дома, магазины с корзиной, CRM-дашборды, ателье.",
          back: "← Полноценные сайты",
        },
      },
      cases: {
        "aurora-flute": {
          title: "Aurora Flute",
          tags: "Fintech · Glass UI · 2025",
        },
        "mirage-deck": {
          title: "Mirage Deck",
          tags: "Collectibles · Marketplace · 2025",
        },
        "prism-controls": {
          title: "Prism Controls",
          tags: "SaaS · Interaction · 2024",
        },
        northline: {
          title: "Northline",
          tags: "Editorial · Identity · 2025",
        },
        "folio-os": {
          title: "Folio OS",
          tags: "Workspace · System · 2024",
        },
        "kiln-identity": {
          title: "Kiln",
          tags: "Медное ателье · Brand · 2024",
        },
        mochalki: {
          title: "Supracor",
          tags: "Магазин · Корзина · Оформление",
        },
        vesper: {
          title: "Vesper",
          tags: "Закрытое кабаре · По приглашению · Live UI",
        },
        ether: {
          title: "ÉTHER",
          tags: "Аромат на заказ · Атмосфера · Звук",
        },
        "audi-rs5": {
          title: "Audi RS 5",
          tags: "Digital sculpture · Конфигуратор · 2020",
        },
        shikhovo: {
          title: "Шихово",
          tags: "Семейная ферма · Карта · Билеты",
        },
        "yy-portfolio": {
          title: "YY Portfolio",
          tags: "Личный сайт · Проекты · 5 экранов",
        },
        nordpulse: {
          title: "NordPulse",
          tags: "CRM · Аналитика · Live UI",
        },
        greenbasket: {
          title: "GreenBasket",
          tags: "Продукты · Корзина · Доставка",
        },
        "kiln-site": {
          title: "Kiln Atelier",
          tags: "Медная скульптура · Жар · Live UI",
        },
      },
    },
    portfolio: {
      kicker: "Портфолио · Web",
      title: "Избранные сайты",
      lead:
        "Плотные многостраничные кейсы — магазины, CRM, доставка продуктов, ателье, личное портфолио. Свои фото и живой интерактив там, где это важно.",
      back: "← Портфолио",
      cases: {
        mochalki: {
          audience: "Магазин · уход",
          title: "Supracor",
          tags: "Каталог · Корзина · Оформление · Live",
          lead: "Тёплый магазин ухода: каталог, карточка товара, корзина и оформление заказа.",
        },
        vesper: {
          audience: "Закрытое кабаре по приглашению",
          title: "Vesper",
          tags: "Приглашение · Программа · Столы · Live",
          lead: "Закрытый дом в Париже — программа ночи, живой зал, имена в книге.",
        },
        ether: {
          audience: "Парфюмерный дом · аромат на заказ",
          title: "ÉTHER",
          tags: "Атмосфера · Звук · ДНК · Заказ",
          lead: "Готового флакона нет — сначала атмосфера и звук, затем аромат, собранный только для вас.",
        },
        "audi-rs5": {
          audience: "Перформанс-шоурум",
          title: "Audi RS 5 Sportback",
          tags: "3D · Конфигуратор · Material data sculpture",
          lead: "Цифровая скульптура RS 5 — конфигуратор кузова и салона плюс пространственные сцены разгона, quattro и DRC.",
        },
        shikhovo: {
          audience: "Семейная зооферма",
          title: "Шихово",
          tags: "Карта · Животные · Билеты · Домики",
          lead: "Светлый семейный сайт: карта территории, фото с парка, простой выбор билетов на день.",
        },
        "yy-portfolio": {
          audience: "Личное портфолио",
          title: "YY Portfolio",
          tags: "Проекты · Обо мне · Контакты · 5 экранов",
          lead: "Светлый многостраничник — главная, витрина, кейс, обо мне, контакты.",
        },
        nordpulse: {
          audience: "B2B CRM",
          title: "NordPulse",
          tags: "Дашборд · Пользователи · Аналитика · Live",
          lead: "Интерактивный CRM: модули, выбор строк, графики по товарам и пользователям.",
        },
        greenbasket: {
          audience: "Доставка продуктов",
          title: "GreenBasket",
          tags: "Каталог · Корзина · Оформление · Фото",
          lead: "Серьёзный продуктовый магазин с качественными фото, корзиной, количеством и оформлением заказа.",
        },
        "kiln-identity": {
          audience: "Современное медное ателье",
          title: "Kiln",
          tags: "Скульптура · Жар · Металл · Live",
          lead: "Медное ателье — абстракции жара и гипотетические кованые работы.",
        },
      },
    },
    workTa: {
      kicker: "Избранные работы · Tech Art",
      title: "Unreal Tech Art",
      lead:
        "Системная работа в UE — бюджеты рендера, шейдерный свет, пайплайны и инструменты. Многое из этого шло в условиях Standalone VR.",
      lab: {
        title: "Шейдер-лаб",
        tags: "Fullscreen · Материалы · Live GLSL",
      },
      projects: {
        "mass-npc": {
          title: "Mass NPC render system",
          tags: "Vertex · Standalone VR",
        },
        scopes: {
          title: "Dual-render VR scopes",
          tags: "Forward · Mobile Multiview",
        },
        "fake-lights": {
          title: "Shader fake dynamic lighting",
          tags: "Mobile Forward · Toon",
        },
        "lbe-pipeline": {
          title: "LBE pipeline & tools",
          tags: "EUW · Python · CI/CD",
        },
      },
    },
    caseMassNpc: {
      back: "← Работы TA",
      kicker: "Vertex · Standalone VR · 2023–2026",
      title: "Mass NPC render system",
      problemTitle: "Задача",
      problem:
        "Толпы на Skeletal Mesh убивали бюджет Standalone VR. Экшен-сцены с игроками и плотным NPC не держали frame lock на Quest / Pico.",
      approachTitle: "Подход",
      approach:
        "Свой mass-render путь вместо Skeletal Mesh: сглаживание в vertex-шейдере и батчинг под Mobile / Forward — тюнинг под action load, а не пустые сцены.",
      before: "До — толпы на Skeletal Mesh",
      after: "После — custom mass render",
      resultTitle: "Результат",
      result:
        "Стабильный lock 72 FPS при 200 NPC + игроках в экшене. На старых HMD (Quest 2 / Pico 4) — с ~30 FPS при 6 игроках до ~73 FPS при 12.",
    },
    contact: {
      kicker: "Контакты",
      name: "Никита Корольков",
      role: "Веб-дизайнер · Tech Artist",
      title: "Давайте обсудим ваш проект",
      lead:
        "Открыт к сайтам, продуктовым интерфейсам, процедурным поверхностям и Tech Art на Unreal — и к запуску в прод: хостинг, домен, Cloudflare, поддержка. Быстрее всего отвечаю в Telegram.",
      back: "← Главная",
      emailLabel: "Почта",
      email: "corolkovnikita@gmail.com",
      telegramLabel: "Telegram",
      telegram: "@sprtbx",
      telegramUrl: "https://t.me/sprtbx",
      ctaTelegram: "Написать в Telegram",
      ctaEmail: "Написать на почту",
      caps: {
        "01": {
          title: "Сайты и продуктовые интерфейсы",
          body: "Магазины, системы лендингов, дашборды — ясная структура, сильный визуал, живой интерактив.",
        },
        "02": {
          title: "Motion и GPU-поверхности",
          body: "Шейдер-фоны, holo / fluted UI, экспорт готового GLSL и React.",
        },
        "03": {
          title: "Unreal Tech Art",
          body: "Системы рендера, шейдеры, пайплайны — в том числе жёсткие VR / Mobile Forward бюджеты, когда нужно.",
        },
        "04": {
          title: "Запуск и поддержка",
          body: "Хостинг, домен, Cloudflare, SSL, передача — и сопровождение, когда сайт уже в проде.",
        },
        "05": {
          title: "Как начинаем",
          body: "Короткий бриф в Telegram → объём и сроки → дизайн / прототип / запуск.",
        },
      },
    },
    studio: {
      kicker: "Web · procedural FX",
      title: "Шейдер-студия",
      lead:
        "Две комнаты: фоны на весь кадр и лаборатория логотипа — SVG в Static Noise, Mercury, Gem, Fluid Chrome, Neon или дыме.",
      back: "← Работы Web",
      rooms: "Комнаты студии",
      roomBg: "Фоны",
      roomLogo: "Лого",
      exportCode: "Экспорт кода",
      copied: "Скопировано",
      image: "Изображение",
      imageNote:
        "Опциональная локальная текстура для Blockify / Pixels / Fluted. Остаётся в браузере — никуда не загружается.",
      svg: "Лого SVG",
      svgNote:
        "Только локальный SVG — растрируется в браузере, никуда не уходит. По умолчанию — знак ATLAS.",
      chooseSvg: "Выбрать SVG",
      replaceSvg: "Заменить SVG",
      useDefault: "Знак ATLAS",
      chooseImage: "Выбрать файл",
      replaceImage: "Заменить файл",
      clear: "Очистить",
      colors: "Цвета",
      params: "Параметры",
      exportFragment: "Экспорт · fragment",
      exportReact: "Экспорт · React",
      hintSmoke: "Тяните, чтобы задать направление — после остановки дым продолжает дрейф",
      hintInteractive: "Мягкое влияние курсора — без жёсткого варпа",
      hintLogo: "Наведите на знак — эффект реагирует на курсор",
      hintStatic: "Магнитная кучка · хвост · гравитация · полёт домой",
      logoHints: {
        "static-noise": "Магнитная кучка · хвост · гравитация · полёт домой",
        mercury: "Жидкий металл · тяните — продолжает течь",
        gem: "Грани кристалла · орбитальный свет · мягкое свечение края",
        "fluid-chrome": "Жидкий хром внутри знака · мешайте курсором",
        smokey: "Дым внутри силуэта · тяните, чтобы мешать",
        neon: "Переливная неоновая трубка · bloom · мерцание",
      },
      hintImageOn: "Локальное изображение",
      hintImageOff: "Опциональное локальное изображение (не загружается)",
      hintAmbient: "Фоновая анимация",
      errImageType: "Выберите изображение (png / jpg / webp)",
      errImageRead: "Не удалось прочитать изображение",
      errSvgType: "Выберите файл SVG",
      errSvgRead: "Не удалось прочитать SVG",
    },
    shadersLab: {
      kicker: "Lab · Tech Art",
      title: "Шейдер-лаб",
      lead:
        "Полноэкранный multipass и превью материалов — Rain Forest, облака, fake lights. Живое редактирование GLSL.",
      back: "← Tech Art",
    },
  },
} as const;

export type TranslationTree = (typeof translations)["en"];

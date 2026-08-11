export type Locale = "en" | "ru";

export const translations = {
  en: {
    meta: {
      title: "ATLAS — Nikita Korolkov · Web Design & Tech Art",
      description:
        "Nikita Korolkov — high-craft web design, product interfaces, and procedural shader surfaces. Also Standalone VR Tech Art.",
    },
    nav: {
      ta: "TA",
      web: "Web",
      shaders: "Shaders",
      studio: "Studio",
      portfolio: "Portfolio",
      contact: "Contact",
    },
    home: {
      kicker: "Web Design · Shaders · Tech Art",
      lead:
        "I craft web experiences where motion, type, and GPU effects feel inevitable — with Standalone VR systems that still hold 72 FPS.",
      ctaWeb: "Full websites",
      ctaStudio: "Shader studio →",
      ctaTa: "VR / Tech Art",
      lane1Tag: "01 · Web",
      lane1Title: "Full sites & systems",
      lane1Body:
        "Ecommerce, CRM, atelier, personal portfolios — interactive multi-page cases with real imagery, not empty launch shells.",
      lane1Go: "Open websites",
      lane2Tag: "02 · Studio",
      lane2Title: "Shader studio",
      lane2Body:
        "Smoke, liquid, holo, fluted glass — tweak live backgrounds and export production-ready GLSL / React.",
      lane2Go: "Open studio",
      lane3Tag: "03 · TA",
      lane3Title: "Realtime VR systems",
      lane3Body:
        "Mass NPC, scopes, fake lights, LBE tooling — Mobile Forward work measured in frame time, not moodboards.",
      lane3Go: "View TA work",
    },
    workWeb: {
      kicker: "Selected work · Web",
      title: "Digital craft",
      lead:
        "Interactive product surfaces and full multi-page websites — each with its own audience and visual language.",
      back: "← Web work",
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
          lead: "Complete site cases — ecommerce with cart, CRM dashboards, personal portfolios, atelier storefronts.",
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
          title: "Mochalki — Supracor",
          tags: "Ecommerce · Cart · Checkout",
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
          title: "Mochalki — Supracor",
          tags: "Catalog · Cart · Checkout · 5 screens",
          lead: "Warm retail storefront with catalog, product page, cart and checkout flow.",
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
      title: "VR systems",
      lead:
        "Standalone / Mobile Forward — render budgets, shader lighting, and tooling that survive venue load.",
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
          title: "LBE VR pipeline & tools",
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
      role: "Web Designer · Tech Artist",
      title: "Build the frame.\nOwn the surface.",
      lead:
        "Open for high-craft web and Standalone VR Tech Art — from product interfaces to procedural brand surfaces and render systems.",
      emailLabel: "Email",
      email: "corolkovnikita@gmail.com",
      telegramLabel: "Telegram",
      telegram: "@sprtbx",
      telegramUrl: "https://t.me/sprtbx",
      ctaStudio: "Web shader studio",
      ctaShaders: "TA shaders →",
      caps: {
        "01": {
          title: "Web product design",
          body: "Systems, motion, and GPU backgrounds that feel ownable.",
        },
        "02": {
          title: "Procedural surfaces",
          body: "Shader studio, holo / fluted UI, export-ready GLSL and React.",
        },
        "03": {
          title: "VR Tech Art",
          body: "Mass NPC, BasePass, scopes, Multiview, Mobile Forward lock.",
        },
        "04": {
          title: "Ship & scale",
          body: "CI/CD, UE5 migrations, −50% build size, production exports.",
        },
      },
    },
    studio: {
      kicker: "Web · procedural FX",
      title: "Shader studio",
      lead:
        "Abstract surfaces with color controls — interactive or ambient. Blockify / Pixels / Fluted can use a local image.",
      exportCode: "Export code",
      copied: "Copied",
      image: "Image",
      imageNote:
        "Optional local texture for Blockify / Pixels / Fluted. Stays in the browser — never uploaded.",
      chooseImage: "Choose image",
      replaceImage: "Replace image",
      clear: "Clear",
      colors: "Colors",
      params: "Parameters",
      exportFragment: "Export · fragment",
      exportReact: "Export · React",
      hintSmoke: "Drag to aim — when you stop, it keeps drifting that way",
      hintInteractive: "Soft cursor influence — no hard warp",
      hintImageOn: "Local image",
      hintImageOff: "Optional local image (never uploaded)",
      hintAmbient: "Ambient animation",
      errImageType: "Pick an image file (png / jpg / webp)",
      errImageRead: "Could not read image",
    },
    shadersLab: {
      kicker: "Lab · Tech Art",
      title: "Shader lab",
      lead:
        "Fullscreen multipass and material previews — Rain Forest, clouds, fake lights. Edit GLSL live.",
    },
  },
  ru: {
    meta: {
      title: "ATLAS — Никита Корольков · Web Design & Tech Art",
      description:
        "Никита Корольков — веб высокого крафта, продуктовые интерфейсы и procedural shader-поверхности. Также Standalone VR Tech Art.",
    },
    nav: {
      ta: "TA",
      web: "Web",
      shaders: "Шейдеры",
      studio: "Студия",
      portfolio: "Портфолио",
      contact: "Контакты",
    },
    home: {
      kicker: "Веб-дизайн · Шейдеры · Tech Art",
      lead:
        "Делаю веб, где движение, типографика и GPU-эффекты ощущаются неизбежными — и Standalone VR-системы, которые держат 72 FPS.",
      ctaWeb: "Полноценные сайты",
      ctaStudio: "Шейдер-студия →",
      ctaTa: "VR / Tech Art",
      lane1Tag: "01 · Web",
      lane1Title: "Полноценные сайты и системы",
      lane1Body:
        "Ecommerce, CRM, ателье, личные портфолио — интерактивные многостраничники с реальными фото, не пустые launch-оболочки.",
      lane1Go: "Открыть сайты",
      lane2Tag: "02 · Студия",
      lane2Title: "Шейдер-студия",
      lane2Body:
        "Smoke, liquid, holo, fluted glass — настраивайте live-фоны и экспортируйте готовый GLSL / React.",
      lane2Go: "Открыть студию",
      lane3Tag: "03 · TA",
      lane3Title: "Realtime VR-системы",
      lane3Body:
        "Mass NPC, прицелы, fake lights, LBE-тулинг — Mobile Forward, где мера — frame time, а не мудборды.",
      lane3Go: "Смотреть TA",
    },
    workWeb: {
      kicker: "Избранные работы · Web",
      title: "Digital craft",
      lead:
        "Интерактивные product-поверхности и полноценные многостраничные сайты — у каждого своя ЦА и визуальный язык.",
      back: "← Работы Web",
      studio: {
        title: "Procedural shader studio",
        tags: "WebGL · Экспорт · Live lab",
      },
      categories: {
        holo: {
          title: "Holo и fluted UI",
          tags: "Поверхности · Карточки · Motion",
          lead: "Стекло, iridescence и состояния контролов — product-сайты, которые ощущаются физическими.",
          back: "← Holo и fluted UI",
        },
        launch: {
          title: "Полноценные сайты",
          tags: "Магазины · CRM · Многостраничники",
          lead: "Цельные кейсы — ecommerce с корзиной, CRM-дашборды, личные портфолио, ателье.",
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
          title: "Mochalki — Supracor",
          tags: "Ecommerce · Корзина · Checkout",
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
        "Плотные многостраничные кейсы — магазины, CRM, доставка продуктов, ателье, личное портфолио. Локальные фото и живой интерактив.",
      back: "← Портфолио",
      cases: {
        mochalki: {
          audience: "Ecommerce · уход",
          title: "Mochalki — Supracor",
          tags: "Каталог · Корзина · Checkout · 5 экранов",
          lead: "Тёплый retail-магазин: каталог, карточка товара, корзина и оформление заказа.",
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
          lead: "Интерактивный CRM — модули, выбор строк, графики по товарам и пользователям.",
        },
        greenbasket: {
          audience: "Доставка продуктов",
          title: "GreenBasket",
          tags: "Каталог · Корзина · Checkout · Фото",
          lead: "Серьёзный продуктовый магазин с hi-res фото, add-to-cart, количеством и checkout.",
        },
        "kiln-identity": {
          audience: "Современное медное ателье",
          title: "Kiln",
          tags: "Скульптура · Жар · Металл · Live",
          lead: "Современное медное ателье — абстракции жара и гипотетические кованые работы.",
        },
      },
    },
    workTa: {
      kicker: "Избранные работы · Tech Art",
      title: "VR-системы",
      lead:
        "Standalone / Mobile Forward — render budgets, шейдерный свет и тулинг, которые выдерживают venue load.",
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
          title: "LBE VR pipeline & tools",
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
      title: "Собери кадр.\nВладей поверхностью.",
      lead:
        "Открыт к high-craft web и Standalone VR Tech Art — от продуктовых интерфейсов до procedural brand-поверхностей и render-систем.",
      emailLabel: "Почта",
      email: "corolkovnikita@gmail.com",
      telegramLabel: "Telegram",
      telegram: "@sprtbx",
      telegramUrl: "https://t.me/sprtbx",
      ctaStudio: "Web shader studio",
      ctaShaders: "TA шейдеры →",
      caps: {
        "01": {
          title: "Веб product design",
          body: "Системы, motion и GPU-фоны, которые ощущаются своими.",
        },
        "02": {
          title: "Procedural-поверхности",
          body: "Шейдер-студия, holo / fluted UI, экспорт GLSL и React.",
        },
        "03": {
          title: "VR Tech Art",
          body: "Mass NPC, BasePass, прицелы, Multiview, Mobile Forward lock.",
        },
        "04": {
          title: "Ship & scale",
          body: "CI/CD, миграции UE5, −50% размера билда, production-экспорт.",
        },
      },
    },
    studio: {
      kicker: "Web · procedural FX",
      title: "Шейдер-студия",
      lead:
        "Абстрактные поверхности с контролем цвета — interactive или ambient. Blockify / Pixels / Fluted могут брать локальное изображение.",
      exportCode: "Экспорт кода",
      copied: "Скопировано",
      image: "Изображение",
      imageNote:
        "Опциональная локальная текстура для Blockify / Pixels / Fluted. Остаётся в браузере — никуда не загружается.",
      chooseImage: "Выбрать файл",
      replaceImage: "Заменить файл",
      clear: "Очистить",
      colors: "Цвета",
      params: "Параметры",
      exportFragment: "Экспорт · fragment",
      exportReact: "Экспорт · React",
      hintSmoke: "Тяните, чтобы задать направление — после остановки дым продолжает дрейф",
      hintInteractive: "Мягкое влияние курсора — без жёсткого варпа",
      hintImageOn: "Локальное изображение",
      hintImageOff: "Опциональное локальное изображение (не загружается)",
      hintAmbient: "Ambient-анимация",
      errImageType: "Выберите изображение (png / jpg / webp)",
      errImageRead: "Не удалось прочитать изображение",
    },
    shadersLab: {
      kicker: "Lab · Tech Art",
      title: "Шейдер-лаб",
      lead:
        "Fullscreen multipass и превью материалов — Rain Forest, облака, fake lights. Живое редактирование GLSL.",
    },
  },
} as const;

export type TranslationTree = (typeof translations)["en"];

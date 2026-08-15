# ATLAS Playbook

Документ с фишками, техниками и техрешениями портфолио ATLAS (`ta-portfolio`).  
Тот же материал доступен агенту как Cursor Skill: `atlas-portfolio-playbook` (личный скилл, работает во всех репозиториях).

## Зачем

Чтобы в новых проектах не изобретать заново:

- living mini-sites и превью 16:9
- framing кейсов
- shop-прототипы внутри портфолио
- live UI и анимации (tilt, стейты, корзина, CRM)
- brand-first героев и WebGL-атмосферу
- `publicUrl` / GitHub Pages

## Как пользоваться (агент)

1. При задаче «портфолио-кейс / living / превью сайта / shop demo» — читать скилл `atlas-portfolio-playbook`.
2. Детали и таблица кейсов — `reference.md` рядом со скиллом или этот файл + таблицы ниже.
3. Исходники-эталоны: `C:/Users/Medfly/ta-portfolio`.

## Матрица «что → когда»

| Фишка | Где уместно | Стиль / тип |
|-------|-------------|-------------|
| Living `full` + `thumb` | Портфолио web-кейсы | Интерактивный прототип бренда |
| Chrome (точки + URL) | Демо «сайт в окне» | Ecommerce, atelier, CRM |
| Превью **16:9** + scale | Карточки работ, home proof | Любой living в сетке |
| Case bar слева + viewport | Полный living-кейс | Не для carousel |
| Carousel кейс | Много экранов из макета без кода shop | Статика / презентация |
| Brand-first + smoke/liquid | Home студии, craft-бренды | Тёмный portfolio / материал |
| GPU в full, фото в thumb | Много карточек с WebGL | Kiln-like |
| Living shop flow | Launch / DTC / grocery | Каталог → PDP → cart → checkout |
| Локальные токены бренда | Светлый shop внутри тёмного host | GreenBasket / Supracor |
| `publicUrl` + Vite base | Любой Pages SPA | Всегда для `public/` |
| Shell i18n vs COPY в сайте | RU/EN портфолио | Хост vs бренд-демо |
| Live UI (tilt, states, cart, CRM) | Holo / shop / dashboard | Интерактив *есть* продукт |
| Procedural atmosphere | Shader lab (`liquid`, `holo`, `smoke`…) | Герои, holo, craft |

## Жёсткие дизайн-правила

1. Первый экран — одна композиция, не дашборд.
2. Бренд — hero-level сигнал, не только в навбаре.
3. Hero full-bleed; без inset-карточек героя.
4. Бюджет героя: бренд, один заголовок, одна фраза, CTA, один визуальный якорь.
5. Без плавающих бейджей на hero-медиа.
6. Cards — только для взаимодействия.
7. Не дефолтить в purple-градиенты, cream+terracotta, «газетную» вёрстку.
8. Motion with purpose — только смена состояния, не декоративный loop.
9. Live UI в `full`; на карточке — замороженная 16:9 композиция.

## Паттерны (кратко)

### A. Living dual-mode

Один React-сайт: `mode: "full" | "thumb"`.  
Thumb → только home-композиция, `overflow: hidden`, меньше UI.  
Реестр: `webCases` + map в `LivingSites.tsx`.

### B. 16:9 virtual viewport

Контейнер `aspect-ratio: 16 / 9`.  
Внутри `.work-card__live > *` на ~177.78% и `scale(0.5625)`, origin top-left.  
`pointer-events: none` на live-слое — кликабельна карточка-ссылка.

### C. Case bar

Назад + title + role слева; Contact справа. Один meta-line. Фрейм на остаток viewport.

### D. Shop living

`home | catalog | product | cart | checkout`, локальный cart, свои CSS-переменные.  
Thumb = hero-композиция (как задумано для кадра), не сетка товаров.

### E. GPU → static в thumb

Полный кейс — шейдер/liquid; в сетке — статичное фото героя (перф + читаемый кадр).

### F. Assets

Только через `publicUrl("portfolio/...")`. Base Vite + basename роутера.

### K. Live UI и анимации

**Live UI** — демо, которым можно пользоваться: корзина, чипы, PDP, модули CRM, tilt-карты, стейты кнопок.

| Рецепт | Когда | Как |
|--------|-------|-----|
| Page fade ~280ms | Смена страницы внутри living | `key={page}` + opacity/Y |
| Hover lift 120–250ms | Карточки товаров / featured | `translateY(-1px)`, img scale |
| CSS-var tilt | Коллекционки, holo | `--mx/--my` + perspective |
| State machine | SaaS-контролы (Prism) | `idle → hover → armed → done` |
| Shop state | Ecommerce | Cart, stepper, chips — React state |
| Dashboard | CRM (NordPulse) | Переключение модулей, select row |
| GPU atmosphere | Kiln / home smoke | Только full; thumb = фото |

Не крутить WebGL на всех превью в сетке. На `.work-card__live` — `pointer-events: none`.

### L. Shader lab

Две студии: **web** `/lab/web` и **TA** `/lab/shaders`. В продуктах брать эффект из каталога, не писать новый шейдер с нуля.

**Web (`webEffects.ts`) — атмосфера бренда**

| id | Когда |
|----|--------|
| `smoke` | Тёмный studio home (ATLAS). Отдельный движок `WebSmokeCanvas`. |
| `liquid` | Металл / craft. Kiln = пресет `CopperLiquidBg`. |
| `holo` | Фольга, collectibles, holo UI. |
| `wave` / `bands` | Спокойный glass / finance. |
| `rings` | Neon pulse, дропы. |
| `mesh` | HUD / lab overlay. |
| `blockify` / `pixels` / `fluted` | Стилизация **фото** (`needsImage`). |

Встройка: `getWebEffect(id)` + `defaultValues` + override палитры → `WebEffectCanvas`. Smoke — только `WebSmokeCanvas`.

**TA — lookdev, не маркетинг**

- Fullscreen: `rain-forest` (multipass), `clouds-local`, `fake-lights`
- Materials: `toon-outline`, `lanterns`

Правило: один GPU-слой на экран; в сетке карточек — static thumb.

## Эталонные файлы

| Тема | Путь |
|------|------|
| Данные кейсов | `src/data/webCases.ts` |
| Living router | `src/pages/web/living/LivingSites.tsx` |
| Supracor shop | `src/pages/web/living/MochalkiSite.tsx` |
| Kiln | `src/pages/web/living/KilnAtelierSite.tsx` |
| GreenBasket | `src/pages/web/living/GreenBasketSite.tsx` |
| Case page | `src/pages/web/WebCasePage.tsx` |
| Home | `src/pages/HomePage.tsx` |
| Live scale CSS | `src/App.css` → `.work-card__live` |
| publicUrl | `src/lib/publicUrl.ts` |
| Smoke | `src/lab/WebSmokeCanvas.tsx` |
| Copper liquid | `src/pages/web/living/CopperLiquidBg.tsx` |
| Web FX catalog | `src/shaders/webEffects.ts` |
| Web studio | `src/pages/WebShadersPage.tsx` |
| TA studio | `src/pages/ShadersPage.tsx` |
| Tilt / Prism live UI | `src/pages/web/living/LivingSites.tsx` |
| CRM live | `src/pages/web/living/NordPulseSite.tsx` |

## Чеклист нового living-кейса

1. Запись в `webCases` (`kind`, `accent`, `livingId` при необходимости).
2. `*Site.tsx` с dual-mode + chrome + локальный COPY.
3. Регистрация в `SITES`.
4. Сначала сверстать **thumb 16:9** (что должно быть на карточке).
5. Full: остальные страницы / секции.
6. Все ассеты через `publicUrl`.
7. При WebGL — брать id из shader lab (`liquid`, `holo`, `smoke`…), не писать новый стек.
8. При WebGL в сетке — static fallback для thumb.
9. Если кейс про live UI — заложить реальное состояние (не CSS-only «как будто кликается»).

## Подробный каталог

См. персональный скилл:  
`~/.cursor/skills/atlas-portfolio-playbook/reference.md`

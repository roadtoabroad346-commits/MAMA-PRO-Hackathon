# Текущая версия: ограниченный пилот 55–67

> **GitHub checkpoint (11.11.2026):** код и документы реализованных этапов до 67-й фазы сохранены в удалённой ветке [`phases-0-67`](https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon/tree/phases-0-67), начиная с коммита `a52ff18085f45caa0e2cdaa1743438a133449be5`. Ветка по умолчанию `phase-0-audit` историческая и не содержит актуальную реализацию. Возможные незакоммиченные изменения другой сессии Codex этим checkpoint не подтверждаются.

Существующий CORE сохранён, добавлены schema-backed synthetic server workflows и public PWA. **DEMO/PILOT_TEST only; LIVE_BLOCKED.** Подробная передача каждой фазы: [HANDOVER_55_67](docs/HANDOVER_55_67.md), проверки: [QA_RESULTS](docs/QA_RESULTS.md), реальные условия: [LIVE_READINESS](docs/LIVE_READINESS.md).

Node 24.22+ (node:sqlite). `npm ci`, затем в двух терминалах:

```bash
PILOT_MODE=PILOT_TEST npm run pilot
npm run dev
```

Открыть `http://localhost:5173/pilot` для тестовых аккаунтов. CORE `/specialists`, explicitly saved synthetic snapshots `/saved`. Данные пилота — только вымышленные; реальные отправки/реальные аккаунты/production hosting отсутствуют. `NODE_ENV=production` блокирует test backend. Не включать реальный пилот изменением fixtures или флага.

Проверки: `npm run check`; `npm run build`; `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2`; `npx playwright test --config playwright.pilot.config.ts`; `npx playwright test --config playwright.offline.config.ts`; `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2`.

Последние два pilot/offline конфига используют локальный `/usr/bin/chromium`; если браузер в другом месте, обновите конфиг окружения. Private API не кэшируется, private offline edits не поддерживаются. Напоминания — только in-app inbox при работающем test server, не push/email. Production static CORE: `npm run build && npm start`; /api/ на статическом сервере недоступен, ложного сохранения нет.

---

Ниже историческая документация исходного демо:

# Қолдау.Жол — фазы 28–35

Актуальная ветка разработки: **phases-28-35**. Выполнены единый проверяемый поиск по услугам и S01–S03 поверх сохранённой реализации фаз6–14. Это синтетическое локальное демо; сайт этой задачей не публиковался.

[Передача фазе36](docs/PHASES_28_35_HANDOFF.md) · [Контракты](docs/DOMAIN_CONTRACTS.md) · [Matching](docs/MATCHING_ENGINE_SPEC.md) · [QA](docs/QA_RESULTS.md) · [AC](docs/REQUIREMENTS_TRACEABILITY.md).

Команды: `npm ci`, `npm run check`, `npm run build`, `npm run dev`. Dev browser: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2`. Release browser (после build, порт5173 свободен): `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2`.

Исторические материалы и ZIP фаз13–14 сохранены ниже; они не заменяют текущую сборку. Фазы36+ готовыми не объявляются.

---

# Қолдау.Жол — приложение фазы 13 и материалы защиты фазы 14

> **Для следующей фазы:** [восстановить реализацию из GitHub](START_NEXT_PHASE.md). Пустой checkout не означает отсутствия приложения. Актуальная ветка — `phase-14-defense`, зафиксированный результат — `ce529dbcfa4e25ea6e21e9e4d6246094ef8d6aac`. Исторические записи о пустом репозитории не описывают текущую реализацию.

Релиз **phase13-968e7ea9c5d3**, основа `phase-12-qa`, коммит
`b9b806f4ab34c301af6357eb414988ae5fc2079f`. Продуктовые исходники и lockfile не изменены.
Сайт не опубликован, облачные ресурсы не создавались.

Для продолжения разработки начать с [передачи следующей фазе](docs/NEXT_PHASE_HANDOFF.md).
Готовый проверенный ZIP с `dist` и видео сохранён в [releases](releases/phase13-968e7ea9c5d3/README.md).

[Протокол проверок](docs/RELEASE_CHECKLIST.md) · [Инструкция демонстратора](docs/DEMO_RUNBOOK.md) ·
[Manifest и хеши](docs/release/manifest.json). Готовность подтверждена для ограниченного
локального демо. Полная ручная приёмка P0 остаётся незавершённой.

## Запуск и build

Нужны Node.js и Chromium/Chrome с разрешёнными IndexedDB/sessionStorage.
Проверено: Linux, Node **24.22.1**, npm **11.9.0**, Chromium **156.0.8078.79**.
Vite требует Node 20.19+ или 22.12+; рекомендуется проверенная версия 24.22.1.
Из корня проекта:

```sh
npm ci
npm run check
npm run build
npm run demo
```

Открыть **http://127.0.0.1:5173/**. `demo` (также `start`) запускает Node-сервер
готового `dist` с SPA fallback, без Vite и `node_modules` в runtime. Без `dist/index.html`
запуск завершается ошибкой. Остановить: Ctrl+C.

Готовый резерв из архива запускается без установки зависимостей:

```sh
node scripts/serve-release.mjs
```

Нужны только Node, `dist/` и `scripts/serve-release.mjs`. Такой запуск проверен отдельно
без `src`, `package.json` и `node_modules`. `file://` не поддерживается.
`npm run dev` предназначен для разработки и не является проверкой production build.

## Check

```sh
npm run check
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2
node scripts/audit-release.mjs
sha256sum -c docs/release/source.sha256
sha256sum -c docs/release/build.sha256
```

`check`: TypeScript + 76 unit/integration. `check:release`: 18 браузерных проверок **dist**,
включая A/B/C RU/KK, прямые маршруты, reload, assets, сохранение/отмену и reset.
Перед проверкой остановить ручной `demo`: сервер теста занимает порт 5173.
Укажите свой путь к Chrome/Chromium в `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
При отсутствии браузера для тестов: `npx playwright install chromium` (нужен сетевой доступ).
Для PowerShell задайте переменную отдельно через `$env:PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`;
Windows этой фазой не проверен. `sha256sum` — команда Linux; на других ОС используйте SHA-256 утилиту.

Старый `npm run test:e2e` запускает dev server и сохраняется для разработки.
Результаты фазы 12 не подменяют текущий [протокол релиза](docs/RELEASE_CHECKLIST.md).
`audit-release.mjs` перезаписывает manifest с текущим HEAD. Для проверки сохранённого
релиза без изменений используйте команды `sha256sum -c`; исходный manifest хранит основу фазы 12.

## Demo и reset

Пошаговые A/B/C, финальные действия и резерв — [DEMO_RUNBOOK](docs/DEMO_RUNBOOK.md).
Все поля и ожидаемые ID — [DEMO_SCENARIOS.json](docs/DEMO_SCENARIOS.json).

Перед каждым сценарием закройте остальные вкладки приложения. На `/privacy`:
«Очистить демозапросы на этом устройстве» → «Удалить демозапросы» → дождаться подтверждения.
Эта операция сохраняет язык и поиск. Для полного чистого старта выполнить в консоли браузера
на том же origin:

```js
sessionStorage.removeItem('qoldau.demo-search');
sessionStorage.removeItem('qoldau.demo-request-attempt');
localStorage.removeItem('qoldau.locale');
location.replace('/');
```

После перезагрузки: RU, пустые параметры, сравнение пустое, каталог 12 специалистов;
прежний request ID показывает отсутствие записи. Чужие ключи хранилища не удаляются.
Альтернатива — новый отдельный профиль браузера. Обычная новая вкладка сохраняет IndexedDB
и locale; один только reload состояние не очищает.

## Конфигурация и SPA fallback

| Параметр | Значение / назначение |
|---|---|
| output / base | `dist/`, корень `/` |
| адрес | `127.0.0.1`, порт `5173`; только loopback |
| `PORT` | необязательный порт, например `PORT=5175 npm run demo`; другой порт — новый origin |
| `.env`, внешние ключи, backend | не требуются; `.env*` отсутствуют |
| каталог / правила | `src/data/catalog.json`, **catalog-v1 / rules-v1**, 12 специалистов, 20 услуг |
| demoClock | **2026-11-14T12:00:00+05:00**, фиксированные синтетические часы актуальности |
| locale | `qoldau.locale` в localStorage; RU по умолчанию |
| поиск | `qoldau.demo-search` в sessionStorage; TTL 2 часа |
| попытка запроса | `qoldau.demo-request-attempt` в sessionStorage |
| requests | IndexedDB `qoldau-demo-v1`, store `requests`, TTL 7 дней от реального создания |
| тестовый браузер | `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, только тесты |
| запись | `RECORD_DEMO=1`, `PLAYWRIGHT_BROWSERS_PATH`, только инструменты проверки |

При **отдельно порученном** размещении сервер должен отдавать файлы `dist` с верным MIME;
GET/HEAD маршрутов BrowserRouter должны возвращать `index.html`, включая `/route`,
`/route/review`, `/specialists`, `/specialists/:id`, `/compare`, `/request/:offerId`,
`/request-status/:id`, `/privacy`, `/about-demo` и неизвестный маршрут без расширения.
Несуществующий `/assets/*.js` должен вернуть 404, а не HTML. HTTP методы записи локальный
сервер отклоняет с 405. Прямой вход и reload должны работать без предварительного открытия главной.
Вне localhost необходим HTTPS для secure-context API. Подпуть требует отдельной конфигурации
и повторной проверки. Конфигурация провайдера и deployed fallback не проверялись.

## Ограничения

Все специалисты вымышлены. Нет реальной отправки/записи, авторизации, внешних AI/API или
аналитики. Не вводить данные семей. Известные сигнатуры секретов в исходниках/сборке
не обнаружены; это ограниченный scan, а не гарантия отсутствия любого возможного секрета.
В пользовательском production-сценарии загружаются только локальные JS/CSS/JSON;
dev markers и sourcemaps не обнаружены.

Каталог и порядок A/B/C детерминированы. ID запроса/ключ идемпотентности — случайные UUID;
время создания, изменения и TTL используют реальные часы. Полностью неизменяемых runtime-данных нет.
ID S01–S12/O01–O24 фиксированы; request ID читается после сохранения, затем проверяется тот же ID.
Сравнение хранится в памяти и очищается при полном reload. Requests доступны только в своём origin/профиле.

Screen reader, настоящий browser zoom, физическая мобильная клавиатура/safe-area,
проверка родителем и редактура KK носителем остаются **NOT RUN** из фазы 12.
Minor: вертикальная структура compare, одна статичная поза маскота, KK-даты Intl.
Firefox/Safari/WebKit и физические устройства не проверены. Полный P0/live — **NO-GO**.
Это web app без service worker/PWA; локальный HTTP-сервер нужен и без интернета.

История: [README фазы 12](docs/README_PHASE12.md), [QA_RESULTS](docs/QA_RESULTS.md),
[прослеживаемость требований](docs/REQUIREMENTS_TRACEABILITY.md).

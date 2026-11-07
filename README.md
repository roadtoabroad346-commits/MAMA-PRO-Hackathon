# Қолдау.Жол — демонстрационный релиз, фаза 13

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

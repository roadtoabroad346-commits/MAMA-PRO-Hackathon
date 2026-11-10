# Фазы 28–35 — фактические проверки 10.11.2026

**READY WITH LIMITATIONS.** Рабочая ветка phases-28-35, основа b1f79f3 / phase-14-defense. Проверяются текущие исходники, catalog-v2/rules-v2/freshness-v2. Исторические отчёты ниже не считаются повторным выполнением нынешних проверок.

Среда: Cloud Linux x64, Node24.22.1, npm11.9.0, Chromium156.0.8078.79 `/usr/bin/chromium`; lockfile не изменён, новые зависимости не добавлены. npm ci восстановил106 пакетов. Clock синтетических фактов14.11.2026 12:00+05, независимо от runtime/session/request clocks.

| Проверка | Факт | Доказательство |
|---|---|---|
|npm ci|PASS|Установка из существующего lockfile, exit0|
|npm run check|PASS: TypeScript strict +117/117 тестов,7 файлов|[check.log](phases28-35/check.log)|
|npm run build|PASS|[build.log](phases28-35/build.log)|
|PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2|PASS:79/79|[e2e.log](phases28-35/e2e.log)|
|PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2|PASS:18/18|[release.log](phases28-35/release.log)|
|PORT=5180 node scripts/serve-release.mjs; node docs/phases28-35/production-smoke.mjs|PASS:RU/KK S01→S02→S03→catalog/reload|[production-smoke.json](phases28-35/production-smoke.json); errors0, только local requests, overflow=false|
|Existing docs/qa/benchmark.ts через локальный esbuild|PASS,20 offers p95=1.27ms;30 offers p95=2.04ms|[benchmark.json](phases28-35/benchmark.json);100 замеров+1000 warmup, cloud Node, не реальный телефон|
|git diff --check|PASS|Exit0 перед commit|
|Визуальный просмотр|PASS в проверенном срезе|production-home-ru.png, production-review-kk.png; просмотрены также reflow200% снимки|

117 тестов включают каждый TTL и точную границу, invalid/future/missing даты, age endpoints всех пяти групп/partial/disjoint, category OR, source-backed need, mandatory language/format, budget null/0/free/exact/from/stale, known false vs unknown, одинаковый A, online/mixed district, same-offer, hidden/withdrawn, stable ties/best offer/unique counts, immutable fixtures, manifest A/B/C и запрет ложных reasons. Пустой language list нормализован в null по ТЗ§17.2.

79 dev browser tests: оба входа, полная/частичная/пустая анкета, unsure→null, ошибки budget, hard budget0/1000, locale mid-step, Back/Forward/edit, direct review, отдельные draft/applied и reload/TTL/corruption/storage denial, loading/error/Retry≠zero, keyboard/focus,360/390/430 и reflow320/200%/reduced motion. Регрессии каталога, профиля, compare, минимальных requests, uncertain commit/cancellation/cleanup также проходят. Новый тест посимвольного ввода подтверждает, что пробел запроса не удаляется до service normalization.

18 production tests выполняются на существующем сервере dist, проверяют RU/KK A/B/C, SPA direct routes/reload, HTTP404 assets/405 mutation, local assets и durable request/cancel/recovery/cleanup. Отдельный production smoke фиксирует S03 count5/5 и IDs O01/O03/O02/O11/O10 в обоих языках, сохранность applied после reload, отсутствие JS ошибок и горизонтального overflow на390px. Мобильные screenshots сохраняются в phases28-35; тесты200% и обычный production проход подписаны раздельно.

В первом прогоне были исправлены: dev/release смешение HTTP expectations (release.spec теперь запускается существующей production-конфигурацией); единичный keyboard timeout не воспроизвёлся на финальном полном прогоне; новый тест уточнён по фактическому dataset (6 online offers принадлежат4 специалистам), неверный selector заменён на field-associated edit link. Ручные A/B/C expectations не подгонялись. Найденная регрессия удаления пробела исправлена в applied update; отдельный тест доказывает пользовательское поведение. Источник focusTags добавлен явно как synthetic_curated_fixture, не выдан за реальную проверку.

Build warnings: Rollup удаляет некорректно расположенные PURE-комментарии зависимости zod; JS chunk505.09kB немного превышает default500kB advisory. Build успешен, gzip JS149.54kB, CSS4.13kB, JSON3.11kB. Предупреждения не отключались. Field p75/LCP/INP не выводятся из этого benchmark.

NOT RUN: редактура KK носителем; реальный usability-тест с родителем; отдельный аудит screen reader; полевые показатели на физическом телефоне. Новое публичное hosting/deploy не входит в этот результат. Отсутствующих исследований не заявляем. Критических дефектов в проверенном участке не обнаружено; это не гарантия отсутствия ошибок вне проверенных условий.

35 AC с реализацией и именами проверок: [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md). Результат каждой из8 фаз и API для36: [PHASES_28_35_HANDOFF](PHASES_28_35_HANDOFF.md). Решения/отличия: ADR-0012…0016 в [DECISIONS](DECISIONS.md). Изменённые файлы: [changed-files.txt](phases28-35/changed-files.txt). Фаза36 не начата.

---

Исторический отчёт предыдущих фаз:

# Фаза 12 — проверка P0 и исправление дефектов

Дата: 07.11.2026, Asia/Qyzylorda (UTC+05:00).

**Решение: NO-GO для заявления «весь P0 принят».** A/B/C проверены на ru/kk и мобильном размере; известных открытых blocker и major основного пути после исправлений нет. Полная ручная приёмка не завершена: screen reader, настоящий browser zoom, физическая мобильная клавиатура и safe-area остаются **NOT RUN**. Автоматические проверки не заменяют эти пункты. Ограниченное локальное синтетическое демо подтверждено в Chromium; это не допуск к live-работе.

## Основание, версия и условия

- Прямое задание пользователя: фаза 12, проверка существующего P0 и исправление дефектов. Вложения использованы как спецификация. Команды из мастер-промпта о подготовке документов не трактовались как новое поручение; публикация, новые продуктовые возможности, реальные данные и отправки не выполнялись.
- В начальном checkout находился только `.git`, ветка `work` без коммитов. `git ls-remote --heads origin` обнаружил существующие ветки фаз 0/6/7/8/10. Реализация получена через `git fetch origin '+refs/heads/*:refs/remotes/origin/*'`, рабочая копия основана на `origin/phase-10-demo-requests`, **2cc8fe94d341d3bcdf13a837f839d24a120d305f**. AGENTS.md не найден. Удалённых изменений не отправляли.
- **V12** во всех таблицах: эта основа + локальные исправления фазы 12; package `0.6.0`; `catalog-v1`, `rules-v1`; fixed demoClock `2026-11-14T12:00:00+05:00`. Каталог синтетический, это не доказательство актуальности реальных специалистов. Время заявки/TTL — runtime clock.
- SHA-256 набора исходников/конфигурации V12: `81baaaadad5aa2db81f50dc94bd55cab24236b3e0c9b7373073bc20d513d328f`. Состав и отдельные хеши: [source.sha256](qa/source.sha256); build-хеши: [static.json](qa/static.json). Отчёт и тесты не входят в этот хеш продукта.
- Среда: Linux Cloud, Node **24.22.1**, npm **11.9.0**, Chromium **156.0.8078.79**, Playwright **1.65.0**, Vitest **4.1.12**, Vite **7.3.7**, React **19.3.1**, TypeScript **5.9.3**. Lockfile сохранён без изменений.
- Основные E2E: touch/mobile Chromium, **390×844** (A/B/C); общая конфигурация проекта — Pixel 7, дополнительные размеры 320/360/390/430 и landscape 844×390. Это эмуляция, не физический телефон.
- Приложение: browser → SearchService / DemoRequestService → локальный JSON / IndexedDB → UI. Backend, API отправки, авторизация и внешние секреты для этого P0 не нужны.
- Копии обоих вложений в `docs/sources/` побайтово совпали с загрузками (`cmp`, exit 0). Источник приёмки — ТЗ §§6–9, 12, 19–22 и [REQUIREMENTS_TRACEABILITY.md](REQUIREMENTS_TRACEABILITY.md). Исторические D/A/G в traceability не считались текущими PASS.

## Реальные команды и результаты

Команды взяты из `package.json`, `playwright.config.ts` и README. Скрипта `lint` в проекте нет; его результат не заявляется.

| Проверка | Команда / условия | Версия | Результат | Доказательство и ограничение |
|---|---|---|---|---|
| Установка | `npm ci` | base/V12, один lockfile | PASS | 106 packages, exit 0; использованы зафиксированные версии |
| TypeScript | `npm run typecheck` | V12 | PASS | [typecheck-final.log](qa/typecheck-final.log), exit 0 |
| Unit/integration | `npm test` | V12 | PASS | **76/76**, 6 файлов; [unit-final.log](qa/unit-final.log). IndexedDB unit использует fake-indexeddb |
| Production build | `npm run build` | V12 | PASS | [build-final.log](qa/build-final.log), exit 0. Два предупреждения об аннотациях стороннего zod; сборка успешна |
| Полный браузерный набор | `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2` | V12 | PASS | **68/68**, exit 0, 2.4m; [e2e-final.log](qa/e2e-final.log). Настоящий IndexedDB в Chromium; все усиленные reflow assertions включены |
| Production smoke | `npm run preview -- --port 5174 --strictPort`, `node work/qa/production.mjs` | V12 build | PASS | ru/kk, 390×844; 1 строка S01/O01, тот же ID после reload, отмена переживает reload, sends=[], errors=[]; [production.json](qa/production.json). Vite preview, не deployed hosting |
| axe | `npm install --no-save --package-lock=false @axe-core/playwright`, `node work/qa/a11y.mjs` | V12; axe 4.14.0 | PASS | 26 состояний, 0 обнаруженных нарушений WCAG2A/AA, 2.1AA, 2.2AA; [a11y.json](qa/a11y.json). Это автоматический аудит, не сертификат доступности |
| Reflow/text resize | `node work/qa/layout.mjs`; `p0-reflow.spec.ts` | V12 | PASS | 108 измерений, 0 переполнений; [layout.json](qa/layout.json). Сравнение с `documentElement.clientWidth`, не с расширяемым `innerWidth` |
| Лабораторная фильтрация | esbuild для `work/qa/benchmark.ts`, затем `node work/qa/benchmark.mjs` | matching без изменений | PASS | 100 varied inputs после 1000 warmup; 20 offers p95 **0.703 ms**, 30 test-only offers p95 **1.081 ms**; [benchmark.json](qa/benchmark.json). Node на AMD EPYC, не mobile p95 |

Исходный набор до исправлений: **59 unit + 51 E2E PASS**. Он не покрывал найденные дефекты. Логи [unit-baseline](qa/unit-baseline.log), [e2e-baseline](qa/e2e-baseline.log). Дополнительные проверки используют фиксированные ожидаемые ID из ТЗ, а не результат SearchService как единственный oracle.

Для повторения основных gates достаточно `npm ci`, `npm run typecheck`, `npm test`, `npm run build` и указанного `test:e2e`. Браузер уже был установлен; `playwright install` в этой среде не запускался. Playwright поднимает Vite, либо использует существующий сервер 5173. Дополнительные диагностические скрипты сохранены в `docs/qa/`; запускать из корня проекта после `mkdir -p work/qa`. Они пишут артефакты в `work/qa/`. Для benchmark: `node_modules/.bin/esbuild docs/qa/benchmark.ts --bundle --platform=node --format=esm --outfile=work/qa/benchmark.mjs`.

## Сквозные пути

Все строки — V12, 390×844, чистый browser context, действия через UI. Основные тесты: [p0.spec.ts](../tests/e2e/p0.spec.ts); [production.mjs](qa/production.mjs) проверяет также собранное приложение.

| Проверка | Условия / ожидаемое и фактическое поведение | Версия | Статус | Доказательство | Остаточное ограничение |
|---|---|---|---|---|---|
| A ru | Помощь → speech/3–5/KK hard/offline hard/6000 soft/Bostandyk soft/availability → review → выдача O01,O03,O02,O11,O10 → профиль → compare O01/O03 → выбрать O03 → сохранить → reload статуса | V12 | PASS | E2E `ru P0 A`; [p0-after.log](qa/p0-after.log) | Синтетические условия; не подтверждает понимание родителем |
| A kk | Тот же путь с казахским UI; выбранная пара S03/O03 и ID сохраняются, подтверждение демо default false | V12 | PASS | E2E `kk P0 A`; [p0-after.log](qa/p0-after.log) | Редактура носителем не проводилась |
| B ru | Прямой каталог без анкеты → LOGOPED/KK hard/offline hard/6000 hard → O01,O03,O06,O07 → compare O01/O03 → выбрать O01 → Back | V12 | PASS | E2E `ru P0 B` | 2–3 кандидата в памяти вкладки |
| B kk | Тот же путь, казахский UI, S01/O01 передаётся без подмены | V12 | PASS | E2E `kk P0 B` | Reload сравнения намеренно очищает выбор |
| C ru | KK hard/offline hard/1000 hard → 0 exact, в том числе после reload → явное очищение суммы → O01,O02,O03,O06,O07,O10,O11 | V12 | PASS | E2E `ru P0 C` | Incomplete не входит в exact count |
| C kk | Тот же путь; язык/формат и hard-флаги сохранены, только сумма становится null | V12 | PASS | E2E `kk P0 C` | Нет автоматического ослабления |

## Отрицательные случаи

| Проверка | Условия и фактический результат | Версия | Статус | Доказательство | Остаточное ограничение |
|---|---|---|---|---|---|
| Unknown | null language/price/source → incomplete; hard fail исключается даже при другом unknown; нет LANGUAGE_MATCH без языка | V12 | PASS | `p0.test.ts`, `search.test.ts`, `profile.spec.ts` | Unknown не подтверждает конечную цену/совместимость |
| Stale | Цена ровно 30 суток проходит; +1 ms и future → unknown; availability 7d; expired/future/revoked verification не становится current | V12 | PASS | `p0.test.ts`, `profile.test.ts`, `profile.spec.ts` | Freshness считается от fixed demoClock |
| From price | from≤6000 → incomplete при hard; from>6000 → excluded; soft не получает подтверждённый бюджетный reason | V12 | PASS | `p0.test.ts`, `domain.test.ts`, `search.test.ts` | Нижняя граница не конечная стоимость |
| Границы возраста | Все 5 групп, включая 35/36/71/72/119/120/179/180/215: полное включение exact, частичное/неполное incomplete, непересечение excluded | V12 | PASS | 5 параметризованных случаев `p0.test.ts` | Нет ввода даты рождения; проверяется вся группа |
| Budget 0 | Бесплатная подтверждённая test offer допускается; положительная цена исключается; null≠0. В исходном каталоге strict0 даёт 0 exact | V12 | PASS | `p0.test.ts`, `domain.test.ts`, `intake.spec.ts`, `search.spec.ts` | Исходный free O06 имеет stale price, поэтому не доказывает hard0 |
| Пустой input | Пропуск всех шагов → null/[]; 12 специалистов / 20 offers; score/coverage null, нейтральные объяснения | V12 | PASS | `domain.test.ts`, `intake.spec.ts`, keyboard-only P0 | Демоанкета, не сведения семьи |
| Same-offer | O23 RU/offline и O24 KK/online не образуют KK/offline; O01/O03/O02 дают 100/85/82.5 и coverage1/.85/1 | V12 | PASS | `search.test.ts`, изолированный oracle `p0.test.ts` | Нет доменных изменений в фазе 12 |
| Hidden ID | hidden/withdrawn specialist/offer не возвращаются; explicit hidden/wrong-owner/unknown offer не заменяется другой; hidden O23 недоступна в S06 и S08 ru/kk | V12 | PASS | `profile.test.ts`, `profile.spec.ts`, `p0-errors.spec.ts` | Состав каталога неизменяем в рамках загруженной сессии |
| Неизвестный маршрут | `/no-such-route` → понятная 404; неизвестный request → missing без вставки | V12 | PASS | `p0-keyboard.spec.ts`, `requests.spec.ts` | Публикационный SPA fallback hosting отдельно не проверен |
| Ошибка каталога | Corrupt JSON/schema → alert, 0 карточек; Retry загружает заново; ru/kk включая html lang | V12 | PASS | `search.spec.ts`, `p0-errors.spec.ts`; [errors-after.log](qa/errors-after.log) | Ошибка загрузки блокирует поиск до восстановления каталога |
| Ошибка storage | Denied get/set/open; abort после add/put/clear success; поиск в памяти с предупреждением, request без ложного success; ошибка чтения≠missing | V12 | PASS | `session.test.ts`, `requests.test.ts`, `intake.spec.ts`, `requests.spec.ts` | Эвикция/очистка браузером может удалить записи |
| Повтор | Double submit и конкурентные add дают 1 ID; потерянный commit проверяет тот же key; retry после abort не меняет key | V12 | PASS | `requests.test.ts`, native IndexedDB в `requests.spec.ts` | Проверено на одном browser engine |
| Reload | Записанный/отменённый status читается из БД; TTL7d; session2h/schema/catalog corruption → явный reset; сравнение очищается как session memory | V12 | PASS | `session.test.ts`, `requests.spec.ts`, `p0-keyboard.spec.ts`, production smoke | Удаление browser storage не восстанавливается сервером |
| Back | Анкета хранит ответы; профиль возвращает filters/sort/scroll/focus; S08 из compare возвращает тот же выбор | V12 | PASS | `intake.spec.ts`, `search.spec.ts`, P0 B/keyboard tests | Compare не персистируется после reload по контракту |
| Смена языка | Mid-flow/profile/status не меняет offer/request ID или domain input; сохраняется locale; storage denial явно предупреждён | V12 | PASS | `intake.spec.ts`, `profile.spec.ts`, `p0-keyboard.spec.ts`, `p0-errors.spec.ts` | KK dates зависят от Intl браузера; см. M-03 |
| Compare limit | 0/1 → объяснение; 2/3 работают; четвёртый не вытесняет; замена offer того же специалиста только явно; hard mismatch имеет предупреждение/ack перед выбором | V12 | PASS | `search.spec.ts`, `p0-keyboard.spec.ts`, `p0.spec.ts` | Карточная структура S07; см. M-01 |

## Сопоставление с traceability

Статус PASS ниже относится к указанному техническому критерию; manual/research остаются отдельными строками следующего раздела.

| ID | Фактическое место реализации | Доказательство V12 | Статус / граница |
|---|---|---|---|
| FR-001 | `i18n/*`, `AppState`, bootstrap `App` | locale key/placeholder unit; A/B/C ru/kk, mid-flow и catalog error E2E | PASS функционально; KK-редактура NOT RUN |
| FR-002–004 | `Home`, `Intake`, `Review`, `session` | два входа, null/zero, Back/reload, summary/input, 7 валидных dt/dd | PASS |
| FR-005–011 | `contracts`, `SearchService` | нормализация/KK-буквы, OR/AND, tri-state, same-offer, isolated scores, neutral, reasons | PASS |
| FR-012–013 | `OfferProfile`, `TrustPassport`, `domain/profile` | атомарный selector, neutral deep link, scoped facts/date/source/limit, synthetic marker | PASS технически; понимание родителем NOT RUN |
| FR-014 | `AppState`, `CompareTray`, `SelectionViews`, `RequestAction` | 0/1/2/3/4, fixed pair, removal focus, choose, mismatch acknowledgement | PASS поведения; M-01 — отличие структуры |
| FR-015–017 | `DemoRequestEntry`, `DemoRequestStatus`, `DemoRequestService`, `IndexedDbRequestRepository` | commit/abort/read failure/duplicate/uncertain/cancel/reload/zero network send | PASS |
| FR-018–020 | `Catalog`, `Filters`, `session`, request cleanup | C ru/kk; Back/reload; reset/clear не удаляет чужие keys/БД и locale | PASS |
| SEC-001 | strict search/request schemas, явный offer snapshot | поля UI и состав записи проверены независимо через native IDB | PASS для синтетического среза |
| SEC-002 | source/config/build | [security-review.log](qa/security-review.log), [static.json](qa/static.json); один публичный fetch каталога; действующих токенов/ключей не обнаружено | PASS в проверенном составе; не внешнее security certification |
| SEC-003–004 | router/session/local request adapter | ответы не в URL; no external/POST/PUT/PATCH/DELETE при save/cancel; нет messaging/live adapter | PASS |
| UX-001 | native controls/dialog, navigation focus | keyboard-only ru/kk и focus regressions | PASS автоматикой; manual NOT RUN |
| UX-002 | CSS + corrected viewport assertions | 320/360/390/430/landscape, text200 | PASS автоматикой; hardware/zoom NOT RUN |
| UX-003 | request RU/KK copy and IDB flow | saved locally / nothing sent / no booking, ack default false | PASS content/E2E; parent understanding NOT RUN |
| NFR-011–012 | fixed catalog clock / runtime clock, typed messages | timestamps/TTL and full keys/placeholders | PASS |
| NFR-001,005–010 | responsive CSS, state/domain/adapters | focus/reflow/reduced-motion, failure/retry, import review; clean npm ci + build | PASS проверенного технического объёма; hardware/AT и deployed fallback NOT RUN |
| NFR-002 | performance targets LCP/INP/CLS | field p75/mobile throttled lab не измерялись | NOT RUN; benchmark matching не заменяет Web Vitals |
| NFR-003 | SearchService, 20 original + 30 test-only offers | [benchmark.json](qa/benchmark.json), p95≤100ms в Cloud Node | PASS lab; physical mobile NOT RUN |
| NFR-004 | local assets, production bundle | [build-final.log](qa/build-final.log), JS gzip около148KB <250KB, суммарно около155KB <700KB | PASS размеров; реальная сеть не измерена |
| §14 illustration | `ui/controls.tsx` Bird | одна статичная SVG, без scripts/external refs | FAIL minor относительно трёх поз; M-02 |

## Ручные и вспомогательные проверки

| Проверка | Условия | Версия | Статус | Доказательство | Остаточное ограничение |
|---|---|---|---|---|---|
| Клавиатура, автоматизированно | ru/kk, Tab/Enter/Space от главной через пропуск → compare → save → dialog; без mouse/focus shortcuts в сквозном keyboard-тесте | V12 | PASS | `p0-keyboard.spec.ts`; native radio arrows — `intake.spec.ts` | Не человеческий manual-прогон |
| Клавиатура, ручной браузер | Попытка открыть shared Chrome | V12 | NOT RUN | CUA вернул `the gaas-browser node_repl sandbox cannot be disabled` | Нет наблюдения через интерактивный инструмент; Playwright доступен |
| Screen-reader smoke | Проверка фактической речи и чтения динамического статуса | V12 | NOT RUN | Orca не найден, DISPLAY отсутствует; AX/axe выполнены отдельно | AX snapshot/axe не заменяют NVDA/VoiceOver/TalkBack |
| Focus dialogs, автоматизированно | Filters Cancel/Escape/Close/outside, native modal trap, cancel/cleanup initial focus и возврат | V12 | PASS | `search.spec.ts`, `requests.spec.ts`, keyboard P0 | Физический screen reader не проверен |
| Zoom browser 200% | Настоящий browser zoom, а не размер CSS текста | V12 | NOT RUN | Интерактивный CUA недоступен | Не выдавать root font-size 200% за browser zoom |
| Text resize 200% | root font-size 200%, 320px; header/notice/главные страницы + profile/status | V12 | PASS | `p0-reflow.spec.ts`, усиленные старые тесты; [пример](qa/text200-kk-review.png) | Изменение текста, не pinch/browser zoom |
| Reflow | 100 обычных сочетаний locale/path/width + 8 text200; фактический clientWidth | V12 | PASS | [layout.json](qa/layout.json), [layout.log](qa/layout.log) | Скриншоты просмотрены; проверки геометрии автоматизированы |
| Контраст токенов/контента | Светлая палитра; computed colors + просмотр снимков | V12 | PASS | [static.json](qa/static.json): основной12.39:1, secondary5.65:1, primary5.72:1, white/button6.33:1, error5.93:1, warning5.89:1, border3.45:1 | Не аудит каждого пикселя всех состояний/forced-colors |
| axe incomplete contrast | Home arrow и cancel-dialog paragraph | V12 | PASS для проверенных пар | [contrast-incomplete.json](qa/contrast-incomplete.json): декоративная aria-hidden стрелка white/primary6.33:1; paragraph text/white >12:1. Остальные цвета не менялись по locale | В axe 4 incomplete остаются в raw report (2 вида × 2 языка), не переименованы в automated PASS |
| Mobile keyboard | Показ/скрытие настоящей экранной клавиатуры, viewport resize и footer | V12 | NOT RUN | `inputMode=numeric`, native controls и короткий viewport проверены в коде/эмуляции | Нет физического Android/iOS; эмуляция не вызывает OS keyboard |
| Safe-area | Cutout/gesture bar, portrait и landscape реального устройства | V12 | NOT RUN | В CSS есть `env(safe-area-inset-bottom)` для tray/filter footer, `dvh`; снимки эмуляции доступны | Insets в эмуляции нулевые, аппаратный результат не доказан |
| Смысл демоподтверждения | Редакторское чтение ru/kk и E2E: checkbox false, real send absent, S09 local-only | V12 | PASS | `p0.spec.ts`, `requests.spec.ts`, [ru status](qa/ru-status.png), [kk status](qa/kk-status.png) | Понимание реальным родителем NOT RUN |
| Смысл проверки документов | Только scope/source/date/limit; «документ просмотрен» не подлинность/результат/лечение | V12 | PASS | `profile.test.ts`, `profile.spec.ts`; [сравнение](qa/ru-compare.png) | Носитель KK/родитель не участвовал |
| Parent usability / KK редактура | Добровольный пользователь/носитель | V12 | NOT RUN | Нет протокола участия | Автотесты не являются пользовательским исследованием |

## Дефекты, исправления и перепроверка

| Дефект | Приоритет / воспроизведение | Исправление | До → после / доказательство |
|---|---|---|---|
| QA-01: S07 не позволяет выбрать услугу по заданному A/B | Blocker запрошенного сквозного пути, ru/kk: отсутствует CTA ТЗ §7.7 | Переиспользован RequestAction с точной offer, mismatch acknowledgement и корректным Back в compare; строка выбора ru/kk | **4 FAIL → 6 A/B/C PASS**; [p0-before](qa/p0-before.log), [p0-after](qa/p0-after.log); changed-hard E2E также проходит |
| QA-02: удаление/очистка compare теряет focus | Major UX; после Enter activeElement=BODY | Возврат на существующий page title при исчезновении control | **FAIL → PASS**, 3→2→1→0; [focus-before](qa/focus-before.log), [keyboard-after](qa/keyboard-after.log) |
| QA-03: неверная структура review dl/dt/dd | Major accessibility; axe definition-list/dlitem в обоих языках | dt/dd непосредственно в группе dl; edit внутри определения, перенос сохранён | **FAIL → PASS**, 7 пар; [a11y-before](qa/a11y-before.json), [a11y](qa/a11y.json), review structural E2E |
| QA-04: казахская catalog error с lang=ru | Major локализации/AT | Startup locale применяется до AppStateProvider | **1 FAIL → 4 PASS** вместе с hidden-ID; [errors-before](qa/errors-before.log), [errors-after](qa/errors-after.log) |
| QA-05: text200 обрезает шапку/уведомления; тест это пропускал | Major UX; при viewport320 `clientWidth=320`, но `scrollWidth=innerWidth=454` | Wrap шапки/уведомления и длинного текста; все прежние reflow assertions переведены на clientWidth; отдельный regression | **2 FAIL → PASS** ru/kk; [reflow-before](qa/reflow-before.log), [reflow-after](qa/reflow-after.log), [layout](qa/layout.json) |

Доменный matching, fixtures, request schema, TTL, IndexedDB commit protocol и idempotency не менялись. Новые тесты доказывают условия и найденные регрессии. Дополнительный axe установлен только для диагностики без изменений package.json/lockfile. UI-изменения ограничены переходом S07, фокусом, семантикой review, языком bootstrap и исправлением обрезания текста. TSX проверены по React checklist: hooks вне ветвлений, устойчивые keys, state acknowledgement сбрасывается при смене offer/совместимости, маршруты сохраняют exact offer.

## Оставшиеся ограничения и решение

- **Открытые известные blocker: 0; major основного пути: 0.** Это вывод из перечисленного покрытия; NOT RUN не означает отсутствие дефектов.
- **M-01, minor, FAIL структуры §7.7:** S07 показывает вертикальные полные карточки по специалисту, а ТЗ описывает группировку по критерию с повторением имён. Все нужные значения и действия доступны, смешения offers нет; длинное сопоставление требует прокрутки. Перестройка макета в этой фазе не выполнялась.
- **M-02, minor, FAIL §14:** переиспользуется одна безопасная статичная SVG, вместо трёх различных поз. Основные действия доступны без иллюстрации.
- **M-03, minor:** Chromium Intl показывает некоторые казахские даты как `2026 M11 7`; календарное значение верно, но качество локализованного названия месяца требует проверки/редактуры. [kk-status.png](qa/kk-status.png). Локаль ru/kk и ключи проверены, редактура носителем — NOT RUN.
- Ручные AT/zoom/физический телефон и исследование с родителем отсутствуют; требуются отдельные реальные наблюдения с указанным браузером/ОС/устройством, шагами, фактическим результатом и повтором при дефекте. Для проверки клавиатуры можно использовать тот же маршрут, что `p0-keyboard.spec.ts`; для телефона — A/B/C и filters с открытой OS keyboard, включая safe-area в landscape.
- Firefox/WebKit/Safari/TalkBack/VoiceOver, deployed SPA fallback и Web Vitals на мобильной сети — NOT RUN. Нативная speech-проверка не подменена разбором accessibility tree.
- Демо хранит данные только в текущем browser origin/profile; удаление браузером/TTL может убрать записи. Настоящая отправка, запись на занятие и live pilot этим отчётом не подтверждаются.

**Go/no-go:** технические A/B/C и локальная фиксация демозапроса подтверждены для проверенной конфигурации Chromium. **NO-GO для полного закрытия P0** до выполнения обязательных ручных пунктов; minor-отличия перечислены явно. **NO-GO для live:** срез синтетический и не содержит реальной инфраструктуры обращений. После получения недостающих доказательств обновить только соответствующие строки; не превращать текущие NOT RUN в PASS по предположению.

## Сохранение фазы

Ветка результата: `phase-12-qa`, основа `2cc8fe9`. По дополнительному запросу пользователя перед фиксацией повторно проверены SHA-256 всех исходников по `qa/source.sha256`, наличие итогов 76/68 и разрешимость всех относительных ссылок отчёта. Исходники не изменились после последнего успешного прогона; полный набор без причины повторно не запускался. README указывает на актуальную фазу.

Повторная попытка ручной проверки после сброса CUA-сессии (`cua.getState()`) снова завершилась ошибкой `the gaas-browser node_repl sandbox cannot be disabled`. Недоступные ручные пункты сохранили NOT RUN. Фиксация исходников и отчёта не означает, что полная ручная приёмка выполнена.

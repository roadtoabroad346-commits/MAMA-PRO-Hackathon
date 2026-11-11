# 01 — COMPLETE REPOSITORY INVENTORY (Stage 1)

Проверяемая версия: `97541389f11e0afe10d0a2aeefdbe470bd3a6eff` (ветка `completion-audit-2026-11-11`, снимок байт-идентичен). Всего файлов: **287** (включая документацию и бинарные артефакты).

## 1. Структура и назначение

| Каталог/файлы | Назначение | Ключевые факты |
|---|---|---|
| `src/domain/` | Чистый домен: contracts (zod), matching, SearchService, catalog-схема, freshness, profile, demoRequest, DemoRequestService, map | Без React/браузера. Единый источник истины matching. |
| `src/app/` | React-состояние: App (routes, загрузка каталога), AppState (session/сравнение), session (TTL 2 ч), requestAttempt (intent в sessionStorage), DemoRequests (provider IndexedDB) | Состояние анкеты отделено от применённого ввода (intakeDraft vs input). |
| `src/features/` | UI: Home, intake (4 шага + Review), search (Catalog/Filters/OfferCard/CompareTray/ResultMap), profile (OfferProfile/TrustPassport/DemoRequestEntry/RequestAction), request (Status/Clear), pilot (8 компонентов) | Pilot лениво загружается (code-split). |
| `src/i18n/` | 4 каталога сообщений RU/KK: search (57), profile (32), request (36), core (63), pilot messages (отдельный файл ~24 КБ) | Паритет ключей enforce’ится компилятором (`Record<keyof typeof ru, string>`); дубликатов ключей не найдено (проверено скриптом). |
| `src/data/` | catalogRepository (fetch+validate), IndexedDbRequestRepository ( IndexedDB `qoldau-demo-v1`) | IndexedDB-репозиторий различает отказ и неопределённый исход (UncertainStorageResult). |
| `src/ui/` | Modal (native dialog, focus management), controls (Choices/Check/PageTitle/DemoNotice/Bird) | |
| `server/` | Pilot test backend: contracts (zod, 30 команд), http (loopback :8787), service (authz/idempotency/jobs), store (node:sqlite WAL), start (гейты), migrations/001_pilot.sql | PILOT_TEST only; `LIVE_BLOCKED` (503) при NODE_ENV=production или PILOT_MODE≠PILOT_TEST. |
| `tests/` | 8 unit/integration файлов (147 тестов), 10 e2e-спеков dev-конфига, release.spec, 2 pilot-e2e-спека, support/catalog.ts | |
| `scripts/` | audit-phase-registry.mjs (валидатор реестра), audit-release.mjs (истор., фаза 13), serve-release.mjs (production static server) | serve-release: loopback, 405 на запись, `/api/`→503 LIVE_BLOCKED, защита от traversal. |
| `public/` | manifest.webmanifest, offline.html, icon.svg, sw.js (версионируется при сборке) | SW кэширует только публичные shell-ассеты; `/api/` никогда не кэшируется. |
| `docs/` | ~45 документов: реестр фаз, закрытие, QA, требования, handoff, LIVE_READINESS и др. + артефакты доказательств (логи, скриншоты, JSON) | |
| `releases/` | phase13 ZIP + SHA256SUMS, phase14-defense ZIP | Исторические артефакты. |
| `.github/workflows/integrity.yml` | CI: npm ci → `npm run check` → `npm run build` на Node 24.22.1 для веток phases-0-67 и completion-audit | |

## 2. Dependency map (UI → State → Domain → Data Access → Backend → Persistence)

```
Home/Intake/Review/Catalog/Filters/OfferCard/Profile/Request*
  └─ useApp (AppState.tsx)          ← session.ts (sessionStorage, TTL 2h, zod)
       └─ SearchService (domain)    ← catalog.ts (zod-схема) ← catalogRepository (fetch JSON)
       └─ DemoRequestService        ← IndexedDbRequestRepository → IndexedDB (qoldau-demo-v1/requests)
                                    ← SessionAttemptStorage → sessionStorage (qoldau.demo-request-attempt)
Pilot/*  └─ pilotApi (fetch /api/pilot/*) → server/http.ts → PilotService → Store (node:sqlite WAL)
SavedDemo (localStorage 'qoldau.saved-demo.v1', ≤20 записей)
SW (public/sw.js) → кэш публичных shell-ассетов (версия по содержимому), /api/ исключён
```

Циклических зависимостей не обнаружено (проверено по импортам; pilot-компоненты импортируют типы из `server/*` через `import type` — тип-импорт не создаёт runtime-ребра; рантайм-связь идёт через HTTP).

## 3. Контракты данных

| Контракт | Где | Заметки |
|---|---|---|
| Catalog v2 / Rules v2 (`catalog-v2/rules-v2` в `src/data/catalog.json`) | `src/domain/catalog.ts` | Strict zod: FK, дубликаты ID, age/price инварианты, PRICE_TIMESTAMP-согласованность, ONLINE_DISTRICT. `isSynthetic: true` обязателен. |
| SearchInput | `src/domain/contracts.ts` | strictObject; budget 0..100000; query ≤80; нормализация NFKC + ё→е. |
| DemoRequest | `src/domain/demoRequest.ts` | strictObject; nonPersonalOfferSnapshot — явный allowlist (никогда не spread). |
| RequestAttempt | `src/app/requestAttempt.ts` | schemaVersion 1, strict. |
| Session snapshot | `src/app/session.ts` | schemaVersion 1, catalogVersion-bound, expiresAt TTL 2h. |
| Pilot Command | `server/contracts.ts` | discriminatedUnion 30 операций; timing с IANA-таймзоной; contact/consent версии литералами. |
| Pilot Resource | `server/store.ts` | version-optimistic; data JSON-валидный (CHECK). |

## 4. Экспорты и точки входа (ключевые)

- `SearchService.search/inspectOffer/publicCatalog` — единственная точка расчёта ранжирования.
- `evaluateOffer` — чистая функция оценки одного offer (same-offer isolation).
- `DemoRequestService.submit/recover/cancel/clear/getById` — жизненный цикл демозапроса.
- `PilotService.run/execute/state/publicOffers/pump` — серверные команды.
- `translate`, `pilotText` — i18n.

## 5. Обработка ошибок (архитектура)

| Слой | Поведение |
|---|---|
| Catalog load | Ошибка → экран с Retry; поиск блокируется до восстановления (не подменяется пустым). |
| Search | `service.search()` при исключении → `searchFailed` + retry; никогда не fallback на неотфильтрованный каталог. |
| IndexedDB | Различает: StorageFailure (отказ), UncertainStorageResult (таймаут — исход неизвестен); повтор читает тот же idempotencyKey; ложного успеха нет. |
| Session storage | `storageReset` (данные повреждены/устарели — удалены) vs `storageUnavailable` (доступ запрещён — работа в памяти). |
| Pilot HTTP | Fault(code,status); unknown → SERVER_ERROR 500 без деталей. |
| Pilot UI | Ошибки в родителе (Pilot.tsx), формы не теряют данные; retry pending-команды. |

## 6. Возможные точки отказа и технический долг (выявлено при чтении)

| # | Точка | Файл:строки | Оценка |
|---|---|---|---|
| TD-1 | Главный JS-чанк 515.49 kB (>500 advisory) | build-лог | Средний; Pilot уже вынесен в отдельный чанк (55 kB). |
| TD-2 | `sort:'district'` вызывает `evaluate` внутри компаратора — O(n log n) переоценок | `SearchService.ts:93-99` | Низкий при 20–50 offers; масштабируется плохо. |
| TD-3 | `Catalog` выполняет `service.search(input)` синхронно на каждый рендер (каждый символ в поле поиска) | `Catalog.tsx:21` | Низкий (20 offers); нет мемоизации при росте каталога. |
| TD-4 | Pilot/offline Playwright-конфиги жёстко прописывают `/usr/bin/chromium` и POSIX-синтаксис env (`PILOT_MODE=... npm ...`) — на Windows не запускаются без нового конфига | `playwright.pilot.config.ts:6-7`, `playwright.offline.config.ts:5` | Средний (переносимость). |
| TD-5 | Результат pilot e2e JSON пишется в `docs/phases55-67/*.json` — тесты мутируют docs-каталог | `playwright.pilot.config.ts:5` | Низкий. |
| TD-6 | `ResultMap` содержит inline RU/KK тексты вне i18n-каталога | `ResultMap.tsx:9` | Низкий (рассинхрон при правке сообщений). |
| TD-7 | Corrupt intent в sessionStorage (`qoldau.demo-request-attempt`) не очищается автоматически: каждый submit/recover упирается в `requestIntentError` до ручной очистки или истечения 2 ч таба | `requestAttempt.ts:13` + `DemoRequestService.ts:59-60` | Низкий/средний (UX при повреждённых данных). |
| TD-8 | Дублированная бизнес-логика «кошерно/бесплатно/unknown» отображения цены в 3 местах (OfferFacts, SnapshotFacts, SavedDemo) | `OfferCard.tsx:13-14`, `DemoRequestStatus.tsx:81-82`, `SavedDemo.tsx:17` | Низкий. |
| TD-9 | `demoLocations` захардкожены в `src/domain/map.ts` (синтетические координаты) — OK для демо, но в доменном слое | Низкий. |
| TD-10 | `sessionStorage`-интент не имеет TTL при чтении (проверка `isExpiredAttempt` только когда record не найден) | `DemoRequestService.ts:68` | Низкий (поведение документировано). |

## 7. Dead code / неиспользуемые зависимости

- `package.json` dependencies: только react, react-dom, react-router-dom, zod — все используются. devDependencies все используются (playwright, vitest, vite, typescript, types, plugin-react, fake-indexeddb). Неиспользуемых зависимостей нет.
- Dead code: явного мёртвого кода не найдено; `docs/qa/benchmark.ts` — утилита прошлой фазы, сохраняется как артефакт, не входит в сборку.
- `audit-release.mjs` — исторический (фаза 13), не вызывается текущими scripts, сохранён для воспроизводимости старого релиза. Отмечен как legacy-утилита.

## 8. Модули и тестовое покрытие

| Модуль | Unit-тесты | E2E |
|---|---|---|
| contracts/session | domain.test, session.test (24) | intake.spec, search.spec |
| matching/freshness/SearchService | matching.test (44), p0.test (16), search.test (9), domain.test | search.spec, profile.spec, phases28-35.spec |
| catalog/profile | profile.test (4), p0.test | profile.spec |
| demoRequest/IndexedDB | requests.test (16) | requests.spec, release.spec |
| pilot backend | pilot.test (30) | pilot.spec (5, Linux-конфиг) |
| UX a11y/reflow/errors | — | p0-keyboard.spec, p0-reflow.spec, p0-errors.spec, offline.spec |

Полная матрица фактического запуска — в `09_AUTOMATED_TEST_RESULTS.md`.

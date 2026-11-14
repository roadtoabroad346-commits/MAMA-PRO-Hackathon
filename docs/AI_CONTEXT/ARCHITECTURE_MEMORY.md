# Архитектурная память

Baseline `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`; runtime не изменён этой инициализацией. Детальные исполняемые контракты — исходники, [DOMAIN_CONTRACTS](../DOMAIN_CONTRACTS.md), [ACCESS_AND_DATA_MODEL](../ACCESS_AND_DATA_MODEL.md).

## Модули и потоки

| Слой | Файлы | Ответственность |
|---|---|---|
| Bootstrap/router | `src/main.tsx`, `src/app/App.tsx` | Catalog load/retry, public routes, lazy `/pilot`, navigation focus |
| App state | `src/app/AppState.tsx`, `session.ts` | Locale, draft/applied SearchInput, compare selection/context, focus/scroll |
| Public catalog | `src/data/catalogRepository.ts`, `catalog.json`, `src/domain/catalog.ts` | Synthetic schema, публикационный фильтр, версии, provenance |
| Matching | `src/domain/contracts.ts`, `matching.ts`, `SearchService.ts`, `freshness.ts` | Pure validation/evaluator, filtering before grouping, counts/reasons |
| UI CORE | `src/features/{intake,search,profile,request}` | Анкета/review, выдача, filters, compare, trust, demo requests |
| Local requests | `DemoRequestService.ts`, `demoRequest.ts`, `IndexedDbRequestRepository.ts`, `requestAttempt.ts` | Durable intent, transaction, uncertain outcome reconciliation |
| Pilot UI | `src/features/pilot/` | Server-driven forms/state, no local success fallback |
| HTTP authority | `server/http.ts`, `contracts.ts` | Mode/session/CSRF/origin/input/body limits, command schema |
| Pilot domain/storage | `server/service.ts`, `store.ts`, `migrations/001_pilot.sql` | Trusted actors, scopes/owner/version, transaction, audit/jobs/inbox |
| PWA/build | `public/sw.js`, `vite.config.ts`, `SavedDemo.tsx` | Build allowlist shell, explicit synthetic snapshots; private excluded |
| QA/release | `tests/`, `playwright*.ts`, `scripts/serve-release.mjs` | Unit/HTTP/SQLite/browser, static server with SPA fallback |

CORE: UI draft → normalizeSearchInput/Zod → publicCatalog → text candidates → evaluateOffer каждой услуги → hard eligibility → ranking → stable sort → specialist grouping → SearchResult → cards/compare/profile/map. `inspectOffer` сохраняет ту же семантику. Карта не запускает отдельный evaluator; exact matchingOfferIds только из результата.

Pilot: same-origin UI fetch (`cache:no-store`) → `/api/pilot` → trusted session actor → strict command → `BEGIN IMMEDIATE` → authorize owner/role/scope → version/idempotency → SQLite commit → allowlisted DTO → UI. CORE fixture catalog и pilot publication — отдельные контуры; live catalog adapter отсутствует.

## Routes и контракты

CORE routes: `/`, `/route`, `/route/review`, `/specialists`, `/specialists/:specialistId`, `/compare`, `/request/:offerId`, `/request-status/:requestId`, `/saved`, `/about-demo`, `/privacy`; неизвестный URL даёт not-found view. `/pilot` загружается отдельно. Static production server не предоставляет pilot API и не подтверждает private writes.

HTTP: GET `/api/pilot/public` (public projection), GET `/api/pilot/state` (session), POST `/api/pilot/test-login`, `/logout`, `/commands`. POST JSON, максимум 16384 bytes. Мутации требуют CSRF; Origin и Sec-Fetch проверяются. Session cookie HttpOnly/SameSite=Strict/Secure, 1h. Test login 30/min/client address; create-operation throttle 30/min/trusted actor. Тестовая идентификация не защищает от произвольного выбора synthetic actor и не предназначена для production.

`PILOT_MODE` должен быть `PILOT_TEST`, `NODE_ENV` должен отличаться от production. Любой другой режим отвергается `LIVE_BLOCKED` до запуска. `server/start.ts` слушает 127.0.0.1:8787; Vite proxy same origin. Store под `.pilot-test/<safe basename>.sqlite`, directory0700, gitignored.

## Инварианты подбора

- `SearchInput`: needTag, categoryIds, ageGroup, serviceLanguage, languageHard, format/formatHard, budgetKzt/budgetHard, districtId/districtHard, availabilityPreferred, query, sort. Locale не вход evaluator.
- Категория hard OR; age hard. Hard fail → excluded; иначе hard unknown → incomplete; иначе eligible. Нельзя собирать одно совпадение из двух услуг.
- Бюджет 0–100000 integer; empty=null; free=0 при явной известной free цене; priceKind unknown/from/exact/free различаются. «От» не доказывает попадания в hard budget.
- Общий request-level набор A: need30, age15, language15, format10, budget15, district10, availability5. Score и coverage используют один применимый denominator; отсутствие активных факторов → neutral/null. Known false сохраняет coverage и уменьшает score; unknown не становится positive.
- Online+formatHard отключает район; mixed сохраняет район в общем наборе факторов. Hard не снимается без действия пользователя.
- Freshness price/contact30d, availability7d, verification365d — проектная политика PROPOSAL. Current при 0≤age<TTL; equality stale. Missing/invalid/future=unknown. updatedAt/savedAt не переосвидетельствуют факт.
- Public schema фильтрует hidden/withdrawn и private extras. Reasons привязаны к offer/source/checkedAt/rulesVersion и typed RU/KK locale keys.

## Хранение и lifecycle

| Область | Реальные данные/сроки | Ограничения |
|---|---|---|
| Locale | localStorage `qoldau.locale` | Visible storage denial fallback |
| Search | sessionStorage `qoldau.demo-search`, TTL2h | draft отдельно от applied; version validation |
| Submit intent | sessionStorage `qoldau.demo-request-attempt`, TTL2h | Corrupt JSON/schema cleared; denial remains error |
| Demo request | IndexedDB `qoldau-demo-v1/requests`, TTL7d | Unique idempotency index; success after transaction; snapshot allowlist |
| Saved demo | localStorage `qoldau.saved-demo.v1`, максимум20 | Explicit save, synthetic only, manual delete; не saved search |
| Private test | SQLite accounts/sessions/scopes/resources/operations/jobs/inbox/audit/schema_migrations | Single process; WAL/FK; no production encryption/RLS |

Demo state: draft→submitting/checking→recorded_demo либо error; cancelled_demo терминален. После timeout сначала read same key; нет успешного memory fallback.

Application: draft→submitted→needs_changes/rejected/published; assigned moderator; published edit уводит в draft до review; withdraw удаляет public projection. Audit хранит metadata, не full immutable moderation case timeline. Private evidence/consent не в public DTO.

Contact: server_received→sandbox_available→responded→parent_reported/appointment_confirmed; allowed cancel/close/revoke/delete отдельны. Confirmation выполняет recipient specialist; это synthetic confirmation. Cancel инвалидирует related jobs/events. Нет provider-delivered/read receipt.

Calendar: manual planned/confirmed_request source; edit confirmed event переводит в manual planned. Offset ISO+IANA, version409; overlap warning в UI, не атомарная блокировка слота. In-app jobs по revision; cancel/edit/opt-out инвалидируют, dedup inbox; server pump1s, max100 due jobs/transaction. Это не distributed queue и не push при закрытом сервере.

Goals/diary принадлежат parent. Specialist assignments только через active scope, instructionVersion/revisions/responses; scope revoke закрывает дальнейшие права специалиста. Это не family graph. Summary selected=[] по умолчанию, server owner checks, memory draft, clipboard/download; sharing/send отсутствуют. Logical delete scrub JSON, но physical SQLite/WAL/backup erasure не доказан.

## UX, качество и безопасность

Typed RU/KK catalogs плюс некоторые inline пары в pilot/saved/map toggle. Native controls, Modal focus management, skip link, page-title focus, visible focus, reduced-motion CSS. Desktop compare subgrid≥1000px с `@supports` fallback; мобильные stacks. Bird aria-hidden. Казахская редактура/реальные screen readers/devices не подтверждены автоматикой.

TS strict/noUnused/noEmit; Zod4; Node24 native SQLite. Build tsc+Vite с react/zod vendor chunks и shell version hash. Service worker только build-public assets; `/api/` network-only, private pilot navigation offline → offline.html. Private offline edits/sync отсутствуют.

Секреты не нужны для synthetic backend. Production TLS/CSP/HSTS, production identity/MFA/recovery, encryption/keys, provider callbacks/outbox, backup restore, monitoring/oncall и lawful consent — будущие решения. Local unit/browser PASS не закрывает эти границы. Никакой миграции на Next.js/Supabase/Render не требуется для восстановления текущего контекста.

Миграция001 additive/idempotent; rollback этой docs-only задачи не меняет данные. Для будущего synthetic DB изменения остановить backend, сохранить всю directory вместе с WAL/SHM и проверить restore; production backup не заявлять проверенным. Existing CORE можно запускать отдельно от pilot.

EXP04: publicCatalog strips checker roles and hidden-offer facts before CORE state; shared OfferEvidence/EvidenceFact rendered in passport and comparison. Shared detailed OfferFacts includes address unknown/N/A and dated availability; canonical matching/status/freshness remain single authorities. One pinned offer/provider, explicit replace, max3 and tab-memory semantics retained. Public fact dates use i18n/date.ts (Asia/Almaty; RU medium, KK numeric), no schema migration.

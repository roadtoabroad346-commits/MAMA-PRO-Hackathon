# EXP-00–EXP-24: карта фаз

Baseline: 7f8434a4cfd097b531fa584f5b97ebd1e772ad92. Current action: EXP-03 F037–F060 VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source ac82ec7. Human/live gates BLOCKED_EXTERNAL; EXP-04 not started.

Новые EXP-фазы отделены от исторического [реестра 0–68](../PHASE_REGISTRY.json). 39 исторических фаз (1–5, 9, 11, 15–27, 36–54) имеют TEAM_ATTESTED, а их per-phase требования/evidence остаются UNKNOWN. 29 исторических записей имеют артефакты; это не полная приёмка. Фаза 68 не начата; предложения 69–78 не являются выполненной историей.

Все 231 функции распределены ровно по одному EXP. Исходные acceptance и negative cases сохранены; исходные карточки доступны по ссылке каждой фазы. Baseline PASS не означает, что каждый новый EXP AC подтверждён.

| EXP | F-IDs | Состояние |
|---|---|---|
| [EXP-00](#exp-00) | F000–F000 | CONTEXT_INITIALIZED_WITH_SOURCE_GAPS |
| [EXP-01](#exp-01) | F001–F016 | TECHNICAL_VERIFIED_ON_SIBLING_BRANCH_HUMAN_BLOCKED |
| [EXP-02](#exp-02) | F017–F036 | TECHNICAL_VERIFIED_HUMAN_BLOCKED |
| [EXP-03](#exp-03) | F037–F060 | VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO) |
| [EXP-04](#exp-04) | F061–F075 | EXISTING_DEMO_WITH_LIMITATIONS |
| [EXP-05](#exp-05) | F076–F087 | EXISTING_DEMO_WITH_LIMITATIONS |
| [EXP-06](#exp-06) | F088–F094 | EXISTING_PILOT_TEST_ONLY |
| [EXP-07](#exp-07) | F095–F104 | EXISTING_PILOT_TEST_ONLY |
| [EXP-08](#exp-08) | F105–F114 | EXISTING_PILOT_TEST_ONLY |
| [EXP-09](#exp-09) | F115–F122 | EXISTING_PILOT_TEST_ONLY |
| [EXP-10](#exp-10) | F123–F130 | EXISTING_PILOT_TEST_ONLY |
| [EXP-11](#exp-11) | F131–F140 | PLANNED_WITH_PARTIAL_FOUNDATIONS |
| [EXP-12](#exp-12) | F141–F150 | PLANNED_WITH_PARTIAL_FOUNDATIONS |
| [EXP-13](#exp-13) | F151–F154 | PLANNED |
| [EXP-14](#exp-14) | F155–F166 | PLANNED |
| [EXP-15](#exp-15) | F167–F170 | PLANNED |
| [EXP-16](#exp-16) | F171–F180 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-17](#exp-17) | F181–F185 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-18](#exp-18) | F186–F195 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-19](#exp-19) | F196–F200 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-20](#exp-20) | F201–F210 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-21](#exp-21) | F211–F217 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-22](#exp-22) | F218–F224 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-23](#exp-23) | F225–F228 | BLOCKED_EXTERNAL_FOR_LIVE |
| [EXP-24](#exp-24) | F229–F230 | BLOCKED_EXTERNAL_FOR_LIVE |

## EXP-00

Baseline, источники истины и разрешения — **CONTEXT_INITIALIZED_WITH_SOURCE_GAPS**. Охват: F000.

**Цель:** Согласовать назначение платформы и не потерять фактическое состояние: code SHA, historical phase status, scope, sources, known unknowns. Не изменять продукт ради выполнения этапа.

**Предпосылки:** Только репозиторий и Research.

**Технический объём:** Создать FEATURE_MATRIX 231 ID, gap map, ADR о синтетическом демо, requirements-to-tests map, STATE/PROGRESS/HANDOFF и рабочую ветку. Прочитать AGENTS.md и реальные npm scripts.

**Переиспользование:** Research v1.0; Git status, открытые PR; исходные docs/PHASE_REGISTRY.json и аудит; проверить новые коммиты и собственные локальные файлы.

**Недостающее:** Только контекст и проверка; продуктовые изменения не разрешены в этой сессии.

**Backend:** Нет runtime изменений; Git и документальные реестры.

**Frontend:** Навигация по постоянной памяти.

**Модели:** GitSnapshot, FeatureRecord, PhaseRecord, source hashes

**Безопасность:** Секреты не печатать, личные файлы не перезаписывать; ни один live gate не менять.

**Тесты:** Schema/uniqueness validation для registry; npm scripts discovery; baseline QA без выдуманных PASS.

**Негативные сценарии:** Рабочая папка грязная; неверный remote/default; docs отстают от кода; доступ в GitHub только read-only.

**Внешние условия:** Участник подтверждает границы при обнаружении противоречий. Отдельный оригинальный Codex chat URL отсутствует.

**Допустимый результат:** Документация/план, не live.

**Git checkpoint:** `docs(exp-00) contracts/evidence` → `test/feat(exp-00) validated slice` → `docs(exp-00) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-00-AC-01: 231 ID 0–230 присутствует без дубликатов, Research status сохранён отдельно от code status.
- EXP-00-AC-02: HEAD/remote status/dirty files/PR описаны с настоящими SHA и датами.
- EXP-00-AC-03: Каждый неизвестный исторический stage помечен UNKNOWN/TEAM_ATTESTED, а не выдуман как VERIFIED.
- EXP-00-AC-04: Первый docs-only checkpoint запушен и remote SHA совпадает; если права отсутствуют — честный PUSH_BLOCKED.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; EXP-00-AC-01..04 PASS для доступного контекста: validator coverage, Git snapshot, historical UNKNOWN/attestation, verified remote checkpoint b0b4115b694ec8271ead0f90a1d4c7742327145f. Original Research остаётся отсутствующим. Implementation commits этой фазы отсутствуют; docs checkpoint создан.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L173).

## EXP-01

DEMO: главная, языки, навигация и маскот — **TECHNICAL_VERIFIED_ON_SIBLING_BRANCH_HUMAN_BLOCKED**. Охват: F001, F002, F003, F004, F005, F006, F007, F008, F009, F010, F011, F012, F013, F014, F015, F016.

**Цель:** Обеспечить понятный вход родителя без регистрации, чёткий CTA, RU/KK, достоверную маркировку демо и визуально связанный путь.

**Предпосылки:** EXP-00.

**Технический объём:** Не переписывать визуальную систему; при необходимости исправить обнаруженные проблемы текста, focus, mobile reflow, deep links, return navigation и состояния Қарлығаш.

**Переиспользование:** Home, App Router, AppState, controls/Bird, MASCOT_KARLYGASH, DESIGN_DELIVERY 12–13.11.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Обеспечить понятный вход родителя без регистрации, чёткий CTA, RU/KK, достоверную маркировку демо и визуально связанный путь.

**Модели:** Locale, Router, Bird pose, navigation focus

**Безопасность:** Не собирать данные ребёнка, не обещать реальную связь. Избегать декоративной AI-анимации, мешающей клавиатуре.

**Тесты:** dev E2E, production release E2E, screenshot comparison, keyboard/axe if available.

**Негативные сценарии:** Back/refresh/deep link, unavailable localStorage, browser 200% zoom, long KK labels.

**Внешние условия:** Редактор KK и реальный родитель подтверждают понятность формулировок; до этого NOT_RUN.

**Допустимый результат:** DEMO READY только после текущих тестов.

**Git checkpoint:** `docs(exp-01) contracts/evidence` → `test/feat(exp-01) validated slice` → `docs(exp-01) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/Home.tsx](../../src/features/Home.tsx); [src/app/App.tsx](../../src/app/App.tsx); [src/app/AppState.tsx](../../src/app/AppState.tsx); [src/ui/controls.tsx](../../src/ui/controls.tsx); [src/styles.css](../../src/styles.css); [src/i18n/messages.ts](../../src/i18n/messages.ts)

**Acceptance (требования, не PASS):**

- EXP-01-AC-01: С нуля можно выбрать один из двух маршрутов, оба работают без регистрации.
- EXP-01-AC-02: Смена RU/KK изменяет все публичные сообщения и сохраняет прогресс.
- EXP-01-AC-03: Демо-маркировка присутствует при каждом чувствительном действии.
- EXP-01-AC-04: Три SVG-позы корректно выглядят при 320/390/1280 и не вмешиваются в accessibility tree.

**Доказательства:** [remote EXP-01](https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon/blob/a93cc18d7b357a637c7114e9408ec11242156eba/docs/expansion/stages/EXP-01.md), checkpoint `a93cc18d7b357a637c7114e9408ec11242156eba`; прочитан как результат другой ветки. В эту ветку не объединён; human acceptance NOT_RUN.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L207).

## EXP-02

DEMO: анкета и подтверждение условий — **TECHNICAL_VERIFIED_HUMAN_BLOCKED**. Охват: F017, F018, F019, F020, F021, F022, F023, F024, F025, F026, F027, F028, F029, F030, F031, F032, F033, F034, F035, F036.

**Цель:** Родитель без знания специальности может выразить ограничения без диагноза, увидеть ровно те параметры, которые применятся в поиске.

**Предпосылки:** EXP-01.

**Технический объём:** Проверить четыре шага, null semantics, hard/soft switches, budget validation, review count и сохранение текста/настроек. Улучшать UX только по измеренным проблемам.

**Переиспользование:** Intake.tsx, Review.tsx, canonical SearchInput/session schemas.

**Недостающее:** Runtime gap не обнаружен. Human UAT/native KK/real device и оригинальный DOCX остаются NOT_RUN/UNAVAILABLE.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Родитель без знания специальности может выразить ограничения без диагноза, увидеть ровно те параметры, которые применятся в поиске.

**Модели:** SearchInput, Session, intakeDraft, applied input

**Безопасность:** Никаких name/DOB/medical details; private search answers не отправлять в analytics.

**Тесты:** unit boundary/session; Playwright route/review A/B/C RU/KK.

**Негативные сценарии:** 0, пусто, отрицательное, 100001, длинная строка, back forward history, expired session, KK.

**Внешние условия:** Наблюдение родителя по сценарию «не знаю категорию» — отдельный Human UAT.

**Допустимый результат:** DEMO; полевые выводы отдельно.

**Git checkpoint:** `docs(exp-02) contracts/evidence` → `test/feat(exp-02) validated slice` → `docs(exp-02) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/intake/Intake.tsx](../../src/features/intake/Intake.tsx); [src/features/intake/Review.tsx](../../src/features/intake/Review.tsx); [src/app/session.ts](../../src/app/session.ts); [src/app/AppState.tsx](../../src/app/AppState.tsx); [src/domain/contracts.ts](../../src/domain/contracts.ts)

**Acceptance (требования, не PASS):**

- EXP-02-AC-01: Все 20 IDs функционально прослежены к code/test или зарегистрирован gap.
- EXP-02-AC-02: Review preview использует тот же SearchService и точно соответствует каталогу.
- EXP-02-AC-03: Неизвестный ответ не становится медицинской категорией или ложным hard constraint.
- EXP-02-AC-04: Невалидный бюджет видимо блокирует apply, остальные ответы сохраняются.

**Доказательства:** [EXP-02 — 20 mappings, AC-01…04 и QA](../expansion/stages/EXP-02.md). Все четыре AC: PASS_AUTOMATED, только synthetic; runtime gap не обнаружен. Human UAT/native KK/real AT NOT_RUN.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L256).

## EXP-03

DEMO: offer-level matching и каталог — **VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO)**. Охват: F037, F038, F039, F040, F041, F042, F043, F044, F045, F046, F047, F048, F049, F050, F051, F052, F053, F054, F055, F056, F057, F058, F059, F060.

**Цель:** Дать точный, объяснимый список конкретных услуг и честное пустое состояние.

**Предпосылки:** EXP-02.

**Технический объём:** Проверить 24 ID, strict hard filters, soft rank, unknown/incomplete, stale, tie-break, grouping after evaluation, price 0 vs UNKNOWN, error/retry. Не заменять текущий алгоритм LLM.

**Переиспользование:** SearchService/matching/freshness/SearchResult, Catalog, Filters, ResultMap.

**Недостающее:** Human parent/native KK/real AT/device review BLOCKED_EXTERNAL; all technical AC are evidenced below.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Дать точный, объяснимый список конкретных услуг и честное пустое состояние.

**Модели:** OfferEvaluation, SearchResult, FieldFreshness, MatchReason

**Безопасность:** No clinical prediction; offer provenance; без автоматического ослабления hard.

**Тесты:** matching/search Vitest + E2E filters/explanations; benchmark and build.

**Негативные сценарии:** multiple offers, mixed hard, unknown data, stale boundary, budget zero, 1000 offer performance.

**Внешние условия:** Родитель объясняет причины выбора, не считать тест алгоритма человеческой оценкой.

**Допустимый результат:** DEMO; реальные списки не подмешивать.

**Git checkpoint:** `docs(exp-03) contracts/evidence` → `test/feat(exp-03) validated slice` → `docs(exp-03) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/search/Catalog.tsx](../../src/features/search/Catalog.tsx); [src/features/search/Filters.tsx](../../src/features/search/Filters.tsx); [src/features/search/conditions.ts](../../src/features/search/conditions.ts); [src/domain/SearchService.ts](../../src/domain/SearchService.ts); [src/domain/matching.ts](../../src/domain/matching.ts); [src/domain/freshness.ts](../../src/domain/freshness.ts)

**Acceptance (требования, не PASS):**

- EXP-03-AC-01: Свойства двух офферов одного специалиста никогда не объединяются для ложного match.
- EXP-03-AC-02: Критерии и объяснения RU/KK коррелируют с результатом; stale исключает ложное verified.
- EXP-03-AC-03: 20/100/1000 synthetic offer benchmark задокументирован в той же среде, без fake field metrics.
- EXP-03-AC-04: Zero results не приводит к скрытой смене ограничений.

**Доказательства:** [EXP-03 closure/matrix](../expansion/stages/EXP-03.md), [actual results](../expansion/evidence/EXP-03.json), [before/after benchmark](../expansion/evidence/EXP-03-benchmark.md). Source ac82ec7209de0ec5e0154947193cafcb7be856ba; AC-01…04 PASS_AUTOMATED_SYNTHETIC.196 unit/integration +103 dev +54 dist +5 pilot +2 offline=360 PASS; failed0/skipped0. No independent human/live acceptance. A/B/C confirmed remote; D containing SHA resolved after push.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L309).

## EXP-04

DEMO: профиль, паспорт доверия, сравнение — **EXISTING_DEMO_WITH_LIMITATIONS**. Охват: F061, F062, F063, F064, F065, F066, F067, F068, F069, F070, F071, F072, F073, F074, F075.

**Цель:** Родитель видит условия конкретной услуги, источники фактов и сравнивает до трёх вариантов.

**Предпосылки:** EXP-03.

**Технический объём:** Проверить даты/единицы цены/offer switching, verified scopes, side-by-side desktop, mobile stack, action state и persistence. При статусе проверки обязательно показывать limitations.

**Переиспользование:** OfferProfile, TrustPassport, Comparison, дизайн 13.11.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Родитель видит условия конкретной услуги, источники фактов и сравнивает до трёх вариантов.

**Модели:** Offer, Specialist, VerificationFact, comparison selection

**Безопасность:** Синтетический badge не равен подлинной проверке диплома.

**Тесты:** profile/compare unit E2E screenshots.

**Негативные сценарии:** missing price/source, withdrawn service, stale fact, unavailable comparison item, KK long text.

**Внешние условия:** Проверка понимания бейджа родителем; native KK review.

**Допустимый результат:** DEMO; без обещаний качества услуг.

**Git checkpoint:** `docs(exp-04) contracts/evidence` → `test/feat(exp-04) validated slice` → `docs(exp-04) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/profile/OfferProfile.tsx](../../src/features/profile/OfferProfile.tsx); [src/features/profile/TrustPassport.tsx](../../src/features/profile/TrustPassport.tsx); [src/features/search/SelectionViews.tsx](../../src/features/search/SelectionViews.tsx); [src/features/search/OfferCard.tsx](../../src/features/search/OfferCard.tsx); [src/features/search/CompareTray.tsx](../../src/features/search/CompareTray.tsx); [src/domain/profile.ts](../../src/domain/profile.ts)

**Acceptance (требования, не PASS):**

- EXP-04-AC-01: Профиль отражает именно выбранный offer, ссылка и возврат работают.
- EXP-04-AC-02: В сравнение можно добавить/удалить 2–3 варианта без потери фильтров.
- EXP-04-AC-03: Паспорт показывает источник+дату+ограничение, неизвестный факт честно неизвестен.
- EXP-04-AC-04: На 390/1280 сравнение читается, keyboard accessible.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L366).

## EXP-05

DEMO: заявки, карта, PWA и устойчивость — **EXISTING_DEMO_WITH_LIMITATIONS**. Охват: F076, F077, F078, F079, F080, F081, F082, F083, F084, F085, F086, F087.

**Цель:** Закончить демонстрационный путь честной локальной записью действия и устойчивым восстановлением.

**Предпосылки:** EXP-04.

**Технический объём:** Не подключать реальный send. Проверить IndexedDB transaction, same-key retry, double-click, cancel, purge, 7-day TTL, map/list/geolocation refusal, public offline snapshot. Сохранить no-store private APIs.

**Переиспользование:** DemoRequestService, IndexedDB, SavedDemo, SW, ResultMap.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Закончить демонстрационный путь честной локальной записью действия и устойчивым восстановлением.

**Модели:** DemoRequest, RequestAttempt, public SavedDemo snapshot, shell manifest

**Безопасность:** Не отправлять в live; никаких sensitive данных в IndexedDB и cache; демозаявка не подтверждает визит.

**Тесты:** unit demo request + release E2E + offline Playwright.

**Негативные сценарии:** Corrupt sessionStorage, IndexedDB denial, abort, offline reload, duplicate clicks, expire, cancelled.

**Внешние условия:** Живой демо-прогон; проверить формулировку «реальная запись не создана».

**Допустимый результат:** DEMO only.

**Git checkpoint:** `docs(exp-05) contracts/evidence` → `test/feat(exp-05) validated slice` → `docs(exp-05) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/domain/DemoRequestService.ts](../../src/domain/DemoRequestService.ts); [src/data/IndexedDbRequestRepository.ts](../../src/data/IndexedDbRequestRepository.ts); [src/features/profile/DemoRequestEntry.tsx](../../src/features/profile/DemoRequestEntry.tsx); [src/features/request/DemoRequestStatus.tsx](../../src/features/request/DemoRequestStatus.tsx); [src/features/request/ClearDemoRequests.tsx](../../src/features/request/ClearDemoRequests.tsx); [src/features/pilot/SavedDemo.tsx](../../src/features/pilot/SavedDemo.tsx); [src/features/search/ResultMap.tsx](../../src/features/search/ResultMap.tsx); [src/domain/map.ts](../../src/domain/map.ts); [public/sw.js](../../public/sw.js)

**Acceptance (требования, не PASS):**

- EXP-05-AC-01: Success появляется только после подтверждённого локального сохранения, а не после click.
- EXP-05-AC-02: Двойной submit/uncertain response не порождает дубль.
- EXP-05-AC-03: Offline saved snapshot явно помечен stale; private API не кэшируется.
- EXP-05-AC-04: Карта доступна списком, отказ geolocation не блокирует поиск.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L414).

## EXP-06

PILOT_TEST: synthetic identity, роли и доступы — **EXISTING_PILOT_TEST_ONLY**. Охват: F088, F089, F090, F091, F092, F093, F094.

**Цель:** Убедиться, что тестовые акторы и серверный контроль доступны только в предназначенном synthetic режиме.

**Предпосылки:** EXP-00 и готовая база пилота.

**Технический объём:** Аудит role/owner/scope, cookie, CSRF/origin, session expiry/logout, invalid actor, operation throttle. Разработать interface для будущего IdP, не внедрять real login.

**Переиспользование:** server/http.ts, contracts.ts, service/store, PILOT_MODE/guard.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Убедиться, что тестовые акторы и серверный контроль доступны только в предназначенном synthetic режиме.

**Модели:** Actor, accounts, sessions, scopes

**Безопасность:** PILOT_TEST loopback; production mode login запрещён; не менять LIVE_BLOCKED.

**Тесты:** pilot unit real HTTP negative + 5 pilot E2E baseline.

**Негативные сценарии:** IDOR, role spoof, revoked sessions, CSRF, cross-site, brute test, logout failure.

**Внешние условия:** Production identity design требует ответственного security owner.

**Допустимый результат:** Только PILOT_TEST.

**Git checkpoint:** `docs(exp-06) contracts/evidence` → `test/feat(exp-06) validated slice` → `docs(exp-06) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/pilot/Pilot.tsx](../../src/features/pilot/Pilot.tsx); [src/features/pilot/api.ts](../../src/features/pilot/api.ts); [server/http.ts](../../server/http.ts); [server/service.ts](../../server/service.ts); [server/store.ts](../../server/store.ts)

**Acceptance (требования, не PASS):**

- EXP-06-AC-01: Гость не получает private data; Parent A не читает Parent B.
- EXP-06-AC-02: Specialist/Moderator/Admin не получают дневник родителя по роли.
- EXP-06-AC-03: Сессии/CSRF/Origin fail-closed; закрытая или expired session не продолжает запись.
- EXP-06-AC-04: NODE_ENV=production + test-login и PILOT_LIVE не стартуют.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L459).

## EXP-07

PILOT_TEST: специалист, анкета и модерация — **EXISTING_PILOT_TEST_ONLY**. Охват: F095, F096, F097, F098, F099, F100, F101, F102, F103, F104.

**Цель:** Отправить на проверку конкретный оффер, безопасно вернуть на доработку, публиковать и отзывать синтетическую запись.

**Предпосылки:** EXP-06.

**Технический объём:** Проверить model application lifecycle, assigned moderator, source scope, publication consent, freshness, immutable history, publish/withdraw, needs_changes, audit.

**Переиспользование:** Onboarding, Forms, server application+moderation.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Отправить на проверку конкретный оффер, безопасно вернуть на доработку, публиковать и отзывать синтетическую запись.

**Модели:** application Resource<ApplicationData>, public offer DTO, audit

**Безопасность:** Нельзя доверять specialist self-verified; private evidence не попадает в public projection.

**Тесты:** test state machine, forbidden transitions, E2E role workflow.

**Негативные сценарии:** Self-approval, stale review, unauthorized decision, overposting, deleted source.

**Внешние условия:** Реальные модераторы/SLA и проверка документов не утверждены.

**Допустимый результат:** Синтетическая модерация.

**Git checkpoint:** `docs(exp-07) contracts/evidence` → `test/feat(exp-07) validated slice` → `docs(exp-07) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/pilot/Onboarding.tsx](../../src/features/pilot/Onboarding.tsx); [src/features/pilot/Forms.tsx](../../src/features/pilot/Forms.tsx); [server/contracts.ts](../../server/contracts.ts); [server/service.ts](../../server/service.ts); [server/migrations/001_pilot.sql](../../server/migrations/001_pilot.sql)

**Acceptance (требования, не PASS):**

- EXP-07-AC-01: Только назначенный модератор решает допуск; специалист не self-publishes.
- EXP-07-AC-02: При изменении опубликованной услуги требуется новый review; history snapshot сохранён.
- EXP-07-AC-03: Withdraw немедленно удаляет предложение из публичного поиска.
- EXP-07-AC-04: Публичная projection не раскрывает внутреннее evidence или контактные данные.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L499).

## EXP-08

PILOT_TEST: обращения и статусы — **EXISTING_PILOT_TEST_ONLY**. Охват: F105, F106, F107, F108, F109, F110, F111, F112, F113, F114.

**Цель:** Подтвердить честное и устойчивое server-side создание обращения в sandbox с возможностью отзыва.

**Предпосылки:** EXP-06/07.

**Технический объём:** Воспроизвести platform received → sandbox available → replied → specialist-confirmed; cancel/revoke/delete; unique key + payload hash; restart durability.

**Переиспользование:** Contacts, Inbox, server contact state machine and idempotent operations.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Подтвердить честное и устойчивое server-side создание обращения в sandbox с возможностью отзыва.

**Модели:** contact Resource<ContactData>, operations, sandbox jobs, inbox

**Безопасность:** Server receipt ≠ provider delivered; no external send; owner checked.

**Тесты:** SQLite restart/transaction, negative HTTP, pilot E2E.

**Негативные сценарии:** Dropped response after commit, race/cancel, forged role, actor A/B, store restart.

**Внешние условия:** Контактный канал реального фонда не определён.

**Допустимый результат:** Sandbox only.

**Git checkpoint:** `docs(exp-08) contracts/evidence` → `test/feat(exp-08) validated slice` → `docs(exp-08) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/pilot/Contacts.tsx](../../src/features/pilot/Contacts.tsx); [src/features/pilot/Inbox.tsx](../../src/features/pilot/Inbox.tsx); [server/contracts.ts](../../server/contracts.ts); [server/service.ts](../../server/service.ts); [server/store.ts](../../server/store.ts)

**Acceptance (требования, не PASS):**

- EXP-08-AC-01: Повтор того же idempotency key возвращает тот же результат; другой payload получает conflict.
- EXP-08-AC-02: Отмена не допускает позднего перевода записи в active.
- EXP-08-AC-03: Статус appointment confirmed появляется только после разрешённого действия специалиста.
- EXP-08-AC-04: Нет фальшивых delivery/read states.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L542).

## EXP-09

PILOT_TEST: календарь, inbox и подписки — **EXISTING_PILOT_TEST_ONLY**. Охват: F115, F116, F117, F118, F119, F120, F121, F122.

**Цель:** Дать родителю организационную историю событий и безопасные in-app reminders без обещания фоновой доставки.

**Предпосылки:** EXP-08.

**Технический объём:** Проверить time zones, version conflicts, overlap warning, cancelled jobs, in-app opt-in, dedup and change alert semantics.

**Переиспользование:** Calendar, Inbox, NextAction-related jobs, offer subscriptions.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Дать родителю организационную историю событий и безопасные in-app reminders без обещания фоновой доставки.

**Модели:** CalendarData, jobs revision, subscription, change_notice

**Безопасность:** В уведомлении нет чувствительных полей; нет push/email/recurrence пока.

**Тесты:** calendar/reminder unit and browser pilot/offline.

**Негативные сценарии:** stale event revision, overlapping, server shutdown, late job, unknown time zone.

**Внешние условия:** Фоновая доставка и устройство пользователя не проверены.

**Допустимый результат:** In-app при работающем сервере, не push.

**Git checkpoint:** `docs(exp-09) contracts/evidence` → `test/feat(exp-09) validated slice` → `docs(exp-09) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/pilot/Calendar.tsx](../../src/features/pilot/Calendar.tsx); [src/features/pilot/Inbox.tsx](../../src/features/pilot/Inbox.tsx); [server/service.ts](../../server/service.ts); [server/contracts.ts](../../server/contracts.ts)

**Acceptance (требования, не PASS):**

- EXP-09-AC-01: Реальный confirmed event рождается из разрешённого подтверждения, personal событие остаётся planned.
- EXP-09-AC-02: Редактирование/отмена инвалидируют старое напоминание и предотвращают повторные inbox-сообщения.
- EXP-09-AC-03: Подписка отключаемая, косметическое обновление не создаёт notice.
- EXP-09-AC-04: Таймзоны, DST/leap и частичное отсутствие сети обработаны честно.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L585).

## EXP-10

PILOT_TEST: next action, приватные цели и сводка — **EXISTING_PILOT_TEST_ONLY**. Охват: F123, F124, F125, F126, F127, F128, F129, F130.

**Цель:** Сопровождать организационные задачи семьи без рейтинга ребёнка, профилирования состояния или неподтверждённой медицинской помощи.

**Предпосылки:** EXP-06/08/09.

**Технический объём:** Проверить CRUD/version/deletion, scoped assignment and response, question/unable, retraction, summary opt-in selection, clipboard and download.

**Переиспользование:** NextAction, PrivateRecords, goals/diary/assignments, summary.

**Недостающее:** Полевые проверки/KK и доказательство каждого нового EXP AC; existing code не пересоздавать.

**Backend:** Сохранять текущие domain/storage contracts; private authority в server/service.ts.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Сопровождать организационные задачи семьи без рейтинга ребёнка, профилирования состояния или неподтверждённой медицинской помощи.

**Модели:** GoalData, DiaryData, AssignmentData, next marker, Summary Preview

**Безопасность:** Дневник приватен даже от модератора и специалиста без отдельного explicit scope; scrub sensitive text from audit.

**Тесты:** pilot unit+E2E private and scoped cases.

**Негативные сценарии:** XSS literal, cross-account, revoked scope, stale version, clipboard denial, export denial.

**Внешние условия:** Необходимость полей дневника и реальный consent требуют интервью и privacy owner.

**Допустимый результат:** Synthetic privacy-only.

**Git checkpoint:** `docs(exp-10) contracts/evidence` → `test/feat(exp-10) validated slice` → `docs(exp-10) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** [src/features/pilot/NextAction.tsx](../../src/features/pilot/NextAction.tsx); [src/features/pilot/PrivateRecords.tsx](../../src/features/pilot/PrivateRecords.tsx); [server/service.ts](../../server/service.ts); [server/contracts.ts](../../server/contracts.ts)

**Acceptance (требования, не PASS):**

- EXP-10-AC-01: Редактирование/удаление goals/diary не раскрывает текст audit или чужому аккаунту.
- EXP-10-AC-02: Специалист видит только recipient+scope и версию собственной инструкции.
- EXP-10-AC-03: Manual next-action marker не меняет lifecycle записи.
- EXP-10-AC-04: Summary default-empty, только явно выбранные поля, никакой внешней отправки.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L626).

## EXP-11

LATER: deterministic Қарлығаш и explainability — **PLANNED_WITH_PARTIAL_FOUNDATIONS**. Охват: F131, F132, F133, F134, F135, F136, F137, F138, F139, F140.

**Цель:** Интерактивный проводник снижает неопределённость, но не подменяет специалиста и не выдаёт диагноз.

**Предпосылки:** EXP-01–04; sources/QA completed.

**Технический объём:** Создать decision graph + safe dictionary: questions for missing facts; explain category, reasons, next action, safe zero results; optional LLM adapter interface with feature flag OFF. UI clear fallback.

**Переиспользование:** Bird, text dictionaries, search explanations and trust facts.

**Недостающее:** Создать decision graph + safe dictionary: questions for missing facts; explain category, reasons, next action, safe zero results; optional LLM adapter interface with feature flag OFF. UI clear fallback.

**Backend:** Создать decision graph + safe dictionary: questions for missing facts; explain category, reasons, next action, safe zero results; optional LLM adapter interface with feature flag OFF. UI clear fallback.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Интерактивный проводник снижает неопределённость, но не подменяет специалиста и не выдаёт диагноз.

**Модели:** Proposed GuidanceDecision, sourced question, deterministic rule graph

**Безопасность:** Запрет медсоветов, вымышленных фактов/verified badges; sanitize input; no child-sensitive payload.

**Тесты:** table-driven rules; negative medical assertions; E2E guide RU/KK.

**Негативные сценарии:** prompt injection, category ambiguity, stale facts, 0 matches, misleading medical language.

**Внешние условия:** Родитель и эксперт по текстам проверяют понятность; native KK review.

**Допустимый результат:** Synthetic demo of guidance; AI outbound OFF.

**Git checkpoint:** `docs(exp-11) contracts/evidence` → `test/feat(exp-11) validated slice` → `docs(exp-11) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-11-AC-01: Қарлығаш умеет объяснять подход и источник каждого факта на RU/KK без LLM.
- EXP-11-AC-02: Trust Gap задаёт вопрос по неизвестному факту и не отвечает за специалиста.
- EXP-11-AC-03: Zero results объясняет ограничение, не снимает hard без подтверждения.
- EXP-11-AC-04: Offline/error → deterministic fallback без фальшивого AI-thinking.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L667).

## EXP-12

LATER: voice, semantic search и assistant safety — **PLANNED_WITH_PARTIAL_FOUNDATIONS**. Охват: F141, F142, F143, F144, F145, F146, F147, F148, F149, F150.

**Цель:** Упростить навигацию для разных пользователей при сохранении текста как основного и полностью доступного пути.

**Предпосылки:** EXP-11, manual accessibility review.

**Технический объём:** Определить voice command grammar RU/KK, confirmation before mutations; TTS as optional local/browser capability, semantic retrieval only over allowlisted public source-backed facts; optional LLM after separate review.

**Переиспользование:** Existing search input schema and deterministic assistant; no new PII needed.

**Недостающее:** Определить voice command grammar RU/KK, confirmation before mutations; TTS as optional local/browser capability, semantic retrieval only over allowlisted public source-backed facts; optional LLM after separate review.

**Backend:** Определить voice command grammar RU/KK, confirmation before mutations; TTS as optional local/browser capability, semantic retrieval only over allowlisted public source-backed facts; optional LLM after separate review.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Упростить навигацию для разных пользователей при сохранении текста как основного и полностью доступного пути.

**Модели:** Proposed voice command and public fact retrieval contracts

**Безопасность:** Микрофон только по явному действию, кратковременные данные, stop controls; no passive recording; semantic search не обходит hard rules.

**Тесты:** text/voice command grammar unit, mocked mic denies, schema, security prompt tests.

**Негативные сценарии:** misrecognition KK, prompt injection, inaccessible voice-only action, no permission.

**Внешние условия:** Носители RU/KK, accessibility reviewers и privacy owner до реального voice.

**Допустимый результат:** Опциональный синтетический prototype; voice не обязателен к хакатону.

**Git checkpoint:** `docs(exp-12) contracts/evidence` → `test/feat(exp-12) validated slice` → `docs(exp-12) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-12-AC-01: Все голосовые команды имеют текстовый эквивалент, отключаемы и объясняют разрешения.
- EXP-12-AC-02: AI/semantic result проходит те же hard filters и provenance controls.
- EXP-12-AC-03: Вопрос о медицинском диагнозе не превращается в совет по лечению.
- EXP-12-AC-04: Отказ микрофона/поставщика сохраняет работоспособность DEMO.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L710).

## EXP-13

LATER: Accessibility Fit + True Cost Calculator — **PLANNED**. Охват: F151, F152, F153, F154.

**Цель:** Сопоставить доступность помещения и экономическую сторону посещений без недоказанных свойств и «скрытых цен».

**Предпосылки:** EXP-03, verified/source-backed schema.

**Технический объём:** Создать source-backed venue attributes; cost calculator с прозрачными inputs: offer price/unit × planned visits + travel estimate + separately known fees; ranges, unknown and editable assumptions.

**Переиспользование:** Offer DTO, price fields, location unknown handling, Intl KZT.

**Недостающее:** Создать source-backed venue attributes; cost calculator с прозрачными inputs: offer price/unit × planned visits + travel estimate + separately known fees; ranges, unknown and editable assumptions.

**Backend:** Создать source-backed venue attributes; cost calculator с прозрачными inputs: offer price/unit × planned visits + travel estimate + separately known fees; ranges, unknown and editable assumptions.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Сопоставить доступность помещения и экономическую сторону посещений без недоказанных свойств и «скрытых цен».

**Модели:** Proposed VenueAccessibility and CostEstimate (KZT/visits/travel/unknown)

**Безопасность:** Не выводить особые потребности ребёнка по ответам и не помечать «подходит для состояния X».

**Тесты:** domain cost math/property cases, i18n, a11y, comparison E2E.

**Негативные сценарии:** unknown price, free=0, different units, missing travel, venue source expired, overflow.

**Внешние условия:** Реальное подтверждение атрибутов и стоимости делает владелец данных.

**Допустимый результат:** Synthetic only until sourced real offers.

**Git checkpoint:** `docs(exp-13) contracts/evidence` → `test/feat(exp-13) validated slice` → `docs(exp-13) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-13-AC-01: Если вход не подтверждён, UI пишет unknown, не «доступно».
- EXP-13-AC-02: Стоимость рассчитана по ясной формуле и показана как оценка, не оферта.
- EXP-13-AC-03: Множитель frequency/visits, KZT и неизвестные расходы явно видны.
- EXP-13-AC-04: Матрица доступности использует факты помещения, не диагнозы.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L753).

## EXP-14

LATER: маршруты, доступность слотов и расширенный поиск — **PLANNED**. Охват: F155, F156, F157, F158, F159, F160, F161, F162, F163, F164, F165, F166.

**Цель:** Помочь осознанно находить варианты по времени, дороге, нескольким районам и изменению предложений без ложных гарантий.

**Предпосылки:** EXP-03/13; external provider agreement for real routes/availability.

**Технический объём:** Схема verified slots/stale timestamps; route provider interface, multi-district search, saved searches, notification subscriptions, alternative after cancellation, offer validity policy; ручное смягчение soft.

**Переиспользование:** SearchService, ResultMap and in-app subscriptions.

**Недостающее:** Схема verified slots/stale timestamps; route provider interface, multi-district search, saved searches, notification subscriptions, alternative after cancellation, offer validity policy; ручное смягчение soft.

**Backend:** Схема verified slots/stale timestamps; route provider interface, multi-district search, saved searches, notification subscriptions, alternative after cancellation, offer validity policy; ручное смягчение soft.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Помочь осознанно находить варианты по времени, дороге, нескольким районам и изменению предложений без ложных гарантий.

**Модели:** Proposed verified slot, RouteEstimate, saved search, multi-district query

**Безопасность:** Геолокация opt-in, private route inputs not logged; no fake real-time booking.

**Тесты:** adapter contract fake, invalid slots, A/B isolation, permission tests, responsive.

**Негативные сценарии:** route API unavailable, stale slots, geolocation denied, multiple districts/unknown availability.

**Внешние условия:** Настоящий поставщик расписания/карт, согласия на geo и проверенные данные.

**Допустимый результат:** Mock routes/slots until provider and agreement.

**Git checkpoint:** `docs(exp-14) contracts/evidence` → `test/feat(exp-14) validated slice` → `docs(exp-14) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-14-AC-01: Свободный слот показывается только с provider timestamp и статусом, без подтверждения не booking.
- EXP-14-AC-02: Если маршрутизатор недоступен, показываются адрес и неопределённая длительность, не придуманное ETA.
- EXP-14-AC-03: Сохранённые фильтры остаются tenant-scoped, уведомления opt-in и dedup.
- EXP-14-AC-04: После отмены предлагаются варианты, не создавая новую запись самостоятельно.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L790).

## EXP-15

LATER: Social Support Navigator — **PLANNED**. Охват: F167, F168, F169, F170.

**Цель:** Позволить семье увидеть и понять условия доступных бесплатных/льготных программ без обещания права участия.

**Предпосылки:** EXP-03/13; human source verification.

**Технический объём:** SupportProgram schema with region, issuer, verified conditions, expiry, eligibility, limits, source link, contact method, human verification role. Search/list/filter, rule-based question checklist.

**Переиспользование:** Existing catalog, trust provenance, RU/KK filters.

**Недостающее:** SupportProgram schema with region, issuer, verified conditions, expiry, eligibility, limits, source link, contact method, human verification role. Search/list/filter, rule-based question checklist.

**Backend:** SupportProgram schema with region, issuer, verified conditions, expiry, eligibility, limits, source link, contact method, human verification role. Search/list/filter, rule-based question checklist.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Позволить семье увидеть и понять условия доступных бесплатных/льготных программ без обещания права участия.

**Модели:** Proposed SupportProgram with source/eligibility/expiry

**Безопасность:** Не спрашивать диагноз или загружать документы для простой выдачи; право на льготу не определять автоматически.

**Тесты:** support source validation, expired boundaries, catalogue E2E.

**Негативные сценарии:** missing source, expired program, mixed funding, no eligibility, update conflicts.

**Внешние условия:** Реестр программ и условия подтверждает фонд/ответственный.

**Допустимый результат:** Синтетические программы до подтверждения организаций.

**Git checkpoint:** `docs(exp-15) contracts/evidence` → `test/feat(exp-15) validated slice` → `docs(exp-15) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-15-AC-01: Каждая программа имеет source URL, date checked, status и ограничение.
- EXP-15-AC-02: Unknown eligibility объясняется и отправляет к официальному источнику, не автоматически APPROVED.
- EXP-15-AC-03: Можно отфильтровать бесплатные/субсидируемые, доступны RU/KK.
- EXP-15-AC-04: Истёкшие программы скрыты или явно stale, synthetic fixtures заметны.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L835).

## EXP-16

LATER: production identity, family permissions, consent — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F171, F172, F173, F174, F175, F176, F177, F178, F179, F180.

**Цель:** Определить реальные учётные записи, полномочия представителей ребёнка и целевые согласия без несанкционированного расширения доступа.

**Предпосылки:** EXP-06/10 + legal/privacy/operator gate.

**Технический объём:** Сначала synthetic family relationship and consent version/revoke model. Строго отделить future identity provider, MFA/account recovery, privacy export and relation expiry. Не заменять synthetic login на self-declared parent.

**Переиспользование:** Existing synthetic RBAC/owner checks, Zod contracts, sessions.

**Недостающее:** Сначала synthetic family relationship and consent version/revoke model. Строго отделить future identity provider, MFA/account recovery, privacy export and relation expiry. Не заменять synthetic login на self-declared parent.

**Backend:** Сначала synthetic family relationship and consent version/revoke model. Строго отделить future identity provider, MFA/account recovery, privacy export and relation expiry. Не заменять synthetic login на self-declared parent.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Определить реальные учётные записи, полномочия представителей ребёнка и целевые согласия без несанкционированного расширения доступа.

**Модели:** Proposed FamilyRelation, Invitation, ConsentRecord, ResourcePolicy, production IdP boundary

**Безопасность:** Принцип наименьших привилегий, purpose-specific consent, no auto diary access, encrypted-at-rest planning, audit without child content.

**Тесты:** policy matrix, consent/revoke, auth E2E synthetic.

**Негативные сценарии:** replayed invites, leaked token, family impersonation, export other child, stolen session.

**Внешние условия:** Юрист РК, оператор, подтверждение полномочий законного представителя, security review.

**Допустимый результат:** Только проектирование/synthetic tests до approval.

**Git checkpoint:** `docs(exp-16) contracts/evidence` → `test/feat(exp-16) validated slice` → `docs(exp-16) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-16-AC-01: Invited adult получает только указанные scopes/время, A/B изоляция выдерживает отрицательные тесты.
- EXP-16-AC-02: Revoked/expired invite мгновенно закрывает дальнейшие чтения/записи.
- EXP-16-AC-03: Consent version меняет разрешение целевого действия, withdrawal effects проверяются.
- EXP-16-AC-04: Реальный IdP и enrollment остаются behind explicit external gate.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L872).

## EXP-17

LATER: семейная координация и portability — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F181, F182, F183, F184, F185.

**Цель:** Помочь нескольким законно уполномоченным взрослым согласованно вести организационные задачи без лишнего доступа к приватным записям.

**Предпосылки:** EXP-16.

**Технический объём:** Shared calendar and question list as separate resources with explicit grants; safe export, delete request lifecycle, shared favorites and revocation semantics.

**Переиспользование:** Calendar, private records, saved offers, consent scopes.

**Недостающее:** Shared calendar and question list as separate resources with explicit grants; safe export, delete request lifecycle, shared favorites and revocation semantics.

**Backend:** Shared calendar and question list as separate resources with explicit grants; safe export, delete request lifecycle, shared favorites and revocation semantics.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Помочь нескольким законно уполномоченным взрослым согласованно вести организационные задачи без лишнего доступа к приватным записям.

**Модели:** Proposed SharedTask, SharedQuestion, family favorite, deletion workflow

**Безопасность:** Усечённый default share, приватное не передаётся автоматически, expiry and revocation applied on every read.

**Тесты:** A/B, scope, export, revoked capability, concurrency.

**Негативные сценарии:** cross-family share, stale group membership, leaked export, simultaneous updates.

**Внешние условия:** Approval family authority, record retention policy.

**Допустимый результат:** Synthetic until legal/ops.

**Git checkpoint:** `docs(exp-17) contracts/evidence` → `test/feat(exp-17) validated slice` → `docs(exp-17) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-17-AC-01: Shared item доступен только конкретно приглашённому пользователю.
- EXP-17-AC-02: Отзыв права немедленно скрывает записи и будущие выгрузки.
- EXP-17-AC-03: Экспорт содержит только разрешённые поля и даты; удаление фиксирует workflow и retention limitations.
- EXP-17-AC-04: Параллельные правки показывают conflict, не перетирают записи.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L915).

## EXP-18

LATER: связь с живым специалистом и каналы уведомлений — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F186, F187, F188, F189, F190, F191, F192, F193, F194, F195.

**Цель:** Не только сохранить тестовую заявку, а честно доставить согласованное обращение и показать точный статус.

**Предпосылки:** EXP-08 + EXP-16/20 + provider authorization.

**Технический объём:** Outbox, fake provider, queued/sent/provider_ack/delivered/read distinct, signed callbacks, retries, cancellation, chat boundary, push/email/Telegram adapter toggles. Все реальные endpoints по умолчанию OFF.

**Переиспользование:** Sandbox inbox/contact state machine, idempotency, consent.

**Недостающее:** Outbox, fake provider, queued/sent/provider_ack/delivered/read distinct, signed callbacks, retries, cancellation, chat boundary, push/email/Telegram adapter toggles. Все реальные endpoints по умолчанию OFF.

**Backend:** Outbox, fake provider, queued/sent/provider_ack/delivered/read distinct, signed callbacks, retries, cancellation, chat boundary, push/email/Telegram adapter toggles. Все реальные endpoints по умолчанию OFF.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Не только сохранить тестовую заявку, а честно доставить согласованное обращение и показать точный статус.

**Модели:** Proposed OutboundMessage, signed receipt, Booking, FakeProvider, chat policy

**Безопасность:** Server-side secrets, provider permission, anti-abuse, opt-in, per-purpose consent, content minimization, no sensitive lock-screen.

**Тесты:** fake-provider integration, webhook crypto signatures, queue idempotency, CSRF/IDOR.

**Негативные сценарии:** provider down, lost receipt, forged callback, revoked consent, duplicate, 429, timeout.

**Внешние условия:** Подключение/договор с каналом, одобрение оператора и получателей, incident plan.

**Допустимый результат:** Integration fake-only; real messages blocked.

**Git checkpoint:** `docs(exp-18) contracts/evidence` → `test/feat(exp-18) validated slice` → `docs(exp-18) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-18-AC-01: No duplicate real-effect attempts on retry; fake provider records attempt once.
- EXP-18-AC-02: UI не называет DELIVERED без provider receipt и не называет booking confirmed без специалиста.
- EXP-18-AC-03: Отозванный consent предотвращает будущую отправку, errors recoverable.
- EXP-18-AC-04: Chat out-of-scope private files/diagnoses are blocked absent approved model.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L953).

## EXP-19

LATER: календарные интеграции и booking lifecycle — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F196, F197, F198, F199, F200.

**Цель:** Предотвратить двойную запись, обеспечить отмену/перенос и синхронизацию только после реального подтверждения.

**Предпосылки:** EXP-18; trusted provider slots.

**Технический объём:** Google Calendar provider interface, OAuth scope plan, recurrence RRULE/zone, specialist availability, waitlist, collision detection, cancellation and automatic suggestion with manual confirm.

**Переиспользование:** Calendar timed event schema, contact confirmation.

**Недостающее:** Google Calendar provider interface, OAuth scope plan, recurrence RRULE/zone, specialist availability, waitlist, collision detection, cancellation and automatic suggestion with manual confirm.

**Backend:** Google Calendar provider interface, OAuth scope plan, recurrence RRULE/zone, specialist availability, waitlist, collision detection, cancellation and automatic suggestion with manual confirm.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Предотвратить двойную запись, обеспечить отмену/перенос и синхронизацию только после реального подтверждения.

**Модели:** Proposed calendar grant, recurrence, waitlist, slot version

**Безопасность:** Calendar tokens protected backend, consent for sync, no sensitive title in third-party calendar by default.

**Тесты:** booking transactional integration, fake calendar OAuth, timezone, replay/race.

**Негативные сценарии:** DST, leap, revoked OAuth, race double-book, provider latency, recurrence edits.

**Внешние условия:** Provider contracts/permissions, real specialist calendar, test accounts and approval.

**Допустимый результат:** Mock provider until approvals.

**Git checkpoint:** `docs(exp-19) contracts/evidence` → `test/feat(exp-19) validated slice` → `docs(exp-19) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-19-AC-01: Conflicting slot rejected or surfaced as stale, never silently double-booked.
- EXP-19-AC-02: Reschedule/cancel changes event and invalidates reminders consistently.
- EXP-19-AC-03: Waitlist offers are invitations, not automatic booking or unsolicited messages.
- EXP-19-AC-04: OAuth absent → safe local calendar unchanged.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L996).

## EXP-20

LATER: реальный trust, модерация, отзывы — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F201, F202, F203, F204, F205, F206, F207, F208, F209, F210.

**Цель:** Проверяемые факты квалификации и доступных услуг, безопасный процесс жалоб и прозрачность отзывов.

**Предпосылки:** EXP-07 + EXP-16/18 + qualified moderator.

**Технический объём:** Verified scope for education/org/identity, document handling boundary without real uploads, review/appeal with audit, expiry revocation, verified contact-linked reviews and specialist response.

**Переиспользование:** Synthetic trust passport, moderation source/fact model.

**Недостающее:** Verified scope for education/org/identity, document handling boundary without real uploads, review/appeal with audit, expiry revocation, verified contact-linked reviews and specialist response.

**Backend:** Verified scope for education/org/identity, document handling boundary without real uploads, review/appeal with audit, expiry revocation, verified contact-linked reviews and specialist response.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Проверяемые факты квалификации и доступных услуг, безопасный процесс жалоб и прозрачность отзывов.

**Модели:** Proposed VerificationCase, Appeal, Review, reviewer evidence metadata

**Безопасность:** Никакого AI self-verification, no public evidence scans, impersonation defense, neutral moderation, challenge handling.

**Тесты:** RBAC, state machine, audit and moderation E2E.

**Негативные сценарии:** self-review, forged source, duplicate reviews, conflicts, expired evidence, privilege escalation.

**Внешние условия:** Назначенные компетентные модераторы, процедура проверки реальных документов, согласия на отзывы.

**Допустимый результат:** Synthetic fake evidence only until human-approved.

**Git checkpoint:** `docs(exp-20) contracts/evidence` → `test/feat(exp-20) validated slice` → `docs(exp-20) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-20-AC-01: Каждый verification badge имеет scope/source/date/reviewer, stale revokes visible status.
- EXP-20-AC-02: Неавторизованный специалист не утверждает собственную квалификацию.
- EXP-20-AC-03: Verified review связан с реальным разрешённым interaction, без disclosure ребёнка.
- EXP-20-AC-04: Appeal не меняет public status без ответственного reviewer.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L1034).

## EXP-21

LATER: Social Impact Dashboard и research metrics — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F211, F212, F213, F214, F215, F216, F217.

**Цель:** Измерять устранение информационных барьеров, а не выдумывать медицинские показатели успеха.

**Предпосылки:** EXP-00, research protocol, consent/retention if live.

**Технический объём:** Event taxonomy and consent gate, synthetic metrics: time-to-understand, clarify questions, filter recoveries, search completion, confirmed contact, failed demand, geographic gaps; cohort thresholds; source label.

**Переиспользование:** Research hypotheses, test event schema; no existing real-user data.

**Недостающее:** Event taxonomy and consent gate, synthetic metrics: time-to-understand, clarify questions, filter recoveries, search completion, confirmed contact, failed demand, geographic gaps; cohort thresholds; source label.

**Backend:** Event taxonomy and consent gate, synthetic metrics: time-to-understand, clarify questions, filter recoveries, search completion, confirmed contact, failed demand, geographic gaps; cohort thresholds; source label.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Измерять устранение информационных барьеров, а не выдумывать медицинские показатели успеха.

**Модели:** Proposed ImpactEvent, aggregate metric, small-cohort suppression

**Безопасность:** No private diary text in analytics; no unconsented identifiers; aggregate/small-cohort suppression.

**Тесты:** aggregator property/fake telemetry, privacy no-sensitive, dashboard E2E.

**Негативные сценарии:** n=0, very small group, same event duplicate, opt-out, missing consent.

**Внешние условия:** Реальное интервью и оператор analytics policy before field events.

**Допустимый результат:** Synthetic measurement demo; real impact not claimed.

**Git checkpoint:** `docs(exp-21) contracts/evidence` → `test/feat(exp-21) validated slice` → `docs(exp-21) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-21-AC-01: Synthetic dashboard явно маркирован, не выдаётся за реальные результаты интервью.
- EXP-21-AC-02: Метрика раскрывает numerator/denominator, период, статус данных, sample n.
- EXP-21-AC-03: Отсутствие live events показывает «данных нет», не 100% успеха.
- EXP-21-AC-04: Нет показателей выздоровления/качества ребёнка из интерфейсной активности.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L1077).

## EXP-22

LATER: кабинет фонда, партнёры, Telegram, регионы — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F218, F219, F220, F221, F222, F223, F224.

**Цель:** Сделать масштабируемый административный контур, не превращая внутреннюю статистику в доступ к частным семейным данным.

**Предпосылки:** EXP-15/16/18/20/21; partner agreements.

**Технический объём:** Partner portal with scoped org roles, programs, review workflow, public API contracts/rate limits, Telegram Mini App as optional presentation shell, multi-city data partitions & localisation.

**Переиспользование:** Role-based admin, public offers, moderation, safe aggregate events.

**Недостающее:** Partner portal with scoped org roles, programs, review workflow, public API contracts/rate limits, Telegram Mini App as optional presentation shell, multi-city data partitions & localisation.

**Backend:** Partner portal with scoped org roles, programs, review workflow, public API contracts/rate limits, Telegram Mini App as optional presentation shell, multi-city data partitions & localisation.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Сделать масштабируемый административный контур, не превращая внутреннюю статистику в доступ к частным семейным данным.

**Модели:** Proposed PartnerOrganization, scoped role, API grant, region

**Безопасность:** Partner cannot read other organizations/family diary; API keys rotatable, scopes fine-grained, logging and abuse controls.

**Тесты:** partner A/B, API scopes, region TZ, rate limits, contract.

**Негативные сценарии:** org IDOR, token leakage, API spam, region mixing, revoked partnership.

**Внешние условия:** Фонд/партнёры, соглашения, budgets, approved provider policies.

**Допустимый результат:** Synthetic partner fixtures until agreements.

**Git checkpoint:** `docs(exp-22) contracts/evidence` → `test/feat(exp-22) validated slice` → `docs(exp-22) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-22-AC-01: Public/partner endpoints return only allowlisted data, enforce scopes and provenance.
- EXP-22-AC-02: Другой город не меняет базовые права; фильтры и таймзоны корректны.
- EXP-22-AC-03: Telegram shell работает без расширения разрешений и без вывода private data в URL.
- EXP-22-AC-04: Фонд видит агрегаты и назначенные задачи, не весь личный дневник.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L1117).

## EXP-23

LATER: observability, backups, production security, real-device a11y — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F225, F226, F227, F228.

**Цель:** Управляемость и готовность инфраструктуры к безопасному ограниченному пилоту.

**Предпосылки:** EXP-06/16/18/20/22; operator/security owners.

**Технический объём:** Staging infrastructure plan, logs/metrics with redaction, incident escalation, backup+restore drill on synthetic DB, token rotation, data retention/delete pipeline, CSP/HSTS on TLS layer, SCA, tests across devices and assistive tech.

**Переиспользование:** Existing audit metadata, CI, release runbooks, live readiness register.

**Недостающее:** Staging infrastructure plan, logs/metrics with redaction, incident escalation, backup+restore drill on synthetic DB, token rotation, data retention/delete pipeline, CSP/HSTS on TLS layer, SCA, tests across devices and assistive tech.

**Backend:** Staging infrastructure plan, logs/metrics with redaction, incident escalation, backup+restore drill on synthetic DB, token rotation, data retention/delete pipeline, CSP/HSTS on TLS layer, SCA, tests across devices and assistive tech.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Управляемость и готовность инфраструктуры к безопасному ограниченному пилоту.

**Модели:** Proposed Incident, BackupManifest, RestoreReport, access review

**Безопасность:** Not merely scan tools: require access review, encryption/secrets, recovery RTO/RPO proposal and tested restore, vulnerability triage.

**Тесты:** restore drill, failover simulation, secret scan, E2E release and independent manual.

**Негативные сценарии:** corrupt DB, restore conflict, leaked logs, absent owner, expired credential, inaccessible form.

**Внешние условия:** Security owner, ops oncall, privacy owner, device testers, native KK editor.

**Допустимый результат:** Production readiness gate still BLOCKED until operational proof.

**Git checkpoint:** `docs(exp-23) contracts/evidence` → `test/feat(exp-23) validated slice` → `docs(exp-23) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-23-AC-01: Синтетический backup+restore в чистом окружении повторён и проверен checksum/record semantics.
- EXP-23-AC-02: Алёрты не раскрывают PII, key expiry/rotation monitored, least privilege documented.
- EXP-23-AC-03: CI reports checks accurately, dependency risk triaged, rollback measured.
- EXP-23-AC-04: Реальные screen reader/Android/iOS имеют протокол или честный NOT_RUN.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L1157).

## EXP-24

LATER: ограниченный live pilot и production launch — **BLOCKED_EXTERNAL_FOR_LIVE**. Охват: F229, F230.

**Цель:** Контролируемо проверить реальную полезность при сохранении права на остановку, поддержку и исправление ошибок.

**Предпосылки:** EXP-16–23 + all required LIVE_READINESS sign-offs.

**Технический объём:** Только после отдельного письменного разрешения: staging review, contract/legal checklist, informed consent, limited cohorts, support/oncall, rollback/switch-off, monitoring and post-launch review. Без разрешения подготовить полный go/no-go pack и остановиться.

**Переиспользование:** Product demo/synthetic platform, pilot plan, release manifests.

**Недостающее:** Только после отдельного письменного разрешения: staging review, contract/legal checklist, informed consent, limited cohorts, support/oncall, rollback/switch-off, monitoring and post-launch review. Без разрешения подготовить полный go/no-go pack и остановиться.

**Backend:** Только после отдельного письменного разрешения: staging review, contract/legal checklist, informed consent, limited cohorts, support/oncall, rollback/switch-off, monitoring and post-launch review. Без разрешения подготовить полный go/no-go pack и остановиться.

**Frontend:** RU/KK; semantic controls, 320–430px, focus, empty/error/retry; Контролируемо проверить реальную полезность при сохранении права на остановку, поддержку и исправление ошибок.

**Модели:** Proposed LaunchApproval, cohort/support/rollback checklist

**Безопасность:** No live personal information without formal lawful processing, no public deployment by this prompt alone.

**Тесты:** staging drills only; UAT independent; no production deployment until separate authorization.

**Негативные сценарии:** denied consent, incident, broken rollback, provider outage, missing support, unknown legal basis.

**Внешние условия:** Юрист, оператор/фонд, privacy и security owners, реальные специалисты, письменный authorization.

**Допустимый результат:** BLOCKED_EXTERNAL из исходного состояния.

**Git checkpoint:** `docs(exp-24) contracts/evidence` → `test/feat(exp-24) validated slice` → `docs(exp-24) handoff`, каждый содержательный шаг commit+push после проверок; точные SHA фиксировать в STATE.json.

**Существующая реализация:** Целевого runtime модуля нет.

**Acceptance (требования, не PASS):**

- EXP-24-AC-01: Go/no-go checklist имеет имена ответственных, доказательства и даты, не заполнен фиктивно.
- EXP-24-AC-02: Release candidate SHA воспроизводим, smoke/rollback/recovery инцидентный сценарий проверены.
- EXP-24-AC-03: Пилот имеет согласованный recruitment/support/retention/incident scope и explicit stop condition.
- EXP-24-AC-04: Если любой gate не закрыт — статус NO-GO, `LIVE_BLOCKED` не менять.

**Доказательства:** [baseline validation](VALIDATION.md), code SHA 7f8434a4cfd097b531fa584f5b97ebd1e772ad92; per-AC status NOT_INDIVIDUALLY_ADJUDICATED. Новые implementation commits этой фазы отсутствуют.

**Оригинал:** [карточка плана](sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md#L1194).

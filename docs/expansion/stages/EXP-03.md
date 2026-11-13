# EXP-03 — F037–F060

Scope: synthetic DEMO only; LIVE_BLOCKED. Branch `codex/exp-03-offer-matching`, base `0ebd5bf206f082db718945096b7abfdeee1fa31b`. Default observed at `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. No merge/deploy. EXP-04 requires a new user instruction.

## A — audit/contracts

Checkpoint A verified the existing contracts and baseline: `npm ci` exit 0; `npm run check` strict TS +154 unit/integration tests +historical registry PASS. All context files were read/indexed; generated registry hashes are inventory, not independent line-by-line security review. [Source ledger](../evidence/EXP-03-source-ledger.json). The attached 01/02/03 match the archived source package. Research is the available Markdown derivative; original DOCX is unavailable. Original feature CSV has 231 IDs; EXP-03 is exactly F037–F060.

Architecture: UI Catalog/Filters → normalizeSearchInput/schema → publicCatalog/schema/publication → text candidate selection → evaluateOffer per offer → hard fail/exact/incomplete → stable order → specialist grouping. Profile/compare use inspectOffer. There is no CORE search HTTP API or database query: public synthetic JSON + synchronous pure evaluator. Pilot publicOffers is a separate synthetic API; this task does not wire it to CORE.

Contracts retained: category OR is mandatory; age requires full group inclusion; partial age is unknown; language/format/budget/district can be hard or soft. Availability is an explicitly labelled ranking preference, never a real slot. Online-only hard format disables district. Unknown hard fields enter incomplete only when no hard field fails. Known false has coverage; missing/stale does not. Score and coverage use the same request-wide weighted denominator (30/15/15/10/15/10/5); neutral score is null. Price free=explicit zero, exact/from>0, unknown=null. At TTL (price30d/availability7d) evidence is stale; updatedAt cannot refresh it. Clock is catalog.demoClock in DEMO. Neither score nor provenance promises clinical suitability.

Confirmed gaps to fix in B/C: text candidate selection omits RU/KK offer titles; default-locale ID tie-break depends on host collation; inspectOffer lacks search's invalid-clock error guard. Baseline benchmark also reveals repeated text normalization and specialist lookup per offer. Cache normalized text per offer with own specialist/category/title only; no combination of sibling attributes. No new search persistence feature (F161) is authorized: F059 is existing same-tab conditions/navigation restoration.

Security: Zod strips nonpublic extra catalog fields and validates IDs/FKs/price/date invariants; query is a bounded literal substring, rendered as React text. Published-only candidates; no secrets/real PII/provider/send/live changes. Negative proof will include invalid inputs/catalogs and injection strings. Review source dates independently from specialist verification badges.

## B — domain correctness

Reproduced6 FAIL/36 PASS in [red run](../evidence/EXP-03-B-red.log), then corrected SearchService title candidates, ordinal ID ties and invalid inspect clock. [Full check](../evidence/EXP-03-B-check.log): strict TS,196 unit/integration (42 new), historical registry PASS; failed0/skipped0. Added independent seeded hard-language/format/price oracle over200 four-offer sibling catalogs, permutation stability/soft-vs-hard/input immutability, per-offer RU/KK reason provenance, free/unknown/from/stale and budget/age boundaries, invalid inputs/catalogs/literal injection queries. Existing scenario IDs preserved. No changes to matching weights/schema/freshness policy or storage/API. Indexed fields are separate strings, so queries cannot span unrelated attributes.

## Acceptance and verification plan

- AC-01: adversarial sibling offers, isolated inspectOffer and seeded permutation properties must never create a hybrid match.
- AC-02: same-offer hard/soft/unknown explanation codes resolve to RU/KK; stale/future/missing sources never confirm current fields; free/from/unknown and age/budget boundaries covered.
- AC-03: actual before/after 20/100/1000-offer benchmark in this same process/runtime methodology, p50/p95/max, six scenarios, constructor timing, fixed clock and environment metadata. [Measured baseline](../evidence/EXP-03-benchmark-before.json). No field/mobile performance claim.
- AC-04: E2E impossible combined hard input remains unchanged through zero-results/incomplete/manual filter cancel, locale changes and reload. Reset only after user action.

B: focused regression/property tests, strict TS and nearest suite. C: real Catalog/Filters RU/KK, exact/incomplete, navigation, errors, mobile320/360/390/430, keyboard/focus, XSS. D: full unit/integration/dev/release/pilot/offline regression, build, context consistency, benchmark and closure. Every checkpoint updates four AI_CONTEXT documents and pushes its atomic commit, followed by ls-remote SHA comparison.

## Feature acceptance matrix

| ID | Function | Required behavior | Technical status |
|---|---|---|---|
| F037 | Поиск специалистов | Искать по имени/категории и конечным RU/KK aliases. | NOT_VERIFIED |
| F038 | Поиск конкретных услуг | Выбирать конкретную услугу до группировки специалистов. | NOT_VERIFIED |
| F039 | Фильтрация по категории | Применить hard OR к категориям. | NOT_VERIFIED |
| F040 | Фильтрация по возрасту | Проверить полное включение возрастной группы, partial=unknown. | NOT_VERIFIED |
| F041 | Фильтрация по языку | Проверить актуальный язык конкретного offer. | NOT_VERIFIED |
| F042 | Фильтрация по формату | Проверить формат конкретного offer. | NOT_VERIFIED |
| F043 | Фильтрация по району | Применить район с учётом online-only semantics. | NOT_VERIFIED |
| F044 | Фильтрация по бюджету | Применить budgetHard/soft с точной семантикой цены. | NOT_VERIFIED |
| F045 | Учёт неизвестной цены | Не превращать неизвестную цену в 0 KZT. | NOT_VERIFIED |
| F046 | Учёт бесплатных услуг | Считать free только явно известной ценой 0. | NOT_VERIFIED |
| F047 | Учёт указанной доступности | Не выдавать accepting enquiries за подтверждённую запись. | NOT_VERIFIED |
| F048 | Комбинация фильтров | Совместить фильтры на одной услуге. | NOT_VERIFIED |
| F049 | Сброс фильтров | Сбросить applied условия только по действию пользователя. | NOT_VERIFIED |
| F050 | Hard constraints | Исключить hard fail, отделить hard unknown. | NOT_VERIFIED |
| F051 | Soft preferences | Менять rank soft preferences без обхода hard. | NOT_VERIFIED |
| F052 | Расчёт matching score | Считать score по общему набору факторов запроса. | NOT_VERIFIED |
| F053 | Расчёт полноты данных | Считать coverage отдельно от score. | NOT_VERIFIED |
| F054 | Объяснение соответствия | Показать same-offer reasons/unknown/mismatch с evidence. | NOT_VERIFIED |
| F055 | Разделение точных и неполных совпадений | Разделить exact и incomplete группы без двойного подсчёта. | NOT_VERIFIED |
| F056 | Проверка актуальности информации | Проверять dated field provenance; updatedAt не освежает факт. | NOT_VERIFIED |
| F057 | Стабильная сортировка | Дать детерминированный tie-break и отдельные price/district rules. | NOT_VERIFIED |
| F058 | Обработка отсутствия результатов | Показать честную нулевую выдачу с ручным изменением условий. | NOT_VERIFIED |
| F059 | Сохранение условий при переходах | Сохранить условия и возврат из профиля/сравнения. | NOT_VERIFIED |
| F060 | Защита от смешивания условий разных услуг одного специалиста | Не объединять язык одного offer с ценой/форматом другого. | NOT_VERIFIED |

## Limits / rollback

Human comprehension with parent, native KK editing, real screen-reader/physical-device review: BLOCKED_EXTERNAL/NOT_VERIFIED. Automated DEMO proof cannot replace them. All live gates remain blocked. No data/schema migration planned. Rollback: revert only this branch's EXP-03 commits in reverse order; do not reset shared history. Baseline rules-v2 weighted score/freshness-v2 and current session schema/catalog-v2 are retained.

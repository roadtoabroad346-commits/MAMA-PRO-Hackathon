# EXP-03 — F037–F060

**Technical result: VERIFIED_DONE, scope AUTOMATED_SYNTHETIC_DEMO. Human/live: BLOCKED_EXTERNAL.**

Scope: synthetic DEMO only; LIVE_BLOCKED. Branch `codex/exp-03-offer-matching`, base `0ebd5bf206f082db718945096b7abfdeee1fa31b`. Default observed at `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. No merge/deploy. EXP-04 requires a new user instruction.

## A — audit/contracts

Checkpoint A verified the existing contracts and baseline: `npm ci` exit 0; `npm run check` strict TS +154 unit/integration tests +historical registry PASS. All context files were read/indexed; generated registry hashes are inventory, not independent line-by-line security review. [Source ledger](../evidence/EXP-03-source-ledger.json). The attached 01/02/03 match the archived source package. Research is the available Markdown derivative; original DOCX is unavailable. Original feature CSV has 231 IDs; EXP-03 is exactly F037–F060.

Architecture: UI Catalog/Filters → normalizeSearchInput/schema → publicCatalog/schema/publication → text candidate selection → evaluateOffer per offer → hard fail/exact/incomplete → stable order → specialist grouping. Profile/compare use inspectOffer. There is no CORE search HTTP API or database query: public synthetic JSON + synchronous pure evaluator. Pilot publicOffers is a separate synthetic API; this task does not wire it to CORE.

Contracts retained: category OR is mandatory; age requires full group inclusion; partial age is unknown; language/format/budget/district can be hard or soft. Availability is an explicitly labelled ranking preference, never a real slot. Online-only hard format disables district. Unknown hard fields enter incomplete only when no hard field fails. Known false has coverage; missing/stale does not. Score and coverage use the same request-wide weighted denominator (30/15/15/10/15/10/5); neutral score is null. Price free=explicit zero, exact/from>0, unknown=null. At TTL (price30d/availability7d) evidence is stale; updatedAt cannot refresh it. Clock is catalog.demoClock in DEMO. Neither score nor provenance promises clinical suitability.

Confirmed gaps to fix in B/C: text candidate selection omits RU/KK offer titles; default-locale ID tie-break depends on host collation; inspectOffer lacks search's invalid-clock error guard. Baseline benchmark also reveals repeated text normalization and specialist lookup per offer. Cache normalized text per offer with own specialist/category/title only; no combination of sibling attributes. No new search persistence feature (F161) is authorized: F059 is existing same-tab conditions/navigation restoration.

Security: Zod strips nonpublic extra catalog fields and validates IDs/FKs/price/date invariants; query is a bounded literal substring, rendered as React text. Published-only candidates; no secrets/real PII/provider/send/live changes. Negative proof will include invalid inputs/catalogs and injection strings. Review source dates independently from specialist verification badges.

## B — domain correctness

Reproduced6 FAIL/36 PASS in [red run](../evidence/EXP-03-B-red.log), then corrected SearchService title candidates, ordinal ID ties and invalid inspect clock. [Full check](../evidence/EXP-03-B-check.log): strict TS,196 unit/integration (42 new), historical registry PASS; failed0/skipped0. Added independent seeded hard-language/format/price oracle over200 four-offer sibling catalogs, permutation stability/soft-vs-hard/input immutability, per-offer RU/KK reason provenance, free/unknown/from/stale and budget/age boundaries, invalid inputs/catalogs/literal injection queries. Existing scenario IDs preserved. No changes to matching weights/schema/freshness policy or storage/API. Indexed fields are separate strings, so queries cannot span unrelated attributes.

## C — catalog/UX

RU/KK visible search labels/help and zero-result recovery mention concrete service titles. Reused existing Filters/Catalog/Modal/navigation: no new UI flow or storage schema. [Focused14 E2E](../evidence/EXP-03-C-focused.log) PASS in both locales with0 page errors; combined-filter UI and boundary6000, sibling contamination, free0 vs unknown/stale, honest zero through cancel/locale/reload, profile/compare/history/reload, XSS literal/no query network send,320/360/390/430/reduced motion/text200%/keyboard/Escape/focus. Screenshots `work/exp03/catalog-{ru,kk}-mobile.png` were inspected; text reflows, modal content scrolls and footer actions remain operable. Native browser chrome may receive focus during a native dialog tab cycle; no background control may receive it. Physical zoom/AT is not claimed.

[Strict TS +196 tests](../evidence/EXP-03-C-check.log), [build](../evidence/EXP-03-C-build.log) and [context](../evidence/EXP-03-C-context.json) PASS. Initial C test-harness failure6pass/8fail is retained in work/exp03/C-initial-failed.log; diagnosis/fix recorded in decision log. No product assertions removed. [Full dev regression103/103](../evidence/EXP-03-C-dev.log) also PASS; failed0/skipped0. Dist/pilot/offline and benchmark closure follow in D.

## Acceptance and verification plan

- AC-01: adversarial sibling offers, isolated inspectOffer and seeded permutation properties must never create a hybrid match.
- AC-02: same-offer hard/soft/unknown explanation codes resolve to RU/KK; stale/future/missing sources never confirm current fields; free/from/unknown and age/budget boundaries covered.
- AC-03: actual before/after 20/100/1000-offer benchmark in this same process/runtime methodology, p50/p95/max, six scenarios, constructor timing, fixed clock and environment metadata. [Measured baseline](../evidence/EXP-03-benchmark-before.json). No field/mobile performance claim.
- AC-04: E2E impossible combined hard input remains unchanged through zero-results/incomplete/manual filter cancel, locale changes and reload. Reset only after user action.

B: focused regression/property tests, strict TS and nearest suite. C: real Catalog/Filters RU/KK, exact/incomplete, navigation, errors, mobile320/360/390/430, keyboard/focus, XSS. D: full unit/integration/dev/release/pilot/offline regression, build, context consistency, benchmark and closure. Every checkpoint updates four AI_CONTEXT documents and pushes its atomic commit, followed by ls-remote SHA comparison.

## Feature acceptance matrix

| ID | Function | Required behavior | Technical status |
|---|---|---|---|
| F037 | Поиск специалистов | Искать по имени/категории и конечным RU/KK aliases. | VERIFIED_DONE (DEMO) |
| F038 | Поиск конкретных услуг | Выбирать конкретную услугу до группировки специалистов. | VERIFIED_DONE (DEMO) |
| F039 | Фильтрация по категории | Применить hard OR к категориям. | VERIFIED_DONE (DEMO) |
| F040 | Фильтрация по возрасту | Проверить полное включение возрастной группы, partial=unknown. | VERIFIED_DONE (DEMO) |
| F041 | Фильтрация по языку | Проверить актуальный язык конкретного offer. | VERIFIED_DONE (DEMO) |
| F042 | Фильтрация по формату | Проверить формат конкретного offer. | VERIFIED_DONE (DEMO) |
| F043 | Фильтрация по району | Применить район с учётом online-only semantics. | VERIFIED_DONE (DEMO) |
| F044 | Фильтрация по бюджету | Применить budgetHard/soft с точной семантикой цены. | VERIFIED_DONE (DEMO) |
| F045 | Учёт неизвестной цены | Не превращать неизвестную цену в 0 KZT. | VERIFIED_DONE (DEMO) |
| F046 | Учёт бесплатных услуг | Считать free только явно известной ценой 0. | VERIFIED_DONE (DEMO) |
| F047 | Учёт указанной доступности | Не выдавать accepting enquiries за подтверждённую запись. | VERIFIED_DONE (DEMO) |
| F048 | Комбинация фильтров | Совместить фильтры на одной услуге. | VERIFIED_DONE (DEMO) |
| F049 | Сброс фильтров | Сбросить applied условия только по действию пользователя. | VERIFIED_DONE (DEMO) |
| F050 | Hard constraints | Исключить hard fail, отделить hard unknown. | VERIFIED_DONE (DEMO) |
| F051 | Soft preferences | Менять rank soft preferences без обхода hard. | VERIFIED_DONE (DEMO) |
| F052 | Расчёт matching score | Считать score по общему набору факторов запроса. | VERIFIED_DONE (DEMO) |
| F053 | Расчёт полноты данных | Считать coverage отдельно от score. | VERIFIED_DONE (DEMO) |
| F054 | Объяснение соответствия | Показать same-offer reasons/unknown/mismatch с evidence. | VERIFIED_DONE (DEMO) |
| F055 | Разделение точных и неполных совпадений | Разделить exact и incomplete группы без двойного подсчёта. | VERIFIED_DONE (DEMO) |
| F056 | Проверка актуальности информации | Проверять dated field provenance; updatedAt не освежает факт. | VERIFIED_DONE (DEMO) |
| F057 | Стабильная сортировка | Дать детерминированный tie-break и отдельные price/district rules. | VERIFIED_DONE (DEMO) |
| F058 | Обработка отсутствия результатов | Показать честную нулевую выдачу с ручным изменением условий. | VERIFIED_DONE (DEMO) |
| F059 | Сохранение условий при переходах | Сохранить условия и возврат из профиля/сравнения. | VERIFIED_DONE (DEMO) |
| F060 | Защита от смешивания условий разных услуг одного специалиста | Не объединять язык одного offer с ценой/форматом другого. | VERIFIED_DONE (DEMO) |

## Limits / rollback

Human comprehension with parent, native KK editing, real screen-reader/physical-device review: BLOCKED_EXTERNAL/NOT_VERIFIED. Automated DEMO proof cannot replace them. All live gates remain blocked. No data/schema migration planned. Rollback: revert only this branch's EXP-03 commits in reverse order; do not reset shared history. Baseline rules-v2 weighted score/freshness-v2 and current session schema/catalog-v2 are retained.

## D — performance/regression/closure

Source tested: `ac82ec7209de0ec5e0154947193cafcb7be856ba`; runtime/tests/config/harness hashes match that Git tree. D changes only documentary evidence and the context validator. Strict TS,196 unit/integration,103 full dev,54 dist acceptance,5 real synthetic pilot and2 offline/map tests all PASS (360 final executed instances,0 failed/0 skipped); focused14 rerun is recorded separately and not added twice. Build PASS; main377.72kB/gzip110.81kB. npm audit0 advisories. [Machine evidence and commands](../evidence/EXP-03.json); [dist](../evidence/EXP-03-D-dist.log), [pilot](../evidence/EXP-03-D-pilot.log), [offline](../evidence/EXP-03-D-offline.log). Historical context integrity checks330 unchanged originals plus5 explicitly reviewed changes; original sources/registries stay traceable. [Final context check](../evidence/EXP-03-D-context.json) PASS. Remote GitHub CI NOT_RUN because the existing workflow push allowlist excludes this branch; no CI PASS is invented.

[Measured before/after benchmark](../evidence/EXP-03-benchmark.md):20/100/1000 offers,6 scenarios each,20 warmups/100 samples each, p50/p95/max and constructor/environment in raw JSON. Before/after input/checksum parity18/18. Text1000 p95:41.122→0.458ms; maximum after p95:40.291ms. Some other timings regress; shared-cloud noise and GC/JIT limits are disclosed. No real mobile/field latency claim.

All four technical phase criteria proved: AC-01 sibling facts/title cannot mix (unit, independent200-catalog property oracle, RU/KK browser); AC-02 same-offer RU/KK reasons and independent field/verification freshness (date boundaries/future/stale/missing/updatedAt); AC-03 real20/100/1000 runs; AC-04 zero exact results never mutate hard input without an explicit user action (cancel, incomplete, locale, reload and manual reset).

Technical completion does not assert parent understanding, native KK editorial acceptance or real assistive-technology/device approval. These remain BLOCKED_EXTERNAL/NOT_VERIFIED; original DOCX is unavailable. LIVE_BLOCKED preserved; no backend/private schema, provider, real data, migration, merge, force-push or production deploy. EXP-04's technical dependency is satisfied, but it has **not started** and needs the user's permission.

## One-to-one feature proof

| ID | Test files | Verified assertion |
|---|---|---|
| F037 | tests/search.test.ts; tests/e2e/search.spec.ts | NFKC/name/finite RU/KK aliases, literal query and current input |
| F038 | tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Own localized title and fixed selectedOfferId; sibling title/language denial |
| F039 | tests/search.test.ts; tests/e2e/exp03.spec.ts | Category hard OR, AND across fields on the same offer |
| F040 | tests/exp03.test.ts; tests/matching.test.ts | All5 age groups: inclusive endpoints, partial unknown, disjoint fail |
| F041 | tests/matching.test.ts; tests/exp03.test.ts | Hard/soft language; missing/future/source unknown |
| F042 | tests/matching.test.ts; tests/exp03.test.ts | Hard format pass/fail/unknown; independent per offer |
| F043 | tests/matching.test.ts; tests/search.test.ts; tests/e2e/exp03.spec.ts | Hard district; online-only inactive, online cannot assert offline district |
| F044 | tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Hard/soft budget;6000/6001 and100000 boundaries |
| F045 | tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Unknown price=null/incomplete for hard0; never free or pass |
| F046 | tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Explicit free0 passes hard0 if current; stale free does not |
| F047 | tests/matching.test.ts; tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Availability preference; true/false/null/stale/future, no slot or booking claim |
| F048 | tests/search.test.ts; tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Actual combined-filter UI and200 seeded four-offer hard oracle |
| F049 | tests/e2e/search.spec.ts; tests/e2e/exp03.spec.ts | Draft reset/cancel and explicit full applied reset retain locale |
| F050 | tests/exp03.test.ts; tests/matching.test.ts | Fail dominates unknown and soft score; unknown never exact |
| F051 | tests/exp03.test.ts; tests/e2e/exp02.spec.ts | Soft rank never enlarges hard eligibility; persisted soft edits |
| F052 | tests/exp03.test.ts; tests/matching.test.ts | Request-wide denominator100, exact score100, partial72.5; neutral null |
| F053 | tests/exp03.test.ts; tests/matching.test.ts | Coverage independent of score; false known; unknown loses coverage |
| F054 | tests/matching.test.ts; tests/exp03.test.ts; tests/e2e/exp03.spec.ts | Same-offer evidence and typed RU/KK match/unknown/mismatch; stale explanations |
| F055 | tests/search.test.ts; tests/exp03.test.ts; tests/e2e/search.spec.ts | Exact/incomplete separated; specialist counted once; no hard failures in incomplete |
| F056 | tests/matching.test.ts; tests/exp03.test.ts; tests/e2e/profile.spec.ts | Independent TTL/exact boundary/future/missing/source; updatedAt cannot refresh or verify |
| F057 | tests/search.test.ts; tests/exp03.test.ts; tests/e2e/search.spec.ts | Ordinal ID ties, reversed permutations, repeated search; price/district ordering |
| F058 | tests/e2e/exp03.spec.ts; tests/e2e/search.spec.ts | Exact0 and incomplete stay honest through cancel/locale/reload; manual actions only |
| F059 | tests/e2e/exp03.spec.ts; tests/e2e/search.spec.ts; tests/session.test.ts | Same-tab applied conditions/IDs/sort persist through profile/compare/history/reload |
| F060 | tests/exp03.test.ts; tests/matching.test.ts; tests/e2e/exp03.spec.ts | Adversarial siblings: attributes/title/category never combine;200 seeded catalogs |

## Changed files relative to EXP-02 base

- `AGENTS.md`
- `docs/AI_CONTEXT/DECISION_LOG.md`
- `docs/AI_CONTEXT/FEATURE_REGISTRY.csv`
- `docs/AI_CONTEXT/FEATURE_REGISTRY.json`
- `docs/AI_CONTEXT/FEATURE_STATUS.md`
- `docs/AI_CONTEXT/GENERATION_SUMMARY.json`
- `docs/AI_CONTEXT/PHASE_PROGRESS.md`
- `docs/AI_CONTEXT/PHASE_REGISTRY.json`
- `docs/AI_CONTEXT/PROJECT_MASTER_CONTEXT.md`
- `docs/AI_CONTEXT/SESSION_HANDOFF.md`
- `docs/AI_CONTEXT/VALIDATION.md`
- `docs/AI_CONTEXT/validate_context.py`
- `docs/expansion/STATE.json`
- `docs/expansion/evidence/EXP-03-A-check.log`
- `docs/expansion/evidence/EXP-03-B-check.log`
- `docs/expansion/evidence/EXP-03-B-red.log`
- `docs/expansion/evidence/EXP-03-C-build.log`
- `docs/expansion/evidence/EXP-03-C-check.log`
- `docs/expansion/evidence/EXP-03-C-context.json`
- `docs/expansion/evidence/EXP-03-C-dev.log`
- `docs/expansion/evidence/EXP-03-C-focused.log`
- `docs/expansion/evidence/EXP-03-C-initial-failed.log`
- `docs/expansion/evidence/EXP-03-D-audit.json`
- `docs/expansion/evidence/EXP-03-D-context.json`
- `docs/expansion/evidence/EXP-03-D-dist.log`
- `docs/expansion/evidence/EXP-03-D-offline.log`
- `docs/expansion/evidence/EXP-03-D-pilot.log`
- `docs/expansion/evidence/EXP-03-benchmark-after.json`
- `docs/expansion/evidence/EXP-03-benchmark-before.json`
- `docs/expansion/evidence/EXP-03-benchmark.md`
- `docs/expansion/evidence/EXP-03-source-ledger.json`
- `docs/expansion/evidence/EXP-03-verified-changes.json`
- `docs/expansion/evidence/EXP-03.json`
- `docs/expansion/stages/EXP-03.md`
- `playwright.exp03.config.ts`
- `scripts/benchmark-search.mjs`
- `src/domain/SearchService.ts`
- `src/i18n/messages.ts`
- `src/i18n/searchMessages.ts`
- `tests/e2e/exp03.spec.ts`
- `tests/e2e/intake.spec.ts`
- `tests/e2e/search.spec.ts`
- `tests/exp03.test.ts`
- `tests/support/syntheticCatalog.ts`

## Git checkpoints / resume receipt

A `cd1a7a5812ea65bd8bc49ee149bdfe105f0f1773`, B `08dd0f9e66333dfdc116b78c43e5642d9552f7d3`, C `ac82ec7209de0ec5e0154947193cafcb7be856ba` were pushed and each matched ls-remote. D is the commit containing this closure; self-SHA cannot be embedded in its own content. Resolve with `git rev-parse HEAD` and `git ls-remote origin refs/heads/codex/exp-03-offer-matching`; the final external receipt records their exact match. No merge/deploy.

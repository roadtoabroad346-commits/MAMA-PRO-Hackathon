# EXP-04 — Profile, Trust Passport & Comparison

Current: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO). Historical slice A audit follows. Synthetic DEMO only; LIVE_BLOCKED; HUMAN_QA_PENDING.

Branch `codex/exp-04-profile-trust-comparison`, dependency/base `7340dffa1b15e8452bf693f090f6c4085d46b158`. Default `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. EXP-03 PR8 is unmerged; context PR9 and sibling EXP-01 PR10 are also unmerged. No sibling merge. Clean unborn checkout recovered by fetch; no user edits/stashes.

## Slice A: gap matrix BEFORE implementation

| ID | Requirement | Existing code | Evidence | Defect/missing test | Proposed change | Priority |
|---|---|---|---|---|---|---|
| F061 | Published identity, missing bio/photo, safe not-found | OfferProfile; resolveProfile | profile tests | Re-run public projection/XSS guards | Reuse + negative tests | P1 |
| F062 | Exact native offer selector, URL/actions agree | OfferProfile | profile.spec | Duplicate query and complete switch proof | Reject ambiguous query; prove switch | P1 |
| F063 | Exact category/age/language/availability/limits | OfferFacts; OfferProfile | profile.spec | Comparison lacks availability | Shared offer availability | P1 |
| F064 | KZT/unit/duration/free/unknown/freshness | OfferFacts; priceText | profile.spec | Mixed-unit comparison not evidenced | Regression proof, reuse formatting | P1 |
| F065 | Offer district/online N/A/address honesty | OfferFacts; catalog schema | profile.spec | Schema has no postal address | Explicit unknown offline address; online N/A | P2 |
| F066 | Scoped provenance, no quality badge | TrustPassport | profile.spec | Compare lacks selected offer evidence | Reuse scoped evidence in compare | P1 |
| F067 | No status upgrades; revoked precedence | verificationStatus | profile.test | Malformed reviewDueAt/blank source can confirm | Validate review guard/source labels | P1 |
| F068 | Actual source or unknown | TrustPassport; Verification | profile.spec | Blank localized labels; private projection | Trim check + public allowlist | P1 |
| F069 | Clock/date/TTL/review guards | freshness; verificationStatus | profile.test | Malformed review and timezone boundaries | Boundary regression tests | P1 |
| F070 | Unknown facts stay unknown | OfferFacts; TrustPassport | profile.spec | Compare missing-date not explicit | Show source/date unknown in compact evidence | P1 |
| F071 | Exact provider/offer comparisons | Comparison; AppState | p0/profile E2E | Missing selected offer trust block | Scoped compact trust reuse | P1 |
| F072 | Explicit add/replace/max3/toggle | AppState; CompareButton | p0/profile E2E | Capacity and pinning need current proof | Test current one-offer/provider contract | P1 |
| F073 | Remove middle/clear/focus/order | Comparison; CompareTray | p0 E2E | Unavailable item currently omitted silently | Safe unavailable placeholder + removal | P1 |
| F074 | Equivalent labeled conditions/provenance | Comparison; OfferFacts | design historical | Missing availability/offer evidence; row alignment | Shared facts + nested subgrid + proof | P1 |
| F075 | 1280 columns/390 stack/320/keyboard | styles.css comparison-grid | design historical | 3 columns not guaranteed at1280; only blocks align | Explicit desktop columns; screenshots + keyboard | P1 |

## Contract lock / ADR-EXP04-01

Retain existing one pinned offer per specialist, at most3 specialists, insertion order, toggle removes the exact pinned pair, explicit replace retains slot. Native radio never changes comparison. Compare is tab memory only, reload clears it; applied search session has existing2h TTL. No persistence migration. Direct links are neutral without navigation context; explicit invalid/empty/duplicate offer query must not select a default. Missing query uses ordinal stable public offer ID. No postal-address field exists: SOURCE_UNAVAILABLE for address, show unknown offline and N/A online; no fabricated venue/schema migration. Preserve catalog demoClock, FRESHNESS_POLICY, rules-v2, matching and synthetic RequestAction. Invalid timestamps fail schema at ingestion; pure trust guard additionally degrades malformed review/source. Public projection strips private checking role and evidence for nonpublic offers.

## Verification plan

AC01 exact profile: profile unit + existing profile E2E + EXP04 contradictory sibling fixture, query/withdrawn/XSS/scope/reload/back. AC02 compare:0/1/2/3/4, toggle, middle remove, explicit replace, changed-filter notice, locale, reload policy. AC03 honest passport: all statuses, missing source/date, TTL equality, invalid/future/review, own offer scope, provider variation. AC04 desktop1280 three aligned cards,390 stack,320/text200%/long KK, keyboard removal/radio/request, reduced motion; retain actual screenshots.

Baseline `npm ci` PASS; `npm run check` PASS:196 unit/integration, TypeScript strict, historical registry69 records. New full regressions will run after changes. Original Research DOCX SOURCE_UNAVAILABLE; available Research Markdown and canonical CSV are used. No real parent/native KK/AT/device validation claimed.

Rollback: revert only EXP04 commits in reverse order; no data migration, no reset/clean. Stop before EXP05.

## Slice B — profile/domain/public projection

New39 unit cases: initial8 FAIL/31 PASS, then235 total PASS with strict TypeScript. Existing13 profile browser cases PASS on Chromium. Corrected malformed reviewDueAt and whitespace-only localized source status, ordinal default IDs, ambiguous duplicate offer query and public projection of private checking roles/nonpublic offer facts. Catalog ingestion now uses that same public boundary. No schema/storage/matching change. Context validator preserves historical EXP03 tree evidence and verifies explicitly reviewed successor hashes instead of falsely requiring unchanged runtime forever.

Audit checkpoint remote verified `c43fedc00fbfa4f85ef9a432c9fdb32470f22d2e`; this B SHA is resolved after commit/push (self-reference constraint). Next C; LIVE_BLOCKED; HUMAN_QA_PENDING.

## ADR-EXP04-02 — shared facts and responsive comparison

Reuse OfferFacts, EvidenceFact/OfferEvidence and canonical verificationStatus, not a parallel trust model. Show price/unit/duration, address unknown/N/A and availability/date/limits consistently; exact offer evidence is available through native details in compare. At1280 exactly2/3 equal columns with nested subgrid aligns7 semantic fields; at390/320 cards stack. Remove hover translation only in comparison. Unavailable pins show a generic safe removable placeholder without provider/offer details or actions; removals happen before publication checks, while adds/replacements still validate ownership/publication. Dynamic-update integration harness is development-only, not a product entry point. Schema, session, max3, provider replacement, matching weights and freshness policy retained.

## ADR-EXP04-03 — deterministic public dates and honest test synchronization

All profile/compare public dates use Asia/Almaty and catalog.demoClock. RU keeps Intl medium; KK uses Intl numeric parts in dd.mm.yyyy order because actual Chromium rendered month M11. KK price groups are NBSP, avoiding English comma fallback; no currency/value/unit change. Native KK editorial acceptance remains pending. Existing profile fixture interception now targets fetch-only dev/dist asset URLs. Existing EXP03 reload assertion must wait for the expected card count before reading exact IDs; no assertion is removed or eligibility relaxed. Initial red/domain and browser harness failures are retained.

EXP-04 C verified:237 unit/integration,121 full dev browser, strict TS/build/context PASS,0 final failed/skipped. Responsive3 columns1280 and stacked390/320, text200%, native keyboard, locale/date/price, exact pin/replace/withdrawal proved. Five synthetic browser screenshots retained in docs/expansion/evidence/EXP-04-screenshots. B remote verified 424c36db3caa423d304ca403d01e7a6bff372011. Next D: dist/pilot/offline and final per-feature closure. LIVE_BLOCKED; HUMAN_QA_PENDING.

EXP04 C2: test-only serviceWorkers:block isolates route-injected synthetic catalogs after reload; runtime unchanged from remote25a262fa3461fd2c5bbc8313eb2419833af64dee. Current237 check,31 focused dev and83 dist PASS; original full121 dev equivalent (DEV never registers SW). Actual SW remains enabled in separate release/offline tests;5 pilot and2 offline PASS. Initial80pass/3fail dist log retained. No assertions removed, no production SW disablement. Next final D closure; LIVE_BLOCKED/HUMAN_QA_PENDING.

## D — final acceptance

**VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO)** on source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. LIVE_BLOCKED; HUMAN_QA_PENDING.

| ID | Exact feature | Status | Code | Current test proof | Remaining |
|---|---|---|---|---|---|
| F061 | Карточка специалиста | ALREADY_VERIFIED | src/features/profile/OfferProfile.tsx, src/domain/profile.ts | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts, tests/profile.test.ts; P04-T01, P04-T03, P04-T04, P04-T05, P04-T06, P04-T10 | Human QA pending; address source unavailable where applicable |
| F062 | Несколько услуг одного специалиста | FIXED_AND_VERIFIED | src/features/profile/OfferProfile.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts; P04-T02, P04-T08, P04-T32, P04-T44 | Human QA pending; address source unavailable where applicable |
| F063 | Подробные условия услуги | FIXED_AND_VERIFIED | src/features/search/OfferCard.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T02, P04-T14, P04-T15, P04-T16 | Human QA pending; address source unavailable where applicable |
| F064 | Цена и продолжительность | FIXED_AND_VERIFIED | src/features/search/OfferCard.tsx, src/i18n/price.ts | tests/e2e/exp04.spec.ts, tests/exp04.test.ts; P04-T11, P04-T12, P04-T13, P04-T16 | Human QA pending; address source unavailable where applicable |
| F065 | Адрес и формат | FIXED_AND_VERIFIED | src/features/search/OfferCard.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts; P04-T14, P04-T36 | Human QA pending; address source unavailable where applicable |
| F066 | Паспорт доверия | FIXED_AND_VERIFIED | src/features/profile/TrustPassport.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T18, P04-T19, P04-T25, P04-T26 | Human QA pending; address source unavailable where applicable |
| F067 | Статус проверки | FIXED_AND_VERIFIED | src/domain/profile.ts | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T19, P04-T20, P04-T21, P04-T22, P04-T23, P04-T24 | Human QA pending; address source unavailable where applicable |
| F068 | Источник информации | FIXED_AND_VERIFIED | src/features/profile/TrustPassport.tsx, src/domain/SearchService.ts | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T18, P04-T24, P04-T26, P04-T43 | Human QA pending; address source unavailable where applicable |
| F069 | Дата проверки | FIXED_AND_VERIFIED | src/domain/profile.ts, src/domain/freshness.ts, src/i18n/date.ts | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T17, P04-T21, P04-T22 | Human QA pending; address source unavailable where applicable |
| F070 | Неизвестные сведения | FIXED_AND_VERIFIED | src/features/search/OfferCard.tsx, src/features/profile/TrustPassport.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T10, P04-T12, P04-T15, P04-T24 | Human QA pending; address source unavailable where applicable |
| F071 | Сравнение специалистов | FIXED_AND_VERIFIED | src/features/search/SelectionViews.tsx | tests/e2e/exp04-state.spec.ts, tests/e2e/exp04.spec.ts; P04-T28, P04-T32, P04-T33, P04-T34 | Human QA pending; address source unavailable where applicable |
| F072 | Добавление в сравнение | ALREADY_VERIFIED | src/app/AppState.tsx, src/features/search/CompareTray.tsx | tests/e2e/exp04-state.spec.ts, tests/e2e/exp04.spec.ts; P04-T28, P04-T29, P04-T30, P04-T32, P04-T33 | Human QA pending; address source unavailable where applicable |
| F073 | Удаление из сравнения | FIXED_AND_VERIFIED | src/app/AppState.tsx, src/features/search/SelectionViews.tsx | tests/e2e/exp04-state.spec.ts, tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts; P04-T31, P04-T34, P04-T38 | Human QA pending; address source unavailable where applicable |
| F074 | Сравнение условий | FIXED_AND_VERIFIED | src/features/search/SelectionViews.tsx, src/features/search/OfferCard.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts, tests/exp04.test.ts; P04-T11, P04-T13, P04-T16, P04-T18, P04-T25, P04-T36 | Human QA pending; address source unavailable where applicable |
| F075 | Side-by-side сравнение на компьютере | FIXED_AND_VERIFIED | src/styles.css, src/features/search/SelectionViews.tsx | tests/e2e/exp04.spec.ts, tests/e2e/profile.spec.ts; P04-T27, P04-T37, P04-T38, P04-T39, P04-T41 | Human QA pending; address source unavailable where applicable |

| AC | Result | Evidence |
|---|---|---|
| AC-01 exact profile | PASS | exp04.test.ts; profile.spec.ts; exp04.spec.ts; C-check/C-dev/D-dist logs |
| AC-02 2–3 exact comparisons | PASS | exp04.spec.ts; exp04-state.spec.ts; search.spec.ts; C-dev/D-dist logs |
| AC-03 honest passport | PASS | exp04.test.ts; profile.spec.ts; exp04.spec.ts; source/date/scope/limits and private projection |
| AC-04 responsive/keyboard | PASS | exp04.spec.ts RU/KK1280/390/320/text200%; retained screenshots |

Actual final executions:237 unit/integration (11 files),121 dev,83 dist,5 pilot,2 offline=448;0 failed/skipped. These are executions across overlapping suites, not448 unique tests.41 new domain cases and18 browser cases. Build PASS (main380.00kB, gzip111.42kB); npm audit0 vulnerabilities. Chromium156.0.8078.79, Playwright1.65.0, Node24.22.1, npm11.9.0 on Linux; Pixel7 emulation plus explicit CSS viewports. No physical-device claim. [Machine evidence](../evidence/EXP-04.json) lists48 P04 categories mapped to real assertions, commands, logs and hashes.

Production initial80pass/3fail: production SW cache bypassed Playwright route fixtures across reload. C2 adds test-only serviceWorkers:block to the two fixture suites; real SW remains enabled in release/offline tests. Runtime/domain tests byte-identical to C. Current237 check,31 focused dev and83 dist re-executed; prior full121 dev is equivalent because DEV never registers SW. Focused31 not added to final totals. C2 receipt 2711bee46cb37aac64f98dafa14103e2dbe545b4.

Initial diagnostic failures preserved: B8/39 red before fixes; C24pass/3fail hover/locale, C27pass/2fail invalid harness aggregate/Node-vs-Chromium ICU expectation; first full dev120pass/1fail old reload race. Corrected harness/synchronization without removing exact ID/order/publication assertions. Final gates above passed.

Security/trust: mismatched/forged/ambiguous IDs rejected; hidden/withdrawn pairs guarded; private notes/scan/ID unknown fields stripped and checker role null; nonpublic offer facts removed; future/malformed/missing/review-due evidence cannot confer current trust, REVOKED preserved; script-like strings render as text. Provider fact/sibling additions cannot fabricate selected-offer evidence. Source badges are synthetic and not issuing-authority verification or quality claims. Search constraints remain in session, not shareable URLs; direct links neutral. No outbound sends/real family data/live enablement.

No-op verified areas: matching rules/weights, freshness TTLs, catalog schema, session2h policy, native selector, RequestAction acknowledgement/DEMO-only target, CompareTray add limit and explicit replacement semantics. No second matching/provenance/persistence system. Rollback: revert owned EXP04 commits reverse order; no migration.

Screenshots (actual headless browser, CSS pixels):

- [compare-kk-1280.jpg](../evidence/EXP-04-screenshots/compare-kk-1280.jpg)
- [compare-kk-320-text200.jpg](../evidence/EXP-04-screenshots/compare-kk-320-text200.jpg)
- [compare-kk-390.jpg](../evidence/EXP-04-screenshots/compare-kk-390.jpg)
- [compare-ru-1280.jpg](../evidence/EXP-04-screenshots/compare-ru-1280.jpg)
- [compare-ru-390.jpg](../evidence/EXP-04-screenshots/compare-ru-390.jpg)

Reproduce: npm ci; npm run check; npm run build; python3 docs/AI_CONTEXT/validate_context.py. With CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium run npm run test:e2e -- --workers=2, then npx playwright test --config playwright.exp04.config.ts --workers=2, then pilot/offline configs. Artifact destination can be set via EXP04_ARTIFACT_DIR. Keep servers sequential or isolated.

Checkpoints A c43fedc00fbfa4f85ef9a432c9fdb32470f22d2e, B424c36db3caa423d304ca403d01e7a6bff372011, C25a262fa3461fd2c5bbc8313eb2419833af64dee are REMOTE_VERIFIED. Containing D SHA must be read after push; cannot embed its own hash. Final ignored receipt and user response record D HEAD=remote. No merge/deploy. Draft PR, if created, targets EXP03.

Remaining human gates: actual parent comprehension of badges, native KK review, real assistive technology/device/physical zoom, original Research DOCX. Postal addresses need a real source before any venue claim. Comparison persistence remains tab-memory by established contract. All identity/consent/operator/provider/legal/ops live gates remain blocked. EXP05 prerequisites: new explicit user request; use verified EXP04 branch and review stacked dependency integration; retain synthetic request/offline contracts and LIVE_BLOCKED. EXP05 not started.

Detailed command receipts and source equivalence: full121 dev ran on C25a262f; C2 changes only the two browser fixture SW guards/comments. Runtime/domain test files are identical; current237 check,31 focused dev,83 dist and actual5 pilot/2 offline were rerun, without counting31 twice. D build has identical app-shell hash. Context registry now separately validates EXP03 historical evidence and current EXP04 source/evidence hashes.

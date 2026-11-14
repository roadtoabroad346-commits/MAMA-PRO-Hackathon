# MAMAPRO / ҚОЛДАУ.ЖОЛ — EXP-04 PRINCIPAL ENGINEERING EXECUTION PROMPT

**Stage:** EXP-04 — Profile, Trust Passport & Comparison
**Exact feature scope:** F061–F075 (15 IDs, DEMO/H0)
**Repository:** https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon
**Dependency:** EXP-03, plus the existing historical profile and comparison implementation
**Operating mode:** synthetic data only; preserve `LIVE_BLOCKED`.

> **EXECUTION AUTHORIZATION:** You are authorized to audit, improve, test and document EXP-04; create and push verified commits to a dedicated non-default feature branch. You are **not** authorized to merge, force-push, deploy, enable real communications, process real child/family data, or claim real-world validation.

## 0. Role, quality bar and immediate mission

Act as a Principal Full-Stack / TypeScript Engineer, Domain Architect, Trust & Provenance Systems Engineer, Accessibility Specialist, RU/KK Product Engineer, Security Reviewer, QA Lead and Engineering Release Manager.

Your goal is **not** to generate code for its own sake. Deliver an evidence-backed verification and targeted improvement of the existing experience: a parent opens a provider's profile, chooses **one exact offer**, sees its conditions and provenance, and compares **2–3 specifically selected offer/provider pairs** without losing search constraints.

Follow the exact source of truth in `03_INTEGRATED_PHASE_EXECUTION_PLAN.md` / `docs/AI_CONTEXT/sources/03_INTEGRATED_PHASE_EXECUTION_PLAN.md` for EXP-04 and the registry `FEATURE_REGISTRY_000-230.csv`. Resolve disagreements using the original specification, running code, test evidence and an explicit ADR; never silently rewrite historical requirements.

**Crucial:** EXP-04 is not blank. It reuses `OfferProfile`, `TrustPassport`, `Comparison`, the 13 Nov design work, and legacy phase 8. Reuse existing implementation, tests, locale messages, and domain contracts. No parallel second truth system. No rewriting the app from scratch.

## 1. Context initialization (mandatory)

Read or locate equivalents:

- `AGENTS.md`;
- `docs/AI_CONTEXT/PROJECT_MASTER_CONTEXT.md`, `FEATURE_STATUS.md`, `PHASE_PROGRESS.md`, `ARCHITECTURE_MEMORY.md`, `DECISION_LOG.md`, `SESSION_HANDOFF.md`, `RESEARCH_TRACEABILITY.md`;
- `docs/expansion/stages/EXP-03.md`, `docs/expansion/evidence/EXP-03.json`, and current `docs/expansion/STATE.json` where present;
- `00_REFERENCE_RESEARCH.docx`, `FEATURE_REGISTRY_000-230.csv`, `01_MASTER_IMPLEMENTATION_PROMPT.md`, `02_CODEX_ENGINEERING_PLAYBOOK.md`, `03_INTEGRATED_PHASE_EXECUTION_PLAN.md` (including `docs/AI_CONTEXT/sources/` equivalents);
- `docs/PHASE_8.md`, `docs/DOMAIN_CONTRACTS.md`, `docs/PROJECT_STATE.md`, `docs/LIVE_READINESS.md`, `docs/DESIGN_DELIVERY_2026-11-13.md`, historical QA reports and release notes as relevant;
- relevant source code, routes, fixtures, tests and package scripts.

Find/inspect (paths from known history; verify current reality, do not assume they still exist):

- `src/features/profile/OfferProfile.tsx`
- `src/features/profile/TrustPassport.tsx`
- `src/features/profile/RequestAction.tsx`
- `src/features/search/SelectionViews.tsx` (`Comparison`)
- `src/features/search/OfferCard.tsx`, `CompareTray.tsx`
- `src/domain/profile.ts`, `catalog.ts`, `freshness.ts`, `SearchService.ts`, `contracts.ts`
- `src/app/AppState.tsx`, routing/session state
- `src/i18n/profileMessages.ts`, shared RU/KK dictionaries
- `tests/profile.test.ts`, `tests/e2e/profile.spec.ts` and compare/search tests.

An earlier GitHub branch `codex/exp-03-offer-matching` reported EXP-03 as `VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO)` and EXP-04 as `EXISTING_DEMO_WITH_LIMITATIONS`. **This is historical reference, not fresh verification.** Confirm current branch/remote SHA and whether EXP-03/EXP-01 work has been merged or remains on separate branches. Never mistake the old `phase-0-audit` default for the latest integrated source. If source files are absent, write `SOURCE_UNAVAILABLE`; do not fabricate their content.

Before implementation, produce a brief F061–F075 gap matrix: `feature_id → requirement → existing code → evidence → defect/missing test → proposed change → priority`.

## 2. Git preparation and multi-agent safety

Verify and record:

```bash
git status --short
git branch --show-current
git remote -v
git fetch origin
git rev-parse HEAD
git log -5 --oneline
git branch -a
```

Check the actual integration base, open PRs if accessible, local uncommitted files, unpushed commits and changes authored by other agents. Do not alter another agent's worktree or staged files. Work on an isolated feature branch such as `codex/exp-04-profile-trust-comparison` based on the confirmed intended dependency branch. Preserve existing decisions about comparison persistence and URL behavior unless an explicit contract/acceptance gap requires changing them.

Forbidden: `git reset --hard`, destructive `git clean`, indiscriminate `git add .`, force pushes, implicit merges into default, production deployments, arbitrary data migrations, skipping quality gates to claim success. If remote Git credentials are absent, continue safe local work and mark `PUSH_BLOCKED` with evidence.

## 3. Exact feature coverage: implement or verify every ID

| ID | Exact name from research registry | Required verification / outcome |
|---|---|---|
| F061 | Карточка специалиста | Published synthetic provider profile with locale-aware identity, clear demo status, non-fabricated biography; correct not-found handling. |
| F062 | Несколько услуг одного специалиста | A native accessible selector for multiple offers; switching changes only the selected offer's data; URL, UI and actions agree. |
| F063 | Подробные условия услуги | Show the selected offer's category, age, language, format, location, inquiry/availability state and limitations; unknown values remain unknown. |
| F064 | Цена и продолжительность | Correct KZT amounts, unit (`session/hour/course` or existing equivalents), duration and unknown/free semantics; date/freshness where applicable. |
| F065 | Адрес и формат | Accurate offer-specific address/district and online/offline context; `N/A` not interpreted as missing failure for online. |
| F066 | Паспорт доверия | Structured, understandable provenance/verification per scope, not a generic quality badge. |
| F067 | Статус проверки | Correct distinction between `SELF_DECLARED`, `DOCUMENT_SEEN`, `SOURCE_CONFIRMED`, `UNVERIFIED`, `STALE`, `REVOKED` and any existing schema statuses; no improper upgrades. |
| F068 | Источник информации | Actual localized source label or explicit unknown; no imaginary verifying authority. |
| F069 | Дата проверки | Real timestamp/clock policy, future/invalid/stale/review-due guards and locale formatting. |
| F070 | Неизвестные сведения | Clear unknown/missing fact state; do not infer certification, price or language. |
| F071 | Сравнение специалистов | Parent compares explicitly selected individual offers under their providers; no cross-offer mixing. |
| F072 | Добавление в сравнение | Add an explicit offer/provider pair, enforce existing 2–3 selection capacity and duplicate behavior. |
| F073 | Удаление из сравнения | Remove intended pair safely; no state corruption or unintended replacement. |
| F074 | Сравнение условий | Compare equivalent labeled fields, units, provenance, freshness and unknowns; deterministic ordering. |
| F075 | Side-by-side сравнение на компьютере | Readable alignment at 1280 px; accessible reflow/stack at 390 px, full keyboard interaction. |

**Every ID must end in a row with status and evidence.** `ALREADY_VERIFIED` is acceptable only with current tests or reproducible code evidence; it is better than redundant rewrites. A historical `DEMO` registry label is not proof that the current code passes the EXP-04 acceptance criteria.

## 4. Domain invariant set (non-negotiable)

**P04-INV-01 Exact offer identity.** Every profile action and displayed service-specific fact references the **same** `offerId` and owning `specialistId`. Provider bio may be shared only when its declared scope supports sharing. The comparison entry is an immutable intentional pair, not merely a specialist ID.

**P04-INV-02 Explicit invalid IDs never silently redirect.** Missing `offer` query parameter may select the documented stable default with a clear hint. Explicit unknown/withdrawn/other-provider offer IDs must display safe not-found, not quietly substitute another one.

**P04-INV-03 One switch, one source of truth.** Switching offers updates title, category, format, address, language, age, price, duration, freshness, explanations, unknowns, Trust Passport offer facts, request target and URL together. Never leave a previous offer's claims or action target visible.

**P04-INV-04 No cross-offer provenance.** An `offer_data` verification fact for offer `O06` cannot validate `O15`, even with the same specialist. Scopes `identity/education/contact/qualification/offer_data` must remain explicit and faithfully mapped.

**P04-INV-05 Verification is not service quality.** `DOCUMENT_SEEN` proves only the stated viewing event; it is not diploma authenticity, licensing, clinical efficacy or recommended suitability. `SELF_DECLARED` is a self-report, not independent confirmation; `REVOKED` stays revoked; stale/future/invalid/expired evidence cannot support a current confirmed badge.

**P04-INV-06 Honest unknowns.** No price ≠ 0 KZT. No source ≠ verified. No verification date ≠ current. No photo/bio ≠ a synthetic made-up one. Online district may be N/A, not unknown/fail. Unknown values are visible and understandable in both RU and KK.

**P04-INV-07 Date integrity.** Use a single injected/documented demo clock and existing `FRESHNESS_POLICY`; avoid comparing source dates to a different `Date.now()` during deterministic synthetic demos. Parse ISO dates explicitly; future/malformed dates degrade to unknown/unverified. Preserve historical evidence with current status distinguished.

**P04-INV-08 Comparison selection integrity.** Clicking add/remove/toggle targets the selected offer. Never silently swap a pinned offer after changing profile radio. Changing the same specialist's selected offer in a pinned comparison must require an explicit replacement action if that is the current contract. Preserve 2–3 selection capacity and stable ordering. Investigate whether multiple offers from the same specialist are supported; honor the actual contract rather than inventing unsupported behavior.

**P04-INV-09 Search context integrity.** Return/back to results retains the user's applied filters, language and expected focus/scroll where already supported. Direct deep links must not expose personalized reasons derived from unrelated or stale session context. Do not put sensitive child conditions in shareable URLs.

**P04-INV-10 Public-only projection.** Hidden/unpublished/withdrawn specialists or offers must not be exposed through profile, comparison, Trust Passport, request CTA or client query parameters. No scans, document identifiers, private inspector notes, real child data or live provider contact.

**P04-INV-11 No fake persistence.** Inspect the existing selection/session persistence policy. Historical comparison is tab-memory only; absence after full reload is not automatically a defect unless the agreed source-of-truth mandates persistence. If persistence is requested by actual specification, implement privacy-safe, versioned, tested persistence and document TTL/clear/error semantics. Never claim cross-device sync.

**P04-INV-12 Accessibility and localization.** RU/KK parity, semantic headings/definition lists/controls, native radio/checkbox where possible, dynamic change announcements, visible focus, keyboard reordering/removal where relevant, 200% text reflow, reduced motion, long Kazakh labels, 390/1280 and at least one 320-width smoke test.

## 5. Contract-first design (adapt to actual repo interfaces)

Do not blindly replace existing `Catalog`, `Offer`, `Specialist` or `VerificationFact` types. First map existing types, code and validation. The following are **conceptual** reference contracts, not compulsory signatures:

```ts
type PublicFactStatus =
  | 'SELF_DECLARED'
  | 'DOCUMENT_SEEN'
  | 'SOURCE_CONFIRMED'
  | 'UNVERIFIED'
  | 'STALE'
  | 'REVOKED';

type FactScope =
  | 'identity' | 'education' | 'qualification'
  | 'contact' | 'offer_data';

type Known<T> =
  | { kind: 'known'; value: T; sourceId?: string; checkedAt?: string }
  | { kind: 'unknown'; reasonKey: string };

interface PublicVerificationFact {
  scope: FactScope;
  offerId?: string;               // mandatory iff scope is offer_data, per active domain contract
  status: PublicFactStatus;
  sourceLabel?: Record<'ru'|'kk', string>;
  checkedAt?: string;
  reviewDueAt?: string;
  evidenceSummary: Record<'ru'|'kk', string>;
  limitations: Record<'ru'|'kk', string>;
}

interface OfferSelection {
  specialistId: string;
  offerId: string;
}

type PublicProfileResolution =
  | { kind: 'found'; specialistId: string; offerId: string }
  | { kind: 'specialist-not-found' }
  | { kind: 'offer-not-found' };

type ComparisonAction =
  | { type: 'add'; selection: OfferSelection }
  | { type: 'remove'; selection: OfferSelection }
  | { type: 'replace'; from: OfferSelection; to: OfferSelection }
  | { type: 'clear' };
```

Contracts to audit and document:

- `resolveProfile(catalog, specialistId, offerId)`: publication guard and ID ownership; distinguish absent ID from explicitly invalid ID.
- `verificationStatus(fact, demoClock)`: status precedence and current validity; no certification inflation.
- `TrustPassport({specialist, offer})`: scope-binding and field-specific evidence from `offer.fieldSources`.
- `SearchService.inspectOffer(input, offerId)`: only canonical match/explanation authority; no duplicate matching logic in profile or compare UI.
- `comparison` and `comparisonInput` from application state: exact offer/provider pair, max selection, sorting, replacement and changed-filter notice.
- `RequestAction`: exact selected offer, publication/eligibility warning, DEMO-only; no external sends.
- URL + Router state: profile selection, back navigation, direct-link neutrality, safe percent-encoding of IDs.
- Formatting: KZT, price units, unknown/free, duration/timezones and `Intl.DateTimeFormat` consistent with site locale.

If you change persisted or public schema, introduce compatibility/migration tests and document rollback. Avoid unnecessary schema changes.

## 6. Data provenance and threat model

For each public trust fact, show these five fields wherever present and applicable:

1. **Status** — what exactly was or was not checked;
2. **Source** — where this information comes from (or unknown);
3. **Checked at** — date of the particular fact, not an unrelated record update;
4. **Scope** — precisely which specialist or which offer/field it concerns;
5. **Limitations** — what the status does **not** establish.

`reviewDueAt` and expiry are extra guards. Use current shared freshness rules (`price/contact` and `availability` TTLs, verification review period) exactly as implemented or document any justified change as ADR with regression tests. A synthetic source label is never evidence of an actual external check. Do not use a single global green shield for all scopes unless every required applicable fact independently supports it (prefer precise per-scope language).

Threat cases: mismatched offerId/specialistId; forged URL query; withdrawn offer; document source without proof; fake future date; XSS in bios/source labels; stale remembered search; leaked private notes; trust badge copy implying official certification; misleading price units; stale compare item after catalog update. Exercise and report each applicable case.

## 7. UX and user journey specification

**A. Profile entry:** From catalog or comparison, deep-link to published specialist + exact offer. If no `offer` query, select documented default and show hint. Explicit invalid IDs go to not-found with path back to catalog. Header remains non-medical/non-promissory; synthetic demo label visible.

**B. Multiple offers:** Native radiogroup/field labeling; selecting `Oxx` atomically changes URL + detail panel + passports + request CTA + compare action. If another selected offer is pinned in comparison, do not silently overwrite it; expose intentional replacement.

**C. Facts and terms:** Clear service category/ages/language/format/district/address/availability/price/duration; for unknown price do not display 'бесплатно'; for online format district can be 'не требуется'; if price unit differs, show unit clearly. Avoid fake 'приём открыт' when availability cannot be confirmed.

**D. Trust Passport:** Structured display of identity, education, contact, qualification (if data exists) and exact selected-offer evidence. Status + source + date + scope + limitations remain visible together. Do not display inspector's private notes or raw documents. Neutral language explaining that verification of one fact does not prove quality of care.

**E. Compare:** Explicit Add/Remove/Replace, 0/1/2/3 states, capacity notice, duplicate handling, stable order, clear action. Desktop 1280 side-by-side aligned fields; mobile 390 stacked or horizontally scrollable with accessible navigation, no clipped content. Compare same semantic attributes side by side and distinguish missing from incompatible values. Detail → Compare → Back retains expected state, filters and focus.

**F. Honest actions:** `RequestAction` must link to the correct exact offer; DEMO action never implies a real appointment. For incompatible or unknown criteria, preserve existing acknowledgement/notice policy. `SAVE`/comparison success must not masquerade as a real external transaction.

**G. Locale/accessibility:** RU/KK label parity, long name/description wrapping, keyboard radio navigation, visible focus, live regions without focus theft, 200% font zoom, prefers-reduced-motion, proper date/currency formats. Verify interactions with keyboard-only and screenshots at viewport 390 and 1280; add 320 as extra stress test.

## 8. Test suite: required cases (name and implement cases grounded in repo)

Keep existing tests, add focused regression tests, and test public behavior rather than private implementation details. All synthetic fixtures must be deterministic.

### Profile / selected offer

- **P04-T01:** published specialist and valid `offerId` show the exact selected offer.
- **P04-T02:** specialist has O1 and O2 with contradictory prices/languages/formats; toggling changes *every* offer-specific field, badge, Trust Passport `offer_data`, explanation, URL and CTA.
- **P04-T03:** absent offer query chooses stable documented default + hint.
- **P04-T04:** explicit unknown offer ID returns not-found, no fallback.
- **P04-T05:** valid offer ID belonging to a different specialist returns not-found.
- **P04-T06:** hidden/withdrawn specialist is excluded from public profile.
- **P04-T07:** hidden/withdrawn offer is excluded from all public actions.
- **P04-T08:** reload preserves explicit offer query; deep link without catalog context shows neutral explanations, not stale personalized information.
- **P04-T09:** back to results preserves applied filters; scroll/focus where supported.
- **P04-T10:** no bio/photo shows honest empty state, no fictional achievements or image.

### Price, time, location and unknowns

- **P04-T11:** known price displays correct KZT amount and unit.
- **P04-T12:** free price (`0`) distinct from unknown price.
- **P04-T13:** different price units and service durations remain visible and are not silently compared as equivalent.
- **P04-T14:** online format does not claim a physical district; offline address belongs to selected offer.
- **P04-T15:** missing language/age/availability/source remains unknown and does not inherit sibling-offer facts.
- **P04-T16:** stale price/availability displays proper current limitations.
- **P04-T17:** dates format correctly in RU/KK for `Asia/Almaty`/documented demo clock without day-offset errors.

### Trust Passport

- **P04-T18:** each fact shows status, source, checked-at, scope and limitations.
- **P04-T19:** `DOCUMENT_SEEN` explicitly does **not** assert issuing-authority authenticity.
- **P04-T20:** `SELF_DECLARED` never becomes `SOURCE_CONFIRMED` due to a label or shared record.
- **P04-T21:** missing/invalid/future checkedAt cannot upgrade trust.
- **P04-T22:** stale threshold equality and reviewDueAt expiry handled correctly; evidence retains historical status without fake current validity.
- **P04-T23:** `REVOKED` remains revoked even with a past valid source.
- **P04-T24:** no source label results in `UNVERIFIED` where documented.
- **P04-T25:** offer_data for O1 never appears as verification for O2.
- **P04-T26:** private verification IDs, scans, inspector notes and personal information not exposed publicly.
- **P04-T27:** localized evidence/limitations render even for long KK text.

### Comparison

- **P04-T28:** add one, two and three distinct supported offers; count and order accurate.
- **P04-T29:** fourth item triggers documented limit without mutating existing three.
- **P04-T30:** duplicate add is idempotent or explicitly handled as defined.
- **P04-T31:** remove middle item; remaining selection and order correct.
- **P04-T32:** changing profile radio does not silently replace already selected comparison item.
- **P04-T33:** explicit replacement changes only intended pair and updates all displayed facts.
- **P04-T34:** unavailable/withdrawn comparison item is removed or shown with safe unavailability according to contract, never silently replaced with another offer.
- **P04-T35:** changing filters while compare is open results in documented changed-criteria notice; no loss of applied search state.
- **P04-T36:** compare fields are semantically aligned and show N/A versus UNKNOWN distinctly.
- **P04-T37:** 390 px mobile stack/reflow readable without clipped controls; 1280 px side-by-side readable, screenshots retained.
- **P04-T38:** keyboard Tab/Space/Enter/radio-arrow interactions; removal focus restored predictably; screen reader labels accessible.
- **P04-T39:** RU↔KK switch preserves exact offer selections and UI meaning.
- **P04-T40:** reload/navigation follows the *actual* documented comparison persistence contract; don't invent mandatory persistence.
- **P04-T41:** 320 px, 200% text and long KK strings do not hide critical status/price or create destructive overflow.

### Security, state and metamorphic tests

- **P04-T42:** malformed encoded ID or unsupported query value does not crash app or render data from a different offer.
- **P04-T43:** source labels and biography containing script-like text are rendered as text, not executed.
- **P04-T44:** switching to another offer cannot leave previous offer's request target or trust evidence.
- **P04-T45:** changing catalog item iteration order does not change which explicit offer ID resolves.
- **P04-T46:** adding a sibling offer cannot change the provenance of the selected offer.
- **P04-T47:** varying a provider-level fact cannot fabricate an offer-level verified fact.
- **P04-T48:** denied/expired/private data never becomes visible via direct URL or compare state.

Run unit/integration and E2E tests against built-in synthetic fixtures. Add domain-level invariant/property tests when useful; do not make tests rely on external live services.

## 9. Mandatory acceptance contract from Integrated Phase Plan

**EXP-04-AC-01 — Exact profile:** Profile reflects precisely the selected offer, and links/back navigation work.

**EXP-04-AC-02 — 2–3 comparisons:** Parent can add/remove two or three selected alternatives without losing filters.

**EXP-04-AC-03 — Honest Trust Passport:** Status displays source + date + limitations; an unknown fact remains unknown. No fake verification.

**EXP-04-AC-04 — Responsive/accessibility:** Comparison is readable at 390 and 1280 px, and keyboard accessible.

For each AC report `PASS / FAIL / NOT_VERIFIED`, exact tests and screenshot/evidence file paths, and remaining caveats. A test from an old branch cannot be used as proof of current HEAD without re-running or another defensible validation of equivalence.

Required negative and boundary checks from original plan: `missing price/source`, `withdrawn service`, `stale fact`, `unavailable comparison item`, and `long KK text`.

## 10. Implementation phases / slices

**Slice A — Audit & contract lock:** Recover source of truth, code snapshot, traceability matrix for F061–F075, identify gaps and risky trust copy, document acceptance/test plan; minimize changes.

**Slice B — Profile/domain/trust correctness:** Repair verified defects in profile resolution, selected-offer synchronization, price/duration/location semantics, freshness/status precedence, evidence scope, public-only projection, deep links and CTA. Add unit/integration/negative tests.

**Slice C — Comparison & UX:** Repair verified defects in add/remove/replace/max-3, comparison of equivalent conditions, filters and route preservation, mobile/desktop layouts, RU/KK, keyboard/a11y. Add E2E and screenshots at 390/1280 (also 320 and long KK where feasible).

**Slice D — Regressions, evidence & closure:** Run available full quality gates, capture real outputs, record matrix and AC decisions, update docs/STATE/handoff, review diff/security, publish verified final checkpoint. No transition to EXP-05 automatically.

If a slice has zero gaps, prove reuse via tests and document `NO_RUNTIME_CHANGE_REQUIRED`; never create arbitrary churn.

## 11. CI, quality gates and evidence

Discover actual commands from `package.json` and related scripts; commonly relevant commands include:

```bash
npm ci
npm run check
npm run typecheck
npm test
npm run build
# Discover/execute the appropriate Playwright profile, comparison and production suites:
CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2
python3 docs/AI_CONTEXT/validate_context.py
```

Do **not** assume every example command exists; execute the real repository equivalents. If the environment lacks Chromium or dependencies, record `NOT_RUN` and reason, instead of PASS. Check dependencies between test servers/ports, keep parallel suites isolated and avoid interfering with other agents.

Preserve all existing search regression checks (especially EXP-03 offer isolation and freshness), pilot safety tests and production build. On substantive UI changes, inspect screenshots for 390/1280, focus, wrapping, truncation and overflow. On public contract changes, verify schema/public projection and compatibility. Report counts as actual outputs, not historical promises.

Record evidence in `docs/expansion/evidence/EXP-04.json` or existing project convention: command, environment, target SHA, PASS/FAIL/SKIPPED/NOT_RUN, testcase/AC linkage, artifact paths, human gates. No screenshots representing a physical-device test unless one was really performed.

## 12. Security and honesty / LIVE_BLOCKED

All data synthetic. Do not add live identity, provider confirmation, real appointment booking, real SMS/email/Telegram, hidden medical profiling or new data collection. Public Trust Passport must not imply that a synthetic document was verified by an actual institution. No guarantee of outcome, effectiveness, safety, qualification or clinical appropriateness. Demo request/save remains clearly non-live. Never replace real parent interviews, human comprehension review or native-language audit with invented results.

Explicit human acceptance remaining: comprehension of verification badges by an actual parent, native Kazakh language review, and manual assistive-technology/real-device check where not performed. Record `HUMAN_QA_PENDING`, do not mislabel `VERIFIED_DONE_ALL_GATES`.

## 13. GitHub atomic checkpoints (commit + push + verify)

After each completed **meaningful, verified slice**, inspect precise diff/status and stage only owned files. Update traceability and handoff as part of the slice. Suggested four checkpoints:

1. **A — Audit:** `docs(exp-04): establish profile trust comparison contracts and gap matrix`.
   - Evidence: baseline SHA, F061–F075 matrix, audit findings, AC mapping, decisions.
2. **B — Domain & Trust:** `fix(exp-04): harden offer profile and trust provenance`.
   - Evidence: targeted code changes (if necessary), unit/negative tests, scope/freshness checks.
3. **C — Compare & UX:** `feat(exp-04): verify comparison and accessible responsive UX`.
   - Evidence: comparison changes if needed, E2E, RU/KK, 390/1280 screenshots.
4. **D — Closure:** `docs(exp-04): record acceptance evidence and verified handoff`.
   - Evidence: full executed test matrix, AC-01..04, actual SHA links, blockers, rollback/handoff.

For each meaningful checkpoint:

```bash
git status --short
git diff --check
git diff --stat
# inspect staged files explicitly; stage selected paths only
git diff --cached --stat
git commit -m "<meaningful EXP-04 checkpoint message>"
git push -u origin <authorized-feature-branch>
git rev-parse HEAD
git ls-remote origin refs/heads/<authorized-feature-branch>
```

Only report `REMOTE_VERIFIED` if the remote SHA equals the expected local SHA. Do not guess commit IDs. Record hashes in `docs/expansion/STATE.json`, `docs/AI_CONTEXT/SESSION_HANDOFF.md`, `docs/expansion/stages/EXP-04.md`, and any existing `PROGRESS`/`FEATURE_MATRIX` convention. If current commit SHA cannot be embedded in its own immutable contents, record it in a subsequent handoff/receipt and explain the self-reference limitation. Do not make empty commits merely to reach four. On push failure retain local commits and set `PUSH_BLOCKED`; never erase history.

Multi-agent notes: no merging sibling EXP-01/02/03 feature branches unilaterally; document dependency conflicts. Open a draft PR only if requested or the established workflow explicitly permits it; do not merge it.

## 14. Definition of done and reporting

Completion requires:

- Every F061–F075 audited and evidenced individually, including no-change verified cases;
- Exact profile/selected-offer behavior and no cross-offer provenance;
- Source/date/limitations/status and unknown honesty;
- Add/remove/replace/limit compare behavior, with retained search conditions;
- 390/1280 responsive + keyboard acceptance, RU/KK checks;
- Executed applicable unit/integration/E2E/build regression suites, exact actual results;
- Four original EXP-04 AC adjudicated with evidence;
- Technical docs, feature matrix, decisions, handoff, LIVE_BLOCKED and Git checkpoints updated;
- Confirmed remote state or openly reported push blocker;
- Honest separation of technical DEMO acceptance and pending human/live gates.

**Final response format:**

1. `EXP-04 STATUS`: `VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO)` / `PARTIAL` / `BLOCKED`, justified.
2. Baseline and result: branch, base SHA, local HEAD SHA, remote SHA, PR URL (if any).
3. Full **F061–F075 table**: ID, status, code file(s), test evidence, remaining issue.
4. **AC-01..AC-04 table**: pass/fail/not verified, commands, tests/screenshots.
5. Exact modified files and architectural decisions, plus any no-op verified areas.
6. QA outputs: real counts, failures, skips, test environment, screenshots, limitations.
7. Git checkpoint list (commit messages, URLs, remote-verified SHAs).
8. Privacy/trust audit results and `LIVE_BLOCKED` confirmation.
9. Human QA and outstanding product decisions.
10. Exact reproduction commands and next recommended EXP-05 prerequisites.

**EXECUTE NOW.** Recover context, audit the actual repository, implement verified gaps, run tests, make meaningful commits, push to an authorized branch and verify remote SHAs. Do not stop at a planning report if executable technical work is possible. Do not launch EXP-05 until the user explicitly asks.

# EXP-04 — Profile, Trust Passport & Comparison

Status: IN_PROGRESS (audit). Synthetic DEMO only; LIVE_BLOCKED; HUMAN_QA_PENDING.

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

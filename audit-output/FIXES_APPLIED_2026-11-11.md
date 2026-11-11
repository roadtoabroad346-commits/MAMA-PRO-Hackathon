# FIXES APPLIED — 2026-11-11 (follow-up to the completion audit)

User authorization: "Полностью исправь все существующие ошибки, баги, дыры …
пуш коммит и гитхаб сохранение в конце". Fixes were developed in the isolated
worktree, verified by the full test battery, then committed and pushed.

## Where the fixes are

- GitHub branch: **`completion-fixes-2026-11-11`** (commit `4fd7ecd`,
  based on audited `97541389` / `completion-audit-2026-11-11`).
- Push URL: https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon
- The local snapshot folder was synced afterwards: all 22 changed/new files
  copied from the fixed branch, byte-identical (0 hash mismatches).
- No PR was merged, no history rewritten; PR #1 and PR #2 remain untouched.
- LIVE_BLOCKED gates and PILOT_TEST-only behavior unchanged.

## Fixed

| Finding | Change | Evidence |
|---|---|---|
| F-01 (P2) | Malformed demo-request intent in sessionStorage is cleared on read and a fresh attempt is possible; genuine storage denial still reports `requestIntentError` honestly | `tests/intent-recovery.test.ts` 5/5 pass |
| F-02 (P2) | District sort keys precomputed per offer (O(n) instead of O(n log n) full evaluations); Catalog result memoized per input | equivalence test vs pre-fix comparator; 1000-offer bench: p50 25.4 / p95 39.0 / max 44.0 ms (was p95 107.4 ms) |
| F-04 (P3) | `playwright.pilot.config.ts` / `playwright.offline.config.ts` portable (env Chromium path, env objects); OS-specific `.win` audit variants removed | pilot 5/5 + offline 2/2 via canonical configs on Windows |
| F-05 (P3) | 30/min per-address rate limit on `POST /api/pilot/test-login` → 429 | unit test + live probe (35 logins → {200,429}) |
| F-06 (P3) | ResultMap (11 strings) + footer pilot link moved into the i18n catalog | RU/KK parity enforced by types; E2E pass |
| F-07 (P3) | Shared price phrasing `src/i18n/price.ts` (OfferCard, request snapshot, SavedDemo) | suites pass; SavedDemo now uses standard keys + Intl formatting |
| F-08 (P3) | Vite vendor chunks (react-dom/router, zod) | build: main 372.60 kB (was 515.49 kB), gzip 109.57 kB; release E2E on dist pass |
| F-09 (P3, partial) | `Secure` added to pilot session cookie; CSP/HSTS documented as belonging to a TLS-serving layer that does not exist in PILOT_TEST (LIVE gate blocks exposure) | pilot E2E 5/5 on 127.0.0.1; probe shows `HttpOnly; SameSite=Strict; Secure` |
| F-10 (P3) | Blocking `npm audit --audit-level=high` CI step; fix branch added to push triggers | local audit: 0 vulnerabilities |
| TD-5 | Pilot/offline spec artifacts and dev screenshots now write to gitignored `work/` instead of committed `docs/` evidence | after full E2E run `git status docs/` clean |

## Verification battery after fixes

- `npm run typecheck` — pass
- `npx vitest run` — **154/154** (147 prior + 5 F-01 + 1 F-05 + 1 F-02 equivalence)
- `npm run build` — pass
- E2E: dev **79/79**, release **18/18**, pilot **5/5**, offline **2/2** (104 total, 0 skipped)
- `npm run check` (CI equivalent) — pass
- `npm audit` / `--audit-level=high` — 0 vulnerabilities
- LIVE gate re-verified: `PILOT_LIVE` → exit 1 `LIVE_BLOCKED`; `PILOT_TEST`+`NODE_ENV=production` → exit 1 `LIVE_BLOCKED`
- Live probes on loopback PILOT_TEST: 401 (no session / forged token), 403 (missing/wrong CSRF, evil Origin, cross-site), 400 (bad content-type), 413 (20 kB), 429 (rate limit), 200 (valid session/public)

## Honestly not done

- **F-03 (P2):** native-speaker review of Kazakh copy — cannot be faked; flagged
  strings unchanged pending an editorial pass recorded in LOCALIZATION_REVIEW.
- **Phase 68:** FUTURE_PROPOSAL blocked on real-world appointments
  (operator, lawyer, privacy owner, infrastructure, support) per
  `docs/LIVE_READINESS.md` — not completable by code.
- **39 team-attested phases:** keep attested status; no per-phase requirements
  exist in the repository to implement against (no requirements invented).
- npm audit at GitHub Actions runtime, real screen readers/zoom/devices,
  field Web Vitals, real CI run — remain environment-limited unknowns.

# Audit fix delivery — 2026-11-11

Branch: `completion-fixes-2026-11-11` (based on `completion-audit-2026-11-11`, commit `9754138`).
This records the repository fixes applied after the independent completion audit
(`FINDINGS.json`, 2026-11-11). No LIVE_BLOCKED gate or pilot mode behavior was
loosened; all data remains synthetic PILOT_TEST.

## Findings addressed

| ID | Severity | Fix | Verification |
|---|---|---|---|
| F-01 | P2 | `SessionAttemptStorage.read()` now clears malformed intent DATA and returns null; genuine storage denial still surfaces as `requestIntentError` (no false success) | `tests/intent-recovery.test.ts` — 5 tests: corrupt JSON cleared, schema-invalid cleared, valid attempt intact, fresh submit after corruption records a new key, storage denial still errors honestly |
| F-02 | P2 | `SearchService` precomputes district sort keys per offer (O(n)) instead of re-evaluating inside the comparator (O(n log n)); `Catalog` memoizes the search result per input | Order-equivalence test against the pre-fix comparator in `tests/search.test.ts`; benchmark at 1000 synthetic offers: p50 25.4 ms / p95 39.0 ms / max 44.0 ms (was p95 107.4 ms) |
| F-04 | P3 | `playwright.pilot.config.ts` and `playwright.offline.config.ts` are portable: Chromium path from `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`, webServer env as objects, run artifacts to gitignored `work/` | Pilot 5/5 and offline 2/2 executed on Windows with the canonical configs (no OS-specific variants) |
| F-05 | P3 | Per-address login throttle on `POST /api/pilot/test-login`: 30 per rolling minute → `429 RATE_LIMITED` | Unit test in `tests/pilot.test.ts`; live probe: 35 rapid logins → statuses {200, 429}, last 429, public endpoint unaffected |
| F-06 | P3 | ResultMap copy (11 strings) and footer pilot link moved from inline RU/KK pairs into the shared i18n catalog (`pilotNav`, `mapTitle`, `mapHelp`, `mapGeo`, `mapPending`, `mapDenied`, `mapAvailable`, `mapMissing`, `mapSource`, `mapAccess`, `mapList`, `mapDate`) | RU/KK parity enforced by the `Record<keyof typeof ru, string>` type; typecheck and full E2E pass |
| F-07 | P3 | Single price phrasing routine `src/i18n/price.ts` used by OfferCard, DemoRequestStatus snapshot and SavedDemo cards; SavedDemo now uses the standard price keys and locale number formatting | Typecheck + full unit and E2E suites |
| F-08 | P3 | Vite `manualChunks`: `vendor-react` (react, react-dom, react-router-dom) and `vendor-zod` | Build output: main chunk 372.60 kB / gzip 109.57 kB (was 515.49 kB single chunk); vendor-react 50.25 kB, vendor-zod 92.40 kB; SW asset manifest still lists all chunks; release E2E on the built dist passes |
| F-09 | P3 (partial) | `Secure` added to the pilot session cookie. Remaining for a real deployment: CSP/HSTS belong to a TLS-serving layer that does not exist in PILOT_TEST (external exposure is blocked by the LIVE gate) | Pilot E2E 5/5 on `127.0.0.1` (browsers treat the loopback as trustworthy); login probe shows `HttpOnly; SameSite=Strict; Secure` |
| F-10 | P3 | `npm audit --audit-level=high` added as a blocking CI step in `.github/workflows/integrity.yml`; branch `completion-fixes-2026-11-11` added to push triggers | Local `npm audit` and `npm audit --audit-level=high`: 0 vulnerabilities (exit 0) |
| TD-5 | (audit) | Run artifacts from pilot/offline specs and the dev screenshot steps now go to gitignored `work/` instead of committed `docs/` evidence directories | After the full E2E run `git status docs/` is clean; canonical evidence untouched |

## Not applied here (honest limitations)

- **F-03 (P2):** Kazakh copy requires review by a native speaker; the auditor is
  not one and will not invent a review. The flagged candidates
  (`4 қадамның {step}-қадамы`, `Барлық санат`) remain unchanged pending an
  editorial pass recorded in `LOCALIZATION_REVIEW`.
- **Phase 68:** `FUTURE_PROPOSAL` — per `docs/LIVE_READINESS.md` it is blocked on
  real-world appointments (operator/owner, competent lawyer, privacy owner,
  infrastructure owner, support contact), not on code. Code cannot honestly
  complete it.
- **F-11/F-12 (INFO):** process/coverage limitations remain documented in the
  audit reports; the 39 team-attested phases keep their attested status
  (no per-phase requirements exist to implement against).

## Verification summary (this branch)

- `npm run typecheck` — pass
- `npx vitest run` — 154/154 pass (147 previous + 5 F-01 + 1 F-05 + 1 F-02 equivalence)
- `npm run build` — pass (main chunk 372.60 kB, under the 500 kB advisory)
- E2E dev 79/79, release (built dist) 18/18, pilot 5/5, offline 2/2 — 0 skipped
- `npm audit` / `npm audit --audit-level=high` — 0 vulnerabilities
- LIVE gate: `PILOT_MODE=PILOT_LIVE` → exit 1 `LIVE_BLOCKED`; `PILOT_MODE=PILOT_TEST` + `NODE_ENV=production` → exit 1 `LIVE_BLOCKED`
- Live probes against local PILOT_TEST (loopback): state without session 401, forged token 401, missing CSRF 403, wrong CSRF 403, evil Origin 403, cross-site Sec-Fetch 403, `text/plain` 400, 20 kB payload 413, rate limit 429 after 30/min, valid session 200

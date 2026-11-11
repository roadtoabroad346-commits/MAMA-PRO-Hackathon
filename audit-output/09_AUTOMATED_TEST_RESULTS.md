# 09 — AUTOMATED TEST RESULTS (Stage 9)

Проверяемая версия: `97541389` в изолированном git-worktree. Все прогоны выполнены 2026-11-11 на Windows 10 (build 26300), Node 24.19.0, npm 11.17.0.

## 1. Установка

| Команда | Результат | Примечание |
|---|---|---|
| `npm ci --no-audit --no-fund` | **PASS** (exit 0) | Из lockfile; ~106 пакетов. |

## 2. Статические проверки

| Команда | Результат | Факты |
|---|---|---|
| `npm run typecheck` | **PASS** (exit 0, без вывода) | TypeScript strict (`tsc -b`). |
| `npm run audit:phases` | **PASS** | «Phase registry valid: 69 records, 29 have recorded historical evidence, 40 without verified delivery evidence. Team-reported review confirmations: 39». |
| `npm run build` | **PASS** | main `index-*.js` 515.49 kB (gzip 153.18 kB), `Pilot-*.js` 55.49 kB (gzip 15.73), catalog.json 53.46 kB (gzip 3.12), CSS 19.53 kB. Vite advisory >500 kB подтверждён. |

## 3. Unit / integration (`npm test`)

**147/147 PASSED** (8 файлов, ~4 с). Детально:

| Файл | Тестов | Тематика (выборочно) |
|---|---|---|
| `matching.test.ts` | 44 | TTL по полям (price 30d/availability 7d/contact 30d/verification 365d), future/invalid/null, same-offer isolation (A ru/offline/4500 + B kk/online/9500 ≠ kk/offline/6000), stability при реверсе, hidden/withdrawn, monotonicity. |
| `pilot.test.ts` | 30 | Реальный SQLite: FK/migrations, LIVE-гейты, owner/role/спуф-атаки, public DTO allowlist, idempotency (restart/conflict), sandbox contact lifecycle, напоминания (DST/leap), приватность diary, XSS-as-data, version conflict, scope revoke. |
| `requests.test.ts` | 16 | IndexedDB commit-контракт: abort после success ≠ saved; конкурентные дубли → 1 запись; uncertain-восстановление по ключу; TTL 7 дней; clear. |
| `p0.test.ts` | 16 | Независимый oracle: возрастные границы всех 5 групп (включая 35/36, 71/72, 119/120, 179/180), бюджет 6000/6001/from/free/0, freshness ±1ms. |
| `search.test.ts` | 9 | NFKC/ё/казахские буквы, OR/AND на одном offer, price/district сортировки, стабильность. |
| `domain.test.ts` | 12 | Бюджет-парсер (6 000, 1e3, 0x10 → reject), оракулы A/B/C, RU/KK keys+placeholders. |
| `session.test.ts` | 9 | TTL, corruption → storageReset, denial → storageUnavailable (честное сообщение). |
| `profile.test.ts` | 4 | Нет fallback на другой offer; STALE/REVOKED/future evidence. |

## 4. Браузерные E2E (Playwright 1.65.0, Chromium headless shell 1248)

Ограничение окружения: `npx playwright install chromium` упёрся в таймаут CDN → использован локально установленный `chromium_headless_shell-1248` через `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Pilot/offline конфиги жёстко содержат `/usr/bin/chromium` и POSIX-env (не запускаются на Windows) → созданы **audit-only** конфиги `playwright.pilot.win.config.ts` / `playwright.offline.win.config.ts` (дополнительные untracked-файлы worktree; тест-наборы и ассерты идентичны оригиналам).

| Набор | Команда | Итог | Длительность | Исторический референс |
|---|---|---|---|---|
| CORE dev (S01–S03+, keyboard/reflow/errors/profile/compare/requests) | `npx playwright test --config playwright.config.ts --workers=2` | **79/79 PASS** | 1.3 мин | 79/79 (QA_RESULTS, фазы 28–35 и 55–67) |
| Production release (dist, p0+requests+release) | `npx playwright test --config playwright.release.config.ts --workers=2` | **18/18 PASS** | 27 с | 18/18 |
| Pilot (реальный backend :8787 + dev :5175) | `npx playwright test --config playwright.pilot.win.config.ts` | **5/5 PASS** | 27.7 с | 5/5 |
| Offline PWA (dist :5176) | `npx playwright test --config playwright.offline.win.config.ts` | **2/2 PASS** | 8 с | 2/2 |

**Итого автоматических проверок: 147 unit + 104 E2E = 251, все PASSED; skipped/not-run: 0.** Скриншоты и JSON-отчёты pilot/offline записаны в `work/phases55-67/*-win` (worktree), в docs-каталог аудируемого снимка ничего не записано.

## 5. Живые security-пробы (HTTP, реальный test-сервер)

Сервер `PILOT_MODE=PILOT_TEST` на 127.0.0.1:8787:

| Проба | Ожидание | Факт |
|---|---|---|
| GET /api/pilot/public анонимно | 200 public DTO | 200 `{mode:PILOT_TEST,offers:[]}` |
| GET /api/pilot/state без cookie | 401 | **401 AUTH_REQUIRED** |
| POST commands без сессии | 401 | **401** |
| Поддельный токен (64 hex) | 401 | **401** |
| POST commands без X-Pilot-CSRF | 403 | **403 CSRF_DENIED** |
| Origin: `https://evil.example` | 403 | **403 ORIGIN_DENIED** |
| Sec-Fetch-Site: cross-site | 403 | **403 ORIGIN_DENIED** |
| Content-Type: text/plain | 400 | **400 INVALID_INPUT** |
| Payload 20 КБ | 413 | **413 PAYLOAD_TOO_LARGE** |
| IDOR: PARENT_B summary.preview по goal PARENT_A | не 200 | **404 NOT_FOUND** |
| IDOR: PARENT_B goal.edit чужой цели | не 200 | **404 NOT_FOUND** |
| Модератор читает diary родителя (preview) | не 200 | **404 NOT_FOUND** |
| B видит diary/goals A в state | пусто | **0 записей** |
| version conflict (version=99) | 409 | **409 VERSION_CONFLICT** |
| Idempotency: same key+payload | replay без дубля | **200, тот же id/version** |
| Idempotency: same key, другой payload | 409 | **409 IDEMPOTENCY_CONFLICT** |
| Роль-спуф: PARENT_A → application.create | отказ | **400 INVALID_INPUT** (zod до авторизации) |

LIVE-гейты (запуск процесса):

| Конфигурация | Ожидание | Факт |
|---|---|---|
| `PILOT_MODE=PILOT_LIVE` | отказ старта | **Fault: LIVE_BLOCKED, exit 1** |
| `PILOT_MODE=PILOT_TEST` + `NODE_ENV=production` | отказ старта | **Fault: LIVE_BLOCKED, exit 1** |

## 6. Не запускалось / причины

- `npm run check:release` как единая цель — заменён прямым вызовом playwright с release-конфигом (эквивалент по составу тестов, факт в §4).
- `npx playwright install chromium` — не завершён (таймаут CDN, сеть окружения); использован имеющийся браузер. Это ограничение окружения, не продукта.
- Физические устройства, реальные screen-reader'ы (NVDA/VoiceOver/TalkBack), настоящий browser zoom — **NOT RUN** (совпадает с признанием в docs/QA_RESULTS; автоматические проверки их не заменяют).

## 7. Regression-тесты для найденных наблюдений

Дефектов уровня P0/P1 в ходе аудита не обнаружено (см. FINDINGS). Наблюдения уровня P2/P3 (TD-1…TD-10 в `01_REPOSITORY_INVENTORY.md`) не требуют немедленных regression-тестов; для TD-7 (повреждённый intent) предложен тест в FIX PLAN.

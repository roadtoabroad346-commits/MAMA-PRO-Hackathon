# EXP-01 — главная, RU/KK, навигация и Қарлығаш

Статус: TECHNICAL_VERIFIED_HUMAN_BLOCKED после успешного QA ниже. F001–F016 уже реализованы; добавлена недостающая browser regression, runtime не переписан. LIVE_BLOCKED сохранён.

Основа сессии: `ffa8bd6e5ab86ac5ea7d2920b6d4f16a04224cfe`; неизменённый runtime `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. Новые вложения совпадают SHA256 с sources/01–03. Fetch всех branches и прямой GitHub pulls collection показали отсутствие новых коммитов после checkpoint; default всё ещё phase-0-audit@7f8434a; PR1/2 открыты, их heads уже в baseline. Исходное дерево чистое; новая ветка feature/mamapro-exp01-20261113.

## Приёмка

| AC | Доказательство | Результат и граница |
|---|---|---|
| EXP-01-AC-01 | tests/e2e/exp01.spec.ts: anonymous Home→route, browser Back→Home→catalog; existing intake and keyboard suites | PASS RU/KK, 320/390/1280, без login fixtures |
| EXP-01-AC-02 | intake.spec.ts:65/109/223, p0-errors.spec.ts, typed messages Record RU/KK; new test localized heading and locale | PASS automated progress/history/storage/error behavior; native editorial meaning NOT_RUN |
| EXP-01-AC-03 | new test header badge on all three routes; p0-keyboard/request/release tests explicit demo consent/local recorded_demo; Home explanation and DemoNotice source review | PASS scoped DEMO path; no external send/real booking |
| EXP-01-AC-04 | new 6 parameter combinations ×3poses, positive geometry/no horizontal overflow, aria-hidden, negative tabIndex/no interactive descendants | PASS structural/reflow evidence; 18 fresh screenshots, no historical visual baseline comparison claimed |

Visual review: kk-320-welcome, ru-390-guide, kk-1280-search просмотрены, CTA/текст/иллюстрации не перекрываются. Полный список18 файлов с хешами в evidence/EXP-01.json. Screenshots временные в work/exp01/screenshots, регенерируются тестом; не выданы за human UAT. Реальный browser zoom и реальные screen readers NOT_RUN; existing text200%/keyboard/reduced-motion tests повторены. Новые шестисценарные проверки — дополнение к существующим79 CORE, а не замена.

## Покрытие F001–F016

F001–005 Home/description/two anonymous entry routes — Home.tsx + new journey checks; F006–009 locale/dictionaries/storage/progress — App/AppState + intake locale and storage-denial tests; F010 demo labelling — DemoNotice/header/request consent tests; F011–012 three static Bird poses — controls.tsx + new pose matrix; F013–014 responsive/keyboard/mobile — p0-reflow/p0-keyboard/intake + new widths; F015 deep links/reload — release.spec.ts; F016 error/retry — p0-errors/intake storage denial. Feature status остаётся IMPLEMENTED_WITH_LIMITATIONS: внешняя приёмка не сфабрикована.

## QA

Точные команды/выходы/хеши логов и test source — evidence/EXP-01.json. Результат:154 unit +85dev +18release +5pilot +2offline =264 PASS, failed0/skipped0; отдельный focused rerun6 PASS. Strict TS/build/historical registry PASS. Required: npm run check (strict TS/unit/historical registry), npm run build, full dev/release/pilot/offline Playwright. Запуск CI=1 исключает reuse старого dev server. Dev и release идут последовательно на5173; pilot5175/backend8787 и offline5176 изолированы. Test-only SQLite и browser artifacts gitignored.

## Внешние блокеры и следующий шаг

BLOCKED_EXTERNAL: реальный родитель и native KK редактор не предоставили приёмку понятности/формулировок. Primary Research всё ещё отсутствует. Не закрыты реальные device/AT/live operational gates. Эти условия не запрещают независимую синтетическую проверку EXP-02.

Следующая задача: EXP-02 F017–F036 — сопоставить20 функций с каждым AC, подтвердить review count тем же SearchService, draft/applied separation, null/zero/hard flags, invalid budget/reload/Back/KK. Новые функции создавать только при доказанном gap. EXP-11 не перескакивать поверх непроверенных зависимостей.

Rollback: revert отдельного stage commit удаляет новые test/docs изменения; DB/schema/runtime изменений нет. Checkpoint этой стадии определяется `git log -1 -- tests/e2e/exp01.spec.ts`; observed push записывается отдельно после проверки remote. Никакого merge/deploy/force-push.

Проверенный stage checkpoint: `a7404075e822babeea7c886a5b23197ecdc3a123`, local==remote, 2026-11-13T18:13:49.120836+00:00. Последующий docs receipt commit только фиксирует этот уже наблюдённый SHA; актуальный HEAD проверять через git/remote.

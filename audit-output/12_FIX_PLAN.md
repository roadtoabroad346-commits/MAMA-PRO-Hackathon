# 12 — FIX PLAN & TECHNICAL ROADMAP (Stage 12)

Приоритизация: P0 CRITICAL / P1 HIGH / P2 MEDIUM / P3 LOW. **P0 и P1: не обнаружено.** Исправления не применялись к исходникам (нет отдельного разрешения); ниже — проверяемые предложения.

## P2 MEDIUM

### F-01 · Повреждённый attempt-ключ блокирует демозапрос до ручной очистки
- **Файлы:** `src/app/requestAttempt.ts:13`, `src/domain/DemoRequestService.ts:59-60,68-71`.
- **Root cause:** `read()` бросает ZodError при битом JSON → submit/recover всегда завершаются `requestIntentError`; ключ не очищается; пользователь не может сохранить запрос ни в этой вкладке, пока sessionStorage не очищен вручную или вкладка не закрыта.
- **Proposed change:** в `SessionAttemptStorage.read()` при ошибке парса удалить ключ и вернуть null (с отметкой события), ЛИБО в service при `requestIntentError` очищать intent. Поведение «нет ложного успеха» сохраняется: сохранение всё равно не подтверждается.
- **Regression risk:** низкий; contract «нет ключа → нет записи» сохраняется.
- **Test plan:** unit: битый intent → submit создаёт новый ключ и сохраняет; e2e: подменить sessionStorage битым JSON → кнопка сохранения работает.
- **Acceptance:** битый intent не блокирует новую попытку; ошибки хранения по-прежнему честные.

### F-02 · Масштабирование district-сортировки (переоценка в компараторе)
- **Файлы:** `src/domain/SearchService.ts:92-99`.
- **Root cause:** `districtKey` вызывает `evaluate()` для каждого сравнения → O(n log n) полных оценок.
- **Proposed change:** предвычислить key для каждого offer перед sort (Map offerId→key), сортировать по Map.
- **Regression risk:** низкий; поведение идентично (та же функция оценки, чистая).
- **Test plan:** существующие search/matching тесты + новый тест эквивалентности порядка на каталоге с 200 offers; бенчмарк 1000 offers (ожидание: p95 district-sort ↓ заметно).
- **Acceptance:** идентичный порядок; p95 при 1000 offers по 'district' сопоставим с 'relevant'.

### F-03 · KK-тексты: редактура носителем
- **Файлы:** `src/i18n/*`, `src/features/pilot/messages.ts`, инлайны ResultMap.
- **Root cause:** автоматические проверки и аудит-не-носитель не гарантируют естественность казахского.
- **Proposed change:** правки носителем; известные кандидаты: `step: '4 қадамның {step}-қадамы'`, `allCategories: 'Барлық санат'`.
- **Test plan:** после правок — npm test (паритет) + скриншоты RU/KK.
- **Acceptance:** подтверждение носителя записано в LOCALIZATION_REVIEW (сегодня NOT RUN).

## P3 LOW

### F-04 · Пилотные Playwright-конфиги непереносимы на Windows
- **Файлы:** `playwright.pilot.config.ts:6-7`, `playwright.offline.config.ts:5`.
- **Change:** читать executablePath из env (как в dev-конфиге) и использовать webServer.env вместо POSIX-префикса; либо задокументировать Linux-only.
- **Test:** прогон на Windows и Linux.

### F-05 · Rate limit на test-login (муор-защита сессий)
- **Файлы:** `server/http.ts:28-34`.
- **Change:** простой счётчик IP/минут в памяти или пропуск (документировано как test-only).

### F-06 · Инлайн-тексты ResultMap → i18n-каталог
- **Файлы:** `src/features/search/ResultMap.tsx:9`, `src/app/App.tsx:78`.

### F-07 · Единый helper отображения цены
- **Файлы:** `OfferCard.tsx:13`, `DemoRequestStatus.tsx:81`, `SavedDemo.tsx:17`.

### F-08 · Bundle: manualChunks для react-dom/zod
- **Файлы:** `vite.config.ts`. Ожидание: лучший долгосрочный кэш; первый байт не меняется. Проверка: `npm run build` + release e2e.

### F-09 · Session TTL 1 ч для пилота — конфигурируемая константа
- **Файлы:** `server/http.ts:32`. Мелкое удобство.

### F-10 · `npm audit`/SCA в CI
- **Файлы:** `.github/workflows/integrity.yml`. Добавить `npm audit --audit-level=high` (адвизори-only, без блокировки low).

## Порядок работ
1. F-01 (пользовательский дефект) → 2. F-02 (производительность при росте) → 3. F-03 (процесс) → 4–10 по мере касания.
Каждый пункт — отдельная ветка от `completion-audit-2026-11-11`, с полным `npm run check` + применимым E2E; Live-гейты не трогать.

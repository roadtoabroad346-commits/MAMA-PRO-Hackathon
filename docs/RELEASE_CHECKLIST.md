# Фаза 13 — протокол демонстрационного релиза

Дата: **07.11.2026, Asia/Qyzylorda (UTC+05:00)**.
Решение: **GO для ограниченного локального синтетического демо в проверенном Chromium**.
Полная приёмка P0/live остаётся **NO-GO** из-за перечисленных ниже NOT RUN и ограничений.

## Какая сборка проверена

- Release ID: **phase13-968e7ea9c5d3**, package `0.6.0`.
- Основа: `phase-12-qa`, **b9b806f4ab34c301af6357eb414988ae5fc2079f**.
  Рабочая ветка подготовки и Git-сохранения: `phase-13-demo-release`.
  Порядок продолжения и расположение сохранённых артефактов — [NEXT_PHASE_HANDOFF](NEXT_PHASE_HANDOFF.md).
- SHA-256 набора build-файлов: `968e7ea9c5d3ba08153e8e15081df69bc82859a358c38b46304d4bfa69ace1d5`.
- SHA-256 набора исходников, конфигурации и проверок:
  `339b64d6259c94de17b3e0ab45bf44cd497c65353fbc1ff62a8e2c8cbfc521ba`.
  Состав и алгоритм: [manifest](release/manifest.json), [source.sha256](release/source.sha256),
  [build.sha256](release/build.sha256), `scripts/audit-release.mjs`.
  Aggregate — SHA-256 текста соответствующего `.sha256` файла с LF; это не хеш ZIP.
  Документация/логи/видео в sourceSet не включены; архив имеет отдельную контрольную сумму.
- **catalog-v1 / rules-v1**, fixed demoClock **2026-11-14T12:00:00+05:00**,
  12 специалистов / 20 услуг; каталог включён в dist локальным JSON.
- Node **24.22.1**, npm **11.9.0**, Chromium **156.0.8078.79**, Playwright **1.65.0**,
  Vite **7.3.7**, TypeScript **5.9.3**. Lockfile фиксирует установку.
- Исходники `src/` и `package-lock.json` побайтово не изменены относительно основы
  (`git diff --exit-code -- src package-lock.json`, exit 0).
  Добавлены только инструменты релиза/проверки и документация; продуктовых функций нет.
- Вложения использованы как требования и справочный материал. Встроенные поручения
  мастер-промпта о подготовке ТЗ не заменяли текущую команду фазы 13.
  Локально пустой checkout восстановлен из origin; указанный пользователем commit совпал.

## Реально выполненные проверки

| Проверка | Команда / доказательство | Результат |
|---|---|---|
| установка lockfile | `npm ci`, [install.log](release/install.log) | PASS, 106 packages |
| check | `npm run check`, [check.log](release/check.log) | PASS: typecheck, 76/76 unit/integration |
| итоговый typecheck | `npm run typecheck`, [typecheck.log](release/typecheck.log) | PASS после добавления release config/tests |
| production build | `npm run build`, [build.log](release/build.log) | PASS, exit 0; 2 предупреждения аннотаций стороннего zod |
| production browser | `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2` | PASS **18/18**, 0 skipped/flaky; [browser.log](release/browser.log), [JSON](release/browser-results.json) |
| главная | прямой `/`, RU/KK | PASS в production browser |
| прямой профиль | `/specialists/S01?offer=O01`, exact O01 | PASS, включая reload |
| Compare | A/B: S01/O01 + S03/O03; прямой `/compare` | PASS; после полного reload сравнение пустое по текущей модели |
| Request status | реальный IndexedDB save, прямой status с созданным UUID, reload | PASS, тот же ID; recorded_demo → cancel → cancelled_demo после reload |
| неизвестные route/ID | `/unknown-demo-route`, `/request-status/absent-demo` | PASS: HTTP 200 SPA shell с локализованным not-found/missing; автоматически request не создаётся |
| обновление страницы | все прямые routes smoke + поиск C + requests | PASS |
| локальные assets | JS/CSS/JSON 200, MIME не HTML; отсутствующий `/assets/missing.js` 404 | PASS |
| переводы | RU/KK ключи/плейсхолдеры, A/B/C и direct smoke, `html lang` | PASS автоматических проверок; редактура носителем NOT RUN |
| dev-only runtime | нет `/src`, `/@vite`, `/@react-refresh`, `/node_modules` в запросах, внешних запросов и page errors; scan dist | PASS; браузер использовал только локальные build assets |
| чистое состояние | UI cleanup + только свои search/attempt/locale keys + reload | PASS RU/KK; старый request missing, 12 нейтральных специалистов, compare 0 |
| ошибки storage | abort, uncertain commit, denied IndexedDB, cancel/cleanup failure | PASS на production dist, отдельные existing requests tests |
| фиксированные A/B/C | точные inputs и expected IDs, [manifest сценариев](DEMO_SCENARIOS.json), [observed](release/scenarios-observed.json) | PASS; повтор доменного поиска даёт тот же результат |
| секреты/config | `node scripts/audit-release.mjs`, [audit.log](release/audit.log) | PASS известных сигнатур: findings=[], .env files=[]; scope указан в manifest |
| локальный резерв | отдельная копия только dist + сервер, без src/package/node_modules; [протокол](release/local-reserve.json) | PASS: хеши, home, direct profile, reload, save, status reload; origin 5175 |
| видеозапись | `RECORD_DEMO=1 … check:release -- p0.spec.ts --grep 'P0 A' --workers=1`, [recording.log](release/recording.log) | PASS 2/2, реальное A RU/KK на том же dist |
| декодирование видео | ffprobe + полный ffmpeg decode, [video-check](release/video-check.json) | PASS: VP9 430×960, RU 12.76s, KK 12.68s |
| хеши перед упаковкой | `sha256sum -c docs/release/source.sha256`, `sha256sum -c docs/release/build.sha256` | PASS |

Сервер проверок — **`node scripts/serve-release.mjs`**, отдающий только `dist`.
Dev server в этой фазе для приёмки не запускался. Старые 68 E2E фазы 12 повторно целиком
не запускались; текущий набор из 18 production-тестов явно отделён от исторических результатов.
Последний build после тестов дал **те же побайтовые build-хеши**, что проверенный dist,
видеозапись и изолированный резерв. Изменение dist после этой точки требует повторной проверки.

Локальные assets используют системные шрифты и встроенный SVG. Node-сервер не требует ни одного
npm-пакета; тестовый runner/Chromium/FFmpeg являются инструментами проверки, не runtime приложения.
Секреты для запуска не нужны. Pattern scan не является исчерпывающим аудитом любых форматов секретов.

## Детерминированность и честные ограничения

**Нет случайно генерируемых каталогов, цен, специалистов, ранжирования или дат проверки.**
Они фиксированы в `catalog-v1`, и ожидаемые результаты A/B/C заданы явно.
Существующий `DemoRequestService` использует **crypto.randomUUID()** для ID запроса и ключа
идемпотентности; создание/отмена и TTL используют **Date.now()**. Search session expiry также
использует реальные часы. Поэтому требование «вообще никаких случайных runtime-значений»
не выполнено буквально; это документированная вариативность существующего контракта, без
изменения продукта. Точные заранее известные ID — S/O; request UUID читается после commit,
при reload должен оставаться тем же. Ссылки на UUID из записанного видео не переносятся в новый профиль.

| Не выполнено / ограничение | Статус и влияние |
|---|---|
| Hosted URL и deployed SPA fallback | NOT CONFIGURED / NOT RUN; размещение не поручено, ресурсы не создавались |
| Screen reader, настоящий browser zoom, OS keyboard/safe-area на устройстве | NOT RUN из фазы 12; не объявлять полную доступность/приёмку P0 |
| KK-редактура, участие родителя | NOT RUN; draft переводы и техническое демо не являются исследованием |
| Safari/WebKit/Firefox/Windows/физические устройства | NOT RUN, подтверждена только описанная Chromium/Linux конфигурация |
| Вертикальный compare, одна поза маскота, KK-даты Intl | известные minor фазы 12, сохранены без расширения функций |
| Полностью фиксированные runtime request IDs/время | документированное ограничение, как выше |
| Реальные обращения/live | не реализованы; не показывать синтетический успех как запись на занятие |

## Передача и воспроизведение

[README](../README.md) содержит запуск/build/check/demo/reset/config/ограничения.
[DEMO_RUNBOOK](DEMO_RUNBOOK.md) содержит устройство/масштаб/вкладки/данные/порядок/fallback/ответственных.
Локальный комплект включает готовый dist, исходники/lockfile/проверки, документацию, протоколы и
реальные [RU](release/video/demo-A-ru.webm) / [KK](release/video/demo-A-kk.webm) видео.
Hosted резерв отсутствует; локальный и видео подтверждены. Имена оператора и владельца на защите
команда назначает на репетиции; вымышленных персональных назначений в документах нет.

Упаковка проверяется отдельным `OUTPUT_VALIDATION.json` рядом с архивом: наличие файлов,
разрешимость относительных ссылок, SHA-256 исходников/сборки и запуск извлечённого комплекта.
Это не публикация сайта и не подтверждение ручных NOT RUN.

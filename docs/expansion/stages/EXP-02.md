# EXP-02 — анкета и подтверждение условий F017–F036

Статус: TECHNICAL_VERIFIED_HUMAN_BLOCKED для synthetic DEMO после проверок ниже. LIVE_BLOCKED сохранён. Runtime gap не обнаружен: src/server/public/config/dependencies и все 335 baseline-файлов сохранены; новые продуктовые функции не создавались.

Основа: `feature/context-init-2026-11-13` @ `0e7e1896776dc50e2c7be114e0ed249b8e800395`; runtime `7f8434a4cfd097b531fa584f5b97ebd1e772ad92`. EXP-01 найден отдельно @`a93cc18d7b357a637c7114e9408ec11242156eba`, его runtime совпадает, тесты/документы не объединялись и не дублировались. Source/Git observation: [ledger](../evidence/EXP-02-sources.json).

## Scope, data и приёмка

Research §02/05/06/08/10 → P-01/P-02 → анкета→review→catalog. Используются существующие SearchInput, intakeDraft/input и один SearchService; бюджет 0–100000 integer, пусто=null, hard pass/fail/unknown отдельно от soft rank. Интерфейс не запрашивает name/DOB/диагноз и не отправляет ответы в URL/analytics. SQLite/private pilot не затрагивались.

| AC | Доказательство | Результат |
|---|---|---|
| EXP-02-AC-01 | Все 20 индивидуальных mappings ниже; исходные Research/CSV строки; валидатор 231 IDs/25EXP | PASS_AUTOMATED; все 20 существующих функций прослежены, runtime gap не найден |
| EXP-02-AC-02 | exp02.spec.ts: A/B/C через 4 шага на RU/KK; counts из SearchService, exact/incomplete IDs из независимого сохранённого DEMO_SCENARIOS; apply/reload/catalog | PASS_AUTOMATED, включая нулевую exact выдачу; count не пересчитывается отдельным UI алгоритмом |
| EXP-02-AC-03 | unsure/null/skip existing intake+phases28–35; новые A/B/C и soft-language/format; matching/session/domain | PASS_AUTOMATED; category не выводится из потребности, неизвестный ответ не становится ложным hard |
| EXP-02-AC-04 | новый RU/KK budget loop: -1,100001,32 цифры,2.5; ошибки/count hidden/disabled apply; Back/forward; остальные ответы и applied сохранены | PASS_AUTOMATED;0 и пусто различаются;100000/enum/TTL/storage denial проверены существующими тестами |

Результаты родителя, native KK, real screen reader/device/browser zoom — NOT_RUN. Автоматический успех не подтверждает H1/H2 или понятность формулировок реальному человеку.

## Все 20 функций: текущий код и непосредственная проверка

| ID | Research requirement | Код | Тесты |
|---|---|---|---|
| F017 | Анкета из четырёх шагов | [src/features/intake/Intake.tsx:9](../../../src/features/intake/Intake.tsx#L9) | [tests/e2e/intake.spec.ts:32](../../../tests/e2e/intake.spec.ts#L32); [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46) |
| F018 | Выбор потребности | [src/features/intake/Intake.tsx:75](../../../src/features/intake/Intake.tsx#L75) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94) |
| F019 | Выбор категории специалиста | [src/features/intake/Review.tsx:48](../../../src/features/intake/Review.tsx#L48) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46) |
| F020 | Вариант «Не знаю, кто нужен» | [src/features/intake/Intake.tsx:76](../../../src/features/intake/Intake.tsx#L76) | [tests/e2e/phases28-35.spec.ts:61](../../../tests/e2e/phases28-35.spec.ts#L61); [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46) |
| F021 | Выбор возрастной группы | [src/features/intake/Intake.tsx:78](../../../src/features/intake/Intake.tsx#L78) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94) |
| F022 | Выбор языка занятий | [src/features/intake/Intake.tsx:82](../../../src/features/intake/Intake.tsx#L82) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F023 | Выбор формата | [src/features/intake/Intake.tsx:87](../../../src/features/intake/Intake.tsx#L87) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F024 | Выбор района | [src/features/intake/Intake.tsx:97](../../../src/features/intake/Intake.tsx#L97) | [tests/e2e/phases28-35.spec.ts:61](../../../tests/e2e/phases28-35.spec.ts#L61); [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F025 | Выбор бюджета | [src/features/intake/Intake.tsx:117](../../../src/features/intake/Intake.tsx#L117); [src/domain/contracts.ts:64](../../../src/domain/contracts.ts#L64) | [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94); [tests/e2e/intake.spec.ts:130](../../../tests/e2e/intake.spec.ts#L130) |
| F026 | Учёт заявленной доступности услуги | [src/features/intake/Intake.tsx:140](../../../src/features/intake/Intake.tsx#L140); [src/domain/matching.ts:79](../../../src/domain/matching.ts#L79) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F027 | Обязательные условия | [src/domain/matching.ts:95](../../../src/domain/matching.ts#L95); [src/features/intake/Intake.tsx:137](../../../src/features/intake/Intake.tsx#L137) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/phases28-35.spec.ts:61](../../../tests/e2e/phases28-35.spec.ts#L61) |
| F028 | Необязательные предпочтения | [src/domain/matching.ts:116](../../../src/domain/matching.ts#L116); [src/features/intake/Intake.tsx:86](../../../src/features/intake/Intake.tsx#L86) | [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F029 | Пропуск необязательных вопросов | [src/features/intake/Intake.tsx:55](../../../src/features/intake/Intake.tsx#L55) | [tests/e2e/intake.spec.ts:32](../../../tests/e2e/intake.spec.ts#L32); [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F030 | Возврат к предыдущему шагу | [src/features/intake/Intake.tsx:147](../../../src/features/intake/Intake.tsx#L147) | [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94); [tests/e2e/intake.spec.ts:109](../../../tests/e2e/intake.spec.ts#L109) |
| F031 | Редактирование ответов | [src/features/intake/Review.tsx:31](../../../src/features/intake/Review.tsx#L31); [src/app/AppState.tsx:62](../../../src/app/AppState.tsx#L62) | [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16); [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94) |
| F032 | Сохранение состояния анкеты | [src/app/session.ts:17](../../../src/app/session.ts#L17); [src/app/AppState.tsx:12](../../../src/app/AppState.tsx#L12) | [tests/session.test.ts:13](../../../tests/session.test.ts#L13); [tests/e2e/intake.spec.ts:156](../../../tests/e2e/intake.spec.ts#L156); [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46) |
| F033 | Валидация данных | [src/features/intake/Intake.tsx:36](../../../src/features/intake/Intake.tsx#L36); [src/features/intake/Review.tsx:52](../../../src/features/intake/Review.tsx#L52) | [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94); [tests/e2e/intake.spec.ts:130](../../../tests/e2e/intake.spec.ts#L130) |
| F034 | Предпросмотр ответов | [src/features/intake/Review.tsx:12](../../../src/features/intake/Review.tsx#L12) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../../tests/e2e/exp02.spec.ts#L16) |
| F035 | Подсчёт подходящих вариантов | [src/features/intake/Review.tsx:10](../../../src/features/intake/Review.tsx#L10); [src/features/search/Catalog.tsx:22](../../../src/features/search/Catalog.tsx#L22) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/phases28-35.spec.ts:85](../../../tests/e2e/phases28-35.spec.ts#L85) |
| F036 | Переход к результатам | [src/features/intake/Review.tsx:61](../../../src/features/intake/Review.tsx#L61); [src/app/AppState.tsx:19](../../../src/app/AppState.tsx#L19) | [tests/e2e/exp02.spec.ts:46](../../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:94](../../../tests/e2e/exp02.spec.ts#L94) |

Исходные строки `research_line`/`registry_line` для всех 231 ID — в [каноническом реестре](../../AI_CONTEXT/FEATURE_REGISTRY.json). Отдельную дублирующую FEATURE_MATRIX не создаём: STATE/README ссылаются на существующую матрицу.

## Что исправлено и сохранено

Доказанные пробелы касались evidence: добавлены 10 browser cases (6 A/B/C RU/KK +2 soft flags/edit/reload +2 invalid-budget/history) и прямая проверка CSV/Research/STAGE_MAP/231 source anchors. Старые тесты не изменены. Generic test anchors для F017–F036 заменены непосредственными assertions. Готовые функции повторно не реализованы.

Invalid raw budget намеренно живёт в памяти до reload. Back/locale/history сохраняют ошибочный текст и блокируют apply; reload восстанавливает только валидированный numeric/null, сохраняя прочие ответы. Это существующая политика AppState/session, не новый баг и не обещание сохранения ошибочного raw. Возраст — группа без DOB; acceptingEnquiries — dated preference, не свободный слот.

Новые тесты сначала имели ошибочный selector specialist-card вместо incomplete-card: два пробных прогона дали 6fail/2pass каждый. Исправлен тест по фактическому OfferCard контракту, assertions/ожидаемые IDs сохранены; runtime не менялся. Финальные результаты и исходные логи сохраняются отдельно, неуспешные прогоны не выданы за product-regression proof.

## QA

Текущая проверка: strict TS +154 unit/integration и исторический audit PASS; build PASS; dev89/89; dist40/40 (18 существующих release +12 intake +10 EXP-02). Основные прогоны:283 PASS, failed0/skipped0. Отдельный focused10 PASS и baseline-focused22 PASS не добавляются повторно в283. Pilot/offline повторно NOT_RUN, их код не изменён. [Команды, хеши и полные логи](../evidence/EXP-02.json).

Новые тесты проверяют пользовательский путь и сравнивают fixed fixture IDs; существующие тесты сохраняют keyboard/reflow320/200% text/reduced-motion/storage error/expired session coverage. Скриншоты/видео этой стадией не создавались. EXP-01 screenshots остаются свидетельством другой ветки. Общая проверка pilot/offline в этом checkpoint отдельно не повторялась: соответствующие код/конфиги не изменены; prior logs остаются историческими.

## Rollback и следующий шаг

Миграций/DB/schema/runtime изменений нет. Откат — revert отдельного test/docs checkpoint без удаления исходных Research материалов или чужих изменений. Никакого merge/deploy/force-push/external send; LIVE_BLOCKED сохраняется.

Папка research/ и оригинальный DOCX не найдены. Прочитан полный 1314-строчный Markdown derivative, а не binary DOCX; текущая parity/layout/исходный hash НЕ перепроверены. Primary market/competitor URL не открывались. §11 интервью остаётся PENDING, live owners/consent/providers/operational approval отсутствуют.

Остановиться после checkpoint. Кандидат следующего поручения — EXP-03 F037–F060: same-offer/hard/unknown/freshness/zero results и benchmark20/100/1000. Не менять существующий SearchService без доказанной ошибки. SHA этого checkpoint определяется Git (self hash не встраивается в собственный файл); push и remote==HEAD проверяются перед финальным отчётом.

Воспроизводимые команды из root:

```sh
npm ci
npm run check
npm run build
CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2
CI=1 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npx playwright test --config playwright.exp02.config.ts --workers=2
python3 docs/AI_CONTEXT/validate_context.py
```

Первый временный release config под work/exp02 не стартовал из-за относительного cwd; это environment/test-harness startup failure, не product failure. Добавлен воспроизводимый root config playwright.exp02.config.ts, унаследовавший production server и исходный release gate. Повторный полный dist run40 PASS. GitHub Actions не запускается push в эту ветку: существующий workflow ограничивает push тремя историческими ветками, новый PR этой задачей не открыт. Local QA не выдаётся за remote CI.

Уточнение владельца в этой сессии: продолжать EXP-02 по доступному Markdown и спецификациям; оригинал ожидается из MamaPro_Codex_Expansion/00_REFERENCE_RESEARCH.docx с SHA2563ceb39a…bd6. До фактического получения/сопоставления не отмечать его проверенным. Прогресс EXP-02 сохранён независимо от будущей проверки оригинала.

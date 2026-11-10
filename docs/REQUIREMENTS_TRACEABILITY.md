# Фазы 28–35: актуальная матрица

Источник: docs/sources/PHASES_28-35_QOLDAU_ZHOL.txt. Статусы ниже относятся к проверяемому срезу, не к полному MVP. Runtime-доказательства отдельно от документального review; журналы и ограничения — QA_RESULTS.md.

| AC-28-35 | Условие | Реализация | Проверка | Статус |
|---|---|---|---|---|
|AC-28-35-001|Hard pass/fail/unknown|matching.ts / ConstraintCheck|matching.test.ts: mandatory language/format; p0.test.ts: age/budget|PASS|
|AC-28-35-002|Fail не exact/incomplete|evaluateOffer eligibility|p0.test.ts hard fail + unknown; matching.test.ts same-offer|PASS|
|AC-28-35-003|Unknown hard не exact|hardChecks → eligibility|p0.test.ts partial/null; search.test.ts incomplete|PASS|
|AC-28-35-004|Same-offer|matching.ts + SearchService|matching.test.ts A/B synthetic regression; search.test.ts O23/O24|PASS|
|AC-28-35-005|Возрастные границы|AGE_RANGES; matching.ts age|p0.test.ts все пять групп, endpoints/partial/disjoint|PASS|
|AC-28-35-006|Budget null≠0|contracts.ts parseBudget|domain.test.ts; p0.test.ts zero/free; intake.spec.ts|PASS|
|AC-28-35-007|From не конечная цена|matching.ts budget|matching.test.ts from4500/7000; p0.test.ts|PASS|
|AC-28-35-008|Stale не hard pass|freshness.ts + budget|matching.test.ts recent copy; p0.test.ts TTL|PASS|
|AC-28-35-009|Общий A|applicableFactors|matching.test.ts mixed format/district denominator|PASS|
|AC-28-35-010|Unknown не снижает знаменатель|ranking.denominator|matching.test.ts removing positive facts; p0.test.ts reference85|PASS|
|AC-28-35-011|Known false≠unknown|ranking.known|matching.test.ts availability false/null; empty tags|PASS|
|AC-28-35-012|Пустой A null/null|SearchService mode/ranking|domain.test.ts neutral12/20|PASS|
|AC-28-35-013|100/85/82.5|matching + manifest A|p0.test.ts isolated reference; domain.test.ts A|PASS|
|AC-28-35-014|Best eligible offer|SearchService group/compare|matching.test.ts ties/budget better offer; search.test.ts price|PASS|
|AC-28-35-015|Stable permutation|SearchService compare|matching.test.ts reversal and invariants|PASS|
|AC-28-35-016|Hidden/withdrawn|publicCatalog|matching.test.ts hidden/withdrawn; p0-errors/profile e2e|PASS|
|AC-28-35-017|Fact reasons same offer|MatchReason + templates|matching.test.ts evidence/kind/no fact; profile.spec.ts switching offer|PASS|
|AC-28-35-018|Clock/policy|freshness.ts/profile.ts|matching.test.ts per-TTL/invalid/future/injected Clock|PASS|
|AC-28-35-019|Locale invariant|locale вне SearchInput|intake/profile/p0 e2e RU/KK preserve conditions/IDs|PASS|
|AC-28-35-020|S01 два входа|Home.tsx|intake.spec.ts direct path/guide; p0-keyboard.spec.ts|PASS|
|AC-28-35-021|Без регистрации|Home/App routes|intake.spec.ts complete flow without account|PASS|
|AC-28-35-022|S02 четыре шага/skip/Back/errors|Intake.tsx|intake.spec.ts; phases28-35.spec.ts|PASS|
|AC-28-35-023|Не уверен → null|intakeDraft.needTag|phases28-35.spec.ts unsure; intake.spec.ts skip|PASS|
|AC-28-35-024|Не URL/логи|AppState/session + local repository|intake.spec.ts URL/history/requests; phases28-35.spec.ts logs/URLs|PASS|
|AC-28-35-025|UI language отдельно|AppState.locale / serviceLanguage|intake.spec.ts mid-step locale/back; profile.spec.ts|PASS|
|AC-28-35-026|S03 canonical summary|Review.tsx appliedInputSummary|intake.spec.ts complete SearchInput and seven dl pairs|PASS|
|AC-28-35-027|Preview тот же SearchService|Review.tsx/service.search|intake.spec.ts count equals catalog; phases28-35 draft apply|PASS|
|AC-28-35-028|Ошибка≠0|App repository states|p0-errors.spec.ts; phases28-35.spec.ts load failure/retry|PASS|
|AC-28-35-029|Edit сохраняет остальное|updateDraft + step state|intake.spec.ts edit budget/locale/back; phases28-35 invalid Back|PASS|
|AC-28-35-030|CTA atomic applied input|applyIntake|phases28-35.spec.ts draft/applied/reload; intake.spec.ts catalog count|PASS|
|AC-28-35-031|RU/KK templates/errors|messages/searchMessages|domain.test.ts key/placeholder parity; matching.test.ts reason templates; intake e2e KK|PASS|
|AC-28-35-032|Keyboard/mobile|controls/styles/route focus|intake/p0-keyboard/p0-reflow/phases28-35 e2e:360/390/430,200%,reduce|PASS|
|AC-28-35-033|Existing modules preserved|SearchService compatible DTO|profile/search/requests/p0 e2e + check:release|PASS|
|AC-28-35-034|Фактические статусы|QA_RESULTS + logs|docs/phases28-35/check.log, build.log, e2e.log, release.log|PASS|
|AC-28-35-035|Фаза36+ не объявлена|PHASES_28_35_HANDOFF|Документальный self-audit границ; не runtime-test|PASS|

---

Историческая матрица предыдущих фаз сохранена ниже.

# Қолдау.Жол — прослеживаемость требований

> Фаза 12 (07.11.2026): фактическое сопоставление реализации, P0-пути ru/kk, отрицательные случаи, исправления и версия проверки приведены в [QA_RESULTS.md](QA_RESULTS.md). Исторические D/A/G ниже не являются текущим вердиктом. A/B/C подтверждены в мобильном Chromium; полное закрытие P0 — NO-GO до обязательных ручных AT/zoom/device-проверок. NOT RUN не считается успешным результатом.

> Фаза 8: FR-012/S06 и FR-013 реализованы и проверены: выбор опубликованной услуги, синхронные условия/reasons/unknowns, четыре раздела паспорта с источниками, датами и ограничениями, нейтральные deep links, hidden/not found, RU/KK и keyboard. Точная пара specialist/offer передаётся в резюме `/request/:offerId`. Полное сохранение S08–S09 и полная приёмка S07 остаются отдельной работой. Доказательства — [PHASE_8.md](PHASE_8.md); таблицы фазы 0 ниже исторические.

> Фаза 7: S04–S05, поиск/нормализация, draft/apply/cancel/reset, карточки и причины, сортировки, отдельный incomplete, доступный диалог и возврат из профиля реализованы; доказательства — [PHASE_7.md](PHASE_7.md). Для FR-012/014 добавлен только необходимый каталогу просмотр выбранных услуг и сравнения, без заявления о завершении всех S06–S09. Исторические статусы таблиц фазы 0 ниже не переименованы в общую готовность P0.

> Обновление 07.11.2026: реализованы S01–S03; FR-001–004 и относящиеся к этому срезу RU/KK, keyboard, storage, null/budget и privacy проверки подтверждены в [PHASE_6.md](PHASE_6.md). Часть matching реализована как необходимая основа общего счётчика. Таблицы ниже сохранены как исторический план фазы 0, а не текущая оценка готовности всего P0.

Дата: 06.11.2026. Источник ID/AC/TEST — полное ТЗ SRC-A §19/21/22; локальные уточнения — [DECISIONS.md](DECISIONS.md), задачи W — [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md). Число в `TEST-xxx` — ссылка на запланированную проверку ТЗ, а не существующий файл теста.

Статусы: **D** — контракт/план документирован, реализация отсутствует, тест приложения не запускался; **A** — проверены только исходные материалы; **G** — внешняя проверка/решение ещё нужны. На конец фазы 0 ни один FR приложения не имеет статуса «реализовано/проверено». В колонке «Реализация» указано целевое место, оно пока не создано.

## Функциональный P0 из §21

| Требование ТЗ | Реализация (план) / задача | Наблюдаемый критерий приёмки | Проверка (план) | Статус |
|---|---|---|---|---|
| FR-001 locale | i18n + все S01–S09; W-03/W-10 | AC-001: все системные строки меняются ru/kk, доменное состояние/язык услуги прежние | TEST-001 mobile e2e + язык посередине пути | D; KK-редактура G |
| FR-002 два входа | S01→S02 или S04; W-03/W-04 | AC-002: прямой каталог без intake/аккаунта, нейтральные причины | TEST-002 e2e B | D |
| FR-003 анкета | intake/reducer; W-04 | AC-003: 4 шага, пропуск=null, Back хранит ответы, budget=0 не пропуск | TEST-003 integration | D |
| FR-004 review | S03/selectors; W-04 | AC-004: summary/preview/search используют одинаковый SearchInput | TEST-004 integration | D |
| FR-005 текстовый поиск | domain normalizer/search; W-05 | AC-005: имя/категория дают ожидаемые ID, KK-буквы не сливаются, query≤80 | TEST-005 unit; категория текущей offer | D |
| FR-006 фильтры | S05 draft/applied; W-05 | AC-006: Cancel/Escape не меняют выдачу, Apply атомарен; Reset только draft | TEST-006 integration | D |
| FR-007 hard tri-state | domain constraints; W-04 | AC-007: unknown не pass; fail не incomplete; строгие параметры не ослаблены | TEST-007 unit + T0-01 | D |
| FR-008 same-offer | domain→grouping; W-04/W-07 | AC-008: S12 O23/O24 не образуют дешёвый KK offline-вариант | TEST-008 negative unit | D; исходные данные A |
| FR-009 score/coverage | ranking/sorter; W-04 | AC-009: O01/O03/O02=100/85/82.5; coverage1/.85/1; denominator общий | TEST-009 unit; from coverage по ADR-0008 | D; арифметика A |
| FR-010 no-data | neutral search; W-04 | AC-010: A пусто → null/null, stable IDs, нет NaN/персонального обещания | TEST-010 unit | D |
| FR-011 explanations | domain reasons→i18n; W-04/W-06 | AC-011: LANGUAGE_MATCH невозможен без языка в текущей offer; источник виден | TEST-011 unit/integration | D |
| FR-012 профиль | S06 selected offer; W-06 | AC-012: selector одновременно меняет цену/reasons; unknown/404/hidden честны | TEST-012 integration | D |
| FR-013 trust passport | S06 VerificationFact; W-06 | AC-013: scope/date/source/limitation и synthetic marker; нет гарантии лечения | TEST-013 content/manual/e2e | D |
| FR-014 compare | compare пары + S07; W-07 | AC-014: четвёртый не меняет 3, один specialist один раз, 0/1 CTA понятен | TEST-014 integration/e2e | D |
| FR-015 demo request | S08/service/IndexedDB; W-03/W-08 | AC-015: успех после tx complete, нет real network side effect, acknowledge требуется | TEST-015 integration/e2e с abort | D |
| FR-016 idempotency | unique key + pending attempt; W-08 | AC-016: повтор key/uncertain outcome возвращает один id; checking до retry | TEST-016 storage integration, T0-07 | D |
| FR-017 cancel | S09/repository; W-08 | AC-017: cancelled_demo после commit переживает reload; failure сохраняет прежний status | TEST-017 e2e + cancel failure | D |
| FR-018 empty | S04/active conditions; W-05 | AC-018: C с hard1000 →0; только действие пользователя меняет бюджет | TEST-018 e2e C | D; исходный C рассчитан A |
| FR-019 reload/back | state + session snapshot/IDB; W-09 | AC-019: восстановление по FLOW; неизвестный request не создаётся; read-error отдельно | TEST-019 e2e + T0-04/08 | D |
| FR-020 reset | app-owned keys/requests; W-08/W-09 | AC-020: reset поиска отдельно от удаления requests; locale сохранён; чужой storage не затронут | TEST-020 integration | D |

## Безопасность, UX и дополнительные NFR из §21

| Требование | Реализация (план) / задача | Критерий приёмки | Проверка (план) | Статус |
|---|---|---|---|---|
| SEC-001 минимизация | S02/S08/DTO; W-03/W-08 | AC-021: нет имени/диагноза/телефона/файлов; request не содержит intake/query | TEST-021 schema/content/storage review | D |
| SEC-002 secrets | source/config/build; W-12 | AC-022: нет действующих ключей; внешние credentials не нужны | TEST-022 review | D |
| SEC-003 URL/logs | router/error handling; W-09/W-12 | AC-023: анкета/query/контакты не оказываются в history/referrer/analytics/logs | TEST-023 inspection | D |
| SEC-004 demo isolation | config/local adapter; W-03/W-12 | AC-024: URL не включает real send; нет messaging/tel/wa.me, demo не подменяет live outage | TEST-024 review/e2e + network inspection | D |
| UX-001 keyboard | UI/dialog/focus; W-05/W-10 | AC-025: весь путь без мыши, focus виден/возвращается, sticky не перекрывает | TEST-025 manual | D |
| UX-002 responsive | CSS/compare; W-07/W-10 | AC-026: 360/390/430 и reflow320 без потери control/KK текста/общего горизонтального scroll | TEST-026 manual; 200% zoom | D |
| UX-003 honest status | S08/S09/copy; W-03/W-08 | AC-027: локальное сохранение, нет обещания доставки/записи, отмена также локальна | TEST-027 content/e2e + родитель W-11 | D; исследование G |
| NFR-011 timestamps | clocks; W-02/W-08 | AC-028: matching воспроизводим по catalogClock; request/TTL по runtimeClock | TEST-028 unit + T0-02 | D |
| NFR-012 locale keys | typed dictionaries; W-10 | AC-029: ru/kk ключи и плейсхолдеры равны, нет raw keys/undefined | TEST-029 static/unit + content review | D |

## NFR-001…010 из §19 и продуктовая полнота

| Требование ТЗ | Целевая реализация / завершение | Проверка (план) | Статус |
|---|---|---|---|
| NFR-001 mobile first | W-10: основной путь на mobile/reflow/keyboard | TEST-026 + manual screen reader smoke | D |
| NFR-002 performance | W-12: измерить на описанной lab-конфигурации; LCP≤2.5s/INP≤200ms/CLS≤.1 — цели, не факты | Протокол lab; field p75 не заявлять без поля | D |
| NFR-003 filtering | W-04/W-12: для 30 offers целевой p95≤100ms после load | 100 varied queries, устройство/версия/performance.now | D |
| NFR-004 assets/bundle | W-10/W-12: local optimized assets; JS compressed≤250KB, first load≤700KB — ориентиры | Build report, размер/геометрия/лицензии | D |
| NFR-005 state | W-09: фильтры/scroll/locale-back не потеряны | TEST-019 + T0-04 | D |
| NFR-006 reliability | W-08: повтор/cancel/failure не лгут о status | TEST-015–017 | D |
| NFR-007 pure domain | W-04: React/storage/router не импортируются, UI не дублирует matching | Unit rules + import/code review | D |
| NFR-008 load errors | W-02/W-05: invalid fixtures не превращаются в empty success или unfiltered results | Invalid catalog integration | D |
| NFR-009 reduced motion | W-10: весь путь работает статично | Manual reduced-motion | D |
| NFR-010 reproducibility | W-12: lockfile, README, фактические install/build/start/check commands и ограничения | Чистая воспроизводимая установка в разрешённой фазе | D |
| §4/14: Қарлығаш | W-10: три статичных безопасных SVG, без логики/обещаний/помех CTA | Asset sanitization/provenance + visual/content review | D |
| §6/7: privacy/demo help | W-03/W-10: доступные /about-demo и /privacy, синтетичность в контексте действия | Manual/content ru/kk | D |
| §20: synthetic fixtures | W-02: 12/20 catalog-v1; no real phone/photo; demoClock маркирован | Schema/FK/synthetic review, test-only variants | A: базовый JSON; реализация D |
| §3/22: родительский тест | W-11: факт участия, протокол и перепроверка основного дефекта | Только реальное наблюдение с добровольным согласием | G; не проводился |
| §22/25: резерв | W-12/W-13: проверенный local build + запись настоящего демо с раскрытием формата | Rehearsal/reset; укладывается в 300 сек | D |
| §1/28: правила подготовки/передачи | ADR-0011/Q-01/Q-07; раскрытие материалов командой, права/лицензии | Ответ/актуальный оригинал; не подменять решением разработчика | G; 403 при повторной проверке |

## Локальные уточнения и их дополнительные проверки

| ID проверки | Уточнение / источник | Критерий | Задача / статус |
|---|---|---|---|
| T0-01 | Возраст/бюджет/unknown; MATCH | Включённые 35/36/71/72 и остальные границы; partial→unknown, free0≠unknown; from>B fail только при актуальности | W-04/W-09; план |
| T0-02 | Два времени, ADR-0006 | Один dataset даёт те же results при смене реальной даты; заявки имеют настоящее время, TTL7d не считает fixed demoClock | W-08/W-09; план |
| T0-03 | Online district, ADR-0005 | Offline hard — район применим; online hard/format any/soft — район не hard и не в A для всех offers, UI сообщает N/A | W-04/W-05; план |
| T0-04 | Session state, ADR-0007 | TTL2h/schemaVersion/catalogVersion/повреждение/denial; точная пара offer восстановлена или честное предупреждение; acknowledge сброшен | W-09; план |
| T0-05 | O10/coverage, ADR-0008 | Validator обнаруживает конфликт дат; после нормализации current from4500 не pass при B6000 hard; budget coverage=0; при B1000 fail | W-02/W-04; план; исходный конфликт найден |
| T0-06 | Цепочка выбора, FLOW | S04→S06→S07→S08 сохраняет пару; смена услуги явна; hard mismatch требует предупреждения по всем входам | W-06/W-07; план |
| T0-07 | Неопределённый commit, REQUEST | Reload читает тот же key, double submit не создаёт второй id; ошибка чтения не равна notfound; cancel failure сохраняет status | W-08/W-09; план |
| T0-08 | Publication/deep links, ADR-0004 | Hidden/withdrawn specialist или offer не доступны в search/profile/submit; устаревшие compare IDs маркируются недоступными | W-02/W-06/W-09; план |

Для будущего фактического прогона записывать: ID → commit/build/catalogVersion/rulesVersion → устройство/locale/условия → expected/actual → PASS/FAIL/BLOCKED → дефект → повторная проверка. Сейчас вместо вымышленных PASS оставлен статус плана. Аудит материалов AUD-01…AUD-07 приведён в PROJECT_STATE.

Граница покрытия: пользовательский P0 и доменные риски отражены выше; real live access/RLS/оплата/медицинские данные и P1/P2 не реализуются и не являются зависимостями P0. Подробная социальная оценка, полный pitch deck, фактический прототип и видео из расширенного мастер-промпта не созданы четырьмя документами фазы 0.

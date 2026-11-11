# 03 — PHASE-BY-PHASE VERIFICATION MATRIX (Stage 3)

Метод: `docs/PHASE_REGISTRY.json` (29 фаз с RECORDED-доказательствами, 39 с командной аттестацией, 68+69–78) сверён с фактическим кодом, тестами и независимыми прогонами этого аудита (147 unit + 104 E2E + живые пробы). Аттестация команды сохранена как заявленный статус; она не заменяет техническую проверку и не переведена в PASS автоматически.

## Сводная матрица

| Фаза | Заявленное содержание | Источник требований | Код/файлы | Тесты (текущие) | Независимая проверка аудита | Статус |
|---|---|---|---|---|---|---|
| 0 | Аудит и план | IMPLEMENTATION_PLAN.md | docs/ | — | Документы присутствуют; это планирование, не функция | VERIFIED_IMPLEMENTED (planning-only) |
| 1–5 | Неизвестно (нет требований в репо) | **отсутствуют** | — | — | Невозможно: требования не найдены ни в одном документе | TEAM_ATTESTED_EVIDENCE_PENDING (требования UNKNOWN) |
| 6 | S01 интейк | PHASE_6.md | `features/intake/Intake.tsx`, `session.ts` | session.test (9), domain.test, e2e intake.spec | PASS | VERIFIED_IMPLEMENTED |
| 7 | S04–S05 поиск и фильтры | PHASE_7.md | `features/search/*`, `domain/SearchService.ts` | search.test (9), e2e search.spec | PASS | VERIFIED_IMPLEMENTED |
| 8 | S06 профиль + trust passport | PHASE_8.md | `features/profile/*`, `domain/profile.ts` | profile.test (4), e2e profile.spec | PASS | VERIFIED_IMPLEMENTED |
| 9 | Неизвестно | **отсутствуют** | — | — | Невозможно | TEAM_ATTESTED_EVIDENCE_PENDING (UNKNOWN) |
| 10 | S08–S09 локальные демозапросы | PHASE_10.md | `domain/DemoRequestService.ts`, `data/IndexedDbRequestRepository.ts`, `features/request/*` | requests.test (16), e2e requests.spec, release.spec | PASS | VERIFIED_IMPLEMENTED |
| 11 | Неизвестно | **отсутствуют** | — | — | Невозможно | TEAM_ATTESTED_EVIDENCE_PENDING (UNKNOWN) |
| 12 | Частичный P0 QA + браузерные доказательства | README_PHASE12.md, QA_RESULTS | tests/e2e/*, docs/qa/* | p0-наборы | 79/79 + 18/18 повторены этим аудитом; полный ручной P0 (screen reader, zoom, физ. устройства) NOT RUN и в репо, и в аудите | IMPLEMENTED_WITH_LIMITATIONS |
| 13 | Синтетический локальный релиз | RELEASE_CHECKLIST.md | releases/phase13-…, scripts/serve-release.mjs | release.spec | 18/18 на текущей сборке; исторический ZIP не пересобирается | IMPLEMENTED_WITH_LIMITATIONS (историчность артефактов) |
| 14 | Материалы защиты | docs/phase14/README.md | docs/phase14/* (слайды/видео/скрипты) | — | Артефакты присутствуют; синтетические; не доказывают текущую сборку | VERIFIED_IMPLEMENTED (артефакт-фаза) |
| 15–27 | Неизвестно | **отсутствуют** | — | — | Невозможно | TEAM_ATTESTED_EVIDENCE_PENDING (UNKNOWN) |
| 28 | Offer-level matching (ядро) | PHASES_28_35_HANDOFF.md | `domain/matching.ts` | matching.test (44), p0.test (16) | PASS, включая same-offer isolation | VERIFIED_IMPLEMENTED |
| 29 | S02 (4 шага) | PHASES_28_35_HANDOFF.md | `features/intake/Intake.tsx` | e2e intake.spec | PASS | VERIFIED_IMPLEMENTED |
| 30 | S03 review+apply | PHASES_28_35_HANDOFF.md | `features/intake/Review.tsx`, `AppState.tsx` (intakeDraft/apply) | e2e intake.spec | PASS | VERIFIED_IMPLEMENTED |
| 31 | RU/KK причины из фактов | PHASES_28_35_HANDOFF.md | `matching.ts` localeKeys, `i18n/searchMessages` | domain.test placeholders | PASS | VERIFIED_IMPLEMENTED |
| 32 | Same-offer/grouping/уникальные counts | PHASES_28_35_HANDOFF.md | `SearchService.search` grouping | matching.test grouping | PASS | VERIFIED_IMPLEMENTED |
| 33 | Hard район + бюджетные ошибки | PHASES_28_35_HANDOFF.md | `contracts.ts` districtApplies, matching hardFields | p0.test budget/district | PASS | VERIFIED_IMPLEMENTED |
| 34 | Freshness policy v2 | PHASES_28_35_HANDOFF.md | `domain/freshness.ts` | matching.test TTL | PASS | VERIFIED_IMPLEMENTED |
| 35 | Публичный PWA shell | PHASES_28_35_HANDOFF.md | `public/sw.js`, `vite.config.ts` (shell-манифест) | offline e2e | PASS | VERIFIED_IMPLEMENTED |
| 36–54 | Неизвестно | **отсутствуют** | — | — | Невозможно | TEAM_ATTESTED_EVIDENCE_PENDING (UNKNOWN) |
| 55 | ResultMap + a11y-факты | HANDOVER_55_67 | `domain/map.ts`, `features/search/ResultMap.tsx` | offline.spec (2) | PASS (схема, списочная альтернатива, гео-отказ) | VERIFIED_IMPLEMENTED |
| 56 | Readiness register + mode guard | HANDOVER_55_67 | `server/http.ts` (testOnly), LIVE_READINESS.md | pilot.test gates | PASS (живые пробы exit 1) | VERIFIED_IMPLEMENTED |
| 57 | Synthetic onboarding анкеты | HANDOVER_55_67 | `server/contracts.ts` offer, `service.ts` application.* | pilot.test, pilot e2e | PASS | VERIFIED_IMPLEMENTED |
| 58 | Назначенная модерация | HANDOVER_55_67 | `service.ts` moderation.assign/decide | pilot.test | PASS | VERIFIED_IMPLEMENTED |
| 59 | Sandbox contact + идемпотентность | HANDOVER_55_67 | `service.ts` contact.create, operations | pilot.test idempotency | PASS (живые пробы replay/conflict) | VERIFIED_IMPLEMENTED |
| 60 | Жизненный цикл обращения/tracker | HANDOVER_55_67 | `service.ts` contact.* | pilot.test lifecycle | PASS | VERIFIED_IMPLEMENTED |
| 61 | Календарь (manual/confirmed) | HANDOVER_55_67 | `service.ts` calendar.*, `features/pilot/Calendar.tsx` | pilot.test calendar | PASS | VERIFIED_IMPLEMENTED |
| 62 | In-app напоминания | HANDOVER_55_67 | `service.ts` schedule/pump, jobs | pilot.test reminders | PASS; push/email/SMS отсутствуют (так и заявлено) | IMPLEMENTED_WITH_LIMITATIONS |
| 63 | Подписки на изменения | HANDOVER_55_67 | `service.ts` subscription.set/notifyChanges | pilot.test subscriptions | PASS | VERIFIED_IMPLEMENTED |
| 64 | Next organizational action | HANDOVER_55_67 | `service.ts` next, `features/pilot/NextAction.tsx` | pilot.test next | PASS | VERIFIED_IMPLEMENTED |
| 65 | Приватные цели/дневник | HANDOVER_55_67 | `service.ts` goal/diary, `PrivateRecords.tsx` | pilot.test privacy-блок | PASS; необходимость полей с родителем NOT RUN | IMPLEMENTED_WITH_LIMITATIONS |
| 66 | Назначения по scope | HANDOVER_55_67 | `service.ts` assignment.* | pilot.test assignments | PASS | VERIFIED_IMPLEMENTED |
| 67 | Выборочное резюме + локальный экспорт | HANDOVER_55_67 | `service.ts` summary.preview, `Summary.tsx` | pilot.test summary; e2e clipboard/download | PASS; отправки нет (по дизайну) | VERIFIED_IMPLEMENTED |
| 68 | Не начата | — | код отсутствует | — | Отсутствие кода подтверждено | NOT_IMPLEMENTED |
| 69–78 | Упоминаются как «предложения», не входят в реестр | — | кода/требований нет | — | — | NOT_IMPLEMENTED (нет требований) |

## Группировки (обязательные списки)

**Verified completed (независимо подтверждено этим аудитом):** 0 (planning), 6, 7, 8, 10, 14, 28, 29, 30, 31, 32, 33, 34, 35, 55, 56, 57, 58, 59, 60, 61, 63, 64, 66, 67 — 25 фаз.

**Implemented with limitations:** 12 (ручной P0 NOT RUN), 13 (исторический релиз), 62 (только in-app канал), 65 (дневник — поля не валидированы с пользователями) — 4 фазы.

**Team-attested, awaiting evidence:** 1–5, 9, 11, 15–27, 36–54 — 39 фаз (требования UNKNOWN, код/тесты не прослеживаются; аттестация 2026-11-11 сохранена).

**Missing implementation:** 68, 69–78 (68 — по реестру и подтверждённому отсутствию кода; 69–78 — вне реестра).

**Blocked by external conditions:** снятие LIVE_BLOCKED (не фаза, а условие 56/68+) — 19 пунктов LIVE_READINESS TO-VALIDATE.

## Проверка утверждений реестра этим аудитом

- «29 фаз с записанными доказательствами» — совпадает с подсчётом реестра и `npm run audit:phases`.
- «39 аттестованных» — список в `team_review_summary` валиден скриптом; политические границы (68 исключена) соблюдены.
- «Phase 68 не реализована» — grep по исходникам: нет признаков кода фазы 68 (новых модулей после 67 нет; diff `a52ff180..94fb45fc` — только docs).
- Реестр НЕ превращает аттестацию в RECORDED — подтверждено (`evidence_status` не изменён для 39 фаз).

# Передача ограниченного пилота 55–67

Основа: origin/phases-28-35 @ 6f9619f69233fb3f876fc01afc592e31ff098933, восстановлена в локальную work. Исходно checkout был unborn/пустой; origin HEAD — исторический phase-0-audit. Отдельных результатов 36–55 нет. Приложение не создавалось заново. На момент составления первоначального handover новые изменения были локальными. Обновление 11.11.2026: исходники и документация сохранены в GitHub, ветка `phases-0-67`, коммит `a52ff18085f45caa0e2cdaa1743438a133449be5`. Deploy/production-операции не выполнялись. Источники поручения сохранены в docs/sources/*55*67*.

Общий результат: **READY WITH LIMITATIONS для синтетического DEMO/PILOT_TEST; PILOT_LIVE BLOCKED / NO-GO**. UI, backend test и разрешённый запуск на реальных данных — разные статусы.

| Модуль | Go/no-go |
|---|---|
| CORE/PWA | READY WITH LIMITATIONS: Chromium, synthetic snapshots; real-device install NOT RUN |
| PILOT_TEST backend | READY WITH LIMITATIONS: локальный один процесс + SQLite, test identity |
| Onboarding/moderation | READY WITH LIMITATIONS: synthetic approval, real staff/consents BLOCKED |
| Contact/tracker | READY WITH LIMITATIONS: server + sandbox inbox; external delivery BLOCKED |
| Calendar/reminders | READY WITH LIMITATIONS: timed agenda + in-app; push/background отсутствует |
| Change subscriptions | READY WITH LIMITATIONS: allowlisted diff + in-app |
| Next action | READY WITH LIMITATIONS: организационный marker, без medical reward |
| Diary/assignments | READY WITH LIMITATIONS synthetic; human field validation и live privacy BLOCKED |
| Summary | READY WITH LIMITATIONS: preview/copy/download; sharing/send отсутствуют |
| PILOT_LIVE | BLOCKED / NO-GO по LIVE_READINESS |

| Фаза | Результат и граница |
|---|---|
| 55 | Один ResultMap на существующем SearchResult; те же matching offer IDs, синтетические sourced points, unknown accessibility, списочная альтернатива, отказ геолокации не блокирует район. Географическая схема без реальной подложки/маршрутов. Прежней карты не было; повторная не создана. |
| 56 | Readiness register, roles/threat model, SQLite schema, mode guard и отрицательные проверки. Реальные operator/legal/hosting/consent/support/backup основания не закрыты. LIVE_BLOCKED. |
| 57 | Анкета одной конкретной услуги, publication permission, полнота, draft/submit/rework/publish/withdraw; только allowlisted public DTO. Только вымышленные профили; real onboarding blocked. |
| 58 | Назначенный synthetic moderator, scopes/evidence/source/dates/limitation, stale/revoke, private complaints signal, audit. Нет реального исполнителя/SLA; complaint case management ограничен пересмотром анкеты. |
| 59 | Atomic server intake + durable sandbox inbox, owner/op/key idempotency, exact payload/consent, no local fallback. Реальные каналы/внешние receipts не подключены. |
| 60 | Допустимые server-side переходы, actor/source history, manual parent report отдельно, confirmation специалистом, cancel/revoke/delete отдельно. |
| 61 | Собственный timed agenda calendar, personal/confirmed source, source dedup, optimistic versions, zones/boundaries/overlap warning/cancel. Нет all-day/recurrence/OAuth. |
| 62 | Явный opt-in in-app reminder, offset, revision invalidation, durable SQLite jobs, dedup/disable/expired. Только работающий сервер + открытие приложения; нет push/email/гарантий фоновой доставки. |
| 63 | Opt-in по offer, allowlist old/new diff, timestamp no-op, dedup, withdraw/unsubscribe. Канал in-app, saved demo snapshot не обновляется автоматически. |
| 64 | Один следующий организационный шаг из реального test state; complete/defer/edit/hide/restore, без изменения записи/статусов и медицинской геймификации. |
| 65 | Приватные synthetic goals/diary CRUD, version/owner, safe text, delete scrubbing, audit без текста. Необходимость полей с родителем/специалистом NOT RUN; live diary blocked. |
| 66 | Только явно scoped author/recipient, versioned instruction/revisions/responses, unable/question, withdraw/revoke; нет full CRM или лечебной генерации. |
| 67 | Default empty selection, точный owner-checked preview, recipient, editable memory draft, clipboard/download с разными ошибками. Нет send/share links; внешние копии не отзываются. |

Новая поддержка CORE: production public PWA shell и явно saved synthetic snapshots /saved. PWA в основе отсутствовала; нынешняя проверка не объявляет пропущенные фазы завершёнными. Map не имеет стороннего provider: attribution/terms внешних tiles не требуются. Установка на реальные mobile OS и multi-version worker upgrade NOT RUN.

Запуск (Node ≥24.22): `npm ci`; терминал 1 `PILOT_MODE=PILOT_TEST npm run pilot`; терминал 2 `npm run dev`; открыть /pilot. Synthetic selectors только PARENT_A/B, SPECIALIST_A/B, MODERATOR, ADMIN. Guest public: /api/pilot/public. Нет credentials для внешних сервисов. Не вводить реальные семейные сведения. Демо CORE: /specialists; локальные requests /request/O*; сохранённые синтетические карточки /saved. Production static demo: `npm run build`, `npm start`; этот сервер не содержит private backend и возвращает JSON 503 для /api/.

Server endpoints: GET public/state; POST test-login/logout/commands. Параметры окружения: PILOT_MODE=PILOT_TEST, NODE_ENV (production запрещён), optional PILOT_DB_NAME — безопасное имя отдельной синтетической SQLite. .pilot-test gitignored; тестовый файл находится под private directory 0700. Для другого размещения/production потребуется отдельный проектный шаг, не секрет в чате.

Миграция 001 additive и идемпотентна. Проверены повторное применение, сохранение строки и FK в test temp DB. К production не применялась. Rollback: выключить pilot route/backend и оставить CORE; сохранить остановленную .pilot-test directory целиком, не DROP таблицы с данными. Backup snapshot restore на production NOT RUN. Безопасный reset синтетического стенда: остановить оба процесса, архивировать directory и создать новый тестовый стенд; реальные данные здесь не допускаются.

Переиспользовано: React/router/AppState, SearchService/evaluator, профиль/OfferCard, сравнение, IndexedDB demo requests, locale, palette/controls и QA scripts. Новое: server/{contracts,store,service,http,start}.ts и migrations/001; src/features/pilot; map.ts/ResultMap; public shell/saved cards; pilot/offline tests/configs; docs. Полный список — phases55-67/changed-files.txt. Соответствие AC001–072 — REQUIREMENTS_TRACEABILITY. Доказательства и команды — QA_RESULTS. Прежние demo slides/videos/ZIP остаются историческими, новую сборку не доказывают.

Входы будущей 68: доверенные server actor/owner/resource models, per-resource scopes и revoke, private versions/audit. Это только технические предпосылки; реальная identity, семейная модель представительства, приглашения/согласия/права ещё не спроектированы. Фаза 68 не начата.

Следующий допустимый шаг: независимый review synthetic пилота и закрытие конкретных live gates с назначением людей. Нельзя снять LIVE_BLOCKED одним флагом, импортировать реальные профили или отправлять настоящие сообщения на основании этого handover.

Автотест pilot создаёт отдельную test DB с именем e2e-UUID через PILOT_DB_NAME. Разрешены только безопасные basename символы; файл всегда под .pilot-test. Обычный npm run pilot использует pilot.sqlite. Browser-тесты не добавляют ресурсы в ручной тестовый стенд. После остановки ненужные e2e-*.sqlite/WAL/SHM можно удалить вручную.

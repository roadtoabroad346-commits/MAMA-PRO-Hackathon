# Доступ и модель данных — PILOT_TEST

Один Node 24 процесс + встроенный node:sqlite. Нет прежнего backend. Выбор: SQLite позволяет локально проверить транзакции, restart и ограничения без внешнего хранения. Managed Postgres потребовал бы выбора размещения, расходов и владельцев; для синтетического ограничения не выбран. Это решение не назначает production-инфраструктуру.

Единственный путь записи — POST /api/pilot/commands. Zod strict-discriminated union: server/contracts.ts. Владельцы/авторы/роли не принимаются в payload. HTTP-only SameSite=Strict cookie, серверная session 1 час, CSRF token, same-origin, no CORS, payload ≤16 KiB, create ≤30 операций/мин/actor. В development-прокси сохраняется Host; proxy headers не используются как доверенная identity. Только loopback. Test-login принимает только предзаданные synthetic IDs; NODE_ENV=production и любой режим кроме PILOT_TEST отвергаются до запуска сервера. Это не production-аутентификация.

| Роль | Доступ |
|---|---|
| Guest | GET public, только разрешённая projection |
| Parent | Собственные обращения/календарь/goal/diary/summary, собственные задания, opt-in |
| Specialist | Свои анкеты, обращения ему, задания только в явно seeded scope |
| Moderator | Очередь анкет, назначенные решения, complaints; не diary/calendar/contacts семьи |
| Admin | Audit metadata и отзыв scopes; не дневник семьи |

PARENT_A↔SPECIALIST_A и PARENT_B↔SPECIALIST_B — две явные synthetic связи. Отзыв scope перепроверяется на каждом задании/ответе и чтении специалистом. Он не удаляет собственную историю родителя. Роль и active флаг перечитываются с accounts при каждой операции. Нет механизма семейных приглашений.

Схема 001_pilot.sql: accounts(id PK, role enum, active); sessions(token PK, actor FK, csrf, expires); scopes(specialist,parent composite PK/FK,active); resources(id PK,kind,owner FK,author FK,recipient nullable FK,ref nullable resource FK,status,version>0,data valid JSON,created,updated); operations(actor/op/key composite unique, canonical payload SHA256, result id/version); jobs(ref/revision/channel unique,fire_at,status,attempts); inbox(source unique,owner FK,kind,ref,created); audit(actor,op,resource,version,at); schema_migrations(version PK).

JSON shapes: ApplicationData, ContactData, CalendarData, GoalData, DiaryData, AssignmentData в server/contracts.ts. Ссылки goal проверяются в транзакции по виду, владельцу, lifecycle. Calendar.ref — source request; resource.ref у requests/subscriptions/changes — application; ref FK сохраняет историю withdraw. Owner/kind/status, recipient/kind/status, ref/kind и job-due индексированы. Внутренние evidence, consent, контакты не сериализуются publicOffers().

Канонические операции синхронны внутри BEGIN IMMEDIATE; optimistic UPDATE ... WHERE version=?; уникальность jobs/idempotency/inbox дополняет авторизацию. Application.source и датированные facts публичны; приватное evidence/решение/согласие отделены проекцией. Audit не хранит свободный текст. Summary не хранится на сервере.

Threat cases: IDOR A→B, role/owner spoofing, self verification, moderator diary, stale write, scope revoke, JSON overposting, HTML injection, callback spoofing, duplicate jobs, same-key conflict, private cache. Проверки: tests/pilot.test.ts, pilot-e2e. Denied/not-existing private resources → одинаковый NOT_FOUND без чужих данных. 401 для отсутствующей/отозванной сессии; 403 для origin/CSRF.

Ограничения: SQLite не имеет RLS/шифрования, доступ к файлу БД означает административный доступ. Прямой доступ к файлу не даётся клиенту; все HTTP-операции проходят серверные проверки. Нет production secret management, TLS termination, реального role assignment, multi-instance, production failover. Нельзя просто заменить synthetic seeds реальными аккаунтами.

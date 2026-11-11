# 05 — BACKEND & DATABASE AUDIT (Stage 5)

Объект: `server/contracts.ts`, `server/http.ts`, `server/service.ts`, `server/store.ts`, `server/start.ts`, `server/migrations/001_pilot.sql`. Проверка чтением + 30 unit-тестов на реальном SQLite + живые HTTP-пробы.

## 1. Authentication

| Проверка | Реализация | Оценка |
|---|---|---|
| Создание сессии | `POST /api/pilot/test-login`: token 32 байта hex, csrf 24 байта, TTL 1 ч, cookie `HttpOnly; SameSite=Strict; Path=/api/pilot; Max-Age=3600` | PASS |
| Ротация | При логине удаляется предыдущая сессия этого cookie (препятствует накоплению) | PASS |
| Проверка на каждом запросе | `SELECT … WHERE token=? AND expires>?`; token валидируется regex 64-hex до SQL | PASS |
| Expiry-сравнение | Лексическое ISO-строк (оба в Z-формате) — корректно | PASS (edge: без секундной дроби одинаково) |
| Инвалидация | Logout: DELETE по токену + cookie Max-Age=0; сессия не переиспользуется | PASS |
| Re-resolution ролей | `run()` вызывает `this.actor(a.id)` заново на каждой операции — деактивация аккаунта или смена роли не обходится «устаревшей» сессией | PASS (unit «rechecks account active status») |
| CSRF | Требование `x-pilot-csrf` на все state-changing POST + SameSite=Strict + Origin/Sec-Fetch-Site проверки | PASS (живые пробы 403) |
| Bypass | Аноним → 401; подделка токена → 401; role-спуф → отклонение (400/404) | PASS (живые пробы) |
| Куки без `Secure` | Локальный HTTP test-сервер; `Secure` сломал бы loopback-HTTP | Отмечено как ограничение PILOT_TEST |
| Rate limit на login | Отсутствует | Приемлемо для loopback test-only; отмечено (FIX PLAN P3) |

## 2. Authorization (по ресурсам)

Модель: `resources(owner, author, recipient, ref, kind)` + scopes (specialist↔parent) + роли.

| Сценарий | Правило | Проверка |
|---|---|---|
| Parent A vs B | Все приватные ресурсы — `own()` (owner===actor); diary/goals B невидимы для A и наоборот | unit + live IDOR 404 |
| Specialist vs чужие анкеты | `application()`: owner или moderator; чужой specialist → NOT_FOUND | unit |
| Moderator vs Private Diary | Модератор **не имеет** доступа к diary/goals (только к заявкам: owner или moderator по `application()`) | live проба 404 |
| Moderator чужой заявки | decide требует `data.moderator===actor.id && owner!==actor.id` (нельзя самому себе) | unit |
| Admin | Только `scope.revoke` и просмотр audit; отдельной «админской» власти над ресурсами нет | code |
| Ownership assignments | owner=parent; доступ author-specialist при активном scope; respond — только parent | unit «denies… rejects mass assignment» |
| Export (summary.preview) | Только собственные kind'ы, exclude deleted, recipient — свободный текст, отправки нет | unit «exact selection excludes all unselected data» |
| Contact | owner-parent или recipient-specialist; respond только recipient | unit |
| Enumerate-защита | Ошибки авторизации возвращают 404 NOT_FOUND, не 403 — не подтверждают существование чужих ID | live пробы |

**Изменение ID в запросе не даёт доступа к чужим ресурсам** — подтверждено живыми пробами и отрицательными тестами.

## 3. Database (SQLite, node:sqlite)

| Аспект | Реализация | Оценка |
|---|---|---|
| Схема | `001_pilot.sql`: 8 таблиц, FK ON (в т.ч. recipient/ref на accounts/resources), CHECK (roles, version>0, json_valid, job channel), UNIQUE (inbox.source; jobs ref+revision+channel) | PASS |
| Миграции | Идемпотентная `CREATE IF NOT EXISTS` + `schema_migrations`; unit «migrates twice without losing records» | PASS |
| Транзакции | `BEGIN IMMEDIATE` → exec → COMMIT; catch → ROLLBACK. WAL + busy_timeout 5000 | PASS |
| Атомарность | Проверки-и-запись в одной транзакции; отклонённая операция не ставит job'ов (unit «transaction does not enqueue rejected request») | PASS |
| Оптимистичная блокировка | `UPDATE … WHERE id=? AND version=?`, `changes===1` иначе 409 VERSION_CONFLICT | PASS (live 409) |
| Конкурентные записи | WAL + BEGIN IMMEDIATE сериализует писателей; single-process loopback | PASS в рамках теста |
| Идемпотентность | `operations(actor,op,key)` PK; канонический хеш payload; replay без дубля; конфликт → 409 | PASS (live) |
| Целостность снапшотов | contact хранит snapshot условий на момент создания; «original offer snapshot survives price edit and withdraw» | PASS |
| Rollback-поведение | Отказ write не оставляет частичных изменений (unit abort-тесты) | PASS |
| Повреждённая БД | Не тестируется специально; `json_valid` CHECK защищает от битого data; поведение при недоступном файле не проверено — Remaining Unknown | NOT RUN |
| Backup/restore | Не реализовано; runbook — архивация каталога `.pilot-test`; production restore NOT RUN (задокументировано в HANDOVER) | Ограничение |

## 4. Командная модель (30 операций)

- Все входы через один zod `command` discriminatedUnion: строгие лимиты текстов (1000/300/2000), дата/время ISO, IANA-таймзона через Intl-refine.
- `checkedAt` в будущем отклоняется (400) — и у анкеты, и у решения модератора.
- Contact lifecycle — конечный автомат (allowed map); `next.set` не может изменить request или создать встречу (unit).
- Reminders: доставка перепроверяет ревизию/отмену/opt-in в одной транзакции; >24 ч опоздания → expired (unit).
- Change notices: публичный allowlist diff; уведомления только подписчикам; дедуп по `inbox.source` UNIQUE; косметические изменения без diff не спамят (unit).

## 5. Наблюдения (без критических находок)

1. **Sessions TTL — 1 ч** при длительной сессии пилота пользователь получит 401 и должен перелогиниться; UI это обрабатывает (auth → login screen). Низкий.
2. **Rate limit (30/мин) считается по audit-строкам**, включая некешированные операции — не-ключевая операция может косвенно израсходовать квоту ключевых. Низкий.
3. **audit хранит только метаданные** (actor, op, resource, version) — приватных текстов нет; delete scrubbing проверен тестом, включая idempotency-копии.
4. **jobs.attempts** инкрементируется, но бесконечных повторов нет (scheduled → конечный статус). ОК.
5. **Нет CORS-заголовков** — браузерные кросс-доменные чтения невозможны (по умолчанию); API для сторонних клиентов не предусмотрен. ОК для тест-стенда.

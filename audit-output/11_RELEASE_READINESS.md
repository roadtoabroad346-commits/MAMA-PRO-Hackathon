# 11 — RELEASE READINESS (Stage 11)

Оценка по режимам. Статусы: READY / READY WITH LIMITATIONS / NO-GO (BLOCKED).

## 1. Local demo (DEMO/CORE static)

| Измерение | Статус |
|---|---|
| Функциональная готовность | **READY** — 79/79 dev + 18/18 release E2E на этой сборке |
| Security | READY-with-limits — нет бэкенда; статика; секретов нет |
| Data readiness | READY — синтетический каталог v2, `isSynthetic` |
| Infrastructure | READY — `npm run build && npm start` (loopback, 405, /api→503) |
| Testing readiness | READY — 251 автопроверка зелёная |
| Privacy | READY — никаких внешних отправок; локальные данные с TTL |
| Operational | READY — runbook, reset-инструкция, ограничение Windows отмечено |
| Блокеры | нет (Windows не был «проверенной» ОС у команды — теперь проверен этим аудитом) |

## 2. Hackathon presentation

| Измерение | Статус |
|---|---|
| Функциональная | READY — сценарии A/B/C RU/KK воспроизводимы (DEMO_RUNBOOK) |
| Security | READY (локальный стенд, LIVE_BLOCKED) |
| Материалы | READY — слайды/видео фазы 14 сохранены как исторические; не выдаются за текущую сборку |
| Блокеры | Необходима явная формулировка «демо, все данные вымышлены» на презентации (уже встроена в UI) |

## 3. Internal synthetic pilot (PILOT_TEST)

| Измерение | Статус |
|---|---|
| Функциональная | **READY WITH LIMITATIONS** — 30 unit + 5 e2e на реальном backend; полный ручной проход ролей этого аудита — HTTP-пробы + e2e (не человеческий UAT) |
| Security | READY-with-limits — auth/CSRF/IDOR/версии проверены; нет rate-limit на login; cookie без Secure (loopback) |
| Data readiness | READY — только синтетические аккаунты; DB создаётся per-run |
| Infrastructure | READY-with-limits — один процесс Node, loopback; отсутствие CORS/HTTPS не мешает локальному использованию |
| Testing readiness | READY (автотесты) |
| Privacy | READY-with-limits — synthetic-only; retention-политика сервера PROPOSAL; diary-необходимость полей NOT RUN (интервью) |
| Operational | LIMIT — нет мониторинга/алертов (для внутреннего стенда допустимо) |
| Блокеры | Windows pilot-конфиги (POS-only) — обходится audit-конфигом; recommended: кросс-платформенные дефолты |

## 4. Limited real-user pilot (PILOT_LIVE)

**BLOCKED / NO-GO — по дизайну и по факту.** Гейт двойной и живой (exit 1). Для снятия требуются (из LIVE_READINESS, подтверждены отсутствием в репо): назначенный оператор, юридические основания РК, identity proofing, согласия, модератор с SLA, внешний канал доставки, backup/restore, поддержка, инцидент-план. Аудит не нашёл технических причин снимать блокировку; техническая база (авторизация, идемпотентность, песочница) — подготовлена и проверена на тестовом уровне.

## 5. Production platform

**NO-GO.** Дополнительно к §4: нет production hosting/CDN, миграций на production БД, Observability, SCA-процесса, load-тестов, инцидент-репетиций. Автоматический переход «работает демо → production-ready» невозможен и не заявляется.

## 6. Матрица готовности (сводно)

| Режим | Functional | Security | Data | Infra | Testing | Privacy | Ops | Блокеры |
|---|---|---|---|---|---|---|---|---|
| DEMO static | READY | READY* | READY | READY | READY | READY | READY | — |
| Hackathon demo | READY | READY | READY | READY | READY | READY | READY | — |
| PILOT_TEST | RL** | RL | READY | RL | READY | RL | RL | POS-конфиги; нет UAT человеком |
| PILOT_LIVE | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO | 19 пунктов LIVE_READINESS TO-VALIDATE |
| Production | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO | NO-GO | всё из §5 |

\* *в контексте локальной статики.* \*\* *READY WITH LIMITATIONS.*

# 06 — SECURITY & PRIVACY AUDIT (Stage 6)

Метод: чтение всех исходников + статические скрипт-сканы + живые HTTP-пробы (см. 09 §5) + отрицательные unit-тесты. OWASP Top-10 стиль. Секреты в отчёт не включаются (их и не найдено).

## 1. Оценка по категориям

| Категория | Статус | Обоснование |
|---|---|---|
| A01 Broken Access Control | **PASS** | Owner/recipient/role проверяются в каждой операции; IDOR-пробы → 404; деактивация аккаунта не обходится сессией; сравнение со 404 (не 403) против enumerate. |
| A02 Cryptographic Failures | **PASS** | Токены: `randomBytes(32)`; csrf `randomBytes(24)`; UUID v4 для ID. Паролей/ПИН нет (test accounts). Нет крипто-операций с данными. |
| A03 Injection | **PASS** | Все SQL — параметризованные prepared statements; JSON.parse только с zod-валидацией; нет eval/Function/new Function/document.write (скан чист). |
| A04 Insecure Design | **PASS** | LIVE-гейт в коде сервера (testOnly → Fault 503), старт-скрипт тоже; `PILOT_LIVE`/`NODE_ENV=production` физически не стартуют сервер (живая проверка exit 1). |
| A05 Security Misconfiguration | **PASS с оговорками** | Заголовки: nosniff, no-store, Vary: Cookie, Referrer-Policy: no-referrer. Нет CSP/HSTS — не применимо к JSON API локального стенда; static-сервер отдаёт только nosniff. Cookie без Secure (loopback HTTP). |
| A06 Vulnerable Components | **PASS (глубина ограничена)** | Зависимости: react 19.2, react-router 7.9, zod 4.1, vite 7.2, vitest 4.0, playwright 1.56+ — актуальные мажоры. `npm audit` не запускался (изолированность сети); явных CVE-паттернов в зафиксированных версиях не известно. Отмечено как ограничение. |
| A07 Auth Failures | **PASS** | Сессии с TTL, ротацией, re-resolution; CSRF; payload ≤16 КБ; login только same-origin JSON. Rate limit на login отсутствует — P3 (test-only стенд). |
| A08 Data Integrity | **PASS** | Оптимистичные версии (409), идемпотентность по каноническому хешу, CHECK-и FK, snapshot allowlist. |
| A09 Logging Failures | **PASS** | audit-таблица метаданных; тексты приватных записей не попадают в audit/idempotency (тест «delete scrub content including audit/idempotency copies»). |
| A10 SSRF | **PASS** | Сервер не делает исходящих запросов; единственный клиентский fetch — same-origin каталог. |
| XSS | **PASS** | React-эскейпинг; никакого dangerouslySetInnerHTML/innerHTML; pilot-тест вставляет `<img src=x onerror=alert(1)>` и проверяет, что img не появился. |
| Клиент↔сервер доверие | **PASS** | Роль/активность берутся из БД на каждой операции; CSRF из сессии; клиент не может поднять себе роль (жизненные пробы). |
| SW-кэш приватных данных | **PASS** | `sw.js` кэширует только публичный shell-манифест; `/api/*` и `/pilot` никогда не кэшируются (e2e offline-тест проверяет отсутствие таких URL в кэшах). |

## 2. Privacy

| Требование | Статус | Доказательство |
|---|---|---|
| Минимизация семейных данных | **PASS** | Анкета не собирает имя ребёнка/диагноз/контакты (strict zod отбрасывает лишние поля — тест «rejects… extra personal fields»); демозапрос — только неперсональный allowlist-снапшот. |
| Доступ к diary | **PASS** | Только владелец; модератор — нет (live 404); state не отдаёт чужих записей. |
| Consent-модели | **PASS (test-уровень)** | publicationConsent литерал `test-publication-v1`, contact consent `test-contact-v1` — версия фиксируется в данных. |
| Retention | **PASS (клиент)/PROPOSAL (сервер)** | Демозапросы 7 дней (удаление при открытии); сессия 2 ч; сводные карточки — до 20 вручную удаляемых; серверная retention-политика — PROPOSAL (LIVE_READINESS). |
| Deletion semantics | **PASS** | Diary/goal delete: status='deleted', data={} (scrub), включая копии в audit/idempotency (тест). Contact delete — только после cancel/closed. |
| Audit logs | **PASS** | Метаданные операций; без приватного текста. |
| Test/live разграничение | **PASS** | `isSynthetic: true` обязателен в каталоге/фактах; LIVE_BLOCKED гейт двойной; production-конфигурация отвергает test backend. |
| Удаление private records пользователем | **PASS** | UI: delete с подтверждением; clear всех демозапросов с подтверждением. |
| Приватное в публичном кэше | **PASS** | SW exclude; localStorage: только locale, сохранённые демокарточки (явно помеченные синтетическими) и nothing else. |
| Геолокация | **PASS** | Только явная кнопка проверки; координаты не сохраняются и не передаются (текст в UI; код не делает отправок). |

## 3. Находки

Критических/высоких находок нет. Полный реестр наблюдений — в `FINDINGS.json`; резюме:

| ID | Severity | Находка |
|---|---|---|
| SEC-1 | LOW | Cookie без `Secure` + отсутствие HSTS/CSP — допустимо для loopback test-стенда, недопустимо для любого внешнего размещения (уже покрыто LIVE-гейтом). |
| SEC-2 | LOW | Нет rate-limit на `/api/pilot/test-login` — brute-force не актуален (нет паролей), но сессии можно мусорить; ротация по cookie смягчает. |
| SEC-3 | LOW | Static release-сервер не отдаёт CSP/Referrer-Policy (только nosniff); SPA без внешних скриптов — риск минимальный. |
| SEC-4 | INFO | `npm audit`/SCA не выполнялись в этом аудите (сеть); зафиксированные версии — свежие мажоры. |
| SEC-5 | INFO | Session TTL 1 час → повторные логины; ошибки обрабатываются без раскрытия деталей. |

## 4. Ограничения аудита

- Не проводились: пентест реального хостинга (его нет), анализ бинарных releases-ZIP (исторические артефакты), SCA с сетевой базой CVE.
- Приватность оценена на уровне реализации + документированных границ (LIVE_READINESS). Правовая валидация (несовершеннолетние, закон РК) — вне технического аудита, отмечена TO-VALIDATE в docs.

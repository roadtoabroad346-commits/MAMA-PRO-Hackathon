# Фаза 10 — локальные демозапросы S08–S09

Дата: 07.11.2026. Ветка: `phase-10-demo-requests`; основа — `phase-8-profile` / `a04572a035fcfd1ab13c09e24880eaf7f5fd6b38`. В исходной рабочей копии не было коммитов/файлов; предыдущая реализация получена из существующей ветки origin. Ветки фазы 9 в origin не обнаружено; завершённость S07 не заявляется.

Объём определён прямым запросом пользователя. Вложения использованы как спецификация модели и поведения, а не как команда выполнять все фазы или публиковать продукт. Основание: ТЗ §§7.8–7.9, 12.1–12.3 и `DECISIONS.md` REQUEST / ADR-0006–0009.

## Реализация

- `/request/:offerId`: точная опубликованная услуга и её владелец, условия/цена/дата/языки/формат, демомаркировка и статичная «Демонстрационная семья». Единственное поле — checkbox понимания демо, default false; после reload/смены offer подтверждение не восстанавливается. CTA «Сохранить демозапрос».
- `DemoRequestService`: `draft / submitting / checking / recorded_demo / error / cancelled_demo`. В БД — только `recorded_demo / cancelled_demo`. Domain не импортирует React, router, browser storage или network.
- `IndexedDbRequestRepository`: DB `qoldau-demo-v1`, v1, store `requests`, keyPath `id`, unique index `idempotencyKey`. Schema mismatch/blocked/open error/abort возвращают ошибку. Нет успешного fallback в память.
- `add/put/clear.onsuccess` ещё не успех: Promise разрешается только на `transaction.oncomplete`. Abort после успешного запроса не превращается в успех UI.
- Первое подтверждённое действие закрепляет UUID-ключ за offer/specialist/catalogVersion. Versioned recovery intent сохраняется в sessionStorage **до** записи; при его отказе запись не начинается. Синхронная блокировка и уникальный индекс защищают двойное нажатие и конкурентные записи.
- Повтор/reload сначала читают тот же ключ. ConstraintError возвращает прежнюю запись. После deadline исход считается неопределённым: `checking` и чтение того же ключа, без слепого повторного add. Ошибка чтения не означает отсутствия записи и не разрешает новый ключ.
- Другое действие/услуга получает новый ключ только после успешной проверки прежнего исхода. Истёкшая попытка без записи требует нового явного нажатия; найденная запись возвращается и после TTL поисковой сессии.
- `/request-status/:requestId`: чтение из IndexedDB, ID, фактические createdAt/updatedAt, локальный статус и исторический снимок условий. Даты — RU/KK, `Asia/Qyzylorda`. Обязательные тексты: «Демозапрос сохранён на этом устройстве», «Специалисту ничего не отправлено», «Реальная запись не создана».
- Отмена после подтверждения изменяет существующую запись только после commit. Повтор cancelled терминален и не меняет timestamp. Ошибка оставляет последний подтверждённый статус с пояснением. Неизвестный/истёкший ID не вызывает вставку.
- Startup удаляет записи **старше 7 дней от createdAt по runtime clock**. Чтение/отмена также не используют истёкшие записи. Ровно 7 дней — ещё не старше срока. Отмена не продлевает TTL.
- Очистка на S09 и странице приватности требует отдельного подтверждения. Удаляет только `requests` и `qoldau.demo-request-attempt`; сохраняет locale, поиск и чужие storage/БД. Сообщение об удалении появляется после commit и удаления recovery intent. После неуспеха, включая потерянный исход очистки, S09 перечитывает данные и не оставляет устаревшее сообщение об успехе.
- RU/KK-сообщения, ошибки, клавиатура, подтверждения с возвратом фокуса, мобильный reflow и перенос длинных ID.

## Состав записи

Только `id, idempotencyKey, offerId, specialistId, status, createdAt, updatedAt, catalogVersion, nonPersonalOfferSnapshot`.

Snapshot: RU/KK название услуги, priceKind/priceAmountKzt/currency=KZT, unit, durationMinutes, languages, format, priceConfirmedAt. Поля выбираются явно, runtime-схема отклоняет дополнительные поля. Нет имён, телефона, диагноза, возраста, темы, пользовательского бюджета, query или свободного текста.

Recovery intent: schemaVersion, idempotencyKey, offerId, specialistId, catalogVersion, startedAt. Только технические сведения, отдельно от анкеты. Порог истечения — 2 часа, но ключ сначала проверяется и не отбрасывается при неизвестном результате.

## Фактические проверки

- `npm test`: **59 passed**, 5 файлов.
- `npm run build`: TypeScript strict и Vite проходят. Vite сообщает только предупреждения Rollup о комментариях стороннего zod, сборка успешна.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e -- --workers=2`: **51 passed**, включая 10 новых браузерных сценариев.

| Требование | Доказательство |
|---|---|
| Commit success / failure | Unit и Chromium: native add success → tx.abort; 0 записей, error, остаёмся S08 |
| Duplicate key | Два repository instance и конкурентные add возвращают одну запись; ID collision с другим ключом — ошибка |
| Double click | Два одновременных submit → 1 add; Chromium: два click в одном JS-цикле → 1 строка |
| Uncertain result | Unit: committed/absent/failed-read; Chromium: DB commits, completion теряется, UI ждёт, затем проверяет и возвращает 1 запись |
| Reload | S09 сохраняет ID/status; reload при lost outcome читает прежний ключ; после aborted add checkbox false, повтор с прежним ключом |
| Cancel success / failure | Native put success → abort оставляет recorded после reload; commit → cancelled после reload; повтор терминален |
| Missing / expired | Not found без вставки; startup удаляет expired; отказ чтения — отдельная ошибка |
| Cleanup | Native clear success → abort не даёт успеха; потерянный outcome вызывает перечитывание S09; commit удаляет requests+intent, сохраняет чужие local/session keys, поиск и чужую БД |
| Нет network send | В Chromium нет внешних и POST/PUT/PATCH/DELETE запросов на save/cancel/reload; в продукте только локальный адаптер |
| Локализация/доступность | Ключи/плейсхолдеры, KK клавиатурой, Escape/фокус, 320px/200% текста/landscape без горизонтальной прокрутки |

`fake-indexeddb` — только dev dependency для unit tests. Chromium использует настоящую IndexedDB. Сбои внедряются только тестами через native prototype; тестовых переключателей в продукте нет.

## Границы

Данные привязаны к origin и профилю браузера. Очистка/эвикция браузером может их удалить. При недоступном sessionStorage сохранение блокируется, чтобы не терять ключ повтора после reload. Нет реальных сообщений, броней, backend, внешних контактных ссылок или сетевой синхронизации. Редактура казахского носителем, ручная проверка screen reader, другие браузерные движки и пользовательское исследование не выполнялись. Развёртывание сайта не выполнялось.

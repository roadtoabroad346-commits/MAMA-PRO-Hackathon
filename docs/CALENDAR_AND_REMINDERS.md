# Календарь и напоминания

Event: owner/author, title, ISO start/end с offset, IANA zone, place, source manual|confirmed_request, status planned|confirmed|cancelled, source request ref, version/timestamps. Только одиночные события с временем; date-only/all-day/recurrence/OAuth/external calendar не включены. Date-only не преобразуется в UTC midnight: timing validator его отвергает. end>start, длительность ≤24h, валидная зона. Locale меняет формат отображения, не instant/zone. Agenda — семантический список, native labelled формы, без drag-only.

Manual create=planned. Confirmed event создаётся только при contact.confirm специалистом; внутри одной транзакции проверяется уникальный request source. Редактирование confirmed пользователем превращает его в личную planned revision, не сохраняет ложную независимую гарантию. version conflict→409. Пересечения — видимое предупреждение. Cancel не удаляет историю и инвалидирует scheduled jobs.

Выбран один канал **in-app inbox**. Не нужны Notification permission или внешние credentials. Явный opt-in по event, смещение 0…10080 минут; disable не затрагивает календарь. Jobs(ref,revision,channel) unique; event edit/set/cancel отменяет старые jobs. Pump каждые 1s при работающем loopback backend; всё состояние в SQLite. Перед выдачей повторно проверяет версию, opt-in, статус; >24h просрочка→expired. Результат in_app_available означает доступную строку, не прочтение/доставку устройству. Повтор исполнения не дублирует inbox. Выданную строку нельзя гарантированно «забрать назад», cancelled pending не выдаются.

| Платформа | Фактическая проверка | Возможность |
|---|---|---|
| Linux Chromium 156, mobile emulation | Browser + SQLite integration | При открытии/обновлении виден in-app inbox |
| Chrome/Firefox/Safari реальные устройства | NOT RUN | Не заявлено |
| Закрытое приложение / выключенный сервер | Поддержки нет | Нет push/email/фоновой доставки |
| Установленная PWA | Только shell/offline Chromium | Установка не делает background scheduler |
| Отказ OS Notification permission | Канал не запрашивает это permission | Календарь от разрешения не зависит |

Официальная внешняя provider/platform матрица и реальные устройства NOT RUN: выбран in-app, провайдер не подключён. Не подменять этот результат push-пилотом. Tests: calendar tests + browser scenario. Разбор таймзон и границ проверяется на ISO instants, не на timezone сервера.

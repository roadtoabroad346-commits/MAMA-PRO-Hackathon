# Локализация — 55–67

Существующие typed ru/kk словари сохранены. Новые system messages — src/features/pilot/messages.ts (paired keys), map/saved — локальные пары RU/KK. Статусы и ошибки безопасно отображаются через локализованные labels; неизвестный enum → «Неизвестно/Белгісіз», не translation key. User-authored text не переводится внешним API.

Locale не меняет actor/recipient/offer language/status/selected records/timezone/instants. Даты/числа в UI Intl; ISO хранится канонически; IANA zone видима. Поля ISO подписаны явно, не смешиваются с display date.

Технические browser checks: RU/KK preview, errors/reflow 320/360/390/430 и desktop, existing CORE suites. Редактура носителем, исследование родителя, реальный screen reader и physical device install NOT RUN. Казахские тексты — непроверенный редакторский черновик. Нельзя заявлять участие носителя.

# PWA и offline

В восстановленной основе 28–35 PWA не было. Добавлен минимальный public shell: manifest + SVG icon, production-only registration, build-generated app-shell.json и allowlist worker. Не заявляем приёмку отсутствующих фаз 36–54.

После успешного online install worker сохраняет index/assets (включая synthetic catalog), offline.html, icon/manifest. CORE может открываться offline после cache fill. Явно сохранённые демокарточки /saved используют отдельные snapshots; offline reload проверяется Chromium. Запросы /api/ вообще не перехватываются; /pilot offline navigation возвращает предупреждение, не UI с ложным success. Момент, дата сохранения и подтверждение цены различаются. Auto-sync приватных форм отсутствует.

Установка: браузерное меню «Установить приложение» / «Добавить на главный экран» только когда браузер предлагает. Установка на реальное Android/iOS, Safari, updates с уже работающим старым worker, storage eviction NOT RUN. Манифест и service worker не доказывают universal installability. Push/background notifications не подключены. Новая версия worker не форсирует reload текущих форм; активируется по стандартному lifecycle после ухода старых clients.

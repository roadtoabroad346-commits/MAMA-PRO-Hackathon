# Передача после фазы 13

Дата: 07.11.2026, Asia/Qyzylorda. Репозиторий:
https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.
Ветка результата: **phase-13-demo-release**.
Стабильная точка релиза: тег **demo-phase13-968e7ea9c5d3**.
Точный Git commit можно получить через `git rev-parse HEAD` после checkout этой точки.
Тег фиксирует Git-состояние передачи; build ID и его SHA-256 описывают проверенный dist.

## Начать здесь

1. [README](../README.md): команды, конфигурация, reset и ограничения.
2. [RELEASE_CHECKLIST](RELEASE_CHECKLIST.md): фактические проверки конкретной сборки.
3. [DEMO_RUNBOOK](DEMO_RUNBOOK.md) и [DEMO_SCENARIOS](DEMO_SCENARIOS.json): точные A/B/C.
4. [QA_RESULTS](QA_RESULTS.md): результаты фазы 12 и ручные NOT RUN.
5. [REQUIREMENTS_TRACEABILITY](REQUIREMENTS_TRACEABILITY.md), [DECISIONS](DECISIONS.md):
   требования/ADR; исторические статусы не заменяют текущие протоколы.

## Получить проект

Для нового checkout:

```sh
git clone --branch phase-13-demo-release https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.git
cd MAMA-PRO-Hackathon
git status --short
git rev-parse HEAD
npm ci
sha256sum -c docs/release/source.sha256
npm run build
sha256sum -c docs/release/build.sha256
npm run demo
```

Открыть http://127.0.0.1:5173/. Для точного зафиксированного состояния можно вместо
ветки checkout тег `demo-phase13-968e7ea9c5d3`, затем создать новую рабочую ветку
под отдельно поставленную задачу. Не продолжать разработку в detached HEAD.

Для существующего пустого/другого checkout:

```sh
git fetch origin refs/heads/phase-13-demo-release:refs/remotes/origin/phase-13-demo-release
git switch --track origin/phase-13-demo-release
```

Если локальная ветка уже существует, выполнить `git switch phase-13-demo-release`.
Сначала сохранить чужие незакоммиченные изменения; `reset --hard` не нужен.

## Готовый резерв без npm и интернета

Папка [releases/phase13-968e7ea9c5d3](../releases/phase13-968e7ea9c5d3/README.md)
содержит исходный проверенный ZIP, его SHA-256 и результат проверки распаковки.
Внутри ZIP уже есть `dist`, сервер на встроенных модулях Node, исходники, lockfile,
проверки, документация, протоколы и видео. `node_modules`, `.git`, `.env` и scratch-файлы
в архив не включены. Тестовые dependencies восстанавливаются через `npm ci`.
После распаковки из корня `qoldau-zhol-phase13`:

```sh
node scripts/serve-release.mjs
```

Архив — неизменённый снимок проверенной демонстрационной поставки до документирования
Git-сохранения. Актуальная инструкция продолжения — этот файл в репозитории.
Корневой `dist/` намеренно остаётся в `.gitignore`; готовые байты полностью сохранены в ZIP.

## Что уже сделано и проверено

- Основа продукта: `phase-12-qa`, **b9b806f4ab34c301af6357eb414988ae5fc2079f**.
  Фаза 13 не меняла `src/` и `package-lock.json`, продуктовых функций не добавляла.
- Production build **phase13-968e7ea9c5d3**; набор build SHA-256:
  `968e7ea9c5d3ba08153e8e15081df69bc82859a358c38b46304d4bfa69ace1d5`.
  [Manifest](release/manifest.json) и [хеши](release/build.sha256) сохранены.
- TypeScript, **76/76 unit/integration**, **18/18 production browser tests**.
  Последние относятся к `dist` на Node static server, а не к dev server.
- A/B/C RU/KK, прямые profile/compare/request-status, неизвестный маршрут, reload,
  локальные assets, сохранение/отмена/очистка IndexedDB и чистый старт.
- Локальный резерв проверен без `src`, `package.json`, `node_modules`;
  ZIP повторно распакован, хеши и запуск извлечённого комплекта проверены.
- Реальные короткие автоматические записи A:
  [RU](release/video/demo-A-ru.webm), [KK](release/video/demo-A-kk.webm),
  проверены ffprobe и полным ffmpeg decode. Нет вымышленных видеофайлов.
- Известные сигнатуры секретов не найдены; внешние ключи для P0 не нужны.
  Сайт не развёрнут, облачные ресурсы не создавались.

Не перезаписывать исходные протоколы для удобства нового checkout.
`node scripts/audit-release.mjs` создаёт новые manifest/hash files с текущим HEAD;
для read-only сверки сохранённого состояния достаточно `sha256sum -c`.
После изменения продукта или build-конфигурации результаты старого релиза не переносить
автоматически: создать новый набор доказательств и явно назвать проверенную сборку.

## Ограничения, которые нельзя потерять

- **NOT RUN**: screen reader, настоящий browser zoom, физическая клавиатура/safe-area
  телефона, участие родителя и редактура KK носителем. Не заменять их автоматическими PASS.
- Проверена Linux/Chromium-конфигурация; Safari/WebKit/Firefox/Windows и реальные устройства
  не подтверждены. Minor: вертикальный compare, одна поза маскота, формат некоторых KK-дат.
- Каталог **catalog-v1**, правила **rules-v1**, demoClock
  **2026-11-14T12:00:00+05:00** фиксированы; 12 вымышленных специалистов / 20 услуг.
  UUID и реальные timestamps/TTL демозапросов остаются runtime-значениями.
- Нет реальной отправки, записи на занятие, backend, авторизации, внешних AI/API/аналитики.
  Данные семей вводить нельзя. Requests локальны для origin/профиля, compare — в памяти вкладки.
- Полная приёмка P0 и live — **NO-GO**; ограниченное локальное демо подтверждено.
- Hosted URL отсутствует. Публикация сайта и создание облачных ресурсов требуют отдельного
  текущего поручения. Push исходников не является разрешением на deployment.

## Граница следующей работы

Текущая команда поручает сохранение и передачу результата, а не начало новой продуктовой фазы.
Следующую фазу начинать по её отдельному заданию: сначала сверить scope с этим handoff,
переиспользовать текущую реализацию и сохранить действующие ограничения.
Доступные проверки: `npm run check`, `npm run build`,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:release -- --workers=2`.
Перед production browser tests остановить ручной сервер на 5173.
Не повторять уже подтверждённые большие прогоны без изменения продукта, дефекта или новой цели проверки.

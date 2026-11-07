# Сохранённый демонстрационный релиз

Build ID: **phase13-968e7ea9c5d3**. Git-ветка: `phase-13-demo-release`.
Тег сохранения: `demo-phase13-968e7ea9c5d3`.
Продолжение работы: [NEXT_PHASE_HANDOFF](../../docs/NEXT_PHASE_HANDOFF.md).

Файлы:

- [qoldau-zhol-phase13.zip](qoldau-zhol-phase13.zip): полный исходный проверенный комплект,
  включая production `dist`, исходники, lockfile, проверки, документы, логи и RU/KK-видео.
- [SHA256SUMS](SHA256SUMS): SHA-256 ZIP.
- [OUTPUT_VALIDATION.json](OUTPUT_VALIDATION.json): проверка целостности ZIP,
  извлечённых package/source/build hashes и запуск извлечённого приложения.

Это неизменённый ZIP, подготовленный и проверенный в фазе 13 до документирования
Git-сохранения. Его внутренние README/протоколы описывают тот момент; актуальные сведения
о сохранении и следующем старте находятся в handoff репозитория.

Проверка на Linux из этой папки:

```sh
sha256sum -c SHA256SUMS
```

Распаковать ZIP, перейти в `qoldau-zhol-phase13`, затем:

```sh
node scripts/serve-release.mjs
```

Открыть http://127.0.0.1:5173/. Установка npm-пакетов для готового dist не требуется.
Сервер использует только встроенные модули Node. `node_modules`, `.git`, `.env` и
промежуточные файлы в архив не включены. Для разработки пользоваться checkout репозитория.
Публикация сайта и создание облачных ресурсов не выполнялись.

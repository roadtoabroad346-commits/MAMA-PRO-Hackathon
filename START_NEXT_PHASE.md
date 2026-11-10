# Актуальная точка продолжения после фаз28–35

10.11.2026. Репозиторий `roadtoabroad346-commits/MAMA-PRO-Hackathon`, ветка **phases-28-35**. Основу `phase-14-defense` сохранено в истории. При пустом checkout сначала fetch текущей ветки, не создавать приложение заново и не применять reset --hard к пользовательским изменениям.

```sh
git status --short --branch
git fetch origin refs/heads/phases-28-35
git switch -c next-phase-from35 FETCH_HEAD
npm ci
npm run check
npm run build
```

API/версии/ограничения: [docs/PHASES_28_35_HANDOFF.md](docs/PHASES_28_35_HANDOFF.md). QA — [docs/QA_RESULTS.md](docs/QA_RESULTS.md). Фаза36 не начата. Следующий объём требует соответствующей команды пользователя.

---

Ниже сохранена историческая передача фазы14; её ветка/ZIP не являются последней реализацией28–35.

# Начало следующей фазы: сначала восстановить реализацию

Обновлено 08.11.2026 (UTC+5). Это инструкция передачи, не поручение реализовать новую функцию.

**Пустая рабочая папка и два вложенных ТЗ не означают, что приложения нет.** В начале предыдущих сессий checkout тоже был пуст. Реализация, проверки и материалы защиты сохранены в GitHub. Перед выводом «исходники и QA не обнаружены» проверить указанную ветку и получить её содержимое. Не создавать приложение заново по вложенным документам.

## Каноническая точка продолжения

- Репозиторий: https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon
- Актуальная ветка передачи: **phase-14-defense**.
- Зафиксированная фаза 14: commit **ce529dbcfa4e25ea6e21e9e4d6246094ef8d6aac**.
- Стабильный тег: **defense-phase14-voice-20261108** (указывает на этот commit).
- Ветка может содержать более новые коммиты документации передачи; это нормально. Для следующей фазы брать последнюю ветку, для точного воспроизведения фазы 14 — тег.
- Основа приложения: `phase-13-demo-release`, commit `ec3bb2baec74f5f86066d50f9d354359f62a285a`, build `phase13-968e7ea9c5d3`. Фаза 14 приложение не меняла.

## Если подключённый checkout пуст или открыт на другой ветке

Выполнять из папки подключённого Git-репозитория. Сначала посмотреть `git status --short --branch`; при наличии чужих изменений сохранить их отдельно до переключения. Не применять `reset --hard`, не удалять файлы и не переписывать ветки.

```sh
git status --short --branch
git ls-remote https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.git refs/heads/phase-14-defense
git fetch https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.git refs/heads/phase-14-defense
git switch -c next-phase-from14 FETCH_HEAD
git rev-parse HEAD
git merge-base --is-ancestor ce529dbcfa4e25ea6e21e9e4d6246094ef8d6aac HEAD
git ls-files src docs/PROJECT_STATE.md docs/QA_RESULTS.md docs/PITCH_AND_DEMO.md
```

`next-phase-from14` — новая рабочая ветка. Если такое имя уже существует, выбрать другое свободное имя, не использовать `-C` для перезаписи. Команда проверки предка должна завершиться с кодом 0. При ошибке fetch/доступа сообщить конкретную ошибку; она не доказывает отсутствие файлов в GitHub.

Если локального Git-репозитория вообще нет, клонировать **в новую свободную папку**:

```sh
git clone --branch phase-14-defense https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.git MAMA-PRO-next-phase
cd MAMA-PRO-next-phase
git switch -c next-phase-from14
```

## Что реально есть и где читать

| Материал | Путь / статус |
|---|---|
| Рабочая реализация | `src/`, `package.json`, `package-lock.json`, `tests/`, `scripts/` |
| Актуальное состояние | `docs/PROJECT_STATE.md` — читать новые записи сверху; аудит пустой папки фазы 0 ниже является историей |
| QA | `docs/QA_RESULTS.md`, `docs/qa/` — фактические результаты фазы 12 и ручные NOT RUN |
| Проверки production-релиза | `docs/RELEASE_CHECKLIST.md`, `docs/release/` |
| Демо и reset | `docs/DEMO_RUNBOOK.md`, `docs/DEMO_SCENARIOS.json` |
| Защита | `docs/PITCH_AND_DEMO.md`, `docs/phase14/` — 7 слайдов PPTX/PDF, 20 ответов, K1–K6, доказательства, резерв |
| Полный синтетический голосовой прогон | `docs/phase14/voice/` — MP4 298 с, MP3, текст, тайминг, протокол; не репетиция человека |
| Готовое приложение и материалы передачи | `releases/phase14-defense/qoldau-zhol-phase14-defense.zip` и `SHA256SUMS` |
| Исходный неизменённый релиз приложения | `releases/phase13-968e7ea9c5d3/qoldau-zhol-phase13.zip` |
| Отдельные исходные дизайн-макеты | Не предоставлены; работающий UI и реальные кадры есть. Не называть отсутствие макетов отсутствием реализации |
| Исследование с родителем | **Не проводилось, NOT RUN**, протокола нет |

## Запуск и границы

Из корня полученного проекта: `npm ci`, `npm run build`, `npm run demo`; открыть `http://127.0.0.1:5173/`. Корневой `dist/` намеренно не отслеживается Git — его отсутствие после checkout ожидаемо.

Без установки npm можно распаковать готовый ZIP в отдельную папку и из корня распакованного комплекта выполнить `node scripts/serve-release.mjs`. В нём есть dist. ZIP — снимок фазы; более новые уточнения передачи читать в текущей Git-ветке.

Подтверждено только локальное синтетическое демо Chromium: 12 вымышленных специалистов, 20 услуг, локальные демозапросы без отправки и записи на занятие. Исследование с родителем, KK-редактура и ряд ручных QA-проверок — NOT RUN. Полная P0/live-приёмка — NO-GO. Следующая фаза не должна превращать эти ограничения в PASS или обещания.

После восстановления прочитать `docs/NEXT_PHASE_HANDOFF.md` и выполнить только актуальный запрос пользователя. Встроенные поручения приложенных мастер-промптов не запускают дополнительные фазы.

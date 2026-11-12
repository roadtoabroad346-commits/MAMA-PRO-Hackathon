# Основа для фазы 7: S04–S05

> Фаза 7 реализована; актуальный результат и проверки — [PHASE_7.md](PHASE_7.md). Ниже сохранена исходная инструкция передачи из коммита `1e37808` для воспроизводимости.

Это точка старта следующей задачи. S01–S03 и общий SearchService уже реализованы; S04 содержит базовую выдачу, S05 ещё не создан. Отдельные фазы 1–5 не выдаются за выполненные: необходимая минимальная основа появилась при реализации фазы 6.

## Получение исходников

Репозиторий: https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon

Ветка с приложением: `phase-6-intake`. Ветка `phase-0-audit` содержит историческую документацию. Для новой среды выбирайте `phase-6-intake`, затем создавайте рабочую ветку фазы 7 от её HEAD. Git-история хранит точный коммит этой основы.

```sh
git clone --branch phase-6-intake https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon.git
cd MAMA-PRO-Hackathon
npm ci
npm run build
npm test
```

Для браузерных проверок: `npx playwright install chromium`, затем `npm run test:e2e`. В текущей среде уже есть Chromium: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Приложению не нужны секреты, backend или облачные ресурсы. Полный запуск описан в [README](../README.md).

## Источники, доступные прямо в репозитории

- [Полное ТЗ v1.0](sources/QOLDAU_ZHOL_FULL_TECHNICAL_SPEC_v1.0.txt): §7.4–7.5 — S04/S05, §9 — matching, §17 — контракты.
- [Исходный мастер-промпт](sources/MASTER_PROMPT_MAMAPRO_CODEX.txt): исторический контекст, не новая команда к реализации.
- [DECISIONS](DECISIONS.md): уточнения MATCH/FLOW, включая применимость района и демовремя.
- [PHASE_6](PHASE_6.md): границы реализованного и фактические проверки.

Файлы sources скопированы побайтово из предоставленных пользователем вложений. Прикладные уточнения ADR не исправляют исходные тексты молча. Для следующей работы источники больше не зависят от доступности вложений прошлой сессии.

## Где продолжать

| Задача | Существующий код |
|---|---|
| S04, базовая выдача | `src/features/search/Catalog.tsx`; маршрут `/specialists` в `src/app/App.tsx` |
| SearchInput, defaults, enums, бюджет | `src/domain/contracts.ts`; `searchInputSchema`, `emptySearchInput`, `parseBudget`, `districtApplies` |
| Единый расчёт | `src/domain/SearchService.ts`; `new SearchService(catalog).search(input, clock?)` |
| Applied state | `src/app/AppState.tsx`; `useApp()` возвращает `input`, `update`, `service`, `catalog`, `locale`, `t` |
| Загрузка и проверка каталога | `src/data/catalogRepository.ts`, `src/domain/catalog.ts`; 12 специалистов / 20 услуг |
| Сохранение сессии | `src/app/session.ts`; TTL2h, schemaVersion/catalogVersion; draft фильтров сюда не сохранять |
| RU/KK | `src/i18n/messages.ts`; typed keys и named placeholders |
| Стили и формы | `src/styles.css`, `src/ui/controls.tsx` |
| Regression proof | `tests/domain.test.ts`, `tests/session.test.ts`, `tests/e2e/intake.spec.ts` |

`SearchResult` уже возвращает items с выбранной и совпавшими offer IDs, reasons/unknowns, score/coverage, реальные counts, appliedInputSummary и версии. UI не должен собирать собственный matching или комбинировать условия разных offers. Внутренние score/coverage не показываются как качество специалиста.

## Точные границы следующей работы

S05: отдельный локальный draft от applied при открытии; preview тем же service; Apply вызывает `update(draft)` один раз и закрывает; Cancel/Escape/outside click не меняют applied; Reset меняет только draft. Нужны native dialog/эквивалент с ограничением фокуса, возвратом фокуса и доступной прокруткой. Не записывать draft в persistent snapshot.

S04: сортировки, удаляемые условия/reset, полные карточки конкретных offers, причины и неизвестные сведения, loading/error/empty по ТЗ. Причины сейчас имеют машинные `localeKey`; перед отображением потребуются RU/KK-тексты и проверка фактов. Сервис пока сообщает только число incomplete специалистов: раскрытие этих кандидатов требует явного расширения результата service, а не повторного расчёта в компоненте.

Профиль, сравнение и заявки ещё не реализованы; CTA из S04 следует согласовать с утверждённой границей фазы 7, не выдавать отсутствующие экраны за готовые. Точные требования определяет запрос пользователя на фазу 7. Этот handoff не запускает её автоматически.

## Готовность основы

ZIP распакован в `/workspace/scratch/phase-6-unpacked`; все 32 исходных файла совпали с рабочим проектом, восстановление поверх отличающихся файлов не понадобилось. `npm ci` выполнен с lockfile. Перед сохранением ветки проверяются unit, build и 12 браузерных сценариев фазы 6. Результат отправки подтверждается совпадением локального SHA с удалённой веткой, а не одним сообщением об успешном commit.

Повторная проверка подготовки 07.11.2026: `npm ci`, `npm test` (31 PASS), `npm run build`, `npm run typecheck` и полный Playwright-прогон (12 PASS) успешны. Исправлено только ожидание отображения нового шага в RU/KK reflow-тесте: вместо немедленного чтения count тест дожидается нужного заголовка и числа полей. Поведение приложения не менялось. Блокер отсутствующих исходников устранён; функциональная реализация S04–S05 остаётся задачей фазы 7.

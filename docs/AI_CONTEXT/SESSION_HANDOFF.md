# Передача следующей сессии

**LIVE_BLOCKED сохраняется; реальные пользователи/отправки/production не разрешены.**

## Текущая точка

- Ветка: `feature/context-init-2026-11-13`.
- Приложение/проверяемый baseline: `7f8434a4cfd097b531fa584f5b97ebd1e772ad92` (default `phase-0-audit`). В этой задаче runtime не изменён.
- Проверенный документационный checkpoint: **b0b4115b694ec8271ead0f90a1d4c7742327145f**. Push успешен; remote SHA==local SHA фактически прочитан в 2026-11-13T16:44:49.420189+00:00. [GitHub commit](https://github.com/roadtoabroad346-commits/MAMA-PRO-Hackathon/commit/b0b4115b694ec8271ead0f90a1d4c7742327145f). Эта запись — отдельный следующий docs commit; SHA выше относится к уже проверенному checkpoint на момент записи, не выдаётся за self hash текущего handoff.
- Точное состояние HEAD/remote вычислять командами ниже; commit SHA нельзя встраивать в собственное содержимое без изменения hash.
- Разрешено и выполнено: восстановление доступного контекста, 231 feature record, 25 EXP cards, source/code/test links, 335-file inventory, baseline QA, AGENTS recovery protocol. Продуктовые фичи не добавлены.
- Активные продуктовые задачи: отсутствуют. Initialization доступных материалов завершена; source/human gaps сохранены. Финальная запись синхронизации проверяется отдельным docs push и внешним receipt, команды ниже показывают актуальный HEAD/remote.

## Что работает и как воспроизвести

Node24.22.1, npm11.9.0, Chromium156.0.8078.79. Из root: `npm ci`, `npm run check`, `npm run build`. CORE `npm run dev`; отдельный synthetic backend `PILOT_MODE=PILOT_TEST npm run pilot`, страница `/pilot`.

Current baseline: 154unit/integration +79dev +18release +5pilot +2offline =258PASS; failed0/skipped0. Typecheck/build/historical registry PASS; npm audit0. Команды/границы/хеши логов: [VALIDATION](VALIDATION.md).

## Восстановление Git

```sh
git status --short --branch
git log -5 --oneline
git rev-parse HEAD
git ls-remote --symref origin HEAD
git ls-remote origin refs/heads/feature/context-init-2026-11-13
```

Если нужно продолжить существующую ветку в новом checkout, сначала fetch/inspect remote, затем checkout подходящего ref, сохраняя любые local changes. Не reset/clean/stash чужое. Открытые PR №1 и draft №2 имеют heads, уже входящие в baseline; не merge их ради восстановления.

## Контекст и ограничения

Начать с [AGENTS](../../AGENTS.md), [master](PROJECT_MASTER_CONTEXT.md), [phase map](PHASE_PROGRESS.md). Полные feature records в JSON; поля `phase_ref` разрешаются в EXP registry, пути относительно корня repo. Старый docs/PHASE_REGISTRY.json — только история0–68; не заменять новым.

**Source intake 13.11.2026:** Research DOCX получен из загруженного ZIP и сохранён в ChatGPT Library, полное текстовое/табличное извлечение [Research](sources/00_REFERENCE_RESEARCH.md), исходный [CSV](sources/FEATURE_REGISTRY_000-230.csv), [STAGE_MAP](sources/STAGE_MAP.json), [README](sources/README_START_HERE.md) и SHA256 manifest добавлены в ветку. 231 ID и 25 EXP стадий структурно проверены; статусы реализации остаются прежними. 39 исторических фаз TEAM_ATTESTED, independent delivery evidence UNKNOWN. Интервью родителя PENDING, native KK/real AT/device acceptance NOT_RUN. LIVE_BLOCKED не изменён. Полный список: [OPEN_QUESTIONS](OPEN_QUESTIONS.md).

F065: CORE район без полного address/venue. F104: audit metadata, без полноценного moderator case-history UI. F119: overlap warning, без server slot lock. F135/137/149/150/206/210 имеют только перечисленные foundations. Не пересоздавать имеющиеся audit fixes, Bird3 poses, gradients/icons, radio sort/district, budget chips, subgrid compare и Intl dates.

## Точный следующий шаг

**STOP после initialization. EXP-01 и далее требуют нового прямого указания владельца.** Исходный [context prompt](sources/00_CONTEXT_INITIALIZATION_REQUEST.md), раздел12: «Do not begin implementation of EXP-01 or later until I explicitly instruct you to continue.» Это ограничение scope, а не запрос дополнительного разрешения для завершения текущей документации.

Рекомендация для будущего продуктового поручения: EXP-11, deterministic Trust Gap F136. Переиспользовать TrustPassport/OfferEvaluation.unknowns/freshness; неизвестный факт→вопрос+source state; без LLM. Перед этим сверить новый Research и первичные источники, текущий remote и baseline regressions.

Предлагаемые slice AC: (1) вопросы только о missing/stale facts конкретного offer; (2) known current факт не порождает ложный пробел; (3) source/date/scope видны; (4) RU/KK и keyboard/320px; (5) нет clinical recommendations/автоматического hard relaxation; (6) deny/error/offline сохраняют deterministic fallback. Tests: pure table rules + focused E2E; stop после этих AC и checkpoint. Это предложение, код не создан.

После любой будущей задачи обновить feature/phase status, decisions, тестовый evidence и handoff; stage exact files; commit; push authorized branch; read remote SHA. При отказе сохранить local SHA/patch и PUSH_BLOCKED, не писать success.

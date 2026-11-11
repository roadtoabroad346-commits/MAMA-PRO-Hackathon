# 02 — GIT FORENSICS (Stage 2)

Источники: свежий клон `origin` (только чтение), GitHub API (branches, commits, PRs) на 2026-11-11. Рабочий снимок = байт-идентичен `origin/completion-audit-2026-11-11` (см. 00_ENVIRONMENT_REPORT).

## 1. Линейная история (проверено `git log` всех веток)

```
97541389  completion-audit-2026-11-11  docs: record team-reported review of 39 previously unverified phases   (2026-11-11T13:44:28Z)
d125648f  completion-audit-2026-11-11  chore: add evidence-based phase registry, completion gates and CI      (13:37:12)
94fb45fc  phases-0-67 (HEAD)           docs: confirm GitHub sync of phases 0-67 and correct handoff           (13:29:16)
a52ff180  phases-0-67                  feat(pilot): add guarded synthetic workflows                            (01:48:00)
6f9619f6  phases-28-35 (PR #1 head)    feat: complete phases 28-35 matching and intake flow                    (2026-11-10)
b1f79f3d  phase-14-defense (HEAD)      docs: add explicit bootstrap for next phase                             (2026-11-08)
ce529dbc  phase-14-defense             docs: complete phase 14 defense and voiced rehearsal
ec3bb2ba  phase-13-demo-release        chore(release): preserve phase 13 demo and handoff
b9b806f4  phase-12-qa                  fix(qa): verify P0 flows and preserve phase 12 evidence
2cc8fe94  phase-10-demo-requests       feat(requests): persist local demo requests
a04572a0  phase-8-profile              feat: implement S06 offer profile and trust passport
0d3a81ff  phase-7-search (HEAD)        docs: prepare phase 8 handoff
bebad7fe  (без ветки-имени)            feat: implement S04-S05 search and draft filters
1e37808a  phase-6-intake               feat: add phase 6 intake and phase 7 handoff
2f9e1113  phase-0-audit (default HEAD) docs: preserve phase 0 audit and implementation plan
```

**Все 11 веток — префиксы одной линейной цепочки** (нет форков, нет divergent-истории, нет force-push следов в доступной истории).

## 2. Таблица коммитов

| Commit SHA | Branch (HEAD) | Feature | Remote status | Included in latest branch (completion-audit) | Action needed |
|---|---|---|---|---|---|
| `2f9e1113` | phase-0-audit | Фаза 0: аудит/план | pushed | да | нет |
| `1e37808a` | phase-6-intake | Интейк S01 | pushed | да | нет |
| `bebad7fe` | — (промежуточный) | Поиск S04–S05 | pushed (часть phase-7-search) | да | нет |
| `0d3a81ff` | phase-7-search | Handoff фазы 8 | pushed | да | нет |
| `a04572a0` | phase-8-profile | Профиль S06 | pushed | да | нет |
| `2cc8fe94` | phase-10-demo-requests | Демозапросы S07–S09 | pushed | да | нет |
| `b9b806f4` | phase-12-qa | QA фазы 12 | pushed | да | нет |
| `ec3bb2ba` | phase-13-demo-release | Релиз фазы 13 | pushed | да | нет |
| `ce529dbc` | phase-14-defense | Защита фазы 14 | pushed | да | нет |
| `b1f79f3d` | phase-14-defense | Bootstrap | pushed | да | нет |
| `6f9619f6` | phases-28-35 | Фазы 28–35 (matching) | pushed; PR #1 open | да | PR #1 остаётся открытым, не мержить без разрешения; изменение уже в цепочке |
| `a52ff180` | phases-0-67 | Пилот 55–67 | pushed | да | нет |
| `94fb45fc` | phases-0-67 | Sync-документация | pushed; base PR #2 | да | нет |
| `d125648f` | completion-audit-2026-11-11 | Реестр фаз + CI | pushed; PR #2 (draft) | HEAD | PR #2 ожидает ревью |
| `97541389` | completion-audit-2026-11-11 | Аттестация 39 фаз | pushed; PR #2 (draft) | HEAD | PR #2 ожидает ревью |

## 3. Pull Requests

| PR | Head → Base | Коммиты вне base | Состояние | Оценка конфликтов |
|---|---|---|---|---|
| #1 | `phases-28-35` (`6f9619f6`) → `phase-14-defense` (`b1f79f3d`) | 1 (`6f9619f6`) | OPEN (не draft), обновлён 2026-11-10 | Конфликтов нет: head — прямой потомок base. Дублирования нет. Изменение уже присутствует во всех поздних ветках (включая audited HEAD) через линейную историю. Merge не требуется для целостности кода; решение о merge — владельцу. |
| #2 | `completion-audit-2026-11-11` (`97541389`) → `phases-0-67` (`94fb45fc`) | 2 (`d125648f`, `97541389`) | OPEN, DRAFT, обновлён 2026-11-11T13:45:16Z | Конфликтов нет: head — прямой потомок base. Draft оставлен намеренно для ревью. Не мержить без отдельного разрешения. |

## 4. Проверка на «забытые» изменения

- **Незапушенных локальных коммитов обнаружить невозможно** из снимка без `.git`; на GitHub вся доступная линейная история запушена. Ограничение зафиксировано в Remaining Unknowns.
- Незамерженных содержательных изменений нет: все ветки — префиксы audited HEAD.
- Дублированных изменений (cherry-pick/повторные коммиты) не найдено: 15 коммитов, у каждого уникальный SHA и позиция в цепочке.
- Commit messages упоминают незавершённые работы: «Phase 36 не начата» (PR #1), «Фаза 68 не начата» (реестр), CI должен быть проверен на `97541389` (PR #2) — все три утверждения подтверждены этим аудитом (реестр, отсутствие кода фазы 68, наличие CI).
- Документация ↔ Git history: README (v0.6.0, checkpoint `a52ff180`, ветка `phases-0-67`) согласован с историей. `docs/GITHUB_SYNC_STATUS.md` утверждает синк `phases-0-67` до `94fb45fc` — соответствует.

## 5. Неконсистентности (низкий приоритет)

1. Ветка `phase-7-search` указывает на коммит `0d3a81ff` «docs: prepare phase 8 handoff» — имя ветки отстаёт от содержимого HEAD на один docs-коммит (историческая небрежность пуша, не влияет на код).
2. README фазы 13/14 говорит «зафиксированный результат — `ce529dbc`», тогда как ветка `phase-14-defense` HEAD = `b1f79f3d` (один docs-коммит позже). Явно задокументировано в README («основой»), противоречия нет.
3. CI (`integrity.yml`) запускается только для `phases-0-67`, `completion-audit-2026-11-11` и PR — исторические ветки без CI, это ожидаемо.

## 6. CI статус

Workflow `integrity.yml` (Node 24.22.1): `npm ci` → `npm run check` (typecheck + 147 unit + audit:phases) → `npm run build`. GitHub API показал PR #2 со ссылкой на CI последнего коммита; фактический run на GitHub не запрашивался детально — локальный эквивалент пройден полностью (см. 09_AUTOMATED_TEST_RESULTS). Проверка фактического CI-раннера GitHub — в Remaining Unknowns (требует доступа к Actions API; ограничение отмечено).

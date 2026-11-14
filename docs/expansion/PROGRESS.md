# Checkpoint progress

- 13.11.2026: source-intake baseline0e7e189 подтверждён в remote feature/context-init-2026-11-13; EXP-01 найден на sibling@a93cc18, не объединён.
- 13.11.2026: [EXP-02](stages/EXP-02.md), F017–F036: runtime gap не найден;10 новых browser cases, прямые source checks и source anchors для 231 ID, обновление AI_CONTEXT. Проверки/границы/rollback в stage. Один test/docs checkpoint; его SHA определяется `git log -1 -- docs/expansion/stages/EXP-02.md`, remote сверяется после push. Не заявлять push лишь из наличия этой записи.

LIVE_BLOCKED; human UAT/native KK и оригинальный DOCX остаются открытыми. Следующий кандидат — EXP-03 после нового поручения.

14.11.2026 EXP-04 A: user authorized exact F061–F075; audited base7340dff; baseline196 PASS. Keep same-provider explicit replacement/tab-memory comparison. Address unavailable, show honest unknown. No merge/deploy; LIVE_BLOCKED. See EXP-04 stage.

EXP-04 B:235 unit/integration +13 profile browser PASS;8 reproduced defects fixed. Same schema and demo clock; public roles/hidden-offer evidence stripped at ingestion. A remote c43fedc00fbfa4f85ef9a432c9fdb32470f22d2e. Next C. LIVE_BLOCKED; HUMAN_QA_PENDING.

EXP-04 C verified:237 unit/integration,121 full dev browser, strict TS/build/context PASS,0 final failed/skipped. Responsive3 columns1280 and stacked390/320, text200%, native keyboard, locale/date/price, exact pin/replace/withdrawal proved. Five synthetic browser screenshots retained in docs/expansion/evidence/EXP-04-screenshots. B remote verified 424c36db3caa423d304ca403d01e7a6bff372011. Next D: dist/pilot/offline and final per-feature closure. LIVE_BLOCKED; HUMAN_QA_PENDING.

EXP04 C2: test-only serviceWorkers:block isolates route-injected synthetic catalogs after reload; runtime unchanged from remote25a262fa3461fd2c5bbc8313eb2419833af64dee. Current237 check,31 focused dev and83 dist PASS; original full121 dev equivalent (DEV never registers SW). Actual SW remains enabled in separate release/offline tests;5 pilot and2 offline PASS. Initial80pass/3fail dist log retained. No assertions removed, no production SW disablement. Next final D closure; LIVE_BLOCKED/HUMAN_QA_PENDING.

14.11.2026 EXP04 D:237 unit/121 dev/83 dist/5 pilot/2 offline=448 final PASS;0 failed/skipped. A c43fedc, B424c36d, C25a262f remote verified. Containing D SHA is verified after push in final receipt (self-reference limitation). All4 AC PASS; LIVE_BLOCKED/HUMAN_QA_PENDING; stop before EXP05.

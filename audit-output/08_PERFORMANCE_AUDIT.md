# 08 — PERFORMANCE AUDIT (Stage 8)

Все числа — реальные измерения в этом окружении (Windows 10, Node 24.19.0, AMD Ryzen 5 5600H, Chromium headless shell 1248). Не мобильное поле: это lab-показатели, не полевые Web Vitals.

## 1. Bundle (production build, измерено)

| Артефакт | Размер | gzip |
|---|---|---|
| `assets/index-*.js` (CORE) | **515.49 kB** | **153.18 kB** |
| `assets/Pilot-*.js` (code-split, lazy) | 55.49 kB | 15.73 kB |
| `assets/catalog-*.json` (отдельный fetch) | 53.46 kB | 3.12 kB |
| `assets/index-*.css` | 19.53 kB | 4.60 kB |
| `index.html` | 0.74 kB | 0.45 kB |
| `sw.js` / `app-shell.json` | 1.88 / 0.22 kB | — |

**Узкое место TD-1:** основной чанк >500 kB advisory. Причина: react+react-dom+react-router+zod+весь CORE в одном чанке. Смягчения уже есть: Pilot вынесен, каталог — отдельный JSON.gzip-вес критического пути ≈ 157 kB (JS) + 4.6 kB (CSS) + 3.1 kB (каталог) — ниже NFR-лимита проекта (≈155–160 kB зафиксировано в QA_RESULTS). Рекомендации: manualChunks для react-dom/zod — выигрыш в кэшировании, не в первом байте; оценка: NICE TO HAVE.

## 2. Matching engine (Node, 100 varied inputs, 1000 warmup, p50/p95/max)

| Offers | p50 | p95 | max |
|---|---|---|---|
| 20 (реальный каталог) | 1.59 ms | 2.29 ms | 3.20 ms |
| 100 | 7.20 ms | 12.10 ms | 19.99 ms |
| 1000 | 75.44 ms | 107.44 ms | 116.59 ms |

- Масштабирование ≈ линейное (~0.1 ms/offer).
- Цель NFR-003 (p95 ≤ 100 ms) соблюдается до ~900 offers на desktop CPU; на 1000 offers p95 пересекает 100 ms.
- Вклад TD-2 (district-сортировка переоценивает каждый offer в компараторе) заметен на больших объёмах: у 'district' сортировки сложность O(n log n) *оценок* вместо O(n) — при 1000 offers это значимая часть. Рекомендация (SHOULD, при росте каталога): предвычислить districtKey один раз на offer перед сортировкой (Декорация-пре-вычисление), и мемоизировать `service.search(input)` по сериализованному input в Catalog.tsx.

## 3. React-рендеринг

- `Catalog` выполняет `service.search(input)` синхронно при каждом рендере — в т.ч. на каждый символ в поле имени (TD-3). При 20 offers это <3 ms — незаметно; при 300+ offers станет ощутимо. Плюс: нет гонок запросов и рассинхрона счётчиков/карточек (сознательный трейд-офф, задокументирован в коде).
- Каждая OfferCard читает catalog через `find` (O(n)) — при больших каталогах стоит построить Map один раз (NICE TO HAVE).
- Pilot — lazy chunk, не загружается до входа в `/pilot` — старт CORE не платит за пилот (подтверждено разделением бандла).

## 4. Запуск приложения

- Каталог грузится `fetch` JSON → zod-валидация. Dev-замер: ~50 ms на desktop (не фиксировалось как метрика); skeleton-карточки резервируют место (loading-grid), скриншот `loading` отсутствует, но классы есть; e2e «loading reserves cards» PASS.
- SW: precache всего shell (≈590 КБ без каталога) при install — на медленных сетях первая установка тяжеловата, но offline- experience после этого полностью локальный; `/pilot` офлайн → offline.html (PASS e2e).

## 5. Storage

- IndexedDB: открытие с проверкой схемы + таймаут 8 с; каждая операция открывает/закрывает БД (просто, безопасно, не оптимально для частых операций — в демо-частоты это незначимо).
- SQLite (pilot): WAL + BEGIN IMMEDIATE; `pump()` раз в 1 с читает до 100 jobs — дешево; `list()` загружает весь kind в память — при пилотных объёмах (<сотни строк) ОК, при production-объёмах потребуется SQL-фильтрация (отмечено как design-граница пилота).

## 6. Что НЕ измерялось

- Полевые Web Vitals (LCP/INP/CLS) на реальных мобильных устройствах — NOT RUN (совпадает с признанием в docs: NFR-002 NOT RUN).
- CPU-throttling / slow-network профилировки Lighthouse — не запускались (headless shell без полного Chromium; отмечено).
- Память: стресс-тесты IndexedDB/React не проводились.

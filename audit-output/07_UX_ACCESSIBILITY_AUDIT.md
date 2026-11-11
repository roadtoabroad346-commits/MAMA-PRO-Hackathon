# 07 — UI/UX & ACCESSIBILITY AUDIT (Stage 7)

Основа: 17 скриншотов production-сборки (Chromium headless, RU и KK, ширины 320/360/1280), e2e-наборы keyboard/reflow/errors, чтение `styles.css` и всех компонентов. Автоматические проверки не заменяют проверку носителем языка и реальным скрин-ридером — это ограничение отмечено и совпадает с признанием в docs/QA_RESULTS.

## 1. Responsive

| Ширина | Страницы | Переполнение | Вывод |
|---|---|---|---|
| 320, 360, 390, 430 (e2e), 320/360 (скриншоты) | home, intake, catalog, filters, profile, compare, request, privacy, 404 | **нет** (`scrollWidth<=clientWidth` во всех e2e; скриншоты согласны) | PASS |
| 1280 (desktop) | catalog 3-колоночная сетка, профиль 2-панельный | нет | PASS |
| 200% текст (root font-size) | e2e p0-reflow + KK профиль 200% | нет | PASS (CSS-текст; настоящий browser zoom — NOT RUN, признаётся в docs) |

Ландшафт: e2e «mobile/landscape reflow» PASS. Safe-area/физическая клавиатура — NOT RUN (ограничение headless).

## 2. Accessibility

| Проверка | Статус | Доказательство |
|---|---|---|
| Skip-link → #main | PASS | `styles.css .skip-link`, App.tsx; фокус по клику |
| `:focus-visible` 3px контрастный контур + offset | PASS | styles.css:22; скриншоты |
| Семантика: h1 на странице (PageTitle, tabIndex=-1 + focus при навигации), fieldset/legend, dl/dt/dd, ol/li | PASS | код компонентов |
| Подписи: все поля имеют label (`htmlFor`/`useId`), help через aria-describedby | PASS | Choices/Check/Select/Field |
| ARIA: role=status для счётчиков/превью (aria-atomic), role=alert для ошибок, aria-pressed для тумблеров/чипов, aria-current для шагов/табов, aria-expanded для дисклозур | PASS | Catalog/Filters/Pilot |
| Модалки: native `<dialog>` showModal (фокус-трап браузера), возврат фокуса в инициатор или fallback, ESC через onCancel, закрытие по клику вне с координатной проверкой | PASS | Modal.tsx; e2e dialogs |
| Динамические ошибки объявляются | PASS | role=alert на budget/filter/summary; e2e p0-errors |
| Reduced motion | PASS | `@media (prefers-reduced-motion: reduce)` отключает transitions/scroll-behavior (styles.css:201) |
| Карта: не только canvas — кнопки-точки с aria-pressed + полный список ссылок ниже; отказ геолокации не ломает поиск | PASS | ResultMap; offline e2e |
| axe (историч., фаза 12): 26 состояний, 0 нарушений WCAG2 A/AA/2.2AA | PASS (историческое) | docs/qa/a11y.json; НЕ повторялось в этом аудите |

Реальные скрин-ридеры (NVDA/VoiceOver/TalkBack) — **NOT RUN**; автоматика не заменяет.

## 3. Localization (RU/KK)

| Проверка | Статус | Детали |
|---|---|---|
| Паритет ключей RU↔KK | **PASS** | Типы `Record<keyof typeof ru, string>` (компилятор) + скрипт-проверка: 0 дубликатов, 0 отсутствующих. |
| Плейсхолдеры | **PASS** | domain.test «RU/KK keys and named placeholders agree»; при отсутствии значения остаётся видимый `{name}` (fail-safe). |
| Смешение языков | Найдено 1 наблюдение | `App.tsx:78` — надпись «Тестовый пилот»/«Сынақ пилоты» инлайн (не через i18n, но локализована); `ResultMap.tsx` — весь текст инлайн RU/KK (обоих языков, но вне каталога сообщений). Функционально локализовано, архитектурно — вне единого каталога. P3. |
| Казахские формулировки | Ограничение | Редактура носителем NOT RUN (признаётся в docs). Замечание аудитора (не носителя): `step: '4 қадамның {step}-қадамы'` — грамматически спорная конструкция; `«Все категории» → 'Барлық санат'` звучит как калька. Требует носителя. P2 (процессный). |
| Даты/валюта | PASS | `Intl.DateTimeFormat(locale)` с фиксированной таймзоной Asia/Almaty (status) / Asia/Qyzylorda (запросы); ₸ везде; NFR-011 фиксированный demoClock. |
| Длинные KK-строки | PASS | 320/360/430/1280 без переполнений; скриншоты home-kk/catalog-kk/profile-kk. |

## 4. UX

| Аспект | Оценка | Комментарий |
|---|---|---|
| Information architecture | **Хорошо** | Два понятных входа (нужна помощь / знаю, кого ищу); 4 шага + явная проверка; каталог/профиль/сравнение/статус. |
| Когнитивная нагрузка | **Хорошо** | Прогресс-индикатор, необязательность шагов, «Пропустить шаг», предпросмотр количества до Применить. |
| Ясность matching-объяснений | **Хорошо** | Секции «Сошлось/Предпочтения/Не сошлось/Стоит уточнить» с указанием источника и даты; без числовых рейтингов пользователю (данные-testid есть, не отображаются). |
| Trust indicators | **Хорошо** | «Объём проверки» с источником/датой/ограничениями; STALE-предупреждения; «Демо»-бейдж везде. |
| Empty/error states | **Хорошо** | Явные пустые состояния с действиями; ошибки каталога с Retry; 404 с путём домой. |
| Primary actions | **Хорошо** | Один primary на экран; вторичные — secondary/text. |
| Form friction | **Умеренно** | Бюджет строго целочисленный (документировано, валидация честная); язык/формат по умолчанию «жёсткие» при выборе — объяснено help-текстом, отключаемо. |
| Мобильная usability | **Хорошо** | Touch-таргеты, sticky compare tray с CSS-переменной высоты, drawer-фильтры. |

## 5. Визуальные артефакты

Создано в `audit-shots/` (17 PNG): home-ru-360, home-kk-360, home-ru-320, intake1-ru-360, intake4-ru-360, catalog-ru-360, catalog-ru-320, catalog-ru-1280, catalog-kk-360, filters-modal-360, profile-ru-360, profile-kk-1280, compare-ru-360, request-ru-360, privacy-ru-360, notfound-ru-360. Все — реальная production-сборка, ноль JS-ошибок.

## 6. Находки

| ID | Severity | Находка |
|---|---|---|
| UX-1 | LOW | Инлайн-тексты ResultMap/App вне i18n-каталога (см. §3) — риск рассинхрона при правках. |
| UX-2 | LOW | На очень узких экранах (320px) full-page каталог из 12 карточек — длинный вертикальный скролл; компенсируется sticky-сравнением и счётчиком; это задокументированное M-01/вертикальное сравнение. |
| UX-3 | PROCESS | KK требует редактуры носителем; RU-редактура аудитора не заменяет носителя (аудитор не носитель). |

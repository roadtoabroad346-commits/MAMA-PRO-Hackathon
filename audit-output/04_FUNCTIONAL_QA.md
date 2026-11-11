# 04 — FUNCTIONAL QA OF USER JOURNEYS (Stage 4)

Основа: чтение исходников + 104 выполненных E2E + 147 unit + живые HTTP-пробы + 17 скриншотов (production dist, Chromium headless). Всё — синтетические данные.

## 1. Parent Experience (S01–S03)

| Проверка | Статус | Доказательство |
|---|---|---|
| Главная, два входа (анкета/каталог) | **PASS** | Home.tsx; e2e p0.spec |
| 4 шага анкеты, «Далее/Назад/Пропустить» | **PASS** | Intake.tsx steps 1–4; e2e intake.spec |
| Валидация бюджета (отрицательное/дробное/текст/пробел/0/100001) | **PASS** | parseBudget; domain.test 12 кейсов; e2e «invalid budget disables Apply» |
| 0 ≠ пусто (бюджет) | **PASS** | domain.test «0 is a real hard budget» |
| Сохранение ответов при возврате назад и смене языка | **PASS** | session.ts; e2e «Back stores answers», «Смена языка» |
| Некорректные enum-значения не применяются | **PASS** | searchInputSchema.safeParse в Intake submit; e2e |
| Очистка формы | **PASS** | resetAll → emptySearchInput; e2e «full reset retains locale» |
| Сессия: TTL 2 ч, смена catalogVersion → reset с сообщением | **PASS** | session.test (9) |
| Языковой переключатель RU/KK, сохранение в localStorage | **PASS** | AppState; скриншоты home-kk/intake/catalog-kk |
| Недоступное хранилище → честное предупреждение, работа в памяти | **PASS** | session.test «honestly reports read/write denial» |
| Review: точный пересчёт по нормализованному вводу, preview counts | **PASS** | Review.tsx использует `service.search(input)` — тот же сервис, что каталог |

## 2. Search & Matching (ядро)

Ключевая гарантия: **каждый offer оценивается независимо** (`evaluateOffer` на один offer; группировка только после оценки). Проверено тестом «same specialist A ru/offline/4500 and B kk/online/9500 cannot form kk/offline/6000» — микс условий двух услуг одного специалиста невозможен.

| Механика | Статус | Доказательство |
|---|---|---|
| Hard constraints (category/age/language hard/format hard/budget hard/district hard) | **PASS** | p0.test oracle; matching.test; e2e сценарии B/C |
| Soft preferences → ранжирование без исключения | **PASS** | domain.test «language and format preferences retain alternatives» |
| Unknown-условия → `incomplete`, отдельная секция, никогда не в exact | **PASS** | search.test «incomplete is separate»; p0.test |
| Stale данные (price 30d ±1ms, availability 7d) | **PASS** | matching.test TTL-тесты; stalePrice/staleAvailability в UI |
| Score: weighted 30/15/15/10/15/10/5, denominator по применимым факторам | **PASS** | «isolated reference score/coverage is 100/1, 85/.85, 82.5/1» |
| Coverage: доля известной массы | **PASS** | там же; «known false availability reduces score but preserves coverage» |
| Стабильность сортировки, tie-break (score→coverage→specialistId→offerId) | **PASS** | «ties are stable under reversal» |
| Дистрикт-сортировка не выдумывает расстояния | **PASS** | search.test; ResultMap — только схематичные точки |
| Возрастные границы (включение/частичное/не-пересечение) | **PASS** | 5×параметризованных p0.test |
| Бюджет: exact/from/free/unknown, hard/soft, 0 | **PASS** | p0.test budget-матрица; soft ≤125% → 0.5 коэффициента (ADR-зафиксировано) |
| Языки: mandatory ru/kk, `[]`/null → unknown | **PASS** | matching.test |
| Район + онлайн-микс (ADR-0012): online-only district неактивен, смешанный — активен | **PASS** | domain.test; Intake показывает districtInactive/onlineDistrict |
| Несколько услуг одного специалиста: grouping, лучшая — представитель, matchingOfferIds | **PASS** | «grouping selects best and counts exact specialist once» |
| Неполные результаты: фильтрация specialist'ов уже имеющих exact | **PASS** | SearchService.incompleteOnly; e2e «empty keeps hard conditions; incomplete is an explicit separate action» |
| No-results: явное состояние + подсказки (сброс запроса/условий) | **PASS** | Catalog.tsx emptyExact; e2e сценарий C |
| Текстовый поиск: NFKC, ё→е, казахские буквы не сливаются, ≤80 симв | **PASS** | search.test; e2e «rapid text edits… 80-character limit» |
| Neutral режим (без параметров) — честный, score null | **PASS** | domain.test; UI «neutral» подпись |

Оракулы A/B/C (исторические) — PASS на текущем коде (domain.test «A orders offers…», «B excludes unknown final prices…», «C stays empty until the user changes conditions»), дополнены негативами и границами.

## 3. Specialist Profiles (S06)

| Проверка | Статус | Доказательство |
|---|---|---|
| Deep link `/specialists/:id?offer=…` | **PASS** | e2e profile.spec; OfferProfile resolveProfile |
| Неизвестный/скрытый/чужой offer → явная ошибка, **без подмены** | **PASS** | profile.test «rejects unknown, wrong-owner, empty, hidden and withdrawn selections without fallback»; e2e «mismatched public IDs never substitute another offer» |
| Переключение услуги радио-кнопками, URL синхронно, фокус не крадётся | **PASS** | OfferProfile radio + navigate replace; e2e |
| Сведения об услуге: возраст/язык/формат/район/цена/длительность/единица | **PASS** | OfferFacts; скриншот profile-ru-360 |
| Даты обновления и источники (fieldSources, verifiedAt) | **PASS** | OfferFacts priceDate; TrustPassport |
| Verification статусы: UNVERIFIED/SELF_DECLARED/DOCUMENT_SEEN/SOURCE_CONFIRMED/STALE/REVOKED; историческое подтверждение не даёт текущего | **PASS** | profile.test «evidence cannot become a broader or current guarantee» |
| Будущие даты → предупреждение; reviewDueAt ≤ clock → STALE | **PASS** | verificationStatus; matching.test |
| Бюджетная ошибка при загрузке профиля из сравнения | **PASS** | Comparison RequestAction incompatible + ack |

## 4. Comparison (S08)

| Проверка | Статус | Доказательство |
|---|---|---|
| Добавление/удаление/замена услуги специалиста (одна на специалиста) | **PASS** | AppState.toggleCompare; e2e «compare offer replacement is explicit» |
| Лимит 3, четвёртый не вытесняет | **PASS** | compareLimit; e2e «fourth rejection» |
| Согласованность offer IDs: сравнение по выбранным конкретным услугам | **PASS** | comparison items {specialistId, offerId}; inspectOffer на конкретный offer |
| Reload очищает сравнение (in-memory, задокументировано) | **PASS** | e2e «Reload сравнения намеренно очищает»; README |
| Изменение фильтров → предупреждение compareChanged, переоценка текущим вводом | **PASS** | SelectionViews `changed`; e2e «changes counts and explanations aligned» |
| Мобильная вёрстка, клавиатура | **PASS** | e2e reflow/keyboard; скриншот compare-ru-360 |

## 5. Demo Requests (S07, S09)

| Проверка | Статус | Доказательство |
|---|---|---|
| Создание только после явного ack (default false) | **PASS** | RequestAction/DemoRequestEntry; e2e |
| Double-click → один commit | **PASS** | DemoRequestService.run lock; requests.test; e2e |
| IndexedDB transaction completion → статус только после commit | **PASS** | «stays submitting until commit; failure never produces recorded_demo» |
| Персистентность, статус по ID после reload | **PASS** | requests.spec; release.spec |
| Отмена: терминальная, переживает reload | **PASS** | «cancellation is terminal on replay»; release.spec |
| Retry: тот же idempotencyKey (никогда новый без явного действия) | **PASS** | «reconciles uncertain committed writes by the same key» |
| Неопределённый исход (таймаут) → проверка того же ключа, без ложного успеха | **PASS** | UncertainStorageResult контракт; e2e uncertain-тесты (2 шт, 8.7 с каждый) |
| Истёкшая попытка (2 ч) → явная ошибка, новый ключ только по новому клику | **PASS** | isExpiredAttempt; requests.test |
| Смена услуги при неразрешённой попытке → запрет | **PASS** | «cannot switch offer after an unresolved attempt» |
| Storage unavailable → нет ложного сохранения | **PASS** | requests.test «unavailable storage… reject rather than fall back to memory» |
| Повреждённые данные → read error ≠ missing | **PASS** | parse() бросает; requestReadError |
| TTL 7 дней, удаление при открытии | **PASS** | «retention uses creation time, with a 7 day boundary» |
| Очистка: подтверждение, только свой store, чужие ключи не затрагиваются | **PASS** | e2e «cleanup needs confirmation… preserves other applications and settings» |
| Снапшот услуги — неперсональный allowlist | **PASS** | offerSnapshot; demoRequestSchema |

## 6. Pilot Features (55–67, реальный backend)

Выполнено pilot E2E (5 сценариев) + 30 unit-тестов + живые пробы:

| Сценарий | Статус | Ключевые ассерты |
|---|---|---|
| Synthetic login + роли | **PASS** | 401/403/404 пробы; state по ролям |
| Onboarding анкеты + publication consent | **PASS** | application.create→submit→assign→decide |
| Модерация (assign/decide/needs_changes/сuspension) | **PASS** | e2e сценарий 1; unit |
| Contact requests (sandbox, история, confirm) | **PASS** | e2e; unit «separates server receipt…» |
| Request tracker + удаление со scrubbing | **PASS** | unit «late jobs cannot reopen cancellation; deletion… scrubs text» |
| Календарь + подтверждение из обращения | **PASS** | e2e «Календарь … Из подтверждённого обращения» |
| Напоминания (in-app jobs, DST/leap, отмена) | **PASS** | unit calendar/reminder блок |
| Подписки на изменения (dedup, отписка) | **PASS** | unit subscriptions; e2e «Следить за изменениями» |
| Next action (метки completed/deferred/hidden) | **PASS** | unit; NextAction UI |
| Goals/Diary (приватные, version, удаление со scrub) | **PASS** | unit + e2e XSS-as-data |
| Assignments (scope, версии, ответы) | **PASS** | e2e сценарий 1 финал; unit |
| Summary (выборочный предпросмотр, clipboard, download, без отправки) | **PASS** | e2e clipboard/download; unit «exact selection excludes all unselected data» |
| Отказ сервера: поля сохраняются, нет ложного успеха, retry тем же ключом | **PASS** | e2e сценарий 2, 3 |
| Logout: экран очищен; при отказе честное сообщение, 401 | **PASS** | e2e сценарий 5 |

Не найдено ни одного сценария с ложным сообщением об успешном сохранении: все состояния «Сохранено» появляются только после подтверждённого commit (IndexedDB `tx.oncomplete` / HTTP-ответ сервера).

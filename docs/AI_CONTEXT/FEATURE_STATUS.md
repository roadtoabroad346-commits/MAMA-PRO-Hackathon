# F000–F230: состояние функций

Historical baseline:7f8434a. EXP-03 F037–F060 — **execution_state VERIFIED_DONE**, scope **AUTOMATED_SYNTHETIC_DEMO** on source ac82ec7209de0ec5e0154947193cafcb7be856ba.360 executed final tests PASS; [24-row AC/evidence matrix](../expansion/stages/EXP-03.md). Implementation status stays IMPLEMENTED_WITH_LIMITATIONS because human/live gates remain separate. EXP-02 and sibling EXP-01 retain their historical evidence; other EXP stages are not completed by this work.

Канонические имена/номера сверены с полностью прочитанным Research Markdown, исходным CSV и двумя инженерными приложениями. DOCX недоступен; его чтение не заявляется. Исходный Research status сохранён отдельно. Полные поля, acceptance и именованные test anchors: [FEATURE_REGISTRY.json](FEATURE_REGISTRY.json); экспорт [CSV](FEATURE_REGISTRY.csv).

Статусы: VERIFIED_IMPLEMENTED — доказан весь заявленный объём; IMPLEMENTED_WITH_LIMITATIONS — работает с перечисленными ограничениями; PILOT_TEST_ONLY — только интегрированный synthetic pilot; PARTIALLY_IMPLEMENTED — доказана часть целевой функции; PLANNED — целевого пути нет; BLOCKED_EXTERNAL — завершение требует внешних условий; UNKNOWN — доказательств недостаточно. В этой матрице VERIFIED_IMPLEMENTED намеренно не используется: human gates не закрыты; техническая приёмка EXP-02 описана отдельно в [отчёте](../expansion/stages/EXP-02.md).

Тестовые ссылки означают относящиеся к области проверки, а не доказательство всех требований одной зелёной строкой. Future-scope foundations не означают готовность AI, family или live.

| Статус | Количество |
|---|---|
| IMPLEMENTED_WITH_LIMITATIONS | 88 |
| PILOT_TEST_ONLY | 43 |
| PLANNED | 51 |
| PARTIALLY_IMPLEMENTED | 6 |
| BLOCKED_EXTERNAL | 43 |

| ID | Функция | Исходный статус | EXP | Текущий статус |
|---|---|---|---|---|
| [F000](#f000) | Миссия: прозрачный цифровой навигатор поддержки семьи | MISSION | EXP-00 | IMPLEMENTED_WITH_LIMITATIONS |
| [F001](#f001) | Главная страница | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F002](#f002) | Объяснение платформы | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F003](#f003) | Быстрый переход к каталогу | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F004](#f004) | Маршрут подбора специалиста | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F005](#f005) | Использование без регистрации | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F006](#f006) | Русский язык интерфейса | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F007](#f007) | Казахский язык интерфейса | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F008](#f008) | Переключение языков | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F009](#f009) | Сохранение выбранного языка | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F010](#f010) | Маркировка демоданных | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F011](#f011) | Маскот Қарлығаш | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F012](#f012) | Три позы маскота | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F013](#f013) | Адаптивный дизайн | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F014](#f014) | Мобильная навигация | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F015](#f015) | Прямые ссылки на страницы | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F016](#f016) | Обработка ошибок интерфейса | DEMO | EXP-01 | IMPLEMENTED_WITH_LIMITATIONS |
| [F017](#f017) | Анкета из четырёх шагов | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F018](#f018) | Выбор потребности | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F019](#f019) | Выбор категории специалиста | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F020](#f020) | Вариант «Не знаю, кто нужен» | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F021](#f021) | Выбор возрастной группы | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F022](#f022) | Выбор языка занятий | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F023](#f023) | Выбор формата | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F024](#f024) | Выбор района | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F025](#f025) | Выбор бюджета | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F026](#f026) | Учёт заявленной доступности услуги | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F027](#f027) | Обязательные условия | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F028](#f028) | Необязательные предпочтения | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F029](#f029) | Пропуск необязательных вопросов | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F030](#f030) | Возврат к предыдущему шагу | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F031](#f031) | Редактирование ответов | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F032](#f032) | Сохранение состояния анкеты | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F033](#f033) | Валидация данных | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F034](#f034) | Предпросмотр ответов | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F035](#f035) | Подсчёт подходящих вариантов | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F036](#f036) | Переход к результатам | DEMO | EXP-02 | IMPLEMENTED_WITH_LIMITATIONS |
| [F037](#f037) | Поиск специалистов | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F038](#f038) | Поиск конкретных услуг | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F039](#f039) | Фильтрация по категории | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F040](#f040) | Фильтрация по возрасту | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F041](#f041) | Фильтрация по языку | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F042](#f042) | Фильтрация по формату | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F043](#f043) | Фильтрация по району | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F044](#f044) | Фильтрация по бюджету | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F045](#f045) | Учёт неизвестной цены | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F046](#f046) | Учёт бесплатных услуг | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F047](#f047) | Учёт указанной доступности | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F048](#f048) | Комбинация фильтров | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F049](#f049) | Сброс фильтров | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F050](#f050) | Hard constraints | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F051](#f051) | Soft preferences | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F052](#f052) | Расчёт matching score | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F053](#f053) | Расчёт полноты данных | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F054](#f054) | Объяснение соответствия | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F055](#f055) | Разделение точных и неполных совпадений | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F056](#f056) | Проверка актуальности информации | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F057](#f057) | Стабильная сортировка | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F058](#f058) | Обработка отсутствия результатов | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F059](#f059) | Сохранение условий при переходах | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F060](#f060) | Защита от смешивания условий разных услуг одного специалиста | DEMO | EXP-03 | IMPLEMENTED_WITH_LIMITATIONS |
| [F061](#f061) | Карточка специалиста | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F062](#f062) | Несколько услуг одного специалиста | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F063](#f063) | Подробные условия услуги | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F064](#f064) | Цена и продолжительность | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F065](#f065) | Адрес и формат | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F066](#f066) | Паспорт доверия | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F067](#f067) | Статус проверки | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F068](#f068) | Источник информации | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F069](#f069) | Дата проверки | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F070](#f070) | Неизвестные сведения | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F071](#f071) | Сравнение специалистов | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F072](#f072) | Добавление в сравнение | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F073](#f073) | Удаление из сравнения | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F074](#f074) | Сравнение условий | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F075](#f075) | Side-by-side сравнение на компьютере | DEMO | EXP-04 | IMPLEMENTED_WITH_LIMITATIONS |
| [F076](#f076) | Создание демозаявки | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F077](#f077) | Подтверждение деморежима | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F078](#f078) | Локальное сохранение заявки | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F079](#f079) | Защита от дублирования | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F080](#f080) | Просмотр заявки | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F081](#f081) | Отмена заявки | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F082](#f082) | Очистка заявок | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F083](#f083) | Восстановление после ошибок | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F084](#f084) | Контроль срока хранения | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F085](#f085) | PWA и сохранённые офлайн-карточки | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F086](#f086) | Карта синтетических специалистов | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F087](#f087) | Базовая доступность интерфейса и локализация дат | DEMO | EXP-05 | IMPLEMENTED_WITH_LIMITATIONS |
| [F088](#f088) | Тестовый вход | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F089](#f089) | Роли родителей | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F090](#f090) | Роли специалистов | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F091](#f091) | Роль модератора | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F092](#f092) | Роль администратора | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F093](#f093) | Проверка доступа | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F094](#f094) | Разделение данных пользователей | PILOT_TEST | EXP-06 | PILOT_TEST_ONLY |
| [F095](#f095) | Создание анкеты специалиста | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F096](#f096) | Редактирование анкеты | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F097](#f097) | Отправка на модерацию | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F098](#f098) | Проверка полноты | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F099](#f099) | Одобрение анкеты | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F100](#f100) | Возврат на доработку | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F101](#f101) | Отклонение | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F102](#f102) | Публикация | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F103](#f103) | Отзыв публикации | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F104](#f104) | История модерации | PILOT_TEST | EXP-07 | PILOT_TEST_ONLY |
| [F105](#f105) | Серверное создание обращения | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F106](#f106) | Внутренний ящик специалиста | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F107](#f107) | Отслеживание статуса обращения | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F108](#f108) | Ответ специалиста | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F109](#f109) | Подтверждение записи | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F110](#f110) | Отмена обращения | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F111](#f111) | История изменений | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F112](#f112) | Защита от повторной отправки | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F113](#f113) | Хранение обращения в SQLite | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F114](#f114) | Проверка прав владельца | PILOT_TEST | EXP-08 | PILOT_TEST_ONLY |
| [F115](#f115) | Личный календарь | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F116](#f116) | Создание событий | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F117](#f117) | Редактирование событий | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F118](#f118) | Подтверждённые события | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F119](#f119) | Предупреждение о пересечении времени | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F120](#f120) | Напоминания внутри приложения | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F121](#f121) | Подписка на изменения условий услуги | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F122](#f122) | Уведомления об изменениях внутри приложения | PILOT_TEST | EXP-09 | PILOT_TEST_ONLY |
| [F123](#f123) | Следующий организационный шаг | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F124](#f124) | Отметка выполнения шага | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F125](#f125) | Личные цели | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F126](#f126) | Приватный дневник | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F127](#f127) | Задания от специалиста | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F128](#f128) | Ответы родителя на задания | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F129](#f129) | Формирование выборочной сводки | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F130](#f130) | Копирование и скачивание сводки | PILOT_TEST | EXP-10 | PILOT_TEST_ONLY |
| [F131](#f131) | Интерактивная AI-Қарлығаш | LATER | EXP-11 | PLANNED |
| [F132](#f132) | Диалоговый помощник родителя | LATER | EXP-11 | PLANNED |
| [F133](#f133) | Объяснение категорий специалистов | LATER | EXP-11 | PLANNED |
| [F134](#f134) | AI-помощь при заполнении анкеты | LATER | EXP-11 | PLANNED |
| [F135](#f135) | Объяснение результатов простым языком | LATER | EXP-11 | PARTIALLY_IMPLEMENTED |
| [F136](#f136) | Trust Gap Assistant | LATER | EXP-11 | PLANNED |
| [F137](#f137) | Smart Zero Results | LATER | EXP-11 | PARTIALLY_IMPLEMENTED |
| [F138](#f138) | AI-подготовка вопросов специалисту | LATER | EXP-11 | PLANNED |
| [F139](#f139) | AI-перевод сложных описаний | LATER | EXP-11 | PLANNED |
| [F140](#f140) | AI-помощник по навигации | LATER | EXP-11 | PLANNED |
| [F141](#f141) | Голосовой ввод RU/KK | LATER | EXP-12 | PLANNED |
| [F142](#f142) | Голосовое управление | LATER | EXP-12 | PLANNED |
| [F143](#f143) | Озвучивание интерфейса | LATER | EXP-12 | PLANNED |
| [F144](#f144) | Персонализированные подсказки Қарлығаш | LATER | EXP-12 | PLANNED |
| [F145](#f145) | AI-сводка организационной истории | LATER | EXP-12 | PLANNED |
| [F146](#f146) | AI-помощь специалисту при заполнении профиля | LATER | EXP-12 | PLANNED |
| [F147](#f147) | Поиск на естественном языке | LATER | EXP-12 | PLANNED |
| [F148](#f148) | Семантический поиск | LATER | EXP-12 | PLANNED |
| [F149](#f149) | Объяснение различий между вариантами | LATER | EXP-12 | PARTIALLY_IMPLEMENTED |
| [F150](#f150) | AI-проверка полноты сведений без автоматической верификации | LATER | EXP-12 | PARTIALLY_IMPLEMENTED |
| [F151](#f151) | Accessibility Fit: подбор по доступности среды | LATER | EXP-13 | PLANNED |
| [F152](#f152) | True Cost Calculator: полная стоимость поддержки | LATER | EXP-13 | PLANNED |
| [F153](#f153) | Учёт расходов на дорогу | LATER | EXP-13 | PLANNED |
| [F154](#f154) | Учёт регулярности занятий | LATER | EXP-13 | PLANNED |
| [F155](#f155) | Подтверждённые свободные слоты | LATER | EXP-14 | BLOCKED_EXTERNAL |
| [F156](#f156) | Реальная транспортная доступность | LATER | EXP-14 | BLOCKED_EXTERNAL |
| [F157](#f157) | Расчёт маршрута | LATER | EXP-14 | BLOCKED_EXTERNAL |
| [F158](#f158) | Общественный транспорт | LATER | EXP-14 | BLOCKED_EXTERNAL |
| [F159](#f159) | Подбор нескольких услуг для семьи | LATER | EXP-14 | PLANNED |
| [F160](#f160) | Поиск по нескольким районам | LATER | EXP-14 | PLANNED |
| [F161](#f161) | Сохранённые поисковые запросы | LATER | EXP-14 | PLANNED |
| [F162](#f162) | Подписка на новые подходящие предложения | LATER | EXP-14 | PLANNED |
| [F163](#f163) | Уведомления о новых специалистах | LATER | EXP-14 | PLANNED |
| [F164](#f164) | Альтернативы при отмене записи | LATER | EXP-14 | PLANNED |
| [F165](#f165) | Контроль актуальности свободных мест | LATER | EXP-14 | PLANNED |
| [F166](#f166) | Объяснение компромиссов | LATER | EXP-14 | PLANNED |
| [F167](#f167) | Поиск бесплатных программ | LATER | EXP-15 | PLANNED |
| [F168](#f168) | Поиск субсидируемых услуг | LATER | EXP-15 | PLANNED |
| [F169](#f169) | Поиск по условиям участия в программах | LATER | EXP-15 | PLANNED |
| [F170](#f170) | Social Support Navigator | LATER | EXP-15 | PLANNED |
| [F171](#f171) | Реальная регистрация | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F172](#f172) | Восстановление аккаунта | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F173](#f173) | Защищённый профиль семьи | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F174](#f174) | Приглашение второго родителя | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F175](#f175) | Совместный семейный календарь | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F176](#f176) | Раздельные права членов семьи | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F177](#f177) | Отзыв доступа | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F178](#f178) | История согласий | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F179](#f179) | Отзыв согласия | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F180](#f180) | Безопасный экспорт семейных данных | LATER | EXP-16 | BLOCKED_EXTERNAL |
| [F181](#f181) | Удаление аккаунта и данных по утверждённой процедуре | LATER | EXP-17 | PLANNED |
| [F182](#f182) | Семейные организационные задачи | LATER | EXP-17 | PLANNED |
| [F183](#f183) | Совместный список вопросов | LATER | EXP-17 | PLANNED |
| [F184](#f184) | Общее избранное | LATER | EXP-17 | PLANNED |
| [F185](#f185) | Передача информации другому опекуну с разрешения | LATER | EXP-17 | BLOCKED_EXTERNAL |
| [F186](#f186) | Реальные обращения специалистам | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F187](#f187) | Подтверждение доставки сообщения | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F188](#f188) | Защищённый чат | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F189](#f189) | Настоящие свободные слоты | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F190](#f190) | Онлайн-запись | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F191](#f191) | Перенос записи | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F192](#f192) | Отмена подтверждённой записи | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F193](#f193) | Push-уведомления | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F194](#f194) | Email-уведомления | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F195](#f195) | Telegram-уведомления | LATER | EXP-18 | BLOCKED_EXTERNAL |
| [F196](#f196) | Интеграция с Google Calendar | LATER | EXP-19 | BLOCKED_EXTERNAL |
| [F197](#f197) | Повторяющиеся события | LATER | EXP-19 | PLANNED |
| [F198](#f198) | Синхронизация расписания специалиста | LATER | EXP-19 | BLOCKED_EXTERNAL |
| [F199](#f199) | Лист ожидания | LATER | EXP-19 | PLANNED |
| [F200](#f200) | Предложение освободившегося времени | LATER | EXP-19 | PLANNED |
| [F201](#f201) | Реальная проверка квалификации | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F202](#f202) | Проверка документов ответственным модератором | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F203](#f203) | Подтверждение принадлежности профиля специалисту | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F204](#f204) | Проверка организации | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F205](#f205) | Повторная проверка устаревших сведений | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F206](#f206) | Жалобы и обращения на проверку | LATER | EXP-20 | PARTIALLY_IMPLEMENTED |
| [F207](#f207) | Обжалование модерации | LATER | EXP-20 | PLANNED |
| [F208](#f208) | Подтверждённые отзывы | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F209](#f209) | Ответ специалиста на отзыв | LATER | EXP-20 | BLOCKED_EXTERNAL |
| [F210](#f210) | Проверяемая история изменений условий | LATER | EXP-20 | PARTIALLY_IMPLEMENTED |
| [F211](#f211) | Social Impact Dashboard | LATER | EXP-21 | PLANNED |
| [F212](#f212) | Аналитика времени поиска | LATER | EXP-21 | PLANNED |
| [F213](#f213) | Аналитика успешных контактов | LATER | EXP-21 | PLANNED |
| [F214](#f214) | Аналитика доступности услуг | LATER | EXP-21 | PLANNED |
| [F215](#f215) | Обезличенная аналитика потребностей | LATER | EXP-21 | PLANNED |
| [F216](#f216) | Аналитика незакрытого спроса | LATER | EXP-21 | PLANNED |
| [F217](#f217) | Карта районов с недостатком предложений | LATER | EXP-21 | PLANNED |
| [F218](#f218) | Кабинет фонда | LATER | EXP-22 | PLANNED |
| [F219](#f219) | Управление программами помощи | LATER | EXP-22 | PLANNED |
| [F220](#f220) | Professional Referral Network с согласием семьи | LATER | EXP-22 | BLOCKED_EXTERNAL |
| [F221](#f221) | Telegram Mini App | LATER | EXP-22 | PLANNED |
| [F222](#f222) | Интеграции с партнёрскими организациями | LATER | EXP-22 | BLOCKED_EXTERNAL |
| [F223](#f223) | Публичный API с контролем доступа | LATER | EXP-22 | PLANNED |
| [F224](#f224) | Выход в другие города Казахстана | LATER | EXP-22 | BLOCKED_EXTERNAL |
| [F225](#f225) | Мониторинг и реагирование на инциденты | LATER | EXP-23 | BLOCKED_EXTERNAL |
| [F226](#f226) | Резервное копирование и восстановление | LATER | EXP-23 | BLOCKED_EXTERNAL |
| [F227](#f227) | Production identity и безопасность | LATER | EXP-23 | BLOCKED_EXTERNAL |
| [F228](#f228) | Реальный аудит accessibility | LATER | EXP-23 | BLOCKED_EXTERNAL |
| [F229](#f229) | Ограниченный пилот после согласований | LATER | EXP-24 | BLOCKED_EXTERNAL |
| [F230](#f230) | Production-запуск | LATER | EXP-24 | BLOCKED_EXTERNAL |


## F000

**Миссия: прозрачный цифровой навигатор поддержки семьи** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Миссия навигации без диагноза и обещания клинического результата.

Код / foundations: [docs/PROJECT_STATE.md:1](../../docs/PROJECT_STATE.md#L1); [docs/LIVE_READINESS.md:1](../../docs/LIVE_READINESS.md#L1)

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Research Markdown прочитан полностью; оригинальный DOCX отсутствует в checkout/remote heads. Интервью, первичные внешние источники и human/live gates остаются непроверенными.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-00](PHASE_PROGRESS.md#exp-00). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F001

**Главная страница** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать понятную главную страницу с двумя входами в поиск.

Код / foundations: [src/features/Home.tsx:5](../../src/features/Home.tsx#L5); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F002

**Объяснение платформы** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Объяснить синтетический режим и назначение сервиса.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F003

**Быстрый переход к каталогу** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Открыть каталог напрямую с главной.

Код / foundations: [src/features/Home.tsx:14](../../src/features/Home.tsx#L14); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F004

**Маршрут подбора специалиста** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Открыть маршрут анкеты без учётной записи.

Код / foundations: [src/features/Home.tsx:13](../../src/features/Home.tsx#L13); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F005

**Использование без регистрации** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Дать доступ к CORE без регистрации.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F006

**Русский язык интерфейса** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать русские пользовательские сообщения.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F007

**Казахский язык интерфейса** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать казахские сообщения; лингвистическая приёмка отдельно.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F008

**Переключение языков** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Переключить RU/KK без потери текущих ответов.

Код / foundations: [src/app/App.tsx:54](../../src/app/App.tsx#L54); [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F009

**Сохранение выбранного языка** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сохранить locale; отказ localStorage показать честно.

Код / foundations: [src/app/AppState.tsx:68](../../src/app/AppState.tsx#L68); [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:109](../../tests/e2e/intake.spec.ts#L109); [tests/e2e/p0-errors.spec.ts:5](../../tests/e2e/p0-errors.spec.ts#L5); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F010

**Маркировка демоданных** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показывать demodata notice в чувствительных точках пути.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F011

**Маскот Қарлығаш** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показывать декоративную Қарлығаш без медицинских обещаний.

Код / foundations: [src/ui/controls.tsx:48](../../src/ui/controls.tsx#L48); [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F012

**Три позы маскота** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Использовать welcome, guide, search как три статичные SVG-композиции.

Код / foundations: [src/ui/controls.tsx:48](../../src/ui/controls.tsx#L48); [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F013

**Адаптивный дизайн** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сохранить reflow при узких экранах и увеличении текста.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:265](../../tests/e2e/intake.spec.ts#L265); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F014

**Мобильная навигация** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Обеспечить доступные touch/keyboard элементы навигации.

Код / foundations: [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/App.tsx:1](../../src/app/App.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F015

**Прямые ссылки на страницы** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Поддержать прямые URL и reload с SPA fallback.

Код / foundations: [src/app/App.tsx:62](../../src/app/App.tsx#L62); [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/p0-keyboard.spec.ts:13](../../tests/e2e/p0-keyboard.spec.ts#L13); [tests/e2e/p0-keyboard.spec.ts:31](../../tests/e2e/p0-keyboard.spec.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F016

**Обработка ошибок интерфейса** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать ошибку и восстановление; ошибка не равна пустой выдаче.

Код / foundations: [src/app/App.tsx:98](../../src/app/App.tsx#L98); [src/features/Home.tsx:1](../../src/features/Home.tsx#L1); [src/app/AppState.tsx:1](../../src/app/AppState.tsx#L1)

Именованные проверки: [tests/e2e/p0-errors.spec.ts:5](../../tests/e2e/p0-errors.spec.ts#L5); [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/intake.spec.ts:52](../../tests/e2e/intake.spec.ts#L52)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-01](PHASE_PROGRESS.md#exp-01). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F017

**Анкета из четырёх шагов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Предоставить ровно четыре шага анкеты и review.

Код / foundations: [src/features/intake/Intake.tsx:9](../../src/features/intake/Intake.tsx#L9)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F018

**Выбор потребности** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сохранить выбранную потребность needTag.

Код / foundations: [src/features/intake/Intake.tsx:75](../../src/features/intake/Intake.tsx#L75)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F019

**Выбор категории специалиста** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сохранить categoryIds без выдуманного диагноза.

Код / foundations: [src/features/intake/Review.tsx:48](../../src/features/intake/Review.tsx#L48)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F020

**Вариант «Не знаю, кто нужен»** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Разрешить неопределённую категорию и null-потребность.

Код / foundations: [src/features/intake/Intake.tsx:76](../../src/features/intake/Intake.tsx#L76)

Именованные проверки: [tests/e2e/phases28-35.spec.ts:61](../../tests/e2e/phases28-35.spec.ts#L61); [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F021

**Выбор возрастной группы** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Выбрать возрастную группу без DOB ребёнка.

Код / foundations: [src/features/intake/Intake.tsx:78](../../src/features/intake/Intake.tsx#L78)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F022

**Выбор языка занятий** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Выбрать ru/kk языка услуги отдельно от locale UI.

Код / foundations: [src/features/intake/Intake.tsx:82](../../src/features/intake/Intake.tsx#L82)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F023

**Выбор формата** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Выбрать online/offline и hard flag.

Код / foundations: [src/features/intake/Intake.tsx:87](../../src/features/intake/Intake.tsx#L87)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F024

**Выбор района** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Выбрать один район; online-only не применяет район.

Код / foundations: [src/features/intake/Intake.tsx:97](../../src/features/intake/Intake.tsx#L97)

Именованные проверки: [tests/e2e/phases28-35.spec.ts:61](../../tests/e2e/phases28-35.spec.ts#L61); [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F025

**Выбор бюджета** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Валидировать целый бюджет 0–100000 KZT; пусто=null.

Код / foundations: [src/features/intake/Intake.tsx:117](../../src/features/intake/Intake.tsx#L117); [src/domain/contracts.ts:64](../../src/domain/contracts.ts#L64)

Именованные проверки: [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94); [tests/e2e/intake.spec.ts:130](../../tests/e2e/intake.spec.ts#L130)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F026

**Учёт заявленной доступности услуги** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Учитывать acceptingEnquiries как dated preference, не свободный слот.

Код / foundations: [src/features/intake/Intake.tsx:140](../../src/features/intake/Intake.tsx#L140); [src/domain/matching.ts:79](../../src/domain/matching.ts#L79)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F027

**Обязательные условия** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Различать hard pass/fail/unknown.

Код / foundations: [src/domain/matching.ts:95](../../src/domain/matching.ts#L95); [src/features/intake/Intake.tsx:137](../../src/features/intake/Intake.tsx#L137)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/phases28-35.spec.ts:61](../../tests/e2e/phases28-35.spec.ts#L61)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F028

**Необязательные предпочтения** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Различать soft preferences и исключающие условия.

Код / foundations: [src/domain/matching.ts:116](../../src/domain/matching.ts#L116); [src/features/intake/Intake.tsx:86](../../src/features/intake/Intake.tsx#L86)

Именованные проверки: [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F029

**Пропуск необязательных вопросов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Разрешить пропуск optional полей без default фактов.

Код / foundations: [src/features/intake/Intake.tsx:55](../../src/features/intake/Intake.tsx#L55)

Именованные проверки: [tests/e2e/intake.spec.ts:32](../../tests/e2e/intake.spec.ts#L32); [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F030

**Возврат к предыдущему шагу** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Возвращаться назад с сохранением ответов.

Код / foundations: [src/features/intake/Intake.tsx:147](../../src/features/intake/Intake.tsx#L147)

Именованные проверки: [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94); [tests/e2e/intake.spec.ts:109](../../tests/e2e/intake.spec.ts#L109)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F031

**Редактирование ответов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Редактировать draft отдельно от applied input.

Код / foundations: [src/features/intake/Review.tsx:31](../../src/features/intake/Review.tsx#L31); [src/app/AppState.tsx:62](../../src/app/AppState.tsx#L62)

Именованные проверки: [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16); [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F032

**Сохранение состояния анкеты** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Восстановить synthetic session с TTL 2h и catalogVersion.

Код / foundations: [src/app/session.ts:17](../../src/app/session.ts#L17); [src/app/AppState.tsx:12](../../src/app/AppState.tsx#L12)

Именованные проверки: [tests/session.test.ts:13](../../tests/session.test.ts#L13); [tests/e2e/intake.spec.ts:156](../../tests/e2e/intake.spec.ts#L156); [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F033

**Валидация данных** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать ошибки budget/schema до apply.

Код / foundations: [src/features/intake/Intake.tsx:36](../../src/features/intake/Intake.tsx#L36); [src/features/intake/Review.tsx:52](../../src/features/intake/Review.tsx#L52)

Именованные проверки: [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94); [tests/e2e/intake.spec.ts:130](../../tests/e2e/intake.spec.ts#L130)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F034

**Предпросмотр ответов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать review фактических draft ответов.

Код / foundations: [src/features/intake/Review.tsx:12](../../src/features/intake/Review.tsx#L12)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:16](../../tests/e2e/exp02.spec.ts#L16)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F035

**Подсчёт подходящих вариантов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Считать preview тем же SearchService, что каталог.

Код / foundations: [src/features/intake/Review.tsx:10](../../src/features/intake/Review.tsx#L10); [src/features/search/Catalog.tsx:22](../../src/features/search/Catalog.tsx#L22)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/phases28-35.spec.ts:85](../../tests/e2e/phases28-35.spec.ts#L85)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F036

**Переход к результатам** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Применить валидный draft только явным CTA.

Код / foundations: [src/features/intake/Review.tsx:61](../../src/features/intake/Review.tsx#L61); [src/app/AppState.tsx:19](../../src/app/AppState.tsx#L19)

Именованные проверки: [tests/e2e/exp02.spec.ts:46](../../tests/e2e/exp02.spec.ts#L46); [tests/e2e/exp02.spec.ts:94](../../tests/e2e/exp02.spec.ts#L94)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-02](PHASE_PROGRESS.md#exp-02). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

EXP-02: AUTOMATED_VERIFIED_SYNTHETIC; [AC/evidence](../expansion/stages/EXP-02.md). Human UAT/native KK NOT_RUN.

## F037

**Поиск специалистов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Искать по имени/категории и конечным RU/KK aliases.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. NFKC/name/finite RU/KK aliases, literal query and current input. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F038

**Поиск конкретных услуг** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Выбирать конкретную услугу до группировки специалистов.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Own localized title and fixed selectedOfferId; sibling title/language denial. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F039

**Фильтрация по категории** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Применить hard OR к категориям.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Category hard OR, AND across fields on the same offer. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F040

**Фильтрация по возрасту** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Проверить полное включение возрастной группы, partial=unknown.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. All5 age groups: inclusive endpoints, partial unknown, disjoint fail. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F041

**Фильтрация по языку** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Проверить актуальный язык конкретного offer.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Hard/soft language; missing/future/source unknown. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F042

**Фильтрация по формату** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Проверить формат конкретного offer.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Hard format pass/fail/unknown; independent per offer. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F043

**Фильтрация по району** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Применить район с учётом online-only semantics.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Hard district; online-only inactive, online cannot assert offline district. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F044

**Фильтрация по бюджету** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Применить budgetHard/soft с точной семантикой цены.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Hard/soft budget;6000/6001 and100000 boundaries. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F045

**Учёт неизвестной цены** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Не превращать неизвестную цену в 0 KZT.

Код / foundations: [src/domain/matching.ts:72](../../src/domain/matching.ts#L72); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/matching.test.ts:66](../../tests/matching.test.ts#L66); [tests/matching.test.ts:90](../../tests/matching.test.ts#L90); [tests/search.test.ts:69](../../tests/search.test.ts#L69)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Unknown price=null/incomplete for hard0; never free or pass. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F046

**Учёт бесплатных услуг** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Считать free только явно известной ценой 0.

Код / foundations: [src/domain/catalog.ts:26](../../src/domain/catalog.ts#L26); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/p0.test.ts:37](../../tests/p0.test.ts#L37); [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/matching.test.ts:36](../../tests/matching.test.ts#L36)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Explicit free0 passes hard0 if current; stale free does not. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F047

**Учёт указанной доступности** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Не выдавать accepting enquiries за подтверждённую запись.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Availability preference; true/false/null/stale/future, no slot or booking claim. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F048

**Комбинация фильтров** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Совместить фильтры на одной услуге.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Actual combined-filter UI and200 seeded four-offer hard oracle. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F049

**Сброс фильтров** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сбросить applied условия только по действию пользователя.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Draft reset/cancel and explicit full applied reset retain locale. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F050

**Hard constraints** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Исключить hard fail, отделить hard unknown.

Код / foundations: [src/domain/matching.ts:28](../../src/domain/matching.ts#L28); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/search.test.ts:42](../../tests/search.test.ts#L42); [tests/p0.test.ts:50](../../tests/p0.test.ts#L50); [tests/matching.test.ts:31](../../tests/matching.test.ts#L31)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Fail dominates unknown and soft score; unknown never exact. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F051

**Soft preferences** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Менять rank soft preferences без обхода hard.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Soft rank never enlarges hard eligibility; persisted soft edits. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F052

**Расчёт matching score** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Считать score по общему набору факторов запроса.

Код / foundations: [src/domain/matching.ts:118](../../src/domain/matching.ts#L118); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/matching.test.ts:96](../../tests/matching.test.ts#L96); [tests/matching.test.ts:196](../../tests/matching.test.ts#L196); [tests/p0.test.ts:56](../../tests/p0.test.ts#L56)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Request-wide denominator100, exact score100, partial72.5; neutral null. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F053

**Расчёт полноты данных** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Считать coverage отдельно от score.

Код / foundations: [src/domain/matching.ts:119](../../src/domain/matching.ts#L119); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/matching.test.ts:96](../../tests/matching.test.ts#L96); [tests/p0.test.ts:56](../../tests/p0.test.ts#L56); [tests/search.test.ts:15](../../tests/search.test.ts#L15)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Coverage independent of score; false known; unknown loses coverage. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F054

**Объяснение соответствия** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать same-offer reasons/unknown/mismatch с evidence.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Same-offer evidence and typed RU/KK match/unknown/mismatch; stale explanations. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F055

**Разделение точных и неполных совпадений** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Разделить exact и incomplete группы без двойного подсчёта.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Exact/incomplete separated; specialist counted once; no hard failures in incomplete. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F056

**Проверка актуальности информации** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Проверять dated field provenance; updatedAt не освежает факт.

Код / foundations: [src/domain/freshness.ts:20](../../src/domain/freshness.ts#L20); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/matching.test.ts:47](../../tests/matching.test.ts#L47); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Independent TTL/exact boundary/future/missing/source; updatedAt cannot refresh or verify. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F057

**Стабильная сортировка** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Дать детерминированный tie-break и отдельные price/district rules.

Код / foundations: [src/domain/SearchService.ts:93](../../src/domain/SearchService.ts#L93); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/matching.test.ts:150](../../tests/matching.test.ts#L150); [tests/search.test.ts:55](../../tests/search.test.ts#L55); [tests/search.test.ts:15](../../tests/search.test.ts#L15)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Ordinal ID ties, reversed permutations, repeated search; price/district ordering. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F058

**Обработка отсутствия результатов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать честную нулевую выдачу с ручным изменением условий.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Exact0 and incomplete stay honest through cancel/locale/reload; manual actions only. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F059

**Сохранение условий при переходах** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сохранить условия и возврат из профиля/сравнения.

Код / foundations: [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1); [src/features/search/conditions.ts:1](../../src/features/search/conditions.ts#L1)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Same-tab applied conditions/IDs/sort persist through profile/compare/history/reload. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F060

**Защита от смешивания условий разных услуг одного специалиста** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Не объединять язык одного offer с ценой/форматом другого.

Код / foundations: [src/domain/SearchService.ts:81](../../src/domain/SearchService.ts#L81); [src/features/search/Catalog.tsx:1](../../src/features/search/Catalog.tsx#L1); [src/features/search/Filters.tsx:1](../../src/features/search/Filters.tsx#L1)

Именованные проверки: [tests/matching.test.ts:112](../../tests/matching.test.ts#L112); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-03](PHASE_PROGRESS.md#exp-03). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

**EXP-03 execution:** VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO); source `ac82ec7209de0ec5e0154947193cafcb7be856ba`. Adversarial siblings: attributes/title/category never combine;200 seeded catalogs. [Evidence/matrix](../expansion/stages/EXP-03.md). Human/live: BLOCKED_EXTERNAL.

## F061

**Карточка специалиста** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. ALREADY_VERIFIED.

Код: [src/features/profile/OfferProfile.tsx](../../src/features/profile/OfferProfile.tsx); [src/domain/profile.ts](../../src/domain/profile.ts)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); [tests/profile.test.ts](../../tests/profile.test.ts); P04-T01, P04-T03, P04-T04, P04-T05, P04-T06, P04-T10.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F062

**Несколько услуг одного специалиста** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/profile/OfferProfile.tsx](../../src/features/profile/OfferProfile.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); P04-T02, P04-T08, P04-T32, P04-T44.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F063

**Подробные условия услуги** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/search/OfferCard.tsx](../../src/features/search/OfferCard.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T02, P04-T14, P04-T15, P04-T16.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F064

**Цена и продолжительность** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/search/OfferCard.tsx](../../src/features/search/OfferCard.tsx); [src/i18n/price.ts](../../src/i18n/price.ts)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T11, P04-T12, P04-T13, P04-T16.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F065

**Адрес и формат** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/search/OfferCard.tsx](../../src/features/search/OfferCard.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); P04-T14, P04-T36.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F066

**Паспорт доверия** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/profile/TrustPassport.tsx](../../src/features/profile/TrustPassport.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T18, P04-T19, P04-T25, P04-T26.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F067

**Статус проверки** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/domain/profile.ts](../../src/domain/profile.ts)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T19, P04-T20, P04-T21, P04-T22, P04-T23, P04-T24.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F068

**Источник информации** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/profile/TrustPassport.tsx](../../src/features/profile/TrustPassport.tsx); [src/domain/SearchService.ts](../../src/domain/SearchService.ts)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T18, P04-T24, P04-T26, P04-T43.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F069

**Дата проверки** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/domain/profile.ts](../../src/domain/profile.ts); [src/domain/freshness.ts](../../src/domain/freshness.ts); [src/i18n/date.ts](../../src/i18n/date.ts)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T17, P04-T21, P04-T22.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F070

**Неизвестные сведения** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/search/OfferCard.tsx](../../src/features/search/OfferCard.tsx); [src/features/profile/TrustPassport.tsx](../../src/features/profile/TrustPassport.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T10, P04-T12, P04-T15, P04-T24.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F071

**Сравнение специалистов** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/search/SelectionViews.tsx](../../src/features/search/SelectionViews.tsx)

Тесты: [tests/e2e/exp04-state.spec.ts](../../tests/e2e/exp04-state.spec.ts); [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); P04-T28, P04-T32, P04-T33, P04-T34.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F072

**Добавление в сравнение** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. ALREADY_VERIFIED.

Код: [src/app/AppState.tsx](../../src/app/AppState.tsx); [src/features/search/CompareTray.tsx](../../src/features/search/CompareTray.tsx)

Тесты: [tests/e2e/exp04-state.spec.ts](../../tests/e2e/exp04-state.spec.ts); [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); P04-T28, P04-T29, P04-T30, P04-T32, P04-T33.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F073

**Удаление из сравнения** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/app/AppState.tsx](../../src/app/AppState.tsx); [src/features/search/SelectionViews.tsx](../../src/features/search/SelectionViews.tsx)

Тесты: [tests/e2e/exp04-state.spec.ts](../../tests/e2e/exp04-state.spec.ts); [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); P04-T31, P04-T34, P04-T38.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F074

**Сравнение условий** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/features/search/SelectionViews.tsx](../../src/features/search/SelectionViews.tsx); [src/features/search/OfferCard.tsx](../../src/features/search/OfferCard.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); [tests/exp04.test.ts](../../tests/exp04.test.ts); P04-T11, P04-T13, P04-T16, P04-T18, P04-T25, P04-T36.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F075

**Side-by-side сравнение на компьютере** — IMPLEMENTED_WITH_LIMITATIONS.

Execution: VERIFIED_DONE (AUTOMATED_SYNTHETIC_DEMO), source `2711bee46cb37aac64f98dafa14103e2dbe545b4`. FIXED_AND_VERIFIED.

Код: [src/styles.css](../../src/styles.css); [src/features/search/SelectionViews.tsx](../../src/features/search/SelectionViews.tsx)

Тесты: [tests/e2e/exp04.spec.ts](../../tests/e2e/exp04.spec.ts); [tests/e2e/profile.spec.ts](../../tests/e2e/profile.spec.ts); P04-T27, P04-T37, P04-T38, P04-T39, P04-T41.

[Per-feature evidence / AC / limits](../expansion/stages/EXP-04.md). HUMAN_QA_PENDING; LIVE_BLOCKED.

## F076

**Создание демозаявки** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Создать только локальную демозаявку на выбранный offer.

Код / foundations: [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:49](../../tests/intent-recovery.test.ts#L49)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F077

**Подтверждение деморежима** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Требовать явное подтверждение demo перед сохранением.

Код / foundations: [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:49](../../tests/intent-recovery.test.ts#L49)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F078

**Локальное сохранение заявки** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать успех только после IndexedDB commit.

Код / foundations: [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:49](../../tests/intent-recovery.test.ts#L49)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F079

**Защита от дублирования** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Использовать один idempotency key при retry/double click.

Код / foundations: [src/domain/DemoRequestService.ts:35](../../src/domain/DemoRequestService.ts#L35); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:114](../../tests/requests.test.ts#L114); [tests/e2e/requests.spec.ts:39](../../tests/e2e/requests.spec.ts#L39); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F080

**Просмотр заявки** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Показать persisted snapshot по UUID с reload.

Код / foundations: [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:49](../../tests/intent-recovery.test.ts#L49)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F081

**Отмена заявки** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сделать cancelled_demo терминальным и повторяемым.

Код / foundations: [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:49](../../tests/intent-recovery.test.ts#L49)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F082

**Очистка заявок** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Удалить только demo requests после подтверждения.

Код / foundations: [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1); [src/features/profile/DemoRequestEntry.tsx:1](../../src/features/profile/DemoRequestEntry.tsx#L1)

Именованные проверки: [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:49](../../tests/intent-recovery.test.ts#L49)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F083

**Восстановление после ошибок** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Различить повреждение intent и отказ storage; reconcile uncertain write.

Код / foundations: [src/app/requestAttempt.ts:10](../../src/app/requestAttempt.ts#L10); [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1)

Именованные проверки: [tests/intent-recovery.test.ts:42](../../tests/intent-recovery.test.ts#L42); [tests/intent-recovery.test.ts:62](../../tests/intent-recovery.test.ts#L62); [tests/requests.test.ts:26](../../tests/requests.test.ts#L26)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F084

**Контроль срока хранения** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Удалять истёкшие demo requests по политике 7 дней.

Код / foundations: [src/domain/demoRequest.ts:4](../../src/domain/demoRequest.ts#L4); [src/domain/DemoRequestService.ts:1](../../src/domain/DemoRequestService.ts#L1); [src/data/IndexedDbRequestRepository.ts:1](../../src/data/IndexedDbRequestRepository.ts#L1)

Именованные проверки: [tests/requests.test.ts:72](../../tests/requests.test.ts#L72); [tests/requests.test.ts:175](../../tests/requests.test.ts#L175); [tests/e2e/requests.spec.ts:135](../../tests/e2e/requests.spec.ts#L135)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F085

**PWA и сохранённые офлайн-карточки** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Сохранять только явно выбранные synthetic public snapshots и shell.

Код / foundations: [src/features/pilot/SavedDemo.tsx:17](../../src/features/pilot/SavedDemo.tsx#L17); [public/sw.js:12](../../public/sw.js#L12); [vite.config.ts:12](../../vite.config.ts#L12)

Именованные проверки: [tests/pilot-e2e/offline.spec.ts:2](../../tests/pilot-e2e/offline.spec.ts#L2); [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/requests.test.ts:35](../../tests/requests.test.ts#L35)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F086

**Карта синтетических специалистов** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Строить synthetic map только по SearchResult matchingOfferIds.

Код / foundations: [src/domain/map.ts:5](../../src/domain/map.ts#L5); [src/features/search/ResultMap.tsx:7](../../src/features/search/ResultMap.tsx#L7); [src/features/search/Catalog.tsx:87](../../src/features/search/Catalog.tsx#L87)

Именованные проверки: [tests/pilot-e2e/offline.spec.ts:10](../../tests/pilot-e2e/offline.spec.ts#L10); [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/requests.test.ts:35](../../tests/requests.test.ts#L35)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F087

**Базовая доступность интерфейса и локализация дат** — IMPLEMENTED_WITH_LIMITATIONS.

Требование / AC: Поддержать keyboard/reflow/reduced motion и Intl даты; field audit отдельно.

Код / foundations: [src/features/pilot/SavedDemo.tsx:20](../../src/features/pilot/SavedDemo.tsx#L20); [src/app/App.tsx:50](../../src/app/App.tsx#L50); [src/styles.css:251](../../src/styles.css#L251)

Именованные проверки: [tests/e2e/requests.spec.ts:185](../../tests/e2e/requests.spec.ts#L185); [tests/requests.test.ts:26](../../tests/requests.test.ts#L26); [tests/requests.test.ts:35](../../tests/requests.test.ts#L35)

Осталось: Граница DEMO: синтетический каталог; human comprehension/native KK/real-device приёмка не выполнены.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-05](PHASE_PROGRESS.md#exp-05). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F088

**Тестовый вход** — PILOT_TEST_ONLY.

Требование / AC: Войти только synthetic actor в PILOT_TEST на loopback.

Код / foundations: [server/http.ts:30](../../server/http.ts#L30); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F089

**Роли родителей** — PILOT_TEST_ONLY.

Требование / AC: Определять parent роль на сервере.

Код / foundations: [server/service.ts:4](../../server/service.ts#L4); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F090

**Роли специалистов** — PILOT_TEST_ONLY.

Требование / AC: Определять specialist роль на сервере.

Код / foundations: [server/service.ts:4](../../server/service.ts#L4); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:60](../../tests/pilot.test.ts#L60); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F091

**Роль модератора** — PILOT_TEST_ONLY.

Требование / AC: Разрешать решения назначенному moderator.

Код / foundations: [server/service.ts:105](../../server/service.ts#L105); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:52](../../tests/pilot.test.ts#L52); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F092

**Роль администратора** — PILOT_TEST_ONLY.

Требование / AC: Предоставить admin audit и scope revoke без чтения diary по роли.

Код / foundations: [server/service.ts:50](../../server/service.ts#L50); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F093

**Проверка доступа** — PILOT_TEST_ONLY.

Требование / AC: Проверять session/CSRF/origin/actor/owner на сервере.

Код / foundations: [server/http.ts:47](../../server/http.ts#L47); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F094

**Разделение данных пользователей** — PILOT_TEST_ONLY.

Требование / AC: Изолировать PARENT_A/B и приватные ресурсы.

Код / foundations: [server/service.ts:35](../../server/service.ts#L35); [src/features/pilot/Pilot.tsx:1](../../src/features/pilot/Pilot.tsx#L1); [src/features/pilot/api.ts:1](../../src/features/pilot/api.ts#L1)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-06](PHASE_PROGRESS.md#exp-06). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F095

**Создание анкеты специалиста** — PILOT_TEST_ONLY.

Требование / AC: Создать schema-valid одну application услуги с consent.

Код / foundations: [server/service.ts:87](../../server/service.ts#L87); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:47](../../tests/pilot.test.ts#L47); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F096

**Редактирование анкеты** — PILOT_TEST_ONLY.

Требование / AC: Редактировать application с optimistic version и новым review.

Код / foundations: [server/service.ts:88](../../server/service.ts#L88); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:52](../../tests/pilot.test.ts#L52); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F097

**Отправка на модерацию** — PILOT_TEST_ONLY.

Требование / AC: Отправить draft/needs_changes на moderation.

Код / foundations: [server/service.ts:95](../../server/service.ts#L95); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:52](../../tests/pilot.test.ts#L52); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F098

**Проверка полноты** — PILOT_TEST_ONLY.

Требование / AC: Отклонить неполную/невалидную application на contract boundary.

Код / foundations: [server/contracts.ts:9](../../server/contracts.ts#L9); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:42](../../tests/pilot.test.ts#L42); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F099

**Одобрение анкеты** — PILOT_TEST_ONLY.

Требование / AC: Публиковать только разрешённым решением moderator.

Код / foundations: [server/service.ts:105](../../server/service.ts#L105); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:47](../../tests/pilot.test.ts#L47); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F100

**Возврат на доработку** — PILOT_TEST_ONLY.

Требование / AC: Вернуть application в needs_changes и разрешить resubmit.

Код / foundations: [server/contracts.ts:29](../../server/contracts.ts#L29); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:52](../../tests/pilot.test.ts#L52); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F101

**Отклонение** — PILOT_TEST_ONLY.

Требование / AC: Сохранить rejected решение с evidence metadata.

Код / foundations: [server/contracts.ts:29](../../server/contracts.ts#L29); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:52](../../tests/pilot.test.ts#L52); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F102

**Публикация** — PILOT_TEST_ONLY.

Требование / AC: Показать только allowlisted published public projection.

Код / foundations: [server/service.ts:29](../../server/service.ts#L29); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:47](../../tests/pilot.test.ts#L47); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F103

**Отзыв публикации** — PILOT_TEST_ONLY.

Требование / AC: Убрать withdrawn из publicOffers немедленно.

Код / foundations: [server/service.ts:98](../../server/service.ts#L98); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:52](../../tests/pilot.test.ts#L52); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F104

**История модерации** — PILOT_TEST_ONLY.

Требование / AC: Сохранить moderation audit metadata; полного case-history UI нет.

Код / foundations: [server/store.ts:41](../../server/store.ts#L41); [src/features/pilot/Onboarding.tsx:1](../../src/features/pilot/Onboarding.tsx#L1); [src/features/pilot/Forms.tsx:1](../../src/features/pilot/Forms.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена. История ограничена audit metadata для admin и текущим решением; полного журнала кейса moderator UI нет.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-07](PHASE_PROGRESS.md#exp-07). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F105

**Серверное создание обращения** — PILOT_TEST_ONLY.

Требование / AC: Атомарно сохранить contact и scheduled sandbox job.

Код / foundations: [server/service.ts:117](../../server/service.ts#L117); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:66](../../tests/pilot.test.ts#L66); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F106

**Внутренний ящик специалиста** — PILOT_TEST_ONLY.

Требование / AC: Показать sandbox contact только recipient специалисту.

Код / foundations: [server/service.ts:230](../../server/service.ts#L230); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:75](../../tests/pilot.test.ts#L75); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F107

**Отслеживание статуса обращения** — PILOT_TEST_ONLY.

Требование / AC: Показать server_received/sandbox_available/responded и history.

Код / foundations: [src/features/pilot/Contacts.tsx:22](../../src/features/pilot/Contacts.tsx#L22); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1); [server/contracts.ts:1](../../server/contracts.ts#L1)

Именованные проверки: [tests/pilot.test.ts:75](../../tests/pilot.test.ts#L75); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F108

**Ответ специалиста** — PILOT_TEST_ONLY.

Требование / AC: Разрешить ответ только recipient специалисту.

Код / foundations: [server/service.ts:122](../../server/service.ts#L122); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:75](../../tests/pilot.test.ts#L75); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F109

**Подтверждение записи** — PILOT_TEST_ONLY.

Требование / AC: Разрешить appointment_confirmed только specialist action в synthetic pilot.

Код / foundations: [server/service.ts:129](../../server/service.ts#L129); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:75](../../tests/pilot.test.ts#L75); [tests/pilot-e2e/pilot.spec.ts:39](../../tests/pilot-e2e/pilot.spec.ts#L39); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F110

**Отмена обращения** — PILOT_TEST_ONLY.

Требование / AC: Отменить собственное contact и связанные jobs/events.

Код / foundations: [server/service.ts:127](../../server/service.ts#L127); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:82](../../tests/pilot.test.ts#L82); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F111

**История изменений** — PILOT_TEST_ONLY.

Требование / AC: Сохранить actor/source/time для contact transitions.

Код / foundations: [server/contracts.ts:56](../../server/contracts.ts#L56); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:75](../../tests/pilot.test.ts#L75); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F112

**Защита от повторной отправки** — PILOT_TEST_ONLY.

Требование / AC: Повторить key+payload без дубля; другой payload=409.

Код / foundations: [server/service.ts:68](../../server/service.ts#L68); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:66](../../tests/pilot.test.ts#L66); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F113

**Хранение обращения в SQLite** — PILOT_TEST_ONLY.

Требование / AC: Сохранить contact в SQLite и восстановить после restart.

Код / foundations: [server/migrations/001_pilot.sql:12](../../server/migrations/001_pilot.sql#L12); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:66](../../tests/pilot.test.ts#L66); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F114

**Проверка прав владельца** — PILOT_TEST_ONLY.

Требование / AC: Запретить чужие contact read/write по owner/recipient.

Код / foundations: [server/service.ts:27](../../server/service.ts#L27); [src/features/pilot/Contacts.tsx:1](../../src/features/pilot/Contacts.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:71](../../tests/pilot.test.ts#L71); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-08](PHASE_PROGRESS.md#exp-08). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F115

**Личный календарь** — PILOT_TEST_ONLY.

Требование / AC: Показать персональный timed agenda.

Код / foundations: [src/features/pilot/Calendar.tsx:11](../../src/features/pilot/Calendar.tsx#L11); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1); [server/service.ts:1](../../server/service.ts#L1)

Именованные проверки: [tests/pilot.test.ts:100](../../tests/pilot.test.ts#L100); [tests/pilot.test.ts:104](../../tests/pilot.test.ts#L104); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F116

**Создание событий** — PILOT_TEST_ONLY.

Требование / AC: Создать manual planned event с ISO offset/IANA zone.

Код / foundations: [server/service.ts:143](../../server/service.ts#L143); [src/features/pilot/Calendar.tsx:1](../../src/features/pilot/Calendar.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:100](../../tests/pilot.test.ts#L100); [tests/pilot.test.ts:104](../../tests/pilot.test.ts#L104); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F117

**Редактирование событий** — PILOT_TEST_ONLY.

Требование / AC: Изменить свой event с version check.

Код / foundations: [server/service.ts:144](../../server/service.ts#L144); [src/features/pilot/Calendar.tsx:1](../../src/features/pilot/Calendar.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:109](../../tests/pilot.test.ts#L109); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F118

**Подтверждённые события** — PILOT_TEST_ONLY.

Требование / AC: Создать confirmed event только из contact.confirm.

Код / foundations: [server/service.ts:133](../../server/service.ts#L133); [src/features/pilot/Calendar.tsx:1](../../src/features/pilot/Calendar.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot-e2e/pilot.spec.ts:39](../../tests/pilot-e2e/pilot.spec.ts#L39); [tests/pilot.test.ts:100](../../tests/pilot.test.ts#L100); [tests/pilot.test.ts:104](../../tests/pilot.test.ts#L104)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F119

**Предупреждение о пересечении времени** — PILOT_TEST_ONLY.

Требование / AC: Показать overlap warning; это не server slot lock.

Код / foundations: [src/features/pilot/Calendar.tsx:13](../../src/features/pilot/Calendar.tsx#L13); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1); [server/service.ts:1](../../server/service.ts#L1)

Именованные проверки: [tests/pilot-e2e/pilot.spec.ts:39](../../tests/pilot-e2e/pilot.spec.ts#L39); [tests/pilot.test.ts:100](../../tests/pilot.test.ts#L100); [tests/pilot.test.ts:104](../../tests/pilot.test.ts#L104)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена. Пересечение предупреждается в UI; атомарного бронирования слота нет.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F120

**Напоминания внутри приложения** — PILOT_TEST_ONLY.

Требование / AC: Создать opt-in in-app reminder при работающем сервере.

Код / foundations: [server/service.ts:202](../../server/service.ts#L202); [src/features/pilot/Calendar.tsx:1](../../src/features/pilot/Calendar.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:113](../../tests/pilot.test.ts#L113); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F121

**Подписка на изменения условий услуги** — PILOT_TEST_ONLY.

Требование / AC: Подписаться на изменения конкретного published offer.

Код / foundations: [server/service.ts:155](../../server/service.ts#L155); [src/features/pilot/Calendar.tsx:1](../../src/features/pilot/Calendar.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:125](../../tests/pilot.test.ts#L125); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F122

**Уведомления об изменениях внутри приложения** — PILOT_TEST_ONLY.

Требование / AC: Дать allowlisted diff in-app с dedup; не внешнюю отправку.

Код / foundations: [server/service.ts:208](../../server/service.ts#L208); [src/features/pilot/Calendar.tsx:1](../../src/features/pilot/Calendar.tsx#L1); [src/features/pilot/Inbox.tsx:1](../../src/features/pilot/Inbox.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:125](../../tests/pilot.test.ts#L125); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-09](PHASE_PROGRESS.md#exp-09). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F123

**Следующий организационный шаг** — PILOT_TEST_ONLY.

Требование / AC: Вывести следующий организационный шаг из contact/calendar.

Код / foundations: [server/service.ts:53](../../server/service.ts#L53); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:131](../../tests/pilot.test.ts#L131); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F124

**Отметка выполнения шага** — PILOT_TEST_ONLY.

Требование / AC: Отметить/отложить/скрыть шаг без изменения lifecycle записи.

Код / foundations: [server/service.ts:160](../../server/service.ts#L160); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:131](../../tests/pilot.test.ts#L131); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F125

**Личные цели** — PILOT_TEST_ONLY.

Требование / AC: Создать/изменить/удалить свои synthetic goals.

Код / foundations: [server/service.ts:165](../../server/service.ts#L165); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:142](../../tests/pilot.test.ts#L142); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F126

**Приватный дневник** — PILOT_TEST_ONLY.

Требование / AC: Ограничить diary владельцем и scrub text при delete.

Код / foundations: [server/service.ts:168](../../server/service.ts#L168); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:136](../../tests/pilot.test.ts#L136); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F127

**Задания от специалиста** — PILOT_TEST_ONLY.

Требование / AC: Выдать versioned instruction только scoped recipient.

Код / foundations: [server/service.ts:171](../../server/service.ts#L171); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:155](../../tests/pilot.test.ts#L155); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F128

**Ответы родителя на задания** — PILOT_TEST_ONLY.

Требование / AC: Ответить по instructionVersion, включая unable/question.

Код / foundations: [server/service.ts:183](../../server/service.ts#L183); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:155](../../tests/pilot.test.ts#L155); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F129

**Формирование выборочной сводки** — PILOT_TEST_ONLY.

Требование / AC: Сформировать default-empty exact owner-checked summary.

Код / foundations: [server/service.ts:188](../../server/service.ts#L188); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [src/features/pilot/PrivateRecords.tsx:1](../../src/features/pilot/PrivateRecords.tsx#L1)

Именованные проверки: [tests/pilot.test.ts:165](../../tests/pilot.test.ts#L165); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F130

**Копирование и скачивание сводки** — PILOT_TEST_ONLY.

Требование / AC: Скопировать/скачать выбранный draft; не отправлять его.

Код / foundations: [src/features/pilot/PrivateRecords.tsx:36](../../src/features/pilot/PrivateRecords.tsx#L36); [src/features/pilot/NextAction.tsx:1](../../src/features/pilot/NextAction.tsx#L1); [server/service.ts:1](../../server/service.ts#L1)

Именованные проверки: [tests/pilot.test.ts:131](../../tests/pilot.test.ts#L131); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Только synthetic accounts и test consent; live функциональность не разрешена.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-10](PHASE_PROGRESS.md#exp-10). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F131

**Интерактивная AI-Қарлығаш** — PLANNED.

Требование / AC: Предлагается: Интерактивная AI-Қарлығаш. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F132

**Диалоговый помощник родителя** — PLANNED.

Требование / AC: Предлагается: Диалоговый помощник родителя. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F133

**Объяснение категорий специалистов** — PLANNED.

Требование / AC: Предлагается: Объяснение категорий специалистов. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F134

**AI-помощь при заполнении анкеты** — PLANNED.

Требование / AC: Предлагается: AI-помощь при заполнении анкеты. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F135

**Объяснение результатов простым языком** — PARTIALLY_IMPLEMENTED.

Требование / AC: Предлагается: Объяснение результатов простым языком. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: [src/features/search/OfferCard.tsx:34](../../src/features/search/OfferCard.tsx#L34)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Есть same-offer explanations, но нет assistant dialogue/source-guided simplification.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F136

**Trust Gap Assistant** — PLANNED.

Требование / AC: Предлагается: Trust Gap Assistant. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F137

**Smart Zero Results** — PARTIALLY_IMPLEMENTED.

Требование / AC: Предлагается: Smart Zero Results. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: [src/features/search/Catalog.tsx:79](../../src/features/search/Catalog.tsx#L79)

Именованные проверки: [tests/matching.test.ts:31](../../tests/matching.test.ts#L31); [tests/search.test.ts:15](../../tests/search.test.ts#L15); [tests/search.test.ts:28](../../tests/search.test.ts#L28)

Осталось: Есть empty state и ручное изменение фильтров; нет объяснения исключающих ограничений.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F138

**AI-подготовка вопросов специалисту** — PLANNED.

Требование / AC: Предлагается: AI-подготовка вопросов специалисту. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F139

**AI-перевод сложных описаний** — PLANNED.

Требование / AC: Предлагается: AI-перевод сложных описаний. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F140

**AI-помощник по навигации** — PLANNED.

Требование / AC: Предлагается: AI-помощник по навигации. Общий технический контракт: EXP-11.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-11](PHASE_PROGRESS.md#exp-11). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F141

**Голосовой ввод RU/KK** — PLANNED.

Требование / AC: Предлагается: Голосовой ввод RU/KK. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F142

**Голосовое управление** — PLANNED.

Требование / AC: Предлагается: Голосовое управление. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F143

**Озвучивание интерфейса** — PLANNED.

Требование / AC: Предлагается: Озвучивание интерфейса. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F144

**Персонализированные подсказки Қарлығаш** — PLANNED.

Требование / AC: Предлагается: Персонализированные подсказки Қарлығаш. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F145

**AI-сводка организационной истории** — PLANNED.

Требование / AC: Предлагается: AI-сводка организационной истории. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F146

**AI-помощь специалисту при заполнении профиля** — PLANNED.

Требование / AC: Предлагается: AI-помощь специалисту при заполнении профиля. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F147

**Поиск на естественном языке** — PLANNED.

Требование / AC: Предлагается: Поиск на естественном языке. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F148

**Семантический поиск** — PLANNED.

Требование / AC: Предлагается: Семантический поиск. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F149

**Объяснение различий между вариантами** — PARTIALLY_IMPLEMENTED.

Требование / AC: Предлагается: Объяснение различий между вариантами. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: [src/features/search/SelectionViews.tsx:8](../../src/features/search/SelectionViews.tsx#L8)

Именованные проверки: [tests/profile.test.ts:10](../../tests/profile.test.ts#L10); [tests/e2e/profile.spec.ts:20](../../tests/e2e/profile.spec.ts#L20); [tests/e2e/profile.spec.ts:42](../../tests/e2e/profile.spec.ts#L42)

Осталось: Есть сравнение условий; отсутствует assistant explanation of differences.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F150

**AI-проверка полноты сведений без автоматической верификации** — PARTIALLY_IMPLEMENTED.

Требование / AC: Предлагается: AI-проверка полноты сведений без автоматической верификации. Общий технический контракт: EXP-12.technical_architecture.

Код / foundations: [server/contracts.ts:9](../../server/contracts.ts#L9)

Именованные проверки: [tests/pilot.test.ts:34](../../tests/pilot.test.ts#L34); [tests/pilot-e2e/pilot.spec.ts:7](../../tests/pilot-e2e/pilot.spec.ts#L7); [tests/pilot-e2e/pilot.spec.ts:28](../../tests/pilot-e2e/pilot.spec.ts#L28)

Осталось: Есть Zod/required completeness checks; нет AI completeness assistance.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-12](PHASE_PROGRESS.md#exp-12). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F151

**Accessibility Fit: подбор по доступности среды** — PLANNED.

Требование / AC: Предлагается: Accessibility Fit: подбор по доступности среды. Общий технический контракт: EXP-13.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-13](PHASE_PROGRESS.md#exp-13). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F152

**True Cost Calculator: полная стоимость поддержки** — PLANNED.

Требование / AC: Предлагается: True Cost Calculator: полная стоимость поддержки. Общий технический контракт: EXP-13.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-13](PHASE_PROGRESS.md#exp-13). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F153

**Учёт расходов на дорогу** — PLANNED.

Требование / AC: Предлагается: Учёт расходов на дорогу. Общий технический контракт: EXP-13.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-13](PHASE_PROGRESS.md#exp-13). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F154

**Учёт регулярности занятий** — PLANNED.

Требование / AC: Предлагается: Учёт регулярности занятий. Общий технический контракт: EXP-13.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-13](PHASE_PROGRESS.md#exp-13). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F155

**Подтверждённые свободные слоты** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Подтверждённые свободные слоты. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F156

**Реальная транспортная доступность** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Реальная транспортная доступность. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F157

**Расчёт маршрута** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Расчёт маршрута. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F158

**Общественный транспорт** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Общественный транспорт. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F159

**Подбор нескольких услуг для семьи** — PLANNED.

Требование / AC: Предлагается: Подбор нескольких услуг для семьи. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F160

**Поиск по нескольким районам** — PLANNED.

Требование / AC: Предлагается: Поиск по нескольким районам. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F161

**Сохранённые поисковые запросы** — PLANNED.

Требование / AC: Предлагается: Сохранённые поисковые запросы. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F162

**Подписка на новые подходящие предложения** — PLANNED.

Требование / AC: Предлагается: Подписка на новые подходящие предложения. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F163

**Уведомления о новых специалистах** — PLANNED.

Требование / AC: Предлагается: Уведомления о новых специалистах. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F164

**Альтернативы при отмене записи** — PLANNED.

Требование / AC: Предлагается: Альтернативы при отмене записи. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F165

**Контроль актуальности свободных мест** — PLANNED.

Требование / AC: Предлагается: Контроль актуальности свободных мест. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F166

**Объяснение компромиссов** — PLANNED.

Требование / AC: Предлагается: Объяснение компромиссов. Общий технический контракт: EXP-14.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-14](PHASE_PROGRESS.md#exp-14). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F167

**Поиск бесплатных программ** — PLANNED.

Требование / AC: Предлагается: Поиск бесплатных программ. Общий технический контракт: EXP-15.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-15](PHASE_PROGRESS.md#exp-15). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F168

**Поиск субсидируемых услуг** — PLANNED.

Требование / AC: Предлагается: Поиск субсидируемых услуг. Общий технический контракт: EXP-15.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-15](PHASE_PROGRESS.md#exp-15). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F169

**Поиск по условиям участия в программах** — PLANNED.

Требование / AC: Предлагается: Поиск по условиям участия в программах. Общий технический контракт: EXP-15.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-15](PHASE_PROGRESS.md#exp-15). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F170

**Social Support Navigator** — PLANNED.

Требование / AC: Предлагается: Social Support Navigator. Общий технический контракт: EXP-15.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-15](PHASE_PROGRESS.md#exp-15). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F171

**Реальная регистрация** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Реальная регистрация. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F172

**Восстановление аккаунта** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Восстановление аккаунта. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F173

**Защищённый профиль семьи** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Защищённый профиль семьи. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F174

**Приглашение второго родителя** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Приглашение второго родителя. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F175

**Совместный семейный календарь** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Совместный семейный календарь. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F176

**Раздельные права членов семьи** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Раздельные права членов семьи. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F177

**Отзыв доступа** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Отзыв доступа. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F178

**История согласий** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: История согласий. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F179

**Отзыв согласия** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Отзыв согласия. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F180

**Безопасный экспорт семейных данных** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Безопасный экспорт семейных данных. Общий технический контракт: EXP-16.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-16](PHASE_PROGRESS.md#exp-16). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F181

**Удаление аккаунта и данных по утверждённой процедуре** — PLANNED.

Требование / AC: Предлагается: Удаление аккаунта и данных по утверждённой процедуре. Общий технический контракт: EXP-17.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-17](PHASE_PROGRESS.md#exp-17). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F182

**Семейные организационные задачи** — PLANNED.

Требование / AC: Предлагается: Семейные организационные задачи. Общий технический контракт: EXP-17.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-17](PHASE_PROGRESS.md#exp-17). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F183

**Совместный список вопросов** — PLANNED.

Требование / AC: Предлагается: Совместный список вопросов. Общий технический контракт: EXP-17.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-17](PHASE_PROGRESS.md#exp-17). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F184

**Общее избранное** — PLANNED.

Требование / AC: Предлагается: Общее избранное. Общий технический контракт: EXP-17.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-17](PHASE_PROGRESS.md#exp-17). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F185

**Передача информации другому опекуну с разрешения** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Передача информации другому опекуну с разрешения. Общий технический контракт: EXP-17.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-17](PHASE_PROGRESS.md#exp-17). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F186

**Реальные обращения специалистам** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Реальные обращения специалистам. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F187

**Подтверждение доставки сообщения** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Подтверждение доставки сообщения. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F188

**Защищённый чат** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Защищённый чат. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F189

**Настоящие свободные слоты** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Настоящие свободные слоты. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F190

**Онлайн-запись** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Онлайн-запись. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F191

**Перенос записи** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Перенос записи. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F192

**Отмена подтверждённой записи** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Отмена подтверждённой записи. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F193

**Push-уведомления** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Push-уведомления. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F194

**Email-уведомления** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Email-уведомления. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F195

**Telegram-уведомления** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Telegram-уведомления. Общий технический контракт: EXP-18.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-18](PHASE_PROGRESS.md#exp-18). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F196

**Интеграция с Google Calendar** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Интеграция с Google Calendar. Общий технический контракт: EXP-19.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-19](PHASE_PROGRESS.md#exp-19). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F197

**Повторяющиеся события** — PLANNED.

Требование / AC: Предлагается: Повторяющиеся события. Общий технический контракт: EXP-19.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-19](PHASE_PROGRESS.md#exp-19). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F198

**Синхронизация расписания специалиста** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Синхронизация расписания специалиста. Общий технический контракт: EXP-19.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-19](PHASE_PROGRESS.md#exp-19). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F199

**Лист ожидания** — PLANNED.

Требование / AC: Предлагается: Лист ожидания. Общий технический контракт: EXP-19.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-19](PHASE_PROGRESS.md#exp-19). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F200

**Предложение освободившегося времени** — PLANNED.

Требование / AC: Предлагается: Предложение освободившегося времени. Общий технический контракт: EXP-19.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-19](PHASE_PROGRESS.md#exp-19). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F201

**Реальная проверка квалификации** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Реальная проверка квалификации. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F202

**Проверка документов ответственным модератором** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Проверка документов ответственным модератором. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F203

**Подтверждение принадлежности профиля специалисту** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Подтверждение принадлежности профиля специалисту. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F204

**Проверка организации** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Проверка организации. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F205

**Повторная проверка устаревших сведений** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Повторная проверка устаревших сведений. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F206

**Жалобы и обращения на проверку** — PARTIALLY_IMPLEMENTED.

Требование / AC: Предлагается: Жалобы и обращения на проверку. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: [server/service.ts:114](../../server/service.ts#L114); [src/features/pilot/Contacts.tsx:12](../../src/features/pilot/Contacts.tsx#L12); [src/features/pilot/Onboarding.tsx:48](../../src/features/pilot/Onboarding.tsx#L48)

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Есть synthetic complaint.create и показ модератору; отсутствует полноценное real verification case management и назначенный реальный модератор.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F207

**Обжалование модерации** — PLANNED.

Требование / AC: Предлагается: Обжалование модерации. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F208

**Подтверждённые отзывы** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Подтверждённые отзывы. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F209

**Ответ специалиста на отзыв** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Ответ специалиста на отзыв. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F210

**Проверяемая история изменений условий** — PARTIALLY_IMPLEMENTED.

Требование / AC: Предлагается: Проверяемая история изменений условий. Общий технический контракт: EXP-20.technical_architecture.

Код / foundations: [server/service.ts:208](../../server/service.ts#L208); [server/store.ts:41](../../server/store.ts#L41)

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Есть allowlisted change notices, версии и audit metadata; отсутствует полный проверяемый real trust change lifecycle с независимыми источниками.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-20](PHASE_PROGRESS.md#exp-20). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F211

**Social Impact Dashboard** — PLANNED.

Требование / AC: Предлагается: Social Impact Dashboard. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F212

**Аналитика времени поиска** — PLANNED.

Требование / AC: Предлагается: Аналитика времени поиска. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F213

**Аналитика успешных контактов** — PLANNED.

Требование / AC: Предлагается: Аналитика успешных контактов. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F214

**Аналитика доступности услуг** — PLANNED.

Требование / AC: Предлагается: Аналитика доступности услуг. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F215

**Обезличенная аналитика потребностей** — PLANNED.

Требование / AC: Предлагается: Обезличенная аналитика потребностей. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F216

**Аналитика незакрытого спроса** — PLANNED.

Требование / AC: Предлагается: Аналитика незакрытого спроса. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F217

**Карта районов с недостатком предложений** — PLANNED.

Требование / AC: Предлагается: Карта районов с недостатком предложений. Общий технический контракт: EXP-21.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-21](PHASE_PROGRESS.md#exp-21). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F218

**Кабинет фонда** — PLANNED.

Требование / AC: Предлагается: Кабинет фонда. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F219

**Управление программами помощи** — PLANNED.

Требование / AC: Предлагается: Управление программами помощи. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F220

**Professional Referral Network с согласием семьи** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Professional Referral Network с согласием семьи. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F221

**Telegram Mini App** — PLANNED.

Требование / AC: Предлагается: Telegram Mini App. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F222

**Интеграции с партнёрскими организациями** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Интеграции с партнёрскими организациями. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F223

**Публичный API с контролем доступа** — PLANNED.

Требование / AC: Предлагается: Публичный API с контролем доступа. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F224

**Выход в другие города Казахстана** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Выход в другие города Казахстана. Общий технический контракт: EXP-22.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-22](PHASE_PROGRESS.md#exp-22). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F225

**Мониторинг и реагирование на инциденты** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Мониторинг и реагирование на инциденты. Общий технический контракт: EXP-23.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-23](PHASE_PROGRESS.md#exp-23). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F226

**Резервное копирование и восстановление** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Резервное копирование и восстановление. Общий технический контракт: EXP-23.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-23](PHASE_PROGRESS.md#exp-23). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F227

**Production identity и безопасность** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Production identity и безопасность. Общий технический контракт: EXP-23.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-23](PHASE_PROGRESS.md#exp-23). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F228

**Реальный аудит accessibility** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Реальный аудит accessibility. Общий технический контракт: EXP-23.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-23](PHASE_PROGRESS.md#exp-23). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F229

**Ограниченный пилот после согласований** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Ограниченный пилот после согласований. Общий технический контракт: EXP-24.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-24](PHASE_PROGRESS.md#exp-24). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

## F230

**Production-запуск** — BLOCKED_EXTERNAL.

Требование / AC: Предлагается: Production-запуск. Общий технический контракт: EXP-24.technical_architecture.

Код / foundations: Целевой модуль отсутствует.

Именованные проверки: Target-specific tests отсутствуют.

Осталось: Целевой путь отсутствует в runtime; существующие общие foundations не закрывают эту функцию. Нужны реальные owner/provider/legal/human evidence; safe prototype возможен только после нового поручения.

Проблема, зависимости, безопасность, UX, общий контракт и четыре phase AC: [EXP-24](PHASE_PROGRESS.md#exp-24). Индивидуальный AC и точные поля — [реестр](FEATURE_REGISTRY.json).

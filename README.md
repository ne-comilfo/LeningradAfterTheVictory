<h1 align="center">Ленинград после победы</h1>

<p align="center">
  Интерактивная карта Санкт-Петербурга, на которой можно увидеть,<br>
  каким город был до блокады, каким стал после и как выглядит сегодня.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB">
  <img alt="MapTiler" src="https://img.shields.io/badge/MapTiler-0099FF?style=flat&logo=maplibre&logoColor=white">
  <img alt="CSS Modules" src="https://img.shields.io/badge/CSS%20Modules-1572B6?style=flat&logo=css3&logoColor=white">
</p>

---

## О проекте

Проект собирает разрозненные архивные материалы о зданиях и улицах Ленинграда в один
доступный формат. Вместо того чтобы искать фотографии по десяткам сайтов и публикаций,
пользователь открывает карту и видит объекты города с их историей — довоенной, военной
и современной.

Три идеи, вокруг которых всё построено:

**Сравнительный визуальный формат.** Каждый объект показан в трёх временных срезах:
до блокады, после неё и сегодня. Видно, что было восстановлено, что перестроено,
а что утрачено.

**Интерактивная карта.** Ключевые объекты отмечены прямо на карте города. Их можно
фильтровать по годам, открывать карточки, строить между ними маршруты и прокладывать
путь от своего текущего местоположения.

**Единый источник.** Материалы из разных архивов, сайтов и публикаций собраны и
структурированы в одном месте.

## Возможности

- 🗺️ **Карта города** с маркерами исторических объектов и фильтром по годам постройки
- 📍 **Карточки объектов** — краткое описание, фотографии, связанные маршруты
- 🧭 **Маршруты** — тематические подборки объектов с построением пешего или
  автомобильного пути, в том числе от текущей геопозиции пользователя
- 🏛️ **Каталог объектов** с подробными страницами: три временных периода,
  галереи фотографий, интересные факты
- 🔖 **Избранное** — сохранение понравившихся объектов и маршрутов
- 👤 **Личный кабинет** с регистрацией, входом и списками избранного
- 📱 **Адаптивная вёрстка** — на мобильных карточки открываются шторкой со свайпом

## Технологии

| | |
|---|---|
| **Next.js** | App Router, файловая маршрутизация, серверные и клиентские компоненты |
| **React** | UI-слой приложения |
| **MapTiler SDK / MapLibre GL** | карта, маркеры, отрисовка маршрутов слоями GeoJSON |
| **Swiper** | галереи фотографий на страницах объектов |
| **rc-slider** | двойной слайдер фильтрации по годам |
| **React Player** | воспроизведение видео (HLS) |
| **CSS Modules** | изоляция стилей компонентов |
| **GitHub Actions** | сборка проекта на каждый push и pull request |

## Быстрый старт

```bash
git clone https://github.com/ne-comilfo/LeningradAfterTheVictory.git
cd LeningradAfterTheVictory/leningrad

npm install
npm run dev
```

Приложение поднимется на [http://localhost:3000](http://localhost:3000).

### Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | режим разработки с горячей перезагрузкой |
| `npm run build` | production-сборка |
| `npm run start` | запуск собранного приложения |
| `npm run lint` | проверка кода |

## Структура

```
leningrad/
├── app/
│   ├── page.js                 # Главная страница
│   ├── layout.js               # Корневой layout с шапкой
│   ├── map/                    # Интерактивная карта
│   ├── info-for-map/           # Карточки объекта и маршрута поверх карты
│   ├── objects/                # Каталог объектов
│   ├── routes/                 # Каталог маршрутов
│   ├── attraction-info/        # Подробная страница объекта
│   ├── personal-account/       # Личный кабинет
│   ├── authentication-authorization/   # Вход и регистрация
│   └── components/             # Шапка, слайдеры, плеер
├── components/attraction-info/ # Компоненты страницы объекта
└── public/                     # Изображения, иконки, видео
```

## Страницы

| Маршрут | Описание |
|---|---|
| `/` | Главная — обзор проекта |
| `/map` | Карта с объектами и маршрутами |
| `/objects` | Каталог всех объектов |
| `/routes` | Каталог маршрутов с фильтром по категориям |
| `/attraction-info?id=` | Подробная страница объекта |
| `/personal-account` | Личный кабинет и избранное |
| `/authentication-authorization` | Вход и регистрация |

## API

Фронтенд работает с REST-бэкендом. Авторизация сессионная, на httpOnly-куках —
запросы к защищённым эндпоинтам идут с `credentials: "include"`.

**Объекты**

```http
GET  /api/attractions/get-all
GET  /api/attractions/attraction/{id}
```

**Маршруты**

```http
GET  /api/routes/get-all
GET  /api/routes/route/{id}
GET  /api/categories/get-all
POST /api/routes/computeWalkingRoutesList     { points: [{ x, y }] }
POST /api/routes/computeDrivingRoutesList     { points: [{ x, y }] }
GET  /api/routes/computeWalkingRoute?x1=&y1=&x2=&y2=
GET  /api/routes/computeDrivingRoute?x1=&y1=&x2=&y2=
```

**Аккаунт и избранное**

```http
POST   /api/authentication/register           { name, email, password }
POST   /api/authentication/token              { username, password }
POST   /api/authentication/logout
GET    /api/user/getUser

GET    /api/favorites/buildings
GET    /api/favorites/routes
POST   /api/favorites/favoriteBuilding?id={id}
DELETE /api/favorites/favoriteBuilding/{id}
POST   /api/favorites/favoriteRoute?id={id}
DELETE /api/favorites/favoriteRoute/{id}
```

### Модели данных

<details>
<summary><b>Объект</b></summary>

```jsonc
{
  "id": 1,
  "name": "Эрмитаж",
  "yearOfCreation": 1764,
  "smallDescription": "Краткое описание для карточки",
  "linksPreview": ["https://.../preview.jpg"],
  "location": { "coordinates": [30.3146, 59.9398] },

  "linksBefore": ["..."],  "descriptionBefore": "До блокады",
  "linksIn":     ["..."],  "descriptionIn":     "После блокады",
  "linksAfter":  ["..."],  "descriptionAfter":  "Настоящее время",

  "interestingFacts": "Первый факт; второй факт; третий факт"
}
```

</details>

<details>
<summary><b>Маршрут</b></summary>

```jsonc
{
  "id": 3,
  "name": "Дорога жизни",
  "description": "Описание маршрута",
  "url": "https://.../cover.png",
  "category": { "id": 2, "name": "Военные" },
  "attractions": [
    { "id": 1, "location": { "coordinates": [30.31, 59.93] } }
  ]
}
```

</details>

<details>
<summary><b>Ответ построения маршрута</b></summary>

```jsonc
{
  "geoJson": [[30.31, 59.93], [30.32, 59.94]],
  "distance": 1240
}
```

Координаты приходят плоским массивом — фронтенд оборачивает их в `LineString`
перед отрисовкой на карте.

</details>

## Как работает карта

При загрузке страницы приложение запрашивает все объекты и расставляет маркеры.
Границы карты зафиксированы по Санкт-Петербургу, минимальный зум ограничен.

Слайдер под картой фильтрует маркеры по году создания объекта — диапазон строится
автоматически по крайним значениям в данных.

Клик по маркеру открывает карточку объекта: описание, фотография и список маршрутов,
в которые этот объект входит. При выборе маршрута фронтенд отправляет координаты его
точек на бэкенд, получает готовую ломаную и рисует её отдельным слоем, оставляя на
карте только маркеры этого маршрута.

Кнопка «В путь» запрашивает геолокацию, определяет, к какому концу маршрута
пользователь ближе, и перестраивает путь от его текущего положения.

## Разработка

Проект развивается по ветвям с префиксами `feature/`, `fix/` и `update/`,
изменения вливаются в `main` через pull request. GitHub Actions собирает проект
на каждый push и PR.

## Команда

Проект разработан командой в рамках учебного курса.

<p align="center">
  <sub>Ленинград после победы · Санкт-Петербург</sub>
</p>

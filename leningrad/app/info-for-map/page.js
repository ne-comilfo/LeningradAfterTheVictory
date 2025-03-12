"use client";

import { useState, useEffect, useRef } from "react";
import "./info-for-map-styles.css";
import HeartIcon from './HeartIcon';

export default function InfoWindow({ marker, onClose, isExpanded, setIsExpanded, drawRoute, clearRoute }) {
  const [isOpen, setIsOpen] = useState(true); // Управление видимостью окна
  const [view, setView] = useState("default"); // Текущий вид (описание или маршруты)
  const [selectedRoute, setSelectedRoute] = useState(null); // Выбранный маршрут
  const [isSaved, setIsSaved] = useState(false); // Сохранен ли объект
  const [savedRoutes, setSavedRoutes] = useState({}); // Сохраненные маршруты
  const [object, setObject] = useState(null); // Данные объекта
  const [isMobile, setIsMobile] = useState(false); // Мобильный вид
  const [startY, setStartY] = useState(null); // Начальная позиция для свайпа
  const [dragOffset, setDragOffset] = useState(0); // Смещение для свайпа
  const [isDragging, setIsDragging] = useState(false); // Происходит ли свайп
  const [routes, setRoutes] = useState([]); // Список маршрутов
  const routesRef = useRef(null); // Ссылка на список маршрутов

  
  // Загрузка данных объекта и маршрутов
  useEffect(() => {
    // Сброс состояния вкладки и маршрута при изменении объекта
    setView("default"); // Возвращаемся на начальную вкладку
    setSelectedRoute(null); // Сбрасываем выбранный маршрут
  }, [marker]);

  useEffect(() => {
    if (marker) {
      // Загрузка данных объекта
      fetch(`http://194.87.252.234:6060/api/attractions/attraction/${marker.id}`)
        .then((response) => response.json())
        .then((data) => {
          setObject({
            title: data.name,
            image: data.linksPreview[0],
            description: `${data.smallDescription}`,
          });
        })
        .catch((error) => console.error("Ошибка загрузки данных:", error));

      // Загрузка маршрутов
      fetch("http://194.87.252.234:6060/api/routes/get-all") // Запрашиваем список маршрутов
        .then((response) => response.json())
        .then((routesList) => {
          const routePromises = routesList.map((route) =>
            fetch(`http://194.87.252.234:6060/api/routes/route/${route.id}`).then((res) =>
              res.json()
            )
          );

          Promise.all(routePromises)
            .then((routes) => {
              const matchedRoutes = routes
                .filter((route) =>
                  route.attractions.some((attraction) => attraction.id === marker.id)
                )
                .map((route) => ({
                  id: route.id,
                  name: route.name,
                  details: route.description,
                }));

              setRoutes(matchedRoutes);
            })
            .catch((error) =>
              console.error("Ошибка загрузки маршрутов:", error)
            );
        })
        .catch((error) => console.error("Ошибка загрузки списка маршрутов:", error));
    }
  }, [marker]);

  const handleClose = () => {
    setIsOpen(false); // Закрываем окно
    onClose(); // Уведомляем Map.js о закрытии
    clearRoute();
  };

  // Обработчик свайпа
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || startY === null) return;
    const deltaY = e.touches[0].clientY - startY;
    setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    if (dragOffset < -50) {
      setIsExpanded(true);
    } else if (dragOffset > 50) {
      if (isExpanded) {
        setIsExpanded(false);
      } else {
        handleClose();
      }
    }
    setIsDragging(false);
    setStartY(null);
    setDragOffset(0);
  };

  // Обработчик сохранения объекта
  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // Обработчик сохранения маршрута
  const handleSaveRoute = (id) => {
    setSavedRoutes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Обработчик прокрутки маршрутов
  const handleScrollRoutes = (direction) => {
    if (routesRef.current) {
      const scrollAmount = 327; // Шаг прокрутки
      routesRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleRouteClick = (route) => {
    setSelectedRoute(route); // Устанавливаем выбранный маршрут

    fetch(`http://194.87.252.234:6060/api/routes/route/${route.id}`)
      .then((response) => response.json())
      .then((data) => {
        const coordinates = data.attractions.map(attraction => attraction.location.coordinates);
        const formattedCoordinates = coordinates.map(([x, y]) => ({ x, y }));

        const requestBody = {
          "points": formattedCoordinates  // Оборачиваем массив координат в объект
        };

        fetch(`http://194.87.252.234:6060/api/routes/computeWalkingRoutesList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),  // Отправляем массив координат
        })
          .then((response) => response.json())  // Обрабатываем ответ второго запроса
          //.then(data => console.log(data))
          .then((routeData) => {
            if (routeData.geoJson.length > 0) {
              try {
                const geoJson = routeData.geoJson; // Парсим geoJson
                const coordinates1 = geoJson; // Извлекаем координаты

                drawRoute(coordinates1)  // Рисуем маршрут с координатами
              } catch (error) {
                console.error("Ошибка при парсинге geoJson:", error);
              }
            } else {
              console.error("geoJson не найден или пустой");
            }
          })
          .catch((error) => {
            console.error("Ошибка второго запроса:", error);  // Ошибка обработки второго запроса
          });
      })
      .catch((error) => {
        console.error("Ошибка загрузки маршрута:", error);  // Ошибка первого запроса
      });
  };




  useEffect(() => {
    if (routesRef.current) {
      routesRef.current.scrollLeft = scrollPosition;
    }
  }, [selectedRoute]);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);
  return (
    <div className="container">
      {isMobile && (
        <div className="mobile-version">
          {isOpen && (
            <>
              {isExpanded && object && view === "default" && (
                <img src={object.image} className="floating-image" />
              )}
              <div
                className={`mobile-info-window ${isExpanded ? "expanded" : ""}`}
                style={{ transform: `translateY(${Math.max(0, Math.min(window.innerHeight, dragOffset))}px)`, }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className={`grabber ${isExpanded ? "expanded" : "collapsed"}`}></div>
                {view === "default" && object && (
                  <>
                    <div className="window-header">
                      <h2>{object.title}</h2>
                    </div>
                    <div className="scrollable-content">
                      <div className="window-content">
                        {isExpanded && object && (
                          <>
                            <p>{object.description}</p>
                            <a href='./attraction-info'>подробнее</a>
                            <div className="buttons centered">
                              <button onClick={handleSave}>
                                <HeartIcon filled={isSaved} />
                                {isSaved ? "Сохранено" : "Сохранить"}
                              </button>
                              <button onClick={() => setView("routes")}>
                                <img src="/ways.svg" className="routes" />
                                Маршруты
                              </button>
                              <button onClick={handleClose}>
                                <img src="/route.svg" className="in-the-route" />
                                В путь
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {view === "routes" && object && !selectedRoute && (
                  <>
                    <div className="window-header">
                      <h2>{object.title}</h2>
                    </div>
                    <div className="scrollable-content">
                      <div className="window-content">
                        {isExpanded && (
                          <>
                            <p>Маршруты</p>
                            <div className="color-for-list">
                              <div className="route-carousel">
                                <button className="carousel-btn left" onClick={() => handleScrollRoutes("left")}>
                                  ◀
                                </button>
                                <div className="route-list-wrapper" ref={routesRef}>
                                  <ul className="route-list">
                                    {routes.map((route) => (
                                      <li key={route.id}>
                                        <button onClick={() => handleRouteClick(route)}>{route.name}</button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <button className="carousel-btn right" onClick={() => handleScrollRoutes("right")}>
                                  ▶
                                </button>
                              </div>
                            </div>
                            <a className="back-link" onClick={() => {setView("default")}}>⬅ Назад к описанию</a>
                            <div className="buttons-1 centered">
                              <button className="active">
                                <img src="/ways.svg" className="routes" />
                                Маршруты
                              </button>
                              <button onClick={handleClose}>
                                <img src="/route.svg" className="in-the-route" />
                                В путь
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {selectedRoute && object && (
                  <>
                    <div className="window-header">
                      <h2>{object.title}</h2>
                    </div>
                    <div className="scrollable-content">
                      <div className="window-content">
                        {isExpanded && (
                          <>
                            <p>{selectedRoute.details}</p>
                            <a className="back-link" onClick={() => {setSelectedRoute(null); clearRoute()}}>⬅ Назад к маршрутам</a>
                            <div className="buttons-1">
                              <button onClick={() => handleSaveRoute(selectedRoute.id)}>
                                <HeartIcon filled={savedRoutes[selectedRoute.id]} />
                                {savedRoutes[selectedRoute.id] ? "Сохранено" : "Сохранить"}
                              </button>
                              <button onClick={handleClose}>
                                <img src="/route.svg" className="in-the-route" />
                                В путь
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
      {!isMobile && (
        <div className="pc-version">
          <div className={`info-window ${isOpen ? "open" : ""}`}>
            <div className='button-to-exit'>
              <button onClick={handleClose}>✕</button>
            </div>
            {view === "default" && object && (
              <>
                <h2>{object.title}</h2>
                <div className="image-container">
                  <img src={object.image} className="object-image" />
                </div>
                <div className="buttons">
                  <button onClick={handleSave}>
                    <HeartIcon filled={isSaved} />
                    {isSaved ? "Сохранено" : "Сохранить"}
                  </button>
                  <button onClick={() => setView("routes")}>
                    <img src="/ways.svg" className="routes" />
                    Маршруты
                  </button>
                  <button onClick={handleClose}>
                    <img src="/route.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <p>{object.description}</p>
                <a href='./attraction-info'>подробнее</a>
              </>
            )}
            {view === "routes" && !selectedRoute && object && (
              <>
                <h2>{object.title}</h2>
                <div className="buttons-1 centered">
                  <button className="active">
                    <img src="/ways.svg" className="routes" />
                    Маршруты
                  </button>
                  <button onClick={handleClose}>
                    <img src="/route.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <div className='color-for-list'>
                  <ul className="route-list">
                    {routes.map((route) => (
                      <li key={route.id}>
                        <button onClick={() => handleRouteClick(route)}>{route.name}</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <a className="back-link" onClick={() => setView("default")}>⬅ Назад к описанию</a>
              </>
            )}
            {selectedRoute && object && (
              <>
                <h2>{object.title}</h2>
                <div className="buttons-1 centered">
                  <button onClick={() => handleSaveRoute(selectedRoute.id)}>
                    <HeartIcon filled={savedRoutes[selectedRoute.id]} />
                    {savedRoutes[selectedRoute.id] ? "Сохранено" : "Сохранить"}
                  </button>
                  <button onClick={handleClose}>
                    <img src="/route.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <p>{selectedRoute.details}</p>
                <a className="back-link" onClick={() => {setSelectedRoute(null); clearRoute()}}>⬅ Назад к маршрутам</a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
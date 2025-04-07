"use client";

import { useState, useEffect, useRef } from "react";
import "./info-for-map-styles.css";
import HeartIcon from './HeartIcon';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function InfoWindow({ marker, onClose, isExpanded, setIsExpanded, drawRoute, clearRoute, map, setRouteAttractionIds }) {
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
  const [userLocation, setUserLocation] = useState(null); // Координаты пользователя
  const userMarkerRef = useRef(null);
  const [imageOffset, setImageOffset] = useState(0);

  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSaveClick = async () => {
    try {
      if (!isSaved) {
        const response = await fetch(
          `https://leningrad-after-the-victory.ru/api/favorites/favoriteBuilding?id=${marker.id}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          setIsSaved(true);
          localStorage.setItem(`favorite_${marker.id}`, 'true');
        } else if (response.status === 401 || response.status === 422) {
          setShowAuthModal(true);
        } else {
          throw new Error('Ошибка при добавлении');
        }
      } else {
        const response = await fetch(
          `https://leningrad-after-the-victory.ru/api/favorites/favoriteBuilding/${marker.id}`,
          {
            method: 'DELETE',
            credentials: "include",
          }
        );

        if (response.ok) {
          setIsSaved(false);
          localStorage.removeItem(`favorite_${marker.id}`);
        } else {
          throw new Error('Ошибка при удалении');
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const handleAuthRedirect = () => {

    const redirectUrl = `/authentication-authorization?redirect=${encodeURIComponent('/map')}`;
    router.push(redirectUrl);
    setShowAuthModal(false);
  };


  useEffect(() => {
    if (marker) {
      // Загрузка данных объекта
      fetch(`https://leningrad-after-the-victory.ru/api/attractions/attraction/${marker.id}`)
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
      fetch("https://leningrad-after-the-victory.ru/api/routes/get-all") // Запрашиваем список маршрутов
        .then((response) => response.json())
        .then((routesList) => {
          const routePromises = routesList.map((route) =>
            fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${route.id}`).then((res) =>
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
                  image: route.url,
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

  const handleStartRoute = (route) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: userLat, longitude: userLng } = position.coords;
          // Координаты достопримечательности из marker
          const [markerLng, markerLat] = marker.location.coordinates;

          setUserLocation([userLng, userLat]);

          // Удаляем старый маркер пользователя (если есть)
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Добавляем новый маркер для местоположения пользователя
          if (map.current) {
            userMarkerRef.current = new maptilersdk.Marker({
              color: "rgb(95, 163, 236)"
            })
              .setLngLat([userLng, userLat])
              .addTo(map.current);
          }
          if (selectedRoute) {

            fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${route.id}`)
              .then((response) => response.json())
              .then((data) => {
                const coordinates = data.attractions.map(attraction => attraction.location.coordinates);
                const formattedCoordinates = coordinates.map(([x, y]) => ({ x, y }));

                const requestBody = {
                  "points": formattedCoordinates  // Оборачиваем массив координат в объект
                };

                fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(requestBody),  // Отправляем массив координат
                })
                  .then((response) => response.json())  // Обрабатываем ответ второго запроса
                  .then((routeData) => {
                    if (routeData.geoJson.length > 0) {
                      try {
                        const geoJson = routeData.geoJson; // Парсим geoJson
                        const coordinates1 = geoJson; // Извлекаем координаты
                        const first_coordinates = coordinates1[0]
                        const last_coordinates = coordinates1[coordinates1.length - 1]

                        // Создаем промисы для вызовов API
                        const fetchNormalDistance = fetch(
                          `https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoute?x1=${userLng}&y1=${userLat}&x2=${first_coordinates[0]}&y2=${first_coordinates[1]}`
                        ).then((response) => response.json());

                        const fetchReverseDistance = fetch(
                          `https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoute?x1=${userLng}&y1=${userLat}&x2=${last_coordinates[0]}&y2=${last_coordinates[1]}`
                        ).then((response) => response.json());

                        // Ожидаем завершения обоих запросов
                        Promise.all([fetchNormalDistance, fetchReverseDistance])
                          .then(([normalData, reverseData]) => {
                            // Проверяем, что оба запроса вернули данные
                            if (normalData.geoJson && reverseData.geoJson) {
                              const distance_normal = normalData.distance;
                              const distance_reverse = reverseData.distance;

                              if (distance_normal < distance_reverse) {
                                const userCoordinates = { x: userLng, y: userLat }; // Координаты пользователя
                                const formattedCoordinates = [userCoordinates, ...coordinates.map(([x, y]) => ({ x, y }))];
                                const requestBody = {
                                  points: formattedCoordinates, // Теперь массив начинается с координат пользователя
                                };

                                fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify(requestBody),  // Отправляем массив координат
                                })
                                  .then((response) => response.json())  // Обрабатываем ответ второго запроса
                                  .then((routeData) => {
                                    if (routeData.geoJson.length > 0) {
                                      try {
                                        const geoJson = routeData.geoJson; // Парсим geoJson
                                        const coordinates1 = geoJson; // Извлекаем координаты

                                        drawRoute(coordinates1)
                                        setIsExpanded(false);
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

                              } else {
                                const userCoordinates = { x: userLng, y: userLat }; // Координаты пользователя
                                const formattedCoordinates = [...coordinates.map(([x, y]) => ({ x, y })), userCoordinates];

                                const requestBody = {
                                  points: formattedCoordinates, // Теперь массив заканчивается координатами пользователя
                                };
                                fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify(requestBody),  // Отправляем массив координат
                                })
                                  .then((response) => response.json())  // Обрабатываем ответ второго запроса
                                  .then((routeData) => {
                                    if (routeData.geoJson.length > 0) {
                                      try {
                                        const geoJson = routeData.geoJson; // Парсим geoJson
                                        const coordinates1 = geoJson; // Извлекаем координаты

                                        drawRoute(coordinates1)
                                        setIsExpanded(false);
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
                              }

                            } else {
                              console.error("Один из маршрутов не найден или пустой");
                            }
                          })
                          .catch((error) => {
                            console.error("Ошибка при построении маршрута:", error);
                          });
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

          } else {
            fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoute?x1=${userLng}&y1=${userLat}&x2=${markerLng}&y2=${markerLat}`)
              .then((response) => response.json())
              .then((routeData) => {
                // Обрабатываем geoJson для отображения маршрута
                if (routeData.geoJson && routeData.geoJson.length > 0) {
                  const coordinates = routeData.geoJson;
                  drawRoute(coordinates);
                  setIsExpanded(false); // Отображаем маршрут на карте
                } else {
                  console.error("Маршрут не найден или пустой");
                }
              })
              .catch((error) => {
                console.error("Ошибка при построении маршрута:", error);
              });
          }

        },
        (error) => {
          alert("Не удалось получить ваше местоположение. Пожалуйста, разрешите доступ к геопозиции.");
        }
      );
    } else {
      console.error("Geolocation не поддерживается вашим браузером.");
      alert("Ваш браузер не поддерживает Geolocation.");
    }
  };

  const handleClose = () => {
    setIsOpen(false); // Закрываем окно
    onClose(); // Уведомляем Map.js о закрытии
    clearRoute();
    clearMarker()

  };

  const clearMarker = () => {
    if (userMarkerRef.current) {
      userMarkerRef.current.remove(); // Удаляем маркер с карты
      userMarkerRef.current = null; // Сбрасываем ссылку на маркер
    }
  }

  useEffect(() => {
    if (marker) {
      const savedState = localStorage.getItem(`favorite_${marker.id}`);
      if (savedState === 'true') {
        setIsSaved(true);
      }
    }
  }, [marker]);
  // Обработчик свайпа


  const handleSaveRouteClick = async (routeId) => {
    try {
      const isCurrentlySaved = savedRoutes[routeId];

      if (!isCurrentlySaved) {
        const response = await fetch(
          `https://leningrad-after-the-victory.ru/api/favorites/favoriteRoute?id=${routeId}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          setSavedRoutes(prev => ({ ...prev, [routeId]: true }));
          localStorage.setItem(`favorite_route_${routeId}`, 'true');
        } else if (response.status === 401 || response.status === 422) {
          setShowAuthModal(true);
        } else {
          throw new Error('Ошибка при добавлении маршрута');
        }
      } else {
        const response = await fetch(
          `https://leningrad-after-the-victory.ru/api/favorites/favoriteRoute/${routeId}`,
          {
            method: 'DELETE',
            credentials: "include",
          }
        );

        if (response.ok) {
          setSavedRoutes(prev => ({ ...prev, [routeId]: false }));
          localStorage.removeItem(`favorite_route_${routeId}`);
        } else {
          throw new Error('Ошибка при удалении маршрута');
        }
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  useEffect(() => {
    if (routes.length > 0) {
      const savedRoutesState = {};
      routes.forEach(route => {
        const savedState = localStorage.getItem(`favorite_route_${route.id}`);
        if (savedState === 'true') {
          savedRoutesState[route.id] = true;
        }
      });
      setSavedRoutes(savedRoutesState);
    }
  }, [routes]);

  const MAX_DRAG_OFFSET = 360; // Максимальное смещение в пикселях

  const handleTouchMove = (e) => {
    if (!isDragging || startY === null) return;
    
    const deltaY = e.touches[0].clientY - startY;
    
    // Запрет свайпа вверх, если вкладка уже раскрыта
    if (isExpanded && deltaY < 0) {
      setDragOffset(0);
      return;
    }
    
    // Ограничение смещения
    const clampedOffset = Math.max(-MAX_DRAG_OFFSET, Math.min(MAX_DRAG_OFFSET, deltaY));
    setDragOffset(clampedOffset);
    setImageOffset(Math.max(0, clampedOffset));
  };

const handleTouchEnd = () => {
  const threshold = 50; // Порог для срабатывания свайпа

  if (dragOffset < -threshold) {
    // Свайп вверх: раскрываем вкладку
    setIsExpanded(true);
    setDragOffset(0); // Сброс смещения
    setImageOffset(0);
  } else if (dragOffset > threshold) {
    // Свайп вниз: закрываем или сворачиваем вкладку
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      handleClose();
    }
    setDragOffset(0); // Сброс смещения
    setImageOffset(0);
  } else {
    // Если свайп не дотянут до порога, плавно возвращаем на место
    setDragOffset(0);
    setImageOffset(0);
  }

  // Всегда сбрасываем состояние свайпа
  setIsDragging(false);
  setStartY(null);
};

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleScrollRoutes = (direction) => {
    if (routesRef.current) {
      const scrollAmount = 327; // Шаг прокрутки
      routesRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleRouteClick = (route) => {
    setSelectedRoute(route); // Устанавливаем выбранный маршрут

    fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${route.id}`)
      .then((response) => response.json())
      .then((data) => {
        const attractionIds = data.attractions.map(attraction => attraction.id);
      setRouteAttractionIds(attractionIds);
        const coordinates = data.attractions.map(attraction => attraction.location.coordinates);
        const formattedCoordinates = coordinates.map(([x, y]) => ({ x, y }));

        const requestBody = {
          "points": formattedCoordinates  // Оборачиваем массив координат в объект
        };

        fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),  // Отправляем массив координат
        })
          .then((response) => response.json())  // Обрабатываем ответ второго запроса
          .then((routeData) => {


            if (routeData.geoJson.length > 0) {
              try {
                const geoJson = routeData.geoJson; // Парсим geoJson
                const coordinates1 = geoJson; // Извлекаем координаты


                drawRoute(coordinates1)
                setIsExpanded(false);
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
            {isExpanded && object && (
              
              <img
              src={view === "default" && object ? object.image : selectedRoute?.image}
                className="floating-image"
                style={{
                  '--image-offset': `${imageOffset}px`,
                  transform: `translateX(-50%) translateY(${imageOffset}px)`
                }}
              />
            )}
            <div
              className={`mobile-info-window ${isExpanded ? "expanded" : ""}`}
              style={{
                transform: `translateY(${Math.min(window.innerHeight, dragOffset)}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-in-out'
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={`grabber ${isExpanded ? "expanded" : "collapsed"}`}></div>
              
              {/* Общий контейнер для контента */}
              <div
                className="bottom-sheet"
                style={{
                  transform: isExpanded ? "translateY(0)" : "translateY(83%)",
                }}
              >
                {/* Вкладка default */}
                {view === "default" && object && (
                  <>
                    <div className="window-header">
                      <h2>{object.title}</h2>
                    </div>
                    <div className="scrollable-content">
                      <div className="window-content">
                        <p>{object.description}</p>
                        <Link href={`/attraction-info?id=${String(marker.id)}`}>
                          <span>подробнее</span>
                        </Link>
                        <div className="buttons centered">
                          <button onClick={handleSaveClick}>
                            <HeartIcon filled={isSaved} />
                            {isSaved ? "Сохранено" : "Сохранить"}
                          </button>
                          <button onClick={() => setView("routes")}>
                            <img src="/ways.svg" className="routes" />
                            Маршруты
                          </button>
                          <button onClick={handleStartRoute}>
                            <img src="/route.svg" className="in-the-route" />
                            В путь
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
      
                {/* Вкладка routes */}
                {view === "routes" && object && !selectedRoute && (
                  <>
                    <div className="window-header">
                      <h2>{object.title}</h2>
                    </div>
                    <div className="scrollable-content">
                      <div className="window-content">
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
                        <a className="back-link" onClick={() => { setView("default"); clearRoute(); clearMarker() }}>⬅ Назад к описанию</a>
                        <div className="buttons-1 centered">
                          <button className="active">
                            <img src="/ways.svg" className="routes" />
                            Маршруты
                          </button>
                          <button onClick={handleStartRoute}>
                            <img src="/route.svg" className="in-the-route" />
                            В путь
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
      
                {/* Вкладка выбранного маршрута */}
                {selectedRoute && object && (
                  <>
                    <div className="window-header">
                      <h2>{selectedRoute.name}</h2>
                    </div>
                    
                    <div className="scrollable-content">
                      <div className="window-content">
                        <p>{selectedRoute.details}</p>
                        <a className="back-link" onClick={() => { setSelectedRoute(null); clearRoute(); clearMarker() }}>⬅ Назад к маршрутам</a>
                        <div className="buttons-1">
                          <button onClick={() => handleSaveRouteClick(selectedRoute.id)}>
                            <HeartIcon filled={savedRoutes[selectedRoute.id]} />
                            {savedRoutes[selectedRoute.id] ? "Сохранено" : "Сохранить"}
                          </button>
                          <button onClick={() => handleStartRoute(selectedRoute)}>
                            <img src="/route.svg" className="in-the-route" />
                            В путь
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      )}
      {!isMobile && (
        <div className="pc-version">
          <div className={`info-window ${isOpen ? "open" : ""}`}>
            <div className='button-to-exit'>

              <button onClick={() => { handleClose(); clearMarker() }}>✕</button>

            </div>
            {view === "default" && object && (
              <>
                <h2>{object.title}</h2>
                <div className="image-container">
                  <img src={object.image} className="object-image" />
                </div>
                <div className="buttons">
                  <button onClick={handleSaveClick}>
                    <HeartIcon filled={isSaved} />
                    {isSaved ? "Сохранено" : "Сохранить"}
                  </button>
                  <button onClick={() => setView("routes")}>
                    <img src="/ways.svg" className="routes" />
                    Маршруты
                  </button>

                  <button onClick={handleStartRoute}>

                    <img src="/route.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <p>{object.description}</p>
                <Link href={`/attraction-info?id=${marker.id}`}>
                  <span>подробнее</span>
                </Link>
              </>
            )}
            {view === "routes" && !selectedRoute && object && (
              <>
                <h2>{object.title}</h2>
                <div className="image-container">
                  <img src={object.image} className="object-image" />
                </div>
                <div className="buttons-1 centered">
                  <button className="active">
                    <img src="/ways.svg" className="routes" />
                    Маршруты
                  </button>

                  <button onClick={handleStartRoute}>

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

                <a className="back-link" onClick={() => { setView("default"); clearRoute(); clearMarker() }}>⬅ Назад к описанию</a>

              </>
            )}
            {selectedRoute && object && (
              <>
                <h2>{selectedRoute.name}</h2>
                <div className="image-container">
                  <img src={selectedRoute.image} className="object-image" />
                </div>
                <div className="buttons-1 centered">
                  <button onClick={() => handleSaveRouteClick(selectedRoute.id)}>
                    <HeartIcon filled={savedRoutes[selectedRoute.id]} />
                    {savedRoutes[selectedRoute.id] ? "Сохранено" : "Сохранить"}
                  </button>

                  <button onClick={() => handleStartRoute(selectedRoute)}>

                    <img src="/route.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <p>{selectedRoute.details}</p>

                <a className="back-link" onClick={() => { setSelectedRoute(null); clearRoute(); clearMarker() }}>⬅ Назад к маршрутам</a>

              </>
            )}
          </div>
        </div>
      )}
      {showAuthModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Вы не авторизованы. Хотите войти?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowAuthModal(false)}>Остаться</button>
              <button onClick={handleAuthRedirect}>Войти</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
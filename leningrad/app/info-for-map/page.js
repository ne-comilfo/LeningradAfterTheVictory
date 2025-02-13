"use client";

import { useState, useEffect, useRef } from "react";
import "./styles.css"; // Подключаем стили
import HeartIcon from './HeartIcon';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false); // ✅ Теперь окно закрыто по умолчанию
  const [isExpanded, setIsExpanded] = useState(false);
  const [view, setView] = useState("default");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState({});
  const [object, setObject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [startY, setStartY] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const routes = [
    { id: 1, name: "Короткийgddgd маршрут", details: "Этот маршрут самый быстрый." },
    { id: 2, name: "Живописный маршрут", details: "Маршрут проходит через красивые места." },
    { id: 3, name: "Исторический маршрут", details: "По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники.По пути можно увидеть старинные памятники." },
    { id: 4, name: "Другой", details: "Описание другого маршрута." },
  ];
  const routesRef = useRef(null);

  const handleScrollRoutes = (direction) => {
    if (routesRef.current) {
      const scrollAmount = 326;
      routesRef.current.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;
    }
  };

  const [scrollPosition, setScrollPosition] = useState(0); // Сохраняем позицию скролла

  const handleRouteClick = (route) => {
    if (routesRef.current) {
      setScrollPosition(routesRef.current.scrollLeft); // Сохраняем позицию скролла
    }
    setSelectedRoute(route);
  };

  useEffect(() => {
    if (routesRef.current) {
      routesRef.current.scrollLeft = scrollPosition; // Восстанавливаем позицию скролла
    }
  }, [selectedRoute]); // Когда пользователь выходит из маршрута

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

  useEffect(() => {
    fetch(`first-page.json`)
      .then((response) => response.json())
      .then((data) => {
        setObject({
          title: data.name,
          image: data.linksPreview[0] || "/default-image.jpg",
          description: `${data.smallDescription}`,
        });
      })
      .catch((error) => console.error("Ошибка загрузки данных:", error));
  }, []);

  if (!object) {
    return <div className='download'>Загрузка...</div>;
  }

  const handleSave = () => {
    setIsSaved(true);
  };

  const handleSaveRoute = (id) => {
    setSavedRoutes((prev) => {
      if (prev[id]) return prev;
      return { ...prev, [id]: true };
    });
  };

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
        setIsOpen(false);
      }
    }

    setIsDragging(false);
    setStartY(null);
    setDragOffset(0);
  };

  return (
    <div className="container">
      {isMobile && (
        <div className="mobile-version">
          {isOpen && (
            
            <>
            
            <div
              className={`mobile-info-window ${isExpanded ? "expanded" : ""}`}
              style={{ transform: `translateY(${isExpanded ? 0 : Math.max(0, dragOffset)}px)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={`grabber ${isExpanded ? "expanded" : "collapsed"}`}></div>
              {view === "default" && (
                <>
                  <div className="window-header">
                    <h2>{object.title}</h2>
                  </div>
                  <div className="scrollable-content">
                    {/* ... 
              {isExpanded && (
                
              )} */}

                    <div className="window-content">
                      {isExpanded && (
                        <>
                          <img src={object.image} className="floating-image" />
                          <p>{object.description}</p>
                          <a href='./attraction-info'>подробнее</a>
                          <div className="buttons centered">
                            <button onClick={handleSave}>
                              <HeartIcon filled={isSaved} />
                              {isSaved ? "Сохранено" : "Сохранить"}
                            </button>
                            <button onClick={() => setView("routes")}>
                              <img src="/маршруты (1).svg" className="routes" />
                              Маршруты
                            </button>
                            <button onClick={() => setIsOpen(false)}>
                              <img src="/в путь.svg" className="in-the-route" />
                              В путь
                            </button>
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                </>
              )}
              {/* Вкладка маршрутов */}
              {view === "routes" && !selectedRoute && (
                <>
                  <div className="window-header">
                    <h2>{object.title}</h2>
                  </div>
                  <div className="scrollable-content">
                    <div className="window-content">
                      {isExpanded && ( // Проверяем, развернуто ли окно
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
                          <a className="back-link" onClick={() => setView("default")}>⬅ Назад к описанию</a>
                          <div className="buttons-1 centered">
                            <button className="active">
                              <img src="/маршруты (1).svg" className="routes" />
                              Маршруты
                            </button>
                            <button onClick={() => setIsOpen(false)}>
                              <img src="/в путь.svg" className="in-the-route" />
                              В путь
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Вкладка с описанием маршрута */}
              {selectedRoute && (
                <>
                  <div className="window-header">
                    <h2>{object.title}</h2>
                  </div>
                  <div className="scrollable-content">
                    <div className="window-content">
                      {isExpanded && (
                        <>
                          <p>{selectedRoute.details}</p>
                          <a className="back-link" onClick={() => setSelectedRoute(null)}>⬅ Назад к маршрутам</a>

                          <div className="buttons-1">
                            <button onClick={() => handleSaveRoute(selectedRoute.id)}>
                              <HeartIcon filled={savedRoutes[selectedRoute.id]} />
                              {savedRoutes[selectedRoute.id] ? "Сохранено" : "Сохранить"}
                            </button>
                            <button onClick={() => setIsOpen(false)}>
                              <img src="/в путь.svg" className="in-the-route" />
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
          <div className="main-content">
            <h1>Основная карта</h1>
            <button onClick={() => { setIsOpen(true); setIsExpanded(false); }}>🔍 Показать объект</button>
          </div>
        </div>
      )
      }

      {/* ПК-версия */}
      {!isMobile && (
        <div className="pc-version">
          <div className={`info-window ${isOpen ? "open" : ""}`}>
            <div className='button-to-exit'>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
            {/* Главная вкладка */}
            {view === "default" && (
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
                    <img src="/маршруты (1).svg" className="routes" />
                    Маршруты
                  </button>
                  <button onClick={() => setIsOpen(false)}>
                    <img src="/в путь.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <p>{object.description}</p>
                <a href='./attraction-info'>подробнее</a>
              </>
            )}

            {/* Вкладка маршрутов */}
            {view === "routes" && !selectedRoute && (
              <>
                <h2>{object.title}</h2>
                <div className="buttons-1 centered">
                  <button className="active">
                    <img src="/маршруты (1).svg" className="routes" />
                    Маршруты
                  </button>
                  <button onClick={() => setIsOpen(false)}>
                    <img src="/в путь.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <div className='color-for-list'>
                  <ul className="route-list">
                    {routes.map((route) => (
                      <li key={route.id}>
                        <button onClick={() => setSelectedRoute(route)}>{route.name}</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <a className="back-link" onClick={() => setView("default")}>⬅ Назад к описанию</a>
              </>
            )}

            {/* Вкладка с описанием маршрута */}
            {selectedRoute && (
              <>
                <h2>{object.title}</h2>
                <div className="buttons-1 centered">
                  <button onClick={() => handleSaveRoute(selectedRoute.id)}>
                    <HeartIcon filled={savedRoutes[selectedRoute.id]} />
                    {savedRoutes[selectedRoute.id] ? "Сохранено" : "Сохранить"}
                  </button>
                  <button onClick={() => setIsOpen(false)}>
                    <img src="/в путь.svg" className="in-the-route" />
                    В путь
                  </button>
                </div>
                <p>{selectedRoute.details}</p>
                <a className="back-link" onClick={() => setSelectedRoute(null)}>⬅ Назад к маршрутам</a>
              </>
            )}
          </div>

          <div className="main-content">
            <h1>Основная карта</h1>
            <button onClick={() => setIsOpen(true)}>🔍 Показать объект</button>
          </div>
        </div>
      )}
    </div>
  );
}

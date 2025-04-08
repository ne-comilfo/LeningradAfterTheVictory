"use client";

import { useState, useEffect, useRef } from "react";
import "./info-for-map-styles.css";
import HeartIcon from './HeartIcon';
import { useRouter } from 'next/navigation';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";

export default function RouteWindow({ 
    routeId, 
    onClose, 
    isExpanded, 
    setIsExpanded, 
    drawRoute, 
    clearRoute, 
    map 
  }) {
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const userMarkerRef = useRef(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const router = useRouter();
  
    // Загрузка данных маршрута
    useEffect(() => {
      if (routeId) {
        fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${routeId}`)
          .then((res) => res.json())
          .then((data) => setSelectedRoute(data))
          .catch((err) => console.error("Ошибка загрузки маршрута:", err));
      }
    }, [routeId]);
    const [isOpen, setIsOpen] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [route, setRoute] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [startY, setStartY] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [imageOffset, setImageOffset] = useState(0);
    const MAX_DRAG_OFFSET = 360;

    // Загрузка данных маршрута

    
    useEffect(() => {
        if (routeId) {
            fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${routeId}`)
                .then((response) => response.json())
                .then((data) => {
                    setRoute({
                        id: data.id,
                        name: data.name,
                        details: data.description,
                        image: data.url,
                        attractions: data.attractions
                    });

                    // Отрисовка маршрута
                    const coordinates = data.attractions.map(a => a.location.coordinates);
                    const formatted = coordinates.map(([x, y]) => ({ x, y }));

                    fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ points: formatted })
                    })
                        .then(res => res.json())
                        .then(routeData => {
                            if (routeData.geoJson?.length > 0) {
                                drawRoute(routeData.geoJson);
                            }
                        });
                })
                .catch(console.error);

            // Проверка сохраненности
            const savedState = localStorage.getItem(`favorite_route_${routeId}`) === 'true';
            setIsSaved(savedState);
        }
    }, [routeId]);

    const handleSaveClick = async () => {
        try {
            if (!isSaved) {
                const response = await fetch(
                    `https://leningrad-after-the-victory.ru/api/favorites/favoriteRoute?id=${routeId}`,
                    { method: "POST", credentials: "include" }
                );

                if (response.ok) {
                    setIsSaved(true);
                    localStorage.setItem(`favorite_route_${routeId}`, 'true');
                } else if (response.status === 401 || response.status === 422) {
                    setShowAuthModal(true);
                }
            } else {
                const response = await fetch(
                    `https://leningrad-after-the-victory.ru/api/favorites/favoriteRoute/${routeId}`,
                    { method: 'DELETE', credentials: "include" }
                );

                if (response.ok) {
                    setIsSaved(false);
                    localStorage.removeItem(`favorite_route_${routeId}`);
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleStartRoute = () => {
        if (!selectedRoute || !map.current) return;
      
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude: userLat, longitude: userLng } = position.coords;
              setUserLocation([userLng, userLat]);
      
              // Удаляем старый маркер пользователя
              if (userMarkerRef.current) userMarkerRef.current.remove();
      
              // Добавляем новый маркер
              userMarkerRef.current = new maptilersdk.Marker({ color: "rgb(95, 163, 236)" })
                .setLngLat([userLng, userLat])
                .addTo(map.current);
      
              // Получаем координаты точек маршрута
              const routePoints = selectedRoute.attractions.map(a => a.location.coordinates);
              const formattedPoints = routePoints.map(([x, y]) => ({ x, y }));
      
              // Определяем ближайшую точку маршрута к пользователю
              fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ points: formattedPoints }),
              })
                .then((res) => res.json())
                .then((routeData) => {
                  if (routeData.geoJson?.length > 0) {
                    const routeCoords = routeData.geoJson;
                    const firstPoint = routeCoords[0];
                    const lastPoint = routeCoords[routeCoords.length - 1];
      
                    // Сравниваем расстояние до первой и последней точки
                    Promise.all([
                      fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoute?x1=${userLng}&y1=${userLat}&x2=${firstPoint[0]}&y2=${firstPoint[1]}`),
                      fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoute?x1=${userLng}&y1=${userLat}&x2=${lastPoint[0]}&y2=${lastPoint[1]}`),
                    ])
                      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
                      .then(([data1, data2]) => {
                        const isFirstCloser = data1.distance < data2.distance;
                        const userPoint = { x: userLng, y: userLat };
      
                        // Строим маршрут от пользователя до ближайшей точки
                        const fullRoute = isFirstCloser
                          ? [userPoint, ...formattedPoints]
                          : [...formattedPoints, userPoint];
      
                        fetch(`https://leningrad-after-the-victory.ru/api/routes/computeWalkingRoutesList`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ points: fullRoute }),
                        })
                          .then((res) => res.json())
                          .then((data) => drawRoute(data.geoJson));
                      });
                  }
                });
            },
            (error) => alert("Ошибка геолокации: " + error.message)
          );
        } else {
          alert("Геолокация не поддерживается вашим браузером");
        }
      };

    const clearMarker = () => {
        if (userMarkerRef.current) {
            userMarkerRef.current.remove();
            userMarkerRef.current = null;
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose();
        clearRoute();
        clearMarker();
    };

    // Обработчики свайпа для мобильной версии
    const handleTouchStart = (e) => {
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || startY === null) return;
        const deltaY = e.touches[0].clientY - startY;
        if (isExpanded && deltaY < 0) {
            setDragOffset(0);
            return;
        }
        const clampedOffset = Math.max(-MAX_DRAG_OFFSET, Math.min(MAX_DRAG_OFFSET, deltaY));
        setDragOffset(clampedOffset);
        setImageOffset(Math.max(0, clampedOffset));
    };

    const handleTouchEnd = () => {
        const threshold = 50;
        if (dragOffset < -threshold) {
            setIsExpanded(true);
        } else if (dragOffset > threshold) {
            isExpanded ? setIsExpanded(false) : handleClose();
        }
        setDragOffset(0);
        setImageOffset(0);
        setIsDragging(false);
        setStartY(null);
    };

    // Проверка мобильного устройства
    useEffect(() => {
        const checkMobileView = () => setIsMobile(window.innerWidth <= 450);
        checkMobileView();
        window.addEventListener("resize", checkMobileView);
        return () => window.removeEventListener("resize", checkMobileView);
    }, []);

    if (!route) return null;

    return (
        <div className="container">
            {isMobile ? (
                <div className="mobile-version">
                    {isOpen && (
                        <>
                            {isExpanded && (
                                <img
                                    src={route.image}
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
                                <div className="bottom-sheet"
                                style={{
                                    transform: isExpanded ? "translateY(0)" : "translateY(83%)",
                                  }}>
                                    <div className="window-header">
                                        <h2>{route.name}</h2>
                                    </div>
                                    <div className="scrollable-content">
                                        <div className="window-content">
                                            <p>{route.details}</p>
                                            <div className="buttons-1 centered">
                                                <button onClick={handleSaveClick}>
                                                    <HeartIcon filled={isSaved} />
                                                    {isSaved ? "Сохранено" : "Сохранить"}
                                                </button>
                                                <button onClick={handleStartRoute}>
                                                    <img src="/route.svg" className="in-the-route" />
                                                    В путь
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="pc-version">
                    <div className={`info-window ${isOpen ? "open" : ""}`}>
                        <div className='button-to-exit'>
                            <button onClick={handleClose}>✕</button>
                        </div>
                        <h2>{route.name}</h2>
                        <div className="image-container">
                            <img src={route.image} className="object-image" />
                        </div>
                        <div className="buttons-1 centered">
                            <button onClick={handleSaveClick}>
                                <HeartIcon filled={isSaved} />
                                {isSaved ? "Сохранено" : "Сохранить"}
                            </button>
                            <button onClick={handleStartRoute}>
                                <img src="/route.svg" className="in-the-route" />
                                В путь
                            </button>
                        </div>
                        <p>{route.details}</p>
                    </div>
                </div>
            )}

            {showAuthModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Вы не авторизованы. Хотите войти?</p>
                        <div className="modal-buttons">
                            <button onClick={() => setShowAuthModal(false)}>Остаться</button>
                            <button onClick={() => router.push('/authentication-authorization')}>Войти</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
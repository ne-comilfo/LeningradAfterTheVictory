"use client";

import React, { useRef, useEffect, useState, Suspense } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './/page-style.css';
import { useRouter } from 'next/navigation';
import InfoWindow from '../info-for-map/page';
import RouteWindow from '../info-for-map/route-window';
import { useSearchParams } from 'next/navigation';

const Popa = () => {
    const [routeAttractionIds, setRouteAttractionIds] = useState([]);

    const searchParams = useSearchParams();
    const attractionId = searchParams.get('attractionId');
    const [markers, setMarkers] = useState([]);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);
    const [minYear, setMinYear] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const [selectedRouteId, setSelectedRouteId] = useState(null);
    const [isRouteWindowOpen, setIsRouteWindowOpen] = useState(false);
    const MIN_YEAR_DIFFERENCE = 9; // Минимальная разница между годами


    useEffect(() => {
        const attractionId = searchParams.get('attractionId');
        const routeId = searchParams.get('routeId');

        // Обработка маркера достопримечательности
        if (attractionId && markers.length > 0) {
            const marker = markers.find(m => String(m.id) === attractionId);
            if (marker) {
                map.current?.flyTo({
                    center: marker.location.coordinates,
                    zoom: 15,
                    essential: true
                });
                setSelectedMarker(marker);
                setIsInfoWindowOpen(true);
            }
        }

        // Обработка маршрута (восстановленная функция)
        if (routeId) {


            fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${routeId}`)
                .then(response => response.json())
                .then(routeData => {
                    const coordinates = routeData.attractions.map(attraction =>
                        attraction.location.coordinates
                
              );
              const attractionIds = routeData.attractions.map(attraction => attraction.id);
                    setRouteAttractionIds(attractionIds);

            // Формируем GeoJSON для маршрута
            const geojson = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: coordinates
                }
            };

            // Удаляем старый маршрут если есть
            if (map.current.getLayer('route')) {
                map.current.removeLayer('route');
                map.current.removeSource('route');
            }

            // Добавляем новый маршрут
            map.current.addSource('route', {
                type: 'geojson',
                data: geojson
            });

            map.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#3b82f6',
                    'line-width': 4
                }
            });

            // Центрируем карту на маршруте
            const bounds = coordinates.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new maptilersdk.LngLatBounds(coordinates[0], coordinates[0]));

            map.current.fitBounds(bounds, {
                padding: 50
            });

            setSelectedRouteId(routeId);
            setIsRouteWindowOpen(true);
        })
        .catch(error => {
            console.error("Ошибка загрузки маршрута:", error);
        })
        .finally(() => {
            // Очищаем URL параметры после обработки
            router.replace('/map', undefined, { shallow: true });
        });
}
      }, [searchParams, markers, router]);

const clearRoute = () => {
    if (!map.current) return;

    if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
    }
    setRouteAttractionIds([]);
};

const drawRoute = (coordinates) => {
    if (!map.current || !coordinates || coordinates.length === 0) return;

    if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
    }

    const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: coordinates,
        },
    };

    map.current.addSource('route', {
        type: 'geojson',
        data: geojson,
    });

    map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': '#3b82f6',
            'line-width': 4,
        },
    });

    const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
    }, new maptilersdk.LngLatBounds(coordinates[0], coordinates[0]));

    map.current.fitBounds(bounds, {
        padding: 50,
    });
};

const mapContainer = useRef(null);
const map = useRef(null);
const spb = { lng: 30.3148, lat: 59.9343 };
const zoom = 11;
const lang = 'ru';
maptilersdk.config.apiKey = 'ozVhpb986qzcqh7JCGLE';

const markerElements = useRef([]);

useEffect(() => {
    const fetchMarkers = async () => {
        try {
            const response = await fetch("https://leningrad-after-the-victory.ru/api/attractions/get-all");
            const data = await response.json();
            setMarkers(data);

            const years = data.map(marker => marker.yearOfCreation);
            setMinYear(Math.min(...years));
            setMaxYear(Math.max(...years));

            setFilteredMarkers(data);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    };

    fetchMarkers();
}, []);

useEffect(() => {
    setStartYear(minYear);
    setEndYear(maxYear);
}, [minYear, maxYear]);

useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [spb.lng, spb.lat],
        zoom: zoom,
        language: lang,
    });

    const bounds = [
        [29.6, 59.5],
        [30.8, 60.1],
    ];
    map.current.setMaxBounds(bounds);
    map.current.setMinZoom(10);

    return () => {
        if (map.current) {
            map.current.remove();
            map.current = null;
        }
    };
}, []);

useEffect(() => {
    if (startYear !== null && endYear !== null) {
        const filtered = markers.filter(marker => {
            const buildYear = marker.yearOfCreation;
            return buildYear >= startYear && buildYear <= endYear;
        });
        setFilteredMarkers(filtered);
    }
}, [startYear, endYear, markers]);

const handleChange = (value) => {
    const [newStartYear, newEndYear] = value;

    if (newEndYear - newStartYear < MIN_YEAR_DIFFERENCE) {
        return;
    }

    setStartYear(newStartYear);
    setEndYear(newEndYear);
};

const calculatePosition = (value) => {
    return ((value - minYear) / (maxYear - minYear)) * 92;
};

const renderYearLabels = () => {
    const difference = endYear - startYear;

    if (difference === MIN_YEAR_DIFFERENCE) {
        return (
            <div className="slider-labels">
                <span className="min-label">{minYear}</span>
                <span className="max-label">{maxYear}</span>

                <span
                    className="current-label start-label"
                    style={{
                        left: `${calculatePosition(startYear) + 4}%`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {startYear}
                </span>
                <span
                    className="current-label end-label"
                    style={{
                        left: `${calculatePosition(endYear) + 4}%`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    {endYear}
                </span>

            </div>
        );
    }

    return (
        <div className="slider-labels">
            <span className="min-label">{minYear}</span>
            <span className="max-label">{maxYear}</span>

            <span
                className="current-label start-label"
                style={{
                    left: `${calculatePosition(startYear) + 4}%`,
                    transform: 'translateX(-50%)',
                }}
            >
                {startYear}
            </span>
            <span
                className="current-label end-label"
                style={{
                    left: `${calculatePosition(endYear) + 4}%`,
                    transform: 'translateX(-50%)',
                }}
            >
                {endYear}
            </span>
        </div>
    );
};

useEffect(() => {
    if (!map.current) return;

    markerElements.current.forEach(marker => marker.remove());
    markerElements.current = [];

    filteredMarkers
  .filter(marker => {
    if (routeAttractionIds.length > 0) {
      return routeAttractionIds.includes(marker.id);
    }
    return true;
  })
  .forEach(marker => {
    if (marker?.location?.coordinates) {
      const markerElement = new maptilersdk.Marker()
        .setLngLat(marker.location.coordinates)
        .addTo(map.current);

      markerElement.getElement().addEventListener('click', () => {
        setSelectedMarker(marker);
        setIsInfoWindowOpen(true);
        setIsExpanded(false);
        localStorage.setItem('selectedMarkerId', marker.id);
      });

      markerElements.current.push(markerElement);
    }
  });

}, [filteredMarkers, routeAttractionIds]);




return (
    <div>
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>

        <div className="slider-container">
            <div>
                <Slider
                    range
                    min={minYear}
                    max={maxYear}
                    value={[startYear, endYear]}
                    onChange={handleChange}
                />
            </div>

            {renderYearLabels()}
        </div>
        {isRouteWindowOpen && (
            <RouteWindow
                routeId={selectedRouteId}
                marker={selectedMarker}
                onClose={() => setIsRouteWindowOpen(false)}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                drawRoute={drawRoute}
                clearRoute={clearRoute}
                map={map}
            />
        )}
        {isInfoWindowOpen && (
            <InfoWindow
                marker={selectedMarker}
                onClose={() => setIsInfoWindowOpen(false)}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                drawRoute={drawRoute}
                clearRoute={clearRoute}
                map={map}
                setRouteAttractionIds={setRouteAttractionIds}
            />
        )}
    </div>
);
}

export default function Map() {
    return (
            <Suspense fallback>
                <Popa />
            </Suspense>
        );
}
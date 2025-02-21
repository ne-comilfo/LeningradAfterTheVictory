"use client";

import React, { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './/page-style.css';
import InfoWindow from '../info-for-map/page';

export default function Map() {
    const [markers, setMarkers] = useState([]);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);
    const [minYear, setMinYear] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null); // Выбранная метка
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false); // Открыто ли окно
    const [isExpanded, setIsExpanded] = useState(false);

    const drawRoute = (map, coordinates) => {
        // Проверяем, что карта и координаты существуют
        if (!map || !coordinates || coordinates.length === 0) return;

        // Удаляем предыдущий маршрут, если он был
        if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
        }

        // Создаем GeoJSON объект для маршрута
        const geojson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates, // Координаты точек маршрута
                    },
                },
            ],
        };

        // Добавляем источник данных для маршрута
        map.addSource('route', {
            type: 'geojson',
            data: geojson,
        });

        // Добавляем слой для отрисовки линии маршрута
        map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
                'line-join': 'round',
                'line-cap': 'round',
            },
            paint: {
                'line-color': '#3887be',
                'line-width': 5,
            },
        });

        // Приближаем карту к маршруту
        const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
        }, new maptilersdk.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
            padding: 50, // Отступы от краев карты
            maxZoom: 15, // Максимальное приближение
        });
    };

    const mapContainer = useRef(null);
    const map = useRef(null);
    const spb = { lng: 30.3148, lat: 59.9343 };
    const zoom = 11;
    const lang = 'ru';
    maptilersdk.config.apiKey = 'ozVhpb986qzcqh7JCGLE';


    //  Ссылки на метки для отображения
    const markerElements = useRef([]);

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch('http://194.87.252.234:6060/api/attractions/get-all');

                const data = await response.json();
                setMarkers(data); // Обновляем состояние с метками


                // Определяем минимальный и максимальный год
                const years = data.map(marker => marker.yearOfCreation);
                setMinYear(Math.min(...years));
                setMaxYear(Math.max(...years));

                setFilteredMarkers(data); // Фильтруем метки (по умолчанию показываем все)

            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchMarkers();  // Загружаем метки при монтировании компонента
    }, []);

    useEffect(() => {
        // Начальные значения слайдера
        setStartYear(minYear);
        setEndYear(maxYear);
    }, [minYear, maxYear]);

    useEffect(() => {
        if (map.current) return; // Не инициализировать повторно

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [spb.lng, spb.lat],
            zoom: zoom,
            language: lang
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };  // Очистка карты при размонтировании компонента

    }, []);


    useEffect(() => {
        // Фильтрация меток по годам
        if (startYear !== null && endYear !== null) {
            const filtered = markers.filter(marker => {
                const buildYear = marker.yearOfCreation; // Год постройки здания
                return buildYear >= startYear && buildYear <= endYear;
            });
            setFilteredMarkers(filtered);
        }
    }, [startYear, endYear, markers]);

    const handleChange = (value) => {
        // Обновляем диапазон по клику на фильтр
        setStartYear(value[0]);
        setEndYear(value[1]);
    };

    const calculatePosition = (value) => {
        // Рассчитываем процентное положение для текущего значения ручки слайдера
        return ((value - minYear) / (maxYear - minYear)) * 92;
    };

    useEffect(() => {
        // Очистка текущих меток, добавленных на карту
        markerElements.current.forEach(marker => marker.remove());
        markerElements.current = [];

        // Добавление новых меток на карту
        filteredMarkers.forEach(marker => {
            const markerElement = new maptilersdk.Marker()
                .setLngLat(marker.location.coordinates)
                .addTo(map.current)
            markerElement.getElement().addEventListener('click', () => {
                setSelectedMarker(marker); // Устанавливаем выбранную метку
                setIsInfoWindowOpen(true); // Открываем InfoWindow
                setIsExpanded(false);
            });

            markerElements.current.push(markerElement);
        });
    }, [filteredMarkers]);




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
            </div>
            {isInfoWindowOpen && (
                <InfoWindow
                    marker={selectedMarker} // Передаем выбранную метку
                    onClose={() => setIsInfoWindowOpen(false)} // Закрываем окно
                    isExpanded={isExpanded} // Передаем состояние свернуто/развернуто
                    setIsExpanded={setIsExpanded} // Передаем функцию для управления состоянием
                    drawRoute={drawRoute}
                />
            )}
        </div>

    );
}


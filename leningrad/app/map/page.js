"use client";

import React, { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './/page-style.css';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();

    const clearRoute = () => {
        if (!map.current) return;

        // Удаляем слой и источник маршрута, если они существуют
        if (map.current.getLayer('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
        }
    };

    const drawRoute = (coordinates) => {
        if (!map.current || !coordinates || coordinates.length === 0) return;

        // Удаляем предыдущий маршрут, если он был
        if (map.current.getLayer('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
        }

        // Создаем GeoJSON объект для маршрута
        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordinates,
            },
        };

        // Добавляем источник и слой для маршрута
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

        // Масштабируем карту так, чтобы маршрут был виден
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


    //  Ссылки на метки для отображения
    const markerElements = useRef([]);
    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch("http://194.87.252.234:6060/api/attractions/get-all");
                const data = await response.json();
                setMarkers(data); // Обновляем состояние с метками

                // Определяем минимальный и максимальный год
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
        // Начальные значения слайдера
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
            [29.8, 59.7], // Юго-западная граница (нижний левый угол)
            [30.8, 60.1], // Северо-восточная граница (верхний правый угол)
        ];
        map.current.setMaxBounds(bounds);
    
        // Устанавливаем минимальный и максимальный уровень масштабирования
        map.current.setMinZoom(10); // Минимальный уровень масштабирования
        map.current.setMaxZoom(14);

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
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
        if (!map.current) return; // Проверяем, что карта была инициализирована

        // Очистка текущих меток, добавленных на карту
        markerElements.current.forEach(marker => marker.remove());
        markerElements.current = [];

        // Добавление новых меток на карту
        filteredMarkers.forEach(marker => {
            if (marker?.location?.coordinates) { // Проверяем, что координаты существуют
                const markerElement = new maptilersdk.Marker()
                    .setLngLat(marker.location.coordinates)
                    .addTo(map.current);

                markerElement.getElement().addEventListener('click', () => {
                    setSelectedMarker(marker);
                    setIsInfoWindowOpen(true);
                    setIsExpanded(false);
                });

                markerElements.current.push(markerElement);
            }
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
                    clearRoute={clearRoute}
                    map={map}

                />
            )}
        </div>

    );

}




"use client";

import React, { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './/page-style.css';

export default function Map() {
    const [markers, setMarkers] = useState([]);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [startYear, setStartYear] = useState(null);
    const [endYear, setEndYear] = useState(null);
    const [maxYear, setMaxYear] = useState(null);
    const [minYear, setMinYear] = useState(null);

    const mapContainer = useRef(null);
    const map = useRef(null);
    const spb = { lng: 30.3148, lat: 59.9343 };
    const zoom = 11;
    const lang = 'ru';
    maptilersdk.config.apiKey = 'ozVhpb986qzcqh7JCGLE';


    //  Ссылки на метки для отображения
    const markerElements = useRef([]);

    useEffect(() => {
        const  fetchMarkers = async () => {
            try {
                const response = await fetch('http://194.87.252.234:8080/api/attractions/get-all');

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

                markerElements.current.push(markerElement);
            });
        }, [filteredMarkers]);




            return (
                <div>
                    <div className="map-wrap">
                    <div ref={mapContainer} className="map"/>
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
                                    left: `${calculatePosition(startYear)+4}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {startYear}
                            </span>
                            <span
                                className="current-label end-label"
                                style={{
                                    left: `${calculatePosition(endYear)+4}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {endYear}
                            </span>
                        </div>
                    </div>
                </div>
            );
}


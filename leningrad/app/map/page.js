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

    const [touchStartEnd, setTouchStartEnd] = useState(null);
    const [touchMinStart, setTouchMinStart] = useState(null);
    const [touchEndMax, setTouchEndMax] = useState(null);
    const [equalMinStart, setEqualMinStart] = useState(null);
    const [equalEndMax, setEqualEndMax] = useState(null);
    const [selectedMarker] = useState(null); // Выбранная метка
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false); // Открыто ли окно

    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const minRes = 3.2;
    const maxRes = 88.7;
    const middleDistance = 3.4;

    const MIN_YEAR_DIFFERENCE = 9; // Минимальная разница между годами

    useEffect(() => {
        const markerId = localStorage.getItem('selectedMarkerId');
        if (markerId && markers.length > 0) {
            const foundMarker = markers.find(marker => String(marker.id) === String(markerId));
            if (foundMarker) {
                setSelectedMarker(foundMarker);
                setIsInfoWindowOpen(true);
                setIsExpanded(false);
            }
            if (map.current) {
                map.current.flyTo({
                    center: foundMarker.location.coordinates,
                    zoom: 14,
                    essential: true // Гарантирует выполнение анимации
                });
            }
            localStorage.removeItem('selectedMarkerId');
        }
    }, [markers]);

    const clearRoute = () => {
        if (!map.current) return;

        if (map.current.getLayer('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
        }
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
                const response = await fetch("http://194.87.252.234:6060/api/attractions/get-all");
                const data = await response.json();
                setMarkers(data);

                const years = data.map(marker => marker.yearOfCreation);
                setMinYear(1703);
                setMaxYear(2025);
                //setFilteredMarkers(data);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
            }
        };

        fetchMarkers();
        console.log(minYear);
    }, []);


    useEffect(() => {
        setMinYear(1703);
        setMaxYear(2025);
    }, []);        


    useEffect(() => {
        setStartYear(minYear);
        setEndYear(maxYear);
        setTouchMinStart(false);
        setTouchEndMax(false);
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

    const processPosition = (value1, value2, label_num) => {
        const res1 = calculatePosition(value1);
        const res2 = calculatePosition(value2);
    
        setEqualMinStart(res1 <= 0);
        setEqualEndMax(res2 >= 92);
        setTouchMinStart(res1 <= minRes && res1 > 0);
        setTouchEndMax(res2 >= maxRes && res2 < 92);

        const limit_res1 = ((res1 <= 0 || res1 >= 92) ? res1 : Math.min(Math.max(res1, minRes), maxRes));
        const limit_res2 = ((res2 <= 0 || res2 >= 92) ? res2 : Math.min(Math.max(res2, minRes), maxRes));

        setTouchStartEnd(Math.abs(limit_res1 - limit_res2) <= middleDistance);
        
        if(res1 == res2) {
            setTouchStartEnd(false);
            return limit_res1;
        }
        
        if (label_num == 1) {
            if (equalMinStart) {
                return 0;
            } else if (touchMinStart) {
                return minRes;
            }
        } else {
            if (equalEndMax) {
                return 92;
            } else if (touchEndMax) {
                return maxRes;
            }
        }

        if (touchStartEnd) {
            if (label_num == 1 && equalEndMax) {
                return maxRes;
            } else if (label_num == 2 && equalMinStart) {
                return minRes;
            }

            const middle = (limit_res1 + limit_res2) / 2;
            const middle_res1 = middle - middleDistance / 2;
            const middle_res2 = middle + middleDistance / 2;

            if (label_num == 1 && equalEndMax) {
                return Math.min(maxRes, middle_res1);
            } else if (label_num == 2 && equalMinStart) {
                return Math.max(minRes, middle_res2);
            }

            setTouchMinStart(middle_res1 <= minRes);
            setTouchEndMax(middle_res2 >= maxRes);
            
            if (label_num == 1) {
                return Math.max((touchEndMax ? maxRes - middleDistance: middle_res1), minRes);
            } else {
                return Math.min((touchMinStart ? minRes + middleDistance: middle_res2), maxRes);
            }
        }

        if (label_num == 1) {
            return limit_res1;
        } else {
            return limit_res2;
        }
    }

    const calculatePosition = (value) => {

        // Рассчитываем процентное положение для текущего значения ручки слайдера

        const res = ((value - minYear) / (maxYear - minYear)) * 92;
        return res;

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

        filteredMarkers.forEach(marker => {
            if (marker?.location?.coordinates) {
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

    const SliderLabels = (value) => (
        <div className="slider-labels">
            <span className="min-label">{minYear}</span>
            <span className="max-label">{maxYear}</span>

            <span
                className="current-label start-label"
                style={{
                    left: `${processPosition(startYear, endYear, 1) + 4}%`,
                    transform: 'translateX(-50%)',
                }}
            >
                {startYear + ((touchStartEnd && !(equalMinStart || touchMinStart)) ? "-" : "")}
            </span>
            <span
                className="current-label end-label"
                style={{
                    left: `${processPosition(startYear, endYear, 2) + 4}%`,
                    transform: 'translateX(-50%)',
                }}
            >
                {((touchStartEnd && (equalMinStart || touchMinStart)) ? "-" : "") + endYear}
            </span>
        </div>
    );

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
                        type="range"
                        id="cowbell"
                        name="cowbell"
                        step="1"
                    />
                </div>


                <SliderLabels />
            </div>

        </div>
    );
}
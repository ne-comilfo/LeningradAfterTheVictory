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
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();

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

            {isInfoWindowOpen && (
                <InfoWindow
                    marker={selectedMarker}
                    onClose={() => setIsInfoWindowOpen(false)}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    drawRoute={drawRoute}
                    clearRoute={clearRoute}
                    map={map}
                />
            )}
        </div>
    );
}
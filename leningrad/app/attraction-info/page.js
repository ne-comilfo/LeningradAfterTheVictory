"use client";

import "./page-style.css";
import TimePeriodSection from "@/components/attraction-info/time-period-section";
import "../../components/attraction-info/interesting-facts"
import "../../components/attraction-info/button-panel"
import { useState, useEffect, Suspense } from 'react';
import InterestingFacts from "@/components/attraction-info/interesting-facts";
import ButtonPanel from "@/components/attraction-info/button-panel";
import { useSearchParams } from 'next/navigation';

const AttractionInfoComponent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [routes, setRoutes] = useState([]);
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const buildingResponse = await fetch(`http://194.87.252.234:6060/api/attractions/attraction/${id}`);
                if (!buildingResponse.ok) throw new Error('Не удалось загрузить данные о здании');
                const buildingData = await buildingResponse.json();
                setBuilding(buildingData);

                // Загрузка маршрутов
                const routesResponse = await fetch("http://194.87.252.234:6060/api/routes/get-all");
                if (!routesResponse.ok) throw new Error('Не удалось загрузить список маршрутов');
                const routesList = await routesResponse.json();

                const routeDetails = await Promise.all(
                    routesList.map(route =>
                        fetch(`http://194.87.252.234:6060/api/routes/route/${route.id}`)
                            .then(res => res.json())
                    )
                );

                const matchedRoutes = routeDetails
                    .filter(route =>
                        route.attractions.some(attraction => attraction.id === parseInt(id))
                    )
                    .map(route => ({
                        name: route.name,
                        id: route.id,
                        image: route.url
                    }));

                setRoutes(matchedRoutes);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="loading-or-error">Загрузка...</div>;

    if (error) return <div className="loading-or-error">Ошибка: {error}</div>;


    return (
        <>
            <div className="white">
                <h1 className="attraction-title">{`${building.name}, ${building.yearOfCreation}`}</h1>

                <img className="main-image" src={building.linksPreview} />
                <div className="preview-text">{`${building.smallDescription}`}</div>

                <ButtonPanel attractionId={building?.id} />
            </div>
            <div className="page-style">
                <TimePeriodSection routes={routes} key={0} section={{ name: "До блокады", image: building.linksBefore, description: building.descriptionBefore }} />
                <TimePeriodSection routes={routes} key={1} section={{ name: "После блокады", image: building.linksIn, description: building.descriptionIn }} />
                <TimePeriodSection routes={routes} key={2} section={{ name: "Настоящее время", image: building.linksAfter, description: building.descriptionAfter }} />
            </div>
            {building.interestingFacts.length > 0 ? (
                <div className="white">

                    <InterestingFacts facts={building.interestingFacts} />

                </div>
            ) : null}

        </>
    );
}

export default function AttractionInfoPage() {
    return (
        <Suspense fallback={<div className="loading-or-error">Загрузка...</div>}>
            <AttractionInfoComponent />
        </Suspense>
    );
}
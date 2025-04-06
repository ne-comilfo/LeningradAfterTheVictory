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

        const [building, setBuilding] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            if (!id) return;

            const fetchBuilding = async () => {
                try {
                    const response = await fetch(`http://158.160.145.118:6060/api/attractions/attraction/${id}`);

                    if (!response.ok) {
                        throw new Error('Не удалось загрузить данные');
                    }

                    const data = await response.json();
                    setBuilding(data);
                    console.log(data);

                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchBuilding();
        }, [id]);


        if (loading) return <div className="loading-or-error">Загрузка...</div>;

        if (error) return <div className="loading-or-error">Ошибка: {error}</div>;



    return (
        <div className="page-style">
            <img className="main-image" src={building.mainImage} alt="главная картинка"/>
            <h1 className="attraction-title">{`${building.name}, ${building.yearOfCreation}`}</h1>

            <ButtonPanel/>

            <TimePeriodSection key={0} section={{ name: "До блокады", image: building.linksBefore, description: building.descriptionBefore }} />
            <TimePeriodSection key={1} section={{ name: "Во время блокады", image: building.linksIn, description: building.descriptionIn }} />
            <TimePeriodSection key={2} section={{ name: "После блокады", image: building.linksAfter, description: building.descriptionAfter }} />

            {Array.isArray(building.interestingFacts) && building.interestingFacts.length > 0 ? (
                <InterestingFacts facts={building.interestingFacts} />
            ) : null}
        </div>
    );
}

export default function AttractionInfoPage () {
    return (
        <Suspense fallback={<div className="loading-or-error">Загрузка...</div>}>
        <AttractionInfoComponent />
        </Suspense>
    );
}
"use client";

import "./page-style.css";
import TimePeriodSection from "@/components/attraction-info/time-period-section";
import InterestingFacts from "@/components/attraction-info/interesting-facts";
import ButtonPanel from "@/components/attraction-info/button-panel";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import 'swiper/css';
import 'swiper/css/pagination';

// Выносим повторяющийся блок в отдельный компонент
const MediaSwiper = ({ media, className = "" }) => {
    return (
        <>
            <div className="swiper-slide">
                <Swiper
                    modules={[Pagination]}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 3
                    }}
                    className={className}
                >
                    {media.map((item, index) => (
                        <SwiperSlide key={index} >
                            {item.type === "image" ? (
                                <img className="main-image" src={item.src} alt="" />
                            ) : (
                                <div className="video-container">
                                    <ReactPlayer
                                        url={item.src}
                                        controls
                                        width="100%"
                                        height="200px"
                                    />
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div >
        </>
    );
};

// Компонент для временного периода с Swiper
const TimePeriodWithSwiper = ({ title, images, description, routes, isMobile }) => {
    return (
        <>
            <div className="attraction-title">{title}</div>
            <div className="swiper-container">
                <MediaSwiper
                    media={images.map(img => ({ type: "image", src: img }))}
                />
            </div>
            <TimePeriodSection
                routes={routes}
                isMobile={isMobile}
                section={{ name: title, image: images, description }}
            />
        </>
    );
};

const AttractionInfoComponent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [routes, setRoutes] = useState([]);
    const [building, setBuilding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

    const handleNext = () => {
        setCurrentMediaIndex((prev) => (prev + 1) % media.length);
    };

    const handlePrev = () => {
        setCurrentMediaIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 450px)");
        const handleResize = (e) => setIsMobile(e.matches);


        handleResize(mediaQuery);
        mediaQuery.addEventListener("change", handleResize);


        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const [buildingRes, routesRes] = await Promise.all([
                    fetch(`https://leningrad-after-the-victory.ru/api/attractions/attraction/${id}`),
                    fetch("https://leningrad-after-the-victory.ru/api/routes/get-all")
                ]);

                if (!buildingRes.ok || !routesRes.ok) throw new Error('Ошибка загрузки данных');

                const buildingData = await buildingRes.json();
                const routesList = await routesRes.json();

                const routeDetails = await Promise.all(
                    routesList.map(route =>
                        fetch(`https://leningrad-after-the-victory.ru/api/routes/route/${route.id}`).then(res => res.json())
                    ));

                const matchedRoutes = routeDetails
                    .filter(route => route.attractions.some(a => a.id === parseInt(id)))
                    .map(route => ({
                        name: route.name,
                        id: route.id,
                        image: route.url
                    }));

                setBuilding(buildingData);
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
    if (!building) return null;

    const media = [
        { type: "image", src: building.linksPreview },
        { type: "video", src: "https://storage.yandexcloud.net/social-network-media/2_master.m3u8", preview: "./hermitage1.png" }
    ];

    const getOrderedMedia = () => {
        return media[currentMediaIndex].type === "video" ? [...media].reverse() : media;
    };

    return isMobile ? ( 
        <>
            <div className="white">
                <h1 className="attraction-title">{`${building.name}, ${building.yearOfCreation}`}</h1>
                <div className="swiper-container">
                    <MediaSwiper media={media} />
                </div>
                <ButtonPanel attractionId={building.id} />
                <div className="preview-text">{building.smallDescription}</div>
            </div> 

            <div className="page-style">
                <TimePeriodWithSwiper
                    title="До блокады"
                    images={building.linksBefore}
                    description={building.descriptionBefore}
                    routes={routes}
                    isMobile={isMobile}
                />

                <TimePeriodWithSwiper
                    title="После блокады"
                    images={building.linksIn}
                    description={building.descriptionIn}
                    routes={routes}
                    isMobile={isMobile}
                />

                <TimePeriodWithSwiper
                    title="Настоящее время"
                    images={building.linksAfter}
                    description={building.descriptionAfter}
                    routes={routes}
                    isMobile={isMobile}
                />
            </div>

            <div className="center">
                <hr className="routes-1ine" />
                <div className="routes-label">Маршруты</div>
                <hr className="routes-1ine" />
            </div>

            {routes.map((route) => (
                <div key={route.id}>
                    <div className="r0ute-item">
                        <img src={route.image} alt={route.name} className="r0ute-image" />
                        <a href="/routes" className="r0ute-name">{route.name}</a>
                    </div>
                    <div className="center">
                        <hr className="route-divider" />
                    </div>
                </div>
            ))}

            {building.interestingFacts?.length > 0 && (
                <div className="white">
                    <InterestingFacts facts={building.interestingFacts} isMobile={isMobile} />
                </div>
            )}
        </>
    ) : (
        <>
            <div className="white">
                <h1 className="attraction-title">{`${building.name}, ${building.yearOfCreation}`}</h1>
                <div className="pip">
                    {media[currentMediaIndex].type === "video" ? (
                        <div className="react-player-wrapper">
                            <div className="video-container">
                                <ReactPlayer
                                    url={media[currentMediaIndex].src}
                                    playing={true}

                                    controls
                                    width="100%"
                                    height="100%"
                                />
                            </div>
                        </div>
                    ) : (
                        <img className="main-image" src={media[currentMediaIndex].src} alt={building.name} />
                    )}

                    <div className="media-container">
                        <button className="arrow-btn" onClick={handlePrev}>
                            <img src="./up.svg" className="arrows" />
                        </button>

                        {getOrderedMedia().map((item, index) => (
                            <div
                            key={index}
                            className={`image-thumbnail-wrapper ${index === 0 ? "top-media" : "ne-top"}`}
                          >
                            <img
                              className="image-carousel"
                              src={item.type === "video" ? item.preview : item.src}
                              alt=""
                            />
                            {item.type === "video" && (
                              <div className="play-icon-overlay"><img src="./to-play.svg"/></div>
                            )}
                          </div>                          
                        ))}


                        <button className="arrow-btn" onClick={handleNext}>
                            <img src="./down.svg" className="arrows" />
                        </button>
                    </div>
                </div>

                <div className="preview-text">{building.smallDescription}</div>
                <ButtonPanel attractionId={building.id} />
            </div>

            <div className="page-style">
                <TimePeriodSection
                    routes={routes}
                    section={{
                        name: "До блокады",
                        image: building.linksBefore,
                        description: building.descriptionBefore
                    }}
                />
                <TimePeriodSection
                    routes={routes}
                    section={{
                        name: "После блокады",
                        image: building.linksIn,
                        description: building.descriptionIn
                    }}
                />
                <TimePeriodSection
                    routes={routes}
                    section={{
                        name: "Настоящее время",
                        image: building.linksAfter,
                        description: building.descriptionAfter
                    }}
                />
            </div>

            {building.interestingFacts?.length > 0 && (
                <div className="white">
                    <InterestingFacts facts={building.interestingFacts} />
                </div>
            )}
        </>
    );
};

export default function AttractionInfoPage() {
    return (
        <Suspense fallback={<div className="loading-or-error">Загрузка...</div>}>
            <AttractionInfoComponent />
        </Suspense>
    );
}
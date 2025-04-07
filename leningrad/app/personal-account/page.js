'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import './personal-account-style.css';


const API_URL_PLACES = "https://leningrad-after-the-victory.ru/api/favorites/buildings";
const API_URL_ROUTES = "https://leningrad-after-the-victory.ru/api/favorites/routes";
const API_URL_PLACES_PHOTOS = "https://leningrad-after-the-victory.ru/attractions/attraction/";


const PersonalAccountPage = () => {
    const [isFavMode, setIsFavMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [attractionsFav, setAttractionsFav] = useState([]); // Состояние для избранных
    const [attractionsVis, setAttractionsVis] = useState([]); // Состояние для посещенных
    const [attractionsFavPhoto, setAttractionsFavPhoto] = useState(new Map());

    const [userName, setUserName] = useState("");  // Состояние для логина
    const [userEmail, setUserEmail] = useState(""); 
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState("");

    const handleAuth = async () => {
        try {
            const response = await fetch('https://leningrad-after-the-victory.ru/api/user/getUser', {
                method: "GET",
                credentials: "include", 
            });

            if (response.status === 200) {
                const data = await response.json();
                setUserName(data.name); // Сохраняем логин
                setUserEmail(data.mail);
                setLoading(false); 
            } else if (response.status === 422 || response.status === 500) {
                setTimeout(() => {
                    const currentUrl = window.location.pathname;
                    router.push(`/authentication-authorization?redirect=${encodeURIComponent(currentUrl)}`);
                }, 2000);
            } else {
                console.error(`Ошибка авторизации: ${response.status}`);
            }
        } catch (error) {
            console.error("Ошибка при проверке авторизации:", error);
        }
    };

    const LogOut = async () => {
        try {
            const response = await fetch('https://leningrad-after-the-victory.ru/api/authentication/logout', {
                method: "POST", 
                credentials: "include",
            });
    
            if (response.ok) {
                setLoading(true)
                setTimeout(() => {
                    const currentUrl = window.location.pathname;
                    router.push(`/authentication-authorization?redirect=${encodeURIComponent(currentUrl)}`);
                }, 2000);
            } else {
                console.error("Ошибка при выходе:", response.status);
            }
        } catch (error) {
            console.error("Ошибка запроса при выходе:", error);
        }
    };
    
    useEffect(() => {
        handleAuth(); // Проверяем токен на сервере

        async function fetchPlacesPhotos(placeID) {
            try {
                const response = await fetch(API_URL_PLACES_PHOTOS + placeID);
                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }
                const data = await response.json();
                return (placeID, data.linksPreview[0]);

            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        }

        const fetchPlaces = async () => {
            try {
                const response = await fetch(API_URL_PLACES);
                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }
                const data = await response.json();
                setAttractionsFav(data);  // Сохраняем данные в состоянии
                setAttractionsFavPhoto(attractionsFav.map(item => fetchPlacesPhotos(item.id)));

            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        const fetchRoutes = async () => {
            try {
                const response = await fetch(API_URL_ROUTES);
                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }
                const data = await response.json();
                setAttractionsVis(data);  // Сохраняем данные в состоянии
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchPlaces();
        fetchRoutes();

        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (loading) {
        return <div className="download">Загрузка...</div>;
    }

    const BackgroundTransition = () => (
        <div className="background-transition" />
    );

    const RoutesHeader = () => (
        <div className="routes-header">Маршруты</div>
    );

    const Profile = () => (
        <div className="profile">
            <img src="personal-account/icon.svg" className="profile-icon"></img>
            <div>
                <div className="data-type">
                    <div>Логин</div>
                    <div className="data">{userName}</div>
                </div>
                <div className="data-type">
                    <div>Почта</div>
                    <div className="data">{userEmail}</div>
                </div>
            </div>
        </div>
    );

    const MobileProfile = () => (
        <div className="profile">
            <img src="personal-account/icon.svg" className="profile-icon"></img>
            <div>
                <div className="data-type">
                    <div>Логин</div>
                    <div className="data">{userName}</div>
                </div>
                <div className="data-type">
                    <div>Почта</div>
                    <div className="data">{userEmail}</div>
                </div>
                <button onClick={LogOut} className="exit-button">Выйти</button>
            </div>
        </div>
    );

    const VisDestination = (id, name, photoURL) => (
        <span key={id} className="destination">
            <img src={photoURL} className="destination-photo"></img>
            <div className="name">{name}</div>
        </span>
    );

    const FavDestination = (id, name, photoURL) => (
        <span key={id} className="destination">
            <img src={photoURL} className="destination-photo"></img>
            <div className="name">{name}</div>
        </span>
    );

    const VisScrollMenu = () => (
        <div className="scrollmenu-vis">
            {
                attractionsVis.map(item => VisDestination(item.id, item.name, attractionsFavPhoto.get(item.id))) // TODO
            }
        </div>
    );

    const FavScrollMenu = () => (
        <div className="scrollmenu-fav">
            {
                attractionsFav.map(item => FavDestination(item.id, item.name, attractionsFavPhoto.get(item.id)))
            }
        </div>
    );

    const VisLaptopButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранные места</div>
            <div className="selected-button">Избранные маршруты</div>
            <button onClick={LogOut} className="exit-button switch">Выйти</button>
        </div>
    );

    const FavLaptopButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранные места</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>Избранные маршруты</div>
            <button onClick={LogOut} className="exit-button switch">Выйти</button>
        </div>
    );

    const VisMobileButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранные места</div>
            <div className="selected-button">Избранные маршруты</div>
        </div>
    );

    const FavMobileButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранные места</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>Избранные маршруты</div>
        </div>
    );

    const LaptopView = ({ isFavMode }) => (
        <>
            <BackgroundTransition />
            <Profile />
            <RoutesHeader />
            {isFavMode ? <FavLaptopButtons isFavMode={isFavMode} /> : <VisLaptopButtons isFavMode={isFavMode} />}
            {isFavMode ? <FavScrollMenu /> : <VisScrollMenu />}
        </>
    );

    const MobileView = ({ isFavMode }) => (
        <>
            <BackgroundTransition />
            <MobileProfile />
            {isFavMode ? <FavMobileButtons isFavMode={isFavMode} /> : <VisMobileButtons isFavMode={isFavMode} />}
            {isFavMode ? <FavScrollMenu /> : <VisScrollMenu />}
        </>
    );

    return (isMobile ? (<MobileView isFavMode={isFavMode} />) : (<LaptopView isFavMode={isFavMode} />));

}

export default PersonalAccountPage;

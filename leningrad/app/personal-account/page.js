'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import './personal-account-style.css';

const API_URL = "http://194.87.252.234:6060/api/attractions/get-all";

const PersonalAccountPage = () => {
    const [isFavMode, setIsFavMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [attractionsFav, setAttractionsFav] = useState([]); // Состояние для избранных
    const [attractionsVis, setAttractionsVis] = useState([]); // Состояние для посещенных
    const [userName, setUserName] = useState("");  // Состояние для логина
    const [userEmail, setUserEmail] = useState(""); 
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleAuth = async () => {
        try {
            const response = await fetch('http://194.87.252.234:6060/api/user/getUser', {
                method: "GET",
                credentials: "include", 
            });

            if (response.status === 200) {
                const data = await response.json();
                setUserName(data.name); // Сохраняем логин
                setUserEmail(data.mail);
                setLoading(false); 
            } else if (response.status === 422) {
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

    useEffect(() => {
        handleAuth(); // Проверяем токен на сервере

        const fetchDestinations = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }
                const data = await response.json();
                setAttractionsVis(data);  // Сохраняем данные в состоянии
                setAttractionsFav(data);  // Сохраняем данные в состоянии
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchDestinations();

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
                <a href="../authentication-authorization" className="exit-button">Выйти</a>
            </div>
        </div>
    );

    const VisDestination = (id, name, photoURL) => (
        <span key={id} className="destination">
            <div className="name">{name}</div>
            <img src={photoURL} className="destination-photo"></img>
            <div className="progress">
                <div className="bar">
                    <div className="bar-progress"></div>
                </div>
                <div className="percentage">30%</div>
            </div>

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
                attractionsVis.map(item => VisDestination(item.id, item.name, "./photo2.png"))
            }
        </div>
    );

    const FavScrollMenu = () => (
        <div className="scrollmenu-fav">
            {
                attractionsFav.map(item => FavDestination(item.id, item.name, "./photo2.png"))
            }
        </div>
    );

    const VisLaptopButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранное</div>
            <div className="selected-button">Посещенное</div>
            <a href="../authentication-authorization/index2.html" className="exit-button switch">Выйти</a>
        </div>
    );

    const FavLaptopButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранное</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>Посещенное</div>
            <a href="../authentication-authorization/index2.html" className="exit-button switch">Выйти</a>
        </div>
    );

    const VisMobileButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранное</div>
            <div className="selected-button">Посещенное</div>
        </div>
    );

    const FavMobileButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранное</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>Посещенное</div>
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

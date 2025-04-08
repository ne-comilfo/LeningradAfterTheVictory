'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import './personal-account-style.css';


const API_URL = "https://leningrad-after-the-victory.ru/api/attractions/get-all";
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
    const [favoriteBuildingsIds, setFavoriteBuildingsIds] = useState([]);
    const [favoriteRoutesIds, setFavoriteRoutesIds] = useState([]);
    const [allAttractions, setAllAttractions] = useState([]);
    const [allRoutes, setAllRoutes] = useState([]);
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState("");
    const API_URL_ATTRACTIONS = "https://leningrad-after-the-victory.ru/api/attractions/get-all";
    const API_URL_ROUTES = "https://leningrad-after-the-victory.ru/api/routes/get-all";
    const API_FAVORITES_BUILDINGS = "https://leningrad-after-the-victory.ru/api/favorites/buildings";
    const API_FAVORITES_ROUTES = "https://leningrad-after-the-victory.ru/api/favorites/routes";
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
                const currentUrl = window.location.pathname;
                router.push(`/authentication-authorization?redirect=${encodeURIComponent(currentUrl)}`);
            } else {
                console.error("Ошибка при выходе:", response.status);
            }
        } catch (error) {
            console.error("Ошибка запроса при выходе:", error);
        }
    };

    useEffect(() => {
        handleAuth(); // Проверяем токен на сервере
        const fetchData = async () => {
            try {
                // Загружаем ID избранных зданий и маршрутов
                const [buildingsRes, routesRes] = await Promise.all([
                    fetch(API_FAVORITES_BUILDINGS, { credentials: 'include' }),
                    fetch(API_FAVORITES_ROUTES, { credentials: 'include' })
                ]);

                const [favoriteBuildings, favoriteRoutes] = await Promise.all([
                    buildingsRes.json(),
                    routesRes.json()
                ]);

                setFavoriteBuildingsIds(favoriteBuildings);
                setFavoriteRoutesIds(favoriteRoutes);

                // Загружаем все здания и маршруты
                const [attractionsRes, routesAllRes] = await Promise.all([
                    fetch(API_URL_ATTRACTIONS),
                    fetch(API_URL_ROUTES)
                ]);

                const [attractions, routes] = await Promise.all([
                    attractionsRes.json(),
                    routesAllRes.json()
                ]);

                setAllAttractions(attractions);
                setAllRoutes(routes);


            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        fetchData();

        // Проверка мобильной версии
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
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

    // Фильтруем только избранные здания
    const favoriteBuildings = allAttractions.filter(attraction =>
        favoriteBuildingsIds.includes(attraction.id)
    );

    // Фильтруем только избранные маршруты
    const favoriteRoutes = allRoutes.filter(route =>
        favoriteRoutesIds.includes(route.id)
    );

    const VisDestination = ({ id, name, photoURL }) => {
        const router = useRouter();
        
        const handleClick = () => {
          router.push(`/attraction-info?id=${id}`);
        };
      
        return (
          <span key={id} className="destination" onClick={handleClick}>
            <div className="name">{name}</div>
            <img src={photoURL || "/default-image.png"} className="destination-photo" />
          </span>
        );
      };

      const FavDestination = ({ id, name, photoURL }) => {
        const router = useRouter();
        
        const handleClick = () => {
          router.push('/routes');
        };
      
        return (
          <span key={id} className="destination" onClick={handleClick}>
            <img src={photoURL || "/default-image.png"} className="destination-photo" />
            <div className="name">{name}</div>
          </span>
        );
      };

    const VisScrollMenu = () => (
        <div className="scrollmenu-vis">
            {favoriteRoutes.map(route => (
                <VisDestination
                    key={route.id}
                    id={route.id}
                    name={route.name}
                    photoURL={route.url} // или другое поле с изображением
                />
            ))}

        </div>
    );

    const FavScrollMenu = () => (
        <div className="scrollmenu-fav">

            {favoriteBuildings.map(building => (
                <FavDestination
                    key={building.id}
                    id={building.id}
                    name={building.name}
                    photoURL={building.linksPreview?.[0]} // или другое поле с изображением
                />
            ))}
        </div>
    );
    const FavLaptopButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранные места</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>
                Избранные маршруты
            </div>
            <button onClick={LogOut} className="exit-button switch">Выйти</button>
        </div>
    );

    const VisLaptopButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>
                Избранные места
            </div>
            <div className="selected-button">Избранные маршруты</div>
            <button onClick={LogOut} className="exit-button switch">Выйти</button>
        </div>
    );

    const VisMobileButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранные места</div>
            <div className="selected-button">Посещенное</div>
        </div>
    );

    const FavMobileButtons = ({ isFavMode }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранное</div>
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

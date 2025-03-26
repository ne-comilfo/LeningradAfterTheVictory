'use client'

import React, { useState, useEffect } from "react";
import './personal-account-style.css';
import AuthChecker from "../AuthChecker";

const API_URL = "http://194.87.252.234:6060/api/attractions/get-all";

const PersonalAccountPage = () => {
    let attractionsFav = [];
    let attractionsVis = [];
    const [isFavMode, setIsFavMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    const [isAuthChecked, setIsAuthChecked] = useState(false);

    if (!isAuthChecked) {
        return <AuthChecker onAuthComplete={() => setIsAuthChecked(true)} />;
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
                    <div className="data">Shurochic</div>
                </div>
                <div className="data-type">
                    <div>Почта</div>
                    <div className="data">Shurochic@yandex.ru</div>
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
                    <div className="data">Shurochic</div>
                </div>
                <div className="data-type">
                    <div>Почта</div>
                    <div className="data">Shurochic@yandex.ru</div>
                </div>
                <a href="../authentication-authorization/index2.html" className="exit-button">Выйти</a>
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

    async function fetchData() {
        try {
            const requestURL = API_URL;
            const requestVis = new Request(requestURL);
            const responseVis = await fetch(requestVis);
            attractionsVis = await responseVis.json();
            const responseFav = await fetch(requestVis);
            attractionsFav = await responseFav.json();
            console.log("done!!");
        } catch (error) {
            console.log('error >> ', error.message);
        }
    }

    useEffect(() => {

        const fetchDestinations = async () => {
            try {

                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`Ошибка запроса: ${response.status}`);
                }
                const data = await response.text();
                attractionsVis = await data.json();
                attractionsFav = await data.json();
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };

        /*async function fetchData() {
            try {
                const requestURL = API_URL;
                const requestVis = new Request(requestURL);
                const responseVis = await fetch(requestVis);
                attractionsVis = await responseVis.json();
                const responseFav = await fetch(requestVis);
                attractionsFav = await responseFav.json();
                console.log("done!!");
            } catch (error) {
                console.log('error >> ', error.message);
            }
        }*/

        fetchDestinations();

        const checkMobile = () => {
            if (window.innerWidth <= 768) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => {
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    return (
        <>
            isMobile ? (<MobileView isFavMode={isFavMode} />) : (<LaptopView isFavMode={isFavMode} />)
        </>
    );
}

export default PersonalAccountPage;
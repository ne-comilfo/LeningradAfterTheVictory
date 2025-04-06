'use client'

import React, { useState, useEffect } from "react";
import './personal-account-style.css';

const API_URL_ROUTES = "http://194.87.252.234:6060/api/favorites/routes";
const API_URL_BUILDINGS = "http://194.87.252.234:6060/api/favorites/buildings";

const PersonalAccountPage = () => {
    let attractionsFav = [];
    let attractionsVis = [];
    const [Category, setCategory] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

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

    const VisLaptopButtons = ({ Category }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setCategory(0)}>Избранные места</div>
            <div className="selected-button">Избранные маршруты</div>
            <a href="../authentication-authorization/index2.html" className="exit-button switch">Выйти</a>
        </div>
    );

    const FavLaptopButtons = ({ Category }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранные места</div>
            <div className="switch-button switch" onClick={() => setCategory(1)}>Избранные маршруты</div>
            <a href="../authentication-authorization/index2.html" className="exit-button switch">Выйти</a>
        </div>
    );

    const VisMobileButtons = ({ Category }) => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setCategory(0)}>Избранные места</div>
            <div className="selected-button">Избранные маршруты</div>
        </div>
    );

    const FavMobileButtons = ({ Category }) => (
        <div className="action-buttons">
            <div className="selected-button">Избранные места</div>
            <div className="switch-button switch" onClick={() => setCategory(1)}>Избранные маршруты</div>
        </div>
    );

    const LaptopView = ({ Category }) => (
        <>
            <BackgroundTransition />
            <Profile />
            <RoutesHeader />
            {(Category == 0) ? <FavLaptopButtons Category={Category} /> : <VisLaptopButtons Category={Category} />}
            {(Category == 0) ? <FavScrollMenu /> : <VisScrollMenu />}
        </>
    );

    const MobileView = ({ Category }) => (
        <>
            <BackgroundTransition />
            <MobileProfile />
            {(Category == 0) ? <FavMobileButtons Category={Category} /> : <VisMobileButtons Category={Category} />}
            {(Category == 0) ? <FavScrollMenu /> : <VisScrollMenu />}
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
    
        const fetchRoutes = async () => {
          try {
            
            const response = await fetch(API_URL_ROUTES);
            if (!response.ok) {
              throw new Error(`Ошибка запроса: ${response.status}`);
            }
            const data = await response.text();
            console.log(data)
            attractionsVis = await data.json();
          } catch (error) {
            console.error("Ошибка загрузки данных:", error);
          }
        };

        const fetchBuildings = async () => {
            try {
              
              const response = await fetch(API_URL_BUILDINGS);
              if (!response.ok) {
                throw new Error(`Ошибка запроса: ${response.status}`);
              }
              const data = await response.text();
              console.log(data)
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
    
        fetchRoutes();
        fetchBuildings();
    
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

    return( isMobile ? ( <MobileView Category={Category} /> ) : ( <LaptopView Category={Category} /> ));
}

export default PersonalAccountPage;
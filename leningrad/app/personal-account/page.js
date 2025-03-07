import React from 'react';
import './personal-account-style.css';

const PersonalAccountPage = () => {
    let attractionsFav = [];
    let attractionsVis = [];
    const [isFavMode, setIsFavMode] = useState(false);

    const BackgroundTransition = () => (
        <div className="background-transition" />
    );

    const RoutesHeader = () => (
        <div className="routes-header">Маршруты</div>
    );

    const Profile = () => (
        <div className="profile">
            <img src="icon.png" className="profile-icon"></img>
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
            <img src="icon.png" className="profile-icon"></img>
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

    const VisLaptopButtons = () => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранное</div>
            <div className="selected-button">Посещенное</div>
            <a href="../authentication-authorization/index2.html" className="exit-button switch">Выйти</a>
        </div>
    );

    const FavLaptopButtons = () => (
        <div className="action-buttons">
            <div className="selected-button">Избранное</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>Посещенное</div>
            <a href="../authentication-authorization/index2.html" className="exit-button switch">Выйти</a>
        </div>
    );

    const VisMobileButtons = () => (
        <div className="action-buttons">
            <div className="switch-button switch" onClick={() => setIsFavMode(true)}>Избранное</div>
            <div className="selected-button">Посещенное</div>
        </div>
    );

    const FavMobileButtons = () => (
        <div className="action-buttons">
            <div className="selected-button">Избранное</div>
            <div className="switch-button switch" onClick={() => setIsFavMode(false)}>Посещенное</div>
        </div>
    );

    function renderFavLaptop() {
        return (
            <>
                <BackgroundTransition />
                <Profile />
                <RoutesHeader />
                <FavLaptopButtons />
                <FavScrollMenu />
            </>
        );
    }

    function renderVisLaptop() {
        return (
            <>
                <BackgroundTransition />
                <Profile />
                <VisLaptopButtons />
                <VisScrollMenu />
            </>
        );
    }

    function renderFavMobile() {
        return (
            <>
                <BackgroundTransition />
                <MobileProfile />
                <FavMobileButtons />
                <FavScrollMenu />
            </>
        );
    }

    function renderVisMobile() {
        return (
            <>
                <BackgroundTransition />
                <MobileProfile />
                <VisMobileButtons />
                <VisScrollMenu />
            </>
        );
    }

    function renderFav() {
        if (window.screen.width > 750) {
            return renderFavLaptop();
        } else {
            return renderFavMobile();
        }
    }

    function renderVis() {
        if (window.screen.width > 750) {
            return renderVisLaptop();
        } else {
            return renderVisMobile();
        }
    }

    async function getData() {
        try {
            const requestURL = "http://194.87.252.234:8080/api/attractions/get-all";
            const requestVis = new Request(requestURL);
            const responseVis = await fetch(requestVis);
            attractionsVis = await responseVis.json();
            const responseFav = await fetch(requestVis);
            attractionsFav = await responseFav.json();
        } catch (error) {
            console.log('error >> ', error.message);
        }
    }
}

export default PersonalAccountPage;
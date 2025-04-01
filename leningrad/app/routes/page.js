"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../routes/routes.module.css";
import { useRouter } from "next/navigation";

const API_URL = "http://194.87.252.234:6060/api/routes/get-all";

// Данные маршрутов
const routes = [
  {
    id: 1,
    category: "Категория 1",
    title: "Восточные навигаторы",
    description:
      "Это очень интересный маршрут! Прошли по нему хотя бы раз в жизни дорогие горожане, потому что у нас есть интересного много чего, но на этом маршруте вы сможете увидеть пирамиды, восхитительные пирамиды и увидеть вм. счастье...",
    image: "https://tse1.mm.bing.net/th?id=OIP.GXseP5xVv3QGkOixYgTEkgHaFj&pid=Api",
  },
  {
    id: 2,
    category: "Категория 2",
    title: "Восточные навигаторы",
    description:
      "Это очень интересный маршрут! Прошли по нему хотя бы раз в жизни дорогие горожане, потому что у нас есть интересного много чего, но на этом маршруте вы сможете увидеть пирамиды, восхитительные пирамиды и увидеть вм. счастье...",
    image: "https://tse4.mm.bing.net/th?id=OIP.Jwvp2GYz7XGJlWUu0iv1vAHaG8&pid=Api",
  },
  {
    id: 3,
    category: "Длина категории 3",
    title: "Восточные навигаторы",
    description:
      "Это очень интересный маршрут! Прошли по нему хотя бы раз в жизни дорогие горожане, потому что у нас есть интересного много чего, но на этом маршруте вы сможете увидеть пирамиды, восхитительные пирамиды и увидеть вм. счастье...",
    image: "https://tse1.mm.bing.net/th?id=OIP.GXseP5xVv3QGkOixYgTEkgHaFj&pid=Api",
  },
  {
    id: 4,
    category: "Категория 4",
    title: "Восточные навигаторы",
    description:
      "Это очень интересный маршрут! Прошли по нему хотя бы раз в жизни дорогие горожане, потому что у нас есть интересного много чего, но на этом маршруте вы сможете увидеть пирамиды, восхитительные пирамиды и увидеть вм. счастье...",
    image: "https://tse1.mm.bing.net/th?id=OIP.Cq1w5MftTJI0n4lITVlzdgHaFj&pid=Api",
  },
  {
    id: 5,
    category: "Категория 5",
    title: "Восточные навигаторы",
    description:
      "Это очень интересный маршрут! Прошли по нему хотя бы раз в жизни дорогие горожане, потому что у нас есть интересного много чего, но на этом маршруте вы сможете увидеть пирамиды, восхитительные пирамиды и увидеть вм. счастье...",
    image: "https://tse1.mm.bing.net/th?id=OIP.Cq1w5MftTJI0n4lITVlzdgHaFj&pid=Api",
  },
  {
    id: 6,
    category: "Категория 6",
    title: "Восточные навигаторы",
    description:
      "Это очень интересный маршрут! Прошли по нему хотя бы раз в жизни дорогие горожане, потому что у нас есть интересного много чего, но на этом маршруте вы сможете увидеть пирамиды, восхитительные пирамиды и увидеть вм. счастье...",
    image: "https://tse1.mm.bing.net/th?id=OIP.Cq1w5MftTJI0n4lITVlzdgHaFj&pid=Api",
  },
];

// Компонент для карточки маршрута
const RouteCard = ({ route }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const router = useRouter();
  // Обработчики для свайпов
  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;
    const handleTouchMove = (moveEvent) => {
      const touchEndX = moveEvent.touches[0].clientX;
      const diffX = touchStartX - touchEndX;

      // Свайп вправо (закрываем описание)
      if (diffX < -50) {
        setIsDescriptionOpen(false);
      }
      // Свайп влево (открываем описание)
      if (diffX > 50) {
        setIsDescriptionOpen(true);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

  };


  const handleLeftArrowClick = () => setIsDescriptionOpen(false);
  const handleRightArrowClick = () => setIsDescriptionOpen(true);


  return (
    <div className={styles.routeCard} onTouchStart={handleTouchStart}>
      <div className={`${styles.cardInner} ${isDescriptionOpen ? styles.showDescription : ""}`}>
        {/* Контейнер с изображением */}
        <div className={styles.imageWrapper}>
          <Link href={`/route/${route.id}`}>
            <img src={route.image} alt={route.title} className={styles.cardImage} />
          </Link>
          <div className={styles.cardDescription}>
            <p>{route.description}</p>
          </div>
          {!isDescriptionOpen && (
            <div className={styles.arrowRight} onClick={handleRightArrowClick}>
              <span className={styles.customArrowLine1}></span>
              <span className={styles.customArrowLine2}></span>
            </div>
          )}
          {isDescriptionOpen && (
            <div className={styles.arrowLeft} onClick={handleLeftArrowClick}>
              <span className={styles.customArrowLine1}></span>
              <span className={styles.customArrowLine2}></span>
            </div>
          )}
        </div>
        {/* Контейнер с описанием для мобильной версии */}
        <div className={styles.descriptionWrapper}>
          <p>{route.description}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3>{route.title}</h3>
      </div>
    </div>
  );
};

// Основной компонент
const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [filteredRoutes, setFilteredRoutes] = useState(routes);

  const categories = ["Все", "Категория 1", "Категория 2", "Длина категории 3", "Категория 4"];

  useEffect(() => {
    if (selectedCategory === "Все") {
      setFilteredRoutes(routes);
    } else {
      setFilteredRoutes(routes.filter((route) => route.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {

        const response = await fetch(API_URL, {
          credentials: "include",
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.textWithImage}>
        <h1 className={styles.header}>Маршруты</h1>
        <img src="/svg/routes_line_design.svg" alt="line" className={styles.svgImage} />
      </div>

      {/* Кнопки категорий (фильтры) */}
      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ""
              }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Список маршрутов */}
      <div className={styles.routesGrid}>
        {filteredRoutes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
};

export default App;
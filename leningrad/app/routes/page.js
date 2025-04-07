"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../routes/routes.module.css";
import { useRouter } from "next/navigation";

const API_URL = "https://leningrad-after-the-victory.ru/api/routes/get-all";
const API_URL_2 = "https://leningrad-after-the-victory.ru/api/categories/get-all";

const truncateWords = (text, maxWords) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

// Компонент для карточки маршрута
const RouteCard = ({ route }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const router = useRouter();

  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;
    const handleTouchMove = (moveEvent) => {
      const touchEndX = moveEvent.touches[0].clientX;
      const diffX = touchStartX - touchEndX;

      if (diffX < -50) {
        setIsDescriptionOpen(false);
      }
      if (diffX > 50) {
        setIsDescriptionOpen(true);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleLeftArrowClick = () => setIsDescriptionOpen(false);
  const handleRightArrowClick = () => setIsDescriptionOpen(true);

  const truncatedDescription = truncateWords(route.description, 50);
  const handleClick = () => {
    router.push(`/map?routeId=${route.id}`);
  };
  return (
    <div className={styles.routeCard} onTouchStart={handleTouchStart}>
      <div className={`${styles.cardInner} ${isDescriptionOpen ? styles.showDescription : ""}`}>
        <div onClick={handleClick}>
          <div className={styles.imageWrapper}>
            <img src={route.url} alt={route.name} className={styles.cardImage} />
            <div className={styles.cardDescription}>
              <p>{truncatedDescription}</p>
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
        </div>
        <div className={styles.descriptionWrapper}>
          <p>{route.description}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3>{route.name}</h3>
      </div>
    </div>
  );
};

// Основной компонент
const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [routes, setRoutes] = useState([]);
  const [categories, setCategories] = useState([{ id: 0, name: "Все" }]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка маршрутов и категорий
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка маршрутов
        const routesResponse = await fetch(API_URL, {
          credentials: "include",
          mode: "cors",
        });
        if (!routesResponse.ok) {
          throw new Error(`Ошибка загрузки маршрутов: ${routesResponse.status}`);
        }
        const routesData = await routesResponse.json();
        console.log(routesData);
        setRoutes(routesData);

        // Загрузка категорий
        const categoriesResponse = await fetch(API_URL_2, {
          credentials: "include",
          mode: "cors",
        });
        if (!categoriesResponse.ok) {
          throw new Error(`Ошибка загрузки категорий: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        console.log(categoriesData);
        setCategories([{ id: 0, name: "Все" }, ...categoriesData]);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchData();
  }, []);

  // Фильтрация маршрутов при изменении категории
  useEffect(() => {
    if (selectedCategory === "Все") {
      setFilteredRoutes(routes);
    } else {
      const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);
      if (selectedCategoryObj) {
        setFilteredRoutes(routes.filter((route) => route.category.id === selectedCategoryObj.id));
      }
    }
  }, [selectedCategory, routes, categories]);

  // Обработка состояний загрузки и ошибки
  if (loading) {
    return <div className={styles.container}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.container}>Ошибка: {error}</div>;
  }

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
            key={category.id}
            className={`${styles.categoryButton} ${selectedCategory === category.name ? styles.active : ""}`}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
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
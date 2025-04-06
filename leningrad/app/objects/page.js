"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../objects/Objects.module.css";

const API_URL = "https://leningrad-after-the-victory.ru/api/attractions/get-all";

const truncateWords = (text, maxWords) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
};

// Компонент для карточки объекта
const ObjectCard = ({ object }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

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

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleLeftArrowClick = () => setIsDescriptionOpen(false);
  const handleRightArrowClick = () => setIsDescriptionOpen(true);

  const truncatedDescription = truncateWords(object.smallDescription, 70);

  return (
    <div className={styles.objectCard} onTouchStart={handleTouchStart}>
      <div className={`${styles.cardInner} ${isDescriptionOpen ? styles.showDescription : ""}`}>
        {/* Контейнер с изображением */}
        <Link href={`/attraction-info?id=${object.id}`}>  
          <div className={styles.imageWrapper}>
              <img 
                src={object.linksPreview || "https://via.placeholder.com/400x300?text=No+Image"} 
                alt={object.name} 
                className={styles.cardImage} 
              />
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
        </Link>
        
        {/* Контейнер с описанием для мобильной версии */}
        <div className={styles.descriptionWrapper}>
          <p>{object.smallDescription}</p>
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3>{object.name}</h3>
      </div>
    </div>
  );
};

// Основной компонент
const App = () => {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const data = await response.json();
        setObjects(data);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.textWithImage}>
          <h1 className={styles.header}>Объекты</h1>
          <img src="/images/hermit.png" alt="line" className={styles.svgImage} />
        </div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.textWithImage}>
          <h1 className={styles.header}>Объекты</h1>
          <img src="/images/hermit.png" alt="line" className={styles.svgImage} />
        </div>
        <p>Ошибка загрузки данных: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.textWithImage}>
        <h1 className={styles.header}>Объекты</h1>
        <img src="/images/hermit.png" alt="line" className={styles.svgImage} />
      </div>

      {/* Список объектов */}
      <div className={styles.objectsGrid}>
        {objects.map((object) => (
          <ObjectCard key={object.id} object={object} />
        ))}
      </div>
    </div>
  );
};

export default App;
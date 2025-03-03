"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ImageSlider.module.css"; // Подключаем CSS

const ImageSlider = ({ title, images, visibleCount, redirectTo }) => {
  
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();

  const totalSteps = images.length - visibleCount + 1; // Количество шагов
  const stepWidth = 100 / totalSteps; // Ширина каждого шага (равномерно делим прогресс-бар)

  const handleNext = () => {
    if (startIndex + visibleCount < images.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleImageClick = (id) => {
    if (redirectTo) {
      router.push(`${redirectTo}?id=${id}`); // Переход по переданному пути
    }
  };

  const handleProgressClick = (event) => {
    const progressBar = event.currentTarget;
    const clickX = event.clientX - progressBar.getBoundingClientRect().left;
    const progressWidth = progressBar.clientWidth;
    const step = Math.floor((clickX / progressWidth) * totalSteps); // Вычисляем на какой шаг было кликнуто

    setStartIndex(step); // Обновляем startIndex на основе клика
  };

  return (
    <div className={styles.sliderWrapper}>
      
      <h3 className={styles.tit}> {title} </h3>
      {/* Полоса прогресса */}
      <div className={styles.progressBar} onClick={handleProgressClick}>
        <div
          className={styles.progressIndicator}
          style={{
            left: `${startIndex * stepWidth}%`, // Сдвигаем индикатор пропорционально шагу
            width: `${stepWidth}%`, // Устанавливаем ширину индикатора равную ширине одного шага
          }}
        />
      </div>

      {/* Слайдер с изображениями */}
      <div className={styles.sliderContainer}>
        
      <button className={`${styles.button} ${styles.buttonLeft}`} onClick={handlePrev}>
      {/* Стрелка слева */}
      </button>

        <div className={styles.imageContainer}>
          {images.slice(startIndex, startIndex + visibleCount).map((image, index) => (
            <img key={index} src={image.src} alt={image.alt} className={styles.image} 
              onClick={() => {
                handleImageClick(image.id);
            }} />
          ))}
          
        </div>

        <button className={`${styles.button} ${styles.buttonRight}`} onClick={handleNext}>
        {/* Стрелка справа */}
        </button>
        
      </div>
    </div>
  );
};

export default ImageSlider;

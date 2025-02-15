"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./ImageSlider.module.css"; // Подключаем CSS

const SwipeSlider = ({ title, images, visibleCount, redirectTo }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [startTouch, setStartTouch] = useState(0);
  const containerRef = useRef(null); // Для слайдера
  const router = useRouter();

  const totalSteps = images.length - visibleCount + 1; // Количество шагов
  const stepWidth = 100 / totalSteps; // Ширина каждого шага (равномерно делим прогресс-бар)

  const handleImageClick = () => {
    if (redirectTo) {
      router.push(redirectTo); // Переход по переданному пути
    }
  };

  const handleTouchStart = (e) => {
    setStartTouch(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const endTouch = e.changedTouches[0].clientX;
    if (startTouch - endTouch > 50) {
      handleNext();
    } else if (endTouch - startTouch > 50) {
      handlePrev();
    }
  };

  const handleProgressClick = (event) => {
    const progressBar = event.currentTarget;
    const clickX = event.clientX - progressBar.getBoundingClientRect().left;
    const progressWidth = progressBar.clientWidth;
    const step = Math.floor((clickX / progressWidth) * totalSteps); // Вычисляем на какой шаг было кликнуто

    setStartIndex(step); // Обновляем startIndex на основе клика
  };

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

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [startTouch]);

  return (
    <div className={styles.sliderWrapper}>
      <h3 className={styles.tit}>{title}</h3>
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
      <div ref={containerRef} className={styles.sliderContainer}>
        <div className={styles.imageContainer}>
          {images.slice(startIndex, startIndex + visibleCount).map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className={styles.image}
              onClick={handleImageClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwipeSlider;

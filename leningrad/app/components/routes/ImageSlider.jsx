"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ImageSlider.module.css"; // Подключи CSS

const ImageSlider = ({ images, visibleCount = 4, redirectTo }) => {
  const [startIndex, setStartIndex] = useState(0);
  const router = useRouter();

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

  const handleImageClick = () => {
    if (redirectTo) {
      router.push(redirectTo); // Переход по переданному пути
    }
  };

  return (
    <div className={styles.sliderContainer}>
      <button className={styles.button} onClick={handlePrev} disabled={startIndex === 0}>
        ◀
      </button>
      <div className={styles.imageContainer}>
        {images.slice(startIndex, startIndex + visibleCount).map((image, index) => (
          <img key={index} src={image.src} alt={image.alt} className={styles.image} onClick={handleImageClick} />
        ))}
      </div>
      <button className={styles.button} onClick={handleNext} disabled={startIndex + visibleCount >= images.length}>
        ▶
      </button>
    </div>
  );
};

export default ImageSlider;

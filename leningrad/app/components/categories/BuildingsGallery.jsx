"use client";

import React from "react";
import styles from "./BuildingsGallery.module.css"; // Путь к стилям

const BuildingsGallery = ({ buildings, title }) => {
  return (
    <div className={styles.galleryContainer}>
      <h1 className={styles.header}>{title}</h1> {/* Динамическое название */}
      <div className={styles.gallery}>
        {buildings.map((building, index) => (
          <div key={index} className={styles.buildingCard}>
            <img
              src={building.url}
              alt={building.name}
              className={styles.buildingImage}
            />
            <p className={styles.buildingName}>{building.name}</p>
          </div>
        ))}
       
      </div>
    </div>
  );
};

export default BuildingsGallery;

"use client";

import React, { useState } from "react";
import CustomVideoPlayer from "../components/video-player/CustomVideoPlayer"; // Импортируем компонент
import styles from "./Videos.module.css";

// Моковые данные для видео
const mockVideos = [
  {
    id: 1,
    name: "Исторический обзор: Революция",
    smallDescription: "Краткий обзор революционных событий в России.",
    url: "/videos/revolution.mp4",
    poster: "/images/video-poster.jpg",
  },
  {
    id: 2,
    name: "Архитектура Санкт-Петербурга",
    smallDescription: "Путешествие по знаменитым зданиям города.",
    url: "/videos/revolution.mp4",
    poster: "/images/architecture-poster.jpg",
  },
  {
    id: 3,
    name: "Природа Карелии",
    smallDescription: "Удивительные пейзажи и природные достопримечательности.",
    url: "/videos/revolution.mp4",
    poster: "/images/karelia-poster.jpg",
  },
];

// Компонент для карточки видео
const VideoCard = ({ video }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCardClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className={styles.videoCard} onClick={handleCardClick}>
      <div className={styles.cardInner}>
        {/* Контейнер с видео или постером */}
        <div className={styles.videoWrapper}>
          {isPlaying ? (
            <CustomVideoPlayer url={video.url} poster={video.poster} />
          ) : (
            <img
              src={video.poster || "https://via.placeholder.com/400x300?text=No+Image"}
              alt={video.name}
              className={styles.cardImage}
            />
          )}
          {!isPlaying && (
            <div className={styles.cardDescription}>
              <p>{video.smallDescription}</p>
            </div>
          )}
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3>{video.name}</h3>
      </div>
    </div>
  );
};

// Основной компонент
const VideoPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textWithImage}>
        <h1 className={styles.header}>Видео</h1>
        <img src="/images/hermit.png" alt="line" className={styles.svgImage} />
      </div>

      {/* Список видео */}
      <div className={styles.videosGrid}>
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default VideoPage;
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from 'next/navigation';
import SwipeSlider from "../components/routes/SwipeSlider"; // Мобильный слайдер
import ImageSlider from "../components/routes/ImageSlider"; // Слайдер для десктопа
import styles from "../routes/routes.module.css";
import ButtonRoutes from "../components/routes/ButtonRoutes.jsx";

const API_URL = "http://194.87.252.234:6060/api/categories/get-all";

const images = [
  { id: 1, src: "/images/landmark1.png", alt: "Landmark 1" },
  { id: 2, src: "/images/landmark2.png", alt: "Landmark 2" },
  { id: 3, src: "/images/landmark3.png", alt: "Landmark 3" },
  { id: 4, src: "/images/landmark4.png", alt: "Landmark 4" },
  { id: 5, src: "/images/landmark5.png", alt: "Landmark 5" },
  { id: 6, src: "/images/landmark6.png", alt: "Landmark 6" },
  { id: 7, src: "/images/landmark7.png", alt: "Landmark 7" },
];

const images2 = [
  { id: 1, src: "https://tse1.mm.bing.net/th?id=OIP.z-J0jBF5kZ_jNCERr8npOAHaE8&pid=Api", alt: "Landmark 1" },
  { id: 2, src: "https://tse4.mm.bing.net/th?id=OIP.Jwvp2GYz7XGJlWUu0iv1vAHaG8&pid=Api", alt: "Landmark 2" },
  { id: 3, src: "https://tse1.mm.bing.net/th?id=OIP.GXseP5xVv3QGkOixYgTEkgHaFj&pid=Api", alt: "Landmark 3" },
  { id: 4, src: "https://tse1.mm.bing.net/th?id=OIP.Cq1w5MftTJI0n4lITVlzdgHaFj&pid=Api", alt: "Landmark 4" },
  { id: 5, src: "https://tse4.mm.bing.net/th?id=OIP.2w81RJ4m5zC9fJn-H-dPXAHaE6&pid=Api", alt: "Landmark 5" },
  { id: 6, src: "https://tse2.mm.bing.net/th?id=OIP.lFEh5f8QDnlj2K6ToVR0sgHaE8&pid=Api", alt: "Landmark 6" },
  { id: 7, src: "https://tse4.mm.bing.net/th?id=OIP.0BUIg-eBEq9Qy7F9HrEHPAHaFN&pid=Api", alt: "Landmark 7" },
];

const redirectTo = "/map";
const redirectTo2 = "/categories";

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [imageSrc, setImageSrc] = useState("");


  const router = useRouter();
  const navigateToAuth = () => {
    const currentUrl = window.location.pathname;
    router.push(`/authentication-authorization?redirect=${encodeURIComponent(currentUrl)}`);
  };

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
        const data = await response.text();
        console.log(data)
        const firstImage = data[0]?.linksPreview?.[0] || "";
        setImageSrc(firstImage);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchRoutes();

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

  return (
    <div className={styles.container}>
      <div className={styles.textWithImage}>
        <svg className={styles.svg_image} viewBox="10 10 320 266" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g opacity="0.9">
            <path d="M487.898 191.367C476.844 123.998 481.778 -99.5001 296 136C110.222 371.5 264.999 -106.5 13.4993 49" stroke="#0B83D9" strokeWidth="4" />
            <ellipse cx="12.9411" cy="46.958" rx="11.5584" ry="9.48762" transform="rotate(177.627 12.9411 46.958)" fill="#0B83D9" />
            <ellipse cx="487.744" cy="195.961" rx="11.5584" ry="9.48762" transform="rotate(177.627 487.744 195.961)" fill="#0B83D9" />
          </g>
        </svg>
        <h1 className={styles.header}>Маршруты</h1>
      </div>

      {isMobile ? (
        <SwipeSlider title="Популярные" images={images} visibleCount={3} redirectTo={redirectTo} />
      ) : (
        <ImageSlider title="Популярные" images={images} visibleCount={6} redirectTo={redirectTo} />
      )}

      {isMobile ? (
        <SwipeSlider title="Тематические" images={images2} visibleCount={3} redirectTo={redirectTo2} />
      ) : (
        <ImageSlider title="Тематические" images={images2} visibleCount={6} redirectTo={redirectTo2} />
      )}

      <div className={styles.button_container}>
        <ButtonRoutes text="Перейти к посещённым маршрутам" onClick={navigateToAuth} />
      </div>
    </div>
  );
};

export default App;

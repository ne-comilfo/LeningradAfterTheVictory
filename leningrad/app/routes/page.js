"use client"

import React, { useEffect, useState } from "react";
import ImageSlider from "../components/routes/ImageSlider.jsx";

const API_URL = "http://194.87.252.234:8080/api/routes";

const images = [
  { src: "/images/landmark1.png", alt: "Landmark 1" },
  { src: "/images/landmark2.png", alt: "Landmark 2" },
  { src: "/images/landmark3.png", alt: "Landmark 3" },
  { src: "/images/landmark4.png", alt: "Landmark 4" },
  { src: "/images/landmark5.png", alt: "Landmark 5" },
];

const redirectTo = "/map";

const App = () => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const data = await response.json();

        const firstImage = data[0]?.linksPreview?.[0] || "";

        console.log("Полученные данные с сервера:", data);
        setImageSrc(firstImage);
        

      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchRoutes();
  }, []);

  


  return (
    <div>
      <h1>Популярные</h1>

      <ImageSlider images={images} visibleCount={4} redirectTo={redirectTo} />

      
    </div>
  );
};

export default App;

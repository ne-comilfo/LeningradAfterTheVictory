"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import BuildingsGallery from "../components/categories/BuildingsGallery"; // Импортируем компонент

const mockBuildings = [
  {
    id: 1,
    name: "Здание 1",
    url: "https://drive.google.com/uc?export=view&id=1RUzNGMFeiASHjj20OGMt_tmHfUx04B81",
  },
  {
    id: 2,
    name: "Здание 2",
    url: "https://loveopium.ru/content/2010/12/fa02c9d575dc_B157/7.jpg",
  },
  {
    id: 3,
    name: "Здание 3",
    url: "https://safe-rgs.ru/uploads/posts/2017-03/1490179634_fe9aec2c4b11.jpg",
  },
  {
    id: 4,
    name: "Здание 4",
    url: "https://drive.usercontent.google.com/download?id=1RUzNGMFeiASHjj20OGMt_tmHfUx04B81&export=view&authuser=0",
  },
  {
    id: 5,
    name: "Здание 5",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFpzJD5W3Fgjy6p42J2ElcPVphDH5i0X7G2A&s",
  },
  {
    id: 6,
    name: "Здание 6",
    url: "https://drive.google.com/file/d/1ka_4qaMNnQMEDJldbeLFscp6W1O7P6d6/view?usp=sharing",
  },
  {
    id: 7,
    name: "Здание 7",
    url: "/images/landmark7.png",
  },
];

const CategoryPage = () => {
  
  const [routes, setRoutes] = useState([]);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const API_URL = `http://194.87.252.234:6060/api/routes/routeByCategory/${id}`; // API для маршрутов

  // Запрос всех маршрутов
  useEffect(() => {
    
    const fetchRoutes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setRoutes(data); // Сохраняем все маршруты, если запрос успешен
        console.log(data[0].url);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchRoutes(  );
  }, []); // Запрос выполняется только один раз при загрузке

  return (
    <div>
      <BuildingsGallery buildings={mockBuildings} title="Восстание декабристов" />
    </div>
  );
};

export default CategoryPage;

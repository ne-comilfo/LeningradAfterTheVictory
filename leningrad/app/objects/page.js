"use client";

import React, { useEffect, useState } from "react";
import styles from "./Objects.module.css"; // Импорт модульных стилей

const ObjectsPage = () => {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const res = await fetch('http://194.87.252.234:6060/api/attractions/get-all');
        const data = await res.json();
        console.log(data)
        setObjects(data);
      } catch (error) {
        console.error("Не удалось загрузить объекты:", error);
      }
    };
    fetchObjects();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <section id="objects" className={styles.section}>
        <h2 className={styles.title}>Объекты</h2>
        <div className={styles.gridContainer}>
          {objects.map((obj) => (
            <div key={obj.id} className={styles.gridItem}>
              <img src={obj.image} alt={obj.name} />
              <p>{obj.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ObjectsPage;
import React from 'react';
import styles from './ButtonRoutes.module.css'; // Импортируем стили

const ButtonRoutes = ({ text, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {text} <span className={styles.arrow}>→</span>
    </button>
  );
};

export default ButtonRoutes;

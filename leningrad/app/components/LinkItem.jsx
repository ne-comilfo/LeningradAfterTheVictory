import React from "react";
import styles from "./LinkItem.module.css"; // Импортируем стили как модуль

const LinkItem = ({ link }) => {
  const { href, text, icon, newTab = true, className = "" } = link;

  return (
    <div className={`${styles.container} ${className}`}>
      <a
        href={href}
        target={newTab ? "_blank" : "_self"}
        rel={newTab ? "noopener noreferrer" : ""}
        className={styles.link}
      >
        <img src={icon} alt="иконки не будет" className={styles.icon} />
        {text}
      </a>
    </div>
  );
};

export default LinkItem;

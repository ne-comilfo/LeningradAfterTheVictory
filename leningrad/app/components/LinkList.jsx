import React from "react";
import LinkItem from "./LinkItem";
import styles from "./LinkList.module.css"; // Импортируем стили как модуль

const LinkList = ({ links, title, containerClass }) => {
  return (
    <div className={`${styles.listContainer} ${containerClass || ""}`}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.linkList}>
        {links.map((link, index) => (
          <LinkItem link={link} key={index} />
        ))}
      </div>
    </div>
  );
};

export default LinkList;

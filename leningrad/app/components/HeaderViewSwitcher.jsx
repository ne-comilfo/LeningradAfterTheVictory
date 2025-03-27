// HeaderViewSwitcher.jsx
"use client";

import React from "react";
import TopBar from "./TopBar.jsx";
import TopBarMobile from "./TopBarMobile";
import styles from "./HeaderViewSwitcher.module.css";

const HeaderViewSwitcher = () => {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.topBarDesktop}>
        <TopBar />
      </div>
      <div className={styles.topBarMobile}>
        <TopBarMobile />
      </div>
    </div>
  );
};

export default HeaderViewSwitcher;
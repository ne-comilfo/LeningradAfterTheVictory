// TopBarMobile.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import styles from "./TopBarMobile.module.css";
import style from "./TopBar.module.css"

const TopBarMobile = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => pathname === path;
  const isHomePage = pathname === "/";
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div>
      <div className={`${style.header} ${isHomePage ? style.homePage : ""}`}>
        <div className={style.logoBar}>
          <Link href="/#hero" className={`${style.navLink} ${isActive("/#hero") ? style.active : ""}`}>
            <img src="/svg/logo_icon.svg" alt="logo icon" />
          </Link>
        </div>
        

        <div className={styles.navBar}>
            <button className={styles.burgerMenu} onClick={toggleSidebar}>
                <img
                src={isSidebarOpen ? "/svg/mobile_close-menu_icon.svg" : "/svg/mobile_menu_icon.svg"}
                alt={isSidebarOpen ? "Close menu" : "Open menu"}
                className={styles.menuIcon}
                />
          </button>
          <Link href="/personal-account">
            <div className={styles.profileIcon}>
              <img src="/svg/account_icon.svg" alt="Account Icon" />
            </div>
          </Link>
        </div>
      </div>

      {/* Затемнение фона */}
      <div className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.open : ""}`} onClick={toggleSidebar}></div>

      {/* Боковая панель */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.navLinks}>
          <Link href="/#hero" className={`${style.navLink} ${isActive("/") ? style.active : ""}`} onClick={toggleSidebar}>
            Главная
          </Link>
          <Link href="/map" className={`${style.navLink} ${isActive("/map") ? style.active : ""}`} onClick={toggleSidebar}>
            Карта
          </Link>
          <Link href="/objects" className={`${style.navLink} ${isActive("/objects") ? style.active : ""}`} onClick={toggleSidebar}>
            Объекты
          </Link>
          <Link href="/routes" className={`${style.navLink} ${isActive("/routes") ? style.active : ""}`} onClick={toggleSidebar}>
            Маршруты
          </Link>
          <Link href="/video" className={`${style.navLink} ${isActive("/video") ? style.active : ""}`} onClick={toggleSidebar}>
            Видео
          </Link>
          <Link href="/#about" className={`${style.navLink} ${isActive("/#about") ? style.active : ""}`} onClick={toggleSidebar}>
            О проекте
          </Link>
        </div>

        <div className={styles.socialLinks}>
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <img src="/svg/telegram_icon.svg" alt="Telegram" />
          </a>
          <a href="https://vk.com" target="_blank" rel="noopener noreferrer">
            <img src="/svg/vk_icon.svg" alt="VK" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBarMobile;
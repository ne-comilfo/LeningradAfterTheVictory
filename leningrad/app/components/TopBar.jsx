"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import style from "./TopBar.module.css"


const TopBar = () => {
  const pathname = usePathname();

  const [currentSection, setCurrentSection] = useState(0); // Состояние для текущей секции

  useEffect(() => {
    // Слушаем событие sectionChange
    const handleSectionChange = (event) => {
      const { sectionIndex } = event.detail;
      setCurrentSection(sectionIndex);
    };

    window.addEventListener("sectionChange", handleSectionChange);

    // Очистка
    return () => {
      window.removeEventListener("sectionChange", handleSectionChange);
    };
  }, []);



  const isActive = (path) => pathname === path;
  const isHomePage = pathname === "/";

  return (
    <div className={`${style.header} ${isHomePage ? style.homePage : ""}`}>

      <div className={style.logoBar}>
        <Link href="/#hero" className={`${style.navLink} ${isActive("/#hero") && currentSection ? style.active : ""}`}>
            <img
              src="/svg/logo_icon.svg"
              alt="logo icon"
            />
        </Link>
        <Link href="/#hero" className={`${style.navLink} ${isActive("/") && !currentSection ? style.active : ""}`}>
          Главная
        </Link>
      </div>

      <div className={style.navBar}>
        <Link href="/map" className={`${style.navLink} ${isActive("/map") ? style.active : ""}`}>
          Карта
        </Link>
        <Link href="/objects" className={`${style.navLink} ${isActive("/objects") ? style.active : ""}`}>
          Объекты
        </Link>
        <Link href="/routes" className={`${style.navLink} ${isActive("/routes") ? style.active : ""}`}>
          Маршруты
        </Link>
        <Link href="/video" className={`${style.navLink} ${isActive("/video") ? style.active : ""}`}>
          Видео
        </Link>
        <Link href="/#about" className={`${style.navLink} ${isActive("/") && currentSection ? style.active : ""}`}>
          О проекте
        </Link>

        <Link href="/personal-account" className={`${style.navLink} ${isActive("/personal-account") || isActive("/authentication-authorization") ? style.active : ""}`} >
          <div className={style.profileIcon}>
            <img
              src="/svg/account_icon.svg"
              alt="Account Icon"
            />
          </div>
        </Link>
      </div>
      
    </div>
  );
};

export default TopBar;

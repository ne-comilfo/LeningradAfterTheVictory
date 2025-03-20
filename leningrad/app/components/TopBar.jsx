"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";


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
    <div className={`${"header"} ${isHomePage ? "homePage" : ""}`}>

      <div className="logo-bar">
        <Link href="/#hero" className={`nav-link ${isActive("/#hero") && currentSection ? "active" : ""}`}>
            <img
              src="/svg/logo_icon.svg"
              alt="logo icon"
            />
        </Link>
        <Link href="/#hero" className={`nav-link ${isActive("/") && !currentSection ? "active" : ""}`}>
          Главная
        </Link>
      </div>

      <div className="nav-bar">
        <Link href="/map" className={`nav-link ${isActive("/map") ? "active" : ""}`}>
          Карта
        </Link>
        <Link href="/objects" className={`nav-link ${isActive("/objects") ? "active" : ""}`}>
          Объекты
        </Link>
        <Link href="/routes" className={`nav-link ${isActive("/routes") ? "active" : ""}`}>
          Маршруты
        </Link>
        <Link href="/video" className={`nav-link ${isActive("/video") ? "active" : ""}`}>
          Видео
        </Link>
        <Link href="/#about" className={`nav-link ${isActive("/") && currentSection ? "active" : ""}`}>
          О проекте
        </Link>

        <Link href="/authentication-authorization">
          <div className="profile-icon">
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

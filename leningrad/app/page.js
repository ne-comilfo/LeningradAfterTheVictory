"use client";

import React, { useEffect } from "react";
import StatBox from "./components/StatBox";
import LinkList from "./components/LinkList";
import globalStyles from "./App.module.css";

const HomePage = () => {
  const links = [
    {
      href: "https://telegram.org",
      text: "@cracycot on Telegram",
      icon: "/images/log_tg.png",
    },
    {
      href: "https://vk.com",
      text: "@cracycot on VK",
      icon: "/images/log_vk.png",
    },
  ];



  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    let isScrolling = false;
    let currentSection = 0;

    function scrollToSection(index) {
      if (isScrolling || index < 0 || index >= sections.length) return;
      isScrolling = true;

      sections[index].scrollIntoView({ behavior: "smooth" });

      setTimeout(() => (isScrolling = false), 1000); // Блокируем быстрый повторный скролл
    }

    document.addEventListener("wheel", (event) => {
      if (event.deltaY > 0) {
        scrollToSection(++currentSection);
      } else {
        scrollToSection(--currentSection);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        scrollToSection(++currentSection);
      } else if (event.key === "ArrowUp") {
        scrollToSection(--currentSection);
      }
    });

    return () => {
      document.removeEventListener("wheel", scrollToSection);
      document.removeEventListener("keydown", scrollToSection);
    };
  }, []);

  return (
    <div className="page-container">
      {/* Первая секция: Главная */}
      <section className="section hero">
        <div className="hero-content">
          <h1>
            <span className="big-text">Ленинград</span> 
            <span className="small-text">после победы</span>
          </h1>
          <p className="bottom-left-text">
            Путешествуйте, стройте интересные маршруты и изучайте историю с
            интерактивной картой Санкт-Петербурга
          </p>
        </div>
        <div className="hero-image">
          <img src="/images/main_picture.png" alt="Main Picture" />
        </div>
        <div className="scroll-down">
          <span></span>
        </div>
      </section>

      {/* Вторая секция: О проекте */}
      <section className="section about">
        <div className="about-content">
          <h2 className="about-title">О проекте</h2>
          <ul className="about-list">
            <li>
              <span className="checkbox"></span>
              Исследовательский и просветительский проект посвящен мужеству и стойкости бойцов и командиров ПВО, МПВО, а также простых граждан, проявленных в первые месяцы войны, при отражении налетов на Москву.
            </li>
            <li>
              <span className="checkbox"></span>
              Впервые специалистами были собраны воедино и проанализированы многочисленные документы из разных архивов и исторические материалы советской и немецкой сторон о налетах на Москву, собраны личные истории свидетелей бомбардировок и участников противовоздушной обороны.
            </li>
            <li>
              <span className="checkbox"></span>
              В рамках платформы в отдельных разделах размещены архивные источники и статьи историков о героях Москвы и значимых эпизодах обороны города.
            </li>
          </ul>
          <div className="about-stats">
              <StatBox label={{number: 40, text: 'Зданий'}} />
              <StatBox label={{number: 30, text: 'Маршрутов'}} />
              <StatBox label={{number: 70, text: 'Личностей'}} />
        
          </div>
          <LinkList
            links={links}
            title="Мы в социальных сетях"
            containerClass={globalStyles.customLinkListContainer}
          />
        </div>
        
      </section>
 
      
    </div>
  );
};

export default HomePage;

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
      icon: "/svg/telegram_icon.svg",
    },
    {
      href: "https://vk.com",
      text: "@cracycot on VK",
      icon: "/svg/vk_icon.svg",
    },
  ];



  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    let isScrolling = false;

    function scrollToSection(index) {
      if (isScrolling || index < 0 || index >= sections.length) return;
      isScrolling = true;

      sections[index].scrollIntoView({ behavior: "smooth" });

      setTimeout(() => (isScrolling = false), 1000); // Блокируем быстрый повторный скролл
    }

    // IntersectionObserver для отслеживания видимой секции
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id; // Получаем ID секции (hero или about)
            // Отправляем событие с текущей секцией
            const sectionIndex = sectionId === "hero" ? 0 : 1;
            window.dispatchEvent(
              new CustomEvent("sectionChange", { detail: { sectionIndex } })
            );
          }
        });
      },
      {
        root: null, // Отслеживаем относительно viewport
        threshold: 0.5, // Секция считается видимой, если 50% её площади в viewport
      }
    );

    // Наблюдаем за секциями
    sections.forEach((section) => observer.observe(section));

    // Обработчики событий для скролла
    let currentSection = 0;

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
      <section id="hero" className="section hero">
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
      <section id="about" className="section about">
        <div className="about-content">
          <h2 className="about-title">О проекте</h2>
          <ul className="about-list">
            <li>
              <span className="checkbox"></span>
              Сравнительный визуальный формат: Платформа позволяет пользователю сопоставлять архивные и современные фотографии зданий и улиц, чтобы увидеть, как они изменились со временем — были восстановлены, перестроены или утрачены.
            </li>
            <li>
              <span className="checkbox"></span>
              Интерактивная карта: Пользователь может исследовать город с помощью карты, на которой отмечены ключевые объекты, пострадавшие в период Блокады, с информацией об их довоенном, военном и послевоенном состоянии.
            </li>
            <li>
              <span className="checkbox"></span>
              Объединение разрознённых источников: Проект систематизирует данные из разных архивов, сайтов и публикаций, предоставляя структурированный и доступный для восприятия материал в одном месте.
            </li>
          </ul>
          <div className="about-stats">
              <StatBox label={{number: "> 20", text: 'Объектов'}} />
              <StatBox label={{number: "> 5", text: 'Маршрутов'}} />
              <StatBox label={{number: "> 10", text: 'Источников'}} />
        
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

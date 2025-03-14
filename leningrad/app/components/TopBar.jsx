"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const TopBar = () => {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;
  const isHomePage = pathname === "/";

  return (
    <div className={`${"header"} ${isHomePage ? "homePage" : ""}`}>
      <div className="nav-bar">
        <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          Главная
        </Link>
        <Link href="/map" className={`nav-link ${isActive("/map") ? "active" : ""}`}>
          Карта
        </Link>
        <Link href="/routes" className={`nav-link ${isActive("/routes") ? "active" : ""}`}>
          Маршруты
        </Link>
      </div>
      <Link href="/authentication-authorization">
        <div className="profile-icon">
          <Image
            src="/svg/account_icon.svg"
            alt="Account Icon"
            width={60}
            height={60}
          />
        </div>
      </Link>
      
    </div>
  );
};

export default TopBar;

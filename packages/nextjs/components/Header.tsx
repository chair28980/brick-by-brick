"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link href={href} passHref className={`header-nav-link ${isActive ? "active" : ""}`}>
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <>
      <div className="gaming-header">
        <div className="header-content">
          {/* Mobile menu */}
          <details className="mobile-menu" ref={burgerMenuRef}>
            <summary className="mobile-menu-trigger">
              <Bars3Icon className="h-6 w-6" />
            </summary>
            <ul className="mobile-menu-dropdown">
              <HeaderMenuLinks />
            </ul>
          </details>

          {/* Logo */}
          <Link href="/" className="header-logo">
            <div className="logo-container">
              <div className="logo-icon">🧱</div>
              <div className="logo-text">
                <span className="logo-title">Build the Wall</span>
                <span className="logo-subtitle">Decentralized Building</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              <HeaderMenuLinks />
            </ul>
          </nav>

          {/* CTA Section */}
          <div className="header-cta">
            <RainbowKitCustomConnectButton />
            {isLocalNetwork && <FaucetButton />}
          </div>
        </div>
      </div>

      {/* Header Styles */}
      <style jsx>{`
        .gaming-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(74, 155, 142, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .mobile-menu {
          display: none;
        }

        .mobile-menu-trigger {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .mobile-menu-trigger:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-menu-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(74, 155, 142, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 0 0 15px 15px;
          padding: 1rem;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          list-style: none;
          margin: 0;
        }

        .header-logo {
          text-decoration: none;
          color: inherit;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1;
        }

        .desktop-nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 1rem;
        }

        .header-nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          border-radius: 25px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .header-nav-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.2));
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 25px;
        }

        .header-nav-link:hover::before,
        .header-nav-link.active::before {
          opacity: 1;
        }

        .header-nav-link:hover {
          color: white;
          transform: translateY(-1px);
        }

        .header-nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .header-cta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .mobile-menu {
            display: block;
            position: relative;
          }

          .desktop-nav {
            display: none;
          }

          .logo-text {
            display: none;
          }

          .header-content {
            padding: 0 1rem;
          }

          .header-nav-link {
            padding: 0.75rem 1rem;
            border-radius: 10px;
            width: 100%;
            justify-content: flex-start;
          }

          .mobile-menu-dropdown .header-nav-link {
            margin-bottom: 0.5rem;
          }

          .mobile-menu-dropdown .header-nav-link:last-child {
            margin-bottom: 0;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            height: 60px;
          }

          .logo-icon {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const [isHovered, setIsHovered] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false); // NEW
  const router = useRouter();

  const sidebarRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden lg:flex mt-1 w-full items-center justify-between px-6 py-4 bg-white ">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={300}
              height={300}
              className="mt-2 cursor-pointer"
            />
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          <div
            className="flex items-center space-x-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src="/images/lang.png"
              alt="Language Icon"
              width={20}
              height={20}
              className="cursor-pointer mr-4"
            />

            <span
              className={`text-black mr-4 cursor-pointer hover:text-cyan-400`}
            >
              {isHovered
                ? language === "en"
                  ? "Français"
                  : "English"
                : language === "en"
                ? "English"
                : "Français"}
            </span>

            <ToggleSwitch
              enabled={language === "en"}
              setEnabled={(enabled) => setLanguage(enabled ? "en" : "fr")}
            />
          </div>

          {/* Profile Click */}
          <div
            className="flex items-center space-x-2 cursor-pointer mr-4"
            onClick={() => setShowProfileModal(true)}
          >
            <Image
              src="/images/avtar.jpg"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-center">
              <h4 className="text-gray-800 font-semibold">Alex Broad</h4>
              <p className="text-gray-500 text-sm">{t.role_student}</p>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Mobile Navbar */}
      <header className="md:hidden w-[350px] mx-auto mt-2 flex items-center justify-between px-6 py-5 bg-[#DAE9FF] rounded-4xl">
        <div className="flex items-center space-x-2">
          <Link href="/dashboard">
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={150}
              height={150}
              className=""
            />
          </Link>
        </div>
        <button onClick={() => setMenuOpen(true)}>
          <Image
            src="/images/ham.svg"
            alt="Menu"
            width={30}
            height={30}
            className=""
          />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div
          ref={sidebarRef}
          className="fixed h-full top-0 left-0 w-2/3  bg-white shadow-xl z-50 p-4 space-y-6"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Link href="/dashboard">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  width={150}
                  height={150}
                  className=""
                />
              </Link>
            </div>
            <button onClick={() => setMenuOpen(false)}>
              <FaTimes className="text-2xl text-gray-600" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="space-y-4 text-gray-700 text-sm mt-14">
            <NavItem
              src="/images/dash.png"
              label={t.sidebar_dashboard}
              href="/dashboard"
              onClick={() => {
                router.push("/dashboard"); // or your actual route
                setMenuOpen(false);
              }}
            />
            <NavItem
              src="/images/gene.png"
              label={t.sidebar_generate}
              href="/generate"
              onClick={() => {
                router.push("/generate");
                setMenuOpen(false);
              }}
            />
            <NavItem
              src="/images/sub.png"
              label={t.sidebar_subscription}
              href="/subscription"
              onClick={() => {
                router.push("/subscription");
                setMenuOpen(false);
              }}
            />

            <NavItem
              src="/images/pro.png"
              label={t.sidebar_profile}
              href="/profile"
              onClick={() => {
                setShowProfileModal(true);
                setMenuOpen(false); // close menu after opening modal
              }}
            />

            <NavItem
              src="/images/set.png"
              label={t.sidebar_settings}
              href="/settings"
              onClick={() => {
                router.push("/settings");
                setMenuOpen(false);
              }}
            />
            <hr className="text-[#E2E2E2]" />
            <NavItem
              src="/images/hel.png"
              label={t.sidebar_help}
              href="/help"
              onClick={() => {
                router.push("/help");
                setMenuOpen(false);
              }}
            />
            <div className="flex items-center space-x-2">
              <Image
                src="/images/lang.png"
                alt="Language Icon"
                width={20}
                height={20}
                className="cursor-pointer ml-3 mr-2"
              />
              <span className="text-black mr-16">
                {language === "en" ? "English" : "Français"}
              </span>
              <ToggleSwitch
                enabled={language === "en"}
                setEnabled={(enabled) => setLanguage(enabled ? "en" : "fr")}
              />
            </div>
          </nav>
          <div className="mt-25 space-x-8">
            <NavItem
              src="/images/log.png"
              label={t.sidebar_logout}
              href="/auth"
              onClick={() => {
                router.push("/auth");
                setMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

// NavItem with image
const NavItem = ({
  src,
  label,
  href,
  onClick,
}: {
  src: string;
  label: string;
  href: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Automatically switch to white icon version if active
  const iconSrc = isActive
    ? src.replace(".png", "-wh.svg") // assumes white icons are named like dash-white.png
    : src;

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
        isActive
          ? "bg-[#23BAD8] text-white font-semibold"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <Image src={iconSrc} alt={label} width={20} height={20} />
      <span>{label}</span>
    </div>
  );
};

const ToggleSwitch = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
      enabled ? "bg-[#23BAD8]" : "bg-gray-300"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

export default Navbar;

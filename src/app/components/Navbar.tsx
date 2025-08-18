"use client";

import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import { useProfile } from "@/app/context/ProfileContext";
import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = translations[language];
  const { profile } = useProfile();

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
        <div className="flex items-center space-x-6 ">
          <div className="flex items-center space-x-2">
            <Image
              src="/images/lang.png"
              alt="Language Icon"
              width={20}
              height={20}
              className="cursor-pointer mr-4"
            />

            <span className="text-black mr-4">
              {language === "en" ? "English" : "Anglais"}
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
            <div className="relative w-[60px] h-[60px]">
              <Image
                src={
                  profile?.profile_image
                    ? profile.profile_image
                    : "/images/avtar.jpg"
                }
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
              {profile?.is_subscribed && (
                <div className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-1 shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="text-gray-800 font-semibold">
                {(profile?.first_name || "") + " " + (profile?.last_name || "")}
              </h4>
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
              src="/images/doc.png" // use your icon here
              label={t.sidebar_my_content}
              href="/content"
              onClick={() => {
                router.push("/content");
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
                {language === "en" ? "English" : "Anglais"}
              </span>
              <ToggleSwitch
                enabled={language === "en"}
                setEnabled={(enabled) => setLanguage(enabled ? "en" : "fr")}
              />
            </div>
          </nav>
          {profile?.daily_quota_limit != null && (
            <div className="mt-8 border-t pt-4 border-gray-200">
              <p className="text-sm text-gray-600 mb-3">
                {language === "fr" ? "Quota quotidien" : "Daily Quota"}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-[#23BAD8] h-2 rounded-full"
                  style={{
                    width: `${Math.min(
                      ((profile?.daily_quota_used ?? 0) /
                        (profile?.daily_quota_limit ?? 1)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 ml-2">
                {profile?.daily_quota_used ?? 0} /{" "}
                {profile?.daily_quota_limit ?? 0}
              </p>
            </div>
          )}

          <div className="mt-25 space-x-8">
            <NavItem
              src="/images/log.png"
              label={t.sidebar_logout}
              href="/auth"
              onClick={() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setMenuOpen(false);
                window.location.href = "/auth"; // hard redirect
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
  const isActive = pathname.startsWith(href);

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
    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
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

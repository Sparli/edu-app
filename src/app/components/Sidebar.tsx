"use client";
import React, { useState } from "react";
import Image from "next/image";
import ProfileModal from "./ProfileModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

const Sidebar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="w-64 bg-[#FAFAFA] p-6 lg:flex flex-col justify-between hidden border-r border-gray-200">
      {/* Top Section */}
      <div>
        <div className="flex items-center space-x-2 mb-10">
          <Link href="/dashboard">
            <Image
              src={
                language === "fr"
                  ? "/images/french-logo.png"
                  : "/images/main.svg"
              }
              alt="Logo"
              width={350}
              height={350}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-8">
          <SidebarLink
            imageSrc="/images/dash.png"
            activeImageSrc="/images/dash-wh.svg"
            label={t.sidebar_dashboard}
            href="/dashboard"
          />
          <SidebarLink
            imageSrc="/images/gene.png"
            activeImageSrc="/images/gene-wh.svg"
            label={t.sidebar_generate}
            href="/generate"
          />
          <SidebarLink
            imageSrc="/images/sub.png"
            activeImageSrc="/images/sub-wh.svg"
            label={t.sidebar_subscription}
            href="/subscription"
          />

          <SidebarLink
            label={t.sidebar_profile}
            imageSrc="/images/pro.png"
            activeImageSrc="/images/pro-wh.svg"
            onClick={() => setShowProfileModal(true)}
          />
          <SidebarLink
            imageSrc="/images/set.png"
            activeImageSrc="/images/set-wh.svg"
            label={t.sidebar_settings}
            href="/settings"
          />
          <hr className="text-[#E2E2E2] mt-3 mb-4" />
          <SidebarLink
            imageSrc="/images/hel.png"
            activeImageSrc="/images/hel-wh.svg"
            label={t.sidebar_help}
            href="/help"
          />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <SidebarLink
          imageSrc="/images/log.svg"
          label={t.sidebar_logout}
          href="/auth"
        />
      </div>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

const SidebarLink = ({
  imageSrc,
  activeImageSrc,
  label,
  href,
  onClick,
}: {
  imageSrc: string;
  activeImageSrc?: string;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const handleClick = () => {
    if (href) router.push(href);
    else if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
        isActive
          ? "bg-[#23BAD8] text-white font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Image
        src={isActive && activeImageSrc ? activeImageSrc : imageSrc}
        alt={label}
        width={20}
        height={20}
      />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default Sidebar;

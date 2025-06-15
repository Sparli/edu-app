"use client";
import React, { useState } from "react";
import Image from "next/image";
import ProfileModal from "./ProfileModal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { useProfile } from "@/app/context/ProfileContext";

const Sidebar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const { profile } = useProfile();

  const usagePercent = Math.min(
    ((profile?.daily_quota_used ?? 0) / (profile?.daily_quota_limit ?? 1)) *
      100,
    100
  );

  return (
    <div className="w-80 bg-[#FAFAFA] p-6 lg:flex hidden flex-col justify-between border-r border-gray-200">
      {/* Top Section */}
      <div>
        <div className="flex items-center space-x-2 mb-10">
          <Link href="/dashboard">
            <div className="relative w-[200px] h-[60px]">
              <Image
                src={
                  language === "fr"
                    ? "/images/french-logo.png"
                    : "/images/main.svg"
                }
                alt="Logo"
                fill
                className="object-contain cursor-pointer"
              />
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-8 text-lg">
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
            imageSrc="/images/doc.png" // ✅ Add this icon in /public/images
            activeImageSrc="/images/doc-wh.svg" // ✅ Optional white version
            label={t.sidebar_my_content}
            href="/content"
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
        {profile?.daily_quota_limit != null && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-1">
              {t.sidebar_daily_quota}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
              <div
                className="bg-[#23BAD8] h-2 rounded-full"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {profile?.daily_quota_used ?? 0} /{" "}
              {profile?.daily_quota_limit ?? 0}
            </p>
          </div>
        )}
        <SidebarLink
          imageSrc="/images/log.svg"
          label={t.sidebar_logout}
          onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/auth";
          }}
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

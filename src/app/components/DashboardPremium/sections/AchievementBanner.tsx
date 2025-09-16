"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface AchievementBannerProps {
  title?: string;
  description?: string;
}

const AchievementBanner: React.FC<AchievementBannerProps> = ({
  title,
  description,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Use provided props or fallback to translated defaults
  const displayTitle = title || t.achievement_banner_default_title;
  const displayDescription = description || t.achievement_banner_default_description;

  return (
    <div className="flex w-full h-[104px] items-center justify-between rounded-[15px] bg-[#23BAD8] p-[16px] text-white shadow-sm">
      {/* Left Icon + Text */}
      <div className="flex items-center gap-3">
        <div className="">
          <Image
            src="/PremImages/achivement.svg"
            alt={t.achievement_banner_alt}
            width={68}
            height={68}
          />
        </div>
        <div>
          <h4 className="sm:text-[20px] text-[18px] text-[#191818] font-bold">{displayTitle}</h4>
          <p className="sm:text-sm text-[12px] font-normal">{displayDescription}</p>
        </div>
      </div>

      {/* Right Trophy */}
      <div className="">
        <Image
          src="/PremImages/prize.svg"
          alt={t.achievement_banner_trophy_alt}
          width={68}
          height={68}
        />
      </div>
    </div>
  );
};

export default AchievementBanner;

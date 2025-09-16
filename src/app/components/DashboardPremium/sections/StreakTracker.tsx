"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface StreakTrackerProps {
  streakCount?: number;
  activeDays?: string[]; // e.g. ["Mon","Tue","Wed","Thu"]
}

const StreakTracker: React.FC<StreakTrackerProps> = ({
  streakCount = 4,
  activeDays = ["Mon", "Tue", "Wed", "Thu"],
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Create translated day mapping
  const dayTranslations: { [key: string]: string } = {
    "Mon": t.streak_tracker_mon,
    "Tue": t.streak_tracker_tue,
    "Wed": t.streak_tracker_wed,
    "Thu": t.streak_tracker_thu,
    "Fri": t.streak_tracker_fri,
    "Sat": t.streak_tracker_sat,
    "Sun": t.streak_tracker_sun,
  };

  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[8px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Image
          src="/PremImages/streak.png"
          alt={t.streak_tracker_alt}
          width={28}
          height={28}
        />
        <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">{t.streak_tracker_title}</h3>
      </div>

      {/* Big fire + streak count */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFE5DF]">
          <Image
            src="/PremImages/streak.png"
            alt={t.streak_tracker_alt}
            width={28}
            height={28}
          />
        </div>
        <p className="mt-2 sm:text-sm text-[12px] font-semibold text-[#191818]">
          {String(streakCount).padStart(2, "0")} {t.streak_tracker_days_streak}
        </p>
      </div>

      {/* Day-wise streaks */}
      <div className="flex items-center overflow-x-auto scrollbar-hide justify-center gap-6">
        {allDays.map((day) => {
          const isActive = activeDays.includes(day);
          return (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isActive ? "bg-[#FFE5DF]" : "bg-gray-100"
                }`}
              >
                <Image
                  src="/PremImages/streak.png"
                  alt={t.streak_tracker_alt}
                  width={28}
                  height={28}
                  className={!isActive ? "grayscale" : ""}
                />
              </div>
              <span className="sm:text-sm text-[12px] font-semibold text-[#191818]">{dayTranslations[day]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakTracker;
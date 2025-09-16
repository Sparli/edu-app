"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface Achievement {
  id: string;
  title: string;
  dateAgo: string;
  icon: React.ReactNode;
  
}

const Milestones: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const recentAchievements: Achievement[] = [
    {
      id: "math-master",
      title: t.milestones_mathematics_master,
      dateAgo: `02 ${t.milestones_days_ago} Ago`,
      icon: <Image src="/PremImages/bluePrize.png" alt={t.milestones_trophy_alt} width={48} height={48} />,
      
    },
    {
      id: "consistent-learner",
      title: t.milestones_consistent_learner,
      dateAgo: `05 ${t.milestones_days_ago} Ago`,
      icon: <Image src="/PremImages/xp.svg" alt={t.milestones_trophy_alt} width={48} height={48} />,  
      },
  ];

  return (
    <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[10px]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Image src="/PremImages/flag.png" alt={t.milestones_flag_alt} width={28} height={28} />
        <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">{t.milestones_title}</h3>
      </div>

      {/* Highlighted Milestone */}
      <div className="mb-5 flex items-center justify-between rounded-[10px] bg-[#FFEFC7] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
            <Image src="/PremImages/prize.png" alt={t.milestones_prize_alt} width={28} height={28} />
          </div>
          <div>
            <p className="sm:text-[16px] text-[14px] font-bold text-[#191818]">
              {t.milestones_mathematics_master}
            </p>
            <p className="text-xs text-gray-600">{t.milestones_completed_50_math_lessons}</p>
          </div>
        </div>
        <span className="rounded-md bg-white px-2.5 py-1 text-[12px] font-semibold text-[#191818] shadow-sm">
          {t.milestones_new}
        </span>
      </div>

      {/* Recent Achievements */}
      <h4 className="mb-[20px] text-sm font-bold text-gray-900">
        {t.milestones_recent_achievements}
      </h4>
      <ul className="space-y-[20px]">
        {recentAchievements.map((ach) => (
          <li key={ach.id} className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full`}
            >
              {ach.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{ach.title}</p>
              <p className="text-xs text-gray-500">{ach.dateAgo}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Milestones;

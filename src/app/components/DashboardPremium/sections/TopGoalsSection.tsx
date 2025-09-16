"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface StatCardProps {
  icon: string;
  iconBg: string;
  value: string;
  label: string;
}

const StatCard = ({ icon, iconBg, value, label }: StatCardProps) => (
  <div className="bg-white sm:h-[96px] h-[70px] rounded-[15px] border border-[#4A4A4A40]/75 p-4 flex items-center gap-3  opacity-100  sm:p-4 sm:gap-3">
    <div
      className={`sm:w-[64px] sm:h-[64px] w-[48px] h-[48px] rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
    >
      <Image
        src={icon}
        alt={label}
        width={64}
        height={64}
        className="w-[64px] h-[64px]"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="sm:text-[20px] text-sm font-bold text-[#191818]">
        <span className="sm:text-[20px] text-sm">{value}</span> {label}
      </p>
    </div>
  </div>
);

interface TopGoalsSectionProps {
  loading: boolean;
  streakCount: number | null;
  totalXp: number | null;
  level: number | null;
  weeklyGoalPercent: string | null;
}

const TopGoalsSection = ({
  loading,
  streakCount,
  totalXp,
  level,
  weeklyGoalPercent,
}: TopGoalsSectionProps) => {
  const { language } = useLanguage();
  const t = translations[language];

  const stats = [
    {
      icon: "/PremImages/streak.svg", // Using flame-like icon
      iconBg: "bg-pink-100",
      value: loading
        ? "…"
        : streakCount != null
        ? String(streakCount).padStart(2, "0")
        : "--",
      label: t.top_goals_days_streak,
    },
    {
      icon: "/PremImages/xp.svg",
      iconBg: "bg-yellow-100",
      value: loading ? "…" : totalXp != null ? String(totalXp) : "--",
      label: t.top_goals_xp,
    },
    {
      icon: "/PremImages/level.svg", // Using trophy-like icon
      iconBg: "bg-blue-100",
      value: loading ? "…" : level != null ? String(level) : "--",
      label: t.top_goals_level,
    },
    {
      icon: "/PremImages/goal.svg", // Using target-like icon
      iconBg: "bg-pink-100",
      value: loading ? "…" : weeklyGoalPercent ?? "--%",
      label: t.top_goals_weekly_goal,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="sm:text-[20px] text-base font-bold text-[#191818] mb-4">
        {t.top_goals_title}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            iconBg={stat.iconBg}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
};

export default TopGoalsSection;
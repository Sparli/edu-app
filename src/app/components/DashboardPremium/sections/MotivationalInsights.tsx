"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { MotivationalInsightsData } from "@/app/utils/insightsApi";

interface MotivationalInsightsProps {
  loading?: boolean;
  data?: MotivationalInsightsData | null;
  error?: string | null;
  // Legacy props for backward compatibility
  progressText?: string;
  subText?: string;
  quote?: string;
}

const MotivationalInsights: React.FC<MotivationalInsightsProps> = ({
  loading = false,
  data,
  error,
  progressText,
  subText,
  quote,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Use API data if available, otherwise fallback to props or defaults
  const displayProgressText = data?.insight?.title || progressText || t.motivational_insights_default_progress;
  const displaySubText = data?.insight?.subtitle || subText || t.motivational_insights_default_subtext;
  const displayQuote = data?.quote || quote || t.motivational_insights_default_quote;

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[8px]">
        <div className="flex items-center gap-2 px-5 py-3">
          <Image
            src="/PremImages/light.png"
            alt={t.motivational_insights_alt}
            width={28}
            height={28}
          />
          <h3 className="text-[20px] font-bold text-[#191818]">
            {t.motivational_insights_title}
          </h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading insights...</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[8px]">
        <div className="flex items-center gap-2 px-5 py-3">
          <Image
            src="/PremImages/light.png"
            alt={t.motivational_insights_alt}
            width={28}
            height={28}
          />
          <h3 className="text-[20px] font-bold text-[#191818]">
            {t.motivational_insights_title}
          </h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load insights</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[8px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3">
        <Image
          src="/PremImages/light.png"
          alt={t.motivational_insights_alt}
          width={28}
          height={28}
        />
        <h3 className="text-[20px] font-bold text-[#191818]">
          {t.motivational_insights_title}
        </h3>
      </div>

      {/* Progress + Subtext */}
      <div className="px-5 py-4 space-y-[26px]">
        <div className="flex items-start gap-2">
          <Image
            src="/PremImages/rocket.png"
            alt={t.motivational_insights_rocket_alt}
            width={28}
            height={28}
          />
          <div>
            <p className="text-sm font-medium text-[#191818]">{displayProgressText}</p>
            <p className="text-xs text-[#4A4A4A]">{displaySubText}</p>
          </div>
        </div>

        {/* Quote box */}
        <div className="rounded-md bg-[#4A4A4A1A]/90 px-4 py-3  text-center text-sm font-bold text-[#191818] italic">
          &ldquo;{displayQuote}&rdquo;
        </div>
      </div>
    </div>
  );
};

export default MotivationalInsights;
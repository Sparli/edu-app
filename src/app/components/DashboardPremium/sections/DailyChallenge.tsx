"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { DailyChallengeData } from "@/app/utils/insightsApi";

interface DailyChallengeProps {
  loading: boolean;
  data: DailyChallengeData | null;
  error: string | null;
  onOpenModal?: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({
  loading,
  data,
  error,
  onOpenModal,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Extract data for display (only show eta, subject, and title in widget)
  const subject = data?.daily_weakest_subject || "Subject";
  const duration = data?.eta || "-- Mins";
  const title = data?.mcq?.title || "Daily Challenge";

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white px-[16px] py-[18px]">
        <div className="flex items-center gap-2 px-5 py-3">
          <Image
            src="/PremImages/daily.png"
            alt={t.daily_challenge_title}
            width={32}
            height={32}
          />
          <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">
            {t.daily_challenge_title}
          </h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading challenge...</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white px-[16px] py-[18px]">
        <div className="flex items-center gap-2 px-5 py-3">
          <Image
            src="/PremImages/daily.png"
            alt={t.daily_challenge_title}
            width={32}
            height={32}
          />
          <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">
            {t.daily_challenge_title}
          </h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load challenge</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!data) {
    return (
      <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white px-[16px] py-[18px]">
        <div className="flex items-center gap-2 px-5 py-3">
          <Image
            src="/PremImages/daily.png"
            alt={t.daily_challenge_title}
            width={32}
            height={32}
          />
          <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">
            {t.daily_challenge_title}
          </h3>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No challenge available</p>
            <p className="text-sm text-gray-400">Check back later for today&apos;s challenge</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white px-[16px] py-[18px] transition-shadow duration-200 ${
        data.submitted 
          ? "cursor-default" 
          : "cursor-pointer hover:shadow-lg"
      }`}
      onClick={data.submitted ? undefined : onOpenModal}
    >
      {/* Header */}
      <div className="flex items-center gap-2  px-5 py-3">
        <Image
          src="/PremImages/daily.png"
          alt={t.daily_challenge_title}
          width={32}
          height={32}
        />
        <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">
          {t.daily_challenge_title}
        </h3>
      </div>

      {/* Meta + Question */}
      <div className="px-5 py-4 space-y-6">
        {/* Meta info row */}
        <div className="flex items-center gap-3 sm:text-lg text-[16px] text-[#777777]">
          <div className="flex items-center gap-2">
            <Image
              src="/PremImages/time.png"
              alt={t.daily_challenge_timer_alt}
              width={32}
              height={32}
            />
            <span>{duration}</span>
          </div>
          <span className="mx-1 sm:text-[16px] text-[14px]">•</span>
          <span>{subject}</span>
        </div>

        {/* Challenge Title */}
        <div className="rounded-md bg-[#4A4A4A1A]/90 font-medium sm:text-[16px] text-[14px] px-4 py-3 text-[#191818]">
          {title}
        </div>
      </div>

      {/* Action button */}
      <div className="px-5 pb-4 mt-4">
        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!data.submitted && onOpenModal) {
                onOpenModal();
              }
            }}
            disabled={data.submitted}
            className={`sm:w-1/3 w-full rounded-md h-[45px] px-4 py-[12px] text-sm font-bold transition-colors focus:outline-none ${
              data.submitted 
                ? "bg-gray-500 text-white cursor-not-allowed opacity-80" 
                : "bg-[#23BAD8] hover:bg-cyan-600 text-white focus:ring-2 focus:ring-cyan-400"
            }`}
          >
            {data.submitted ? "Already Submitted" : t.daily_challenge_start}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
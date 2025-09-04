"use client";
import React, { useCallback, useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useProfile } from "@/app/context/ProfileContext";
import { translations } from "@/app/translations";
import { IoIosSend } from "react-icons/io";
import Image from "next/image";

const PremiumYearlyView: React.FC = () => {
  const { language } = useLanguage();
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState(false);

  const userName = profile?.first_name || "User";
  const t = translations[language];

  const features = [
    t.premium_feature_unlimited_quizzes,
    t.premium_feature_full_access,
    t.premium_feature_personalized_roadmap,
    t.premium_feature_priority_access,
    t.premium_feature_all_premium,
  ];

  const handleDowngradeToFree = useCallback(async () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              subscription_status: "free",
              is_subscribed: false,
            }
          : null
      );
      setLoading(false);
    }, 1000);
  }, [setProfile]);

  return (
    <div className="w-full mt-8 mb-8">
      {/* Greeting Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Image
            src="/images/hand.png"
            alt="Wave"
            width={20}
            height={20}
            className="sm:w-6 sm:h-6"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1F2937]">
            {t.premium_yearly_greeting.replace("{{name}}", userName)}
          </h1>
        </div>
        <p className="text-[#4A4A4A] text-xs sm:text-sm md:text-base">
          {t.premium_yearly_ready}
        </p>
      </div>

      {/* Premium Plan Card */}
      <div className="flex">
        <div className="bg-white shadow-lg overflow-hidden flex flex-col gap-3 sm:gap-5 w-full h-full rounded-[16px] sm:rounded-[20px] border-2 border-gray-200 pt-4 pb-4 sm:pt-5 sm:pb-5">
          {/* Validity Badge */}
          <div
            className="w-full sm:w-[370px] h-[50px] sm:h-[68px] flex items-center gap-[10px] px-4 sm:px-8 py-3 sm:py-4 text-white text-center font-bold text-sm sm:text-base"
            style={{
              background:
                "linear-gradient(63.38deg, #0463EF 7.06%, #16EA9E 104.99%)",
              borderTopRightRadius: "30px",
              borderBottomRightRadius: "30px",
              opacity: 1,
            }}
          >
            <span>{t.premium_yearly_valid_till}</span>
          </div>

          {/* Card Content */}
          <div className="px-4 sm:px-6 flex-1">
            {/* Plan Title */}
            <h2
              className="font-bold text-2xl sm:text-3xl md:text-[40px] leading-[100%] tracking-normal text-[#191818] mb-4 sm:mb-6"
              style={{ fontStyle: "bold" }}
            >
              {t.premium_yearly_plan_title}
            </h2>
            <hr className="text-[#4A4A4A40]/75 my-[12px] sm:my-[16px] -mx-4 sm:-mx-14 w-[calc(100%+32px)] sm:w-[calc(100%+80px)]" />
            {/* Features List */}
            <ul className="">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 border-b border-[#4A4A4A40] py-[16px] sm:py-[24px] last:border-b-0"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#23BAD8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-[#191818] font-semibold text-sm sm:text-base md:text-[20px] leading-[145%]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Downgrade Button */}
      <div className="flex mt-[16px] sm:mt-[20px] sm:justify-end justify-center">
        <button
          onClick={handleDowngradeToFree}
          disabled={loading}
          className={`flex items-center gap-1 border  text-sm sm:text-lg font-semibold border-[#FF2E2E] text-[#FF2E2E] w-full ${
            language === "fr"
              ? "sm:max-w-[330px] max-w-[280px]"
              : "sm:max-w-[260px] max-w-[230px]"
          } h-[38px] sm:h-[42px] rounded-[8px] sm:rounded-[10px] hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 opacity-100`}
        >
          <span className="text-sm sm:text-base ">
            {t.premium_downgrade_btn}
          </span>
          <IoIosSend className="w-4 h-4 sm:w-[19px] sm:h-[19px]" />
        </button>
      </div>
    </div>
  );
};

export default PremiumYearlyView;

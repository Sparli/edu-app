"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

const PremiumSection = () => {
  const { language } = useLanguage();
  const t = translations[language];

  const features = [
    {
      icon: "/images/content.svg",
      title: t.feature_content_title,
      description: t.feature_content_desc,
      bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
    },
    {
      icon: "/images/save.svg",
      title: t.feature_save_title,
      description: t.feature_save_desc,
      bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
    },
    {
      icon: "/images/access.svg",
      title: t.feature_save_title,
      description: t.feature_save_desc,
      bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
    },
  ];

  return (
    <div className="w-full px-6 md:px-12 py-10">
      <div className="flex flex-col lg:flex-row justify-between mb-4">
        <h1 className="text-xl lg:text-[33px] font-semibold text-[#000000]">
          {t.premium_title}
        </h1>
      </div>

      <p className="text-[#4A4A4A] mb-10 lg:text-[22px] text-base">
        {t.premium_subtext}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:min-w-[600px] lg:min-h-[500px] mb-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 ${feature.bg} text-center  `}
          >
            <div className=" flex  items-center justify-center">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={250}
                height={250}
              />
            </div>
            <h3 className="font-semibold text-[#1F2937]  lg:text-2xl text-xl">
              {feature.title}
            </h3>
            <p className="text-[#4B5563] text-lg lg:text-xl  mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-[#FFCF55] to-[#F0B82C] text-gray-800 lg:text-2xl text-lg font-semibold lg:py-6 lg:px-20 px-10 py-2 rounded-lg shadow-lg hover:opacity-90 transition">
          {t.premium_upgrade_btn}
        </button>
      </div>
    </div>
  );
};

export default PremiumSection;

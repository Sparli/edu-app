"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import { useState } from "react";
import authApi from "../utils/authApi";
import { useProfile } from "@/app/context/ProfileContext";

const PremiumSection = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const [loading, setLoading] = useState(false);
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;

  const features = [
    {
      icon: "/images/book-1.svg",
      title: t.feature_content_title,
      description: t.feature_content_desc,
      bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
      iconBg: "bg-[#FF9F58]", // orange
    },
    {
      icon: "/images/save-1.svg",
      title: t.feature_save_title,
      description: t.feature_save_desc,
      bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
      iconBg: "bg-[#4ADE80]", // green
    },
    {
      icon: "/images/infinity.svg",
      title: t.Infinte_learning,
      description: t.Infinte_learning_subtitle,
      bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
      iconBg: "bg-[#A78BFA]", // purple
    },
  ];

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await authApi.post("/billing/create-checkout-session/");
      const data = res.data;

      if (data.success && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        alert(data.error || "Something went wrong...");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
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
            <div className="flex items-center justify-center mb-4">
              <div
                className={`w-40 h-40 rounded-full flex items-center justify-center ${feature.iconBg}`}
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>

            <h3 className="font-semibold text-[#1F2937]  lg:text-2xl text-xl">
              {feature.title}
            </h3>
            <ul className="text-[#4B5563] text-left list-disc pl-5 text-base lg:text-lg mt-4 space-y-2">
              {Array.isArray(feature.description) ? (
                feature.description.map((point, i) => <li key={i}>{point}</li>)
              ) : (
                <li>{feature.description}</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleUpgrade}
          disabled={loading || isSubscribed}
          className={`bg-gradient-to-r from-[#FFCF55] to-[#F0B82C] text-gray-800 lg:text-2xl text-lg font-semibold lg:py-6 lg:px-20 px-10 py-2 rounded-lg shadow-lg transition ${
            loading || isSubscribed
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 cursor-pointer"
          }`}
        >
          {loading
            ? "Loading..."
            : isSubscribed
            ? t.premium_already_subscribed
            : t.premium_upgrade_btn}
        </button>
      </div>
    </div>
  );
};

export default PremiumSection;

"use client";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import { useProfile } from "@/app/context/ProfileContext";
import DashboardPremium from "../components/DashboardPremium";
import DashboardFree from "../components/DashboardFree";

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const { profile } = useProfile();
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  let welcomeMessage = "";

  // If subscribed: show time-of-day greeting with name (localized)
  if (profile?.is_subscribed) {
    const hour = new Date().getHours();
    let greetingKey: "greeting_morning" | "greeting_afternoon" | "greeting_evening";
    if (hour >= 5 && hour < 12) greetingKey = "greeting_morning";
    else if (hour >= 12 && hour < 18) greetingKey = "greeting_afternoon";
    else greetingKey = "greeting_evening";

    const timeGreeting = translations[language][greetingKey];
    welcomeMessage = `${timeGreeting}, ${profile?.first_name ?? ""}`;
  } else {
    // Free users: keep existing logic
    if (language === "en") {
      welcomeMessage = profile?.first_visit
        ? `Welcome, ${profile?.first_name}`
        : `Welcome Back, ${profile?.first_name}`;
    } else if (language === "fr") {
      if (profile?.first_visit) {
        if (profile?.gender === "male") {
          welcomeMessage = `Bienvenu, ${profile?.first_name}`;
        } else if (profile?.gender === "female") {
          welcomeMessage = `Bienvenue, ${profile?.first_name}`;
        } else {
          welcomeMessage = `Bienvenue, ${profile?.first_name}`;
        }
      } else {
        welcomeMessage = `Bon retour, ${profile?.first_name}`;
      }
    }
  }

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between mb-10 mt-2 w-full">
        <div>
          <h1 className="lg:text-3xl text-[20px] font-semibold text-[#000000] flex items-center space-x-2">
            <span>{welcomeMessage}</span>
            <Image src="/images/hand.png" alt="Wave" width={24} height={24} />
          </h1>
          <p className="text-[#4A4A4A] lg:text-xl text-base lg:mt-3 font-normal">
            {profile?.is_subscribed ? t.subscribed_subtitle : t.dashboard_ready}
          </p>
          {!profile?.is_subscribed && (
            <p className="text-gray-500 text-lg lg:mt-2">{t.dashboard_prompt}</p>
          )}
        </div>
<div className="flex justify-end lg:w-1/3 w-full">
        {profile?.is_subscribed ? (
          <button
            onClick={() => setIsCustomizeModalOpen(true)}
            className="flex items-center mb-8 px-6 py-2 bg-[#ffffff] border border-[#E2E2E2] rounded-[15px] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
            style={{ boxShadow: "0 1px 4px 0 rgba(16,30,54,0.04)" }}
            type="button"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/icons/custom.png"
                alt="Custom"
                width={24}
                height={24}
              />
              <span className="text-[#111928] text-lg font-semibold">
                {t.dashboard_premium}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => router.push("/subscription")}
            className="hidden lg:flex items-center mb-8 px-6 py-2 bg-[#2BDA2B] text-white cursor-pointer font-semibold rounded-xl shadow hover:bg-green-600 transition"
          >
            <FaStar className="mr-2 text-yellow-300" />
            {t.dashboard_upgrade}
          </button>
        )}
        </div>
      </div>
      {profile?.is_subscribed ? (
        <DashboardPremium 
          isCustomizeModalOpen={isCustomizeModalOpen}
          onCloseCustomizeModal={() => setIsCustomizeModalOpen(false)}
        />
      ) : (
        <DashboardFree />
      )}
    </>
  );
}

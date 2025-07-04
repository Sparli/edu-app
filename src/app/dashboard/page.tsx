"use client";
import DashboardCards from "@/app/components/DashboardCards";
import QuickGenerate from "@/app/components/QuickGenerate";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import { useProfile } from "@/app/context/ProfileContext";

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const { profile } = useProfile();

  let welcomeMessage = "";

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

  return (
    <>
      <div className="flex items-center justify-between mb-10 mt-2 w-full">
        <div>
          <h1 className="lg:text-3xl text-[20px] font-semibold text-[#000000] flex items-center space-x-2">
            <span>{welcomeMessage}</span>
            <Image src="/images/hand.png" alt="Wave" width={24} height={24} />
          </h1>
          <p className="text-[#4B5563] lg:text-2xl text-base lg:mt-3 font-normal">
            {t.dashboard_ready}
          </p>
          <p className="text-gray-500 text-lg lg:mt-2">{t.dashboard_prompt}</p>
        </div>

        {profile?.is_subscribed ? (
          <div className="hidden lg:flex items-center mb-8  px-6 py-2 bg-yellow-100 text-yellow-800 font-semibold rounded-xl shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mr-2 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6 4.5L8.5 14 2 9.5h7.5z" />
            </svg>
            {t.dashboard_premium}
          </div>
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
      <DashboardCards />
      <hr className="text-[#E5E7EB]" />
      <QuickGenerate />
    </>
  );
}

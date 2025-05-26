"use client";
import DashboardCards from "@/app/components/DashboardCards";
import QuickGenerate from "@/app/components/QuickGenerate";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

export default function DashboardPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  return (
    <>
      <div className="flex items-center justify-between mb-10 mt-2 w-full">
        <div>
          <h1 className="lg:text-3xl text-[20px] font-bold text-gray-800 flex items-center space-x-2">
            <span>{t.dashboard_welcome}</span>
            <Image src="/images/hand.png" alt="Wave" width={24} height={24} />
          </h1>
          <p className="text-gray-500 lg:text-2xl text-base lg:mt-3 font-semibold">
            {t.dashboard_ready}
          </p>
          <p className="text-gray-500 text-sm lg:mt-2">{t.dashboard_prompt}</p>
        </div>

        <button
          onClick={() => router.push("/subscription")}
          className="hidden lg:flex items-center mb-8 px-6 py-2 bg-[#2BDA2B] text-white font-semibold rounded-xl shadow hover:bg-green-600 transition"
        >
          <FaStar className="mr-2 text-yellow-300" />
          {t.dashboard_upgrade}
        </button>
      </div>
      <DashboardCards />
      <hr className="text-[#E5E7EB]" />
      <QuickGenerate />
    </>
  );
}

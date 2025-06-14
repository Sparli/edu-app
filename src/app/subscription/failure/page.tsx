"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import Image from "next/image";

export default function UpgradeFailurePage() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F4F9FF]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Image
            src="/images/fail2.png"
            alt="Failure Illustration"
            width={300}
            height={300}
            className="mb-8"
          />
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {t.upgrade_failure_title}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {t.upgrade_failure_desc}
          </p>

          <button
            onClick={() => router.push("/subscription")}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 lg:w-1/3 w-full rounded-lg text-lg lg:text-2xl font-semibold  transition mt-18"
          >
            {language === "fr" ? "Revenir" : "Go Back"}
          </button>
        </div>
      </div>
    </div>
  );
}

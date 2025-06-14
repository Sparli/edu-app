"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import Image from "next/image";
import { useEffect } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { getUserProfile } from "@/app/utils/getUserProfile";

export default function UpgradeSuccessPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const { setProfile } = useProfile();

  useEffect(() => {
    const refreshProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setProfile({
            ...profile,
            profile_image: profile.profile_image ?? undefined,
          });
        }
      } catch (err) {
        console.error("[success-page] ❌ Failed to refresh profile:", err);
      }
    };

    refreshProfile();
  }, [setProfile]);

  return (
    <div className="flex min-h-screen bg-[#F4F9FF]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <Image
            src="/images/success.svg"
            alt="Success Illustration"
            width={300}
            height={300}
            className="mb-8"
          />
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">
            {t.upgrade_success_title}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            {t.upgrade_success_desc}
          </p>

          <button
            onClick={() => router.push("/subscription")}
            className="bg-gradient-to-r from-blue-500 to-green-400  text-white px-8 py-4 lg:w-1/3 w-full rounded-lg text-lg lg:text-2xl font-semibold hover:opacity-90 transition mt-18"
          >
            {language === "fr" ? "Continuer" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

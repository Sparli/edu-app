// src/app/components/Settings.tsx
"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { deleteAccount } from "@/app/utils/authApi";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Settings() {
  const { language } = useLanguage();
  const t = translations[language];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteAccount();
      if (res.success) {
        // Clear all auth-related storage immediately
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.clear();
        axios.defaults.headers.common["Authorization"] = "";

        // Immediate redirect using router.replace to avoid history entry
        router.replace("/auth/login");
      }
    } catch (err) {
      console.error("❌ Error deleting account:", err);
    }
  };

  const settingsData = [
    {
      title: t.setting_update,
      description: t.desc_update,
    },
    {
      title: t.setting_preview,
      description: t.desc_preview,
    },
    {
      title: t.setting_milestone,
      description: t.desc_milestone,
    },
    {
      title: t.setting_insights,
      description: t.desc_insights,
    },
  ];

  const [toggles, setToggles] = useState(settingsData.map(() => false));

  const toggleSetting = (index: number) => {
    const updated = [...toggles];
    updated[index] = !updated[index];
    setToggles(updated);
  };

  useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal]);

  return (
    <div className="p-6 md:p-12 bg-white">
      <h1 className="text-[33px] lg:text-4xl font-semibold mb-2">
        {t.settingsTitle}
      </h1>
      <p className="text-[#4B5563] text-xl lg:text-2xl font-normal mb-10">
        {t.settingsSubtitle}
      </p>

      <div className="space-y-8">
        {settingsData.map((setting, index) => (
          <div key={index} className="flex justify-between gap-4 pb-6">
            <div>
              <h2 className="text-xl lg:text-2xl text-gray-800">
                {setting.title}
              </h2>
              <p className="text-gray-500 mt-1 hidden lg:flex text-sm md:text-base">
                {setting.description}
              </p>
            </div>

            <button
              onClick={() => toggleSetting(index)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                toggles[index] ? "bg-cyan-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  toggles[index] ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
      <hr className="text-[#E2E2E2] my-6 border-t" />

      <div className="flex justify-between items-center gap-4 mt-10 pb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold text-red-600">
            {t.delete_account_title}
          </h2>
          <p className="text-gray-600 mt-1 hidden lg:flex text-sm md:text-base">
            {t.delete_account_desc}
          </p>
        </div>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition text-sm md:text-base"
        >
          {t.delete_account_btn}
        </button>
      </div>

      {showDeleteModal && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            handleConfirmDelete();
          }}
        />
      )}
    </div>
  );
}

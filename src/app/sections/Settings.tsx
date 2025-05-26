"use client";
import { useState } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

export default function Settings() {
  const { language } = useLanguage();
  const t = translations[language];

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

  return (
    <div className="p-6 md:p-12 bg-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">{t.settingsTitle}</h1>
      <p className="text-gray-500 text-lg mb-10">{t.settingsSubtitle}</p>

      <div className="space-y-8">
        {settingsData.map((setting, index) => (
          <div key={index} className="flex justify-between gap-4 pb-6">
            <div>
              <h2 className="text-2xl text-gray-800">{setting.title}</h2>
              <p className="text-gray-500 mt-1 hidden lg:flex text-sm md:text-base">
                {setting.description}
              </p>
            </div>

            {/* Toggle Switch */}
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
    </div>
  );
}

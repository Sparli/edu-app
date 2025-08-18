"use client";
import { useLanguage } from "@/app/context/LanguageContext";
import Image from "next/image";

const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { language, setLanguage } = useLanguage();

  const handleSwitch = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  const isEnglish = language === "en";

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Language Icon */}
      <Image
        src="/images/lang.png"
        alt="Language Icon"
        width={16}
        height={16}
        className="cursor-pointer"
      />

      {/* Static Disabled Language Label */}
      <span className="text-black text-sm">
        {isEnglish ? "English" : "Anglais"}
      </span>

      {/* Toggle Button */}
      <button
        onClick={handleSwitch}
        className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
          isEnglish ? "bg-[#23BAD8]" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-2 h-2 rounded-full shadow-md transform transition-transform duration-300 ${
            isEnglish ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default LanguageToggle;

"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface ApplyingChangesModalProps {
  isOpen: boolean;
}

const ApplyingChangesModal: React.FC<ApplyingChangesModalProps> = ({
  isOpen,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md mx-4 p-8 text-center">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#23BAD8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#191818] mb-4">
          {t.apply_changes || "Applying Changes"}
        </h2>

        {/* Subtitle */}
        <p className="text-[#4A4A4A] text-base leading-relaxed">
          {t.applying_changes_subtitle || "Hang tight, we are generating best experience tailored for your needs."}
        </p>
      </div>
    </div>
  );
};

export default ApplyingChangesModal;

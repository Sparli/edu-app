"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import Image from "next/image";

interface SignOutAllDevicesModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  errorMessage?: string;
  isProcessing?: boolean;
}

export default function SignOutAllDevicesModal({
  onCancel,
  onConfirm,
  errorMessage,
  isProcessing = false,
}: SignOutAllDevicesModalProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [checked, setChecked] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-xl max-w-2xl h-[513.280029296875px] w-full relative text-center"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="relative w-40 sm:w-48 md:w-60 h-40 sm:h-48 md:h-60 mx-auto mb-4">
          <Image
            src="/images/delete.svg"
            alt="Warning"
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-medium text-gray-800 mb-2">
          {t.signout_modal_title}
        </h2>
        <p className="text-gray-600 mb-6 text-lg font-normal ">
          {t.signout_modal_subtitle}
        </p>

        <label className="flex items-start gap-2 text-left text-sm text-gray-700 mb-6">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 accent-cyan-500"
          />
          {t.signout_modal_confirm_label}
        </label>
        {errorMessage && (
          <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
        )}

        <button
          onClick={checked && !isProcessing ? onConfirm : undefined}
          disabled={!checked || isProcessing}
          className={`w-full px-4 py-3 rounded-md text-[20px] transition-all flex justify-center items-center ${
            checked && !isProcessing
              ? "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
              : "bg-[#FFEBEE] text-[#EC2D30] cursor-not-allowed"
          }`}
        >
          {isProcessing ? (
            <svg
              className="animate-spin h-5 w-5 text-[#EC2D30]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-100"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            t.signout_modal_btn
          )}
        </button>
      </div>
    </div>
  );
}

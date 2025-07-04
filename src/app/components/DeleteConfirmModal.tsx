"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface DeleteConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  const { language } = useLanguage();
  const t = translations[language];

  const isConfirmed = confirmText === "DELETE";

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCancel(); // Close modal if outside click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

        <div className="relative w-40 sm:w-48 md:w-60 h-40 sm:h-48 md:h-60 mx-auto">
          <Image
            src="/images/delete.svg"
            alt="Warning"
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, 240px"
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {t.delete_modal_title}
        </h2>
        <p className="text-gray-600 mb-4">{t.delete_modal_subtitle}</p>

        <p className="text-sm text-left text-gray-500 mb-2">
          {t.delete_modal_instruction}
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300 mb-4"
        />

        <button
          onClick={isConfirmed ? onConfirm : undefined}
          disabled={!isConfirmed}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md text-[20px] transition-all ${
            isConfirmed
              ? "bg-red-600 text-white hover:bg-red-700 shadow-sm cursor-pointer"
              : "bg-[#FFEBEE] text-[#EC2D30] cursor-not-allowed"
          }`}
        >
          <Trash2 className="w-5 h-5" />
          {t.delete_modal_btn}
        </button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

type UpgradeModalProps = {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title: string;
  description: string;
  cancelText: string;
  upgradeText: string;
};

const UpgradeModal = ({
  visible,
  onClose,
  onUpgrade,
  title,
  description,
  cancelText,
  upgradeText,
}: UpgradeModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-xl shadow-xl lg:max-w-[740px] h-auto mx-2 lg:mx-0 w-full relative text-center"
      >
        <div className="relative w-40 sm:w-48 md:w-60 lg:w-72 xl:w-80 h-40 sm:h-48 md:h-60 lg:h-72 xl:h-60 mx-auto">
          <Image
            src="/images/prem.svg"
            alt="Warning"
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 200px, (max-width: 1024px) 288px, (max-width: 1280px) 320px, 100vw"
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-normal text-gray-800 mb-2">{title}</h2>
        <p className="text-lg text-gray-600 mb-8">{description}</p>

        <div className="flex justify-center gap-6">
          <button
            onClick={onClose}
            className="lg:px-22 lg:py-3 px-8 py-2 text-[20px] bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onUpgrade}
            className="lg:px-22 lg:py-3 px-8 py-2 text-[20px] bg-[#04C0F2] text-white rounded-md hover:bg-[#00a5d2]"
          >
            {upgradeText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

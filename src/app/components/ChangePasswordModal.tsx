"use client";

import { useRef, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { FaLock } from "react-icons/fa";

interface Props {
  onCancel: () => void;
  onConfirm: (
    current: string,
    newPass: string,
    confirm: string
  ) => Promise<boolean>; // <-- async
  isProcessing?: boolean;
  errorMessage?: string;
}

export default function ChangePasswordModal({
  onCancel,
  onConfirm,
  isProcessing = false,
  errorMessage,
}: Props) {
  const { language } = useLanguage();
  const t = translations[language];
  const modalRef = useRef<HTMLDivElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async () => {
    if (canSubmit && !isProcessing) {
      const success = await onConfirm(
        currentPassword,
        newPassword,
        confirmPassword
      );
      if (success) {
        setShowModal(true);
      }
    }
  };
  useEffect(() => {
    if (showModal) {
      const timeout = setTimeout(() => {
        setShowModal(false);
        onCancel(); // close entire modal
      }, 3000); // 3s
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

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

  const isValid = !!currentPassword && !!newPassword && !!confirmPassword;
  const canSubmit = isValid && agreed;

  return (
    <>
      {!showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
          <div
            ref={modalRef}
            className="bg-white px-10 py-8 rounded-xl shadow-xl max-w-lg w-full relative"
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {/* Lock Icon */}
            <div className="flex justify-center mb-4">
              <div className="">
                <Image
                  src="/images/lock.svg"
                  alt="Lock Icon"
                  width={100}
                  height={100}
                />
              </div>
            </div>

            {/* Title + Subtitle */}
            <h2 className="text-2xl font-normal text-gray-800 mb-2 text-center">
              {t.change_password_modal_title}
            </h2>
            <p className="text-gray-600 text-center mb-8 text-lg">
              {t.change_password_modal_subtitle}
            </p>

            {/* Input Fields */}
            <div className="space-y-8 text-left ">
              {/* Current */}
              <div className="relative">
                <FaLock className="absolute left-2 top-[50px] text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t.current_password}
                </label>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-4 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-[39px] text-gray-500"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* New */}
              <div className="relative">
                <FaLock className="absolute left-2 top-[50px] text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t.new_password}
                </label>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-4 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-[39px] text-gray-500"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Confirm */}
              <div className="relative">
                <FaLock className="absolute left-2 top-[50px] text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {t.confirm_password}
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-4 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-[39px] text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-2 text-sm text-gray-700 my-8">
              <input
                type="checkbox"
                className="mt-1 accent-cyan-500"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />

              {t.change_password_checkbox}
            </label>

            {/* Error */}
            {errorMessage && (
              <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={onCancel}
                className="w-full px-4 py-3 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isProcessing}
                className={`w-full px-4 py-3 rounded-md transition-all flex justify-center items-center ${
                  canSubmit && !isProcessing
                    ? "bg-cyan-500 text-white hover:bg-cyan-600"
                    : "bg-cyan-500 text-white opacity-50"
                }`}
              >
                {isProcessing ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  t.update
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-8 max-w-sm lg:max-w-md w-full text-center">
            <Image
              src="/images/success.svg"
              alt="Success"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2 text-[#23BAD8]">
              {t.forgot_success_title}
            </h3>
            <p className="text-gray-600 mb-6">{t.success_message}</p>
          </div>
        </div>
      )}
    </>
  );
}

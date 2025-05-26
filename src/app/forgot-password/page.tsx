"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

const ForgotPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();

  const handleSubmit = () => {
    if (!agreed) {
      setShowWarning(true);
      return;
    }

    if (password === confirm && agreed) {
      setShowWarning(false);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="lg:hidden md:hidden w-[390px] mx-auto mt-4 px-6 py-5 flex justify-center bg-[#DAE9FF] rounded-4xl z-10">
        <Image
          src="images/logo.svg"
          alt="EduImmersion Logo"
          width={150}
          height={150}
        />
      </div>

      <div className="flex lg:min-h-screen w-full">
        {/* Left image */}
        <div className="hidden md:flex w-[60%] relative">
          <Image src="/images/BG.svg" alt="BG" fill className="object-cover" />
        </div>

        {/* Right form */}
        <div className="flex-1 flex items-center justify-center bg-white p-4 mt-10">
          <div className="w-80 sm:w-96 space-y-12">
            {/* Password */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                {t.forgot_create_password}
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#23BAD8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  👁
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                {t.forgot_confirm_password}
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#23BAD8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
                >
                  👁
                </span>
              </div>
            </div>

            {/* Checkbox with warning */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => {
                    setAgreed(!agreed);
                    setShowWarning(false);
                  }}
                  className="accent-[#23BAD8]"
                />
                {t.forgot_agree_terms}
              </label>
              {showWarning && (
                <p className="text-red-500 text-sm mt-1">
                  {t.forgot_agree_warning}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full p-3 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
            >
              {t.forgot_submit_button}
            </button>

            {/* Link to signup */}
            <p className="text-center text-gray-600">
              {t.forgot_no_account}{" "}
              <span
                className="text-[#23BAD8] font-semibold cursor-pointer"
                onClick={() => router.push("/auth")}
              >
                {t.forgot_signup}
              </span>
            </p>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center">
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
              <p className="text-gray-600 mb-6">{t.forgot_success_message}</p>
              <button
                className="w-full p-3 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
                onClick={() => router.push("/auth")}
              >
                {t.forgot_success_button}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ForgotPasswordPage;

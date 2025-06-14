"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import authApi from "../utils/authApi";

const OtpVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [resendCooldown, setResendCooldown] = useState(30); // seconds
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (resendCooldown === 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const key = e.key;

    if (key === "Backspace" && !otp[idx]) {
      const prevInput = document.getElementById(
        `otp-${idx - 1}`
      ) as HTMLInputElement;
      if (prevInput) {
        const updatedOtp = [...otp];
        updatedOtp[idx - 1] = "";
        setOtp(updatedOtp);
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 4).split("");
    const updatedOtp = [...otp];

    digits.forEach((digit, i) => {
      if (i < otp.length) updatedOtp[i] = digit;
    });

    setOtp(updatedOtp);

    // focus the last filled field
    const nextIndex = Math.min(digits.length - 1, otp.length - 1);
    const nextInput = document.getElementById(`otp-${nextIndex}`);
    nextInput?.focus();
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]{0,1}$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    setVerifying(true);
    setError(false);

    try {
      const res = await authApi.post("/users/verify-otp/", {
        email,
        otp: fullOtp,
      });

      if (res.data.success) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setSuccess(true);
        router.push("/dashboard");
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || resending || resendCooldown > 0) return;

    setResending(true);
    setResendMessage(null);
    setResendError(null);

    try {
      const res = await authApi.post("/users/resend-otp/", { email });

      if (res.data.success) {
        setResendMessage(res.data.message || "OTP resent.");
        setResendCooldown(30);
      } else {
        setResendError(res.data.error || "Something went wrong.");
      }
    } catch {
      setResendError("Server error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {/* Mobile Top Logo Bar */}
      <div className="lg:hidden md:hidden w-[390px] mx-auto mt-4 px-6 py-5 flex justify-center bg-[#DAE9FF]  rounded-4xl  z-10">
        <div className="flex items-center space-x-2">
          <Image
            src="images/logo.svg"
            alt="EduImmersion Logo"
            width={150}
            height={150}
            className="mr-2"
          />
        </div>
      </div>
      <div className="flex lg:min-h-screen w-full">
        {/* Left Side Image (hidden on mobile) */}
        <div className="hidden md:flex w-[60%] relative">
          <Image
            src="/images/BG.svg"
            alt="Logo Background"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Form Area */}
        <div className="flex-1 flex items-center justify-center bg-white p-4 mt-6">
          <div className="w-80 sm:w-96 space-y-6">
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-2">
                {t.otp_email_label}
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#23BAD8]" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
              </div>
            </div>

            {/* Verification Code Inputs */}
            {!success && (
              <>
                <div className="text-center">
                  <h2 className="text-[#23BAD8] font-bold text-xl mb-2">
                    {t.otp_code_title}
                  </h2>
                  <p className="text-gray-500 text-lg mb-4">
                    {t.otp_code_instruction}
                  </p>
                </div>

                <div className="flex justify-center space-x-2 mb-4">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="tel" // ✅ Change to "tel" for numeric keyboard
                      inputMode="numeric" // ✅ Helps further hint the browser
                      pattern="[0-9]*" // ✅ For validation + mobile keyboard
                      value={digit}
                      maxLength={1}
                      className={`w-14 h-14 text-center rounded-lg text-xl font-semibold ${
                        error ? "border border-red-500" : "bg-[#F6F6F6]"
                      }`}
                      onChange={(e) => handleChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={(e) => handlePaste(e)}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">
                    {t.otp_error}
                  </p>
                )}
              </>
            )}
            <div className="text-center mt-2">
              {resendCooldown > 0 ? (
                <p className="text-gray-500 text-sm">
                  You can resend OTP in{" "}
                  <span className="font-semibold">{resendCooldown}</span>s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-[#23BAD8] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending..." : t.otp_resend_button}
                </button>
              )}
            </div>
            {resendMessage && (
              <p className="text-green-600 text-sm text-center mt-1">
                {resendMessage}
              </p>
            )}

            {resendError && (
              <p className="text-red-500 text-sm text-center mt-1">
                {resendError}
              </p>
            )}

            {/* Success message */}
            {success && (
              <div className="text-center space-y-4">
                <Image
                  src="/images/success.svg"
                  alt="Success"
                  width={150}
                  height={150}
                  className="mx-auto"
                />
                <h3 className="text-xl font-semibold">{t.otp_success_title}</h3>
                <p className="text-gray-500 text-lg">{t.otp_success_message}</p>
              </div>
            )}

            <button
              onClick={() => {
                if (otp.some((digit) => digit === "")) {
                  setError(true);
                } else {
                  handleVerify();
                }
              }}
              disabled={verifying}
              className={`w-full p-3 rounded-lg transition flex justify-center items-center ${
                verifying
                  ? "bg-[#23BAD8]/70 cursor-not-allowed"
                  : "bg-[#23BAD8] hover:bg-cyan-600"
              } text-white`}
            >
              {verifying ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
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
              ) : null}
              {verifying ? "Verifying..." : t.otpa_continue}
            </button>

            <p className="text-center text-gray-600">
              {t.otp_no_account}{" "}
              <span
                onClick={() => router.push("/auth")}
                className="text-[#23BAD8] font-semibold cursor-pointer"
              >
                {t.otp_signup}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;

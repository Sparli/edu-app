"use client";
import React from "react";
import Image from "next/image";
import { FaEnvelope } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import authApi from "../utils/authApi";
import { useState } from "react";
import type { AxiosError } from "axios";

const RecoverPasswordPage = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.post("/users/forgot-password/request-otp/", {
        email,
      });

      const data = res.data;
      setLoading(false);

      if (data.success) {
        router.push(`/otp2?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.error || "Unknown error.");
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(
        error?.response?.data?.error ||
          "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <>
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
        {/* Left Image */}
        <div className="hidden md:flex w-[60%] relative">
          <Image
            src="/images/BG.svg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>

        {/* Right Content */}
        <div className="flex-1 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md space-y-8">
            <h2 className="text-center text-[#23BAD8] text-2xl ">
              {t.recover_title}
            </h2>
            <p className="text-center text-gray-600">{t.recover_description}</p>

            <div>
              <label className="block text-gray-800 font-medium mb-2">
                {t.recover_email_label}
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                <input
                  type="email"
                  placeholder={t.auth_email_placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {error}
                  </p>
                )}
              </div>
            </div>

            <button
              className="w-full p-3 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
              onClick={handleRequestOtp}
              disabled={loading}
            >
              {loading ? "Sending..." : t.recover_button}
            </button>

            <p className="text-center text-gray-600">
              {t.recover_no_account}{" "}
              <span
                onClick={() => router.push("/auth")}
                className="text-[#23BAD8] font-semibold cursor-pointer"
              >
                {t.recover_signup}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecoverPasswordPage;

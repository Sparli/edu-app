"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import SplashScreen from "./SplashScreen";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import LanguageToggle from "./LanguageToggle";
import Dropdown from "@/app/components/dropdown";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const toggleMode = () => setIsLogin(!isLogin);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedGender, setSelectedGender] = useState("");

  const handleAction = () => {
    setShowSplash(true); // This splash will navigate to /dashboard
  };

  if (showSplash) return <SplashScreen targetRoute="/dashboard" />;

  return (
    <>
      {/* Mobile Top Logo Bar */}
      <div className="lg:hidden w-[390px] mx-auto mt-4 px-6 py-5 flex justify-center bg-[#DAE9FF]  rounded-4xl  z-10">
        <div className="flex items-center space-x-2">
          <Image
            src="images/logo.svg"
            alt="EduImmersion Logo"
            width={150}
            height={150}
            className="mr-2"
          />
        </div>
        <LanguageToggle className="ml-auto" />
      </div>

      {/* Main Content */}
      <div className="flex lg:min-h-screen w-full">
        {/* Left Side for Desktop */}
        <div className="hidden lg:flex w-[60%] relative">
          <Image
            src="/images/BG.svg"
            alt="Logo"
            fill
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right Side Form */}
        <div className="flex-1 flex lg:mt-18 mt-6  justify-center bg-white">
          <div className="hidden lg:block absolute top-6 right-6">
            <LanguageToggle />
          </div>
          <div className="w-80 sm:w-96 space-y-6">
            {/* Toggle Tabs */}
            <div className="flex justify-around border-b border-gray-300 mb-4">
              <button
                className={`lg:pb-2 pb-1 lg:text-lg text-md font-semibold ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent border-b-2 border-blue-500"
                    : "text-gray-200"
                }`}
                onClick={() => setIsLogin(true)}
              >
                {t.auth_login_tab}
              </button>
              <button
                className={`lg:pb-2 pb-1 lg:text-lg text-md font-semibold ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent border-b-2 border-blue-500"
                    : "text-gray-200"
                }`}
                onClick={() => setIsLogin(false)}
              >
                {t.auth_signup_tab}
              </button>
            </div>
            <h1 className=" text-xl font-bold lg:my-8 my-4 text-gray-700 text-center justify-center flex space-x-2">
              <span>{t.auth_welcome}</span>
              <Image src="/images/hand.png" alt="Wave" width={24} height={24} />
            </h1>

            {/* Forms */}
            {isLogin ? (
              <>
                {/* Email Field */}
                <div className="relative my-5">
                  <label className="block text-gray-800 font-medium mb-4">
                    {t.auth_email_label}
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                    <input
                      type="email"
                      placeholder={t.auth_email_placeholder}
                      className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative my-5">
                  <label className="block text-gray-800 font-medium mb-4">
                    {t.auth_password_label}
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t.auth_password_placeholder}
                      className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                    />
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end text-sm cursor-pointer mt-4 mb-5">
                  <Link
                    href="/Recover-password"
                    className="text-black hover:underline"
                  >
                    {t.auth_forgot_password}
                  </Link>
                </div>
                <button
                  onClick={handleAction}
                  className="w-full p-3 bg-[#23BAD8] text-white rounded-lg mt-8 mb-10 hover:bg-cyan-600 transition"
                >
                  {t.auth_login_button}
                </button>
                <p className="text-center text-gray-600">
                  {t.auth_no_account}{" "}
                  <span
                    className="text-[#23BAD8] font-bold cursor-pointer"
                    onClick={toggleMode}
                  >
                    {t.auth_signup_switch}
                  </span>
                </p>
              </>
            ) : (
              <>
                <div className="lg:space-y-10 space-y-7">
                  {/* Name fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_first_name}
                      </label>
                      <input
                        type="text"
                        placeholder="Alex"
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_last_name}
                      </label>
                      <input
                        type="text"
                        placeholder="Smith"
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="mb-1 lg:text-lg text-md text-gray-700">
                      {t.auth_email_label}
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                      <input
                        type="email"
                        placeholder="alex@gmail.com"
                        className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Username and Age */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_username}
                      </label>
                      <input
                        type="text"
                        placeholder="@alexsmith"
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_age}
                      </label>
                      <input
                        type="number"
                        placeholder="25"
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col">
                    <label className="mb-1 lg:text-lg text-md text-gray-700">
                      {t.auth_gender}
                    </label>
                    <Dropdown
                      options={[
                        t.auth_select_gender,
                        t.auth_gender_male,
                        t.auth_gender_female,
                        t.auth_gender_other,
                      ]}
                      selected={selectedGender || t.auth_select_gender}
                      onSelect={setSelectedGender}
                      className="w-full"
                    />
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col relative">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_password_label}
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                      />
                      <span
                        className="absolute right-3 top-[48px] text-gray-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_confirm_password}
                      </label>
                      <input
                        type="password"
                        placeholder="********"
                        className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => router.push("/otp")}
                    className="w-full p-3 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
                  >
                    {t.auth_signup_button}
                  </button>

                  {/* Switch to Login */}
                  <p className="text-center text-gray-600">
                    {t.auth_have_account}{" "}
                    <span
                      className="text-[#23BAD8] font-semibold cursor-pointer"
                      onClick={toggleMode}
                    >
                      {t.auth_login_switch}
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;

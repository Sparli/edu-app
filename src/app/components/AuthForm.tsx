"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import authApi from "../utils/authApi";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import SplashScreen from "./SplashScreen";
import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import LanguageToggle from "./LanguageToggle";
import Dropdown from "@/app/components/dropdown";
import { AxiosError } from "axios";


const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const toggleMode = () => setIsLogin(!isLogin);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedGender, setSelectedGender] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Validation Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState("");
  const [loginApiError, setLoginApiError] = useState("");

  // Common
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup-only
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const genderOptions = [
    { label: t.auth_select_gender, value: "" },
    { label: t.auth_gender_male, value: "Male" },
    { label: t.auth_gender_female, value: "Female" },
    
  ];

  // API call
  const validateSignupFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = t.validation_first_name;
    if (!lastName.trim()) newErrors.lastName = t.validation_last_name;
    if (!email.trim()) newErrors.email = t.validation_email;
    if (!username.trim()) {
      newErrors.username = t.validation_username;
    } else if (/\s/.test(username)) {
      newErrors.username = t.validation_username_spaces;
    }
    if (!age.trim()) newErrors.age = t.validation_age;
    if (!selectedGender) newErrors.gender = t.validation_gender;
    if (!password.trim()) {
      newErrors.password = t.validation_password;
    } else {
      const regex = /^(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!regex.test(password)) {
        newErrors.password = t.validation_password_simple;
      }
    }

    if (!confirmPassword.trim())
      newErrors.confirmPassword = t.validation_confirm_password;
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = t.validation_password_mismatch;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignupFields()) return;

    setIsSigningUp(true);
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      username,
      password,
      confirm_password: confirmPassword,
      age: parseInt(age),
      gender: selectedGender,
      language: language,
    };
    try {
      const res = await authApi.post("/users/register/", payload);
      console.log("Signup response:", res);

      if (res.data.success) {
        localStorage.setItem("pendingEmail", email);
        router.push("/otp");
      } else {
        console.warn("Signup failed:", res.data.error);
        setApiError(
          res.data.error || "An unknown error occurred. Please try again."
        );
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      console.error("Signup exception:", axiosError);

      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Something went wrong during signup. Please try again.";
      setApiError(message);
    } finally {
      setIsSigningUp(false);
    }
  };

  // handle validation

  const validateLoginFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email.trim()) newErrors.email = t.validation_email;
    if (!password.trim()) newErrors.password = t.validation_password;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateLoginFields()) return;

    setIsLoggingIn(true);

    try {
      const res = await authApi.post("/users/login/", {
        email,
        password,
        language: language,
      });

      if (res.data.success) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setShowSplash(true);
      } else {
        setLoginApiError(res.data.error);
        // Backend provides specific messages
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setLoginApiError(err.response.data.error);
        // Show backend-provided error
      } else {
        setLoginApiError(t.auth_login_failed);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (showSplash) return <SplashScreen targetRoute="/dashboard" />;

  return (
    <>
      {/* Mobile Top Logo Bar */}
      <div className="lg:hidden w-[390px] mx-auto mt-4 px-6 py-5 flex justify-center bg-[#DAE9FF]  rounded-4xl  z-10">
        <div className="flex items-center space-x-2">
          <Image
            src="images/new-logo.svg"
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
          <div className="hidden lg:block absolute top-4 right-6">
          <LanguageDropdown />
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}

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
                {loginApiError && (
                  <p className="text-red-500 text-sm text-center mt-4">
                    {loginApiError}
                  </p>
                )}
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className={`w-full p-3 mt-8 mb-10 rounded-lg transition flex justify-center items-center ${
                    isLoggingIn
                      ? "bg-[#23BAD8]/70 cursor-not-allowed"
                      : "bg-[#23BAD8] hover:bg-cyan-600"
                  } text-white`}
                >
                  {isLoggingIn ? (
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
                  {isLoggingIn ? "Logging in..." : t.auth_login_button}
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
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_last_name}
                      </label>
                      <input
                        type="text"
                        placeholder="Smith"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm">
                          {errors.lastName}
                        </p>
                      )}
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">{errors.emai}</p>
                      )}
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-sm">
                          {errors.username}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-1 lg:text-lg text-md text-gray-700">
                        {t.auth_age}
                      </label>
                      <input
                        type="number"
                        placeholder="25"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                      />
                      {errors.age && (
                        <p className="text-red-500 text-sm">{errors.age}</p>
                      )}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col">
                    <label className="mb-1 lg:text-lg text-md text-gray-700">
                      {t.auth_gender}
                    </label>
                    <Dropdown
                      options={genderOptions}
                      selected={selectedGender}
                      onSelect={setSelectedGender}
                      placeholder={t.auth_select_gender}
                      className="w-full"
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-sm">{errors.gender}</p>
                    )}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password}
                        </p>
                      )}

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
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                  {apiError && (
                    <p className="text-red-500 text-sm text-center mt-2">
                      {apiError}
                    </p>
                  )}

                  {/* Button */}
                  <button
                    onClick={handleSignup}
                    disabled={isSigningUp}
                    className={`w-full p-3 rounded-lg transition flex justify-center cursor-pointer items-center ${
                      isSigningUp
                        ? "bg-[#23BAD8]/70 cursor-not-allowed"
                        : "bg-[#23BAD8] hover:bg-cyan-600"
                    } text-white`}
                  >
                    {isSigningUp ? (
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
                    {isSigningUp ? "Processing..." : t.auth_signup_button}
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

const LanguageDropdown = ({ mobile = false }: { mobile?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const options: { value: "en" | "fr"; label: string; img: string }[] = [
    { value: "en", label: "EN", img: "/icons/en.png" },
    { value: "fr", label: "FR", img: "/icons/fr.png" },
  ];

  const selected = options.find((o) => o.value === language) ?? options[0];

  return (
    <div ref={ref} className={`relative ${mobile ? "ml-1" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-t-[8px] border border-[#4A4A4A40]/75 bg-white px-2 py-1.5 hover:shadow transition"
      >
        <span className="inline-flex items-center justify-center rounded-full bg-white">
          <Image
            src={selected.img}
            alt={selected.label}
            width={20}
            height={20}
            className="rounded-full"
          />
        </span>
        <span className="text-black font-medium text-sm uppercase">
          {selected.label}
        </span>
        <svg
          className="w-3 h-3 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute w-[81px] rounded-b-xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden z-50">
          {options
            .filter((opt) => opt.value !== language)
            .map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setLanguage(opt.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 transition text-gray-800 text-sm"
              >
                <Image
                  src={opt.img}
                  alt={opt.label}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="underline">{opt.label}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
"use client";
import React, { useState } from "react";
import Image from "next/image";

import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import SplashScreen from "./SplashScreen";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const toggleMode = () => setIsLogin(!isLogin);

  const handleAction = () => {
    setShowSplash(true); // This splash will navigate to /dashboard
  };

  if (showSplash) return <SplashScreen targetRoute="/dashboard" />;

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

      {/* Main Content */}
      <div className="flex min-h-screen w-full">
        {/* Left Side for Desktop */}
        <div className="hidden md:flex w-[60%] relative">
          <Image
            src="/images/BG.svg"
            alt="Logo"
            fill
            className="object-cover w-full h-full"
          />
        </div>
        {/* Right Side Form */}
        <div className="flex-1 flex mt-28 justify-center bg-white">
          <div className="w-80 sm:w-96 space-y-6">
            {/* Toggle Tabs */}
            <div className="flex justify-around border-b border-gray-300 mb-4">
              <button
                className={`pb-2 text-lg font-semibold ${
                  isLogin
                    ? "bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent border-b-2 border-blue-500"
                    : "text-gray-200"
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                className={`pb-2 text-lg font-semibold ${
                  !isLogin
                    ? "bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent border-b-2 border-blue-500"
                    : "text-gray-200"
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>
            <h1 className=" text-xl font-bold my-12 text-gray-700 text-center justify-center flex space-x-2">
              <span>Hi There, Welcome</span>
              <Image src="/images/hand.png" alt="Wave" width={24} height={24} />
            </h1>

            {/* Forms */}
            {isLogin ? (
              <>
                {/* Email Field */}
                <div className="relative my-5">
                  <label className="block text-gray-800 font-medium mb-4">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full p-3 pl-12 rounded-lg bg-[#F6F6F6] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative my-5">
                  <label className="block text-gray-800 font-medium mb-4">
                    Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 text-lg transform -translate-y-1/2 text-[#23BAD8]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
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
                  Forgot Password?
                </div>
                <button
                  onClick={handleAction}
                  className="w-full p-3 bg-[#23BAD8] text-white rounded-lg mt-8 mb-10 hover:bg-cyan-600 transition"
                >
                  Login
                </button>
                <p className="text-center text-gray-600">
                  Don’t have an account?{" "}
                  <span
                    className="text-[#23BAD8] font-bold cursor-pointer"
                    onClick={toggleMode}
                  >
                    Sign Up
                  </span>
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="User Name"
                  className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />
                <select className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                  />
                  <span
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
                />

                <button
                  onClick={handleAction}
                  className="w-full p-3 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
                >
                  Sign Up
                </button>
                <p className="text-center text-gray-600">
                  Already have an account?{" "}
                  <span
                    className="text-[#23BAD8] font-semibold cursor-pointer"
                    onClick={toggleMode}
                  >
                    Login
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;

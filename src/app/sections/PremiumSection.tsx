"use client";
import React from "react";
import Image from "next/image";

const features = [
  {
    icon: "/images/content.svg",
    title: "Advanced Content Generation",
    description: "More detailed lessons & longer quizzes",
    bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
  },
  {
    icon: "/images/save.svg",
    title: "Save Progress and Notes",
    description: "Track what you've learned and keep notes",
    bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
  },
  {
    icon: "/images/access.svg",
    title: "Priority Access",
    description: "Faster results and early access to new tools",
    bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
  },
];

const PremiumSection = () => {
  return (
    <div className="w-full px-6 md:px-12 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-2xl lg:text-[33px] font-bold text-gray-900">
          Upgrade to EduAI Premium <span className="ml-1">🚀</span>
        </h1>

        <button className="mt-2 md:mt-0 flex items-center gap-2 px-4 py-2 bg-[#F0F8FB] text-[#3A3A3A] text-sm font-medium rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Sneak peek
        </button>
      </div>

      <p className="text-gray-600 mb-10 lg:text-[22px] text-base">
        Unlock extra features and smarter learning tools — coming soon!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:min-w-[600px] lg:min-h-[500px] mb-10">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-6 ${feature.bg} text-center  `}
          >
            <div className=" flex  items-center justify-center">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={250}
                height={250}
              />
            </div>
            <h3 className="font-bold text-gray-800  lg:text-2xl text-xl">
              {feature.title}
            </h3>
            <p className="text-gray-500 text-lg lg:text-xl  mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="bg-gradient-to-r from-[#FFCF55] to-[#F0B82C] text-gray-800 lg:text-2xl text-lg font-semibold lg:py-6 lg:px-20 py-4 px-20 rounded-lg shadow-lg hover:opacity-90 transition">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};

export default PremiumSection;

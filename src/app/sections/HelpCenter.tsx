"use client";
import React from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";

const features = [
  {
    icon: "/images/pay.svg",
    title: "Payment",
    description: "Create AI-powered lessons and quizzes",
    bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
  },
  {
    icon: "/images/veri.svg",
    title: "Verification",
    description: "View your previously generated lessons & quizzes",
    bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
  },
  {
    icon: "/images/prod.svg",
    title: "Product Guideline",
    description: "Help us improve by rating your generated content",
    bg: "lg:bg-[#F7F9FC] bg-[#AB79FF1A]",
  },
];

const HelpCenter = () => {
  return (
    <div className="w-full px-6 md:px-12 py-10">
      <div className=" mb-14">
        <h1 className="text-2xl lg:text-[33px] font-bold text-gray-900">
          Help Centre!
        </h1>
        <p className="text-xl text-gray-500">
          How can we help you? Choose the kind of help you need.
        </p>
      </div>

      <div className="relative w-full mb-10">
        <FiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Ask a question..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-[#F5F5F5] text-gray-700"
        />
      </div>

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
    </div>
  );
};

export default HelpCenter;

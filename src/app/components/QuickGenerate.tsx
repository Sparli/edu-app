"use client";
import React from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useRouter } from "next/navigation";

const QuickGenerate = () => {
  const router = useRouter();
  return (
    <div className="lg:bg-[#F7F9FC] bg-[#AB79FF1A] rounded-2xl p-6 mt-8 min-h-[195.75px] ">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Quick Generate</h2>

      <div className="flex flex-col lg:flex-row items-center justify-around content-center gap-10">
        {/* Select Subject */}
        <div className="relative w-full">
          <select className="w-full p-3 pr-10 rounded-xl border-1 border-gray-200 bg-white text-gray-600 focus:outline-none appearance-none">
            <option>Select Subject</option>
            <option>English</option>
            <option>Math</option>
            <option>Science</option>
          </select>
          <IoMdArrowDropright className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Select Level */}
        <div className="relative w-full">
          <select className="w-full p-3 pr-10 rounded-xl border-1 border-gray-200 bg-white text-gray-600 focus:outline-none appearance-none">
            <option>Select Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <IoMdArrowDropright className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Enter Topic */}
        <input
          type="text"
          placeholder="Enter Topic"
          className="w-full  p-3 rounded-xl border-1 border-gray-200 bg-white text-gray-600 focus:outline-none"
        />

        {/* Generate Button */}
        <button
          onClick={() => router.push("/generate")}
          className="px-8 py-3  bg-[#23BAD8] text-white font-semibold rounded-lg shadow hover:bg-cyan-600 transition whitespace-nowrap"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default QuickGenerate;

"use client";

import { useState } from "react";
import type { GeneratedContent as IContent } from "@/app/types/content";
import { ExternalLink } from "lucide-react"; // optional, or use your own icon set

interface Props {
  content: IContent;
}

const tabs = ["Lesson", "Quiz", "Reflection"];

export default function GeneratedContent({ content }: Props) {
  const [activeTab, setActiveTab] = useState("Lesson");

  const getContent = () => {
    switch (activeTab) {
      case "Lesson":
        return content.lesson;
      case "Quiz":
        return content.quiz;
      case "Reflection":
        return content.reflection;
      default:
        return "";
    }
  };

  return (
    <div className="bg-[#F7F9FC] p-4 rounded-xl shadow-md w-full max-w-xl animate-fade-in">
      {/* Tabs */}
      <div className="flex gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl border-2 font-medium transition-all ${
              activeTab === tab
                ? "bg-white border-cyan-400 text-black shadow-sm"
                : "bg-white border-transparent text-gray-500"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full"></span>
              {tab}
            </div>
          </button>
        ))}
      </div>

      {/* Content Box */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-md font-semibold mb-2 text-gray-800">
          Introduction to {activeTab}
        </h2>
        <p className="text-gray-600 whitespace-pre-line">{getContent()}</p>

        <hr className="my-4" />

        <div className="flex items-center justify-between">
          {/* Link Icon (example only) */}
          <button className="text-gray-500 hover:text-gray-700 transition">
            <ExternalLink size={18} />
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="bg-green-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-green-600 transition">
              Save
            </button>
            <button className="bg-gray-400 text-white px-4 py-1.5 rounded-md font-medium hover:bg-gray-500 transition">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

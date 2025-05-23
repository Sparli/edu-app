"use client";

import { useState } from "react";
import type { GeneratedContent as IContent } from "@/app/types/content";
import { ExternalLink } from "lucide-react";
import LessonModal from "@/app/components/modals/LessonModal";
import QuizModal from "@/app/components/modals/QuizModal";
import type { Subject, Level } from "@/app/types/content";

interface Props {
  content: IContent;
  meta: {
    topic: string;
    subject: Subject;
    level: Level;
  };
}
const tabs = ["Lesson", "Quiz", "Reflection"];

export default function GeneratedContent({ content, meta }: Props) {
  const [activeTab, setActiveTab] = useState("Lesson");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-[#F7F9FC] p-4 rounded-xl shadow-md w-full max-w-3xl animate-fade-in">
      {/* Tabs */}
      {/* Mobile-style tab switcher */}
      <div className="flex justify-around border-b border-gray-200 mb-4 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Desktop tab boxes - hidden on small screens */}
      <div className="hidden md:flex gap-4 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl border-2 font-medium h-28 w-[110px] transition-all ${
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
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-80 flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === "Lesson" && (
            <>
              <h2 className="text-md font-semibold mb-2 text-gray-800">
                Introduction to Lesson
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {content.lesson}
              </p>
            </>
          )}

          {activeTab === "Quiz" && (
            <>
              <h2 className="text-md font-semibold mb-2 text-gray-800">Quiz</h2>
              <p className="text-gray-600 mb-2">Q: 1/4</p>
              <p className="text-gray-700 mb-4">{content.quiz}</p>
              <div className="flex gap-3 mb-2">
                <button
                  className={`px-4 py-1 rounded font-medium ${
                    quizAnswer === "Yes"
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setQuizAnswer("Yes")}
                >
                  Yes
                </button>
                <button
                  className={`px-4 py-1 rounded font-medium ${
                    quizAnswer === "No"
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setQuizAnswer("No")}
                >
                  No
                </button>
              </div>
            </>
          )}

          {activeTab === "Reflection" && (
            <>
              <h2 className="text-md font-semibold mb-2 text-gray-800">
                Reflection Question
              </h2>
              <p className="text-gray-700 mb-3">{content.reflection}</p>
              <textarea
                className="w-full h-20 p-2 border border-gray-300 rounded-md outline-none resize-none text-sm"
                placeholder="Write here answer..."
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div>
          <hr className="my-3 text-[#E2E2E2]" />
          <div className="flex items-center justify-between">
            {(activeTab === "Lesson" || activeTab === "Quiz") && (
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowModal(true)}
              >
                <ExternalLink size={18} />
              </button>
            )}

            {/* Action Buttons by Tab */}
            {activeTab === "Lesson" && (
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-green-600 transition">
                  Save
                </button>
                <button className="bg-gray-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-gray-600 transition">
                  Try Again
                </button>
              </div>
            )}

            {activeTab === "Quiz" && (
              <button className="bg-cyan-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-cyan-600 transition">
                Next
              </button>
            )}

            {activeTab === "Reflection" && (
              <div className="w-full flex justify-end mt-4">
                <button className="bg-cyan-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-cyan-600 transition">
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Conditional Modals */}
      {showModal && activeTab === "Lesson" && (
        <LessonModal
          content={content}
          topic={meta.topic}
          subject={meta.subject}
          level={meta.level}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && activeTab === "Quiz" && (
        <QuizModal content={content} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

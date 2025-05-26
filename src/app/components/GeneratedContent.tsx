"use client";

import { useState } from "react";
import type { GeneratedContent as IContent } from "@/app/types/content";
import { ExternalLink } from "lucide-react";
import LessonModal from "@/app/components/modals/LessonModal";
import QuizModal from "@/app/components/modals/QuizModal";
import type { Subject, Level } from "@/app/types/content";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import Image from "next/image";

interface Props {
  content: IContent;
  meta: {
    topic: string;
    subject: Subject;
    level: Level;
  };
}

// ✅ STEP 1: Use static tab keys internally
const tabKeys = ["lesson", "quiz", "reflection"] as const;
type TabKey = (typeof tabKeys)[number];

export default function GeneratedContent({ content, meta }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("lesson");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { language } = useLanguage();
  const t = translations[language];

  // ✅ STEP 2: Create a tab label map from translations
  const tabLabels: Record<TabKey, string> = {
    lesson: t.tab_lesson,
    quiz: t.tab_quiz,
    reflection: t.tab_reflection,
  };

  return (
    <div className="bg-[#F7F9FC] p-4 rounded-xl shadow-md w-full max-w-3xl animate-fade-in">
      {/* ✅ Mobile-style tab switcher */}
      <div className="flex justify-around border-b border-gray-200 mb-4 md:hidden">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* ✅ Desktop tab boxes */}
      <div className="hidden md:flex gap-4 mb-4">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl border-2 font-medium h-28 w-[110px] transition-all ${
              activeTab === tab
                ? "bg-white border-cyan-400 text-black shadow-sm"
                : "bg-white border-transparent text-gray-500"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src={`images/quiz.svg`}
                alt={`${tab} icon`}
                width={54}
                height={54}
                className=""
              />
              {tabLabels[tab]}
            </div>
          </button>
        ))}
      </div>

      {/* Content Box */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-120 flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === "lesson" && (
            <>
              <h2 className="text-md font-semibold mb-2 text-gray-800">
                {t.section_intro}
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {content.lesson}
              </p>
            </>
          )}

          {activeTab === "quiz" && (
            <>
              <h2 className="text-md font-semibold mb-2 text-gray-800">
                {t.section_quiz}
              </h2>
              <p className="text-gray-600 mb-2">{t.quiz_progress}</p>
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
                  {t.quiz_yes}
                </button>
                <button
                  className={`px-4 py-1 rounded font-medium ${
                    quizAnswer === "No"
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setQuizAnswer("No")}
                >
                  {t.quiz_no}
                </button>
              </div>
            </>
          )}

          {activeTab === "reflection" && (
            <>
              <h2 className="text-md font-semibold mb-2 text-gray-800">
                {t.section_reflection}
              </h2>
              <p className="text-gray-700 mb-3">{content.reflection}</p>
              <textarea
                className="w-full h-20 p-2 border border-gray-300 rounded-md outline-none resize-none text-sm"
                placeholder={t.placeholder_reflection}
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
            {(activeTab === "lesson" || activeTab === "quiz") && (
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setShowModal(true)}
              >
                <ExternalLink size={18} />
              </button>
            )}

            {activeTab === "lesson" && (
              <div className="flex gap-2">
                <button className="bg-green-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-green-600 transition">
                  {t.btn_save}
                </button>
                <button className="bg-gray-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-gray-600 transition">
                  {t.btn_try_again}
                </button>
              </div>
            )}

            {activeTab === "quiz" && (
              <button className="bg-cyan-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-cyan-600 transition">
                {t.btn_next}
              </button>
            )}

            {activeTab === "reflection" && (
              <div className="w-full flex justify-end mt-4">
                <button className="bg-cyan-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-cyan-600 transition">
                  {t.btn_submit}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && activeTab === "lesson" && (
        <LessonModal
          content={content}
          topic={meta.topic}
          subject={meta.subject}
          level={meta.level}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && activeTab === "quiz" && (
        <QuizModal content={content} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";
import LessonModal from "@/app/components/modals/LessonModal";
import QuizModal from "@/app/components/modals/QuizModal";
import type { Subject, Level } from "@/app/types/content";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import Image from "next/image";
import MathText from "./MathText";
import { submitReflection } from "../api/reflectionApi";
import { saveContent } from "../api/saveContentApi";

interface Props {
  content: {
    lesson: Record<string, string | string[]>;
    quiz: {
      mcqs?: {
        statement: string;
        options: string[];
      }[];
      tf?: {
        statement: string;
        correct_answer: boolean;
      }[];
    };
    reflection: string;
  };
  meta: {
    topic: string;
    subject: Subject;
    level: Level;
  };
  error?: string | null;
}

// ✅ STEP 1: Use static tab keys internally
const tabKeys = ["lesson", "quiz", "reflection"] as const;
type TabKey = (typeof tabKeys)[number];

export default function GeneratedContent({ content, meta, error }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("lesson");
  const [reflectionText, setReflectionText] = useState("");
  const [showModal, setShowModal] = useState(false);

  // States for save btn

  const [hasSaved, setHasSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Function for save btn

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveContent({ rating: null, feedback: null });
      setHasSaved(true);
      if (res.success) {
        sessionStorage.setItem("save_flag", "true");
        window.dispatchEvent(new Event("save-status-updated"));
      } else {
        setSaveError(res.error);
      }
    } catch {
      setSaveError("Unexpected error while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  // States for reflection
  const [reflectionFeedback, setReflectionFeedback] = useState<string | null>(
    null
  );
  const [reflectionError, setReflectionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const feedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reflectionFeedback && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [reflectionFeedback]);

  useEffect(() => {
    if (reflectionFeedback && feedbackRef.current && window.innerWidth < 768) {
      feedbackRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [reflectionFeedback]);

  // Function for reflection

  const handleReflectionSubmit = async () => {
    if (!reflectionText.trim()) return;

    setIsSubmitting(true);
    setReflectionError(null);

    try {
      const res = await submitReflection({
        user_answer: reflectionText.trim(),
        language,
      });

      if (res.success) {
        setReflectionFeedback(res.feedback);
        setHasSubmitted(true);

        // Save to sessionStorage
        sessionStorage.setItem("reflection_text", reflectionText.trim());
        sessionStorage.setItem("reflection_feedback", res.feedback);
        sessionStorage.setItem("reflection_submitted", "true");

        // ✅ Fix: Set correct save flag and notify
        sessionStorage.setItem("save_flag", "true");
        window.dispatchEvent(new Event("save-status-updated"));

        await saveContent({ rating: null, feedback: null });
      } else {
        const errMsg =
          typeof res.error === "string"
            ? res.error
            : Object.values(res.error).flat().join(" ");
        setReflectionError(errMsg);
      }
    } catch {
      setReflectionError("Unexpected error while submitting reflection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { language } = useLanguage();
  const t = translations[language];

  // ✅ STEP 2: Create a tab label map from translations
  const tabLabels: Record<TabKey, string> = {
    lesson: t.tab_lesson,
    quiz: t.tab_quiz,
    reflection: t.tab_reflection,
  };

  // for saving reflection in session

  useEffect(() => {
    const savedText = sessionStorage.getItem("reflection_text");
    const savedFeedback = sessionStorage.getItem("reflection_feedback");
    const savedSubmitted = sessionStorage.getItem("reflection_submitted");
    const saveFlag = sessionStorage.getItem("save_flag");

    if (savedText) setReflectionText(savedText);
    if (savedFeedback) setReflectionFeedback(savedFeedback);
    if (savedSubmitted === "true") setHasSubmitted(true);
    if (saveFlag === "true") setHasSaved(true);

    const handleSaveUpdate = () => {
      const flag = sessionStorage.getItem("save_flag");
      if (flag === "true") setHasSaved(true);
    };

    window.addEventListener("save-status-updated", handleSaveUpdate);

    return () => {
      window.removeEventListener("save-status-updated", handleSaveUpdate);
    };
  }, []);

  return (
    <div className="bg-[#F7F9FC] p-4 rounded-xl shadow-md w-full max-w-4xl h-full animate-fade-in">
      {/* ✅ Mobile-style tab switcher */}
      <div className="flex justify-around border-b border-gray-200 mb-4 md:hidden">
        {tabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-semibold transition  ${
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
            className={`rounded-xl border-2 font-medium h-28 w-[110px] transition-all cursor-pointer ${
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
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm h-130 lg:w-[800px] flex flex-col justify-between">
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto pr-1">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          {!error && activeTab === "lesson" && content.lesson && (
            <div
              className="space-y-6 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              {Object.entries(content.lesson).map(
                ([sectionKey, sectionContent]) => (
                  <div key={sectionKey}>
                    <h2 className="text-lg font-semibold capitalize text-[#1F2937] mb-1">
                      {sectionKey.replace(/_/g, " ")}
                    </h2>

                    {Array.isArray(sectionContent) ? (
                      <ul className="list-disc pl-5 text-[#4B5563] text-base space-y-1">
                        {sectionContent.map((item, idx) => (
                          <li key={idx}>
                            <MathText content={item} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[#4B5563] text-lg whitespace-pre-line">
                        <MathText content={sectionContent} />
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {!error && activeTab === "quiz" && content.quiz && (
            <div
              className="space-y-6 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              {/* MCQ Section Preview (just one) */}
              {Array.isArray(content.quiz?.mcqs) &&
                content.quiz.mcqs.length > 0 && (
                  <div>
                    <h3 className="lg:text-xl font-semibold text-[#1F2937] mb-2">
                      {t.quiz_section_mcq}
                    </h3>
                    <div className="mb-4">
                      <p className="text-[#4B5563] font-medium lg:text-lg flex items-start gap-1">
                        <span>1.</span>
                        <MathText content={content.quiz.mcqs[0].statement} />
                      </p>
                      <ul className="list-disc pl-6 text-base text-[#4B5563]">
                        {content.quiz.mcqs[0].options.map((opt, optIdx) => (
                          <li key={optIdx}>
                            <MathText content={opt} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

              {/* True/False Section Preview (just one) */}
            </div>
          )}

          {!error && activeTab === "reflection" && (
            <>
              <h2 className="text-lg font-medium mb-2 text-[#1F2937]">
                {t.section_reflection}
              </h2>

              {/* Static instruction */}
              <p className="text-[#4B5563] mr-6 font-normal text-lg mb-4">
                {content.reflection}
              </p>

              {/* User input area */}
              <textarea
                className="w-full h-30 p-2 border border-gray-300 bg-[#FFFFFF] rounded-xl outline-none resize-none text-[15px]"
                placeholder={t.placeholder_reflection}
                value={reflectionText}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setReflectionText(e.target.value);
                  }
                }}
              />
              <p className="text-right text-sm text-gray-500 mt-1 mb-3">
                {reflectionText.length}/500
              </p>

              {reflectionFeedback && (
                <div
                  ref={feedbackRef}
                  className="mt-4 text-green-700 bg-green-100 border border-green-400 rounded-md p-2"
                >
                  <strong>{t.label_feedback ?? "Feedback"}:</strong>{" "}
                  {reflectionFeedback}
                </div>
              )}

              {reflectionError && (
                <div className="mt-4 text-red-700 bg-red-100 border border-red-400 rounded-md p-2">
                  {reflectionError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div>
          <hr className="my-3 text-[#E2E2E2]" />
          <div className="flex items-center justify-between">
            {(activeTab === "lesson" || activeTab === "quiz") && (
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition"
                onClick={() => {
                  if (!error && Object.keys(content.lesson || {}).length > 0) {
                    setShowModal(true);
                  }
                }}
              >
                <ExternalLink size={18} />
              </button>
            )}

            {activeTab === "lesson" && (
              <div className="flex gap-2">
                {saveError && (
                  <p className="text-red-600 text-sm mt-2">{saveError}</p>
                )}
                <button
                  className="bg-green-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-green-600 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSaveAll}
                  disabled={
                    !!error ||
                    hasSaved ||
                    isSaving ||
                    Object.keys(content.lesson || {}).length === 0
                  }
                >
                  {hasSaved
                    ? t.btn_saved ?? "Saved"
                    : isSaving
                    ? t.btn_saving ?? "Saving..."
                    : t.btn_save}
                </button>

                <button
                  className="bg-cyan-500 text-white px-4 py-1.5 rounded-md font-medium cursor-pointer hover:bg-cyan-600 transition"
                  onClick={() => setActiveTab("quiz")}
                >
                  {t.btn_next ?? "Next"}
                </button>
              </div>
            )}

            {activeTab === "quiz" && (
              <button
                className="bg-cyan-500 text-white px-4 py-1.5 rounded-md cursor-pointer font-medium hover:bg-cyan-600 transition"
                onClick={() => setActiveTab("reflection")}
              >
                {t.btn_next ?? "Next"}
              </button>
            )}

            {activeTab === "reflection" && (
              <div className="w-full flex justify-end mt-4">
                <button
                  className="bg-cyan-500 text-white px-4 py-1.5 rounded-md font-medium hover:bg-cyan-600 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleReflectionSubmit}
                  disabled={
                    !!error ||
                    isSubmitting ||
                    hasSubmitted ||
                    Object.keys(content.lesson || {}).length === 0
                  }
                >
                  {isSubmitting
                    ? t.btn_submitting
                    : hasSubmitted
                    ? t.btn_submitted
                    : t.btn_submit}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {!error && showModal && activeTab === "lesson" && (
        <LessonModal
          content={content}
          topic={meta.topic}
          subject={meta.subject}
          level={meta.level}
          generatedAt={new Date()} // <-- ADD THIS
          onClose={() => setShowModal(false)}
        />
      )}

      {!error && showModal && activeTab === "quiz" && (
        <QuizModal
          content={content}
          topic={meta.topic}
          subject={meta.subject}
          level={meta.level}
          generatedAt={new Date()} // <-- ADD THIS
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

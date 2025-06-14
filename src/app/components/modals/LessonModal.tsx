"use client";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import type { Level, Subject } from "@/app/types/content";
import { useRouter } from "next/navigation";
import { saveContent } from "@/app/api/saveContentApi";
import { FiEdit, FiDownload, FiCopy, FiX } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import MathText from "@/app/components/MathText";

interface Props {
  content: {
    lesson: Record<string, string | string[]>;
    quiz: {
      mcqs?: { statement: string; options: string[] }[];
      tf?: { statement: string; correct_answer: boolean }[];
    };
    reflection: string;
    valid_topic?: string; // <-- ADD THIS
  };
  topic: string;
  subject: Subject;
  level: Level;
  generatedAt: Date;
  onClose: () => void;
}

export default function LessonModal({
  content,
  topic,
  subject,
  level,
  generatedAt,
  onClose,
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const modalRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const savedRating = sessionStorage.getItem("lesson_rating");
    const savedFeedback = sessionStorage.getItem("lesson_feedback");
    const feedbackFlag = sessionStorage.getItem("lesson_feedback_submitted");

    if (savedRating) setRating(Number(savedRating));
    if (savedFeedback) setFeedback(savedFeedback);

    // ✅ Also restore feedback submit state
    if (feedbackFlag === "true") setHasSubmittedFeedback(true);
  }, []);

  const handleDownload = async () => {
    setDownloading(true); // must declare: const [downloading, setDownloading] = useState(false);
    try {
      const pdfContent = document.createElement("div");
      pdfContent.style.padding = "20px";
      pdfContent.style.fontFamily = "Arial, sans-serif";
      pdfContent.style.color = "#111";

      const title = `<h1>${topic}</h1>`;
      const meta = `<p><strong>${subject}</strong> - ${level} <br/> ${generatedAt.toLocaleDateString()}</p>`;

      const lessonHtml = Object.entries(content.lesson)
        .map(([sectionKey, sectionContent]) => {
          const heading = `<h2>${sectionKey.replace(/_/g, " ")}</h2>`;
          const body = Array.isArray(sectionContent)
            ? `<ul>${sectionContent
                .map((item) => `<li>${item}</li>`)
                .join("")}</ul>`
            : `<p>${sectionContent}</p>`;
          return `${heading}${body}`;
        })
        .join("<hr/>");

      pdfContent.innerHTML = `${title}${meta}<hr/>${lessonHtml}`;

      const html2pdf = (await import("html2pdf.js")).default;

      await html2pdf()
        .from(pdfContent)
        .set({
          margin: 0.5,
          filename: `${topic.replace(/\s+/g, "_")}_lesson.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: {
            unit: "in",
            format: "letter",
            orientation: "portrait",
          },
        })
        .save();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <FiX size={24} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-10">
          <div className="mt-10">
            <h1 className="text-3xl font-bold text-gray-900">
              {content.valid_topic}
            </h1>

            <p className="text-gray-500 mt-2">
              {subject} - {level}
            </p>
            <p className="text-gray-400 text-sm">
              {t.modal_generated_on}{" "}
              {generatedAt.toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-6 text-gray-600 mt-10 text-sm flex-wrap">
            <button
              className="flex items-center gap-1 hover:text-black"
              onClick={() => {
                const params = new URLSearchParams({
                  language: language === "en" ? "English" : "French",
                  level,
                  subject,
                  difficulty: "Beginner", // adjust if needed
                  topic,
                });
                onClose();
                setTimeout(() => {
                  router.replace(`/generate?${params.toString()}`);
                }, 50); // slight delay to ensure modal unmount before navigation
              }}
            >
              <FiEdit />
              {t.modal_edit}
            </button>

            <button
              className="flex items-center gap-1 hover:text-black"
              onClick={handleDownload}
            >
              <FiDownload />
              {downloading ? "Downloading..." : t.modal_download}
            </button>
          </div>
        </div>

        <hr className="mb-10 text-[#E2E2E2]" />

        {/* PDF Content */}
        <div ref={pdfRef}>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 lg:max-w-[90%] text-gray-700 leading-relaxed space-y-6 text-[15px]">
              <div className="space-y-6">
                {Object.entries(content.lesson).map(
                  ([sectionKey, sectionContent]) => (
                    <div key={sectionKey}>
                      <h2 className="lg:text-2xl text-xl font-semibold capitalize text-[#1F2937] mb-1">
                        {sectionKey.replace(/_/g, " ")}
                      </h2>
                      {Array.isArray(sectionContent) ? (
                        <ul className="list-disc pl-5 text-[#4B5563] text-base lg:text-lg space-y-1">
                          {sectionContent.map((item, idx) => (
                            <li key={idx}>
                              <MathText content={item} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-[#4B5563] text-base lg:text-lg whitespace-pre-line">
                          <MathText content={sectionContent as string} />
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-start items-start gap-4 text-gray-600 text-sm pt-1 min-w-[80px]">
              <button
                className="flex items-center gap-1 hover:text-black"
                onClick={(e) => {
                  e.preventDefault();
                  const text = Object.entries(content.lesson)
                    .map(([key, val]) => {
                      const title = key.replace(/_/g, " ").toUpperCase();
                      const body = Array.isArray(val) ? val.join("\n") : val;
                      return `${title}\n${body}`;
                    })
                    .join("\n\n");

                  // Fallback for older mobile browsers
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    });
                  } else {
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textarea);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }
                }}
              >
                <FiCopy size={16} /> {copied ? "Copied!" : t.modal_copy}
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-6 rounded-2xl w-full mt-12">
            <h4 className="font-semibold text-lg mb-4">
              {t.modal_feedback_title}
            </h4>
            <div className="flex justify-start mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl cursor-pointer ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 150) setFeedback(val);
              }}
              maxLength={150}
              placeholder={t.modal_feedback_placeholder}
              className="w-full p-4 bg-[#F6F6F6] rounded-md text-gray-600 resize-none mb-2"
              rows={4}
            />
            <p className="text-right text-sm text-gray-500 mb-4">
              {feedback.length}/150
            </p>

            <button
              onClick={async () => {
                if (hasSubmittedFeedback) return;
                setSaveMessage(null);
                setSaveError(null);
                try {
                  const res = await saveContent({ rating, feedback });
                  if (res.success) {
                    setSaveMessage(t.lesson_saved_successfully);
                    sessionStorage.setItem("lesson_rating", rating.toString());
                    sessionStorage.setItem("lesson_feedback", feedback);
                    sessionStorage.setItem("lesson_feedback_submitted", "true");
                    sessionStorage.setItem("save_flag", "true");
                    window.dispatchEvent(new Event("save-status-updated"));
                    setHasSubmittedFeedback(true);
                  } else {
                    setSaveError(res.error);
                  }
                } catch {
                  setSaveError("Unexpected error while saving feedback.");
                }
              }}
              disabled={hasSubmittedFeedback}
              className={`px-7 py-2 rounded-lg transition float-right ${
                hasSubmittedFeedback
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
            >
              {hasSubmittedFeedback ? "Submitted" : t.modal_feedback_submit}
            </button>

            {saveMessage && (
              <p className="text-green-600 text-sm mt-3">{saveMessage}</p>
            )}
            {saveError && (
              <p className="text-red-600 text-sm mt-3">{saveError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

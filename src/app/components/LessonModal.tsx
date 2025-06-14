"use client";

import { useEffect, useState, useRef } from "react";
import authApi from "../utils/authApi";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import MathText from "@/app/components/MathText";
import { FiDownload } from "react-icons/fi";

interface Props {
  lessonId: number;
  onClose: () => void;
}

interface LessonData {
  id: number;
  topic: string;
  subject: string;
  level: string;
  difficulty: string;
  generation_datetime: string;
  lesson?: Record<string, string | string[]>;
}

export default function LessonModal({ lessonId, onClose }: Props) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const [downloading, setDownloading] = useState(false);
  // const pdfRef = useRef<HTMLDivElement>(null);

  // PDF download

  const handleDownload = async () => {
    if (!lessonData?.lesson) return;
    setDownloading(true);
    try {
      const pdfContent = document.createElement("div");
      pdfContent.style.padding = "20px";
      pdfContent.style.fontFamily = "Arial, sans-serif";
      pdfContent.style.color = "#111";

      const title = `<h1>${lessonData.topic}</h1>`;
      const meta = `<p><strong>${lessonData.subject}</strong> - ${
        lessonData.level
      } <br/> ${new Date(
        lessonData.generation_datetime
      ).toLocaleDateString()}</p>`;

      const lessonHtml = Object.entries(lessonData.lesson)
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
          filename: `${lessonData.topic.replace(/\s+/g, "_")}_lesson.pdf`,
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await authApi.get(`/history/details/lesson/${lessonId}/`);
        setLessonData(res.data.response);
      } catch (err) {
        console.error("[LessonModal] ❌ Failed to fetch lesson", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
        <div className="bg-white p-6 rounded shadow-lg">Loading...</div>
      </div>
    );
  }

  if (!lessonData) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div
        className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition text-2xl"
          aria-label={t.lesson_modal.close}
        >
          &times;
        </button>

        <div className="flex justify-between items-start mb-8">
          {/* LEFT: Title + Meta */}
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {lessonData.topic
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>

            <div className="text-lg text-gray-600">
              <p>
                <strong>{t.lesson_modal.subject}:</strong>{" "}
                {t.subjects[lessonData.subject as keyof typeof t.subjects]}
              </p>
              <p>
                <strong>{t.lesson_modal.level}:</strong>{" "}
                {t.levels[lessonData.level as keyof typeof t.levels]}
              </p>
              <p>
                <strong>{t.lesson_modal.generated_on}:</strong>{" "}
                {new Date(lessonData.generation_datetime).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* RIGHT: Download */}
          <div>
            <button
              className="flex items-center gap-1 hover:text-black mt-23.5"
              onClick={handleDownload}
            >
              <FiDownload />
              {downloading ? "Downloading..." : t.modal_download}
            </button>
          </div>
        </div>

        <hr className="mb-6 text-[#E2E2E2]" />

        {/* Content */}
        <div className="prose max-w-none text-gray-800">
          {lessonData.lesson && Object.entries(lessonData.lesson).length > 0 ? (
            Object.entries(lessonData.lesson).map(([key, value]) => (
              <div key={key} className="mb-6">
                <h3 className="capitalize font-semibold text-2xl mb-2">
                  {key.replace(/_/g, " ")}
                </h3>

                {Array.isArray(value) ? (
                  <ul className="list-disc pl-5 text-lg space-y-1">
                    {value.map((item, idx) => (
                      <li key={idx}>
                        <MathText content={item} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-lg">
                    <MathText content={value} />
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">{t.lesson_modal.no_content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

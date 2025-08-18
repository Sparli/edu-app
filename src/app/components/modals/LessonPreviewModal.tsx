"use client";

import { useEffect, useState, useRef } from "react";
import authApi from "../../utils/authApi";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import MathText from "@/app/components/MathText";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { useProfile } from "@/app/context/ProfileContext";
import UpgradeModal from "../GlobalPopup/UpgradeModal"; // adjust path if needed
import { useRouter } from "next/navigation";
import ContentSpinner from "@/app/sections/ContentSpinner";

interface Props {
  lessonId: number;
  onClose: () => void;
}

interface LessonData {
  id: number;
  topic: string;
  subject: string; // English key or label
  level: string; // "Primary" | "Secondary" (key)
  difficulty: string;
  generation_datetime: string;
  language?: "English" | "French"; // 🔹 use content language if API returns it
  lesson?: { heading: string; content: string }[];
}

export default function LessonModal({ lessonId, onClose }: Props) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);

  const { language } = useLanguage();
  const t = translations[language];
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) &&
        upgradeRef.current &&
        !upgradeRef.current.contains(target)
      ) {
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
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <ContentSpinner />
      </div>
    );
  }

  if (!lessonData) return null;

  const contentLangCode = lessonData.language === "French" ? "fr" : "en";
  const tContent = translations[contentLangCode];

  // Safe fallbacks in case backend returns display labels instead of keys
  const subjectLabel =
    tContent.subjects[lessonData.subject as keyof typeof tContent.subjects] ??
    lessonData.subject;

  const levelLabel =
    tContent.levels[lessonData.level as keyof typeof tContent.levels] ??
    lessonData.level;

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div
        className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative"
        ref={modalRef}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-900 transition text-2xl"
          aria-label={t.lesson_modal.close}
        >
          &times;
        </button>

        <div className="flex justify-between items-start mb-8">
          {/* LEFT: Title + Meta */}
          <div>
            <h2 className="lg:text-2xl text-xl font-bold mb-2">
              {lessonData.topic
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h2>

            <div className="lg:text-lg text-gray-600">
              <p>
                <strong>{tContent.lesson_modal.subject}:</strong> {subjectLabel}
              </p>
              <p>
                <strong>{tContent.lesson_modal.level}:</strong> {levelLabel}
              </p>
              <p>
                <strong>{tContent.lesson_modal.generated_on}:</strong>{" "}
                {new Date(lessonData.generation_datetime).toLocaleDateString(
                  contentLangCode,
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </p>
            </div>
          </div>

          {/* RIGHT: Download */}
          <div>
            <button
              className="flex items-center gap-1 hover:text-black cursor-pointer mt-44 lg:mt-23.5 disabled:opacity-50"
              onClick={async () => {
                if (!isSubscribed) {
                  setShowUpgradeModal(true);
                  return;
                }

                setDownloading(true);
                setDownloadError(null);
                try {
                  const res = await authApi.get("/history/download-pdf/", {
                    params: { type: "lesson", id: lessonId },
                  });

                  const { success, pdf_url } = res.data;
                  if (success && pdf_url) {
                    window.open(pdf_url, "_blank");
                  } else {
                    setDownloadError("PDF not ready. Please try again.");
                  }
                } catch (err: unknown) {
                  if (axios.isAxiosError(err) && err.response) {
                    const status = err.response.status;
                    const isFr = language === "fr";

                    if (status === 404) {
                      setDownloadError(
                        isFr
                          ? "Leçon introuvable."
                          : "Couldn’t find that lesson."
                      );
                    } else if (status === 500) {
                      setDownloadError(
                        isFr
                          ? "Erreur lors de la génération du PDF. Veuillez réessayer."
                          : "Error generating PDF. Please try again."
                      );
                    } else if (status === 401) {
                      setDownloadError(
                        isFr
                          ? "Session expirée. Veuillez vous reconnecter."
                          : "Session expired. Please log in again."
                      );
                    } else {
                      setDownloadError(
                        isFr
                          ? "Impossible de télécharger le PDF. Veuillez réessayer plus tard."
                          : "Could not download PDF. Try again later."
                      );
                    }
                  } else {
                    setDownloadError("An unexpected error occurred.");
                  }
                  console.error("[LessonModal] ❌ PDF Download failed", err);
                } finally {
                  setDownloading(false);
                }
              }}
              disabled={downloading}
            >
              <div className="text-sm flex gap-2">
                <FiDownload className="mt-0.5 text-lg" />
                {downloading ? "Downloading..." : t.modal_download}
              </div>
            </button>

            {/* Error Message */}
            {downloadError && (
              <p className="text-sm text-red-600 mt-2">{downloadError}</p>
            )}
          </div>
        </div>

        <hr className="mb-6 text-[#E2E2E2]" />

        {/* Content */}
        <div className="prose max-w-none text-gray-800">
          {lessonData.lesson?.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="capitalize font-medium text-xl mb-2">
                {section.heading}
              </h3>
              <p className="text-[16px]">
                <MathText content={section.content} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <div ref={upgradeRef}>
        <UpgradeModal
          visible={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            setShowUpgradeModal(false);
            router.push("/subscription");
          }}
          title={t.upgrade_title}
          description={t.upgrade_description}
          cancelText={t.upgrade_cancel}
          upgradeText={t.upgrade_button}
        />
      </div>
    </div>
  );
}

// src/app/components/modals/ReflectionPreviewModal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import authApi from "@/app/utils/authApi";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { useProfile } from "@/app/context/ProfileContext";
import { useRouter } from "next/navigation";
import UpgradeModal from "../GlobalPopup/UpgradeModal"; // adjust path if needed
import ContentSpinner from "@/app/sections/ContentSpinner";
import MathText from "../MathText";

interface Props {
  reflectionId: number;
  contentLanguage: "English" | "French"; // ⬅️ add this
  onClose: () => void;
}

type ReflectionResponse = {
  topic: string;
  subject: string;
  level: string;
  generation_datetime: string;
  reflection_question: string;
  user_reflection_answer: string | null;
  reflection_model_feedback: string | null;
  submitted: boolean;
};

export default function ReflectionPreviewModal({
  reflectionId,
  contentLanguage,
  onClose,
}: Props) {
  const [data, setData] = useState<ReflectionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language];
  // Use the content language for value labels + date formatting
  const langKey = contentLanguage === "French" ? "fr" : "en";
  const tContent = translations[langKey];

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authApi.get(
          `/history/details/reflection/${reflectionId}/`
        );
        if (res.data.success && res.data.response) {
          setData(res.data.response);
        }
      } catch (err) {
        console.error("[ReflectionModal] Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reflectionId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
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
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <ContentSpinner />
      </div>
    );
  }
  if (!data) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const res = await authApi.get("/history/download-pdf/", {
        params: { type: "reflection", id: reflectionId },
      });

      const { success, pdf_url } = res.data;
      if (success && pdf_url) {
        window.open(pdf_url, "_blank");
      } else {
        setDownloadError(
          language === "fr"
            ? "Le PDF n'est pas encore prêt. Réessayez bientôt."
            : "PDF not ready yet. Please try again."
        );
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        if (status === 404) {
          setDownloadError(
            language === "fr"
              ? "Contenu introuvable."
              : "Couldn’t find that content."
          );
        } else if (status === 500) {
          setDownloadError(
            language === "fr"
              ? "Erreur serveur lors de la génération du PDF."
              : "Server error generating PDF."
          );
        } else if (status === 401) {
          setDownloadError(
            language === "fr"
              ? "Session expirée. Veuillez vous reconnecter."
              : "Session expired. Please log in again."
          );
        } else {
          setDownloadError(
            language === "fr"
              ? "Impossible de télécharger le PDF."
              : "Could not download PDF."
          );
        }
      } else {
        setDownloadError("An unexpected error occurred.");
      }
      console.error("[ReflectionPreviewModal] ❌ PDF Download failed", err);
    } finally {
      setDownloading(false);
    }
  };

  const subjectLabel =
    tContent.subjects[data.subject as keyof typeof tContent.subjects] ??
    data.subject;

  const levelLabel =
    tContent.levels[data.level as keyof typeof tContent.levels] ?? data.level;

  const formattedDate = new Date(data.generation_datetime).toLocaleDateString(
    langKey,
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className="bg-white max-w-3xl w-full rounded-2xl shadow-xl p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black text-2xl"
        >
          &times;
        </button>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.topic}</h1>
        <p className="text-gray-500 text-sm mb-1">
          {subjectLabel} – {levelLabel}
        </p>
        <p className="text-gray-400 text-xs mb-6">{formattedDate}</p>

        <hr className="my-4 text-[#E2E2E2]" />
        <div className="flex justify-end items-center gap-2 mb-6">
          <button
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
            disabled={downloading}
            onClick={() => {
              if (!isSubscribed) {
                setShowUpgradeModal(true);
                return;
              }
              handleDownload();
            }}
          >
            <FiDownload className="text-base" />
            {downloading ? "Downloading..." : t.quiz_modal.download_pdf}
          </button>

          {/* Error Message */}
          {downloadError && (
            <p className="text-sm text-red-600 mt-1">{downloadError}</p>
          )}
        </div>

        {/* Reflection Question */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {tContent.reflection_question_label ??
              (contentLanguage === "French"
                ? "Question de réflexion"
                : "Reflection Question")}
          </h2>

          <p className="text-gray-700 leading-relaxed">
            <MathText content={data.reflection_question} />
          </p>
        </div>

        {!data.submitted ? (
          <p className="italic text-center text-gray-500 py-6">
            {contentLanguage === "French"
              ? "Cette réflexion n’a pas encore été soumise."
              : "This reflection was not submitted yet."}
          </p>
        ) : (
          <>
            {/* User Answer */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {contentLanguage === "French"
                  ? "Votre réponse"
                  : "Your Response"}
              </h3>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-800 whitespace-pre-wrap">
                {data.user_reflection_answer}
              </div>
            </div>

            {/* AI Feedback */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-green-700 mb-1">
                {contentLanguage === "French" ? "Retour d’IA" : "AI Feedback"}
              </h3>
              <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg p-3 text-sm whitespace-pre-wrap">
                {data.reflection_model_feedback ? (
                  <MathText content={data.reflection_model_feedback} />
                ) : (
                  <span>No feedback.</span>
                )}
              </div>
            </div>
          </>
        )}
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

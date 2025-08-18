"use client";

import { useEffect, useRef, useState } from "react";
// import { X } from "lucide-react";
import authApi from "@/app/utils/authApi";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import MathText from "@/app/components/MathText";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { useProfile } from "@/app/context/ProfileContext";
import ContentSpinner from "@/app/sections/ContentSpinner";
import Image from "next/image"; // Ensure you have this import for Image component
import UpgradeModal from "../GlobalPopup/UpgradeModal"; // adjust path if needed
import { useRouter } from "next/navigation";

interface Props {
  quizId: number;
  contentLanguage: "English" | "French";
  onClose: () => void;
}

type QuizDetailResponse = {
  topic: string;
  subject: string;
  level: string;
  generation_datetime: string;
  quiz: {
    mcqs: Record<
      string,
      {
        statement: string;
        options: Record<string, string>;
        answer: string; // correct option id
        user_answer?: string | null;
        rationale?: string; // optional rationale for the answer
      }
    >;
    true_false: Record<
      string,
      {
        statement: string;
        answer: boolean;
        user_answer?: boolean | null;
        rationale?: string; // optional rationale for the answer
      }
    >;
  };
  submitted: boolean;
  result: {
    score: { mcqs: number; true_false: number };
    total: { mcqs: number; true_false: number };
    details: {
      mcqs: Record<
        string,
        { correct: boolean; user_answer: string; correct_answer: string }
      >;
      true_false: Record<
        string,
        { correct: boolean; user_answer: boolean; correct_answer: boolean }
      >;
    };
  };
};

export default function QuizPreviewModal({
  quizId,
  contentLanguage,
  onClose,
}: Props) {
  const [data, setData] = useState<QuizDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  // content-language dictionary (EN/FR based on the quiz itself)
  const langKey = contentLanguage === "French" ? "fr" : "en";
  const tContent = translations[langKey];
  const mcqHeading =
    contentLanguage === "French"
      ? "Questions à choix multiple"
      : "Multiple choices question";
  const TF =
    contentLanguage === "French"
      ? { title: "Vrai / Faux", true: "Vrai", false: "Faux" }
      : { title: "True / False", true: "True", false: "False" };
  const hintLabel = contentLanguage === "French" ? "Indice" : "Hint";

  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;
  const [reasonVisible, setReasonVisible] = useState<Record<string, boolean>>(
    {}
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    type MCQDetail = {
      index: number;
      user_answer: number;
    };

    type TFDetail = {
      index: number;
      user_answer: boolean;
    };

    type ResultDetails = {
      mcqs: MCQDetail[];
      tf: TFDetail[];
    };

    const fetchData = async () => {
      try {
        const res = await authApi.get(`/history/details/quiz/${quizId}/`);
        if (res.data.success && res.data.response) {
          const response = res.data.response as QuizDetailResponse & {
            result: {
              details?: ResultDetails;
            };
          };

          // Inject user_answer into quiz.mcqs
          if (response.submitted && response.result?.details) {
            // This replaces the old array index loop
            response.quiz.mcqs = Object.entries(
              response.quiz.mcqs || {}
            ).reduce((acc, [key, q]) => {
              const userDetail = response.result.details?.mcqs?.[key];
              acc[key] = {
                ...q,
                user_answer: userDetail?.user_answer ?? null,
              };
              return acc;
            }, {} as typeof response.quiz.mcqs);

            response.quiz.true_false = Object.entries(
              response.quiz.true_false || {}
            ).reduce((acc, [key, q]) => {
              const userDetail = response.result.details?.true_false?.[key];
              acc[key] = {
                ...q,
                user_answer: userDetail?.user_answer ?? null,
              };
              return acc;
            }, {} as typeof response.quiz.true_false);
          }

          setData(response);
          console.log("[QuizPreviewModal] Fetched and patched quiz:", response);
        } else {
          setError("Failed to load quiz data.");
        }
      } catch (err) {
        console.error("[QuizPreviewModal] ❌ Error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId]);

  // Close on outside click
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

  if (error || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg text-red-600">
          {error || "Unknown error occurred"}
        </div>
      </div>
    );
  }

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
        className="bg-white max-w-4xl w-full h-[90vh] overflow-y-auto rounded-xl p-6 shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold">{data.topic}</h1>
        <p className="text-gray-500">
          {subjectLabel} - {levelLabel}
        </p>
        <p className="text-sm text-gray-400">{formattedDate}</p>

        {/* MCQs */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{mcqHeading}</h2>

            <button
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
              disabled={downloading}
              onClick={async () => {
                if (!isSubscribed) {
                  setShowUpgradeModal(true);
                  return;
                }

                setDownloading(true);
                setDownloadError(null);
                try {
                  const res = await authApi.get("/history/download-pdf/", {
                    params: { type: "quiz", id: quizId },
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
                  console.error(
                    "[QuizPreviewModal] ❌ PDF Download failed",
                    err
                  );
                } finally {
                  setDownloading(false);
                }
              }}
            >
              <FiDownload className="text-base" />
              {downloading
                ? "Downloading..."
                : t.modal_download || "Download PDF"}
            </button>

            {downloadError && (
              <p className="text-sm text-red-600 mt-1 text-right">
                {downloadError}
              </p>
            )}
          </div>

          {Object.entries(data.quiz?.mcqs || {}).map(([key, q], idx) => (
            <div key={key} className="mb-6">
              <p className="font-medium text-gray-800 mb-2">
                Q{idx + 1}: <MathText content={q.statement} />
              </p>

              <div className="flex flex-wrap gap-3">
                {Object.entries(q.options).map(([label, text]) => {
                  const isCorrect = label === q.answer;
                  const isSelected = label === q.user_answer;
                  const isWrong = isSelected && !isCorrect;

                  const showGreen = !showSelectedOnly && isCorrect;
                  const showRed = !showSelectedOnly && isWrong;
                  const showBlue = showSelectedOnly && isSelected;

                  return (
                    <button
                      key={label}
                      className={`px-4 py-1.5 rounded-md text-sm transition
              ${showGreen ? "bg-green-500 text-white" : ""}
              ${showRed ? "bg-red-500 text-white" : ""}
              ${showBlue ? "bg-cyan-500 text-white" : ""}
              ${
                !showGreen && !showRed && !showBlue
                  ? "bg-gray-200 text-gray-800"
                  : ""
              }
            `}
                    >
                      <MathText content={text} />
                    </button>
                  );
                })}
              </div>
              <>
                {/* Hint Button (always shown if rationale exists) */}
                {!showSelectedOnly && data.submitted && "rationale" in q && (
                  <button
                    onClick={() => {
                      if (!isSubscribed) {
                        setShowUpgradeModal(true); // Trigger upgrade popup
                        return;
                      }
                      setReasonVisible((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }));
                    }}
                    className="mt-3 flex items-center text-sm text-cyan-600 hover:underline italic gap-2"
                  >
                    <Image
                      src="/images/hint.svg"
                      alt="Info"
                      width={20}
                      height={20}
                      className="rounded-full border border-cyan-600 hover:border-cyan-700 transition-all duration-200 "
                    />
                    {hintLabel}
                  </button>
                )}

                {/* Rationale shown only for subscribed users */}
                {isSubscribed && reasonVisible[key] && q.rationale && (
                  <div
                    className={`mt-3 p-4 rounded-md text-sm ${
                      q.user_answer === q.answer
                        ? "text-green-700 bg-green-100 border border-green-400"
                        : "text-red-700 bg-red-100 border border-red-400"
                    }`}
                  >
                    {q.rationale}
                  </div>
                )}
              </>
            </div>
          ))}
        </div>

        {/* TF */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">{TF.title}</h2>
          {Object.entries(data.quiz?.true_false || {}).map(([key, q], idx) => {
            const userAnswer = q.user_answer;
            const correctAnswer = q.answer;
            const totalMcqs = Object.keys(data.quiz?.mcqs || {}).length;

            return (
              <div key={key} className="mb-6">
                <p className="font-medium text-gray-800 mb-2">
                  Q{totalMcqs + idx + 1}: <MathText content={q.statement} />
                </p>

                <div className="flex gap-3">
                  {[TF.true, TF.false].map((label, optIdx) => {
                    const isTrue = optIdx === 0;
                    const isCorrect = isTrue === correctAnswer;
                    const isSelected = isTrue === userAnswer;
                    const isWrong = isSelected && !isCorrect;

                    const showGreen = !showSelectedOnly && isCorrect;
                    const showRed = !showSelectedOnly && isWrong;
                    const showBlue = showSelectedOnly && isSelected;

                    return (
                      <button
                        key={label}
                        className={`px-4 py-1.5 rounded-md text-sm transition
                ${showGreen ? "bg-green-500 text-white" : ""}
                ${showRed ? "bg-red-500 text-white" : ""}
                ${showBlue ? "bg-cyan-500 text-white" : ""}
                ${
                  !showGreen && !showRed && !showBlue
                    ? "bg-gray-200 text-gray-800"
                    : ""
                }
              `}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                {!showSelectedOnly && data.submitted && "rationale" in q && (
                  <>
                    <button
                      onClick={() => {
                        if (!isSubscribed) {
                          setShowUpgradeModal(true); // Replace with your modal
                          return;
                        }
                        setReasonVisible((prev) => ({
                          ...prev,
                          [key]: !prev[key],
                        }));
                      }}
                      className="mt-3 flex items-center text-sm text-cyan-600 hover:underline gap-2 italic"
                    >
                      <Image
                        src="/images/hint.svg"
                        alt="Info"
                        width={20}
                        height={20}
                        className="rounded-full border border-cyan-600 hover:border-cyan-700 transition-all duration-200"
                      />
                      {hintLabel}
                    </button>

                    {isSubscribed && reasonVisible[key] && q.rationale && (
                      <div
                        className={`mt-3 p-4 rounded-md text-sm ${
                          q.user_answer === q.answer
                            ? "text-green-700 bg-green-100 border border-green-400"
                            : "text-red-700 bg-red-100 border border-red-400"
                        }`}
                      >
                        {q.rationale}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Score & Toggle */}
        <div className="mt-10 flex justify-between items-center">
          <div className="font-semibold text-green-600">
            {data.submitted ? (
              <>
                {t.quiz_modal_score_label || "Score"}:{" "}
                {data.result.score.mcqs + data.result.score.true_false}/
                {data.result.total.mcqs + data.result.total.true_false}
              </>
            ) : (
              <span className="italic text-red-500">
                {language === "fr"
                  ? "Ce quiz n’a pas encore été soumis."
                  : "This quiz was not submitted yet."}
              </span>
            )}
          </div>

          {data.submitted && (
            <button
              onClick={() => setShowSelectedOnly((prev) => !prev)}
              className="text-sm text-cyan-600 hover:underline"
            >
              {showSelectedOnly
                ? t.quiz_modal_toggle_result || "Show Results"
                : t.quiz_modal_toggle_selected || "Show Selected Options"}
            </button>
          )}
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

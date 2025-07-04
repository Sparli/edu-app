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

interface Props {
  quizId: number;
  onClose: () => void;
}

type QuizDetailResponse = {
  topic: string;
  subject: string;
  level: string;
  generation_datetime: string;
  quiz: {
    mcqs: {
      statement: string;
      options: string[];
      correct_answer: number;
      user_answer: number | null;
    }[];
    tf: {
      statement: string;
      correct_answer: boolean;
      user_answer: boolean | null;
    }[];
  };
  submitted: boolean;
  result: {
    score: { mcqs: number; tf: number };
    total: { mcqs: number; tf: number };
  };
};

export default function QuizPreviewModal({ quizId, onClose }: Props) {
  const [data, setData] = useState<QuizDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const qm = t.quiz_modal;
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;

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
            const mcqDetails = response.result.details.mcqs || [];
            const tfDetails = response.result.details.tf || [];

            response.quiz.mcqs = response.quiz.mcqs.map((q, idx): typeof q => {
              const detail = mcqDetails.find((d: MCQDetail) => d.index === idx);
              return detail
                ? { ...q, user_answer: detail.user_answer }
                : { ...q, user_answer: null };
            });

            response.quiz.tf = response.quiz.tf.map((q, idx): typeof q => {
              const detail = tfDetails.find((d: TFDetail) => d.index === idx);
              return detail
                ? { ...q, user_answer: detail.user_answer }
                : { ...q, user_answer: null };
            });
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
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">Loading...</div>
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
          {data.subject} - {data.level}
        </p>
        <p className="text-sm text-gray-400">
          {new Date(data.generation_datetime).toLocaleDateString()}
        </p>

        {/* MCQs */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{qm.mcqs_heading}</h2>
            {isSubscribed && (
              <button
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black disabled:opacity-50"
                disabled={downloading}
                onClick={async () => {
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
            )}
            {downloadError && (
              <p className="text-sm text-red-600 mt-1 text-right">
                {downloadError}
              </p>
            )}
          </div>

          {data.quiz?.mcqs?.map((q, idx) => (
            <div key={idx} className="mb-6">
              <p className="font-medium text-gray-800 mb-2">
                Q{idx + 1}: <MathText content={q.statement} />
              </p>

              <div className="flex flex-wrap gap-3">
                {q.options.map((opt, optIdx) => {
                  const isCorrect = optIdx === q.correct_answer;
                  const isSelected = optIdx === q.user_answer;
                  const isWrong = isSelected && !isCorrect;

                  const showGreen = !showSelectedOnly && isCorrect;
                  const showRed = !showSelectedOnly && isWrong;
                  const showBlue = showSelectedOnly && isSelected;

                  return (
                    <button
                      key={optIdx}
                      className={`px-4 py-1.5 rounded-md text-sm transition
  ${showGreen ? "bg-green-500 text-white" : ""}
  ${showRed ? "bg-red-500 text-white" : ""}
  ${showBlue ? "bg-cyan-500 text-white" : ""}
  ${!showGreen && !showRed && !showBlue ? "bg-gray-200 text-gray-800" : ""}
`}
                    >
                      <MathText content={opt} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* TF */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">True / False</h2>
          {data.quiz?.tf?.map((q, idx) => {
            const userAnswer = q.user_answer;
            const correct = q.correct_answer;
            const totalMcqs = data.quiz?.mcqs?.length ?? 0;
            return (
              <div key={idx} className="mb-6">
                <p className="font-medium text-gray-800 mb-2">
                  Q{totalMcqs + idx + 1}: <MathText content={q.statement} />
                </p>

                <div className="flex gap-3">
                  {["True", "False"].map((label, optIdx) => {
                    const isTrue = optIdx === 0;
                    const isCorrect = isTrue === correct;
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
  ${!showGreen && !showRed && !showBlue ? "bg-gray-200 text-gray-800" : ""}
`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
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
                {data.result.score.mcqs + data.result.score.tf}/
                {data.result.total.mcqs + data.result.total.tf}
              </>
            ) : (
              <span className="italic text-gray-500">
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
    </div>
  );
}

"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import authApi from "@/app/utils/authApi";
import type { AxiosError } from "axios";
import { translations } from "@/app/translations";
import type { Level, Subject, QuizSubmitResult } from "@/app/types/content";
import MathText from "@/app/components/MathText";
import { saveContent } from "@/app/api/saveContentApi";
import { FiDownload } from "react-icons/fi";
import axios from "axios";
import { useProfile } from "@/app/context/ProfileContext";

type Language = "English" | "French";

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
  language: Language;
  generatedAt: Date;
  onClose: () => void;
}
type SubmittedAnswers = {
  mcqs?: number[];
  tf?: boolean[];
};

// ----- Utils -----
function saveQuizSubmission(
  answers: SubmittedAnswers,
  result: QuizSubmitResult
) {
  sessionStorage.setItem(
    "submitted_quiz_data",
    JSON.stringify({
      submitted: true,
      answers,
      result,
      timestamp: Date.now(),
    })
  );
}

function loadQuizSubmission() {
  const raw = sessionStorage.getItem("submitted_quiz_data");
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  const now = Date.now();
  const MAX_AGE = 15 * 60 * 1000; // 15 minutes

  if (now - parsed.timestamp > MAX_AGE) {
    clearQuizSubmission();
    return null;
  }

  return parsed;
}

export function clearQuizSubmission() {
  sessionStorage.removeItem("submitted_quiz_data");
}

function convertStoredToSelected(stored: {
  mcqs?: number[];
  tf?: boolean[];
}): Record<`mcq-${number}` | `tf-${number}`, number | null> {
  const temp: Record<`mcq-${number}` | `tf-${number}`, number | null> = {};
  stored.mcqs?.forEach((ans, idx) => {
    temp[`mcq-${idx}`] = ans;
  });
  stored.tf?.forEach((val, idx) => {
    temp[`tf-${idx}`] = val ? 0 : 1;
  });
  return temp;
}

export default function QuizModal({
  content,
  onClose,
  subject,
  level,
  language,
  generatedAt,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  type QuestionKey = `mcq-${number}` | `tf-${number}`;
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<QuestionKey, number | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCorrectness, setShowCorrectness] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;

  const handleSubmit = async () => {
    if (loading) return;
    // Validation: check if all questions are answered
    const totalMcqs = content.quiz.mcqs?.length || 0;
    const totalTFs = content.quiz.tf?.length || 0;
    const totalQuestions = totalMcqs + totalTFs;
    const answeredCount = Object.values(selectedAnswers).filter(
      (val) => val !== null && val !== undefined
    ).length;

    if (answeredCount < totalQuestions) {
      setError(
        langKey === "fr"
          ? "Veuillez répondre à toutes les questions avant de soumettre."
          : "Please answer all questions before submitting."
      );
      return;
    }

    setLoading(true);
    setError(null);

    const mcqs: number[] = [];
    const tf: boolean[] = [];

    Object.entries(selectedAnswers).forEach(([key, value]) => {
      if (value === null) return;
      if (key.startsWith("mcq-")) mcqs.push(value as number);
      else if (key.startsWith("tf-")) tf.push(value === 0);
    });

    try {
      const res = await authApi.post("/content/quiz/submit/", {
        answers: { mcqs, tf },
      });
      if (res.data.success) {
        const quizResult = res.data.response;
        saveQuizSubmission({ mcqs, tf }, quizResult);
        setResult(quizResult);
        setShowCorrectness(true);
        await saveContent({ rating: null, feedback: null });
        if (typeof window !== "undefined") {
          sessionStorage.setItem("save_flag", "true");
          window.dispatchEvent(new Event("save-status-updated"));
        }
      } else {
        setError(
          typeof res.data.error === "string"
            ? res.data.error
            : JSON.stringify(res.data.error)
        );
      }
    } catch (err) {
      const error = err as AxiosError;
      setError(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // Hydrate saved answers and results if present
  useEffect(() => {
    try {
      const stored = loadQuizSubmission();
      if (stored?.submitted) {
        setSelectedAnswers(convertStoredToSelected(stored.answers));

        setResult(stored.result);
        setShowCorrectness(false);
      }
    } catch {
      clearQuizSubmission();
    }
  }, []);

  // Prevent scroll on open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const langKey = language.toLowerCase().startsWith("fr") ? "fr" : "en";

  const t = translations[langKey];

  const hasSubmitted = !!result;
  let questionCounter = 1;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-lg"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <X size={24} />
        </button>

        {/* Header */}
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
          <hr className="my-10 text-[#E2E2E2]" />
        </div>

        {/* Questions */}
        <div className="space-y-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="lg:text-2xl font-semibold">
              {t.quiz_modal_mcq_title}
            </h1>
            {isSubscribed && (
              <button
                className="flex items-center gap-1 hover:text-black cursor-pointer disabled:opacity-50"
                onClick={async () => {
                  setDownloading(true);
                  setDownloadError(null); // clear previous error
                  try {
                    const res = await authApi.get("/content/gen/pdf/", {
                      params: { type: "quiz" },
                    });

                    const { success, pdf_url } = res.data;
                    if (success && pdf_url) {
                      window.open(pdf_url, "_blank");
                    } else {
                      setDownloadError(
                        langKey === "fr"
                          ? "PDF non prêt. Veuillez réessayer."
                          : "PDF not ready. Please try again."
                      );
                    }
                  } catch (err: unknown) {
                    if (axios.isAxiosError(err) && err.response) {
                      const status = err.response.status;
                      const isFr = langKey === "fr";
                      if (status === 404) {
                        setDownloadError(
                          isFr
                            ? "Veuillez générer le contenu avant de télécharger un PDF."
                            : "Please generate content before downloading a PDF."
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
                      setDownloadError(
                        langKey === "fr"
                          ? "Une erreur inattendue est survenue."
                          : "An unexpected error occurred."
                      );
                    }
                    console.error("[LessonModal] ❌ PDF Download failed", err);
                  } finally {
                    setDownloading(false);
                  }
                }}
                disabled={downloading}
              >
                <FiDownload />
                {downloading ? "Downloading..." : t.modal_download}
              </button>
            )}

            {downloadError && (
              <p className="text-sm text-red-600 justify-end mt-2">
                {downloadError}
              </p>
            )}
          </div>
          {content.quiz.mcqs?.map((q, idx) => (
            <div key={`mcq-${idx}`}>
              <p className="font-medium text-gray-800">
                Q: {questionCounter++}
              </p>

              <p className="mb-2 text-gray-700 lg:text-lg">
                <MathText content={q.statement} />
              </p>
              <div className="flex gap-4 flex-wrap">
                {q.options.map((opt, i) => {
                  const key = `mcq-${idx}` as const;
                  const isSelected = selectedAnswers[key] === i;
                  const correctAnswer =
                    result?.details.mcqs?.[idx]?.correct_answer;

                  const showBlue =
                    (showSelectedOnly || !showCorrectness) && isSelected;

                  const showGreen =
                    !showSelectedOnly && showCorrectness && i === correctAnswer;
                  const showRed =
                    !showSelectedOnly &&
                    showCorrectness &&
                    isSelected &&
                    i !== correctAnswer;

                  return (
                    <button
                      key={i}
                      className={`
        px-5 py-1.5 rounded-md transition cursor-pointer
        ${
          showBlue
            ? "bg-cyan-500 text-white"
            : showGreen
            ? "bg-green-500 text-white"
            : showRed
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
                      disabled={hasSubmitted}
                      onClick={() => {
                        if (!hasSubmitted) {
                          setSelectedAnswers((prev) => ({ ...prev, [key]: i }));
                          setError(null);
                        }
                      }}
                    >
                      <MathText content={opt} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <h1 className="lg:text-2xl font-semibold">
            {" "}
            {t?.quiz_modal_tf_title || "Vrai/Faux"}
          </h1>
          {content.quiz.tf?.map((q, idx) => (
            <div key={`tf-${idx}`}>
              <p className="font-medium text-gray-800">
                Q: {questionCounter++}
              </p>

              <MathText content={q.statement} />
              <div className="flex gap-4 flex-wrap mt-3">
                {[
                  langKey === "fr" ? "Vrai" : "True",
                  langKey === "fr" ? "Faux" : "False",
                ].map((label, optionIdx) => {
                  const key = `tf-${idx}` as const;
                  const isSelected = selectedAnswers[key] === optionIdx;
                  const correctAnswer =
                    result?.details.tf?.[idx]?.correct_answer;
                  const isOptionTrue = optionIdx === 0;

                  const showGreen =
                    !showSelectedOnly &&
                    showCorrectness &&
                    isOptionTrue === correctAnswer;
                  const showRed =
                    !showSelectedOnly &&
                    showCorrectness &&
                    isSelected &&
                    !showGreen;
                  const showBlue =
                    (showSelectedOnly || !showCorrectness) && isSelected;

                  return (
                    <button
                      key={label}
                      className={`
        px-5 py-1.5 rounded-md transition cursor-pointer
        ${
          showBlue
            ? "bg-cyan-500 text-white"
            : showGreen
            ? "bg-green-500 text-white"
            : showRed
            ? "bg-red-500 text-white"
            : "bg-gray-300 text-gray-800 hover:bg-gray-400"
        }`}
                      disabled={hasSubmitted}
                      onClick={() => {
                        if (!hasSubmitted) {
                          setSelectedAnswers((prev) => ({
                            ...prev,
                            [key]: optionIdx,
                          }));
                          setError(null);
                        }
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit / Score */}
        <div className="mt-12 flex  flex-col lg:flex-row sm:justify-between sm:items-center gap-4">
          {/* LEFT: Score or error */}
          <div>
            {result && (
              <div className="text-sm text-green-700 font-medium">
                {t.quiz_modal_score_label}:{" "}
                {result.score.mcqs + result.score.tf}/
                {result.total.mcqs + result.total.tf}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-500 font-medium">{error}</div>
            )}
          </div>

          {/* RIGHT: Submit + Toggle button */}
          <div className="flex gap-6 items-center cursor-pointer">
            {hasSubmitted && (
              <button
                onClick={() => setShowSelectedOnly((prev) => !prev)}
                className="text-sm font-medium text-cyan-600 hover:underline transition whitespace-nowrap cursor-pointer"
              >
                {showSelectedOnly
                  ? t.quiz_modal_toggle_result
                  : t.quiz_modal_toggle_selected}
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !!result}
              className={`bg-cyan-500 text-white px-6 py-2 rounded-md transition ${
                loading || result
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-cyan-600 cursor-pointer"
              }`}
            >
              {loading ? "Submitting..." : t.quiz_modal_button_submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

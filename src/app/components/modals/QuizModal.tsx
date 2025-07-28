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
import Image from "next/image";
import { useProfile } from "@/app/context/ProfileContext";
import UpgradeModal from "../GlobalPopup/UpgradeModal";
import { useRouter } from "next/navigation";

function convertStoredToSelected(
  stored: {
    mcqs?: Record<string, string>;
    tf?: Record<string, boolean>;
  },
  content: Props["content"]
): Record<`mcq-${number}` | `tf-${number}`, number | null> {
  const temp: Record<`mcq-${number}` | `tf-${number}`, number | null> = {};

  if (stored.mcqs && content.quiz.mcqs) {
    Object.entries(stored.mcqs).forEach(([qIdx, label]) => {
      const mcqIndex = Number(qIdx) - 1;
      const optionsObj = content.quiz.mcqs?.[mcqIndex]?.options || [];
      const optionKeys = Object.keys(optionsObj);
      const optionIndex = optionKeys.findIndex((key) => key === label);
      temp[`mcq-${mcqIndex}`] = optionIndex >= 0 ? optionIndex : null;
    });
  }

  if (stored.tf) {
    Object.entries(stored.tf).forEach(([qIdx, val]) => {
      const tfIndex = Number(qIdx) - 1;
      temp[`tf-${tfIndex}`] = val === true ? 0 : 1;
    });
  }

  return temp;
}

type Language = "English" | "French";

interface Props {
  content: {
    quiz: {
      mcqs?: { statement: string; options: string[] }[];
      tf?: { statement: string; correct_answer: boolean }[];
    };
    reflection: string;
    valid_topic?: string;
  };
  topic: string;
  subject: Subject;
  level: Level;
  language: Language;
  generatedAt: Date;
  onClose: () => void;
}

type SubmittedAnswers = {
  mcqs?: Record<string, string>;
  tf?: Record<string, boolean>;
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

export default function QuizModal({
  content,
  onClose,
  subject,
  level,
  language,
  generatedAt,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);
  const upgradeRef = useRef<HTMLDivElement>(null);

  type QuestionKey = `mcq-${number}` | `tf-${number}`;
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<QuestionKey, number | null>
  >({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QuizSubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;
  const [reasonVisible, setReasonVisible] = useState<
    Record<QuestionKey, boolean>
  >({});

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

    const mcqs: Record<string, string> = {};
    const tf: Record<string, boolean> = {};

    Object.entries(selectedAnswers).forEach(([key, value]) => {
      if (value === null) return;

      if (key.startsWith("mcq-")) {
        const qIdx = key.split("-")[1];
        const selectedOptionIndex = value as number;
        const rawOption =
          content.quiz.mcqs?.[+qIdx]?.options?.[selectedOptionIndex];
        const optionKey = rawOption?.split("|")[0]; // "b"
        const questionId = String(Number(qIdx) + 1); // convert "0" ➝ "1"
        if (optionKey) mcqs[questionId] = optionKey;
      } else if (key.startsWith("tf-")) {
        const qIdx = key.split("-")[1];
        const questionId = String(Number(qIdx) + 1); // shift 0-based to 1-based
        tf[questionId] = value === 0;
      }
    });

    try {
      const res = await authApi.post("/content/quiz/submit/", {
        answers: { mcqs, tf },
      });
      if (res.data.success) {
        const quizResult = res.data.response;
        saveQuizSubmission({ mcqs, tf }, quizResult);
        setResult(quizResult);
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
      setError(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = error.response?.data as any;
        if (!data) return "Something went wrong";
        if (typeof data === "string") return data;
        if (typeof data.error === "string") return data.error;
        return "An unknown error occurred.";
      });
    } finally {
      setLoading(false);
    }
  };

  // Hydrate saved answers and results if present
  useEffect(() => {
    try {
      const stored = loadQuizSubmission();
      if (stored?.submitted) {
        const selected = convertStoredToSelected(stored.answers, content);
        setSelectedAnswers(selected);
        setResult(stored.result);
      }
    } catch {
      clearQuizSubmission();
    }
  }, [content]); // only runs again if `content` changes

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

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const langKey = language.toLowerCase().startsWith("fr") ? "fr" : "en";

  const t = translations[langKey];

  const hasSubmitted = !!result;
  const mcqDetails = result?.details?.mcqs ?? [];
  const tfDetails = result?.details?.true_false ?? [];
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();

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
            <button
              className="flex items-center gap-1 hover:text-black cursor-pointer disabled:opacity-50"
              onClick={async () => {
                if (!isSubscribed) {
                  setShowUpgradeModal(true);
                  return;
                }

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

            {downloadError && (
              <p className="text-sm text-red-600 justify-end mt-2">
                {downloadError}
              </p>
            )}
          </div>
          {content.quiz.mcqs?.map((q, idx) => {
            const mcqResult = (
              mcqDetails as Record<
                string,
                {
                  correct: boolean;
                  user_answer: string;
                  correct_answer: string;
                  rationale?: string;
                }
              >
            )?.[String(idx + 1)];
            const correctAnswerLabel = mcqResult?.correct_answer;
            const userAnswerLabel = mcqResult?.user_answer;
            const correctAnswerIndex =
              content.quiz.mcqs?.[idx]?.options?.findIndex((opt) => {
                if (!opt || !correctAnswerLabel) return false;
                const optionKey = opt.includes("|") ? opt.split("|")[0] : opt;
                return (
                  optionKey === correctAnswerLabel || opt === correctAnswerLabel
                );
              }) ?? -1;
            // Find index of user-selected answer
            const userAnswerIndex =
              userAnswerLabel && q.options
                ? q.options.findIndex((opt) => {
                    const optionKey = opt.includes("|")
                      ? opt.split("|")[0]
                      : opt;
                    return (
                      optionKey === userAnswerLabel || opt === userAnswerLabel
                    );
                  })
                : -1;

            return (
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
                    const isSelected =
                      selectedAnswers[key] === i || // Pre-submission selection
                      (hasSubmitted && userAnswerIndex === i); // Post-submission selection
                    // Updated for intended behavior: blue for "Show Selected Options" (pre/post), green/red for "Show Results"
                    const showBlue =
                      isSelected && (!hasSubmitted || showSelectedOnly); // Blue for selected before/after submission under "Show Selected Options"
                    const showGreen =
                      hasSubmitted &&
                      !showSelectedOnly &&
                      i === correctAnswerIndex; // Green for correct in "Show Results"
                    const showRed =
                      hasSubmitted &&
                      !showSelectedOnly &&
                      isSelected &&
                      i !== correctAnswerIndex; // Red for wrong in "Show Results"

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
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [key]: i,
                            }));
                            setError(null);
                          }
                        }}
                      >
                        <MathText
                          content={
                            opt?.includes("|") ? opt.split("|")[1] : opt || ""
                          }
                        />
                      </button>
                    );
                  })}
                </div>
                {hasSubmitted &&
                  !showSelectedOnly &&
                  "rationale" in mcqResult && (
                    <>
                      <button
                        onClick={() => {
                          if (!isSubscribed) {
                            setShowUpgradeModal(true);
                            return;
                          }
                          setReasonVisible((prev) => ({
                            ...prev,
                            [`mcq-${idx}`]: !prev[`mcq-${idx}`],
                          }));
                        }}
                        className="mt-3 flex items-center text-base text-cyan-600 hover:underline italic gap-2"
                      >
                        <Image
                          src="/images/hint.svg"
                          alt="Info"
                          width={20}
                          height={20}
                          className="rounded-full border border-cyan-600 hover:border-cyan-700 transition-all duration-200 "
                        />
                        {langKey === "fr" ? "Indice" : "Hint"}
                      </button>

                      {isSubscribed &&
                        reasonVisible[`mcq-${idx}`] &&
                        mcqResult?.rationale && (
                          <div
                            className={`mt-3 p-4 rounded-md text-sm ${
                              mcqResult.correct
                                ? "text-green-700 bg-green-100 border border-green-400"
                                : "text-red-700 bg-red-100 border border-red-400"
                            }`}
                          >
                            {mcqResult.rationale}
                          </div>
                        )}
                    </>
                  )}
              </div>
            );
          })}

          <h1 className="lg:text-2xl font-semibold">
            {" "}
            {t?.quiz_modal_tf_title || "Vrai/Faux"}
          </h1>
          {content.quiz.tf?.map((q, idx) => {
            const tfResult =
              (
                tfDetails as Record<
                  string,
                  {
                    correct: boolean;
                    user_answer: boolean;
                    correct_answer: boolean;
                    rationale?: string;
                  }
                >
              )?.[String(idx + 1)] ||
              (
                tfDetails as Record<
                  number,
                  {
                    correct: boolean;
                    user_answer: boolean;
                    correct_answer: boolean;
                  }
                >
              )?.[idx + 1]; // Type-safe fallback for 0-based indexing
            const correctAnswer = tfResult?.correct_answer;
            const userAnswer = tfResult?.user_answer;

            return (
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
                    let isSelected = false;
                    if (!hasSubmitted) {
                      isSelected = selectedAnswers[key] === optionIdx;
                    } else if (hasSubmitted && showSelectedOnly) {
                      isSelected = selectedAnswers[key] === optionIdx;
                    } else if (hasSubmitted && !showSelectedOnly) {
                      isSelected =
                        (optionIdx === 0 && userAnswer === true) ||
                        (optionIdx === 1 && userAnswer === false);
                    }
                    const isOptionTrue = optionIdx === 0;
                    // Updated for intended behavior: blue for "Show Selected Options" (pre/post), green/red for "Show Results"
                    const showBlue =
                      isSelected &&
                      (!hasSubmitted || (hasSubmitted && showSelectedOnly)); // Blue for selected before/after under "Show Selected Options"
                    const showGreen =
                      hasSubmitted &&
                      !showSelectedOnly &&
                      isOptionTrue === correctAnswer;

                    const showRed =
                      hasSubmitted &&
                      !showSelectedOnly &&
                      isSelected &&
                      isOptionTrue !== correctAnswer; // Red for wrong in "Show Results"// Red for wrong in "Show Results" // Red for wrong in "Show Results"
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
                {hasSubmitted &&
                  !showSelectedOnly &&
                  "rationale" in tfResult && (
                    <>
                      <button
                        onClick={() => {
                          if (!isSubscribed) {
                            setShowUpgradeModal(true);
                            return;
                          }
                          setReasonVisible((prev) => ({
                            ...prev,
                            [`tf-${idx}`]: !prev[`tf-${idx}`],
                          }));
                        }}
                        className="mt-3 flex items-center text-base text-cyan-600 hover:underline italic gap-1"
                      >
                        <Image
                          src="/images/hint.svg"
                          alt="Info"
                          width={20}
                          height={20}
                          className="rounded-full border border-cyan-600 hover:border-cyan-700 transition-all duration-200 "
                        />
                        {langKey === "fr" ? "Indice" : "Hint"}
                      </button>

                      {isSubscribed &&
                        reasonVisible[`tf-${idx}`] &&
                        tfResult.rationale && (
                          <div
                            className={`mt-3 p-4 rounded-md text-sm ${
                              tfResult.correct
                                ? "text-green-700 bg-green-100 border border-green-400"
                                : "text-red-700 bg-red-100 border border-red-400"
                            }`}
                          >
                            {tfResult.rationale}
                          </div>
                        )}
                    </>
                  )}
              </div>
            );
          })}
        </div>

        {/* Submit / Score */}
        <div className="mt-12 flex  flex-col lg:flex-row sm:justify-between sm:items-center gap-4">
          {/* LEFT: Score or error */}
          <div>
            {result && (
              <div className="text-sm text-green-700 font-medium">
                {t.quiz_modal_score_label}:{" "}
                {result.score.mcqs + result.score.true_false}/
                {result.total.mcqs + result.total.true_false}
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

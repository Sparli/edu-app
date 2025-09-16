"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { DailyChallengeData } from "@/app/utils/insightsApi";
import { submitDailyChallenge, DailyChallengeSubmitApiError } from "@/app/utils/dailyChallengeSubmitApi";

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  data: DailyChallengeData | null;
  error: string | null;
  onSubmitSuccess?: () => void; // Callback to refresh data after successful submission
}


const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  loading,
  data,
  error,
  onSubmitSuccess,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    attemptsUsed: number;
    attemptsLeft: number;
    message: string;
    rewardXp: number;
  } | null>(null);

  // Convert API data to Question format
  const question: Question | null = data ? {
    id: data.challenge_id,
    question: data.mcq.question,
    options: data.mcq.options.map((option, index) => ({
      id: index.toString(),
      text: option,
      isCorrect: false // We never know the correct answer from API for security
    }))
  } : null;

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setIsSubmitting(false);
      setSubmitError(null);
      setSubmitResult(null);
      // Set submitted state based on API data
      const isAlreadySubmitted = data?.submitted || false;
      setIsSubmitted(isAlreadySubmitted);
      setShowResult(isAlreadySubmitted);
    }
  }, [isOpen, data?.submitted]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!selectedOption || !data || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Get user's timezone for the API call
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      const response = await submitDailyChallenge(
        parseInt(selectedOption),
        language,
        timezone
      );

      setSubmitResult({
        submitted: response.data.submitted,
        isCorrect: response.data.is_correct,
        attemptsUsed: response.data.attempts_used,
        attemptsLeft: response.data.attempts_left,
        message: response.data.message,
        rewardXp: response.data.reward_xp
      });

      setIsSubmitted(response.data.submitted);
      setShowResult(true);

      // Call success callback to refresh dashboard data
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      if (error instanceof DailyChallengeSubmitApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError(t.daily_challenge_submit_error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOption(optionId);
    }
  };

  const getOptionStyle = (option: { id: string; isCorrect: boolean }) => {
    if (!showResult) {
      return selectedOption === option.id
        ? "bg-[#23BAD8]/10 border-[#23BAD8] ring-2 ring-[#23BAD8]/20"
        : "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }

    // Show results - only highlight the selected option
    const isSelectedOption = selectedOption === option.id;

    if (isSelectedOption) {
      if (submitResult?.isCorrect) {
        return "bg-green-50 border-green-500 ring-2 ring-green-200";
      } else {
        return "bg-red-50 border-red-500 ring-2 ring-red-200";
      }
    }

    return "bg-gray-50 border-gray-200";
  };

  const getOptionIcon = (option: { id: string; isCorrect: boolean }) => {
    if (!showResult) {
      return selectedOption === option.id ? (
        <div className="w-5 h-5 rounded-full bg-[#23BAD8] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
      );
    }

    const isSelectedOption = selectedOption === option.id;

    // Show icon for selected option only
    if (isSelectedOption) {
      if (submitResult?.isCorrect) {
        return (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      } else {
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        );
      }
    }

    return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
  };

  if (!isOpen) return null;

  const isCorrectAnswer = submitResult ? submitResult.isCorrect : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full  max-w-2xl lg:mx-4 m-4 bg-gradient-to-br from-[#23BAD8] to-[#1DA1C7] rounded-[20px] shadow-2xl lg:max-h-[90vh] max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-white">
          <div className="flex items-center gap-3">
            <Image
              src="/PremImages/daily.png"
              alt={t.daily_challenge_title}
              width={40}
              height={40}
              className="bg-white/20 rounded-full p-2"
            />
            <div>
              <div className="flex items-center gap-3 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Image
                    src="/PremImages/time.png"
                    alt="Timer"
                    width={16}
                    height={16}
                  />
                  <span>{data?.eta || "-- Mins"}</span>
                </div>
                <span>•</span>
                <span>{data?.daily_weakest_subject || "Subject"}</span>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-t-[20px] p-6 min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">{t.daily_challenge_loading}</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-2">{t.daily_challenge_failed_load}</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          ) : !question ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-2">{t.daily_challenge_no_challenge}</p>
                <p className="text-sm text-gray-400">{t.daily_challenge_check_back}</p>
              </div>
            </div>
          ) : (
            <>

              {/* Question */}
              <div className="mb-8">
                <div className="bg-[#4A4A4A1A]/90 rounded-[12px] p-4 border-l-4 border-[#23BAD8]">
                  <h3 className="text-xl font-semibold text-[#191818] mb-2">
                    {question.question}
                  </h3>
                </div>
              </div>


              {/* Options */}
              <div className="space-y-4 mb-8">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-[12px] border-2 transition-all duration-200 text-left flex items-center gap-4 ${getOptionStyle(option)} ${
                      isSubmitted ? 'cursor-default' : 'cursor-pointer'
                    }`}
                  >
                    {getOptionIcon(option)}
                    <span className="text-[#191818] font-medium">
                      <span className="font-bold mr-2">{String.fromCharCode(65 + parseInt(option.id))})</span>
                      {option.text}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="mb-6 p-4 rounded-[12px] bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-red-800">{t.daily_challenge_error_title}</p>
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Result Message */}
          {showResult && question && isCorrectAnswer && (
            <div className="mb-6 p-4 rounded-[12px] bg-green-50 border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-green-800">
                    {t.daily_challenge_well_done}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Try Again Message for Wrong Answer */}
          {showResult && question && !isCorrectAnswer && (
            <div className="mb-6 p-4 rounded-[12px] bg-red-50 border border-red-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-red-800">{t.daily_challenge_try_again}</p>
                  <p className="text-sm text-red-600">
                    {String(submitResult?.attemptsLeft || 0).padStart(2, '0')} {t.daily_challenge_attempt_left}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {question && (
            <div className="flex justify-center">
              {!showResult ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedOption || (submitResult ? submitResult.attemptsLeft === 0 : data?.attempts_left === 0) || isSubmitting}
                  className={`px-8 py-3 rounded-[12px] font-bold text-white transition-all duration-200 flex items-center gap-2 ${
                    selectedOption && (submitResult ? submitResult.attemptsLeft !== 0 : data?.attempts_left !== 0) && !isSubmitting
                      ? 'bg-[#23BAD8] hover:bg-[#1DA1C7] shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {(submitResult ? submitResult.attemptsLeft === 0 : data?.attempts_left === 0)
                    ? t.daily_challenge_no_attempts_left 
                    : isSubmitting 
                      ? t.daily_challenge_submitting 
                      : t.daily_challenge_submit
                  }
                </button>
              ) : showResult && !isCorrectAnswer && (submitResult?.attemptsLeft || 0) > 0 ? (
                <button
                  onClick={() => {
                    // Reset for another attempt
                    setSelectedOption(null);
                    setShowResult(false);
                    setIsSubmitted(false);
                  }}
                  className="px-8 py-3 rounded-[12px] font-bold text-white bg-[#23BAD8] hover:bg-[#1DA1C7] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t.daily_challenge_try_again}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyChallengeModal;

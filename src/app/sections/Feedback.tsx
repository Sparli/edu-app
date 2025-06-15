"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import authApi from "@/app/utils/authApi";

const Feedback = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const { language } = useLanguage();
  const t = translations[language];
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async () => {
    if (!rating) {
      setSubmitStatus("error");
      alert("Please select a rating before submitting.");
      return;
    }

    setSubmitStatus("loading");

    const payload = {
      stars: rating,
      rating_label: getRatingLabel(rating),
      comment: feedback.trim(),
      user_datetime: new Date().toISOString(),
    };

    try {
      const res = await authApi.post("/feedback/submit/", payload);
      if (res.data?.success) {
        setSubmitStatus("success");
        setFeedback("");
        setRating(0);
      } else {
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Feedback error:", err);
      setSubmitStatus("error");
    }
  };

  const getRatingLabel = (stars: number): string => {
    switch (stars) {
      case 1:
        return "poor";
      case 2:
        return "average";
      case 3:
        return "good";
      case 4:
        return "very_good";
      case 5:
        return "excellent";
      default:
        return "average"; // fallback
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8  lg:max-w-[1529.375px] w-full mt-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
        {t.feedback_title}
        <Image
          src="/images/star.png"
          alt="Wave"
          width={24}
          height={24}
          className="ml-1"
        />
      </h1>
      <p className="text-gray-500 mb-6 text-lg">{t.feedback_subtitle}</p>

      <hr className="my-16 border-gray-200" />

      <div className="bg-[#F7F9FC] p-6 rounded-2xl space-y-10 lg:min-h-[600px] flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-8">
          {t.feedback_question}
        </h2>

        {/* Star Ratings */}
        <div className="flex justify-center space-x-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl mb-4 transition ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Rating Labels */}
        <div className="flex justify-center lg:space-x-8 space-x-3 text-gray-500 text-lg mb-6">
          {t.feedback_labels.map((label: string, idx: number) => (
            <span
              key={label}
              className={`cursor-pointer ${
                rating === idx + 1 ? "text-yellow-500 font-semibold" : ""
              }`}
              onClick={() => setRating(idx + 1)}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Feedback Text Area */}
        <div className="relative w-full max-w-xl mx-auto">
          <textarea
            value={feedback}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 500) setFeedback(val);
            }}
            maxLength={500}
            className="w-full h-[200px] p-4 pr-16 rounded-lg bg-white focus:outline-none resize-none text-gray-700"
            rows={4}
            placeholder={t.feedback_placeholder}
          />
          <p className="absolute bottom-2 right-4 text-sm text-gray-400">
            {feedback.length}/500
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitStatus === "loading"}
          className="lg:w-1/3 p-4 mt-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-green-400 hover:opacity-90 transition shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitStatus === "loading" ? "Submitting..." : t.feedback_submit}
        </button>

        {submitStatus === "success" && (
          <p className="text-green-600 text-sm mt-2">
            Feedback submitted. Thank you!
          </p>
        )}

        {submitStatus === "error" && (
          <p className="text-red-500 text-sm mt-2">
            Submission failed. Please try again.
          </p>
        )}
      </div>
    </div>
  );
};

export default Feedback;

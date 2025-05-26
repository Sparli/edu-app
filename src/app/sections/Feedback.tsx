"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

const Feedback = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubmit = () => {
    alert(`Rating: ${rating} Stars\nFeedback: ${feedback}`);
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
        <div className="flex justify-center space-x-8 text-gray-500 text-lg mb-6">
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
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full max-w-xl h-[200px] mx-auto p-4 rounded-lg bg-[#FFFFFF] focus:outline-none resize-none text-gray-700"
          rows={4}
          placeholder={t.feedback_placeholder}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="lg:w-1/3 p-4 mt-4 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-green-400 hover:opacity-90 transition shadow-lg"
        >
          {t.feedback_submit}
        </button>
      </div>
    </div>
  );
};

export default Feedback;

"use client";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Image from "next/image";

const Feedback = () => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = () => {
    alert(`Rating: ${rating} Stars\nFeedback: ${feedback}`);
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="flex-1 p-4 sm:p-8 bg-[#F7F9FC]  lg:max-w-[1529.375px] w-full mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        Give Us Feedback{" "}
        <Image
          src="/images/star.png"
          alt="Wave"
          width={24}
          height={24}
          className="ml-1"
        />
      </h1>
      <p className="text-gray-500 mb-6 text-sm sm:text-base">
        We&apos;d love to know how EduAI is helping you learn!
      </p>

      <hr className="mb-6 border-gray-300" />

      <div className="bg-[#F7F9FC] p-6 rounded-xl shadow-md space-y-12 lg:min-h-[600px] text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          How would you rate your experience?
        </h2>

        {/* Star Ratings */}
        <div className="flex justify-center space-x-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl transition ${
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
        <div className="flex justify-center space-x-6 text-gray-500 text-sm mb-4">
          {ratingLabels.map((label, idx) => (
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
          className="w-full p-4 rounded-lg bg-gray-100 focus:outline-none resize-none text-gray-700"
          rows={4}
          placeholder="Overall experience is good. I love the app."
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-1/3 p-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-green-400 hover:opacity-90 transition shadow-lg"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default Feedback;

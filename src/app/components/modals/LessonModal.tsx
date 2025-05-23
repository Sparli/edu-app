"use client";

import {
  FiEdit,
  FiTrash2,
  FiDownload,
  FiCopy,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import type { GeneratedContent } from "@/app/types/content";

interface Props {
  content: GeneratedContent;
  topic: string;
  subject: string;
  level: string;
  onClose: () => void;
}

export default function LessonModal({
  content,
  topic,
  subject,
  level,
  onClose,
}: Props) {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const modalRef = useRef<HTMLDivElement>(null);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // ✅ Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <FiX size={24} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start flex-wrap gap-4 mb-10">
          <div className="mt-10">
            <h1 className="text-3xl font-bold text-gray-900">{topic}</h1>
            <p className="text-gray-500 mt-2">
              {subject} - {level}
            </p>
            <p className="text-gray-400 text-sm">Generated on April 30, 2025</p>
          </div>
          <div className="flex gap-6 text-gray-600 mt-10 text-sm flex-wrap">
            <button className="flex items-center gap-1 hover:text-black">
              <FiEdit /> Edit Topic
            </button>
            <button className="flex items-center gap-1 hover:text-black">
              <FiTrash2 /> Delete
            </button>
            <button className="flex items-center gap-1 hover:text-black">
              <FiDownload /> Download PDF
            </button>
          </div>
        </div>

        {/* Lesson Content */}
        <hr className="mb-10 text-[#E2E2E2]" />

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 lg:max-w-[75%] text-gray-700 leading-relaxed space-y-6 text-[15px]">
            <p className="whitespace-pre-line">{content.lesson}</p>
          </div>

          <div className="flex  justify-start items-start gap-4 text-gray-600 text-sm pt-1 min-w-[80px]">
            <button className="flex items-center gap-1 hover:text-black">
              <FiCopy size={16} /> Copy
            </button>
            <button className="flex items-center gap-1 hover:text-black">
              <FiShare2 size={16} /> Share
            </button>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="p-6 rounded-2xl w-full mt-12">
          <h4 className="font-semibold text-lg mb-4">
            Was this content helpful?
          </h4>

          <div className="flex justify-start mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-3xl cursor-pointer ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share your feedback (optional)"
            className="w-full p-4 bg-[#F6F6F6] rounded-md text-gray-600 resize-none mb-6"
            rows={4}
          />

          <button
            onClick={() => {
              alert(`Feedback Submitted!\nRating: ${rating}\n${feedback}`);
              setFeedback("");
              setRating(0);
            }}
            className="bg-cyan-500 text-white px-7 py-2 rounded-lg hover:bg-cyan-600 transition float-right"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

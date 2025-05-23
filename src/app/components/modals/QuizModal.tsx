"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { GeneratedContent } from "@/app/types/content";

interface Props {
  content: GeneratedContent;
  onClose: () => void;
}

export default function QuizModal({ content, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll
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

  const questions = content.quiz.split("\n").filter(Boolean); // Avoid empty lines

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center px-4">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-4xl h-[90vh] overflow-y-auto rounded-2xl p-6 relative shadow-lg"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-1">Quiz</h2>
          <p className="text-sm text-gray-500">Science - Beginner</p>
          <p className="text-sm text-gray-400 mb-6">
            Generated on April 30, 2025
          </p>
          <hr className="mb-10 text-[#E2E2E2]" />
        </div>

        {/* Questions */}
        <div className="space-y-10">
          {questions.map((q, idx) => (
            <div key={idx}>
              <p className="font-medium text-gray-800">
                Q: {idx + 1}/{questions.length}
              </p>
              <p className="mb-2 text-gray-700">{q}</p>
              <div className="flex gap-4 flex-wrap">
                <button className="bg-cyan-500 text-white px-5 py-1.5 rounded-md hover:bg-cyan-600 transition">
                  Yes
                </button>
                <button className="bg-gray-300 text-gray-800 px-5 py-1.5 rounded-md hover:bg-gray-400 transition">
                  No
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-12 text-right">
          <button className="bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-600 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

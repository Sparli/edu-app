"use client";

import { useState } from "react";
import { GenerateFormData, Subject, Level } from "@/app/types/content";

interface Props {
  onGenerate: (data: GenerateFormData) => void;
}

export default function Generate({ onGenerate }: Props) {
  const [form, setForm] = useState<GenerateFormData>({
    subject: "English",
    level: "Beginner",
    topic: "",
  });

  return (
    <div className="bg-[#F7F9FC] p-6 rounded-xl shadow-lg w-full max-w-md">
      {/* Subject Dropdown */}
      <div className="mb-4 border ">
        <label className="block text-sm font-medium text-cyan-500 mb-1 ">
          Choose Subject
        </label>
        <select
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value as Subject })
          }
          className="w-full px-4 py-2  border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option>English</option>
          <option>Math</option>
          <option>Science</option>
        </select>
      </div>

      {/* Level Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-cyan-500 mb-1">
          Choose Level
        </label>
        <select
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* Topic Input */}
      <div className="mb-4">
        <label className=" text-sm font-medium text-cyan-500 mb-1 flex items-center gap-1">
          Enter Topic
          <span className="text-xs text-gray-400">(e.g., Photosynthesis)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Photosynthesis or Ancient Egypt"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      </div>

      {/* Button */}
      <button
        className="w-full bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-cyan-600 transition"
        onClick={() => onGenerate(form)}
      >
        Generate Content →
      </button>
    </div>
  );
}

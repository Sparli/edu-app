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
    <div className="bg-[#AB79FF1A] lg:bg-[#F7F9FC] p-6 rounded-xl shadow-lg w-full max-w-xl">
      {/* Subject Dropdown */}
      <div className="mb-4 shadow-md border bg-white border-[#d1d9e7] p-2 rounded-lg ">
        <label className="block text-lg font-medium text-cyan-500 mb-1 ">
          Choose Subject
        </label>
        <select
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value as Subject })
          }
          className="w-full p-2 focus:outline-none text-xl "
        >
          <option>English</option>
          <option>Math</option>
          <option>Science</option>
        </select>
      </div>

      {/* Level Dropdown */}
      <div className="mb-4 shadow-md border bg-white border-[#d1d9e7] p-2 rounded-lg">
        <label className="block text-lg font-medium text-cyan-500 mb-1">
          Choose Level
        </label>
        <select
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
          className="w-full p-2 focus:outline-none text-xl "
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* Topic Input */}
      <div className="mb-4 shadow-md border bg-white border-[#d1d9e7] p-2 rounded-lg ">
        <label className=" text-lg font-medium text-cyan-500 mb-1 flex items-center gap-1">
          Enter Topic
        </label>
        <textarea
          rows={2}
          placeholder="e.g., Photosynthesis or Ancient Egypt"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="w-full h-28 resize-none focus:outline-none text-[#a1a8b4] text-lg p-1"
        />
      </div>

      {/* Button */}
      <button
        className="w-full  bg-cyan-500 text-white font-medium py-4 px-4 rounded-lg hover:bg-cyan-600 transition"
        onClick={() => onGenerate(form)}
      >
        Generate Content →
      </button>
    </div>
  );
}

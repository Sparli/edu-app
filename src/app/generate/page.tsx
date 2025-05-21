"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

import GeneratedContent from "@/app/components/GeneratedContent";
import { useState } from "react";
import type {
  GenerateFormData,
  GeneratedContent as IContent,
} from "../types/content";
import Generate from "../components/Generate";

export default function GenerateContentPage() {
  const [content, setContent] = useState<IContent | null>(null);

  const handleGenerate = (form: GenerateFormData) => {
    // Simulate AI generation
    setContent({
      lesson: `Photosynthesis is the process by which plants convert light energy into chemical energy. This process takes place in the chloroplasts of plant cells, specifically using the green pigment chlorophyll.`,
      quiz: `❓ Quiz on ${form.topic}\n1. What is ${form.topic}?\n2. How is it used in real life?`,
      reflection: `🪞 Reflect on ${form.topic}:\nHow does this relate to your personal learning experience?`,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <div className="flex-1 ">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        <h1 className="text-3xl font-bold mb-1 mt-10 ml-10">
          Generate New Learning Content
        </h1>
        <p className="text-gray-600 text-xl ml-10">
          Create engaging lessons, quizzes, and reflection questions in minutes.
        </p>
        <p className="text-[#8e9095] mb-6 text-lg ml-10">
          Use AI to generate lessons, quizzes, and learning ideas.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 mt-10 ml-10">
          <Generate onGenerate={handleGenerate} />
          {content && <GeneratedContent content={content} />}
        </div>
      </div>
    </div>
  );
}

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
      lesson: `📘 Introduction to ${form.topic}\n\n${form.topic} is a key concept in ${form.subject} for ${form.level} learners.`,
      quiz: `❓ Quiz on ${form.topic}\n1. What is ${form.topic}?\n2. How is it used in real life?`,
      reflection: `🪞 Reflect on ${form.topic}:\nHow does this relate to your personal learning experience?`,
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <Sidebar />
      <div className="flex-1 ">
        <Navbar />
        <h1 className="text-2xl font-bold mb-1 mt-10 ml-10">
          Generate New Learning Content
        </h1>
        <p className="text-gray-600 mb-6 mt-10 ml-10">
          Create engaging lessons, quizzes, and reflection questions in minutes.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 mt-10 ml-10">
          <Generate onGenerate={handleGenerate} />
          {content && <GeneratedContent content={content} />}
        </div>
      </div>
    </div>
  );
}

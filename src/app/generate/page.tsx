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
  const [meta, setMeta] = useState<GenerateFormData | null>(null);

  const handleGenerate = (form: GenerateFormData) => {
    setContent({
      lesson: `Photosynthesis is the process by which plants convert light energy into chemical energy. This process is essential for life on Earth as it produces oxygen and glucose from carbon dioxide and water.
      
      The process takes place in the chloroplasts, specifically using the green pigment called chlorophyll. During photosynthesis, plants absorb sunlight, water, and carbon dioxide to produce glucose and oxygen.
      
      The basic equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂`,
      quiz: `Photosynthesis occurs only at night.
      Plants use sunlight to make their own food.
      Carbon dioxide is a waste product of photosynthesis.
      Chlorophyll is the green pigment that helps plants absorb light.`,

      reflection: `🪞 Reflect on ${form.topic}:\nHow does this relate to your personal learning experience?`,
    });

    setMeta(form);
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <div className="flex-1 ">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        <h1 className="text-3xl font-bold mb-1 mt-10 ml-4 lg:ml-10">
          Generate New Learning Content
        </h1>
        <p className="text-gray-600 text-xl ml-4 lg:ml-10">
          Create engaging lessons, quizzes, and reflection questions in minutes.
        </p>
        <p className="text-[#8e9095] mb-6 text-lg ml-4 lg:ml-10">
          Use AI to generate lessons, quizzes, and learning ideas.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 p-4 mt-8 lg:ml-10">
          <Generate onGenerate={handleGenerate} />
          {content && meta && (
            <GeneratedContent
              content={content}
              meta={{
                topic: meta.topic,
                subject: meta.subject,
                level: meta.level,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

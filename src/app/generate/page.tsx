"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import GeneratedContent from "@/app/components/GeneratedContent";
import { useState, useEffect, useRef } from "react";
import type {
  GenerateFormData,
  GeneratedContent as IContent,
} from "../types/content";
import Generate from "../components/Generate";

export default function GenerateContentPage() {
  const [content, setContent] = useState<IContent | null>(null);
  const [meta, setMeta] = useState<GenerateFormData | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const resultRef = useRef<HTMLDivElement | null>(null); // ✅ NEW

  useEffect(() => {
    if (meta) {
      const t = translations[language];
      setContent({
        lesson: t.lesson_template,
        quiz: t.quiz_template,
        reflection: t.reflection_template(meta.topic),
      });

      // ✅ Scroll to content on mobile
      setTimeout(() => {
        if (window.innerWidth < 768 && resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300); // Give time for render
    }
  }, [language, meta]);

  const handleGenerate = (form: GenerateFormData) => {
    setMeta(form); // trigger regeneration
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        <h1 className="lg:text-3xl text-xl font-bold mb-1 mt-10 ml-4 lg:ml-10">
          {t.generate_page_title}
        </h1>
        <p className="text-gray-600 text-lg lg:text-xl ml-4 lg:ml-10">
          {t.generate_page_subtitle}
        </p>
        <p className="text-[#8e9095] mb-6 text-lg ml-4 lg:ml-10">
          {t.generate_page_desc}.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 p-4 mt-6 lg:ml-10">
          <Generate onGenerate={handleGenerate} />
          {content && meta && (
            <div ref={resultRef}>
              <GeneratedContent
                content={content}
                meta={{
                  topic: meta.topic,
                  subject: meta.subject,
                  level: meta.level,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

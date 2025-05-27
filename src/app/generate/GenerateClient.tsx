"use client";

import Navbar from "@/app/components/Navbar";
import { useSearchParams } from "next/navigation";
import type { Language, Level, Subject, Difficulty } from "../types/content";
import Sidebar from "@/app/components/Sidebar";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import GeneratedContent from "@/app/components/GeneratedContent";
import { useState, useEffect, useRef } from "react";
import type {
  QuickGenerateFormData,
  GeneratedContent as IContent,
} from "../types/content";
import Generate from "../components/Generate";

export default function GenerateClient() {
  const [content, setContent] = useState<IContent | null>(null);
  const [meta, setMeta] = useState<QuickGenerateFormData | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const resultRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const language = searchParams.get("language");
    const level = searchParams.get("level");
    const subject = searchParams.get("subject");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");

    if (language && level && subject && difficulty) {
      const parsedForm: QuickGenerateFormData = {
        language: language as Language,
        level: level as Level,
        subject: subject as Subject,
        difficulty: difficulty as Difficulty,
        topic: topic || "",
      };
      setMeta(parsedForm);
    }
  }, [searchParams]);

  useEffect(() => {
    if (meta) {
      const t = translations[language];
      setContent({
        lesson: t.lesson_template,
        quiz: t.quiz_template,
        reflection: t.reflection_template,
      });

      setTimeout(() => {
        if (window.innerWidth < 768 && resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  }, [language, meta]);

  const handleGenerate = (form: QuickGenerateFormData) => {
    setMeta(form);
  };

  return (
    <div className="flex min-h-screen bg-[#ffffff]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        <h1 className="lg:text-[33px] text-xl text-[#000000] font-semibold mb-1 mt-10 ml-4 lg:ml-10">
          {t.generate_page_title}
        </h1>
        <p className="text-[#4B5563] text-lg lg:text-2xl ml-4 lg:ml-10">
          {t.generate_page_subtitle}
        </p>
        <p className="text-[#9CA3AF] text-base ml-4 lg:ml-10">
          {t.generate_page_desc}.
        </p>

        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:ml-10">
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

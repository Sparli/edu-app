"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import CustomDropdown from "@/app/components/CustomDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import {
  Language,
  Level,
  Difficulty,
  Subject,
  QuickGenerateFormData,
} from "../types/content"; // Adjust path if needed

export default function QuickGenerate() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const quickGenerateRef = useRef<HTMLDivElement | null>(null);

  const [form, setForm] = useState<QuickGenerateFormData>({
    subject: "" as Subject,
    level: "" as Level, // Start empty and match on select
    difficulty: "" as Difficulty,
    language: "" as Language,
    topic: "",
  });

  // State for controlling dropdown visibility
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(null);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);

  // Refs for each dropdown
  const subjectMenuRef = useRef<HTMLDivElement | null>(null);
  const levelMenuRef = useRef<HTMLDivElement | null>(null);
  const difficultyMenuRef = useRef<HTMLDivElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const trigger = document.getElementById("subject-dropdown-trigger");

      if (
        subjectMenuRef.current &&
        !subjectMenuRef.current.contains(e.target as Node) &&
        trigger &&
        !trigger.contains(e.target as Node)
      ) {
        setIsSubjectMenuOpen(false);
      }

      if (
        levelMenuRef.current &&
        !levelMenuRef.current.contains(e.target as Node)
      )
        if (
          difficultyMenuRef.current &&
          !difficultyMenuRef.current.contains(e.target as Node)
        )
          if (
            languageMenuRef.current &&
            !languageMenuRef.current.contains(e.target as Node)
          ) {
          }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subject groups (same as Generate component)
  const subjectGroups = [
    {
      label: "Mathematics & Technology",
      subjects: ["Mathematics", "Science and Technology"],
    },
    {
      label: "Social Sciences",
      subjects: [
        "History and Citizenship Education",
        "Geography",
        "Contemporary World",
      ],
    },
    {
      label: "Arts",
      subjects: ["Visual Arts", "Music", "Drama", "Dance"],
    },
    {
      label: "Personal Development",
      subjects: [
        "Ethics and Religious Culture",
        "Physical Education and Health",
      ],
    },
  ];

  // Language, Level, and Difficulty options (flat lists)
  const languageOptions = [t.select_language, "English", "French"];
  const levelOptions = Object.values(t.levels);
  const difficultyOptions = Object.values(t.difficulties);

  // Handle form submission
  const handleGenerate = () => {
    // You can add logic here to handle form data if needed before routing
    const params = new URLSearchParams({
      language: form.language,
      level: form.level,
      subject: form.subject,
      difficulty: form.difficulty,
      topic: form.topic,
    });
    router.push(`/generate?${params.toString()}`);
  };

  return (
    <div
      ref={quickGenerateRef}
      className="bg-[#AB79FF1A] lg:bg-[#F7F9FC] rounded-2xl p-6 mt-8 min-h-[195.75px]"
    >
      <h2 className="text-[22.5px] font-semibold text-[#1F2937] mb-6">
        {t.quick_generate_title}
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-around content-center gap-10">
        {/* Custom Language Dropdown */}
        <CustomDropdown
          options={languageOptions}
          selected={form.language || t.select_language}
          onSelect={(val) => {
            if (val !== t.select_language)
              setForm({ ...form, language: val as Language });
          }}
          className="w-full"
        />

        {/* Custom Level Dropdown */}
        <CustomDropdown
          options={levelOptions}
          selected={t.levels[form.level] || t.select_level}
          onSelect={(val) => {
            if (val !== t.select_level) {
              const match = Object.entries(t.levels).find(([, v]) => v === val);
              if (match) setForm({ ...form, level: match[0] as Level });
            }
          }}
          className="w-full"
        />

        {/* Custom Subject Dropdown */}

        <div className="relative w-full bg-white border-1 border-gray-300 p-[6px] rounded-lg">
          <div
            id="subject-dropdown-trigger"
            onClick={() => {
              setIsSubjectMenuOpen((prev) => !prev);
            }}
            className="w-full p-3 text-lg bg-white rounded cursor-pointer flex items-center justify-between"
          >
            <span className={`${!form.subject ? "text-black" : "text-black"}`}>
              {form.subject
                ? t.subjects[form.subject as keyof typeof t.subjects]
                : t.select_subject}
            </span>

            {/* ✅ Translated */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {isSubjectMenuOpen && (
            <div
              ref={subjectMenuRef}
              className="absolute lg:bottom-18 left-0 mt-1 w-full bg-white z-50 shadow-lg border border-gray-300 text-base rounded"
            >
              {subjectGroups.map((group, idx) => (
                <div key={group.label}>
                  <div
                    className="flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      setExpandedGroupIdx(expandedGroupIdx === idx ? null : idx)
                    }
                  >
                    <span
                      className={`font-medium ${
                        expandedGroupIdx === idx
                          ? "text-cyan-600"
                          : "text-gray-800"
                      }`}
                    >
                      {
                        t.subjectGroups[
                          group.label as keyof typeof t.subjectGroups
                        ]
                      }{" "}
                      {/* ✅ Translated */}
                    </span>
                    {expandedGroupIdx === idx ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </div>

                  {expandedGroupIdx === idx && (
                    <div className="pl-6 pr-4 pb-2">
                      {group.subjects.map((subj) => (
                        <div
                          key={subj}
                          className={`py-1 cursor-pointer hover:text-cyan-600 ${
                            form.subject === subj
                              ? "text-cyan-600 font-semibold"
                              : ""
                          }`}
                          onClick={() => {
                            setForm({ ...form, subject: subj as Subject });
                            setIsSubjectMenuOpen(false);
                            setExpandedGroupIdx(null);
                          }}
                        >
                          • {t.subjects[subj as keyof typeof t.subjects]}{" "}
                          {/* ✅ Translated */}
                        </div>
                      ))}
                    </div>
                  )}
                  <hr className="border-gray-200 mx-4" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Difficulty Dropdown */}
        <CustomDropdown
          options={difficultyOptions}
          selected={t.difficulties[form.difficulty] || t.select_difficulty}
          onSelect={(val) => {
            if (val !== t.select_difficulty) {
              const match = Object.entries(t.difficulties).find(
                ([, v]) => v === val
              );
              if (match)
                setForm({ ...form, difficulty: match[0] as Difficulty });
            }
          }}
          className="w-full"
        />

        {/* Topic Input */}
        <div className="relative w-full  bg-white  p-2 border-1 border-gray-300 rounded-lg">
          <input
            type="text"
            placeholder={t.quick_enter_topic}
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
            className="w-full p-2 text-xl bg-white rounded focus:outline-none text-[#a1a8b4]"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className="w-full lg:w-auto px-8 py-4 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition whitespace-nowrap"
        >
          {t.quick_generate_button}
        </button>
      </div>
    </div>
  );
}

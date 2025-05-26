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
    subject: "Mathematics",
    level: "Primary",
    difficulty: "Beginner",
    language: "English",
    topic: "",
  });

  // State for controlling dropdown visibility
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(null);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const scrollToQuickGenerate = () => {
    setTimeout(() => {
      quickGenerateRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0); // delay to ensure dropdown toggle completes
  };

  // Refs for each dropdown
  const subjectMenuRef = useRef<HTMLDivElement | null>(null);
  const levelMenuRef = useRef<HTMLDivElement | null>(null);
  const difficultyMenuRef = useRef<HTMLDivElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  // Handle clicks outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        subjectMenuRef.current &&
        !subjectMenuRef.current.contains(e.target as Node)
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
  const languageOptions = ["English", "French"];
  const levelOptions = ["Primary", "Secondary"];
  const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

  // Handle form submission
  const handleGenerate = () => {
    // You can add logic here to handle form data if needed before routing
    router.push("/generate");
  };

  return (
    <div
      ref={quickGenerateRef}
      className="bg-[#AB79FF1A] lg:bg-[#F7F9FC] rounded-2xl p-6 mt-8 min-h-[195.75px]"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-6">
        {t.quick_generate_title}
      </h2>

      <div className="flex flex-col lg:flex-row items-center justify-around content-center gap-10">
        {/* Custom Language Dropdown */}
        <CustomDropdown
          label={t.quick_select_language}
          options={languageOptions}
          selected={form.language}
          onSelect={(val) => setForm({ ...form, language: val as Language })}
          className="w-full"
        />

        {/* Custom Level Dropdown */}
        <CustomDropdown
          label={t.quick_select_subject_level}
          options={levelOptions.map((lvl) => t.levels[lvl as Level])}
          selected={t.levels[form.level]}
          onSelect={(val) => {
            const match = Object.entries(t.levels).find(([, v]) => v === val);
            if (match) setForm({ ...form, level: match[0] as Level });
          }}
          className="w-full"
        />

        {/* Custom Subject Dropdown */}

        <div className="relative w-full shadow-md border bg-white border-[#d1d9e7] p-2 rounded-lg">
          <label className="block text-lg font-medium text-cyan-500 mb-1">
            {t.quick_select_subject}
          </label>
          <div
            onClick={() => {
              setIsSubjectMenuOpen(!isSubjectMenuOpen);
              scrollToQuickGenerate();
            }}
            className="w-full p-2 text-xl bg-white rounded cursor-pointer flex items-center justify-between"
          >
            <span>{t.subjects[form.subject as keyof typeof t.subjects]}</span>{" "}
            {/* ✅ Translated */}
            <svg
              className="w-4 h-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 28 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>

          {isSubjectMenuOpen && (
            <div
              ref={subjectMenuRef}
              className="absolute top-full left-0 mt-1 w-full bg-white z-50 shadow-lg border border-gray-300 text-base rounded"
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
          label={t.quick_select_level}
          options={difficultyOptions.map(
            (diff) => t.difficulties[diff as Difficulty]
          )}
          selected={t.difficulties[form.difficulty]}
          onSelect={(val) => {
            const match = Object.entries(t.difficulties).find(
              ([, v]) => v === val
            );
            if (match) setForm({ ...form, difficulty: match[0] as Difficulty });
          }}
          className="w-full"
        />

        {/* Topic Input */}
        <div className="relative w-full shadow-md border bg-white border-[#d1d9e7] p-2 rounded-lg">
          <label className="block text-lg font-medium text-cyan-500 mb-1">
            {t.quick_enter_topic}
          </label>
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

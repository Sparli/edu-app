"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

import LabalDropdown from "@/app/components/labal-dropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

// Define types for form data
type Subject =
  | "Mathematics"
  | "Science and Technology"
  | "History and Citizenship Education"
  | "Geography"
  | "Contemporary World"
  | "Visual Arts"
  | "Music"
  | "Drama"
  | "Dance"
  | "Ethics and Religious Culture"
  | "Physical Education and Health";

type Level = "Primary" | "Secondary";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Language = "English" | "French";

interface GenerateFormData {
  subject: Subject;
  level: Level;
  difficulty: Difficulty;
  language: Language;
  topic: string;
}

interface Props {
  onGenerate: (data: GenerateFormData) => void;
}

export default function Generate({ onGenerate }: Props) {
  const [form, setForm] = useState<GenerateFormData>({
    subject: "Mathematics",
    level: "Primary",
    difficulty: "Beginner",
    language: "English",
    topic: "",
  });
  const { language } = useLanguage();
  const t = translations[language];

  // State for controlling dropdown visibility
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(null);

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
      ) {
      }

      if (
        difficultyMenuRef.current &&
        !difficultyMenuRef.current.contains(e.target as Node)
      ) {
      }

      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(e.target as Node)
      ) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Subject groups (unchanged)
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

  return (
    <div className="bg-[#AB79FF1A] lg:bg-[#F7F9FC] p-6 rounded-xl shadow-lg w-full max-w-xl">
      {/* Custom Language Dropdown */}
      <LabalDropdown
        label={t.generate_language_label}
        options={languageOptions}
        selected={form.language}
        onSelect={(val) => setForm({ ...form, language: val as Language })}
        className="mb-2"
      />

      {/* Custom Level Dropdown */}
      <LabalDropdown
        label={t.generate_level_label}
        options={levelOptions.map((lvl) => t.levels[lvl as Level])}
        selected={t.levels[form.level]}
        onSelect={(val) => {
          const found = Object.entries(t.levels).find(([, v]) => v === val);
          if (found) setForm({ ...form, level: found[0] as Level });
        }}
        className="mb-2"
      />

      {/* Custom Subject Dropdown */}
      <div className="mb-2 relative w-full border-1 border-[#d1d9e7] bg-white  p-2 rounded-lg">
        <label className="block text-lg font-medium text-cyan-500 mb-1">
          {t.quick_select_subject}
        </label>
        <div
          onClick={() => {
            setIsSubjectMenuOpen(!isSubjectMenuOpen);
          }}
          className="w-full p-2 text-lg bg-white rounded cursor-pointer flex items-center justify-between"
        >
          <span>{t.subjects[form.subject as keyof typeof t.subjects]}</span>{" "}
          {/* ✅ translated subject */}
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
                    }
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
                        {/* ✅ translated */}
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

      <LabalDropdown
        label={t.generate_difficulty_label}
        options={difficultyOptions.map(
          (diff) => t.difficulties[diff as Difficulty]
        )}
        selected={t.difficulties[form.difficulty]}
        onSelect={(val) => {
          const found = Object.entries(t.difficulties).find(
            ([, v]) => v === val
          );
          if (found) setForm({ ...form, difficulty: found[0] as Difficulty });
        }}
        className="mb-2"
      />

      {/* Topic Textarea (unchanged) */}
      <div className="mb-2  border bg-white border-[#d1d9e7] p-2 rounded-lg">
        <label className="block text-lg font-medium text-cyan-500 mb-1">
          {t.generate_topic_label}
        </label>
        <textarea
          rows={2}
          placeholder={t.topic_placeholder}
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          className="w-full h-20 resize-none focus:outline-none text-[#a1a8b4] text-lg p-1"
        />
      </div>

      {/* Generate Button (unchanged) */}
      <button
        className="w-full bg-cyan-500 text-white font-medium py-4 px-4 rounded-lg hover:bg-cyan-600 transition"
        onClick={() => onGenerate(form)}
      >
        {t.generate_button}
      </button>
    </div>
  );
}

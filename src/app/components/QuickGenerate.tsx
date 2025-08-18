"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import CustomDropdown from "@/app/components/CustomDropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { useProfile } from "@/app/context/ProfileContext";

import type {
  GenerateRequest,
  Language,
  Level,
  Difficulty,
  Subject,
} from "@/app/types/content";
import UpgradeModal from "./GlobalPopup/UpgradeModal";

export default function QuickGenerate() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const quickGenerateRef = useRef<HTMLDivElement | null>(null);
  const [previousDifficulty, setPreviousDifficulty] =
    useState<Difficulty>("Beginner");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { profile } = useProfile();

  const [form, setForm] = useState<GenerateRequest>({
    subject: "" as Subject,
    level: "" as Level,
    difficulty: "" as Difficulty,
    language: "" as Language,
    topic: "",
    user_datetime: new Date().toISOString(), // ✅ Required field
  });

  // Map form.language (labels) → translation code; fallback to UI language code
  const toLangCode = (val?: string) =>
    val === "English"
      ? "en"
      : val === "French"
      ? "fr"
      : (language as "en" | "fr");

  // Use content language for field option labels (independent of UI)
  const tContent = translations[toLangCode(form.language)] || t;

  // local errors for each field
  const [errors, setErrors] = useState<
    Partial<Record<keyof GenerateRequest, string>>
  >({});

  /** field-by-field validator */
  const validateForm = (): boolean => {
    const newErr: Partial<Record<keyof GenerateRequest, string>> = {};

    if (!form.language) newErr.language = t.validation_language_required;
    if (!form.level) newErr.level = t.validation_level_required;
    if (!form.subject) newErr.subject = t.validation_subject_required;
    if (!form.difficulty) newErr.difficulty = t.validation_difficulty_required;
    if (!form.topic.trim()) newErr.topic = t.validation_topic_required;

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  /** disable Generate button until every field is filled */
  const isFormComplete = Object.values(form).every((v) =>
    typeof v === "string" ? v.trim().length > 0 : !!v
  );

  // State for controlling dropdown visibility
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(null);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);

  // Refs for each dropdown
  const subjectMenuRef = useRef<HTMLDivElement | null>(null);
  const levelMenuRef = useRef<HTMLDivElement | null>(null);
  const difficultyMenuRef = useRef<HTMLDivElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle form submission
  const handleGenerate = () => {
    if (!validateForm()) return;
    setIsLoading(true); // keep this for showing spinner on button
    const queryParams = new URLSearchParams({
      language: form.language,
      level: form.level,
      subject: form.subject,
      difficulty: form.difficulty,
      topic: form.topic,
      trigger: "1", // ✅ this is mandatory
    });

    router.push(`/generate?${queryParams.toString()}`);
  };

  const contentLangOptions = [
    {
      label: language === "en" ? "English" : "Anglais",
      value: "English",
    },
    {
      label: language === "en" ? "French" : "Français",
      value: "French",
    },
  ];

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
          label={t.generate_language_label}
          options={contentLangOptions}
          selected={
            form.language
              ? contentLangOptions.find((opt) => opt.value === form.language)
                  ?.label || ""
              : t.select_language
          }
          onSelect={(val) => {
            setForm({ ...form, language: val as Language });
            setErrors((e) => ({ ...e, language: undefined }));
          }}
          className="w-full mb-6"
          error={errors.language}
        />

        {/* 🎓 Level Dropdown */}
        <CustomDropdown
          label={t.generate_level_label}
          options={[
            { label: tContent.levels.Primary, value: "Primary" },
            { label: tContent.levels.Secondary, value: "Secondary" },
          ]}
          selected={
            form.level
              ? tContent.levels[form.level] // content-language label
              : t.select_level // fallback stays in UI language
          }
          onSelect={(val) => {
            setForm({ ...form, level: val as Level });
            setErrors((e) => ({ ...e, level: undefined }));
          }}
          className="w-full mb-6"
          error={errors.level}
        />

        {/* ────────── Custom Subject Dropdown (validated) ────────── */}
        <div
          className={`mb-6 relative w-full p-[6px] rounded-lg bg-white
    ${
      errors.subject
        ? "border-red-400 ring-1 ring-red-400"
        : "border-1 border-gray-300"
    }
  `}
        >
          {/* Trigger */}
          <div
            id="subject-dropdown-trigger"
            onClick={() => setIsSubjectMenuOpen((prev) => !prev)}
            className="w-full p-3 text-lg bg-white rounded cursor-pointer flex items-center justify-between"
          >
            <span>
              {form.subject
                ? tContent.subjects[
                    form.subject as keyof typeof tContent.subjects
                  ]
                : t.select_subject}{" "}
              {/* placeholder still in UI language */}
            </span>

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

          {/* Dropdown menu */}
          {isSubjectMenuOpen && (
            <div
              ref={subjectMenuRef}
              className="absolute lg:bottom-18 left-0 mt-1 w-full bg-white z-50 shadow-lg border border-gray-300 text-base rounded"
            >
              {subjectGroups.map((group, idx) => (
                <div key={group.label}>
                  {/* Group header */}
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
                        tContent.subjectGroups[
                          group.label as keyof typeof tContent.subjectGroups
                        ]
                      }
                    </span>
                    {expandedGroupIdx === idx ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </div>

                  {/* Group subjects */}
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

                            /* 🔄 clear validation error */
                            setErrors((e) => ({ ...e, subject: undefined }));

                            setIsSubjectMenuOpen(false);
                            setExpandedGroupIdx(null);
                          }}
                        >
                          •{" "}
                          {
                            tContent.subjects[
                              subj as keyof typeof tContent.subjects
                            ]
                          }
                        </div>
                      ))}
                    </div>
                  )}
                  <hr className="border-gray-200 mx-4" />
                </div>
              ))}
            </div>
          )}

          {/* Inline error text */}
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1 ml-1">{errors.subject}</p>
          )}
        </div>

        {/* Custom Difficulty Dropdown */}
        <CustomDropdown
          options={[
            { label: tContent.difficulties.Beginner, value: "Beginner" },
            {
              label: tContent.difficulties.Intermediate,
              value: "Intermediate",
            },
            {
              value: "Advanced",
              label: (
                <div className="flex justify-between items-center w-full pr-2">
                  <span>{tContent.difficulties.Advanced}</span>
                  {!profile?.is_subscribed && (
                    <FaCrown className="text-yellow-500 text-xl" />
                  )}
                </div>
              ),
            },
          ]}
          selected={
            form.difficulty
              ? tContent.difficulties[form.difficulty]
              : t.select_difficulty // fallback stays in UI language
          }
          onSelect={(val) => {
            const selectedKey = val as Difficulty;

            if (selectedKey === "Advanced" && !profile?.is_subscribed) {
              setPreviousDifficulty(form.difficulty);
              setShowPremiumModal(true);
              return;
            }

            setForm((prevForm) => ({
              ...prevForm,
              difficulty: selectedKey,
            }));

            setErrors((e) => ({ ...e, difficulty: undefined }));
          }}
          className="w-full mb-6"
          error={errors.difficulty}
        />

        {/* Topic Input */}
        <div className="flex flex-col w-full">
          <div className="bg-white p-2 border border-gray-300 rounded-lg">
            <input
              type="text"
              placeholder={tContent.quick_enter_topic}
              value={form.topic}
              onChange={(e) => {
                if (e.target.value.length <= 150) {
                  setForm({ ...form, topic: e.target.value });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  if (isFormComplete && !isLoading) {
                    handleGenerate(); // Triggers the same as clicking the button
                  }
                }
              }}
              className="w-full p-2 text-xl bg-white rounded focus:outline-none text-[#1F2937]"
            />
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">
            {form.topic.length}/150
          </p>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!isFormComplete || isLoading}
          className={`mb-6 w-full lg:w-auto px-8 py-4 rounded-lg font-medium transition
    flex items-center justify-center gap-2
    ${
      isFormComplete
        ? "bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
    ${isLoading ? "opacity-60" : ""}
  `}
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t.quick_generate_button_loading}
            </>
          ) : (
            t.quick_generate_button
          )}
        </button>
      </div>

      <UpgradeModal
        visible={showPremiumModal}
        onClose={() => {
          setShowPremiumModal(false);
          setForm((prev) => ({ ...prev, difficulty: previousDifficulty }));
        }}
        onUpgrade={() => {
          setShowPremiumModal(false);
          router.push("/subscription");
        }}
        title={t.upgrade_title}
        description={t.upgrade_description}
        cancelText={t.upgrade_cancel}
        upgradeText={t.upgrade_button}
      />
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import { clearQuizSubmission } from "@/app/components/modals/QuizModal";
import LabalDropdown from "@/app/components/labal-dropdown";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useProfile } from "@/app/context/ProfileContext";
import PremiumLockModal from "@/app/components/PremiumLockModal";
import { FaCrown } from "react-icons/fa";
import { getUserProfile } from "@/app/utils/getUserProfile";

import type {
  GenerateRequest,
  Language,
  Level,
  Subject,
  Difficulty,
} from "@/app/types/content";

interface Props {
  onGenerate: (data: GenerateRequest) => Promise<void>;
  initialData?: Partial<GenerateRequest>;
  loading?: boolean;
}

export default function Generate({ onGenerate, initialData, loading }: Props) {
  console.log("[Generate] mounted");
  const [form, setForm] = useState<GenerateRequest>({
    subject: initialData?.subject || "Mathematics",
    level: initialData?.level || "Primary",
    difficulty: initialData?.difficulty || "Beginner",
    language: initialData?.language || "English",
    topic: initialData?.topic || "",
    user_datetime: initialData?.user_datetime || new Date().toISOString(), // ✅ ADD THIS
  });

  // ⬇️ 1. local validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof GenerateRequest, string>>
  >({});

  /** ⬇️ 2. quick helper — returns true if *all* fields are filled */
  const isFormComplete = Object.values(form).every((v) =>
    typeof v === "string" ? v.trim().length > 0 : !!v
  );

  /** ⬇️ 3. field-level validator */
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof GenerateRequest, string>> = {};

    if (!form.language) newErrors.language = t.validation_language_required;
    if (!form.level) newErrors.level = t.validation_level_required;
    if (!form.subject) newErrors.subject = t.validation_subject_required;
    if (!form.difficulty)
      newErrors.difficulty = t.validation_difficulty_required;
    if (!form.topic.trim()) newErrors.topic = t.validation_topic_required;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (initialData) {
      setForm((prevForm) => ({
        ...prevForm,
        ...initialData,
      }));
    }
  }, [initialData]);

  const { language } = useLanguage();
  const t = translations[language];

  // 🔁 Reverse maps to convert French back to English before sending to backend
  const reverseLevelMap = Object.entries(translations.en.levels).reduce(
    (acc, [key, val]) => {
      acc[val] = key;
      return acc;
    },
    {} as Record<string, string>
  );

  const reverseDifficultyMap = Object.entries(
    translations.en.difficulties
  ).reduce((acc, [key, val]) => {
    acc[val] = key;
    return acc;
  }, {} as Record<string, string>);

  const reverseSubjectMap = Object.entries(translations.en.subjects).reduce(
    (acc, [key, val]) => {
      acc[val] = key;
      return acc;
    },
    {} as Record<string, string>
  );

  const clickLocked = useRef(false);

  // State for controlling dropdown visibility
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [expandedGroupIdx, setExpandedGroupIdx] = useState<number | null>(null);
  const { profile, setProfile } = useProfile();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [previousDifficulty, setPreviousDifficulty] =
    useState<Difficulty>("Beginner");

  // Refs for each dropdown
  const subjectMenuRef = useRef<HTMLDivElement | null>(null);
  const levelMenuRef = useRef<HTMLDivElement | null>(null);
  const difficultyMenuRef = useRef<HTMLDivElement | null>(null);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  // loading spinner
  const handleClick = async () => {
    if (clickLocked.current || !validateForm()) return;

    clickLocked.current = true; // ⛔ lock re-entry
    try {
      clearQuizSubmission();
      const translatedForm: GenerateRequest = {
        ...form,
        subject: (language === "fr"
          ? reverseSubjectMap[form.subject]
          : form.subject) as Subject,
        level: (language === "fr"
          ? reverseLevelMap[form.level]
          : form.level) as Level,
        difficulty: (language === "fr"
          ? reverseDifficultyMap[form.difficulty]
          : form.difficulty) as Difficulty,
      };

      await onGenerate(translatedForm);

      // ✅ Refresh quota after successful generation
      const updated = await getUserProfile();
      console.log("[DEBUG] fetched after generation:", updated);

      if (updated) {
        setProfile({
          ...updated,
          profile_image: updated.profile_image ?? undefined,
        });
        console.log("[DEBUG] setProfile called with updated quota");
      }
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      // 🔓 unlock after slight delay (avoid UI jitter re-clicks)
      setTimeout(() => {
        clickLocked.current = false;
      }, 1000);
    }
  };

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

  return (
    <div className="bg-[#AB79FF1A] lg:bg-[#F7F9FC] p-6 rounded-xl shadow-lg w-full max-w-xl">
      {/* Custom Language Dropdown */}
      <LabalDropdown
        label={t.generate_language_label}
        options={languageOptions}
        selected={form.language}
        onSelect={(val) => {
          setForm({ ...form, language: val as Language });

          /* ⬇ clear the field-level error once a valid choice is made */
          setErrors((e) => ({ ...e, language: undefined }));
        }}
        className="mb-2"
        error={errors.language}
      />

      {/* Custom Level Dropdown */}
      <LabalDropdown
        label={t.generate_level_label}
        options={levelOptions.map((lvl) => t.levels[lvl as Level])}
        selected={
          form.level
            ? t.levels[form.level]
            : t.select_level /* fallback label */
        }
        onSelect={(val) => {
          const found = Object.entries(t.levels).find(([, v]) => v === val);
          if (found) {
            setForm({ ...form, level: found[0] as Level });

            // 🔄 clear field-level error once a valid level is chosen
            setErrors((e) => ({ ...e, level: undefined }));
          }
        }}
        className="mb-2"
        error={errors.level}
      />

      {/* ───────── Custom Subject Dropdown (with validation) ───────── */}
      <div
        className={`mb-2 relative w-full p-2 rounded-lg bg-white
    ${
      errors.subject
        ? "border-red-400 ring-1 ring-red-400"
        : "border-1 border-[#d1d9e7]"
    }
  `}
      >
        <label className="block text-lg font-medium text-cyan-500 mb-1">
          {t.quick_select_subject}
        </label>

        {/* Trigger */}
        <div
          id="subject-dropdown-trigger"
          onClick={() => setIsSubjectMenuOpen((prev) => !prev)}
          className="w-full p-3 text-lg bg-white rounded cursor-pointer flex items-center justify-between"
        >
          <span>
            {/* fallback label when empty */}
            {form.subject
              ? t.subjects[form.subject as keyof typeof t.subjects]
              : t.select_subject}
          </span>

          {/* Chevron icon */}
          <svg
            className="w-4 h-4 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 28 28"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown menu */}
        {isSubjectMenuOpen && (
          <div
            ref={subjectMenuRef}
            className="absolute top-full left-0 mt-1 w-full bg-white z-50 shadow-lg border border-gray-300 text-base rounded"
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

                          // ⬇️ clear validation error
                          setErrors((e) => ({ ...e, subject: undefined }));

                          setIsSubjectMenuOpen(false);
                          setExpandedGroupIdx(null);
                        }}
                      >
                        • {t.subjects[subj as keyof typeof t.subjects]}
                      </div>
                    ))}
                  </div>
                )}
                <hr className="border-gray-200 mx-4" />
              </div>
            ))}
          </div>
        )}

        {/* Inline error message */}
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1 ml-1">{errors.subject}</p>
        )}
      </div>

      <LabalDropdown
        label={t.generate_difficulty_label}
        options={[
          { label: t.difficulties.Beginner, value: "Beginner" },
          { label: t.difficulties.Intermediate, value: "Intermediate" },
          {
            value: "Advanced",
            label: (
              <div className="flex justify-between items-center w-full pr-2">
                <span>{t.difficulties.Advanced}</span>
                {!profile?.is_subscribed && (
                  <FaCrown className="text-yellow-500 text-xl" />
                )}
              </div>
            ),
          },
        ]}
        selected={t.difficulties[form.difficulty]}
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
        className="mb-2"
        error={errors.difficulty}
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
          onChange={(e) => {
            if (e.target.value.length <= 150) {
              setForm({ ...form, topic: e.target.value });
            }
          }}
          className="w-full h-14 resize-none focus:outline-none text-[#a1a8b4] text-lg p-1"
        />
        <p className="text-right text-sm text-gray-500 mt-1">
          {form.topic.length}/150
        </p>
      </div>

      {/* Generate Button (unchanged) */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!isFormComplete || loading}
        className={`w-full px-8 py-4 rounded-lg font-medium transition
    flex items-center justify-center gap-2
    ${
      isFormComplete && !loading
        ? "bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }
    ${loading ? "opacity-60" : ""}`}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {t.generate_button_loading}
          </>
        ) : (
          t.generate_button
        )}
      </button>
      {showPremiumModal && (
        <PremiumLockModal
          t={t}
          onClose={() => {
            setShowPremiumModal(false);
            setForm((prev) => ({ ...prev, difficulty: previousDifficulty }));
          }}
        />
      )}
    </div>
  );
}

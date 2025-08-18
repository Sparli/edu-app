"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { IoTrashOutline } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import Dropdown from "@/app/components/dropdown";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import LessonModal from "./modals/LessonPreviewModal";
import authApi from "../utils/authApi"; // adjust the path if needed
import DeleteConfirmModal from "./DeleteConfirmModal";
import QuizPreviewModal from "./modals/QuizPreviewModal"; // adjust the path if needed
import ReflectionPreviewModal from "./modals/ReflectionPreviewModal";
import { useProfile } from "@/app/context/ProfileContext";
import UpgradeModal from "./GlobalPopup/UpgradeModal"; // adjust path if needed
import { useRouter } from "next/navigation";

type LessonPreview = {
  id: number;
  topic: string;
  subject: string;
  level: string;
  difficulty: string;
  language: string;
  created_at: string;
  generation_datetime: string;
  quiz_id: number | null; // ✅ Required (not optional)
  reflection_id: number | null;
};

const subjectGroups = [
  {
    label: "Mathematics & Technology",
    label_fr: "Mathématiques et Technologie",
    subjects: [
      { en: "Mathematics", fr: "Mathématiques" },
      { en: "Science and Technology", fr: "Sciences et Technologie" },
    ],
  },
  {
    label: "Social Sciences",
    label_fr: "Sciences sociales",
    subjects: [
      {
        en: "History and Citizenship Education",
        fr: "Histoire et éducation à la citoyenneté",
      },
      { en: "Geography", fr: "Géographie" },
      { en: "Contemporary World", fr: "Monde contemporain" },
    ],
  },
  {
    label: "Arts",
    label_fr: "Arts",
    subjects: [
      { en: "Visual Arts", fr: "Arts visuels" },
      { en: "Music", fr: "Musique" },
      { en: "Drama", fr: "Théâtre" },
      { en: "Dance", fr: "Danse" },
    ],
  },
  {
    label: "Personal Development",
    label_fr: "Développement personnel",
    subjects: [
      {
        en: "Ethics and Religious Culture",
        fr: "Éthique et culture religieuse",
      },
      {
        en: "Physical Education and Health",
        fr: "Éducation physique et à la santé",
      },
    ],
  },
];

const subjectIcons: Record<string, string> = {
  // 🧠 Mathematics & Technology
  Mathematics: "/images/math.svg", // Suggest: calculator, π, math symbols
  "Science and Technology": "/images/science.svg", // Suggest: beaker, gear, atom

  // 🏛️ Social Sciences
  "History and Citizenship Education": "/images/history.svg", // Suggest: scroll, shield, flag
  Geography: "/images/globe.svg", // Suggest: globe or map
  "Contemporary World": "/images/world.svg", // Suggest: earth, network, politics

  // 🎭 Arts
  "Visual Arts": "/images/art.svg", // Suggest: paintbrush, palette
  Music: "/images/music.svg", // Suggest: music note
  Drama: "/images/drama.svg", // Suggest: theatre mask
  Dance: "/images/dance.svg", // Suggest: person dancing icon

  // 🧘 Personal Development
  "Ethics and Religious Culture": "/images/ethics.svg", // Suggest: yin-yang, balance
  "Physical Education and Health": "/images/health.svg", // Suggest: heart, dumbbell
};

// ---- helpers: content-language & subject mapping ----
// const contentLangCode = (lang: string) => (lang === "French" ? "fr" : "en");

// Map any subject label (EN/FR) to the EN key (for icons/lookups)
const toEnglishSubject = (label: string) => {
  for (const group of subjectGroups) {
    for (const subj of group.subjects) {
      if (label === subj.en || label === subj.fr) return subj.en;
    }
  }
  return label;
};

// Get display label for the subject in the *item’s* content language
const subjectLabelFor = (subject: string, itemLanguage: string) => {
  const targetFr = itemLanguage === "French";
  for (const group of subjectGroups) {
    for (const subj of group.subjects) {
      if (subject === subj.en || subject === subj.fr) {
        return targetFr ? subj.fr : subj.en;
      }
    }
  }
  return subject;
};

// Localize the language name using the global UI language
const uiLanguageName = (
  contentLang: "English" | "French",
  uiLangCode: "en" | "fr" | string
) => {
  const isFR = uiLangCode === "fr";
  if (contentLang === "French") return isFR ? "Français" : "French";
  return isFR ? "Anglais" : "English";
};

// Map UI language code ('en' | 'fr') to a BCP-47 locale for dates
const uiDateLocale = (uiLang: string) => (uiLang === "fr" ? "fr" : "en");

// English-only title case (keeps common small words lowercased unless first/last)
const englishTitleCase = (input: string) => {
  const small = new Set([
    "a",
    "an",
    "and",
    "as",
    "at",
    "but",
    "by",
    "for",
    "from",
    "in",
    "into",
    "nor",
    "of",
    "on",
    "or",
    "over",
    "per",
    "the",
    "to",
    "via",
    "with",
  ]);
  return input
    .split(/\s+/)
    .map((word, i, arr) => {
      const w = word.toLowerCase();
      const isBoundary = i === 0 || i === arr.length - 1;
      if (!isBoundary && small.has(w)) return w;
      // handle hyphenated words like “state-of-the-art”
      return w
        .split("-")
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join("-");
    })
    .join(" ");
};

export default function MyContentPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const subjectOptions = subjectGroups.flatMap((group) =>
    group.subjects.map((subj) => ({
      label: language === "fr" ? subj.fr : subj.en, // shown in dropdown
      value: subj.en, // sent to backend
    }))
  );

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSort, setSelectedSort] = useState("Newest");
  const [lessons, setLessons] = useState<LessonPreview[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [selectedReflectionId, setSelectedReflectionId] = useState<
    number | null
  >(null);
  const { profile } = useProfile();
  const isSubscribed = profile?.is_subscribed === true;
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
  const [selectedQuizLanguage, setSelectedQuizLanguage] = useState<
    "English" | "French" | null
  >(null);
  const [selectedReflectionLanguage, setSelectedReflectionLanguage] = useState<
    "English" | "French" | null
  >(null);

  // Cleat Filter

  const clearFilters = () => {
    setSelectedSubject("");
    setSelectedLevel("");
    setSelectedSort("Newest"); // optional: reset to default
    setSearchTerm("");
    fetchLessons(); // refresh list
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLessons = useCallback(
    async (url?: string) => {
      setIsLoading(true);

      try {
        const queryParams = new URLSearchParams();
        if (selectedSubject) queryParams.append("subject", selectedSubject);
        if (selectedLevel) queryParams.append("difficulty", selectedLevel);
        if (selectedSort === "Oldest") {
          queryParams.append("sort_by", "asc");
        } else if (selectedSort === "Newest") {
          queryParams.append("sort_by", "desc");
        }
        if (searchTerm.trim()) {
          queryParams.append("search", searchTerm.trim());
        }

        console.log(queryParams.toString());
        let finalUrl = url || `history/preview/?${queryParams.toString()}`; // note: no `/` in beginning

        if (finalUrl.startsWith("http")) {
          const parsed = new URL(finalUrl);
          finalUrl = parsed.pathname + parsed.search;

          if (finalUrl.startsWith("/api/")) {
            finalUrl = finalUrl.replace(/^\/api/, ""); // remove duplicate api
          }
        }

        const res = await authApi.get(finalUrl);

        const data = res.data.response;

        setLessons(data.results);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        console.error("[MyContentPage] ❌ Failed to fetch lessons", err);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSubject, selectedLevel, selectedSort, searchTerm]
  );

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const [showFilters, setShowFilters] = useState(false);

  // You can calculate how many filters are active
  const activeFilterCount = (selectedSubject ? 1 : 0) + (selectedLevel ? 1 : 0);

  return (
    <div className="flex flex-col min-h-[90vh] p-6 w-full">
      {/* Main Content Area */}
      <div className="flex-grow">
        <h1 className="text-[33px] font-semibold mb-1">{t.my_content_title}</h1>
        <p className="text-[#4A4A4A] mb-6 font-normal text-[22px]">
          {t.my_content_subtitle}
        </p>

        {/* Filter + Sort Bar */}
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-row justify-between items-start sm:items-center gap-3">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] rounded-md cursor-pointer text-gray-700"
              >
                Filter ({activeFilterCount})
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showFilters && (
                <div
                  className="absolute top-full mt-2 left-0 z-10 bg-white border border-gray-300 rounded-lg shadow-md p-4 w-72"
                  ref={filterRef}
                >
                  <div className="flex flex-col gap-3">
                    <Dropdown
                      options={[
                        { label: t.select_subject, value: "" },
                        ...subjectOptions,
                      ]}
                      selected={selectedSubject}
                      onSelect={setSelectedSubject}
                      placeholder={t.filter_subject}
                      className="w-full"
                    />
                    <Dropdown
                      options={[
                        { label: "", value: "" },
                        {
                          label: language === "fr" ? "Débutant" : "Beginner",
                          value: "Beginner",
                        },
                        {
                          label:
                            language === "fr"
                              ? "Intermédiaire"
                              : "Intermediate",
                          value: "Intermediate",
                        },
                        {
                          label: language === "fr" ? "Avancé" : "Advanced",
                          value: "Advanced",
                        },
                      ]}
                      selected={selectedLevel}
                      onSelect={setSelectedLevel}
                      placeholder={t.filter_level}
                      className="w-full"
                    />

                    {(selectedSubject || selectedLevel || searchTerm) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-600 hover:underline whitespace-nowrap cursor-pointer"
                      >
                        {language === "fr"
                          ? "Réinitialiser les filtres"
                          : "Clear Filters"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{t.sort_by}:</span>
              <Dropdown
                options={[
                  {
                    label: language === "fr" ? "Le plus récent" : "Newest",
                    value: "Newest",
                  },
                  {
                    label: language === "fr" ? "Le plus ancien" : "Oldest",
                    value: "Oldest",
                  },
                ]}
                selected={selectedSort}
                onSelect={setSelectedSort}
                placeholder={t.filter_sort}
                className="lg:w-40"
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t.search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchLessons();
              }}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-[#F6F6F6] focus:outline-none"
            />

            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Lesson Cards */}

        {isLoading ? (
          <div className="flex justify-center items-center h-[300px] w-full">
            <div className="animate-spin h-10 w-10 rounded-full border-t-4 border-cyan-500 border-opacity-60" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-12 text-center text-gray-500">
            <Image
              src="/images/book.jpg" // optional icon
              alt="No content"
              width={150}
              height={150}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold">
              {t.no_content_title || "No content yet"}
            </h2>
            <p className="text-md mt-2">
              {t.no_content_subtitle || "Start by generating some lessons."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {lessons.map((item, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden shadow-md bg-[#DAE9FF]"
              >
                <div className="h-2 w-full bg-gradient-to-r from-[#0463EF] to-[#16EA9E] rounded-t-2xl"></div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-lg gap-2 font-semibold text-gray-800">
                      {(() => {
                        const enKey = toEnglishSubject(item.subject);
                        const display = subjectLabelFor(
                          item.subject,
                          item.language
                        );
                        return (
                          <>
                            <Image
                              src={subjectIcons[enKey] || "/images/default.svg"}
                              alt={display}
                              width={25}
                              height={25}
                            />
                            {display}
                          </>
                        );
                      })()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ prevent opening the modal
                        setLessonToDelete(item.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-500 bg-red-100 p-1 rounded-full cursor-pointer hover:bg-red-200 transition"
                      title="Delete Lesson"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                  <div className="mb-4 mt-4 inline-block rounded-full bg-[#C2D7F3] text-[#1D4ED8] text-lg px-3 py-1">
                    {
                      translations[language].difficulties[
                        item.difficulty as
                          | "Beginner"
                          | "Intermediate"
                          | "Advanced"
                      ]
                    }
                  </div>
                  <div className="mb-4 mt-4 ml-4 inline-block rounded-full bg-[#C2D7F3] text-[#1D4ED8] text-lg px-3 py-1">
                    {uiLanguageName(
                      item.language as "English" | "French",
                      language
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-1 mb-1">
                    {item.generation_datetime
                      ? new Date(item.generation_datetime).toLocaleDateString(
                          uiDateLocale(language),
                          { year: "numeric", month: "long", day: "numeric" }
                        )
                      : "—"}
                  </p>

                  <h2 className="font-semibold lg:text-lg mb-8">
                    {item.language === "English"
                      ? englishTitleCase(item.topic)
                      : item.topic}
                  </h2>

                  <div className="flex gap-3 items-center">
                    <button
                      onClick={() => setSelectedLessonId(item.id)}
                      className="bg-[#23BAD8] hover:bg-cyan-600 cursor-pointer text-white px-4 lg:py-[10px] py-2 lg:w-1/3 w-full rounded-xl text-lg"
                    >
                      {t.tab_lesson}
                    </button>
                    <button
                      onClick={() => {
                        if (!isSubscribed) {
                          setShowUpgradeModal(true);
                        } else {
                          setSelectedQuizId(item.quiz_id);
                          // ADD:
                          setSelectedQuizLanguage(
                            item.language as "English" | "French"
                          );
                        }
                      }}
                      className={`px-4 lg:py-[10px] py-2 lg:w-1/3 w-full rounded-xl text-lg ${
                        isSubscribed
                          ? "bg-[#23BAD8] hover:bg-cyan-600 cursor-pointer text-white"
                          : "bg-gray-300 text-gray-600 cursor-pointer"
                      }`}
                    >
                      {t.tab_quiz}
                    </button>

                    <button
                      onClick={() => {
                        if (!isSubscribed) {
                          setShowUpgradeModal(true);
                        } else {
                          setSelectedReflectionId(item.reflection_id);
                          setSelectedReflectionLanguage(
                            item.language as "English" | "French"
                          ); // ⬅️ add
                        }
                      }}
                      className={`px-4 lg:py-[10px] py-2 lg:w-1/3 w-full rounded-xl text-lg ${
                        isSubscribed
                          ? "bg-[#23BAD8] hover:bg-cyan-600 cursor-pointer text-white"
                          : "bg-gray-300 text-gray-600 cursor-pointer"
                      }`}
                    >
                      {t.tab_reflection}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedLessonId && (
          <LessonModal
            lessonId={selectedLessonId}
            onClose={() => setSelectedLessonId(null)}
          />
        )}
      </div>

      {/* Pagination Area (bottom-right) */}
      {(prevPageUrl || nextPageUrl) && (
        <div className="flex justify-end mt-8 mb-4 pr-4">
          <div className="flex gap-3">
            <button
              onClick={() => fetchLessons(prevPageUrl!)}
              disabled={!prevPageUrl || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition ${
                prevPageUrl && !isLoading
                  ? "bg-white hover:bg-gray-100 text-gray-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiArrowLeft size={18} />
              {t.previous}
            </button>

            <button
              onClick={() => fetchLessons(nextPageUrl!)}
              disabled={!nextPageUrl || isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border transition ${
                nextPageUrl && !isLoading
                  ? "bg-white hover:bg-gray-100 text-gray-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {t.next}
              <FiArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && lessonToDelete !== null && (
        <DeleteConfirmModal
          onCancel={() => {
            setShowDeleteModal(false);
            setLessonToDelete(null);
          }}
          onConfirm={async () => {
            try {
              const res = await authApi.delete(
                `/history/delete/${lessonToDelete}/`
              );
              if (res.data.success) {
                fetchLessons(); // refresh after delete
              } else {
                alert(res.data.error || "Failed to delete lesson.");
              }
            } catch (err) {
              console.error("[Delete] ❌", err);
              alert("An error occurred while deleting.");
            } finally {
              setShowDeleteModal(false);
              setLessonToDelete(null);
            }
          }}
        />
      )}

      {selectedQuizId && (
        <QuizPreviewModal
          quizId={selectedQuizId}
          contentLanguage={selectedQuizLanguage ?? "English"}
          onClose={() => {
            setSelectedQuizId(null);
            setSelectedQuizLanguage(null);
          }}
        />
      )}

      {selectedReflectionId && (
        <ReflectionPreviewModal
          reflectionId={selectedReflectionId}
          contentLanguage={selectedReflectionLanguage ?? "English"} // ⬅️ add
          onClose={() => {
            setSelectedReflectionId(null);
            setSelectedReflectionLanguage(null); // ⬅️ reset
          }}
        />
      )}

      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
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

"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

type EntryType = "Lesson" | "Quiz" | "Notes";

interface JournalEntry {
  id: string;
  title: string;
  subject: string;
  timeAgo: string; // "02 hrs ago", "01 day ago", etc.
  type: EntryType;
  progress?: string; // optional, e.g. "85%" for quiz
  color: string; // tailwind bg color for avatar (e.g., "bg-cyan-100")
  icon: string; // tailwind text color for icon (e.g., "text-cyan-600")
}

interface ProgressJournalsProps {
  entries?: JournalEntry[];
  onOpen?: (id: string) => void; // optional click handler for the pill
}

const ProgressJournals: React.FC<ProgressJournalsProps> = ({
  entries,
  onOpen,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Create translated default entries
  const defaultEntries: JournalEntry[] = [
    {
      id: "1",
      title: t.progress_journals_quadratic_equations,
      subject: t.progress_journals_mathematics,
      timeAgo: `02 ${t.progress_journals_hrs_ago} ago`,
      type: "Lesson",
      color: "bg-[#DAF9FF]",
      icon: "/PremImages/progressBl.png",
    },
    {
      id: "2",
      title: t.progress_journals_physics_quiz,
      subject: t.progress_journals_physics,
      progress: "85%",
      timeAgo: `05 ${t.progress_journals_hrs_ago} ago`,
      type: "Quiz",
      color: "bg-[#FFF7E3]",
      icon: "/PremImages/progressYl.png",
    },
    {
      id: "3",
      title: t.progress_journals_chemical_bonding,
      subject: t.progress_journals_chemistry,
      timeAgo: `01 ${t.progress_journals_day_ago} ago`,
      type: "Notes",
      color: "bg-[#DAFFF3]",
      icon: "/PremImages/progressGr.png",
    },
  ];

  const typeStyles: Record<EntryType, string> = {
    Lesson: "bg-white text-gray-900 border border-gray-200",
    Quiz: "bg-white text-gray-900 border border-gray-200",
    Notes: "bg-white text-gray-900 border border-gray-200",
  };

  // Create type translation mapping
  const typeTranslations: Record<EntryType, string> = {
    Lesson: t.progress_journals_lesson,
    Quiz: t.progress_journals_quiz,
    Notes: t.progress_journals_notes,
  };

  const displayEntries = entries || defaultEntries;

  return (
    <div className="w-full h-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[10px]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="">
         <Image src="/PremImages/progressBl.png" alt={t.progress_journals_alt} width={28} height={28} />
        </div>
        <h3 className="text-base font-bold text-gray-900">{t.progress_journals_title}</h3>
      </div>

      {/* List */}
      <ul className="">
        {displayEntries.map((e) => (
          <li
            key={e.id}
            className="flex items-center justify-between gap-4 py-4"
          >
            {/* Left: avatar + text */}
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full ${e.color}`}
              >
                <Image src={e.icon} alt={t.progress_journals_alt} width={28} height={28} />
              </div>
              <div className="min-w-0">
                <p className="truncate sm:text-[16px] text-[14px] font-bold text-[#191818]">
                  {e.title}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-xs text-[#4A4A4A]">
                  <span>{e.subject}</span>
                  {e.progress ? (
                    <>
                      <span>•</span>
                      <span>{e.progress}</span>
                    </>
                  ) : null}
                  <span>•</span>
                  <span>{e.timeAgo}</span>
                </p>
              </div>
            </div>

            {/* Right: pill */}
            <button
              onClick={() => onOpen?.(e.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold shadow-sm transition
              hover:bg-gray-50 ${typeStyles[e.type]}`}
            >
              {typeTranslations[e.type]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressJournals;

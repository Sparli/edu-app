"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IoTrashOutline } from "react-icons/io5";
import { BsSearch } from "react-icons/bs";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import Dropdown from "@/app/components/dropdown";

const content = [
  {
    subject: "Mathematics",
    level: "Intermediate",
    date: "Jan 15, 2024",
    title: "Quadratic Equations",
    icon: "/images/bok.svg",
  },
  {
    subject: "Science and Technology",
    level: "Beginner",
    date: "Jan 15, 2024",
    title: "Photosynthesis",
    icon: "/images/sci.svg",
  },
  {
    subject: "English",
    level: "Advanced",
    date: "Jan 15, 2024",
    title: "Shakespeare's Sonnets",
    icon: "/images/en.svg",
  },
  {
    subject: "History and Citizenship Education",
    level: "Intermediate",
    date: "Jan 15, 2024",
    title: "World War II Overview",
    icon: "/images/his.svg",
  },
  {
    subject: "Visual Arts",
    level: "Advanced",
    date: "Jan 15, 2024",
    title: "Art Movements",
    icon: "/images/en.svg",
  },
  {
    subject: "Ethics and Religious Culture",
    level: "Intermediate",
    date: "Jan 15, 2024",
    title: "Moral Dilemmas",
    icon: "/images/his.svg",
  },
];

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

export default function MyContentPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const subjectOptions = subjectGroups.flatMap((group) =>
    group.subjects.map((subj) => (language === "fr" ? subj.fr : subj.en))
  );

  const [selectedSubject, setSelectedSubject] = useState(t.filter_subject);
  const [selectedLevel, setSelectedLevel] = useState(t.filter_level);
  const [selectedSort, setSelectedSort] = useState(t.filter_sort);

  const translateSubject = (subject: string): string => {
    for (const group of subjectGroups) {
      for (const subj of group.subjects) {
        if (subj.en === subject || subj.fr === subject) {
          return language === "fr" ? subj.fr : subj.en;
        }
      }
    }
    return subject;
  };

  return (
    <div className="lg:p-10 p-6 w-full">
      <h1 className="text-3xl font-bold mb-2">{t.my_content_title}</h1>
      <p className="text-gray-600 mb-6 text-lg">{t.my_content_subtitle}</p>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative lg:w-1/2 w-full">
          <input
            type="text"
            placeholder={t.search_placeholder}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-[#F6F6F6] focus:outline-none"
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Dropdown
            options={[t.filter_subject, ...subjectOptions]}
            selected={selectedSubject}
            onSelect={setSelectedSubject}
            className="w-40"
          />
          <Dropdown
            options={[t.filter_level, "Beginner", "Intermediate", "Advanced"]}
            selected={selectedLevel}
            onSelect={setSelectedLevel}
            className="w-40"
          />
          <Dropdown
            options={[t.filter_sort, "Newest", "Oldest"]}
            selected={selectedSort}
            onSelect={setSelectedSort}
            className="w-40"
          />
        </div>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {content.map((item, index) => (
          <div
            key={index}
            className="relative rounded-2xl min-h-[250px] overflow-hidden shadow-md bg-[#DAE9FF]"
          >
            <div className="h-2 w-full bg-gradient-to-r from-[#0463EF] to-[#16EA9E] rounded-t-2xl"></div>

            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-lg gap-2 font-semibold text-gray-800">
                  <Image
                    src={item.icon}
                    alt={item.subject}
                    width={20}
                    height={20}
                  />
                  {translateSubject(item.subject)}
                </div>
                <button className="text-red-500 bg-red-100 p-1 rounded-full hover:bg-red-200 transition">
                  <IoTrashOutline size={18} />
                </button>
              </div>

              <div className="mb-4 mt-4 inline-block rounded-full bg-[#C2D7F3] text-[#1D4ED8] text-lg px-3 py-1">
                {item.level}
              </div>

              <p className="text-sm text-gray-500 mt-1 mb-1">{item.date}</p>
              <h2 className="font-bold lg:text-2xl mb-8">{item.title}</h2>

              <div className="flex gap-3">
                <button className="bg-[#23BAD8] hover:bg-cyan-600 text-white px-4 lg:py-[10px] py-2 lg:w-1/3 w-full rounded-xl text-lg">
                  {t.view_button}
                </button>
                <button className="bg-white text-gray-700 px-4 lg:py-[10px] rounded-xl py-2 lg:w-1/3 w-full text-lg">
                  {t.edit_topic_button}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

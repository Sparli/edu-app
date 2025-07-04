"use client";
import React, { useState } from "react";
import ChatBot from "./ChatBot";
import Image from "next/image";
import { ChevronDown } from "lucide-react"; // you can replace this if you want a different icon
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BsSearch } from "react-icons/bs";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQPage({
  title,
  subtitle,
  faqs,
}: {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 4;

  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * faqsPerPage,
    currentPage * faqsPerPage
  );

  return (
    <div className="w-full px-6 md:px-12 py-5">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-[33px] font-bold text-gray-900">
          {title}
        </h1>
        <p className="text-xl text-gray-500">{subtitle}</p>
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder={t.faq_search_placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on new search
          }}
          className="w-full pl-10 pr-4 py-4 mb-6 rounded-lg border border-gray-300 bg-[#F6F6F6] focus:outline-none"
        />

        <BsSearch className="absolute left-3 top-7 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left visual panel */}
        <div className="lg:w-1/3 w-full lg:flex flex-col hidden mt-26 items-center">
          <Image
            src="/images/help-center.svg"
            alt="Help Bubble"
            width={300}
            height={300}
            className="object-contain mb-4 "
          />
          <h3 className="font-bold text-gray-800 text-xl lg:text-[28px]">
            {t.faq_sidebar_title}
          </h3>
          <p className="text-gray-500 text-sm text-center px-4 mt-2">
            {t.faq_sidebar_description}
          </p>
        </div>

        {/* Right FAQ panel */}
        <div className="relative w-full max-w-3xl mx-auto min-h-[580px]">
          {/* FAQ List */}
          <div className="flex flex-col gap-6 pb-20">
            {" "}
            {/* Add bottom padding */}
            {paginatedFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white shadow-lg py-8 rounded-md transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex justify-between cursor-pointer items-center text-left px-6 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 min-w-[24px] min-h-[24px] flex items-center justify-center">
                        <Image
                          src="/images/icon.png"
                          alt="FAQ Icon"
                          width={20}
                          height={20}
                          className="object-contain w-[20px] h-[20px]"
                        />
                      </div>

                      <span className="text-[#1F2937] text-[16px] font-semibold">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-2 text-[#1F2937] text-sm leading-relaxed ml-9">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination pinned inside container */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-3 items-center px-4 py-2">
            {/* Left arrow */}
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`text-[#1F2937] hover:text-blue-600  ${
                currentPage === 1 ? "opacity-40" : "cursor-pointer"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-md text-[16px] font-medium cursor-pointer ${
                  page === currentPage
                    ? "bg-gradient-to-tr from-[#0463EF] to-[#16EA9E] text-white shadow"
                    : "text-[#1F2937] hover:text-blue-600"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Right arrow */}
            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`text-[#1F2937] hover:text-blue-600 ${
                currentPage === totalPages ? "opacity-40 " : "cursor-pointer"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot component */}

      <ChatBot />
    </div>
  );
}

"use client";
import FAQPage from "@/app/components/FAQPage";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function ProductGuidelinePage() {
  const { language } = useLanguage();
  const t = translations[language];

  const faqs = [
    {
      question: t.product_faq_1_question,
      answer: t.product_faq_1_answer,
    },
    {
      question: t.product_faq_2_question,
      answer: t.product_faq_2_answer,
    },
    {
      question: t.product_faq_3_question,
      answer: t.product_faq_3_answer,
    },
    {
      question: t.product_faq_4_question,
      answer: t.product_faq_4_answer,
    },
    {
      question: t.product_faq_5_question,
      answer: t.product_faq_5_answer,
    },
    {
      question: t.product_faq_6_question,
      answer: t.product_faq_6_answer,
    },
    {
      question: t.product_faq_7_question,
      answer: t.product_faq_7_answer,
    },
    {
      question: t.product_faq_8_question,
      answer: t.product_faq_8_answer,
    },
    {
      question: t.product_faq_9_question,
      answer: t.product_faq_9_answer,
    },
    {
      question: t.product_faq_10_question,
      answer: t.product_faq_10_answer,
    },
    {
      question: t.product_faq_11_question,
      answer: t.product_faq_11_answer,
    },
    {
      question: t.product_faq_12_question,
      answer: t.product_faq_12_answer,
    },
  ];

  return (
    <FAQPage
      title={t.product_faq_title}
      subtitle={t.product_faq_subtitle}
      faqs={faqs}
    />
  );
}

// sections/help/PaymentPage.tsx
"use client";
import FAQPage from "@/app/components/FAQPage";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

export default function PaymentPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const faqs = [
    {
      question: t.payment_faq_1_question,
      answer: t.payment_faq_1_answer,
    },
    {
      question: t.payment_faq_2_question,
      answer: t.payment_faq_2_answer,
    },
    {
      question: t.payment_faq_3_question,
      answer: t.payment_faq_3_answer,
    },
    {
      question: t.payment_faq_4_question,
      answer: t.payment_faq_4_answer,
    },
    {
      question: t.payment_faq_5_question,
      answer: t.payment_faq_5_answer,
    },
    {
      question: t.payment_faq_6_question,
      answer: t.payment_faq_6_answer,
    },
    {
      question: t.payment_faq_7_question,
      answer: t.payment_faq_7_answer,
    },
    {
      question: t.payment_faq_8_question,
      answer: t.payment_faq_8_answer,
    },
    {
      question: t.payment_faq_9_question,
      answer: t.payment_faq_9_answer,
    },
    {
      question: t.payment_faq_10_question,
      answer: t.payment_faq_10_answer,
    },
  ];

  return (
    <FAQPage
      title={t.payment_faq_title}
      subtitle={t.payment_faq_subtitle}
      faqs={faqs}
    />
  );
}

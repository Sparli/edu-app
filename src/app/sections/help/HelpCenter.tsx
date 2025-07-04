"use client";
import React from "react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../../translations";
import ChatBot from "../../components/ChatBot";
import { useRouter } from "next/navigation";

const HelpCenter = () => {
  const { language } = useLanguage();
  const router = useRouter();
  const t = translations[language];
  const [activeCardIndex, setActiveCardIndex] = React.useState<number | null>(
    null
  );

  const features = [
    {
      icon: "/images/pay.svg",
      title: t.feature_payment_title,
      description: t.feature_payment_desc,
      bg: "bg-[#F7F9FC]",
    },
    {
      icon: "/images/veri.svg",
      title: t.feature_verification_title,
      description: t.feature_verification_desc,
      bg: "bg-[#F7F9FC]",
    },
    {
      icon: "/images/prod.svg",
      title: t.feature_guideline_title,
      description: t.feature_guideline_desc,
      bg: "bg-[#F7F9FC]",
    },
  ];

  return (
    <div className="w-full px-6 md:px-12 py-10">
      <div className="mb-14">
        <h1 className="text-2xl lg:text-[33px] font-bold text-gray-900">
          {t.helpTitle}
        </h1>
        <p className="text-xl text-gray-500">{t.helpSubtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 grid-cols-1 gap-6 lg:min-w-[550px] lg:min-h-[500px] mb-10">
        {features.map((feature, idx) => {
          const isActive = activeCardIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-[20px] ${
                isActive
                  ? "p-[2px] bg-gradient-to-tr from-[#0463EF] to-[#16EA9E]"
                  : ""
              }`}
            >
              <button
                onClick={() => {
                  setActiveCardIndex(idx);
                  if (idx === 0) router.push("/help/payment");
                  if (idx === 1) router.push("/help/content-generation");
                  if (idx === 2) router.push("/help/product-guideline");
                }}
                className={`
  w-full h-full min-h-[420px] lg:min-h-[auto] 
  rounded-[18px] text-center flex flex-col items-center transition focus:outline-none
  ${isActive ? "bg-[#DAE9FF]" : `${feature.bg}`}
`}
              >
                <div className="w-24 h-24 bg-[#E9F8FF] rounded-full flex items-center justify-center shadow-sm mt-8 mb-12">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>

                <h3 className="font-bold text-gray-800 lg:text-2xl text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-lg lg:text-xl mx-8 mt-4">
                  {feature.description}
                </p>
              </button>
            </div>
          );
        })}
      </div>
      <ChatBot />
    </div>
  );
};

export default HelpCenter;

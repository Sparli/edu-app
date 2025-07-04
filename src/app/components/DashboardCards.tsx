"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

const DashboardCards = () => {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const [activeCard, setActiveCard] = React.useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
        {/* Card 1 */}
        <DashboardCard
          isActive={activeCard === 0}
          title={t.dashboard_generate_title}
          description={t.dashboard_generate_desc}
          buttonText={t.dashboard_generate_btn}
          imageSrc="/images/generate.svg"
          onClick={() => {
            setActiveCard(0);
            router.push("/generate");
          }}
        />

        <DashboardCard
          isActive={activeCard === 1}
          title={t.dashboard_content_title}
          description={t.dashboard_content_desc}
          buttonText={t.dashboard_content_btn}
          imageSrc="/images/cont.svg"
          onClick={() => {
            setActiveCard(1);
            router.push("/content");
          }}
        />

        <DashboardCard
          isActive={activeCard === 2}
          title={t.dashboard_feedback_title}
          description={t.dashboard_feedback_desc}
          buttonText={t.dashboard_feedback_btn}
          imageSrc="/images/feed.svg"
          onClick={() => {
            setActiveCard(2);
            router.push("/feedback");
          }}
        />
      </div>
    </>
  );
};

const DashboardCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  onClick,
  isActive = false,
}: {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
  onClick?: () => void;
  isActive?: boolean;
}) => (
  <div
    className={`rounded-[20px] ${
      isActive ? "p-[2px] bg-gradient-to-tr from-[#0463EF] to-[#16EA9E]" : ""
    }`}
  >
    <div
      className={`rounded-[18px] p-6 xl:min-w-[320.625px] xl:min-h-[381.375px] content-center text-center transition
      ${isActive ? "bg-[#DAE9FF]" : "lg:bg-[#f7f9fc] bg-[#AB79FF1A]"}`}
    >
      <div className="lg:w-30 lg:h-30 h-20 w-20 bg-[#23BAD8] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Image
          src={imageSrc}
          alt={title}
          width={90}
          height={90}
          className="lg:w-15 lg:h-15 w-10 h-10"
        />
      </div>
      <h3 className="text-xl lg:text-2xl font-semibold text-[##1F2937] mb-2">
        {title}
      </h3>
      <p className="text-[#4B5563] text-lg mb-6  mx-12">{description}</p>
      <button
        onClick={onClick || undefined}
        className="lg:px-18 lg:py-4 px-4 py-2 bg-[#23BAD8] cursor-pointer text-white rounded-lg hover:bg-cyan-600 transition"
      >
        {buttonText}
      </button>
    </div>
  </div>
);

export default DashboardCards;

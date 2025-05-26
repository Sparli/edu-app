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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
        {/* Card 1 */}
        <DashboardCard
          title={t.dashboard_generate_title}
          description={t.dashboard_generate_desc}
          buttonText={t.dashboard_generate_btn}
          imageSrc="/images/generate.svg"
          onClick={() => router.push("/generate")}
        />

        <DashboardCard
          title={t.dashboard_content_title}
          description={t.dashboard_content_desc}
          buttonText={t.dashboard_content_btn}
          imageSrc="/images/cont.svg"
          onClick={() => router.push("/content")}
        />

        <DashboardCard
          title={t.dashboard_feedback_title}
          description={t.dashboard_feedback_desc}
          buttonText={t.dashboard_feedback_btn}
          imageSrc="/images/feed.svg"
          onClick={() => router.push("/feedback")}
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
}: {
  title: string;
  description: string;
  imageSrc: string;
  buttonText: string;
  onClick?: () => void;
}) => (
  <div className="lg:bg-[#f7f9fc] bg-[#AB79FF1A] hover:border-[#23BAD8] border-[#ffffff] hover:border rounded-2xl p-6 xl:min-w-[320.625px] xl:min-h-[381.375px] content-center  transition text-center">
    <div className="lg:w-30 lg:h-30 h-20 w-20 bg-[#23BAD8] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Image
        src={imageSrc}
        alt={title}
        width={90}
        height={90}
        className="lg:w-15 lg:h-15 w-10 h-10"
      />
    </div>
    <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
      {title}
    </h3>
    <p className="text-gray-500 text-lg lg:text-xl mb-6">{description}</p>
    <button
      onClick={onClick || undefined}
      className="lg:px-6 lg:py-3 px-4 py-2 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
    >
      {buttonText}
    </button>
  </div>
);

export default DashboardCards;

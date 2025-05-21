"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

const DashboardCards = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between mb-10 mt-2 w-full">
        <div>
          <h1 className="lg:text-3xl text-[20px] font-bold text-gray-800 flex items-center space-x-2">
            <span>Welcome Back, Alex!</span>
            <Image src="/images/hand.png" alt="Wave" width={24} height={24} />
          </h1>
          <p className="text-gray-500 lg:text-2xl text-[14px] lg:mt-3 font-semibold">
            Ready to create something smart today?
          </p>
          <p className="text-gray-500 text-sm lg:mt-2">
            Use AI to generate lessons, quizzes, and learning ideas.
          </p>
        </div>

        <button
          onClick={() => router.push("/subscription")}
          className="hidden lg:flex items-center mb-8 px-6 py-2 bg-[#2BDA2B] text-white font-semibold rounded-xl shadow hover:bg-green-600 transition"
        >
          <FaStar className="mr-2 text-yellow-300" /> Upgrade
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-8">
        {/* Card 1 */}
        <DashboardCard
          title="Generate New Content"
          description="Create AI-powered lessons and quizzes"
          buttonText="Smart Generating"
          imageSrc="/images/gene.png"
        />

        <DashboardCard
          title="My Content"
          description="View your previously generated lessons & quizzes"
          buttonText="Browse My Content"
          imageSrc="/images/cont.png"
        />

        <DashboardCard
          title="Submit Feedback"
          description="Help us improve by rating your generated content"
          buttonText="Give Feedback"
          imageSrc="/images/feed.png"
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
    <div className="w-20 h-20 bg-[#23BAD8] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Image
        src={imageSrc}
        alt={title}
        width={40}
        height={40}
        className="w-10 h-10"
      />
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-lg mb-6">{description}</p>
    <button
      onClick={onClick || undefined}
      className="px-4 py-2 bg-[#23BAD8] text-white rounded-lg hover:bg-cyan-600 transition"
    >
      {buttonText}
    </button>
  </div>
);

export default DashboardCards;

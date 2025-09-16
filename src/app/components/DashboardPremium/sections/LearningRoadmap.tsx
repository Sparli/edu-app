"use client";

import React from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

type StepStatus = "done" | "current" | "todo";

interface RoadmapStep {
  id: string;
  title: string;
  estimateDays: number;
  status: StepStatus;
}

interface LearningRoadmapProps {
  steps?: RoadmapStep[];
}

const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  steps,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Create translated default steps
  const defaultSteps: RoadmapStep[] = [
    {
      id: "basic-algebra",
      title: t.learning_roadmap_basic_algebra,
      estimateDays: 4,
      status: "done",
    },
    {
      id: "linear-eq",
      title: t.learning_roadmap_linear_equations,
      estimateDays: 6,
      status: "current",
    },
    {
      id: "quadratic",
      title: t.learning_roadmap_quadratic_functions,
      estimateDays: 2,
      status: "todo",
    },
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white py-[16px] px-[12px]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Image
          src="/PremImages/learning.png"
          alt={t.learning_roadmap_alt}
          width={28}
          height={28}
        />
        <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">{t.learning_roadmap_title}</h3>
      </div>

      {/* Timeline */}
      <ol className="relative ml-2">
        {displaySteps.map((step, idx) => {
          const prev = displaySteps[idx - 1];

          // connector colors: light blue for done, black for current, gray for todo
          const topConnectorColor =
            idx === 0
              ? "transparent"
              : prev.status === "done"
              ? "bg-[#23BAD8]"
              : prev.status === "current"
              ? "bg-black"
              : "bg-gray-300";

          const bottomConnectorColor =
            idx === displaySteps.length - 1
              ? "transparent"
              : step.status === "done"
              ? "bg-[#23BAD8]"
              : step.status === "current"
              ? "bg-black"
              : "bg-gray-300";

          // dot styles to match design exactly
          const dot =
            step.status === "done"
              ? "border-2 border-black bg-[#23BAD8]"
              : step.status === "current"
              ? "border-2 border-[#23BAD8] bg-black"
              : "border-2 border-gray-300 bg-white";

          return (
            <li key={step.id} className="flex gap-4 py-3">
              {/* Rail + Dot */}
              <div className="relative flex w-6 justify-center">
                {/* top connector - dashed line */}
                <span
                  className={`absolute left-1/2 top-0 -translate-x-1/2 ${topConnectorColor}`}
                  style={{ 
                    width: 2, 
                    height: 12,
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 2px, currentColor 2px, currentColor 4px)`,
                    backgroundSize: '2px 4px'
                  }}
                />
                {/* dot */}
                <span
                  className={`relative z-[1] flex h-6 w-6 items-center justify-center rounded-full ${dot}`}
                  aria-hidden
                >
                  {step.status === "done" ? (
                    <Check className="h-3.5 w-3.5 text-white" />
                  ) : step.status === "current" ? (
                    <span className="sr-only">{t.learning_roadmap_current}</span>
                  ) : null}
                </span>
                {/* bottom connector - dashed line */}
                <span
                  className={`absolute left-1/2 bottom-0 -translate-x-1/2 ${bottomConnectorColor}`}
                  style={{ 
                    width: 2, 
                    height: 28,
                    backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 2px, currentColor 2px, currentColor 4px)`,
                    backgroundSize: '2px 4px'
                  }}
                />
              </div>

              {/* Text block */}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    step.status === "todo" ? "text-gray-800" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">
                  {t.learning_roadmap_estimated_time}: {String(step.estimateDays).padStart(2, "0")}{" "}
                  {t.learning_roadmap_days}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LearningRoadmap;

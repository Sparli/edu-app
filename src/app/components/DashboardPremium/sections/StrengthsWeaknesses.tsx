"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { StrengthsWeaknessesData } from "@/app/utils/insightsApi";

type Slice = {
  name: string;
  value: number; // percentage
  color: string;
};

interface StrengthsWeaknessesProps {
  loading: boolean;
  data: StrengthsWeaknessesData | null;
  error: string | null;
}


// White, bold % label centered inside each arc
const RADIAN = Math.PI / 180;
const renderLabel: React.ComponentProps<typeof Pie>["label"] = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (percent === undefined || midAngle === undefined) return null;
  const r = (Number(innerRadius) + Number(outerRadius)) / 2;
  const x = Number(cx) + r * Math.cos(-midAngle * RADIAN);
  const y = Number(cy) + r * Math.sin(-midAngle * RADIAN);
  const pct = Math.round(percent * 100);
  // avoid tiny labels (not needed here, but safe)
  if (pct < 6) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      className="select-none"
      style={{ fill: "#fff", fontWeight: 800, fontSize: 16 }}
    >
      {pct}%
    </text>
  );
};

const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ 
  loading, 
  data: apiData, 
  error 
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  // Define colors for different subjects
  const getColorForSubject = (index: number): string => {
    const colors = ["#23BAD8", "#FF421D", "#B237FF", "#FFB600", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
    return colors[index % colors.length];
  };

  // Convert API data to chart format
  const chartData: Slice[] = apiData?.slices.map((slice, index) => ({
    name: slice.subject,
    value: Math.round(slice.percent * 100) / 100, // Round to 2 decimal places
    color: getColorForSubject(index)
  })) || [];

  // Handle loading state
  if (loading) {
    return (
      <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-[#FFFFFF] p-6">
        <h3 className="mb-4 sm:text-[20px] text-[18px] font-bold text-[#191818]">
          {t.strengths_weaknesses_title}
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-[#FFFFFF] p-6">
        <h3 className="mb-4 sm:text-[20px] text-[18px] font-bold text-[#191818]">
          {t.strengths_weaknesses_title}
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load strengths & weaknesses data</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!apiData || chartData.length === 0) {
    return (
      <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-[#FFFFFF] p-6">
        <h3 className="mb-4 sm:text-[20px] text-[18px] font-bold text-[#191818]">
          {t.strengths_weaknesses_title}
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No data available</p>
            <p className="text-sm text-gray-400">Complete some activities to see your strengths & weaknesses</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-[#FFFFFF] p-6">
      {/* Header */}
      <h3 className="mb-4 sm:text-[20px] text-[18px] font-bold text-[#191818]">
        {t.strengths_weaknesses_title}
      </h3>

      {/* Chart + Legend */}
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Donut */}
        <div className="h-64 w-full md:h-72 md:w-2/3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                cornerRadius={0}
                labelLine={false}
                label={renderLabel}
                stroke="none"
                strokeWidth={0}
                isAnimationActive
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <ul className="grid w-full sm:grid-cols-1 grid-cols-2 sm:gap-3 gap-4 md:w-1/3">
          {chartData.map((d) => (
            <li key={d.name} className="flex items-center gap-2">
              <span
                className="inline-block sm:h-4 sm:w-4 h-3 w-3 rounded-full"
                style={{ backgroundColor: d.color }}
                aria-hidden="true"
              />
              <span className="sm:text-[14px] truncate text-[12px] font-semibold text-[#191818]">
                {d.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StrengthsWeaknesses;

"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Dot,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { 
  getPerformanceTrends, 
  isPerformanceTrendsData,
  isPerformanceTrendsDisabled,
  type PerformanceMode,
  type PerformanceTrendsApiResponse 
} from "@/app/utils/performanceTrendsApi";

type ChartPoint = {
  label: string;
  xp: number;
  date: string;
};

// Highlight peak XP day
const CustomDot = (props: { 
  cx?: number; 
  cy?: number; 
  payload?: ChartPoint;
  peakLabel?: string;
}) => {
  const { cx, cy, payload, peakLabel } = props;
  if (payload?.label === peakLabel) {
    return (
      <Dot
        cx={cx}
        cy={cy}
        r={12}
        fill="#ffffff"
        stroke="#23BAD8"
        strokeWidth={4}
      />
    );
  }
  return null;
};

// Minimal custom tooltip to show "<xp> XP" with day
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload?.length) {
    const xp = payload[0].value as number;
    return (
      <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-md">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-semibold text-gray-800">
          {xp.toLocaleString()} XP
        </div>
      </div>
    );
  }
  return null;
};

interface PerformanceTrendsProps {
  onOpenModal?: () => void;
}

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ onOpenModal }) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<PerformanceMode>("weekly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceTrendsApiResponse | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "weekly" as PerformanceMode, label: t.performance_weekly },
    { value: "monthly" as PerformanceMode, label: t.performance_monthly },
  ];

  const selectedOption = options.find(opt => opt.value === selectedValue);

  // Fetch performance data
  useEffect(() => {
    const fetchData = async (retryCount = 0) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPerformanceTrends(selectedValue, language);
        
        // If widget is disabled and this is the first attempt, retry after a short delay
        // This handles cases where the API hasn't updated preferences yet
        if (isPerformanceTrendsDisabled(data) && retryCount === 0) {
          setTimeout(() => fetchData(1), 1000);
          return;
        }
        
        setPerformanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedValue, language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Process data for chart
  const chartData: ChartPoint[] = [];
  let peakLabel = "";
  let maxXp = 0;

  if (performanceData && isPerformanceTrendsData(performanceData)) {
    chartData.push(...performanceData.series.map(point => ({
      label: point.label,
      xp: point.xp,
      date: point.date
    })));
    
    peakLabel = performanceData.highlights.peak_label;
    maxXp = Math.max(...performanceData.series.map(p => p.xp));
  }

  // Handle widget disabled state
  if (performanceData && isPerformanceTrendsDisabled(performanceData)) {
    return (
      <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white p-3 sm:p-4">
        <div className="text-center py-8">
          <p className="text-gray-500 mb-2">{performanceData.hint}</p>
          <p className="text-sm text-gray-400">Enable this widget in your dashboard settings.</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white p-3 sm:p-4">
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">Failed to load performance data</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full rounded-[15px] border border-[#4A4A4A40]/75 bg-white p-3 sm:p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onOpenModal}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="sm:text-[20px] text-[18px] font-bold text-[#191818]">
          {t.performance_trends_title}
        </h3>

        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="flex items-center justify-between rounded-[22px] border border-[#E5E5E5] bg-white pl-4 pr-3 py-2.5 text-[14px] font-semibold text-[#191818] focus:outline-none focus:ring-2 focus:ring-[#23BAD8] focus:border-[#23BAD8] transition-all duration-200 cursor-pointer hover:border-[#23BAD8]/50 min-w-[100px]"
            style={{
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
            }}
          >
            <span>{selectedOption?.label}</span>
            <ChevronDown 
              className={`h-4 w-4 text-[#6B7280] transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-[12px] shadow-lg z-50 overflow-hidden">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedValue(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-[14px] font-semibold text-[#191818] hover:bg-[#23BAD8]/5 transition-colors duration-150 ${
                    selectedValue === option.value ? 'bg-[#23BAD8]/10 text-[#23BAD8]' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] rounded-lg bg-white [&_svg]:focus:outline-none [&_svg_*]:focus:outline-none">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 6, right: 0, left: 0, bottom: 6 }}
            >
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(35,186,216,0.5)" />
                <stop offset="100%" stopColor="rgba(35,186,216,0)" />
              </linearGradient>
            </defs>

            {/* vertical dotted guides only, like the mock */}
            <CartesianGrid
              vertical
              horizontal={false}
              strokeDasharray="3 6"
              stroke="#E5E7EB"
            />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickMargin={16}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={60}
              domain={[0, Math.max(maxXp * 1.2, 100)]}
              interval={1} // Show all ticks
              tickFormatter={(v) => (v === 0 ? "0" : `${v} XP`)}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
              tickMargin={8}
              tickCount={8} // Increase number of ticks for less vertical space
            />

            <Tooltip
              cursor={{ stroke: "#94A3B8", strokeDasharray: "3 3" }}
              content={<CustomTooltip />}
              wrapperStyle={{ outline: "none" }}
            />

            <Area
              type="monotone"
              dataKey="xp"
              stroke="#23BAD8"
              strokeWidth={4}
              fill="url(#colorXp)"
              activeDot={{ r: 5 }}
              dot={<CustomDot peakLabel={peakLabel} />}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PerformanceTrends;

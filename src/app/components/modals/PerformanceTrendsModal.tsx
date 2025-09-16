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
import { ChevronDown, X } from "lucide-react";
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

// Custom tooltip for the modal chart
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

interface PerformanceTrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PerformanceTrendsModal: React.FC<PerformanceTrendsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Fetch performance data when modal opens or mode changes
  useEffect(() => {
    if (!isOpen) return;
    
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
  }, [isOpen, selectedValue, language]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Process data for chart
  const chartData: ChartPoint[] = [];
  let peakLabel = "";
  let maxXp = 0;
  let totalXp = 0;
  let activeDays = 0;

  if (performanceData && isPerformanceTrendsData(performanceData)) {
    chartData.push(...performanceData.series.map(point => ({
      label: point.label,
      xp: point.xp,
      date: point.date
    })));
    
    peakLabel = performanceData.highlights.peak_label;
    maxXp = Math.max(...performanceData.series.map(p => p.xp));
    totalXp = performanceData.totals.xp_sum;
    activeDays = performanceData.totals.days_active;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl lg:mx-4 m-4 bg-white rounded-[20px] shadow-2xl lg:max-h-[90vh] max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-[#191818]">
              {t.performance_trends_title}
            </h2>
            
            {/* Dropdown in header */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between rounded-[22px] border border-[#E5E5E5] bg-white pl-4 pr-3 py-2.5 text-[14px] font-semibold text-[#191818] focus:outline-none focus:ring-2 focus:ring-[#23BAD8] focus:border-[#23BAD8] transition-all duration-200 cursor-pointer hover:border-[#23BAD8]/50 min-w-[100px]"
                style={{
                  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)",
                }}
              >
                <span>{selectedOption?.label}</span>
                <ChevronDown 
                  className={`h-4 w-4 text-[#6B7280] transition-transform duration-200 ml-2 ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E5E5] rounded-[12px] shadow-lg z-50 overflow-hidden">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedValue(option.value);
                        setIsDropdownOpen(false);
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

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Chart Content */}
        <div className="p-0">
          {/* Handle widget disabled state */}
          {performanceData && isPerformanceTrendsDisabled(performanceData) ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-2">{performanceData.hint}</p>
                <p className="text-sm text-gray-400">Enable this widget in your dashboard settings.</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-red-500 mb-2">Failed to load performance data</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          ) : loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-gray-500">Loading chart data...</div>
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              {performanceData && isPerformanceTrendsData(performanceData) && (
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#23BAD8]">{totalXp.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#23BAD8]">{activeDays}</div>
                      <div className="text-sm text-gray-600">Active Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#23BAD8]">{performanceData.highlights.peak_xp}</div>
                      <div className="text-sm text-gray-600">Peak XP</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#23BAD8]">{Math.round(totalXp / Math.max(activeDays, 1))}</div>
                      <div className="text-sm text-gray-600">Avg XP/Day</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Large Chart */}
              <div className="h-[400px] rounded-lg bg-white border border-gray-100 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                <defs>
                  <linearGradient id="colorXpModal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(35,186,216,0.5)" />
                    <stop offset="100%" stopColor="rgba(35,186,216,0)" />
                  </linearGradient>
                </defs>

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
                  tick={{ fontSize: 14, fill: "#6B7280" }}
                  tickMargin={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={80}
                  domain={[0, Math.max(maxXp * 1.2, 100)]}
                  tickFormatter={(v) => (v === 0 ? "0" : `${v} XP`)}
                  tick={{ fontSize: 14, fill: "#9CA3AF" }}
                  tickMargin={12}
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
                  fill="url(#colorXpModal)"
                  activeDot={{ r: 6 }}
                  dot={<CustomDot peakLabel={peakLabel} />}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrendsModal;

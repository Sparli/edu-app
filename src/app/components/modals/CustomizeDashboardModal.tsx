"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import ApplyingChangesModal from "./ApplyingChangesModal";

interface Widget {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

interface CustomizeDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: Widget[];
  onWidgetToggle: (widgetId: string) => void;
  onApplyChanges: () => Promise<void>;
}

const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({
  isOpen,
  onClose,
  widgets,
  onWidgetToggle,
  onApplyChanges,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isApplying, setIsApplying] = useState(false);

  // Modal owns its icons. Do not use widget-provided icons.
  const widgetIconMap: Record<string, string> = {
    "performance-trends": "/CustomizeModal/perfomance.png",
    "strengths-weaknesses": "/CustomizeModal/power.png",
    "daily-challenge": "/CustomizeModal/daily.png",
    "motivational-insights": "/CustomizeModal/Insights.png",
    "streak-tracker": "/CustomizeModal/Streak.png",
    "learning-roadmap": "/CustomizeModal/Learning.png",
    "milestones": "/CustomizeModal/Milestones.png",
    "progress-journals": "/CustomizeModal/Progress.png",
  };

  const getModalIconFor = (id: string): string => widgetIconMap[id] || "/icons/custom.png";

  if (!isOpen) return null;

  const enabledCount = widgets.filter(w => w.enabled).length;
  const totalCount = widgets.length;

  const categories = [
    "All",
    t.performance_trends_title || "Performance Trends",
    t.strengths_weaknesses_title || "Strengths & Weaknesses", 
    t.daily_challenge_title || "Daily Challenge",
    t.motivational_insights_title || "Insights",
    t.streak_tracker_title || "Streak Tracker",
    t.learning_roadmap_title || "Learning Roadmap",
    t.milestones_title || "Milestones",
    t.progress_journals_title || "Progress Journals"
  ];

  const filteredWidgets = selectedCategory === "All" 
    ? widgets 
    : widgets.filter(w => w.category === selectedCategory);

  const handleApplyChanges = async () => {
    setIsApplying(true);
    
    try {
      // Simulate applying changes delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onApplyChanges();
    } catch (error) {
      console.error('Failed to apply changes:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex  items-center justify-center z-50 px-4">
      <div className="bg-white rounded-[20px] w-full max-w-[1238px] lg:max-h-[870px] max-h-full h-full sm:h-auto overflow-hidden mx-2">
        {/* Header */}
        <div className="bg-[#23BAD8] px-4 sm:px-6 py-3 sm:py-4 rounded-t-[20px]">
          <div className="flex items-center justify-between gap-2 flex-nowrap">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-[22px] h-[22px] sm:w-[56px] sm:h-[56px] bg-white mb-4 sm:mb-0 rounded-full flex items-center justify-center flex-shrink-0">
                <Image src="/icons/custom.png" alt="Customize" width={32} height={32} className="sm:w-[44px] sm:h-[44px] w-[20px] h-[20px]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-[16px] sm:text-xl font-bold text-[#191818] truncate">
                  {t.customize_dashboard_title || "Customize Your Dashboard"}
                </h2>
                <p className="text-xs sm:text-sm text-white truncate">
                  {t.customize_dashboard_subtitle || "Make it your own! Choose which widget to show"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:w-8 lg:h-8 w-4 h-4 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
              style={{ alignSelf: "flex-start" }}
            >
              <X className="lg:w-4 lg:h-4 w-2 h-2 text-[#4A4A4A]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Active Widgets Section */}
          <div className="mb-6 bg-[#4A4A4A14]/50 rounded-[15px] p-5">
            <div className="flex items-center gap-3">
              <div>
                <Image src="/PremImages/goal.svg" alt="Target" width={60} height={60} />
              </div>
              <h3 className="text-lg font-bold text-[#191818]">
                {t.active_widgets_title || "Active Widgets"}
              </h3>
            </div>
            <p className="text-sm text-[#4A4A4A] mb-3 ml-18">
              {t.active_widgets_subtitle || "Customize your learning space"}
            </p>
            
            {/* Progress Bar */}
            <div className="flex flex-col sm:flex-row items-center mt-3 gap-4">
              <div className="w-full sm:flex-1 bg-gray-200 rounded-full h-2 relative">
                <div 
                  className="bg-[#009E3D] rounded-full absolute left-0 top-0 h-2 transition-all duration-300"
                  style={{ width: `${(enabledCount / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium text-[#191818] sm:mt-0 mt-3">
                {enabledCount}/{totalCount} {t.widgets_enabled || "Widgets Enabled"}
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Image src="/PremImages/grid.png"alt="Category" width={22} height={22} />
              <h3 className="text-[20px] font-bold text-[#191818]">
                {t.categories_title || "Categories"}
              </h3>
            </div>
            
            <div className="flex overflow-x-auto sm:overflow-x-hidden flex-wrap scrollbar-hide gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-[5] text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-[#23BAD8] text-white"
                      : "bg-gray-100 text-[#4A4A4A] hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Widget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map((widget) => (
              <div
                key={widget.id}
                className="bg-[#4A4A4A14]/92 rounded-[10px] p-[12px] flex items-center justify-between"
              >
                {/* Left: Icon */}
                <div className={`w-[42px] h-[42px] rounded-full bg-white flex items-center justify-center flex-shrink-0`}>
                  <Image
                    src={getModalIconFor(widget.id)}
                    alt={widget.name}
                    width={24}
                    height={24}
                  />
                </div>

                {/* Middle: Text */}
                <div className="flex-1 mx-4 min-w-0">
                  <h4 className="font-bold text-[#191818] text-sm">
                    {widget.name}
                  </h4>
                  <p className="text-[12px] text-[#4A4A4A]">
                    {widget.description}
                  </p>
                </div>

                {/* Right: Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={() => onWidgetToggle(widget.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      widget.enabled ? "bg-[#23BAD8]" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        widget.enabled ? "translate-x-5" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
          <button
            onClick={handleApplyChanges}
            disabled={isApplying}
            className={`sm:w-[20%] w-full font-bold py-3 px-6 rounded-lg transition-colors ${
              isApplying 
                ? "bg-gray-400 text-gray-200 cursor-not-allowed" 
                : "bg-[#23BAD8] text-white hover:bg-[#23BAD8]/80"
            }`}
          >
            {isApplying ? "Applying..." : (t.apply_changes || "Apply Changes")}
          </button>
        </div>
      </div>

      {/* Applying Changes Modal */}
      <ApplyingChangesModal isOpen={isApplying} />
    </div>
  );
};

export default CustomizeDashboardModal;

"use client";

import React, { useState, useEffect, useMemo } from "react";
import QuickGenerate from "../QuickGenerate";
import PremiumDashboardCards from "../PremiumDashboardCards";
import TopGoalsSection from "./sections/TopGoalsSection";
import PerformanceTrends from "./sections/PerformanceTrends";
import StrengthsWeaknesses from "./sections/StrengthsWeaknesses";
import DailyChallenge from "./sections/DailyChallenge";
import MotivationalInsights from "./sections/MotivationalInsights";
import AchievementBanner from "./sections/AchievementBanner";
import StreakTracker from "./sections/StreakTracker";
import LearningRoadmap from "./sections/LearningRoadmap";
import Milestones from "./sections/Milestones";
import ProgressJournals from "./sections/ProgressJournals";
import CustomizeDashboardModal from "../modals/CustomizeDashboardModal";
import PerformanceTrendsModal from "../modals/PerformanceTrendsModal";
import DailyChallengeModal from "../modals/DailyChallengeModal";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";
import { getPremiumSummary, type PremiumSummaryResponse } from "@/app/utils/insightsApi";
import { 
  getWidgetPreferences, 
  updateWidgetPreferences,
  WIDGET_ID_MAPPING,
  type WidgetPreferencesResponse 
} from "@/app/utils/widgetPreferencesApi";
import PremiumLockModal from "../PremiumLockModal";
interface DashboardPremiumProps {
  isCustomizeModalOpen: boolean;
  onCloseCustomizeModal: () => void;
}

export default function DashboardPremium({ 
  isCustomizeModalOpen, 
  onCloseCustomizeModal 
}: DashboardPremiumProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPremiumLock, setShowPremiumLock] = useState<boolean>(false);
  const [summary, setSummary] = useState<PremiumSummaryResponse | null>(null);
  const [widgetPreferences, setWidgetPreferences] = useState<WidgetPreferencesResponse | null>(null);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState<boolean>(false);
  const [isDailyChallengeModalOpen, setIsDailyChallengeModalOpen] = useState<boolean>(false);
  
  interface WidgetConfig {
    id: string;
    name: string;
    description: string;
    category: string;
    enabled: boolean;
  }

  // Default widget configuration (includes independent modal icons)
  const defaultWidgets: WidgetConfig[] = useMemo(() => [
    {
      id: "performance-trends",
      name: t.performance_trends_title || "Performance Trends",
      description: t.performance_trends_description || "Graphical Representation",
      category: t.performance_trends_title || "Performance Trends",
      enabled: true,
    },
    {
      id: "strengths-weaknesses",
      name: t.strengths_weaknesses_title || "Strengths & Weaknesses",
      description: t.strengths_weaknesses_description || "Progress View",
      category: t.strengths_weaknesses_title || "Strengths & Weaknesses",
      enabled: true,
    },
    {
      id: "daily-challenge",
      name: t.daily_challenge_title || "Daily Challenge",
      description: t.daily_challenge_description || "Daily Activity",
      category: t.daily_challenge_title || "Daily Challenge",
      enabled: true,
    },
    {
      id: "motivational-insights",
      name: t.motivational_insights_title || "Insights",
      description: t.motivational_insights_description || "Motivational Insights",
      category: t.motivational_insights_title || "Insights",
      enabled: true,
    },
    {
      id: "streak-tracker",
      name: t.streak_tracker_title || "Streak Tracker",
      description: t.streak_tracker_description || "Weekly Streak",
      category: t.streak_tracker_title || "Streak Tracker",
      enabled: true,
    },
    {
      id: "learning-roadmap",
      name: t.learning_roadmap_title || "Learning Roadmap",
      description: t.learning_roadmap_description || "Step by Step Process",
      category: t.learning_roadmap_title || "Learning Roadmap",
      enabled: true,
    },
    {
      id: "milestones",
      name: t.milestones_title || "Milestones",
      description: t.milestones_description || "Achievements",
      category: t.milestones_title || "Milestones",
      enabled: true,
    },
    {
      id: "progress-journals",
      name: t.progress_journals_title || "Progress",
      description: t.progress_journals_description || "Journals",
      category: t.progress_journals_title || "Progress Journals",
      enabled: true,
    },
  ], [t]);

  // Widget configuration state
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, enabled: !widget.enabled }
          : widget
      )
    );
  };

  // Load widget preferences from API
  useEffect(() => {
    if (widgetPreferences) {
      const updatedWidgets = defaultWidgets.map((widget) => {
        const backendKey = WIDGET_ID_MAPPING[widget.id];
        if (backendKey && widgetPreferences.preferences[backendKey] !== undefined) {
          return {
            ...widget,
            enabled: widgetPreferences.preferences[backendKey]
          };
        }
        return widget;
      });
      setWidgets(updatedWidgets);
    }
  }, [widgetPreferences, defaultWidgets]);

  // Fetch premium summary and widget preferences on mount
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const [summaryRes, preferencesRes] = await Promise.all([
          getPremiumSummary(language),
          getWidgetPreferences(language)
        ]);
        if (!isMounted) return;
        setSummary(summaryRes);
        setWidgetPreferences(preferencesRes);
      } catch (e) {
        if (!isMounted) return;
        const status = (e as { status?: number }).status;
        const message = (e as Error).message || "Failed to load premium dashboard";
        setErrorMessage(message);
        if (status === 403) {
          setShowPremiumLock(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [language]);

  const handleApplyChanges = async () => {
    try {
      // Convert frontend widget IDs to backend keys
      const preferences: Record<string, boolean> = {};
      widgets.forEach((widget) => {
        const backendKey = WIDGET_ID_MAPPING[widget.id];
        if (backendKey) {
          preferences[backendKey] = widget.enabled;
        }
      });

      const updatedPreferences = await updateWidgetPreferences({ preferences });
      setWidgetPreferences(updatedPreferences);
      onCloseCustomizeModal();
    } catch (error) {
      console.error('Failed to save widget preferences:', error);
      // You might want to show an error message to the user here
    }
  };

  // Get enabled widgets for rendering
  const isWidgetEnabled = (widgetId: string) => 
    widgets.find(w => w.id === widgetId)?.enabled ?? true;

  return (
    <>
      {showPremiumLock && (
        <PremiumLockModal onClose={() => setShowPremiumLock(false)} t={{
          premium_only_title: t.premium_only_title,
          premium_only_message: t.premium_only_message,
          upgrade_now: t.upgrade_now,
          cancel: t.cancel,
        }} />
      )}
      <div>
        {errorMessage && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
            {errorMessage}
          </div>
        )}
        {isWidgetEnabled("top-goals") && (
          <TopGoalsSection
            loading={loading}
            streakCount={summary?.payloads.streaks?.data?.streak_count ?? null}
            totalXp={summary?.payloads.xp?.data?.total_xp ?? null}
            level={summary?.payloads.level?.data?.level ?? null}
            weeklyGoalPercent={summary?.payloads.weekly_goal?.data?.percent != null 
              ? `${summary?.payloads.weekly_goal?.data?.percent}%` 
              : null}
          />
        )}
        <PremiumDashboardCards />
        <hr className="text-[#4A4A4A40]/75 " />
        <QuickGenerate />
        <hr className="text-[#4A4A4A40]/75 my-[30px]" />
        <h1 className="sm:text-[32px] text-[24px] font-bold text-[#191818] my-[30px]">
          {t.dashboard_customized_title}
        </h1>
        <hr className="text-[#4A4A4A40]/75 my-[30px]" />
      </div>
      
      {/* First Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {isWidgetEnabled("performance-trends") && (
          <div className={!isWidgetEnabled("strengths-weaknesses") ? "md:col-span-2" : ""}>
            <PerformanceTrends 
              key={`performance-trends-${widgetPreferences?.updated_at || 'default'}`}
              onOpenModal={() => setIsPerformanceModalOpen(true)} 
            />
          </div>
        )}
        {isWidgetEnabled("strengths-weaknesses") && (
          <div className={!isWidgetEnabled("performance-trends") ? "md:col-span-2" : ""}>
            <StrengthsWeaknesses 
              loading={loading}
              data={summary?.payloads.strengths_weaknesses?.data ?? null}
              error={summary?.payloads.strengths_weaknesses?.error ?? null}
            />
          </div>
        )}
      </div>

      {/* Second Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {isWidgetEnabled("daily-challenge") && (
          <div className={!isWidgetEnabled("motivational-insights") ? "md:col-span-2" : ""}>
            <DailyChallenge 
              loading={loading}
              data={summary?.payloads.daily_challenge?.data ?? null}
              error={summary?.payloads.daily_challenge?.error ?? null}
              onOpenModal={() => setIsDailyChallengeModalOpen(true)} 
            />
          </div>
        )}
        {isWidgetEnabled("motivational-insights") && (
          <div className={!isWidgetEnabled("daily-challenge") ? "md:col-span-2 " : ""}>
            <MotivationalInsights 
              loading={loading}
              data={summary?.payloads.motivational_insight?.data ?? null}
              error={summary?.payloads.motivational_insight?.error ?? null}
            />
          </div>
        )}
      </div>
      
      {isWidgetEnabled("achievement-banner") && (
        <div className="my-[24px]">
          <AchievementBanner />
        </div>
      )}
      
      {/* Third Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {isWidgetEnabled("streak-tracker") && (
          <div className={!isWidgetEnabled("learning-roadmap") ? "md:col-span-2" : ""}>
            <StreakTracker
              streakCount={summary?.payloads.streaks?.data?.streak_count ?? undefined}
              activeDays={summary?.payloads.streak_tracker?.data?.present_days ?? undefined}
            />
          </div>
        )}
        {isWidgetEnabled("learning-roadmap") && (
          <div className={!isWidgetEnabled("streak-tracker") ? "md:col-span-2" : ""}>
            <LearningRoadmap />
          </div>
        )}
      </div>

      {/* Fourth Grid Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isWidgetEnabled("milestones") && (
          <div className={!isWidgetEnabled("progress-journals") ? "md:col-span-2" : ""}>
            <Milestones />
          </div>
        )}
        {isWidgetEnabled("progress-journals") && (
          <div className={!isWidgetEnabled("milestones") ? "md:col-span-2" : ""}>
            <ProgressJournals />
          </div>
        )}
      </div>

      {/* Customize Modal */}
      <CustomizeDashboardModal
        isOpen={isCustomizeModalOpen}
        onClose={onCloseCustomizeModal}
        widgets={widgets}
        onWidgetToggle={handleWidgetToggle}
        onApplyChanges={handleApplyChanges}
      />

      {/* Performance Trends Modal */}
      <PerformanceTrendsModal
        key={`performance-trends-modal-${widgetPreferences?.updated_at || 'default'}`}
        isOpen={isPerformanceModalOpen}
        onClose={() => setIsPerformanceModalOpen(false)}
      />

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyChallengeModalOpen}
        onClose={() => setIsDailyChallengeModalOpen(false)}
        loading={loading}
        data={summary?.payloads.daily_challenge?.data ?? null}
        error={summary?.payloads.daily_challenge?.error ?? null}
        onSubmitSuccess={async () => {
          // Refresh dashboard data after successful challenge submission
          try {
            const updatedSummary = await getPremiumSummary(language);
            setSummary(updatedSummary);
          } catch (error) {
            console.error('Failed to refresh dashboard data:', error);
          }
        }}
      />
    </>
  );
}

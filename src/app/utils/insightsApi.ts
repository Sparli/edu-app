import axios from "axios";
import authApi from "./authApi";

export interface PremiumSummaryLayoutItem {
  id: "streaks" | "xp" | "level" | "streak_tracker" | "strengths_weaknesses" | "daily_challenge" | "weekly_goal" | string;
  title: string;
  enabled: boolean;
}

export interface PremiumSummaryPayload<T> {
  data: T | null;
  error: string | null;
}

export interface StrengthsWeaknessesSlice {
  subject: string;
  percent: number;
}

export interface StrengthsWeaknessesData {
  slices: StrengthsWeaknessesSlice[];
  total_attempts: number;
}

export interface DailyChallengeQuestion {
  title: string;
  question: string;
  options: string[];
}

export interface DailyChallengeData {
  submitted: boolean;
  attempts_used: number;
  attempts_left: number;
  result: string | null;
  language: string;
  challenge_id: string;
  eta: string;
  daily_weakest_subject: string;
  mcq: DailyChallengeQuestion;
}

export interface MotivationalInsightsData {
  insight: {
    type: string;
    title: string;
    subtitle: string;
    icon: string;
  };
  quote: string;
}

export interface PremiumSummaryResponse {
  success: boolean;
  meta: {
    server_time_utc: string;
    effective_tz: string;
  };
  layout: PremiumSummaryLayoutItem[];
  payloads: {
    streaks: PremiumSummaryPayload<{ streak_count: number }>;
    xp: PremiumSummaryPayload<{ total_xp: number }>;
    level: PremiumSummaryPayload<{ level: number; xp_into_level: number; xp_to_next: number }>;
    streak_tracker: PremiumSummaryPayload<{
      week_start: string;
      present_days: string[];
      absent_days: string[];
      today: string;
    }>;
    weekly_goal: PremiumSummaryPayload<{ percent: number }>;
    strengths_weaknesses: PremiumSummaryPayload<StrengthsWeaknessesData>;
    daily_challenge: PremiumSummaryPayload<DailyChallengeData>;
    motivational_insight: PremiumSummaryPayload<MotivationalInsightsData>;
  };
  errors: {
    streaks: string | null;
    xp: string | null;
    level: string | null;
    streak_tracker: string | null;
    weekly_goal: string | null;
    strengths_weaknesses: string | null;
    daily_challenge: string | null;
    motivational_insight: string | null;
  };
}

export class PremiumApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "PremiumApiError";
    this.status = status;
  }
}

export const getPremiumSummary = async (language?: string): Promise<PremiumSummaryResponse> => {
  try {
    const params = language ? { lang: language } : {};
    const response = await authApi.get<PremiumSummaryResponse>("/insights/summary/", { params });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        (error.response?.data as { error?: string })?.error ||
        error.message ||
        "Failed to fetch premium summary";
      throw new PremiumApiError(message, status);
    }
    throw new PremiumApiError("Failed to fetch premium summary");
  }
};



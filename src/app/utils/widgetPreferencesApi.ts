import axios from "axios";
import authApi from "./authApi";

export interface WidgetPreferences {
  performance: boolean;
  strengths_weaknesses: boolean;
  daily_challenge: boolean;
  insights: boolean;
  streak_tracker: boolean;
  learning_roadmap: boolean;
  milestones: boolean;
  progress: boolean;
}

export interface WidgetPreferencesResponse {
  preferences: WidgetPreferences;
  updated_at: string;
  enabled_count: number;
  total_widgets: number;
}

export interface UpdateWidgetPreferencesRequest {
  preferences?: Partial<WidgetPreferences>;
  reset?: boolean;
}

export class WidgetPreferencesApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "WidgetPreferencesApiError";
    this.status = status;
  }
}

// Map frontend widget IDs to backend widget keys
export const WIDGET_ID_MAPPING: Record<string, keyof WidgetPreferences> = {
  "performance-trends": "performance",
  "strengths-weaknesses": "strengths_weaknesses", 
  "daily-challenge": "daily_challenge",
  "motivational-insights": "insights",
  "streak-tracker": "streak_tracker",
  "learning-roadmap": "learning_roadmap",
  "milestones": "milestones",
  "progress-journals": "progress"
};

// Reverse mapping for converting backend keys to frontend IDs
export const BACKEND_TO_FRONTEND_MAPPING: Record<keyof WidgetPreferences, string> = {
  performance: "performance-trends",
  strengths_weaknesses: "strengths-weaknesses",
  daily_challenge: "daily-challenge", 
  insights: "motivational-insights",
  streak_tracker: "streak-tracker",
  learning_roadmap: "learning-roadmap",
  milestones: "milestones",
  progress: "progress-journals"
};

export const getWidgetPreferences = async (language?: string): Promise<WidgetPreferencesResponse> => {
  try {
    const params = language ? { lang: language } : {};
    const response = await authApi.get<WidgetPreferencesResponse>("/insights/widgets/", { params });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        (error.response?.data as { detail?: string })?.detail ||
        error.message ||
        "Failed to fetch widget preferences";
      throw new WidgetPreferencesApiError(message, status);
    }
    throw new WidgetPreferencesApiError("Failed to fetch widget preferences");
  }
};

export const updateWidgetPreferences = async (
  request: UpdateWidgetPreferencesRequest
): Promise<WidgetPreferencesResponse> => {
  try {
    const response = await authApi.patch<WidgetPreferencesResponse>(
      "/insights/widgets/",
      request
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        (error.response?.data as { detail?: string })?.detail ||
        error.message ||
        "Failed to update widget preferences";
      throw new WidgetPreferencesApiError(message, status);
    }
    throw new WidgetPreferencesApiError("Failed to update widget preferences");
  }
};

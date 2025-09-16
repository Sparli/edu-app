import axios from "axios";
import authApi from "./authApi";

export type PerformanceMode = "weekly" | "monthly";
export type RangeStrategy = "last_full" | "current";

export interface PerformanceDataPoint {
  date: string;
  label: string;
  xp: number;
}

export interface PerformanceHighlights {
  peak_index: number;
  peak_date: string;
  peak_label: string;
  peak_xp: number;
  peak_ties: string[];
}

export interface PerformanceRange {
  start_date: string;
  end_date: string;
}

export interface PerformanceTotals {
  xp_sum: number;
  days_active: number;
}

export interface PerformanceTrendsResponse {
  mode: PerformanceMode;
  range_strategy: RangeStrategy;
  tz: string;
  range: PerformanceRange;
  is_partial: boolean;
  days_total: number;
  days_elapsed?: number;
  highlights: PerformanceHighlights;
  series: PerformanceDataPoint[];
  totals: PerformanceTotals;
}

export interface PerformanceTrendsDisabledResponse {
  widget: "performance_trends";
  enabled: false;
  reason: "disabled_in_preferences";
  hint: string;
}

export type PerformanceTrendsApiResponse = 
  | PerformanceTrendsResponse 
  | PerformanceTrendsDisabledResponse;

export class PerformanceTrendsApiError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "PerformanceTrendsApiError";
    this.status = status;
    this.code = code;
  }
}

export const getPerformanceTrends = async (
  mode: PerformanceMode = "weekly",
  language?: string
): Promise<PerformanceTrendsApiResponse> => {
  try {
    const params: { mode: PerformanceMode; lang?: string } = { mode };
    if (language) {
      params.lang = language;
    }
    
    const response = await authApi.get<PerformanceTrendsApiResponse>(
      `/insights/performance-trends/`,
      { params }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data as { 
        error?: string; 
        code?: string; 
        success?: boolean;
      };
      
      const message = errorData?.error || error.message || "Failed to fetch performance trends";
      const code = errorData?.code;
      
      throw new PerformanceTrendsApiError(message, status, code);
    }
    throw new PerformanceTrendsApiError("Failed to fetch performance trends");
  }
};

// Type guard to check if response is disabled
export const isPerformanceTrendsDisabled = (
  response: PerformanceTrendsApiResponse
): response is PerformanceTrendsDisabledResponse => {
  return 'enabled' in response && response.enabled === false;
};

// Type guard to check if response has data
export const isPerformanceTrendsData = (
  response: PerformanceTrendsApiResponse
): response is PerformanceTrendsResponse => {
  return 'series' in response;
};

import axios from "axios";
import authApi from "./authApi";

export interface DailyChallengeSubmitRequest {
  answer_index: number; // 0-3 based on API spec
  lang: string; // "en" or "fr"
}

export interface DailyChallengeSubmitResponse {
  success: boolean;
  data: {
    submitted: boolean;
    is_correct: boolean;
    attempts_used: number;
    attempts_left: number;
    language: string;
    challenge_id: string;
    message: string;
    reward_xp: number;
  };
}

export interface DailyChallengeSubmitErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export class DailyChallengeSubmitApiError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "DailyChallengeSubmitApiError";
    this.status = status;
    this.code = code;
  }
}

export const submitDailyChallenge = async (
  answerIndex: number,
  language: string = "en",
  timezone?: string
): Promise<DailyChallengeSubmitResponse> => {
  try {
    const payload: DailyChallengeSubmitRequest = {
      answer_index: answerIndex,
      lang: language
    };

    // Add timezone header if provided
    const headers: Record<string, string> = {};
    if (timezone) {
      headers['X-User-Timezone'] = timezone;
    }
    
    const response = await authApi.post<DailyChallengeSubmitResponse>(
      `/insights/daily-submit/`,
      payload,
      { headers }
    );
    
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data as DailyChallengeSubmitErrorResponse;
      
      const message = errorData?.error || error.message || "Failed to submit daily challenge";
      const code = errorData?.code;
      
      throw new DailyChallengeSubmitApiError(message, status, code);
    }
    throw new DailyChallengeSubmitApiError("Failed to submit daily challenge");
  }
};

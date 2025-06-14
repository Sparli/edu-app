// saveContentApi.ts
import authApi from "../utils/authApi";

interface SaveContentPayload {
  rating?: number | null;
  feedback?: string | null;
}

interface SaveSuccessResponse {
  success: true;
  message: string;
  lesson_saved: boolean;
  Quiz_submitted: boolean;
  Reflection_submitted: boolean;
}

interface SaveErrorResponse {
  success: false;
  error: string;
}

export const saveContent = async (
  payload: SaveContentPayload
): Promise<SaveSuccessResponse | SaveErrorResponse> => {
  try {
    const res = await authApi.post("/content/save-content/", payload);
    return res.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    return {
      success: false,
      error: error.response?.data?.error ?? "Unexpected server error.",
    };
  }
};

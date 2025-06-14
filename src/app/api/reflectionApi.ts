import authApi from "../utils/authApi";

interface SubmitReflectionPayload {
  user_answer: string;
  language: "en" | "fr";
}

interface SubmitReflectionSuccess {
  success: true;
  feedback: string;
  submitted_ref: true;
}

interface SubmitReflectionError {
  success: false;
  error: string | Record<string, string[]>;
}

interface AxiosErrorShape {
  response?: {
    data?: {
      error?: string | Record<string, string[]>;
    };
  };
}

export const submitReflection = async (
  payload: SubmitReflectionPayload
): Promise<SubmitReflectionSuccess | SubmitReflectionError> => {
  try {
    const response = await authApi.post("/content/reflection/submit/", payload);
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosErrorShape;

    return {
      success: false,
      error: err?.response?.data?.error ?? "Unexpected server error.",
    };
  }
};

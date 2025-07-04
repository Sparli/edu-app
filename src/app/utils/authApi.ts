// src/app/utils/authApi.ts
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "@/app/config";

interface DecodedToken {
  exp: number;
  [key: string]: unknown;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
};

const PUBLIC_ENDPOINTS = [
  "/users/register/",
  "/users/verify-otp/",
  "/users/resend-otp/",
  "/users/token/refresh/",
  "/users/login/",
  "/users/forgot-password/request-otp/",
  "/users/forgot-password/verify-otp/",
  "/users/forgot-password/reset/",
];

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach access token unless endpoint is public
authApi.interceptors.request.use(async (config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));
  let access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  if (!isPublic) {
    if (access && isTokenExpired(access) && refresh) {
      try {
        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
          refresh,
        });
        access = response.data.access;
        if (typeof access === "string") {
          localStorage.setItem("access", access);
        }
      } catch {
        console.warn("Token refresh failed. Clearing tokens...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Remove the hard redirect to let the calling component handle navigation
      }
    }

    if (access && config.headers) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${access}`;
    }
  }

  return config;
});

export async function deleteAccount(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await authApi.delete("/users/account/delete/");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("❌ Failed to delete account:", error.response.data);
      throw new Error(error.response.data?.message || "Failed to delete account");
    }
    console.error("❌ Unknown deletion error:", error);
    throw new Error("Unknown error occurred during account deletion");
  }
}

// Response Interceptor: Auto-refresh and retry once on 401
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url))
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      try {
        const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
          refresh,
        });
        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return authApi(originalRequest); // Retry original request
      } catch {
        console.warn("Retry after refresh failed. Clearing tokens...");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // Remove the optional redirect to let the calling component handle navigation
      }
    }

    return Promise.reject(error);
  }
);

export const signOutAllDevices = async () => {
  const res = await authApi.post("/user-settings/sign-out-all/");
  return res.data;
};

export const changePassword = async ({
  current_password,
  new_password,
  refresh_token,
}: {
  current_password: string;
  new_password: string;
  refresh_token: string;
}): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await authApi.post("/user-settings/password/update/", {
      current_password,
      new_password,
      refresh_token,
    });

    return response.data;
} catch (error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      error:
        error.response?.data?.error ||
        "An unknown error occurred while updating password.",
    };
  }

  return {
    success: false,
    error: "Unexpected error occurred during password update.",
  };
}

};


export default authApi;

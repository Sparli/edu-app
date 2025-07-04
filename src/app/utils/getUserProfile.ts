import authApi from "./authApi";

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
  is_subscribed: boolean;
  subscription_status: string;
  gender?: "male" | "female";
first_visit?: boolean;


  // ✅ Add these
  daily_quota_used?: number;
  daily_quota_limit?: number;
  daily_quota_date?: string;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await authApi.get("/users/profile/");
    const profile = response.data?.profile;

    if (!profile) return null;

return {
  first_name: profile.first_name,
  last_name: profile.last_name,
  email: profile.email,
  profile_image: profile.profile_image,
  is_subscribed: profile.is_subscribed,
  subscription_status: profile.subscription_status,
  gender: profile.gender,
first_visit: profile.first_visit,


  // ✅ Add these
  daily_quota_used: profile.daily_quota_used,
  daily_quota_limit: profile.daily_quota_limit,
  daily_quota_date: profile.daily_quota_date,
};

  } catch (error) {
    console.error("Failed to fetch user profile", error);
    return null;
  }
};

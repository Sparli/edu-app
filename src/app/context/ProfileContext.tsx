"use client";

import React, { createContext, useContext, useState } from "react";

export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  is_subscribed: boolean;
  profile_image?: string;
  subscription_status?: string;
  // ✨ Add these:
  daily_quota_used?: number;
  daily_quota_limit?: number;
  daily_quota_date?: string | null;
}

type ProfileContextType = {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<Profile | null>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

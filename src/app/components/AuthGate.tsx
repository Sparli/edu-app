// src/components/AuthGate.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "@/app/context/ProfileContext"; // ✅ import context
import { getUserProfile } from "@/app/utils/getUserProfile"; // ✅ import API util

const PUBLIC_PATHS = [
  "/auth",
  "/signup",
  "/otp",
  "/forgot-password",
  "/otp2",
  "/Recover-password",
];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const { setProfile } = useProfile(); // ✅ get context setter

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.includes(pathname);
    const token = localStorage.getItem("access");

    if (isPublic) {
      setAllowed(true);
      return;
    }

    if (!token) {
      router.replace("/auth");
      return;
    }

    // ✅ Authenticated & private route: fetch profile
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        if (profile) {
          setProfile({
            ...profile,
            profile_image: profile.profile_image ?? undefined,
          });
        } else {
          console.warn("No profile returned, forcing re-auth.");
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
        router.replace("/auth"); // Fallback: logout
      } finally {
        setAllowed(true); // ✅ proceed regardless to show page
      }
    };

    loadProfile();
  }, [pathname, router, setProfile]);

  if (!allowed) return null; // or loading spinner

  return <>{children}</>;
}

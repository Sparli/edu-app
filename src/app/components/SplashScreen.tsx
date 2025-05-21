"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SplashScreen = ({ targetRoute = "/auth" }: { targetRoute?: string }) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(targetRoute);
    }, 2000); // 3 seconds splash duration

    return () => clearTimeout(timer);
  }, [router, targetRoute]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-blue-500 to-green-400">
      <div className="flex flex-col items-center space-y-10">
        <div className="w-48 h-48 rounded-full bg-white shadow-lg flex items-center justify-center border-8 border-opacity-30 border-white">
          <Image
            src="/images/book.svg"
            alt="EduImmersion Logo"
            width={150}
            height={150}
            priority
          />
        </div>
        <div className="w-72 sm:w-96 h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SplashScreen = ({
  targetRoute = "/dashboard",
}: {
  targetRoute?: string;
}) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(targetRoute);
    }, 3000); // 3 seconds splash duration

    return () => clearTimeout(timer);
  }, [router, targetRoute]);

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-r from-blue-500 to-green-400">
      <div className="flex flex-col items-center space-y-10">
        <div className="rounded-full  lg:border-30 border-20  border-[#FFCCB4]/30 ">
          <div className="lg:w-90 lg:h-90 w-50 h-50 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Image
              src="/images/book.svg"
              alt="EduImmersion Logo"
              width={300}
              height={300}
              priority
              className="w-40 h-40 lg:w-80 lg:h-80"
            />
          </div>
        </div>
        <div className="lg:w-92 w-60 lg:h-4 h-2 bg-[#D9D9D9] bg-opacity-50 rounded-full overflow-hidden">
          <div className="h-full bg-[#FEFFFF] rounded-full animate-fill-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

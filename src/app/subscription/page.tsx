import React from "react";
import PremiumSection from "@/app/sections/PremiumSection";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

export default function SubscriptionPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#Ffffff]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        <div className="flex-1 overflow-y-auto px-4">
          <PremiumSection />
        </div>
      </div>
    </div>
  );
}

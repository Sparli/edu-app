import React from "react";
import PremiumSection from "@/app/sections/PremiumSection";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";

export default function SubscriptionPage() {
  return (
    <div className="flex min-h-screen bg-[#Ffffff]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        <PremiumSection />
      </div>
    </div>
  );
}

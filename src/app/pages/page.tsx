import React from "react";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import ComingSoon from "../components/coming-soon";

export default function SubscriptionPage() {
  return (
    <div className="flex min-h-screen bg-[#Ffffff]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <ComingSoon />
      </div>
    </div>
  );
}

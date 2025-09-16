"use client";

import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import { useProfile } from "@/app/context/ProfileContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useProfile();

  return (
    <div
      className={`flex h-screen ${
        profile?.is_subscribed ? "bg-[#F5F6FA]" : "bg-[#ffffff]"
      }`}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />
        <hr className="text-[#E5E7EB] mt-2" />
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

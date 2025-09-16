import React from "react";
import QuickGenerate from "../QuickGenerate";
import DashboardCards from "../DashboardCards";

export default function index() {
  return (
    <div>
      <DashboardCards />
      <hr className="text-[#E5E7EB]" />
      <QuickGenerate />
    </div>
  );
}

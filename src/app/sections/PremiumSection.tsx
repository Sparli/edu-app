"use client";
import React from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { PricingPage, PremiumMonthlyView, PremiumYearlyView } from "./Premium";

const PremiumSection: React.FC = () => {
  const { profile } = useProfile();

  // Determine which component to render based on subscription status
  const renderComponent = () => {
    if (!profile?.is_subscribed) {
      // User is not subscribed, show pricing page
      return <PricingPage />;
    }

    // User is subscribed, check plan type
    const planType = profile.plan_id;

    switch (planType) {
      case "monthly":
        return <PremiumMonthlyView />;
      case "yearly":
        return <PremiumYearlyView />;
      default:
        // Fallback to pricing page if plan type is unknown
        return <PricingPage />;
    }
  };

  return renderComponent();
};

export default PremiumSection;

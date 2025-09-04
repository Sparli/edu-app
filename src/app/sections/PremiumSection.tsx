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

    // User is subscribed, check subscription type
    const subscriptionType = profile.subscription_status;

    switch (subscriptionType) {
      case "monthly":
        return <PremiumMonthlyView />;
      case "yearly":
        return <PremiumYearlyView />;
      default:
        // Fallback to pricing page if subscription type is unknown
        return <PricingPage />;
    }
  };

  return renderComponent();
};

export default PremiumSection;

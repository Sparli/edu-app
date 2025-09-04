"use client";
import React, { useState, useCallback } from "react";
import { useProfile } from "@/app/context/ProfileContext";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "@/app/translations";

// Types
interface PlanFeature {
  id: string;
  text: string;
}

interface PricingPlan {
  id: "free" | "premium";
  name: string;
  price: string;
  originalPrice?: string;
  billing: string;
  features: PlanFeature[];
  isPopular?: boolean;
}

type BillingPeriod = "monthly" | "yearly";

const PricingPage: React.FC = () => {
  const { setProfile } = useProfile();
  const { language } = useLanguage();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("yearly");
  const [loading, setLoading] = useState(false);

  const t = translations[language];

  // Dummy pricing data based on screenshots
  const pricingPlans: PricingPlan[] = [
    {
      id: "free",
      name: t.premium_free_plan,
      price: "$0",
      billing: t.premium_monthly,
      features: [
        { id: "free-1", text: t.premium_feature_limited_quizzes },
        { id: "free-2", text: t.premium_feature_basic_tracking },
        { id: "free-3", text: t.premium_feature_restricted_access },
      ],
    },
    {
      id: "premium",
      name: t.premium_yearly_plan,
      price: billingPeriod === "monthly" ? "$2.99" : "$2.49",
      originalPrice:
        billingPeriod === "yearly"
          ? `$29.99 ${language === "fr" ? "" : t.premium_billed_annually}`
          : undefined,
      billing: t.premium_monthly,
      features: [
        { id: "premium-1", text: t.premium_feature_unlimited_quizzes },
        {
          id: "premium-2",
          text: t.premium_feature_full_access,
        },
        {
          id: "premium-3",
          text: t.premium_feature_personalized_roadmap,
        },
        {
          id: "premium-4",
          text: t.premium_feature_priority_access,
        },
        { id: "premium-5", text: t.premium_feature_all_premium },
      ],
      isPopular: true,
    },
  ];

  const handleSubscribe = useCallback(
    async (planType: "free" | "premium") => {
      if (planType === "free") {
        // Handle free plan selection
        setProfile((prev) =>
          prev ? { ...prev, subscription_status: "free" } : null
        );
        return;
      }

      setLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        // Update profile with subscription status for testing
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                subscription_status: billingPeriod,
                is_subscribed: true,
              }
            : null
        );
        setLoading(false);
      }, 1000);
    },
    [billingPeriod, setProfile]
  );

  const handleBillingToggle = useCallback((period: BillingPeriod) => {
    setBillingPeriod(period);
  }, []);

  return (
    <div className="w-full mt-4 mb-4 px-4 sm:mt-8 sm:mb-8 sm:px-0">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8 text-center lg:text-left">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1F2937] mb-2">
          {t.pricing_title}
        </h1>
        <p className="text-[#4A4A4A] text-sm sm:text-base lg:text-lg">
          {t.pricing_subtitle}
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="bg-[#4A4A4A1A]/90 border-1 border-[#191818] rounded-full py-[6px] px-[12px] sm:py-[8px] sm:px-[16px] flex">
          <button
            onClick={() => handleBillingToggle("monthly")}
            className={`px-[16px] py-1.5 sm:px-[26px] sm:py-2 rounded-full text-sm sm:text-lg transition-all ${
              billingPeriod === "monthly"
                ? "bg-[#23BAD8] text-white font-bold"
                : "text-[#191818] hover:text-gray-800 font-medium"
            }`}
          >
            {t.pricing_monthly}
          </button>
          <button
            onClick={() => handleBillingToggle("yearly")}
            className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-sm sm:text-lg transition-all ${
              billingPeriod === "yearly"
                ? "bg-[#23BAD8] text-white font-bold"
                : "text-[#191818] hover:text-gray-800 font-medium"
            }`}
          >
            {t.pricing_yearly}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white border rounded-2xl mx-auto p-4 sm:p-6 shadow-sm relative flex flex-col ${
              plan.isPopular
                ? "border-[#23BAD8] border-2 sm:border-5 md:h-[569px] mt-8 sm:mt-0 md:max-w-[440px]"
                : "border-gray-200 lg:mt-[158px] md:h-[415px] md:max-w-[436px]"
            }`}
          >
            {/* Popular Badge */}
            {plan.isPopular && billingPeriod === "yearly" && (
              <div className="absolute -top-4 sm:-top-7 left-1/2 transform -translate-x-1/2 mb-[28px]">
                <div
                  className={`bg-gradient-to-r from-blue-500 to-green-400 text-white px-2 py-1 sm:px-4 text-center rounded-full text-lg sm:text-[25px] font-extrabold ${
                    language === "fr"
                      ? "w-[200px] sm:w-[245px]"
                      : "w-[110px] sm:w-[155px]"
                  }`}
                >
                  {t.pricing_save_20}
                </div>
              </div>
            )}

            <div
              className={`${
                plan.isPopular && billingPeriod === "yearly"
                  ? "mt-2 sm:mt-4"
                  : ""
              }`}
            >
              {/* Plan Title */}
              <div className="flex justify-between items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#191818]">
                  {plan.name}
                </h3>
                {plan.originalPrice && (
                  <p className="text-xs sm:text-sm">
                    <span className="font-extrabold text-[#191818] text-sm sm:text-lg mr-1">
                      {plan.originalPrice?.split(" ")[0]}
                    </span>
                    {language === "fr" ? (
                      <>
                        <span className="font-semibold text-gray-400">
                          {" (Facturé"}
                        </span>
                        <br />
                        <span className="font-semibold text-gray-400">
                          {"Annuellement)"}
                        </span>
                      </>
                    ) : null}
                    <span className="font-semibold text-gray-400">
                      {plan.originalPrice?.replace(
                        plan.originalPrice?.split(" ")[0],
                        ""
                      )}
                    </span>
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-1">
                <span className="text-2xl sm:text-3xl md:text-4xl mb-2 font-extrabold text-[#23BAD8]">
                  {plan.price}
                </span>
                <span className="text-lg sm:text-xl md:text-[26px] font-medium text-[#191818]">
                  {plan.billing}
                </span>
              </div>
            </div>
            <hr className="text-[#4A4A4A40]/75 my-3 sm:my-[16px] -mx-4 sm:-mx-6 w-[calc(100%+32px)] sm:w-[calc(100%+48px)]" />
            {/* Features */}
            <ul className="mb-4 sm:mb-6 flex-grow">
              {plan.features.map((feature, index) => (
                <li
                  key={feature.id}
                  className="flex items-start gap-2 sm:gap-3"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#23BAD8] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span
                      className="text-[#191818] font-semibold text-sm sm:text-base leading-tight"
                      style={{
                        lineHeight: "1.1",
                        padding: 0,
                        margin: 0,
                        display: "block",
                      }}
                    >
                      {feature.text}
                    </span>
                    {index < plan.features.length - 1 && (
                      <hr className="text-[#4A4A4A40]/75 my-3 sm:my-[16px] -mx-8 sm:-mx-14 w-[calc(100%+48px)] sm:w-[calc(100%+80px)]" />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Subscribe Button */}
            {plan.id === "premium" && (
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
                className="w-full sm:w-[392px] h-[50px] sm:h-[60px] flex items-center justify-center gap-[10px] bg-[#23BAD8] text-white font-bold text-base sm:text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1ea5c4]"
                style={{
                  borderRadius: "8.34px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  opacity: 1,
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">
                      {t.pricing_processing}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm sm:text-base">
                    {t.pricing_subscribe}
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;

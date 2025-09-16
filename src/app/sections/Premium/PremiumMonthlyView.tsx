"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { useProfile } from "@/app/context/ProfileContext";
import { IoIosSend } from "react-icons/io";
import Image from "next/image";
import { translations } from "@/app/translations";
import {
  createCheckoutSession,
  cancelSubscription,
} from "@/app/utils/subscriptionApi";
import { getUserProfile } from "@/app/utils/getUserProfile";
import CancelSubscriptionModal from "@/app/components/modals/CancelSubscriptionModal";

const PremiumMonthlyView: React.FC = () => {
  const { language } = useLanguage();
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const userName = profile?.first_name || "User";
  const t = translations[language];

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile) {
        setProfileLoading(true);
        try {
          const profileData = await getUserProfile();
          if (profileData) {
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setProfileLoading(false);
        }
      }
    };
    fetchProfile();
  }, [profile, setProfile]);

  // Format subscription validity date
  const formatSubscriptionDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const features = [
    t.premium_feature_unlimited_quizzes,
    t.premium_feature_full_access,
    t.premium_feature_personalized_roadmap,
    t.premium_feature_priority_access,
    t.premium_feature_all_premium,
  ];

  const handleUpgradeToYearly = useCallback(async () => {
    setLoading(true);

    try {
      // Create Stripe checkout session for yearly plan
      const response = await createCheckoutSession("yearly");

      if (response.success && response.checkout_url) {
        // Redirect to Stripe checkout
        window.location.href = response.checkout_url;
      } else {
        throw new Error(response.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Failed to start upgrade process. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDowngradeToFree = useCallback(() => {
    setShowCancelModal(true);
  }, []);

  const handleConfirmCancel = useCallback(async () => {
    setLoading(true);

    try {
      const response = await cancelSubscription();

      if (response.success) {
        // Update profile context to reflect cancellation
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                subscription_status: "free",
                is_subscribed: false,
                subscription_valid_until: response.effective_end,
              }
            : null
        );

        // Show success message
        const successMessage =
          language === "fr"
            ? "Abonnement annulé avec succès. Vous avez maintenant accès au plan gratuit."
            : "Subscription canceled successfully. You now have access to the free plan.";
        alert(successMessage);

        // Close modal
        setShowCancelModal(false);
      } else {
        throw new Error(response.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
      const errorMessage =
        language === "fr"
          ? "Échec de l'annulation de l'abonnement. Veuillez réessayer."
          : "Failed to cancel subscription. Please try again.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setProfile, language]);

  const handleCloseModal = useCallback(() => {
    if (!loading) {
      setShowCancelModal(false);
    }
  }, [loading]);

  return (
    <div className="w-full mt-4 mb-4 px-4 sm:mt-8 sm:mb-8 sm:px-0">
      {/* Greeting Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Image
            src="/images/hand.png"
            alt="Wave"
            width={20}
            height={20}
            className="sm:w-6 sm:h-6"
          />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#1F2937]">
            {t.premium_monthly_greeting.replace("{{name}}", userName)}
          </h1>
        </div>
        <p className="text-[#4A4A4A] text-sm sm:text-base">
          {t.premium_monthly_ready}
        </p>
      </div>

      {/* Premium Plan Card */}
      <div className="flex">
        <div className="bg-white shadow-lg overflow-hidden flex flex-col gap-3 sm:gap-5 w-full h-full rounded-[16px] sm:rounded-[20px] border-2 border-gray-200 pt-4 pb-4 sm:pt-5 sm:pb-5">
          {/* Validity Badge */}
          <div
            className="w-full sm:w-[370px] h-[50px] sm:h-[68px] flex items-center gap-[10px] px-4 sm:px-8 py-3 sm:py-4 text-white text-center font-bold text-sm sm:text-base"
            style={{
              background:
                "linear-gradient(63.38deg, #0463EF 7.06%, #16EA9E 104.99%)",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              opacity: 1,
            }}
          >
            <span>
              {t.premium_monthly_valid_till.replace(
                "{{date}}",
                profileLoading
                  ? "..."
                  : formatSubscriptionDate(profile?.subscription_valid_until)
              )}
            </span>
          </div>

          {/* Card Content */}
          <div className="px-4 sm:px-6 flex-1">
            {/* Plan Title */}
            <h2
              className="font-bold text-2xl sm:text-3xl md:text-[40px] leading-[100%] tracking-normal text-[#191818] mb-4 sm:mb-6"
              style={{ fontStyle: "bold" }}
            >
              {t.premium_monthly_plan_title}
            </h2>
            <hr className="text-[#4A4A4A40]/75 my-3 sm:my-[16px] -mx-4 sm:-mx-14 w-[calc(100%+32px)] sm:w-[calc(100%+80px)]" />
            {/* Features List */}
            <ul className="">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 border-b border-[#4A4A4A40] py-3 sm:py-[18px] last:border-b-0"
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
                  <span className="text-[#191818] font-semibold text-base sm:text-lg md:text-[20px] leading-[145%]">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Upgrade Button */}
            <div className="flex justify-center mt-3 sm:mt-4">
              <button
                onClick={handleUpgradeToYearly}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-[#23BAD8] to-[#20C997] text-white text-lg sm:text-xl md:text-[24px] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:from-[#1ea5c4] hover:to-[#1bb085] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">
                      {t.premium_monthly_processing}
                    </span>
                  </span>
                ) : (
                  <span className="text-sm sm:text-base">
                    {t.premium_monthly_upgrade_btn}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Downgrade Button */}
      <div className="flex mt-4 sm:mt-[20px]  justify-center sm:justify-end">
        <button
          onClick={handleDowngradeToFree}
          disabled={loading}
          className={`flex items-center gap-1 border  text-sm sm:text-lg font-semibold border-[#FF2E2E] text-[#FF2E2E] w-full ${
            language === "fr"
              ? "sm:max-w-[330px] max-w-[280px]"
              : "sm:max-w-[260px] max-w-[230px]"
          } h-[38px] sm:h-[42px] rounded-[8px] sm:rounded-[10px] hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 opacity-100`}
        >
          <span className="text-sm sm:text-base ">
            {t.premium_downgrade_btn}
          </span>
          <IoIosSend className="w-4 h-4 sm:w-[19px] sm:h-[19px]" />
        </button>
      </div>

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        loading={loading}
        language={language}
      />
    </div>
  );
};

export default PremiumMonthlyView;

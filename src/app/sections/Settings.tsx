// src/app/components/Settings.tsx
"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import SignOutAllDevicesModal from "../components/SignOutAllDevicesModal";
import ChangePasswordModal from "@/app/components/ChangePasswordModal";
import { deleteAccount, signOutAllDevices } from "@/app/utils/authApi";
import { useRouter } from "next/navigation";
import authApi from "@/app/utils/authApi";
import axios from "axios";
import ContentSpinner from "./ContentSpinner";
import { changePassword } from "@/app/utils/authApi";

// 1) API helpers at the top of the file
const fetchNotificationSettings = async (): Promise<
  Record<string, boolean>
> => {
  const res = await authApi.get("/user-settings/preferences/");
  // backend returns { success: true, preferences: { … } }
  return res.data.preferences;
};

const updateNotificationSetting = async (
  data: Record<string, boolean>
): Promise<boolean> => {
  const res = await authApi.patch("/user-settings/preferences/", data);
  // returns { success: true, message: "…" }
  return res.data.success;
};

export default function Settings() {
  const { language } = useLanguage();
  const t = translations[language];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const router = useRouter();

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteAccount();
      if (res.success) {
        // Clear all auth-related storage immediately
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        sessionStorage.clear();
        axios.defaults.headers.common["Authorization"] = "";

        // Immediate redirect using router.replace to avoid history entry
        router.replace("/auth/login");
      }
    } catch (err) {
      console.error("❌ Error deleting account:", err);
    }
  };

  const settingsData = [
    {
      title: t.setting_feedback,
      description: t.desc_feedback,
    },
    {
      title: t.setting_subscription,
      description: t.desc_subscription,
    },
  ];

  // 2) State + keys inside your Settings() component
  const [toggles, setToggles] = useState([false, false]);
  const [toggleDisabled, setToggleDisabled] = useState([false, false]);
  const [loading, setLoading] = useState(true);

  const backendKeys = [
    "receive_feedback_acknowledgement",
    "receive_subscription_update",
  ];

  const toggleSetting = async (index: number) => {
    const field = backendKeys[index];
    if (!field) return;

    // 1. Grab the current state and compute the new value
    const currentValue = toggles[index];
    const newValue = !currentValue;

    // 2. Disable this toggle while we’re working
    setToggleDisabled((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    // 3. Immediately update the UI
    setToggles((prev) => {
      const next = [...prev];
      next[index] = newValue;
      return next;
    });

    try {
      // 4. Send exactly newValue
      await updateNotificationSetting({ [field]: newValue });
      console.log(`✅ ${field} updated to`, newValue);
    } catch (err) {
      console.error(`❌ Failed to update ${field}`, err);
      // 5. Roll back UI on error
      setToggles((prev) => {
        const next = [...prev];
        next[index] = currentValue;
        return next;
      });
    } finally {
      // 6. Re-enable the toggle control
      setToggleDisabled((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  useEffect(() => {
    if (showDeleteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showDeleteModal]);

  // 3) Load initial settings in useEffect
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const preferences = await fetchNotificationSettings();
        const initialToggles = backendKeys.map((key) => !!preferences[key]);
        setToggles(initialToggles);
      } catch (err) {
        console.error("⚠️ Failed to fetch notification settings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 ml-3 bg-white">
      {loading ? (
        <ContentSpinner />
      ) : (
        <>
          <h1 className="text-[33px] lg:text-4xl font-semibold mb-2">
            {t.settingsTitle}
          </h1>
          <p className="text-[#4B5563] text-xl lg:text-2xl font-normal mb-10">
            {t.settingsSubtitle}
          </p>

          {/* Notification Preferences */}

          <div className="bg-white border-1 border-[#e2e2e2e4] rounded-xl p-6 space-y-4">
            <h2 className="lg:text-[20px] text-lg font-semibold text-gray-800">
              {t.notification_preferences_title}
            </h2>

            {settingsData.slice(0, 3).map((setting, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between border border-[#E2E2E2] rounded-lg px-4 py-3"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {setting.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-2">
                    {setting.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleSetting(index)}
                  disabled={loading || toggleDisabled[index]}
                  className={`w-11 h-6 ml-4 flex-shrink-0 items-center rounded-full p-1 cursor-pointer transition-colors ${
                    toggles[index] ? "bg-cyan-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      toggles[index] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Rough Draft */}

          <div className="bg-white border-1 border-[#e2e2e2e4] rounded-xl p-6 space-y-4 mt-10">
            <h2 className="lg:text-[20px] text-lg font-semibold text-gray-800">
              {t.security}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-[#E2E2E2] rounded-lg px-4 py-3 gap-4">
              <div>
                <h3 className="text-lg font-medium text-black">
                  {t.change_password_title}
                </h3>
                <p className="text-sm text-[#757575] mt-1">
                  {t.change_password_subtitle}
                </p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-cyan-500 text-white font-medium  cursor-pointer px-4 py-2.5 text-[15px] rounded-lg hover:bg-cyan-600 transition"
              >
                {t.change_password_button}
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-[#E2E2E2] rounded-lg px-4 py-3 gap-4">
              <div>
                <h3 className="text-lg font-medium text-black">
                  {t.signout_all_title}
                </h3>
                <p className="text-sm text-[#757575] mt-1">
                  {t.signout_all_desc}
                </p>
              </div>
              <button
                onClick={() => setShowSignOutModal(true)}
                className="bg-cyan-500 text-white font-medium  cursor-pointer px-4 py-2.5 text-[15px] rounded-lg hover:bg-cyan-600 transition"
              >
                {t.signout_all_btn}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#FF3A441A]/90 border border-[#FF3A44] mt-10 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#FF3A44]">
              {t.danger_zone_title}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-[#E2E2E2] rounded-lg px-4 py-3 gap-4">
              <div>
                <h3 className="text-lg font-medium text-black">
                  {t.delete_account_title}
                </h3>
                <p className="text-sm text-[#757575] mt-1">
                  {t.delete_account_desct}
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-[#FF3A4426]/85 text-[#FF3A44] font-medium w-full sm:w-auto text-center px-4 py-2.5 cursor-pointer text-[15px] border border-[#FF3A44] rounded-md hover:bg-red-200 transition"
              >
                {t.delete_account_btn}
              </button>
            </div>
          </div>

          {showSignOutModal && (
            <SignOutAllDevicesModal
              isProcessing={isSigningOut}
              onCancel={() => {
                setShowSignOutModal(false);
                setSignOutError(null);
                setIsSigningOut(false);
              }}
              onConfirm={async () => {
                setIsSigningOut(true);
                setSignOutError(null);

                try {
                  const res = await signOutAllDevices();
                  if (res.success) {
                    localStorage.clear();
                    sessionStorage.clear();
                    delete axios.defaults.headers.common["Authorization"];
                    router.replace("/auth/login");
                  } else {
                    setSignOutError(
                      `${t.signout_error_specific}${
                        res.error || "Unknown error."
                      }`
                    );
                  }
                } catch (err) {
                  console.error("❌ Error signing out all devices:", err);
                  setSignOutError(t.signout_error_generic);
                } finally {
                  setIsSigningOut(false);
                }
              }}
              errorMessage={signOutError ?? undefined}
            />
          )}
        </>
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            handleConfirmDelete();
          }}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onCancel={() => setShowPasswordModal(false)}
          onConfirm={async (
            current: string,
            newPass: string,
            confirm: string
          ): Promise<boolean> => {
            setIsProcessing(true);
            setPasswordError(null);

            if (newPass !== confirm) {
              setPasswordError(t.passwords_do_not_match);
              setIsProcessing(false);
              return false; // ❌ password mismatch
            }

            const refreshToken =
              localStorage.getItem("refresh") ||
              sessionStorage.getItem("refresh");

            if (!refreshToken) {
              setPasswordError(t.no_refresh_token);
              setIsProcessing(false);
              return false; // ❌ no token
            }

            const result = await changePassword({
              current_password: current,
              new_password: newPass,
              refresh_token: refreshToken,
            });

            setIsProcessing(false);

            if (result.success) {
              // ✅ success: modal will close automatically after setShowModal(true)
              return true;
            } else {
              setPasswordError(result.error || "Unknown error.");
              return false;
            }
          }}
          errorMessage={passwordError || undefined}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

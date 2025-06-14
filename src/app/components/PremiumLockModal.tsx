"use client";

import React from "react";
import { useRouter } from "next/navigation";

// PremiumLockModal.tsx
interface PremiumLockModalProps {
  onClose: () => void;
  t: {
    premium_only_title: string;
    premium_only_message: string;
    upgrade_now: string;
    cancel: string;
  };
}

export default function PremiumLockModal({
  onClose,
  t,
}: PremiumLockModalProps) {
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {t.premium_only_title || "Premium Feature"}
        </h3>
        <p className="text-gray-600 mb-4">
          {t.premium_only_message ||
            "This feature is available in Premium only."}
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
          >
            {t.cancel || "Cancel"}
          </button>
          <button
            onClick={() => {
              onClose();
              router.push("/subscription");
            }}
            className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-sm"
          >
            {t.upgrade_now || "Upgrade"}
          </button>
        </div>
      </div>
    </div>
  );
}

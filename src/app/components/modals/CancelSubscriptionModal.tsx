"use client";
import React from "react";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  language: "en" | "fr";
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  language,
}) => {
  if (!isOpen) return null;

  const t = {
    en: {
      title: "Cancel Subscription",
      message:
        "By moving to the Free plan, you'll lose premium features right away. This action cannot be undone.",
      warning: "Are you sure you want to proceed?",
      cancel: "Keep Premium",
      confirm: "Yes, Cancel Subscription",
      processing: "Canceling...",
    },
    fr: {
      title: "Annuler l'abonnement",
      message:
        "En passant au plan gratuit, vous perdrez immédiatement les fonctionnalités premium. Cette action ne peut pas être annulée.",
      warning: "Êtes-vous sûr de vouloir continuer ?",
      cancel: "Garder Premium",
      confirm: "Oui, Annuler l'abonnement",
      processing: "Annulation...",
    },
  };

  const translations = t[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {translations.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            {translations.message}
          </p>
          <p className="text-gray-800 font-medium text-sm">
            {translations.warning}
          </p>
        </div>

        {/* Features that will be lost */}
        <div className="px-6 py-4 bg-gray-50">
          <p className="text-xs font-medium text-gray-700 mb-3">
            {language === "fr"
              ? "Fonctionnalités perdues :"
              : "Features you'll lose:"}
          </p>
          <div className="space-y-2">
            {[
              language === "fr" ? "Quiz illimités" : "Unlimited quizzes",
              language === "fr" ? "Accès complet" : "Full access",
              language === "fr"
                ? "Roadmap personnalisée"
                : "Personalized roadmap",
              language === "fr" ? "Accès prioritaire" : "Priority access",
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-xs text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {translations.cancel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            {loading ? translations.processing : translations.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;

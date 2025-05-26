"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";

const ProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("Alex Broad");
  const [email] = useState("alex@gmail.com");
  const [updated, setUpdated] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language];

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    const enableScroll = () => {
      document.body.style.overflow = "";
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      disableScroll();
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      enableScroll();
    };
  }, [isOpen, onClose]);

  const handleSave = () => {
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 sm:p-10 w-full max-w-3xl min-h-[686px] relative"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-xl">
          <FaTimes />
        </button>

        <div className="lg:ml-8">
          <h2 className="text-2xl font-bold mb-2">{t.profile_title}</h2>
          <p className="text-gray-500 mb-6">{t.profile_subtext}</p>

          {/* Profile Image */}
          <div className="flex flex-col lg:flex-row  lg:items-center mt-11 mb-11 gap-6">
            <Image
              src="/images/avtar.jpg"
              alt="User"
              width={90}
              height={90}
              className="rounded-full"
            />
            <div className="flex gap-4">
              <button className="px-6 py-1 rounded-lg border border-gray-500 text-sm">
                {t.profile_update}
              </button>
              <button className="flex items-center gap-2 text-sm">
                <FaTrashAlt /> {t.profile_remove}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-12">
            <div>
              <label className="text-gray-700 font-semibold block mb-1">
                {t.profile_name_label}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="lg:w-1/2 p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-gray-700 font-semibold block mb-1">
                {t.profile_email_label}
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="lg:w-1/2 p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-[#23BAD8] hover:bg-cyan-600 text-white lg:px-6 px-4 py-3 rounded-lg lg:w-1/4 font-semibold"
            >
              {t.profile_save}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-600 lg:px-6 px-4 py-3 rounded-lg lg:w-1/4"
            >
              {t.profile_cancel}
            </button>
          </div>

          {/* Success Message */}
          {updated && (
            <div className="w-1/2 mt-6 bg-green-100 text-green-700 p-3 rounded-lg text-center text-sm font-medium">
              {t.profile_success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

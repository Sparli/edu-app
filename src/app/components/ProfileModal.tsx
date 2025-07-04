"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import { useLanguage } from "@/app/context/LanguageContext";
import { translations } from "../translations";
import { useProfile } from "@/app/context/ProfileContext";
import authApi from "@/app/utils/authApi";
import axios from "axios";
import ImageCropper from "@/app/components/ImageCropper";
// import type { Profile } from "@/app/context/ProfileContext";

const ProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [updated, setUpdated] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language];
  const { profile, setProfile } = useProfile();
  const [removeImage, setRemoveImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // new code
  const [manuallyUpdatedImage, setManuallyUpdatedImage] = useState(false);

  useEffect(() => {
    if (!isOpen || !profile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const disableScroll = () => (document.body.style.overflow = "hidden");
    const enableScroll = () => (document.body.style.overflow = "");

    setFirstName(profile.first_name || "");
    setLastName(profile.last_name || "");
    setEmail(profile.email || "");

    if (!manuallyUpdatedImage) {
      setPreview(profile.profile_image || null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    disableScroll();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      enableScroll();
    };
  }, [isOpen, profile, onClose, manuallyUpdatedImage]);

  const handleSave = async () => {
    if (!firstName.trim() && !lastName.trim() && !imageFile && !preview) {
      alert("Nothing to update");
      return;
    }

    const formData = new FormData();
    if (firstName.trim()) formData.append("first_name", firstName.trim());
    if (lastName.trim()) formData.append("last_name", lastName.trim());
    if (imageFile instanceof File) {
      formData.append("profile_image", imageFile);
    }

    formData.append("remove_image", removeImage ? "true" : "false");

    try {
      const res = await authApi.patch("/users/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      setUpdated(true);
      setTimeout(() => {
        setProfile((prev) => {
          if (!prev) return data.profile;
          return { ...prev, ...data.profile };
        });
      }, 100);

      setTimeout(() => setUpdated(false), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const fullError = Object.entries(errors)
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n");
        alert(`Update failed:\n${fullError}`);
      } else {
        alert("Something went wrong.");
      }
    }
  };

  // ghwal ghapar
  const handleRemove = async () => {
    const formData = new FormData();
    formData.append("remove_image", "true");

    try {
      const res = await authApi.patch("/users/profile/update/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      // setUpdated(true);
      setUpdated(true);
      setTimeout(() => {
        setProfile((prev) => {
          if (!prev) return data.profile;
          return { ...prev, ...data.profile };
        });
      }, 100);

      setImageFile(null);
      setPreview(null);
      setRemoveImage(true); // ✅ Set the flag now
      // setTimeout(() => setUpdated(false), 3000);
      setManuallyUpdatedImage(false); // reset override blocker after save
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const fullError = Object.entries(errors)
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n");
        alert(`Update failed:\n${fullError}`);
      } else {
        alert("Something went wrong.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 sm:p-10 w-full max-w-3xl min-h-[686px] relative"
      >
        <button
          onClick={onClose}
          className="absolute cursor-pointer right-6 top-6 text-xl"
        >
          <FaTimes />
        </button>

        <div className="lg:ml-8">
          <h2 className="text-[27px] text-[Text] font-semibold mb-2">
            {t.profile_title}
          </h2>
          <p className="text-[#666666] lg:text-lg font-normal mb-6">
            {t.profile_subtext}
          </p>

          {profile?.is_subscribed ? (
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              {language === "fr" ? "Abonnement actif" : "Premium User"}
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-4 hover:bg-gray-200 cursor-help"
              title={
                language === "fr"
                  ? "En tant qu'utilisateur de base, vous pouvez générer jusqu'à 1 élément par jour."
                  : "As a Basic user, you can generate 1 item per day. Upgrade anytime to lift the limit!"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 1a11 11 0 100 22 11 11 0 000-22zm1 11.586l3.707 3.707-1.414 1.414L11 13V6h2v6.586z" />
              </svg>
              {language === "fr"
                ? `Basique (${profile?.daily_quota_used ?? 0} / ${
                    profile?.daily_quota_limit ?? 0
                  })`
                : `Basic (${profile?.daily_quota_used ?? 0} / ${
                    profile?.daily_quota_limit ?? 0
                  })`}
            </div>
          )}

          {/* Profile Image */}
          <div className="flex flex-col lg:flex-row lg:items-center mt-11 mb-11 gap-6">
            <div className="relative w-[100px] h-[100px]">
              <Image
                src={
                  preview ||
                  (profile?.profile_image
                    ? profile.profile_image.replace("http://", "https://")
                    : "/images/avtar.jpg")
                }
                alt="User Avatar"
                width={100}
                height={100}
                className="rounded-full object-cover w-full h-full cursor-pointer"
                onClick={() => inputRef.current?.click()}
              />

              {/* Edit Icon */}
              <div
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l-6 6H9v-2z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <input
                ref={inputRef}
                id="profile-image-input"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const validTypes = ["image/png", "image/jpeg"];
                  const maxSize = 2 * 1024 * 1024;

                  if (!validTypes.includes(file.type)) {
                    alert("Invalid file type. Use PNG or JPEG.");
                    return;
                  }
                  if (file.size > maxSize) {
                    alert("File too large. Max 2MB allowed.");
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = () => {
                    setTempImageUrl(reader.result as string);
                    setShowCropper(true);
                  };
                  reader.readAsDataURL(file);
                }}
              />

              <button
                type="button"
                className="px-6 py-2 rounded-2xl border border-gray-500 cursor-pointer text-lg"
                onClick={() => inputRef.current?.click()}
              >
                {t.profile_update}
              </button>

              <button
                type="button"
                className="flex items-center gap-2 text-lg text-red-600 cursor-pointer"
                onClick={() => {
                  setImageFile(null);
                  setPreview(null);
                  handleRemove();
                  // setRemoveImage(true); // ✅ Explicitly mark image for removal
                }}
              >
                <FaTrashAlt /> {t.profile_remove}
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-12">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 lg:text-lg text-md text-gray-700">
                  {t.auth_first_name}
                </label>
                <input
                  type="text"
                  value={firstName}
                  placeholder="Alex"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 lg:text-lg text-md text-gray-700">
                  {t.auth_last_name}
                </label>
                <input
                  type="text"
                  value={lastName}
                  placeholder="Smith"
                  onChange={(e) => setLastName(e.target.value)}
                  className="p-3 rounded-lg bg-[#F6F6F6] w-full focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-gray-700 font-semibold block mb-1">
                {t.profile_email_label}
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="lg:w-full p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-[#23BAD8] hover:bg-cyan-600 cursor-pointer text-white lg:px-6 px-4 py-3 rounded-lg lg:w-1/3 font-semibold"
            >
              {t.profile_save}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-600 cursor-pointer lg:px-6 px-4 py-3 rounded-lg lg:w-1/3"
            >
              {t.profile_cancel}
            </button>
          </div>

          {/* Success Message */}
          {updated && (
            <div className="w-1/2 mt-6 bg-[#ECFDF5] text-[#065F46] p-3 rounded-lg text-left text-base font-medium">
              {t.profile_success}
            </div>
          )}

          {showCropper && tempImageUrl && (
            <ImageCropper
              imageSrc={tempImageUrl}
              onCropComplete={(blob) => {
                const croppedFile = new File([blob], "cropped.jpg", {
                  type: "image/jpeg",
                });
                const previewUrl = URL.createObjectURL(blob);

                // Safely update state *before hiding the modal*
                setImageFile(croppedFile);
                setPreview(previewUrl);
                setRemoveImage(false);
                setManuallyUpdatedImage(true);

                // Wait 100ms to make sure state is applied
                setTimeout(() => {
                  setShowCropper(false);
                }, 100);
              }}
              onClose={() => setShowCropper(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

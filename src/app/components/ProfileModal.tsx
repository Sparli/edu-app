"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTimes, FaTrashAlt } from "react-icons/fa";

const ProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("Alex Broad");
  const [email, setEmail] = useState("alex@gmail.com");
  const [updated, setUpdated] = useState(false);

  const handleSave = () => {
    setUpdated(true);
    setTimeout(() => setUpdated(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white  rounded-2xl p-6 sm:p-10 w-full max-w-3xl min-h-[686px] relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute right-6 top-6 text-xl">
          <FaTimes />
        </button>
        <div className="ml-8">
          <h2 className="text-2xl font-bold  mb-2">My Profile</h2>
          <p className=" text-gray-500 mb-6">You can update your info below.</p>

          {/* Profile Image */}
          <div className="flex items-center mt-11 mb-11 gap-6">
            <Image
              src="/images/image.png"
              alt="User"
              width={90}
              height={90}
              className="rounded-full"
            />

            <div className="flex gap-4">
              <button className="px-4 py-1 rounded-full border border-gray-500 text-sm">
                Update
              </button>
              <button className="flex items-center gap-2 text-sm">
                <FaTrashAlt /> Remove
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-12">
            <div>
              <label className="text-gray-700 font-semibold block mb-1">
                Full Name
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
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="lg:w-1/2 p-3 rounded-lg bg-[#F6F6F6] focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-12 flex gap-4">
            <button
              onClick={handleSave}
              className="bg-[#23BAD8] hover:bg-cyan-600 text-white px-6 py-3 rounded-lg lg:w-1/4 font-semibold"
            >
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg lg:w-1/4"
            >
              Cancel
            </button>
          </div>

          {/* Success Message */}
          {updated && (
            <div className="w-1/2 mt-6 bg-green-100 text-green-700 p-3 rounded-lg text-center text-sm font-medium">
              ✅ Profile updated successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;

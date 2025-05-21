"use client";
import React, { useState } from "react";
import Image from "next/image";
import ProfileModal from "./ProfileModal";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="w-64 bg-[#FAFAFA] p-6 lg:flex flex-col justify-between hidden border-r border-gray-200">
      {/* Top Section */}
      <div>
        <div className="flex items-center space-x-2 mb-10">
          <Image src="/images/main.svg" alt="Logo" width={350} height={350} />
        </div>

        {/* Navigation Links */}
        <nav className="space-y-8">
          <SidebarLink
            imageSrc="/images/black.svg"
            label="Dashboard"
            href="/dashboard"
          />
          <SidebarLink
            imageSrc="/images/ai.png"
            label="Generate Content"
            href="/generate"
          />
          <SidebarLink
            imageSrc="/images/sub.png"
            label="My Subscription"
            href="/subscription"
          />

          <SidebarLink
            label="Profile"
            imageSrc="/images/pro.png"
            onClick={() => setShowProfileModal(true)}
          />
          <SidebarLink
            imageSrc="/images/set.png"
            label="Settings"
            href="/pages"
          />
          <hr className="text-[#E2E2E2] mt-3 mb-4" />
          <SidebarLink
            imageSrc="/images/hel.png"
            label="Help Centre"
            href="/pages"
          />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4">
        <SidebarLink imageSrc="/images/log.png" label="Logout" href="/auth" />
      </div>
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

const SidebarLink = ({
  imageSrc,
  label,
  href,
  onClick,
}: {
  imageSrc: string;
  label: string;
  href?: string;
  onClick?: () => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = href ? pathname === href : false;

  const handleClick = () => {
    if (href) router.push(href);
    else if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition ${
        isActive
          ? "bg-[#23BAD8] text-white font-semibold"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Image src={imageSrc} alt={label} width={20} height={20} />
      <span className="font-medium">{label}</span>
    </div>
  );
};

export default Sidebar;

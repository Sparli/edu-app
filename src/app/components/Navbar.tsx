"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageToggle, setLanguageToggle] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false); // NEW
  const router = useRouter();

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden lg:flex mt-1 w-full items-center justify-between px-6 py-4 bg-white ">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={300}
            height={300}
            className="mt-2"
          />
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">English</span>
            <ToggleSwitch
              enabled={languageToggle}
              setEnabled={setLanguageToggle}
            />
          </div>

          {/* Profile Click */}
          <div
            className="flex items-center space-x-2 cursor-pointer mr-4"
            onClick={() => setShowProfileModal(true)}
          >
            <Image
              src="/images/image.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-center">
              <h4 className="text-gray-800 font-semibold">Alex Broad</h4>
              <p className="text-gray-500 text-sm">Web Developer</p>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Mobile Navbar */}
      <header className="md:hidden w-[390px] mx-auto mt-2 flex items-center justify-between px-6 py-5 bg-[#DAE9FF] rounded-4xl">
        <div className="flex items-center space-x-2">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={150}
            height={150}
            className=""
          />
        </div>
        <button onClick={() => setMenuOpen(true)}>
          <Image
            src="/images/ham.svg"
            alt="Menu"
            width={30}
            height={30}
            className=""
          />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-2/3 h-full bg-white shadow-xl z-50 p-6 space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 ">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={150}
                height={150}
              />
            </div>
            <button onClick={() => setMenuOpen(false)}>
              <FaTimes className="text-2xl text-gray-600" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="space-y-6 text-gray-700 mt-16">
            <NavItem
              src="/images/dash.png"
              label="Dashboard"
              href="/dashboard"
              onClick={() => {
                router.push("/dashboard"); // or your actual route
                setMenuOpen(false);
              }}
            />
            <NavItem
              src="/images/gene.png"
              label="Generate Content"
              href="/generate"
              onClick={() => {
                router.push("/generate");
                setMenuOpen(false);
              }}
            />
            <NavItem
              src="/images/sub.png"
              label="My Subscription"
              href="/subscription"
              onClick={() => {
                router.push("/subscription");
                setMenuOpen(false);
              }}
            />

            <NavItem
              src="/images/pro.png"
              label="Profile"
              href="/profile"
              onClick={() => {
                setShowProfileModal(true);
                setMenuOpen(false); // close menu after opening modal
              }}
            />

            <NavItem
              src="/images/set.png"
              label="Settings"
              href="/settings"
              onClick={() => {
                router.push("/settings");
                setMenuOpen(false);
              }}
            />
            <hr className="text-[#E2E2E2]" />
            <NavItem
              src="/images/hel.png"
              label="Help Centre"
              href="/help"
              onClick={() => {
                router.push("/help");
                setMenuOpen(false);
              }}
            />
            <ToggleItem
              src="/images/lang.png"
              label="English"
              enabled={languageToggle}
              setEnabled={setLanguageToggle}
              className="ml-3"
            />
          </nav>
          <div className="mt-48 space-x-8">
            <NavItem
              src="/images/log.png"
              label="Logout"
              href="/auth"
              onClick={() => {
                router.push("/auth");
                setMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

// NavItem with image
const NavItem = ({
  src,
  label,
  href,
  onClick,
}: {
  src: string;
  label: string;
  href: string;
  onClick?: () => void;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  // Automatically switch to white icon version if active
  const iconSrc = isActive
    ? src.replace(".png", "-wh.svg") // assumes white icons are named like dash-white.png
    : src;

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition ${
        isActive
          ? "bg-[#23BAD8] text-white font-semibold"
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      <Image src={iconSrc} alt={label} width={20} height={20} />
      <span>{label}</span>
    </div>
  );
};

const ToggleItem = ({
  src,
  label,
  enabled,
  setEnabled,
  className = "",
}: {
  src: string;

  label: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  className?: string;
}) => (
  <div className={`flex items-center justify-between ${className}`}>
    <span className="flex items-center space-x-2">
      <Image src={src} alt={label} width={20} height={20} />
      <span>{label}</span>
    </span>
    <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
  </div>
);

// Switch component
const ToggleSwitch = ({
  enabled,
  setEnabled,
}: {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
      enabled ? "bg-[#23BAD8]" : "bg-gray-300"
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
        enabled ? "translate-x-6" : "translate-x-0"
      }`}
    />
  </button>
);

export default Navbar;

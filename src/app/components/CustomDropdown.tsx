// components/CustomDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  label?: string;
  className?: string;
}

export default function CustomDropdown({
  options,
  selected,
  onSelect,
  className = "",
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative p-1 border-1 border-gray-300 rounded-lg bg-[#ffffff] ${className}`}
      ref={menuRef}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3.5 text-lg rounded-lg cursor-pointer flex justify-between items-center"
      >
        <span
          className={`${
            !options.includes(selected) ? "text-black" : "text-black"
          }`}
        >
          {selected || options[0]}
        </span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 left-0 lg:bottom-18 bg-white border border-gray-300 rounded shadow z-50">
          {options.map((opt, index) => (
            <div
              key={opt}
              onClick={() => {
                if (index !== 0) {
                  // prevent selecting placeholder
                  onSelect(opt);
                  setIsOpen(false);
                }
              }}
              className={`px-4 py-2 ${
                index === 0
                  ? "text-gray-400 cursor-default"
                  : "hover:bg-gray-100 cursor-pointer"
              } ${
                selected === opt && index !== 0
                  ? "text-cyan-600 font-semibold"
                  : ""
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

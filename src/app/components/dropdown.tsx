// components/CustomDropdown.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface CustomDropdownProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;

  className?: string;
}

export default function Dropdown({
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
      className={`relative p-2 shadow-md rounded-lg bg-[#F6F6F6] ${className}`}
      ref={menuRef}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className=" text-lg rounded-lg cursor-pointer flex justify-between items-center"
      >
        <span>{selected}</span>
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
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute w-full mt-1 left-0 bg-white border border-gray-300 rounded shadow z-50">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setIsOpen(false);
              }}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                selected === opt ? "text-cyan-600 font-semibold" : ""
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

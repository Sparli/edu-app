"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface OptionType {
  label: string | ReactNode;
  value: string;
}

type Option = string | OptionType;

interface CustomDropdownProps {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
  label?: string;
  className?: string;
  error?: string;
}

export default function LabalDropdown({
  options,
  selected,
  onSelect,
  label,
  className = "",
  error,
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

  const getOptionValue = (opt: Option): string =>
    typeof opt === "string" ? opt : opt.value;

  const getOptionLabel = (opt: Option): string | ReactNode =>
    typeof opt === "string" ? opt : opt.label;

  return (
    <div
      className={`relative p-2 border-1 rounded-lg bg-white ${className} ${
        error ? "border-red-400 ring-1 ring-red-400" : "border-[#d1d9e7]"
      }`}
      ref={menuRef}
    >
      {label && (
        <label className="block text-lg font-medium text-cyan-500 mb-1">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 text-lg rounded-lg cursor-pointer flex justify-between items-center"
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
        <div className="absolute w-full mt-1 left-0 bg-white border border-gray-300 rounded z-50">
          {options.map((opt) => {
            const value = getOptionValue(opt);
            const labelNode = getOptionLabel(opt);
            return (
              <div
                key={value}
                onClick={() => {
                  onSelect(value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  selected === value ? "text-cyan-600 font-semibold" : ""
                }`}
              >
                {labelNode}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
    </div>
  );
}

"use client";

import { useState } from "react";

const settingsData = [
  {
    title: "Update Notifications",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    title: "Preview Effects",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    title: "Milestone Notifications",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    title: "Monthly Insights",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
];

export default function Settings() {
  const [toggles, setToggles] = useState(
    settingsData.map(() => true) // all toggles initially ON
  );

  const toggleSetting = (index: number) => {
    const updated = [...toggles];
    updated[index] = !updated[index];
    setToggles(updated);
  };

  return (
    <div className="p-6 md:p-12 bg-white">
      <h1 className="text-2xl md:text-4xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500 text-lg mb-10">
        How can we help you? Choose the kind of help you need.
      </p>

      <div className="space-y-8">
        {settingsData.map((setting, index) => (
          <div key={index} className="flex justify-between gap-4 pb-6">
            <div>
              <h2 className="text-2xl  text-gray-800">{setting.title}</h2>
              <p className="text-gray-500 mt-1 hidden lg:flex text-sm md:text-base">
                {setting.description}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => toggleSetting(index)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                toggles[index] ? "bg-cyan-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  toggles[index] ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

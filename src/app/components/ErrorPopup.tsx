"use client";

import { useEffect } from "react";

interface Props {
  message: string;
  onClose: () => void;
}

export default function ErrorPopup({ message, onClose }: Props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4s
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-md">
        <p className="font-medium text-sm">{message}</p>
      </div>
    </div>
  );
}
